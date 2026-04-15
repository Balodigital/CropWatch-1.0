# Contributing to CropWatch

Thank you for your interest in helping smallholder farmers identify crop diseases!

There are many ways to contribute to this project. Our primary goal is maintaining accessibility, ensuring our DeepSeek AI prompts are properly validated, and refining the "Sync-when-Online" pipeline.

## 1. Local Setup

*(Instructions for cloning the repo and installing Node.js/Expo/Supabase will be added once initialized)*

## 2. Commit Standards

We utilize conventional commits. Please strictly follow these prefixes:
- `feat:` for new features (e.g. `feat: implement offline token storage`)
- `fix:` for bug fixes
- `docs:` for markdown or documentation changes
- `chore:` for package or config bumps
- `ui:` for design system / frontend adjustments
- `content:` for translation updates or dictionary additions

## 3. Pidgin Translation Contributions

A core MVP feature of CropWatch is the seamless toggle between Standard English and Nigerian Pidgin. When contributing to UI text or error messages:
1. Every new string must have an exact equivalent mapping in the core dictionary/context file.
2. If you are unsure of the correct translation, please query the project maintainers before pushing PRs with unverified Pidgin grammar.

## 4. UI & Design Integrity

Ensure you reference `./docs/DESIGN_SYSTEM.md`. We rely exclusively on the `Inter` font stack and the explicitly coded variable colors (`primaryKey`, `secondaryKey`, `success`, `error`, etc.). Do not introduce new arbitrary hex codes.

## 5. Pull Requests
- Before opening a PR, ensure you have squashed loose commits.
- Ensure all CI/CD pipelines and static checks successfully pass.
- Write a clear description of the impact of the change.

Thank you for improving food security through tech!
