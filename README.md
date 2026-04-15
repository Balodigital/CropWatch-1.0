# CropWatch

CropWatch is an AI-powered mobile application that enables smallholder farmers in Nigeria and West Africa to identify crop diseases and nutrient deficiencies using leaf photos and simple text descriptions.

By addressing the challenge of late disease detection and bridging the "40 km gap" to agricultural extension officers, CropWatch helps farmers act early, reduce crop losses, and improve yields with locally available, affordable treatments.

## Key Features

- **Language Support:** Full accessibility in both English and Nigerian Pidgin.
- **AI-Powered Diagnosis:** Uses photo and symptom descriptions to predict conditions with a confidence score.
- **Localized Treatments:** Prioritizes affordable remedies like neem oil and wood ash before commercial agro-chemicals.
- **Offline Capacity:** Sync-when-Online ensures you can capture photos in the farm and process them once internet is available.
- **Diagnosis History:** Keep track of farm health history to implement season-to-season prevention tips.

## Tech Stack Overview

- **Frontend Application:** React Native (optimized for low-end Android devices)
- **Backend & API:** Node.js with Express
- **Database & Storage:** Supabase (PostgreSQL & Storage) for Auth, User Data, and Image Hosting
- **AI Engine:** DeepSeek API for NLP & Contextual Diagnosis
- **Agricultural Database:** Based on IITA and FAO verified data

## Project Structure

Refer to our detailed documentation located in the `/docs` folder for deeper insights into how the project is built:
- [Product Requirements (PRD)](./docs/PRODUCT_REQUIREMENTS.md)
- [Architecture Guidelines](./docs/ARCHITECTURE.md)
- [Design System](./docs/DESIGN_SYSTEM.md)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Expo CLI (if using Expo for React Native)
- Supabase account (for local state dev)

*(Further setup instructions will be detailed as the repository is initialized).*

## Contributing

We welcome contributions particularly for Pidgin translation enhancements, local remedy documentation, and React Native component optimizations. 

See our [Contributing Guidelines](./CONTRIBUTING.md) for more details.

## License

*(License TBD)*
