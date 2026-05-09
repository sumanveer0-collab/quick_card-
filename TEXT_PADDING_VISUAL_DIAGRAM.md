# Text Padding Visual Diagram

## 📐 Professional Text Box Structure

This document provides visual diagrams of the text padding and alignment system.

---

## 🎨 BASIC STRUCTURE

### Two-Layer System

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  OUTER CONTAINER (Konva Group)                         │
│  • Handles selection                                    │
│  • Handles dragging                                     │
│  • Handles resizing                                     │
│  • Handles rotation                                     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │  PADDING AREA (12px horizontal, 8px vertical)    │ │
│  │                                                   │ │
│  │  ┌─────────────────────────────────────────────┐ │ │
│  │  │                                             │ │ │
│  │  │  INNER TEXT (Konva Text)                    │ │ │
│  │  │  • Actual text content                      │ │ │
│  │  │  • Wraps within this area                   │ │ │
│  │  │  • Respects alignment                       │ │ │
│  │  │                                             │ │ │
│  │  └─────────────────────────────────────────────┘ │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📏 PADDING MEASUREMENTS

### Horizontal Padding: 12px

```
┌─────────────────────────────────────────┐
│                                         │
│ 12px                              12px  │
│  ↓                                  ↓   │
│  ├──────────────────────────────────┤   │
│  │                                  │   │
│  │     TEXT CONTENT AREA            │   │
│  │                                  │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Vertical Padding: 8px

```
┌─────────────────────────────────────────┐
│                                         │
│ ← 8px padding                           │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│     TEXT CONTENT AREA                   │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ ← 8px padding                           │
│                                         │
└─────────────────────────────────────────┘
```

### Combined Padding

```
        Total Width = W
┌─────────────────────────────────┐
│ 8px top padding                 │ ↑
├─────────────────────────────────┤ │
│ 12px │                   │ 12px │ │
│  ←   │  TEXT CONTENT     │  →   │ H
│      │  Width = W - 24   │      │ │
│      │  Height = H - 16  │      │ │
├─────────────────────────────────┤ ↓
│ 8px bottom padding              │
└─────────────────────────────────┘
```

---

## 🎯 ALIGNMENT SYSTEM

### Horizontal Alignment (3 options)

#### Left Alignment
```
┌─────────────────────────────────────────┐
│ PADDING                                 │
│ ┌─────────────────────────────────────┐ │
│ │ Text starts here                    │ │
│ │ More text                           │ │
│ │ Even more text                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

#### Center Alignment
```
┌─────────────────────────────────────────┐
│ PADDING                                 │
│ ┌─────────────────────────────────────┐ │
│ │         Text centered here          │ │
│ │           More text                 │ │
│ │        Even more text               │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

#### Right Alignment
```
┌─────────────────────────────────────────┐
│ PADDING                                 │
│ ┌─────────────────────────────────────┐ │
│ │                    Text ends here   │ │
│ │                           More text │ │
│ │                      Even more text │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Vertical Alignment (3 options)

#### Top Alignment
```
┌─────────────────────────────────────────┐
│ PADDING                                 │
│ ┌─────────────────────────────────────┐ │
│ │ Text at top                         │ │
│ │                                     │ │
│ │                                     │ │
│ │                                     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

#### Middle Alignment (Default)
```
┌─────────────────────────────────────────┐
│ PADDING                                 │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │                                     │ │
│ │ Text in middle                      │ │
│ │                                     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

#### Bottom Alignment
```
┌─────────────────────────────────────────┐
│ PADDING                                 │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │                                     │ │
│ │                                     │ │
│ │                                     │ │
│ │ Text at bottom                      │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔄 RESIZE BEHAVIOR

### Before Resize
```
┌─────────────────────────────┐
│ PADDING                     │
│ ┌─────────────────────────┐ │
│ │ Text                    │ │
│ │ Font: 16px              │ │
│ └─────────────────────────┘ │
│                             │
└─────────────────────────────┘
    Width: 200px
```

### After Resize (Wider)
```
┌─────────────────────────────────────────────┐
│ PADDING                                     │
│ ┌─────────────────────────────────────────┐ │
│ │ Text                                    │ │
│ │ Font: 16px (UNCHANGED)                  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
    Width: 300px (INCREASED)
```

### After Resize (Narrower - Text Wraps)
```
┌─────────────────┐
│ PADDING         │
│ ┌─────────────┐ │
│ │ Text        │ │
│ │ Font: 16px  │ │
│ │ (UNCHANGED) │ │
│ │ Wraps to    │ │
│ │ multiple    │ │
│ │ lines       │ │
│ └─────────────┘ │
│                 │
└─────────────────┘
    Width: 100px
