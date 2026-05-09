# Print Guidelines Quick Reference

## 📐 Dimensions at 300 DPI

| Measurement | Inches | Pixels @ 300 DPI |
|-------------|--------|------------------|
| **Final Card** | 3.5" × 2" | 1050 × 600 |
| **Bleed** | 0.125" | 37.5 |
| **Canvas with Bleed** | 3.75" × 2.25" | 1125 × 675 |
| **Safe Area** | 3.25" × 1.75" | 975 × 525 |

## 🎨 Visual Guidelines

### Bleed Area (Red)
```
Color: rgba(239, 68, 68, 0.15) fill
Border: #ef4444 dashed (2px)
Location: Outer 37.5px on all sides
Purpose: Prevent white edges during cutting
```

### Trim/Cut Line (Dark Gray)
```
Color: #374151 solid (3px)
Location: 37.5px inside canvas edge
Dimensions: 1050 × 600 px
Purpose: Where card will be cut
```

### Safe Area (Green)
```
Color: #10b981 dashed (2px)
Location: 37.5px inside trim line
Dimensions: 975 × 525 px
Purpose: Keep important content inside
```

## 🔧 Constants Reference

```typescript
// From frontend/store/editor.store.ts

export const PRINT_DPI = 300
export const CARD_WIDTH_INCH = 3.5
export const CARD_HEIGHT_INCH = 2.0
export const BLEED_INCH = 0.125
export const SAFE_MARGIN_INCH = 0.125

export const CARD_WIDTH_PX = 1050
export const CARD_HEIGHT_PX = 600
export const BLEED_PX = 37.5
export const SAFE_MARGIN_PX = 37.5

export const CANVAS_WIDTH_PX = 1125
export const CANVAS_HEIGHT_PX = 675

export const SAFE_AREA_X = 75 // BLEED_PX + SAFE_MARGIN_PX
export const SAFE_AREA_Y = 75
export const SAFE_AREA_WIDTH = 975
export const SAFE_AREA_HEIGHT = 525
```

## 🎯 Safe Area Positioning

### Center Element in Safe Area
```typescript
const centerX = SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - (elementWidth / 2)
const centerY = SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - (elementHeight / 2)
```

### Check if Element is Outside Safe Area
```typescript
const isOutside = 
  element.x < SAFE_AREA_X ||
  element.y < SAFE_AREA_Y ||
  element.x + element.width > SAFE_AREA_X + SAFE_AREA_WIDTH ||
  element.y + element.height > SAFE_AREA_Y + SAFE_AREA_HEIGHT
```

## 🎨 Color Codes

| Element | Color | Hex Code |
|---------|-------|----------|
| Bleed Fill | Red (15% opacity) | `rgba(239, 68, 68, 0.15)` |
| Bleed Border | Red | `#ef4444` |
| Trim Line | Dark Gray | `#374151` |
| Safe Area | Green | `#10b981` |
| Warning | Orange | `#f59e0b` |
| Grid | Light Gray | `#e5e7eb` |

## 📊 Display Scaling

```typescript
const baseScale = 0.4 // 40% of actual size
const displayScale = baseScale * (zoom / 100)

// At 100% zoom:
// Display: 450 × 270 px (on screen)
// Actual: 1125 × 675 px (for export)
```

## ⚡ Toggle States

```typescript
// From useEditorStore
showGrid: boolean      // Grid lines
showBleed: boolean     // Bleed area overlay
showTrim: boolean      // Trim/cut line
showSafety: boolean    // Safe area border
snapToGrid: boolean    // Snap to grid
```

## 🎯 Element Defaults

### Text Element
```typescript
{
  x: SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - 100,
  y: SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - 20,
  width: 200,
  height: 40,
  fontSize: 16,
  fontFamily: 'Inter',
  fill: '#000000'
}
```

### Shape Element
```typescript
{
  x: SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - 50,
  y: SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - 50,
  width: 100,
  height: 100,
  fill: '#3b82f6',
  stroke: '#1e40af'
}
```

### Image Element
```typescript
{
  x: SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - 75,
  y: SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - 75,
  width: 150,
  height: 150
}
```

## 🚨 Warning System

### Visual Warning
- **Trigger**: Element outside safe area
- **Effect**: Orange stroke (2px) on element
- **Color**: `#f59e0b`

### Toast Notification
- **Trigger**: Drag element outside safe area
- **Message**: "⚠️ Element is outside safe area!"
- **Duration**: 2 seconds
- **Position**: Top-center

## 📏 Grid System

```typescript
gridSize: 10 // Default grid spacing in pixels
```

Grid lines are drawn at intervals of `gridSize` across the entire canvas.

## 🎨 Konva Layer Order

```
1. Background (gradient/solid)
2. Grid (if enabled)
3. Bleed overlay (if enabled)
4. Trim line (if enabled)
5. Safe area (if enabled)
6. User elements (sorted by zIndex)
7. Selection handles
```

## 🔑 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo |
| `Ctrl+D` | Duplicate selected element |
| `Delete` or `Backspace` | Delete selected element |
| `Escape` | Deselect element |

## 📦 Export Specifications

### PNG Export (Planned)
- Resolution: 300 DPI
- Size: 1125 × 675 px
- Format: PNG with transparency
- Color Space: RGB

### PDF Export (Planned)
- Resolution: 300 DPI
- Size: 3.75" × 2.25"
- Format: PDF/X-1a
- Color Space: CMYK (recommended)

## 🎓 Print Industry Standards

| Standard | Value | Notes |
|----------|-------|-------|
| Business Card Size | 3.5" × 2" | US standard |
| Bleed | 0.125" (1/8") | Industry standard |
| Safe Margin | 0.125" | From trim line |
| Print Resolution | 300 DPI | Minimum for quality |
| Color Space | CMYK | For professional printing |

## 🔗 File Locations

```
frontend/
├── store/
│   └── editor.store.ts          # State management & constants
├── components/
│   └── editor/
│       ├── CanvasPreview.tsx    # Main canvas with guidelines
│       ├── SidebarTools.tsx     # Element tools & positioning
│       ├── TopbarControls.tsx   # Toggle buttons & controls
│       └── ColorPicker.tsx      # Color selection
└── app/
    └── card-editor/
        └── page.tsx             # Main editor page
```

## 📚 Dependencies

```json
{
  "konva": "^9.x",
  "react-konva": "^18.x",
  "zustand": "^4.x",
  "framer-motion": "^11.x",
  "react-hot-toast": "^2.x",
  "use-image": "^1.x"
}
```

---

**Quick Tip**: Always keep important content (text, logos, QR codes) inside the green safe area to ensure nothing gets cut off during printing!
