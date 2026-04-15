# CropWatch Design System

This design system is automatically governed by our `design-tokens.tokens.json`.

## 1. Typography (Inter)

All fonts utilize the `Inter` font family. DO NOT use browser defaults or generic fonts.

### Display
- **Display Large**: 57px | Line Height: 64px | Weight: 500 (Medium)
- **Display Medium**: 48px | Line Height: 52px | Weight: 500 (Medium)
- **Display Small**: 36px | Line Height: 44px | Weight: 500 (Medium)

### Headline
- **Headline Large**: 32px | Line Height: 40px | Weight: 600 (SemiBold)
- **Headline Medium**: 28px | Line Height: 36px | Weight: 600 (SemiBold)
- **Headline Small**: 24px | Line Height: 32px | Weight: 500 (Medium)

### Title
- **Title Large**: 22px | Line Height: 28px | Weight: 600 (SemiBold)
- **Title Medium**: 16px | Line Height: 24px | Weight: 600 (SemiBold)
- **Title Small**: 14px | Line Height: 20px | Weight: 500 (Medium)

### Body (Most UI Content)
- **Body Large**: 16px | Line Height: 24px | Weight: 400 (Regular) | *Primary text for paragraphs*
- **Body Medium**: 14px | Line Height: 20px | Weight: 400 (Regular) | *Default text for most UI descriptions*
- **Body Small**: 12px | Line Height: 16px | Weight: 400 (Regular) | *Dense layouts*

*(Also includes corresponding Body Bold scales, Label scales down to 11px for tiny UI UI controls).*

---

## 2. Color Palette (Primitive Collection)

Our colors are built to feel organic, accessible, and high-contrast for outdoor use under the sun.

### Key Functional Colors
- **Primary Key (Brand):** `#2c6a4f` (Deep Pine Green - Used as the main brand identifier)
- **Secondary Key:** `#72a749` (Lighter Green - Used for secondary CTAs and highlights)
- **Tertiary Key:** `#dfd453` (Yellowish Green - Accent elements)
- **Neutral Key:** `#121212` (Main dark text & dark mode backgrounds)
- **Neutral Variant:** `#474747` (Secondary text, inactive states)

### Status Colors (Crucial for Severity Indicators)
- **Success (Mild / Healthy):** `#4caf50` 
- **Warning (Moderate Severity):** `#e0a800`
- **Error (Severe Severity):** `#aa2222`
- **Accent Key:** `#c05530` 

### Palettes Mapping

The Design tokens provide scale arrays from `0` to `100` for deep theming. Below is an example of the Primary array:
- `primary10`: `#0f241b` (Very Dark)
- `primary50`: `#4bb486` (Mid Green)
- `primary90`: `#dbf0e7` (Light Green Surface)
- `primary100`: `#ffffff` (Pure White)

## 3. General Implementation Rules
1. **Dynamic Interactions:** Implement subtle micro-animations on interactive components (Buttons, Cards, Inputs).
2. **Icons & Accessibility:** Ensure all touch targets for rural farmers are at least 44x44px due tracking issues on smaller screen sizes. Use prominent icon indicators next to text for easy navigation.
3. **Responsive:** Ensure everything flexes gracefully across varied budget Android aspect ratios.