```

**Key Point**: Font size NEVER changes during resize. Only container size changes, and text wraps naturally.

---

## 🎨 SELECTION STATES

### Normal State (Not Selected)
```
┌─────────────────────────────┐
│                             │
│  COMPANY NAME               │
│                             │
└─────────────────────────────┘
```

### Selected State
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ← Blue border (2px)
┃ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ ┃  ← Padding indicator (5% opacity)
┃ ░ ┌─────────────────────┐ ░ ┃
┃ ░ │ COMPANY NAME        │ ░ ┃  ← Text content
┃ ░ └─────────────────────┘ ░ ┃
┃ ░░░░░░░░░░░░░░░░░░░░░░░░░░░ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  ↑                           ↑
  Resize handles (8 total)
```

### Selected with Transform Handles
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ◉                         ◉ ┃  ← Corner handles
┃                             ┃
┃ ◉  COMPANY NAME           ◉ ┃  ← Middle handles
┃                             ┃
┃ ◉                         ◉ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        ↑
    Rotation handle
```

### Outside Safe Area Warning
```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ← Orange dashed border
┃ ⚠                         ⚠ ┃
┃                             ┃
┃    COMPANY NAME             ┃
┃                             ┃
┃ ⚠                         ⚠ ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Toast: "⚠️ Element is outside safe area!"
```

---

## 📝 INLINE EDITING MODE

### Normal View Mode
```
┌─────────────────────────────┐
│ PADDING                     │
│ ┌─────────────────────────┐ │
│ │ COMPANY NAME            │ │  ← 100% opacity
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Edit Mode (Double-Click)
```
┌─────────────────────────────┐
│ PADDING                     │
│ ┌─────────────────────────┐ │
│ │ COMPANY NAME            │ │  ← 30% opacity (faded)
│ └─────────────────────────┘ │
└─────────────────────────────┘

Overlay Textarea:
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  ← Blue border
┃ COMPANY NAME|             ┃  ← Cursor visible
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
↑                           ↑
Positioned at padding offset
Width = element.width - 24px
```

---

## 🎯 ALIGNMENT COMBINATIONS (9 Total)

### Grid of All Combinations

```
┌─────────────┬─────────────┬─────────────┐
│ TOP-LEFT    │ TOP-CENTER  │ TOP-RIGHT   │
│             │             │             │
│ Text        │    Text     │        Text │
│             │             │             │
│             │             │             │
├─────────────┼─────────────┼─────────────┤
│ MIDDLE-LEFT │MIDDLE-CENTER│MIDDLE-RIGHT │
│             │             │             │
│             │             │             │
│ Text        │    Text     │        Text │
│             │             │             │
│             │             │             │
├─────────────┼─────────────┼─────────────┤
│ BOTTOM-LEFT │BOTTOM-CENTER│BOTTOM-RIGHT │
│             │             │             │
│             │             │             │
│             │             │             │
│ Text        │    Text     │        Text │
│             │             │             │
└─────────────┴─────────────┴─────────────┘
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### Konva.js Component Structure

```typescript
<Group>  // Outer container
  
  {/* Selection border */}
  <Rect
    stroke="#3b82f6"
    strokeWidth={2}
    cornerRadius={4}
  />
  
  {/* Padding indicator */}
  <Rect
    x={12}
    y={8}
    fill="#3b82f6"
    opacity={0.05}
  />
  
  {/* Text content */}
  <Text
    x={12}              // Horizontal padding offset
    y={verticalOffset}  // Calculated based on verticalAlign
    width={element.width - 24}   // Minus 2 × 12px
    height={element.height - 16} // Minus 2 × 8px
    wrap="word"
    align={element.align}
  />
  
</Group>

{/* Transform handles */}
<Transformer
  enabledAnchors={[
    'top-left', 'top-right',
    'bottom-left', 'bottom-right',
    'middle-left', 'middle-right'
  ]}
/>
```

---

## 📊 DIMENSION CALCULATIONS

### Text Content Area

```
Given:
  containerWidth = W
  containerHeight = H
  paddingHorizontal = 12
  paddingVertical = 8

Calculate:
  textWidth = W - (paddingHorizontal × 2)
            = W - 24

  textHeight = H - (paddingVertical × 2)
             = H - 16

  textX = paddingHorizontal
        = 12

  textY = calculated based on verticalAlign:
    - top:    paddingVertical = 8
    - middle: (H - textHeight) / 2
    - bottom: H - textHeight - paddingVertical
```

### Example Calculation

```
Container: 200px × 100px

Text Area:
  Width:  200 - 24 = 176px
  Height: 100 - 16 = 84px

Position (middle alignment):
  X: 12px
  Y: (100 - 84) / 2 = 8px

