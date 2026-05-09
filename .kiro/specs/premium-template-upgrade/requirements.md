# Requirements Document

## Introduction

QuickCard is a SaaS business card creation platform built on NestJS (backend) and Next.js (frontend). Currently, 5 of 20 templates have full HTML/CSS definitions while the remaining 15 rely on a layoutConfig-only fallback renderer. This feature upgrades all 20 templates to modern, premium, print-ready designs with full front and back HTML/CSS, improves the template preview experience, adds gradient picker and template duplication to the editor, and enhances the print export pipeline with bleed marks and 300 DPI settings.

## Glossary

- **Template**: A MongoDB document containing `frontHTML`, `backHTML`, `frontCSS`, `backCSS`, `layoutConfig`, and metadata fields that define a business card design.
- **TemplateService**: The NestJS service (`src/modules/template/template.service.ts`) responsible for seeding and querying templates.
- **CardRenderer**: The React component (`frontend/components/CardRenderer.tsx`) that renders a template's front and back faces inside iframes with flip animation.
- **TemplateCard**: The React component (`frontend/components/TemplateCard.tsx`) that displays a template thumbnail in the selection grid.
- **Template_Engine**: The utility module (`frontend/lib/template-engine.ts`) containing `replacePlaceholders()` and `buildCardDocument()`.
- **Editor**: The Next.js page (`frontend/app/editor/page.tsx`) providing live card editing, style customization, and download functionality.
- **Templates_Page**: The Next.js page (`frontend/app/templates/page.tsx`) providing template browsing, search, category filter, and selection.
- **Placeholder**: A `{{key}}` token inside HTML strings that the Template_Engine replaces with user-supplied card data at render time.
- **layoutConfig**: A JSON object on each Template document storing design tokens (background, primaryColor, secondaryColor, fontFamily, accent) used by the fallback renderer and style overrides.
- **FaceIframe**: The inner component of CardRenderer that writes HTML into a sandboxed iframe for isolated rendering.
- **Bleed_Area**: A 0.125-inch margin added around the 3.5 × 2 inch card boundary for print-safe export.
- **Print_Export**: The client-side pipeline using `html-to-image` and `jsPDF` to produce PNG and PDF downloads.
- **Gradient_Picker**: A UI control in the Editor that lets users define CSS linear-gradient values for the card background.
- **Template_Duplication**: An Editor action that creates a copy of the current template's HTML/CSS/layoutConfig as a user-owned variant.
- **QR_Placeholder**: A fixed-size box in the back-face HTML that renders a QR code image when `{{qrCodeUrl}}` is populated, or shows a placeholder outline when empty.
- **Style_Tab**: The "Style" panel in the Editor containing background color, text color, accent color, font selector, and (new) gradient picker controls.
- **Category**: One of the enumerated values on the Template schema: `minimal`, `professional`, `creative`, `food`, `beauty`, `fitness`, `local`, `corporate`.

---

## Requirements

### Requirement 1: Full HTML/CSS for All 20 Templates

**User Story:** As a QuickCard user, I want every template to display a rich, visually distinct design, so that I can choose a card that truly represents my brand.

#### Acceptance Criteria

1. THE TemplateService SHALL provide `frontHTML` and `backHTML` for all 20 templates in `seedDefaultTemplates()`.
2. THE TemplateService SHALL provide `frontCSS` and `backCSS` (may be empty string) for all 20 templates.
3. WHEN `seedDefaultTemplates()` runs, THE TemplateService SHALL seed exactly 20 templates covering the five style groups: Minimal Clean (4), Gradient Modern (4), Dark Premium (4), Corporate Professional (4), and Creative Designer (4).
4. WHEN a template is seeded, THE TemplateService SHALL assign each template to one of the existing `TemplateCategory` enum values that best matches its style group.
5. THE TemplateService SHALL NOT seed any template with a `null` or missing `frontHTML` field.

---

### Requirement 2: Design Standards for All Templates

**User Story:** As a QuickCard user, I want all templates to follow consistent, professional design rules, so that every card looks polished and print-ready.

#### Acceptance Criteria

1. THE Template SHALL apply padding of 16–24 px on all sides of the card face container.
2. THE Template SHALL apply rounded corners of 12–16 px to the outermost card container.
3. THE Template SHALL apply a soft drop shadow to the outermost card container.
4. THE Template SHALL render `{{name}}` in a visually prominent position with font-weight ≥ 700.
5. THE Template SHALL render `{{businessName}}` at a larger font size than `{{name}}`.
6. THE Template SHALL render `{{phone}}`, `{{email}}`, `{{address}}`, and `{{website}}` in the contact details section of the front face.
7. THE Template SHALL include an SVG or Unicode icon preceding each contact detail field (phone, email, address, website).
8. THE Template SHALL render `{{address}}` with `white-space: normal` and `word-break: break-word` so that long addresses wrap rather than overflow.
9. THE Template SHALL render `{{address}}` at a font size of 10–12 px to accommodate multi-line display within the card bounds.
10. THE Template SHALL include a `{{tagline}}` placeholder in the front face for the job role or tagline.

---

### Requirement 3: Back Face Design Standards

**User Story:** As a QuickCard user, I want the back of my card to display all contact details clearly, so that recipients can reach me without flipping the card back to the front.

#### Acceptance Criteria

1. THE Template back face SHALL render `{{phone}}`, `{{email}}`, `{{address}}`, and `{{website}}` as visible, non-truncated text.
2. THE Template back face SHALL include a QR_Placeholder region sized 48 × 48 px that renders `{{qrCodeUrl}}` as an `<img>` when the value is non-empty.
3. WHEN `{{qrCodeUrl}}` is empty, THE Template back face SHALL render a bordered placeholder box in place of the QR image.
4. THE Template back face SHALL render `{{address}}` with `white-space: normal` and `word-break: break-word`.
5. THE Template back face SHALL render `{{businessName}}` as a prominent heading.

