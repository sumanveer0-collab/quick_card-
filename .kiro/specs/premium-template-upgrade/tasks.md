# Implementation Plan: Premium Template Upgrade

## Overview

Expand the template seed to 20 full-HTML templates, upgrade `TemplateCard` to render iframe previews with a front/back hover toggle, add `corporate` to the category filter, and extend the editor with a gradient picker, template duplication, and a print quality toggle. Property-based tests cover the core pure functions.

## Tasks

- [x] 1. Expand backend template seed to 20 full-HTML templates
  - [x] 1.1 Update seed guard and add 15 new template HTML definitions in `src/modules/template/template.service.ts`
    - Change the `withHtml >= 5` guard to `withHtml >= 20`
    - Add `TEMPLATES_HTML` entries for the 15 remaining templates across four style groups: Minimal Clean ×3 more, Gradient Modern ×4, Dark Premium ×4, Corporate Professional ×4, Creative Designer ×3 more
    - Each entry needs `frontHTML` and `backHTML` strings using `{{placeholder}}` tokens
    - Each front face must include: 16–24 px padding, rounded corners 12–16 px, drop shadow, `{{name}}` (font-weight ≥ 700), `{{businessName}}` at larger size, `{{phone}}`, `{{email}}`, `{{address}}`, `{{website}}`, `{{tagline}}`, SVG/Unicode icon per contact field, `word-break: break-word` on address, address font-size 10–12 px
    - Each back face must include: `{{phone}}`, `{{email}}`, `{{address}}` (word-break), `{{website}}`, `{{businessName}}` heading, 48 × 48 px QR placeholder that shows `<img>` when `{{qrCodeUrl}}` is non-empty and a bordered box when empty
    - Replace the 15 existing layoutConfig-only seed entries with full-HTML versions; assign `TemplateCategory.CORPORATE` to the four Corporate Professional templates
    - Update the seed log message to reflect 20 templates
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1–2.10, 3.1–3.5_

  - [x] 1.2 Checkpoint — verify seed compiles and all 20 templates have non-null `frontHTML`/`backHTML`
    - Ensure all tests pass, ask the user if questions arise.

- [x] 2. Upgrade `TemplateCard` to iframe preview with front/back hover toggle
  - [x] 2.1 Extend the `Template` interface and add iframe rendering in `frontend/components/TemplateCard.tsx`
    - Add optional fields to the `Template` interface: `frontHTML?: string`, `backHTML?: string`, `frontCSS?: string`, `backCSS?: string`
    - Import `buildFaceHtml` logic (or inline equivalent) to produce a full HTML document string from `frontHTML`/`frontCSS` and `backHTML`/`backCSS`; reuse the `FaceIframe` write-to-`contentDocument` pattern from `CardRenderer`
    - When `template.frontHTML` is present, replace the existing layoutConfig JSX preview with a sandboxed `<iframe sandbox="allow-same-origin">` scaled to fill the 1.75:1 preview area
    - When `template.frontHTML` is absent, keep the existing layoutConfig-based JSX fallback unchanged
    - _Requirements: 4.1, 4.2, 4.3, 4.5_

  - [x] 2.2 Add front/back hover toggle overlay
    - Add `showBack` boolean state (default `false`) alongside the existing `hovered` state
    - When `hovered` is true and `template.backHTML` is present, render a pill overlay with "Front" and "Back" toggle buttons; clicking a button sets `showBack` and swaps the iframe `srcDoc` between the front and back HTML documents
    - Keep the existing "Preview" button in the overlay
    - _Requirements: 4.4_

  - [ ]* 2.3 Write property test for template duplication preserves HTML fields
    - **Property 5: Template duplication preserves HTML content**
    - **Validates: Requirements 6.2**

  - [ ]* 2.4 Write property test for template duplication bakes overrides
    - **Property 6: Template duplication bakes in current style overrides**
    - **Validates: Requirements 6.3**

- [x] 3. Add `corporate` category filter to the templates page
  - [x] 3.1 Update `CATEGORIES` array and remove unused imports in `frontend/app/templates/page.tsx`
    - Add `'corporate'` to the `CATEGORIES` array after `'creative'`
    - Remove unused imports: `useCallback`, `SlidersHorizontal`, `Sparkles`, `Crown`, `List`
    - Remove unused `searchParams` variable
    - _Requirements: 8.1, 8.3_

- [x] 4. Add `GradientPicker` sub-component to the editor Style Tab
  - [x] 4.1 Implement the `GradientPicker` component inside `frontend/app/editor/page.tsx`
    - Define a `GradientPicker` component with props `{ value: string; onChange: (css: string) => void }`
    - Internal state: `color1: string` (default `#667eea`), `color2: string` (default `#764ba2`), `angle: number` (default `135`)
    - Render two `<input type="color">` pickers side by side for color stop 1 and color stop 2
    - Render an `<input type="range" min="0" max="360">` angle slider with a numeric readout
    - Render a live preview swatch `<div>` whose `background` style is `linear-gradient(${angle}deg, ${color1}, ${color2})`
    - Render an "Apply Gradient" button that calls `onChange` with the generated gradient string
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.2 Wire `GradientPicker` into the Style Tab
    - Place `<GradientPicker>` below the existing solid-color picker and preset swatches in the Style Tab section
    - Pass `value={customLayout.background || ''}` and `onChange={v => handleStyleChange('background', v)}`
    - Confirm `CardRenderer` already passes `layout.background` as the CSS `background` property (no change needed there)
    - _Requirements: 5.4, 5.5, 5.6_

  - [ ]* 4.3 Write property test for gradient picker output format
    - **Property 4: Gradient picker output is a valid CSS linear-gradient**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 5. Add template duplication to the editor toolbar
  - [x] 5.1 Implement `handleDuplicate` and session template state in `frontend/app/editor/page.tsx`
    - Add `sessionTemplates` state: `useState<TemplateData[]>([])`
    - Implement `handleDuplicate()`:
      - Guard with `if (!template) return`
      - Create `copy: TemplateData` spreading `template`, setting `_id: \`local_${Date.now()}\``, `name: \`${template.name} (Copy)\``, and `layoutConfig: { ...customLayout }` to bake in current overrides
      - Call `setSessionTemplates(prev => [...prev, copy])`, `setTemplate(copy)`, `setCustomLayout({ ...copy.layoutConfig })`
      - Show `toast.success(\`"${copy.name}" created\`)`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 5.2 Add "Duplicate" button to the editor toolbar
    - Import `Copy` from `lucide-react` (already imported as `Copy` for the copy-link button — use the same import)
    - Add a "Duplicate" button in the top bar next to "Change Template", using the `Copy` icon
    - Button calls `handleDuplicate()` and is disabled when `!template`
    - _Requirements: 6.1_

