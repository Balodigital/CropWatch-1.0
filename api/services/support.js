// Native fetch is available in Node.js v18+


async function runSupportChat(messages) {
  const systemPrompt = `You are CropScan AI, a helpful and professional agricultural support assistant for Nigerian farmers.
  
  Your goals:
  - Answer farming-related questions concisely.
  - Help interpret diagnosis results (if the user asks).
  - Provide troubleshooting steps for the CropScan app.
  - Guide users through app usage.
  - Suggest solutions for crop issues using locally available, organic, and affordable Nigerian methods.
  
  Constraints:
  - Be conversational but professional.
  - Keep responses short and clear. No long paragraphs.
  - If you cannot help with a technical app issue or a complex problem, suggest that the user "Create a Support Ticket".
  - For cost management: Do not be overly wordy. Focus on the direct answer.`;

  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      console.warn('DeepSeek API key not configured, using fallback support response');
      return { content: "I'm sorry, my AI brain is currently offline. How else can I help you today?" };
    }

    // Limit context to last 6 messages to save tokens
    const recentMessages = messages.slice(-6);

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
          ...recentMessages
        ],
        temperature: 0.5,
        max_tokens: 300 // Manage cost by limiting response length
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API Failed: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage // Log usage for monitoring
    };

  } catch (err) {
    console.error("Support AI Error:", err);
    return { content: "I'm having trouble connecting to my knowledge base. Please try again or create a support ticket if it's urgent." };
  }
}

module.exports = { runSupportChat };
