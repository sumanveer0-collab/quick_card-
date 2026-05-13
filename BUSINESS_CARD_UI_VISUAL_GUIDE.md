# 🎨 Business Card Designer - Visual UI Guide

## 📱 Page Layouts

### 1. Gallery Page (`/business-cards`)

```
┌─────────────────────────────────────────────────────────────┐
│  ✨ 500+ Professional Business Card Templates               │
│     Create, Customize & Export Stunning Business Cards      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  🔍 Search templates by name or category...        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [➕ Create New Design]                                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Category Filters (Scrollable)                              │
│  [All] [Corporate] [Minimal] [Luxury] [Creative] [...]     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Template Grid (4 columns on desktop)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ ⭐Premium│  │          │  │ 🔥Popular│  │          │  │
│  │ ❤️       │  │ ❤️       │  │ ❤️       │  │ ❤️       │  │
│  │          │  │          │  │          │  │          │  │
│  │ Template │  │ Template │  │ Template │  │ Template │  │
│  │ Preview  │  │ Preview  │  │ Preview  │  │ Preview  │  │
│  │          │  │          │  │          │  │          │  │
│  │ 👁️ ✏️    │  │ 👁️ ✏️    │  │ 👁️ ✏️    │  │ 👁️ ✏️    │  │
│  │          │  │          │  │          │  │          │  │
│  │ Title    │  │ Title    │  │ Title    │  │ Title    │  │
│  │[Category]│  │[Category]│  │[Category]│  │[Category]│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  [More templates...]                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Editor Page (`/business-cards/editor/[id]`)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← My Business Card                    ↶ ↷  ➖ 100% ➕  ⊞  💾 Save  📥 Export│
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┬─────────────────────────────────────────────────┬──────────────┐
│          │                                                 │              │
│  LEFT    │              CENTER CANVAS                      │    RIGHT     │
│ SIDEBAR  │                                                 │   SIDEBAR    │
│          │                                                 │              │
│ ┌──────┐ │  ┌──────────────────────────────────────────┐ │ ┌──────────┐ │
│ │Elem  │ │  │  [⊟] [⊞]  [🔄 Front Side]                │ │ │Properties│ │
│ │Text  │ │  └──────────────────────────────────────────┘ │ │          │ │
│ │Graph │ │                                                 │ │ Position │ │
│ │Upload│ │  ┌──────────────────────────────────────────┐ │ │ X: [100] │ │
│ │Layers│ │  │                                            │ │ │ Y: [100] │ │
│ └──────┘ │  │         ┌─────────────────┐               │ │ │          │ │
│          │  │         │                 │               │ │ │ Size     │ │
│ Elements │  │         │   Business      │               │ │ │ W: [100] │ │
│ ┌──────┐ │  │         │   Card          │               │ │ │ H: [60]  │ │
│ │ 📝   │ │  │         │   Canvas        │               │ │ │          │ │
│ │ Text │ │  │         │   (Editable)    │               │ │ │ Color    │ │
│ └──────┘ │  │         │                 │               │ │ │ [🎨]     │ │
│ ┌──────┐ │  │         │   [Elements]    │               │ │ │ #3b82f6  │ │
│ │ ▭    │ │  │         │                 │               │ │ │          │ │
│ │ Rect │ │  │         └─────────────────┘               │ │ │ Opacity  │ │
│ └──────┘ │  │                                            │ │ │ ▬▬▬▬○    │ │
│ ┌──────┐ │  │         Grid & Guides                      │ │ │ 100%     │ │
│ │ ○    │ │  │                                            │ │ │          │ │
│ │Circle│ │  └──────────────────────────────────────────┘ │ │ Rotation │ │
│ └──────┘ │                                                 │ │ ▬▬▬○▬▬   │ │
│ ┌──────┐ │                                                 │ │ 45°      │ │
│ │ QR   │ │                                                 │ │          │ │
│ │ Code │ │                                                 │ │ [🗑️ Del] │ │
│ └──────┘ │                                                 │ └──────────┘ │
│          │                                                 │              │
└──────────┴─────────────────────────────────────────────────┴──────────────┘
```

---

### 3. Export Modal

```
┌─────────────────────────────────────────────────────────┐
│  Export Business Card                              [✕]  │
│  Choose your export settings                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Export Format                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 🖼️ PNG   │  │ 🖼️ JPG   │  │ 📄 PDF   │            │
│  │ High     │  │ Compress │  │ Print    │            │
│  │ quality  │  │ image    │  │ ready    │            │
│  │ [✓]      │  │          │  │          │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                          │
│  Export Side                                            │
│  [Front Only]  [Back Only]  [Both Sides ✓]            │
│                                                          │
│  Quality: 100%                                          │
│  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬○               │
│  Lower file size ←──────────────→ Higher quality       │
│                                                          │
│  Resolution (DPI)                                       │
│  [150 DPI]  [300 DPI ✓]  [600 DPI]                    │
│  Screen     Print        High-end                       │
│                                                          │
│  ☑️ Include Bleed Margins                              │
│     Add 3mm bleed for professional printing             │
│                                                          │
│  ┌────────────────────────────────────────────────┐   │
│  │ 📋 Export Details                              │   │
│  │ Format: PNG                                     │   │
│  │ Resolution: 300 DPI                             │   │
│  │ Size: 85mm × 55mm (Standard Business Card)     │   │
│  │ Sides: Front & Back                             │   │
│  └────────────────────────────────────────────────┘   │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                              [Cancel]  [📥 Export]      │
└─────────────────────────────────────────────────────────┘
```