- [x] 6. Add print quality toggle to the editor export pipeline
  - [x] 6.1 Add `printQuality` state and update `downloadPng` in `frontend/app/editor/page.tsx`
    - Add `const [printQuality, setPrintQuality] = useState(false)`
    - In `downloadPng`: use `const pixelRatio = printQuality ? 4 : 3` instead of the hardcoded `pixelRatio: 3`
    - _Requirements: 7.1, 7.6_

  - [x] 6.2 Update `downloadPdf` with bleed and crop marks
    - In `downloadPdf`: set `const pageW = printQuality ? 3.75 : 3.5` and `const pageH = printQuality ? 2.25 : 2.0`
    - Pass `format: [pageW, pageH]` to `new jsPDF(...)`
    - Set `const offsetX = printQuality ? 0.125 : 0` and `const offsetY = printQuality ? 0.125 : 0`
    - Call `pdf.addImage(url, 'PNG', offsetX, offsetY, 3.5, 2)`
    - When `printQuality` is true, draw crop marks at the four card-boundary corners using `pdf.setDrawColor` and `pdf.line` (four short L-shaped lines at each corner of the 3.5 × 2 in card area offset by 0.125 in)
    - _Requirements: 7.2, 7.3, 7.4_

  - [x] 6.3 Add "Print Quality" toggle UI to the toolbar
    - Add a toggle switch (checkbox or styled button) labeled "Print Quality" in the download section of the top bar
    - Toggle sets `printQuality` state; visually indicate on/off state
    - _Requirements: 7.5, 7.6_

- [x] 7. Checkpoint — verify editor features compile and behave correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Write property-based tests for template engine and editor pure functions
  - [ ]* 8.1 Set up fast-check test file at `frontend/lib/__tests__/template-engine.test.ts`
    - Install `fast-check` as a dev dependency if not already present (`npm install --save-dev fast-check` in `frontend/`)
    - Create the test file with the Jest/Vitest test runner already used by the project
    - Import `replacePlaceholders` from `@/lib/template-engine`

  - [ ]* 8.2 Write property test for `replacePlaceholders` idempotence (Property 2)
    - **Property 2: Placeholder replacement is idempotent**
    - Generate random `CardData` objects whose field values contain no `{{word}}`-shaped substrings
    - Generate random HTML strings composed of known `{{key}}` tokens interspersed with arbitrary text
    - Assert `replacePlaceholders(replacePlaceholders(html, data), data) === replacePlaceholders(html, data)`
    - **Validates: Requirements 9.4**

  - [ ]* 8.3 Write property test for no raw tokens surviving replacement (Property 3)
    - **Property 3: No raw placeholder tokens survive replacement**
    - Generate HTML strings containing only known placeholder tokens (`{{name}}`, `{{businessName}}`, `{{phone}}`, `{{email}}`, `{{address}}`, `{{website}}`, `{{tagline}}`, `{{logoUrl}}`, `{{qrCodeUrl}}`) interspersed with arbitrary text
    - Assert the result contains no `/\{\{\w+\}\}/` matches
    - **Validates: Requirements 9.1, 9.2**

  - [ ]* 8.4 Write property test for XSS safety (Property 7)
    - **Property 7: XSS safety — all substituted values are HTML-escaped**
    - Generate `CardData` field values containing `<`, `>`, `&`, `"`, `'`
    - Assert none of these characters appear unescaped in the output of `replacePlaceholders`
    - **Validates: Requirements 9.3**

  - [ ]* 8.5 Write property tests for gradient picker output, duplication preserves HTML, and duplication bakes overrides (Properties 4, 5, 6)
    - **Property 4**: Extract the gradient string builder `(angle, color1, color2) => \`linear-gradient(${angle}deg, ${color1}, ${color2})\`` as a pure function; generate random hex colors and angles in [0, 360]; assert output matches the pattern and is non-empty — **Validates: Requirements 5.1, 5.2, 5.3**
    - **Property 5**: Generate random template objects with non-empty `frontHTML`, `backHTML`, `frontCSS`, `backCSS`; simulate duplication; assert the copy's HTML fields are strictly equal to the originals — **Validates: Requirements 6.2**
    - **Property 6**: Generate random `layoutConfig` and `customLayout` objects; simulate duplication; assert the copy's `layoutConfig` equals `{ ...layoutConfig, ...customLayout }` — **Validates: Requirements 6.3**

- [x] 9. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties defined in the design document
- Unit tests validate specific examples and edge cases
- The `Copy` icon from `lucide-react` is already imported in `editor/page.tsx` — no new import needed for the Duplicate button
- `fast-check` must be installed in the `frontend/` package, not the root