---

### Requirement 4: TemplateCard HTML Preview

**User Story:** As a QuickCard user browsing templates, I want the template thumbnail to show the actual card design, so that I can accurately judge how my card will look before selecting it.

#### Acceptance Criteria

1. WHEN a Template has a non-null `frontHTML` field, THE TemplateCard SHALL render the front face using an iframe (via FaceIframe or equivalent) instead of the layoutConfig-based fallback.
2. WHEN a Template has a null `frontHTML` field, THE TemplateCard SHALL fall back to the existing layoutConfig-based thumbnail rendering.
3. THE TemplateCard iframe preview SHALL be sandboxed with `sandbox="allow-same-origin"` to prevent script execution.
4. WHEN the user hovers over a TemplateCard that has `backHTML`, THE TemplateCard SHALL display a Front/Back toggle allowing the user to preview both faces.
5. THE TemplateCard SHALL maintain its existing aspect ratio of 1.75 : 1 for the preview area.

---

### Requirement 5: Gradient Picker in Editor Style Tab

**User Story:** As a QuickCard user, I want to apply gradient backgrounds to my card directly from the editor, so that I can create visually rich designs without knowing CSS syntax.

#### Acceptance Criteria

1. THE Style_Tab SHALL include a Gradient_Picker control that generates a CSS `linear-gradient()` value.
2. THE Gradient_Picker SHALL allow the user to select at least two color stops.
3. THE Gradient_Picker SHALL allow the user to select the gradient angle in degrees (0–360).
4. WHEN the user confirms a gradient, THE Editor SHALL update `layoutConfig.background` with the generated `linear-gradient(...)` string.
5. WHEN `layoutConfig.background` contains a `linear-gradient` value, THE CardRenderer SHALL apply it as the CSS `background` property of the card container.
6. THE Style_Tab SHALL retain the existing solid-color picker and preset swatches alongside the Gradient_Picker.

---

### Requirement 6: Template Duplication

**User Story:** As a QuickCard user, I want to duplicate a template in the editor, so that I can create a personalized variant without losing the original design.

#### Acceptance Criteria

1. THE Editor SHALL provide a "Duplicate Template" action accessible from the editor toolbar or style panel.
2. WHEN the user triggers duplication, THE Editor SHALL create a new in-session template object copying `frontHTML`, `backHTML`, `frontCSS`, `backCSS`, and `layoutConfig` from the current template.
3. WHEN the user triggers duplication, THE Editor SHALL apply the current `customLayout` overrides into the duplicated template's `layoutConfig`.
4. WHEN duplication is complete, THE Editor SHALL switch the active template to the duplicated copy and display a confirmation message.
5. THE duplicated template SHALL be available for the current editing session without requiring a backend API call.

---

### Requirement 7: Print-Ready Export

**User Story:** As a QuickCard user, I want to download a print-ready file of my card, so that I can send it to a professional printer without additional adjustments.

#### Acceptance Criteria

1. WHEN the user downloads a PNG, THE Print_Export SHALL render the card at a pixel ratio equivalent to 300 DPI for a 3.5 × 2 inch card (i.e., 1050 × 600 px minimum).
2. WHEN the user downloads a PDF, THE Print_Export SHALL set the PDF page size to exactly 3.5 × 2 inches.
3. THE Print_Export SHALL include a bleed area of 0.125 inches on all sides, making the total exported canvas 3.75 × 2.25 inches when bleed is enabled.
4. WHEN bleed is included, THE Print_Export SHALL render bleed marks (crop marks) at the four corners of the card boundary.
5. THE Editor SHALL provide a "Print Quality" toggle that enables or disables the Bleed_Area and crop marks in the export.
6. WHEN the "Print Quality" toggle is off, THE Print_Export SHALL export at the standard card size (3.5 × 2 inches) without bleed marks, preserving the existing download behavior.

---

### Requirement 8: Category Filter Alignment

**User Story:** As a QuickCard user browsing templates, I want the category filter to reflect the actual template categories in the database, so that filtering produces accurate results.

#### Acceptance Criteria

1. THE Templates_Page SHALL display category filter pills for all categories present in the seeded template set.
2. WHEN the user selects a category pill, THE Templates_Page SHALL display only templates whose `category` field matches the selected value.
3. THE Templates_Page SHALL include filter pills for at minimum: `all`, `minimal`, `professional`, `creative`, `corporate`.
4. WHEN no templates match the active category and search query, THE Templates_Page SHALL display an empty-state message and a "Clear filters" action.

---

### Requirement 9: Placeholder Completeness

**User Story:** As a QuickCard developer, I want the Template_Engine to handle all placeholders used in the new templates, so that no raw `{{key}}` tokens appear in rendered cards.

#### Acceptance Criteria

1. THE Template_Engine `replacePlaceholders()` function SHALL replace `{{name}}`, `{{businessName}}`, `{{phone}}`, `{{email}}`, `{{address}}`, `{{website}}`, `{{tagline}}`, `{{logoUrl}}`, and `{{qrCodeUrl}}` with their corresponding `CardData` values.
2. WHEN a `CardData` field is undefined or empty, THE Template_Engine SHALL replace the corresponding placeholder with an empty string.
3. THE Template_Engine SHALL HTML-escape all substituted values to prevent XSS injection.
4. FOR ALL valid `CardData` objects, applying `replacePlaceholders()` twice SHALL produce the same result as applying it once (idempotence), provided the data contains no `{{key}}`-shaped strings.