---

### 4. Preview Page (`/business-cards/preview/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Corporate Blue Professional                              │
│     Corporate                          ❤️ 🔗 [✏️ Customize] │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────┐
│                              │                              │
│  Preview                     │  Template Details            │
│  [Front] [Back]              │                              │
│                              │  Category: Corporate         │
│  ┌────────────────────────┐ │  Style: Professional         │
│  │                        │ │  Type: [⭐ Premium]          │
│  │   Business Card        │ │                              │
│  │   Preview              │ │  ─────────────────────────   │
│  │   (Interactive)        │ │                              │
│  │                        │ │  Features                    │
│  └────────────────────────┘ │  ✓ Fully customizable        │
│                              │  ✓ Front and back sides      │
│  [✏️ Customize This]         │  ✓ High-resolution export    │
│  [📥 Download Preview]       │  ✓ Print-ready PDF           │
│                              │  ✓ Professional typography   │
│                              │  ✓ Easy to edit              │
│                              │                              │
│                              │  ─────────────────────────   │
│                              │                              │
│                              │  Statistics                  │
│                              │  ┌──────┐  ┌──────┐        │
│                              │  │1,234 │  │ 567  │        │
│                              │  │Views │  │Down. │        │
│                              │  └──────┘  └──────┘        │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 🎨 UI Components Breakdown

### Template Card Component
```
┌─────────────────────────┐
│ [⭐ Premium]      [❤️]  │  ← Badges & Favorite
│                         │
│                         │
│    Template Preview     │  ← Gradient background
│    (Hover for actions)  │
│                         │
│    [👁️ Preview]         │  ← Hover overlay
│    [✏️ Customize]       │
│                         │
├─────────────────────────┤
│ Template Title          │  ← Info section
│ [Category Badge]  ⭐    │
└─────────────────────────┘
```

### Editor Sidebar Tabs
```
┌─────────────────────────┐
│ [▭] [📝] [✨] [📤] [📚] │  ← Tab icons
│ Elem Text Gfx  Up  Lay  │
└─────────────────────────┘
```

### Properties Panel Controls
```
┌─────────────────────────┐
│ Properties        [↑↓🗑️] │  ← Header with actions
├─────────────────────────┤
│ Position                │
│ X: [____] Y: [____]     │  ← Number inputs
│                         │
│ Size                    │
│ W: [____] H: [____]     │
│                         │
│ Color                   │
│ [🎨] [#3b82f6]          │  ← Color picker
│                         │
│ Opacity                 │
│ ▬▬▬▬▬○▬▬▬▬▬  100%      │  ← Slider
│                         │
│ Rotation                │
│ ▬▬▬○▬▬▬▬▬▬▬  45°       │  ← Slider
└─────────────────────────┘
```

---

## 🎯 Interactive Elements

### Hover States
```
Normal State:
┌──────────┐
│ Template │
│ Card     │
└──────────┘

Hover State:
┌──────────┐
│ Template │  ← Scale up, glow effect
│ Card     │
│ [👁️] [✏️] │  ← Show actions
└──────────┘
```

### Button States
```
Primary Button:
[💾 Save]  →  [💾 Saving...]  →  [✓ Saved]

Export Button:
[📥 Export]  →  [⏳ Exporting...]  →  [✓ Downloaded]
```

### Canvas Interactions
```
Click Element:
┌──────────┐
│ Selected │  ← Blue border
│ Element  │  ← Drag handles
└──────────┘

Drag Element:
┌──────────┐
│ Moving   │  ← Follow cursor
│ Element  │  ← Snap to grid
└──────────┘
```

---

## 🌈 Color Scheme

### Primary Colors
```
Blue:    #3b82f6  ████████
Purple:  #8b5cf6  ████████
Pink:    #ec4899  ████████
```

### Background Colors
```
Dark:    #0f172a  ████████
Slate:   #1e293b  ████████
Gray:    #374151  ████████
```

### Accent Colors
```
Success: #10b981  ████████
Warning: #f59e0b  ████████
Error:   #ef4444  ████████
```

---

## 📐 Layout Dimensions

### Desktop (1920px+)
- Left Sidebar: 320px
- Canvas: Flexible (center)
- Right Sidebar: 320px
- Template Grid: 4 columns

### Tablet (768px - 1919px)
- Sidebars: Collapsible
- Canvas: Full width when sidebars closed
- Template Grid: 2 columns

### Mobile (< 768px)
- Sidebars: Bottom sheets
- Canvas: Full screen
- Template Grid: 1 column

---

## 🎭 Animation Timings

```
Fast:    150ms  - Button hover
Normal:  300ms  - Card hover, transitions
Slow:    500ms  - Page transitions
Smooth:  1000ms - Shine effects
```

---

## 🔤 Typography Scale

```
Hero:     72px  - Main headings
H1:       48px  - Page titles
H2:       32px  - Section titles
H3:       24px  - Card titles
Body:     16px  - Regular text
Small:    14px  - Labels
Tiny:     12px  - Captions
```

---

## 📱 Responsive Breakpoints

```
Mobile:   < 640px
Tablet:   640px - 1024px
Desktop:  1024px - 1920px
Large:    > 1920px
```

---

## ✨ Special Effects

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Gradient Glow
```css
box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
```

### Shine Effect
```css
background: linear-gradient(
  90deg,
  transparent,
  rgba(255, 255, 255, 0.1),
  transparent
);
animation: shine 1s;
```

---

This visual guide provides a complete overview of the UI structure and design system for the Business Card Designer module.
