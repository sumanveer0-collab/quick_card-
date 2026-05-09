# Design Document: Premium Template Upgrade

## Overview

This feature upgrades QuickCard's template system from a mixed state (5 full HTML templates + 15 layoutConfig-only fallbacks) to a complete set of 20 premium, print-ready templates. It also improves the template browsing UI, adds a gradient picker and template duplication to the editor, and enhances the export pipeline with 300 DPI and bleed support.

### Key Goals

- All 20 templates have `frontHTML` + `backHTML` with consistent design standards
- `TemplateCard` renders actual HTML previews via iframe instead of the layoutConfig fallback
- The editor Style Tab gains a gradient picker (two color stops + angle)
- Template duplication works client-side without a backend round-trip
- PNG export targets 1050 × 600 px (300 DPI equivalent); PDF is exactly 3.5 × 2 in
- Category filter pills include `corporate` and align with seeded categories
- `replacePlaceholders()` is idempotent and handles all placeholders used in new templates

### Research Summary

**Card dimensions**: The UI renders at 336 × 192 px (aspect ratio 1.75:1). Print target is 3.5 × 2 in at 300 DPI = 1050 × 600 px. With 0.125 in bleed on all sides the canvas becomes 3.75 × 2.25 in = 1125 × 675 px.

**html-to-image pixelRatio**: The existing `downloadPng` already uses `pixelRatio: 3`. At 336 × 192 px base, `pixelRatio: 3` yields 1008 × 576 px — slightly under 1050 × 600. To hit exactly 1050 × 600 the capture element must be sized to 350 × 200 px (= 1050/3 × 600/3) or `pixelRatio` must be raised to `Math.ceil(1050/336) = 4` (giving 1344 × 768 px, which exceeds the minimum). Using `pixelRatio: 4` is the simplest approach and produces a higher-quality result.

**jsPDF bleed**: jsPDF supports arbitrary page sizes in inches. For bleed export the page size becomes `[3.75, 2.25]`; for standard it stays `[3.5, 2]`.

**CSS linear-gradient in layoutConfig**: `CardRenderer.buildFaceHtml` already passes `layout.background` directly into the iframe's `--bg` CSS variable and the `background` property of the card container. Gradient strings like `linear-gradient(135deg, #667eea, #764ba2)` work without any changes to `CardRenderer`.

**Idempotence of replacePlaceholders**: The current implementation replaces `{{key}}` with HTML-escaped values. If a value itself contains `{{something}}`, a second pass would replace it. The fix is to ensure the function only replaces tokens that exist in the known `flatMap` — unknown keys already become empty string, so a second pass on already-replaced output is safe as long as user data does not contain `{{word}}` patterns. The requirement specifies "provided the data contains no `{{key}}`-shaped strings", so the current implementation already satisfies idempotence under that precondition. No code change is needed for idempotence itself; the requirement is already met.

---

## Architecture

The feature touches four layers:

```
┌─────────────────────────────────────────────────────────────┐
│  Backend (NestJS)                                           │
│  TemplateService.seedDefaultTemplates()                     │
│    └─ 20 template objects with frontHTML + backHTML         │
└────────────────────────────┬────────────────────────────────┘
                             │ GET /templates
┌────────────────────────────▼────────────────────────────────┐
│  Frontend (Next.js)                                         │
│                                                             │
│  templates/page.tsx  ──►  TemplateCard.tsx                  │
│    category pills           iframe preview (new)            │
│    search                   front/back hover toggle (new)   │
│                                                             │
│  editor/page.tsx     ──►  CardRenderer.tsx                  │
│    gradient picker (new)    existing iframe rendering       │
│    duplicate action (new)                                   │
│    print quality toggle (new)                               │
│                                                             │
│  lib/template-engine.ts                                     │
│    replacePlaceholders() — no change needed                 │
└─────────────────────────────────────────────────────────────┘
```

No new API endpoints are required. All new UI features are client-side. The only backend change is expanding `seedDefaultTemplates()` to produce 20 full-HTML templates.

---

## Components and Interfaces

### 1. TemplateService (`src/modules/template/template.service.ts`)

**Change**: Expand `TEMPLATES_HTML` constant and `seedDefaultTemplates()` to cover all 20 templates across five style groups (4 templates each).

