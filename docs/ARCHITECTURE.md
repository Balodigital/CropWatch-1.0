# Technical Architecture: CropWatch

This document outlines the technical blueprint designed to support rural farmers with varying mobile hardware and data connectivity, as per the MVP Requirements.

## 1. High-Level Flow

1.  **Frontend Input:** The user (farmer) selects a language (English/Pidgin), opens the camera, takes a photo, and adds a short text symptom.
2.  **Queue/Network Check:** The app checks for a network connection. If offline, the data is stored in the local SQLite/AsyncStorage cache ("Sync-when-Online").
3.  **Transmission:** Once online, the photo and text are sent to the Node.js Backend over a REST API.
4.  **AI Engine:** The backend routes the data to the DeepSeek API for NLP parsing and diagnostic evaluation using the Agricultural Knowledge Base.
5.  **Return & Store:** The backend formats a diagnosis (with Severity Level and Confidence Score), pushes it back to the client, and safely logs it into the Supabase database.

## 2. Frontend & Mobile Layer

-   **Framework:** React Native. This ensures a native feel on both Android and iOS while prioritizing a lightweight bundle size to support low-end budget Android devices commonly used by rural users.
-   **State Management:** Redux or Context API. Needed fundamentally for the global Language Toggle so the user instantly sees English or Pidgin translations without a reload.
-   **Local Caching / Offline Engine:** SQLite or local storage hooks. This handles the "40 km gap" offline queue for scanning when in remote fields.
-   **Image Compression:** Essential client-side before transmission. Rural areas will mostly run on 2G/3G speeds; compressed images reduce latency and data costs.

## 3. Backend & API Layer

-   **Runtime/Framework:** Node.js using Express.
-   **Database:** Supabase (PostgreSQL). We utilize it for:
    -   Secure User Profiles / Auth
    -   Diagnosis History Logging
    -   Localized Farm Data library
-   **Storage:** Supabase Storage (or AWS S3) for the hosting of user-uploaded leaf images.

## 4. AI & Data Intelligence

-   **Diagnostic Processing:** DeepSeek API handles the user's natural language symptom descriptions combined with contextual tagging of crop types.
-   **Knowledge Base Architecture:** Pulled from structured, verified agricultural databases mapped for 8 core Nigerian crops (Tomato, Cassava, Maize, Yam, Rice, Cowpea, Pepper, Cocoa). Sourced from IITA/FAO open-access data.

## 5. Security & Privacy

-   **Auth:** Handled securely via Supabase Auth (via phone number/OTP or email).
-   **Encryption:** SSL/TLS is strictly enforced for all data transmitted between the React Native client and the API to maintain location and data privacy.