Result:
┌─────────────────────────────┐  ← 200px wide
│ 12px                   12px │
│  ↓                       ↓  │
│  ┌─────────────────────┐   │  ← 8px from top
│  │                     │   │
│  │  TEXT (176×84)      │   │  ← 100px tall
│  │                     │   │
│  └─────────────────────┘   │  ← 8px from bottom
└─────────────────────────────┘
```

---

## 🎨 SAFE AREA VISUALIZATION

### Full Canvas with Safe Area

```
┌─────────────────────────────────────────────────────────┐
│ BLEED AREA (37.5px)                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ TRIM LINE (Card edge)                               │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ SAFE AREA (37.5px margin)                       │ │ │
│ │ │ ┌─────────────────────────────────────────────┐ │ │ │
│ │ │ │                                             │ │ │ │
│ │ │ │  ✅ Text here is SAFE                       │ │ │ │
│ │ │ │                                             │ │ │ │
│ │ │ └─────────────────────────────────────────────┘ │ │ │
│ │ │                                                 │ │ │
│ │ │  ⚠️ Text here gets WARNING                      │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Text Element Positions

```
Safe (No Warning):
┌─────────────────────────────────────────┐
│ SAFE AREA                               │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │  ┌──────────────┐                  │ │
│ │  │ TEXT ✅      │                  │ │
│ │  └──────────────┘                  │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

Outside Safe (Warning):
┌─────────────────────────────────────────┐
│ SAFE AREA                               │
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │                  ┌──────────────┐   │ │
│ │                  │ TEXT ⚠️      │───┼─┤
│ │                  └──────────────┘   │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
         Orange dashed border appears
```

---

## 🎯 FLOATING TOOLBAR LAYOUT

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ [Font ▼] [- 16 +] [B][I] [≡≡≡] [⬆↕⬇] [🎨] [🔒][📋][🗑]      │ │
│  └────────────────────────────────────────────────────────────────┘ │
│     ↑        ↑      ↑    ↑     ↑      ↑    ↑    ↑   ↑   ↑          │
│     │        │      │    │     │      │    │    │   │   │          │
│   Font    Size  Style  H-Align V-Align Color Lock Dup Del          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Toolbar Sections

```
┌─────────────┬──────────┬────────┬──────────┬──────────┬────────┬──────────┐
│   FONT      │   SIZE   │ STYLE  │ H-ALIGN  │ V-ALIGN  │ COLOR  │ ACTIONS  │
├─────────────┼──────────┼────────┼──────────┼──────────┼────────┼──────────┤
│ Dropdown    │ +/- btns │ B I    │ ≡ ≡ ≡    │ ⬆ ↕ ⬇   │ Picker │ 🔒📋🗑   │
│ 10 fonts    │ ±2 step  │ Toggle │ L C R    │ T M B    │ 20 clr │ 3 btns   │
└─────────────┴──────────┴────────┴──────────┴──────────┴────────┴──────────┘
```

---

## 📐 PRINT SPECIFICATIONS

### Business Card Dimensions (300 DPI)

```
┌─────────────────────────────────────────────────────────┐
│ Total Canvas: 3.75" × 2.25" (1125px × 675px)           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Bleed: 0.125" (37.5px)                              │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ Card: 3.5" × 2" (1050px × 600px)                │ │ │
│ │ │ ┌─────────────────────────────────────────────┐ │ │ │
│ │ │ │ Safe: 3.25" × 1.75" (975px × 525px)         │ │ │ │
│ │ │ │                                             │ │ │ │
│ │ │ │  Text with padding should stay here         │ │ │ │
│ │ │ │                                             │ │ │ │
│ │ │ └─────────────────────────────────────────────┘ │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘

Measurements:
- Bleed: 37.5px on all sides
- Safe margin: 37.5px inside trim line
- Text padding: 12px horizontal, 8px vertical (additional)
```

---

## ✨ SUMMARY

### Key Visual Elements

1. **Two-Layer Structure**: Outer container + inner text
2. **12px/8px Padding**: Professional spacing
3. **9 Alignment Options**: 3 horizontal × 3 vertical
4. **Selection Feedback**: Blue border + padding indicator
5. **Safe Area Warning**: Orange dashed border
6. **Inline Editing**: Overlay textarea with proper positioning
7. **Floating Toolbar**: Glassmorphism design with all controls
8. **Resize Behavior**: Container scales, font size constant

### Visual Quality Standards

✅ Text never touches edges  
✅ Clean, professional spacing  
✅ Clear visual feedback  
✅ Smooth animations  
✅ VistaPrint-level quality  

---

**Last Updated**: May 4, 2026  
**Version**: 1.0  
**Status**: Complete