**Seed guard logic** (updated):
```typescript
const withHtml = await this.templateModel.countDocuments({ frontHTML: { $ne: null } });
if (withHtml >= 20) return;  // was: >= 5
```

**Style groups and category mapping**:

| Style Group | Count | Category |
|---|---|---|
| Minimal Clean | 4 | `minimal` |
| Gradient Modern | 4 | `creative` |
| Dark Premium | 4 | `professional` |
| Corporate Professional | 4 | `corporate` |
| Creative Designer | 4 | `creative` |

### 2. TemplateCard (`frontend/components/TemplateCard.tsx`)

**Interface extension** — add HTML fields to the `Template` interface:
```typescript
export interface Template {
  _id: string
  name: string
  category: string
  previewImage: string
  isPremium: boolean
  layoutConfig: Record<string, any>
  frontHTML?: string   // NEW
  backHTML?: string    // NEW
  frontCSS?: string    // NEW
  backCSS?: string     // NEW
}
```

**Preview rendering logic**:
- When `template.frontHTML` is present: render a sandboxed `<iframe>` (reuse `FaceIframe` pattern from `CardRenderer`) scaled to fit the card thumbnail area
- When `template.frontHTML` is absent: keep existing layoutConfig-based JSX fallback
- On hover when `template.backHTML` is present: show a Front/Back toggle pill overlay; toggling swaps the iframe `srcDoc` between front and back HTML documents

**Hover state machine**:
```
idle → hovered (show overlay)
  overlay: [Front | Back] toggle + Preview button
  toggle click: swap face (front ↔ back)
  Preview click: open PreviewModal
```

### 3. Templates Page (`frontend/app/templates/page.tsx`)

**Change**: Add `'corporate'` to the `CATEGORIES` constant:
```typescript
const CATEGORIES = ['all', 'minimal', 'professional', 'creative', 'corporate', 'food', 'beauty', 'fitness', 'local']
```

**Empty state**: Already implemented — the existing "No templates found" block with "Clear filters" satisfies Requirement 8.4.

### 4. Editor Page (`frontend/app/editor/page.tsx`)

#### 4a. Gradient Picker

New sub-component `GradientPicker` rendered inside the Style Tab:

```typescript
interface GradientPickerProps {
  value: string           // current background value
  onChange: (css: string) => void
}
```

Internal state:
```typescript
{ color1: string, color2: string, angle: number }
```

Output: `linear-gradient(${angle}deg, ${color1}, ${color2})`

UI layout:
- Two `<input type="color">` pickers side by side (color stop 1, color stop 2)
- Angle slider `<input type="range" min="0" max="360">` with numeric display
- Live preview swatch showing the generated gradient
- "Apply Gradient" button that calls `onChange` with the generated string

The existing solid-color picker and preset swatches remain unchanged above the gradient picker section.

#### 4b. Template Duplication

New state:
```typescript
const [sessionTemplates, setSessionTemplates] = useState<TemplateData[]>([])
```

`handleDuplicate()` function:
```typescript
const handleDuplicate = () => {
  if (!template) return
  const copy: TemplateData = {
    ...template,
    _id: `local_${Date.now()}`,
    name: `${template.name} (Copy)`,
    layoutConfig: { ...customLayout },  // bake in current overrides
  }
  setSessionTemplates(prev => [...prev, copy])
  setTemplate(copy)
  setCustomLayout({ ...copy.layoutConfig })
  toast.success(`"${copy.name}" created`)
}
```

UI: "Duplicate" button in the editor toolbar (next to "Change Template"), using a `Copy` icon from lucide-react.

#### 4c. Print Quality Toggle

New state:
```typescript
const [printQuality, setPrintQuality] = useState(false)
```

Updated `downloadPng`:
```typescript
const pixelRatio = printQuality ? 4 : 3
const dataUrl = await toPng(captureRef.current, { quality: 1, pixelRatio, cacheBust: true })
```

Updated `downloadPdf`:
```typescript
const pageW = printQuality ? 3.75 : 3.5
const pageH = printQuality ? 2.25 : 2.0
const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [pageW, pageH] })
// image placed at bleed offset when printQuality is true
const offsetX = printQuality ? 0.125 : 0
const offsetY = printQuality ? 0.125 : 0
pdf.addImage(dataUrl, 'PNG', offsetX, offsetY, 3.5, 2)
```

