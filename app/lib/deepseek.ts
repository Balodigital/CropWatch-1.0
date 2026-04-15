import { TABLE_CONTEXTS } from './validation'; // We will define this next

/**
 * Executes the strict Antigravity deepseek-vision or deepseek-chat pipeline.
 */
export async function runDeepSeekAnalysis(
  base64Image: string, 
  description: string, 
  crop: string
) {
  // Setup the Exact Required Prompt
  const context = TABLE_CONTEXTS[crop.toLowerCase()] || "No specific crop context found.";
  
  // Note: If using DeepSeek Vision model for the image extracting, we pass the image. 
  // If we only use chat, we simulate the vision extraction context. 
  // For MVP, we pass the image to a multimodal capable logic or just the structured text.
  
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
- Treatment (prioritize locally available solutions)
- Prevention tips

Use simple, clear language suitable for farmers.
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
    // API Call to DeepSeek
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // or deepseek-vision if multimodal is strictly available
        messages: [
          { role: "system", content: systemPrompt },
          // We can attach the image string logic here based on DeepSeek Vision specs
          { role: "user", content: "Please evaluate the symptoms." } 
        ],
        temperature: 0.2, // Low temperature for high deterministic accuracy
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API Failed: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content;

    // Parse strictly
    const parsedJson = JSON.parse(rawContent);
    return parsedJson;

  } catch (err) {
    console.error("AI Pipeline Error:", err);
    throw new Error("AI Processing Failed");
  }
}

/**
 * Validates the DeepSeek output strictly enforcing UI requirements
 */
export function validateAndMapConfidence(deepSeekOutput: any) {
  let diagnoses = deepSeekOutput.diagnosis || [];
  
  // Limit to max 3
  if (diagnoses.length > 3) diagnoses = diagnoses.slice(0, 3);
  
  return diagnoses.map((d: any) => {
    let conf = Number(d.confidence) || 0;
    let rank = 'Low';
    if (conf >= 80) rank = 'High';
    else if (conf >= 50) rank = 'Medium';
    
    // Ensure absolute severity
    let normalizedSeverity = d.severity;
    if (!['Mild', 'Moderate', 'Severe'].includes(normalizedSeverity)) {
        normalizedSeverity = 'Severe'; // Default to safe assumption if AI hallucinates
    }

    return {
      ...d,
      severity: normalizedSeverity,
      confidence_rank: rank,
      reject: conf < 50 // If true, the UI drops this card.
    }
  });
}
