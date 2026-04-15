# Antigravity Workflow Orchestration

This pipeline dictates how the Expo API route (`app/api/diagnose+api.ts`) interacts with the DeepSeek Vision/Chat API to return structured diagnostic matrices.

## Workflow Pipeline Diagram

1. **Client Submission:** React Native UI POSTs `base64Image`, `cropType`, and `description` to the API.
2. **Validation Node:**
   - Checks constraints per `VALIDATION.md` (Crop exists, Image size ok).
3. **Context Construction Node:**
   - Retrieves string template from `TABLE.md` based strictly on `cropType`.
4. **Prompt Generator Node:**
   - Uses the strict DeepSeek user-prompt string:
   ```
   You are an agricultural expert specializing in Nigerian crops.
   Crop: {{cropType}}
   Symptoms: {{description}}
   Context: {{TABLE.md context string...}}

   Using known crop diseases, identify the top 3 most likely issues.
   For each result, return...
   ```
5. **DeepSeek Orchestrator (API Node):**
   - Transmits System Prompt ensuring output is constrained to pure JSON matching standard array.
6. **Integrity Node:**
   - Parses the JSON.
   - Ensures `confidence` > 60% per `VALIDITY.md`.
   - Normalizes severity levels mapping strictly to `<Green | Yellow | Red>` UI elements.
7. **Client Delivery:**
   - Payload is flushed back over HTTPS in < 5 seconds. Front-end triggers `useQuery` resolution.