When `printQuality` is true, crop marks are drawn as thin lines at the card boundary corners using `pdf.setDrawColor` and `pdf.line`.

UI: Toggle switch labeled "Print Quality" in the download section of the toolbar.

### 5. Template Engine (`frontend/lib/template-engine.ts`)

No functional changes required. The existing `replacePlaceholders()` already handles all placeholders listed in Requirement 9.1 and already HTML-escapes values. The idempotence property holds under the stated precondition (data values do not contain `{{key}}`-shaped strings).

---

## Data Models

### Template Document (MongoDB / Mongoose)

No schema changes. All required fields already exist:

```typescript
class Template {
  name: string                    // e.g. "Minimal White Luxury"
  category: TemplateCategory      // enum: minimal | professional | creative | ...
  previewImage: string            // placeholder URL
  isPremium: boolean
  layoutConfig: Record<string, any>  // design tokens for fallback + style overrides
  frontHTML: string | null        // {{placeholder}} HTML for front face
  frontCSS: string | null         // additional CSS for front face (may be '')
  backHTML: string | null         // {{placeholder}} HTML for back face
  backCSS: string | null          // additional CSS for back face (may be '')
  html: string | null             // legacy single-face (kept for compat)
  css: string | null              // legacy single-face CSS
  isActive: boolean
}
```

### CardData Interface (frontend)

No changes. All placeholders used in new templates map to existing `CardData` fields:

```typescript
interface CardData {
  name?: string
  businessName?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  tagline?: string
  logoUrl?: string
  qrCodeUrl?: string
  services?: string[]
  socialLinks?: { instagram?; facebook?; twitter?; linkedin?; whatsapp? }
}
```

### GradientConfig (in-memory, editor only)

```typescript
interface GradientConfig {
  color1: string   // hex color, e.g. "#667eea"
  color2: string   // hex color, e.g. "#764ba2"
  angle: number    // 0–360 degrees
}
// Serialized as: `linear-gradient(${angle}deg, ${color1}, ${color2})`
// Stored in: layoutConfig.background
```

### Session Template (in-memory, editor only)

Duplicated templates live only in React state for the current session:

```typescript
// TemplateData with _id prefixed "local_" to distinguish from DB templates
{ ...TemplateData, _id: `local_${timestamp}` }
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: All seeded templates have frontHTML and backHTML

*For any* template produced by `seedDefaultTemplates()`, both `frontHTML` and `backHTML` SHALL be non-null, non-empty strings.

**Validates: Requirements 1.1, 1.2, 1.5**

---

### Property 2: Placeholder replacement is idempotent

*For any* valid `CardData` object whose field values contain no `{{word}}`-shaped substrings, applying `replacePlaceholders(html, data)` twice SHALL produce the same string as applying it once.

**Validates: Requirements 9.4**

---

### Property 3: No raw placeholder tokens survive replacement

*For any* HTML string containing only known placeholder tokens (`{{name}}`, `{{businessName}}`, `{{phone}}`, `{{email}}`, `{{address}}`, `{{website}}`, `{{tagline}}`, `{{logoUrl}}`, `{{qrCodeUrl}}`), after calling `replacePlaceholders(html, data)` the result SHALL contain no `{{...}}` substrings.

**Validates: Requirements 9.1, 9.2**

---

### Property 4: Gradient picker output is a valid CSS linear-gradient

*For any* combination of two hex color values and an angle in [0, 360], the `GradientPicker` SHALL produce a string matching the pattern `linear-gradient(<angle>deg, <color1>, <color2>)` that is a valid CSS `background` value.

**Validates: Requirements 5.1, 5.2, 5.3**

---

### Property 5: Template duplication preserves HTML content

*For any* template with `frontHTML`, `backHTML`, `frontCSS`, `backCSS`, duplicating it SHALL produce a copy where those four fields are identical to the originals.

**Validates: Requirements 6.2**

---

### Property 6: Template duplication bakes in current style overrides

*For any* template and any set of `customLayout` overrides, duplicating SHALL produce a copy whose `layoutConfig` equals the merged result of the original `layoutConfig` with the `customLayout` overrides applied.

**Validates: Requirements 6.3**

---

### Property 7: XSS safety — all substituted values are HTML-escaped

*For any* `CardData` field value containing HTML special characters (`<`, `>`, `&`, `"`, `'`), `replacePlaceholders()` SHALL escape those characters so the output contains no unescaped HTML tags from user data.

