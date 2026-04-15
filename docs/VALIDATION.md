# Input Validation Rules

This document outlines the strict validation rules that the backend pipeline must apply before calling the DeepSeek AI Engine.

## 1. Image Validation
- **Requirement:** User MUST provide an image (either taken via camera or uploaded from gallery).
- **Format:** `image/jpeg`, `image/png`, `image/webp`.
- **Max File Size:** 5 MB.
- **Base64 Validation:** Ensure the base64 string provided is a valid encoded image payload.

## 2. Description Validation
- **Requirement:** Optional but highly recommended.
- **Data Type:** String.
- **Max Length:** 500 characters.
- **Length enforcement:** Must have a minimum of 5 characters if populated.
- **Sanitization:** Strip HTML tags and execute basic whitespace trimming to prevent prompt injection.

## 3. Crop Type Validation
- **Requirement:** Required (user must select or system must pre-fill).
- **Valid Values (MVP):** `Tomato`, `Cassava`, `Maize`, `Pepper`, `Rice`, `Yam`, `Cowpea`, `Cocoa`.
- **Handling Invalid Values:** If an invalid crop is explicitly passed, the request should fail with HTTP 400.

## 4. Output Constraints (Post-AI Validation)
- The AI must output JSON strictly mapped to limiting to a max of 3 results.
- `confidence` must be a Number between `0` and `100`.
- `severity` must be one of: `"Mild"`, `"Moderate"`, `"Severe"`.
