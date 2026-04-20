const TABLE_CONTEXTS = require('../data/disease-contexts');

async function runDeepSeekAnalysis(base64Image, description, crop) {
  const context = TABLE_CONTEXTS[crop.toLowerCase()] || "No specific crop context found.";

  const systemPrompt = `You are an agricultural expert specializing in Nigerian crops.

Crop: ${crop}

Symptoms from farmer:
${description}

Context constraints:
${context}

Using known crop diseases, identify the top 3 most likely issues.

For each result, return:
- Disease name
- Confidence level (percentage)
- Severity (Mild, Moderate, Severe)
- Treatment (strictly prioritize locally available, affordable, and organic solutions found in Nigeria, such as wood ash, neem oil, or crop rotation. AVOID recommending expensive imported chemicals that a local farmer cannot find or afford).
- Prevention tips (focus on cultural practices like field sanitation and spacing).

Use simple, clear language suitable for a small-scale farmer.
You MUST reply with ONLY a valid JSON object matching this exact shape:
{
  "diagnosis": [
    {
      "name": "string",
      "confidence": number,
      "severity": "Mild" | "Moderate" | "Severe",
      "treatment": "string",
      "prevention": "string"
    }
  ]
}`;

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.warn('DeepSeek API key not configured, using fallback diagnosis');
      return getFallbackDiagnosis(crop, description);
    }

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Please evaluate the symptoms." }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API Failed: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;
    const parsedJson = JSON.parse(rawContent);
    return parsedJson;

  } catch (err) {
    console.error("AI Pipeline Error:", err);
    return getFallbackDiagnosis(crop, description);
  }
}

function validateAndMapConfidence(deepSeekOutput) {
  let diagnoses = deepSeekOutput.diagnosis || [];

  if (diagnoses.length > 3) diagnoses = diagnoses.slice(0, 3);

  return diagnoses.map((d) => {
    let conf = Number(d.confidence) || 0;
    let rank = 'Low';
    if (conf >= 80) rank = 'High';
    else if (conf >= 50) rank = 'Medium';

    let normalizedSeverity = d.severity;
    if (!['Mild', 'Moderate', 'Severe'].includes(normalizedSeverity)) {
      normalizedSeverity = 'Severe';
    }

    return {
      ...d,
      severity: normalizedSeverity,
      confidence_rank: rank,
      reject: conf < 50
    };
  });
}

function getFallbackDiagnosis(crop, description) {
  const fallbackDiagnoses = {
    tomato: [
      {
        name: "Early Blight (Alternaria solani)",
        confidence: 65,
        severity: "Moderate",
        treatment: "Remove and burn affected leaves immediately. Apply a spray of neem oil or a mixture of wood ash and water to the leaves.",
        prevention: "Rotate crops (avoid planting tomatoes where peppers or potatoes grew recently), water at the base of the plant to keep leaves dry."
      },
      {
        name: "Septoria Leaf Spot",
        confidence: 45,
        severity: "Mild",
        treatment: "Apply wood ash or neem oil spray to affected areas.",
        prevention: "Ensure good air circulation, water at base of plant."
      }
    ],
    cassava: [
      {
        name: "Cassava Mosaic Disease (CMD)",
        confidence: 70,
        severity: "Severe",
        treatment: "Rogue (remove and burn) infected plants immediately. Use disease-free planting material.",
        prevention: "Use resistant varieties, plant early in season, control whitefly vectors."
      }
    ],
    maize: [
      {
        name: "Maize Streak Virus",
        confidence: 60,
        severity: "Moderate",
        treatment: "Remove infected plants. No cure available for infected plants.",
        prevention: "Plant early, use resistant varieties, control leafhopper vectors."
      },
      {
        name: "Fall Armyworm Damage",
        confidence: 50,
        severity: "Severe",
        treatment: "Apply neem oil spray or botanical insecticide. Hand-pick worms in severe cases.",
        prevention: "Monitor regularly, plant early, use pheromone traps."
      }
    ],
    default: [
      {
        name: "Fungal Disease",
        confidence: 55,
        severity: "Moderate",
        treatment: "Remove all affected plant parts. Apply a natural spray made from neem leaves or wood ash to prevent further spread.",
        prevention: "Improve spacing for better air flow, avoid watering in the evening, and keep the farm free of weeds."
      }
    ]
  };

  const cropLower = crop.toLowerCase();
  const diagnoses = fallbackDiagnoses[cropLower] || fallbackDiagnoses.default;
  
  return { diagnosis: diagnoses };
}

module.exports = { runDeepSeekAnalysis, validateAndMapConfidence };