**Validates: Requirements 9.3**

---

## Error Handling

### Template Seeding Failures

`seedDefaultTemplates()` already wraps its body in `try/catch` and logs a non-fatal warning. This behavior is preserved. If seeding fails (e.g., duplicate key), the service continues without crashing.

### Iframe Rendering Failures

`FaceIframe` writes HTML directly to the iframe document. If the HTML is malformed, the browser renders what it can — no JavaScript errors propagate to the parent because the iframe is sandboxed. No additional error handling is needed.

### Export Failures

`downloadPng` and `downloadPdf` already catch errors and show a toast. The print quality toggle does not change this behavior.

### Gradient Picker Invalid Input

The angle slider is bounded to [0, 360] by the `<input type="range">` element. Color inputs are `<input type="color">` which always produce valid hex values. No additional validation is needed.

### Template Duplication with No Template

`handleDuplicate()` guards with `if (!template) return` before proceeding.

### Category Filter — No Results

The existing empty-state block in `templates/page.tsx` already handles zero results with a "Clear filters" button. No change needed.

---

## Testing Strategy

### Unit Tests

Focus on pure functions and specific behaviors:

- `replacePlaceholders()`: test each known placeholder key, test unknown keys become empty string, test HTML escaping of `<`, `>`, `&`, `"`, `'`
- `buildCardDocument()`: test that output is a valid HTML document string containing the filled HTML
- `GradientPicker` output function: test that given two colors and an angle it produces the correct `linear-gradient(...)` string
- `handleDuplicate()`: test that the copy has a `local_` prefixed `_id`, correct name suffix, and that `layoutConfig` reflects the merged overrides
- Print export dimensions: test that `pixelRatio: 4` is used when `printQuality` is true, and `pixelRatio: 3` when false

### Property-Based Tests

Use **fast-check** (TypeScript-native PBT library) with minimum 100 iterations per property.

Each test is tagged with: `// Feature: premium-template-upgrade, Property N: <property_text>`

- **Property 2** — Idempotence: generate random `CardData` objects (fields are arbitrary strings without `{{...}}` patterns), generate random HTML strings with known placeholder tokens, verify `replacePlaceholders(replacePlaceholders(html, data), data) === replacePlaceholders(html, data)`
- **Property 3** — No raw tokens: generate HTML strings composed only of known `{{key}}` tokens interspersed with arbitrary text, verify the result contains no `/\{\{\w+\}\}/` matches
- **Property 4** — Gradient output: generate random hex colors and angles in [0, 360], verify the output matches `linear-gradient(<angle>deg, <color1>, <color2>)` and is a non-empty string
- **Property 5** — Duplication preserves HTML: generate random template objects with non-empty HTML fields, verify the duplicate's HTML fields are strictly equal
- **Property 6** — Duplication bakes overrides: generate random `layoutConfig` and `customLayout` objects, verify the duplicate's `layoutConfig` equals `{ ...layoutConfig, ...customLayout }`
- **Property 7** — XSS safety: generate strings containing `<`, `>`, `&`, `"`, `'`, verify none of these appear unescaped in the output

### Integration Tests

- Seed 20 templates into a test MongoDB instance and verify all 20 have non-null `frontHTML` and `backHTML`
- Verify the `GET /templates` endpoint returns all 20 templates with the correct category distribution
- Verify the `corporate` category is present in the returned template set

### Visual / Manual Tests

- Verify each of the 20 template front faces renders correctly in the TemplateCard iframe at 336 × 192 px
- Verify the back face toggle appears on hover for templates with `backHTML`
- Verify the gradient picker live preview updates as color stops and angle change
- Verify the exported PNG at `pixelRatio: 4` is at least 1050 × 600 px
- Verify the PDF with bleed is 3.75 × 2.25 in and crop marks appear at card corners
