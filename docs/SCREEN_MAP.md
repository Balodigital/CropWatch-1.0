# 15 Screens Implementation Map

To fulfill the specific MVP criteria of delivering 15 interconnected screens, we are utilizing Expo Router's folder-based routing structure.

## Authentication / Onboarding (3)
1. **Welcome Screen** (`/app/index.tsx`): Initial launch screen describing value prop.
2. **Language Selection** (`/app/language.tsx`): Giant English/Pidgin toggle.
3. **Permission Wall** (`/app/permissions.tsx`): Ask for Camera and File access.

## Bottom Tab Shell (`/app/(tabs)`)
4. **Home Dashboard** (`/app/(tabs)/index.tsx`): Overview, quick scan button, newest tips.
5. **Crop Library Tab** (`/app/(tabs)/library.tsx`): List out the 8 supported crops natively.
6. **History Tab** (`/app/(tabs)/history.tsx`): Flatlist of previous `scans` table entries.
7. **Settings Tab** (`/app/(tabs)/settings.tsx`): Profile, language change, export logs.

## The Scan Workflow (5)
8. **Camera Capture** (`/app/scan/camera.tsx`): Live camera viewfinder with snap button.
9. **Photo Preview** (`/app/scan/preview.tsx`): Crop or retake picture functionality.
10. **Crop Selection** (`/app/scan/crop-select.tsx`): Select the plant identity (Tomato, etc).
11. **Symptom Input** (`/app/scan/symptoms.tsx`): Text description field.
12. **Analysis Loading State** (`/app/scan/analyzing.tsx`): Lottie animation holding screen while DeepSeek spins.

## Results & Support (3)
13. **Diagnosis Result Overview** (`/app/result/[id].tsx`): Breakdown of top 3 issues with severity gauge.
14. **Treatment Steps View** (`/app/result/treatment.tsx`): Full screen expanding on the local remedy solutions mapped with icons.
15. **Prevention Information** (`/app/result/prevention.tsx`): Post-recovery tips to prevent spread to adjacent crops.
