# AI Validity, Accuracy & Limitations Guidelines

## 1. Confidence Thresholds
To ensure farmers are not given damaging or incorrect advice, CropWatch strictly enforces the following confidence logic before displaying results:

- **High Confidence (>85%):** Directly display the identified disease, severity, and treatments.
- **Medium Confidence (60% - 85%):** Display the disease but show a warning label: "AI is fairly certain, but please verify symptoms carefully."
- **Low Confidence (<60% or AI hallucinates):** Reject the diagnosis. Default to: "Sorry, we could not clearly identify the issue from this photo. Please take a clearer picture or contact an extension officer."

## 2. Guardrails Against Hallucination
- The AI must **only** recommend treatments that contain localized remedies (e.g., neem oil, wood ash, crop rotation) mapped exactly to the `TABLE.md` context. 
- If the AI recommends synthetic chemicals not generally accessible in rural Nigeria, the Antigravity orchestration layer must flag the response for review and fallback to organic recommendations.

## 3. Physical & Environmental Limitations
- **Visual Mimicry:** Fungal and bacterial spots often look identical. The `description` text is critical for disambiguation. If the user does not provide text on a tricky visual case, the prompt defaults to dropping the confidence score.
- **Lighting Bias:** Images taken in direct harsh sunlight or deep shadow can distort yellowing (chlorosis) into looking like healthy bright green or necrosis. The UI should prompt users to take photos under shade or overcast light if possible.

## 4. Scope Limitations
- For the MVP, CropWatch is strictly limited to the 8 defined crops (Tomato, Cassava, Maize, Yam, Rice, Cowpea, Pepper, Cocoa). If an image of a non-listed crop is passed, the request must fail gracefully at the API layer.
