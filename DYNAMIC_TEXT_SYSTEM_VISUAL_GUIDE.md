# 🎨 Dynamic Text-Layer System - Visual Guide

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICKCARD EDITOR                          │
├──────────────┬──────────────────────────────────────────────┤
│   SIDEBAR    │              CANVAS                          │
│              │                                              │
│ Text Fields  │    ┌──────────────────────────┐            │
│              │    │                          │            │
│ ┌──────────┐ │    │  GRAPHIC MITRA STUDIO   │ ← Linked   │
│ │Company   │ │    │                          │            │
│ │[Input]  +│─┼────┤      John Doe            │ ← Linked   │
│ └──────────┘ │    │                          │            │
│              │    │   Creative Director      │ ← Linked   │
│ ┌──────────┐ │    │                          │            │
│ │Full Name │ │    │  +1 (555) 123-4567      │ ← Linked   │
│ │[Input]  +│─┼────┤                          │            │
│ └──────────┘ │    └──────────────────────────┘            │
│              │                                              │
│ [+ Add Field]│                                              │
└──────────────┴──────────────────────────────────────────────┘
```

---

## 🔄 Two-Way Synchronization

### Sidebar → Canvas

```
User types in sidebar:
┌─────────────────────┐
│ Company Name        │
│ ┌─────────────────┐ │
│ │GRAPHIC MITRA    │ │ ← User types here
│ └─────────────────┘ │
└─────────────────────┘
         ↓
    Instant sync
         ↓
┌─────────────────────┐
│     CANVAS          │
│                     │
│  GRAPHIC MITRA      │ ← Updates instantly
│                     │
└─────────────────────┘
```

### Canvas → Sidebar

```
User edits on canvas:
┌─────────────────────┐
│     CANVAS          │
│                     │
│  NEW COMPANY NAME   │ ← User edits here
│                     │
└─────────────────────┘
         ↓
    Instant sync
         ↓
┌─────────────────────┐
│ Company Name        │
│ ┌─────────────────┐ │
│ │NEW COMPANY NAME │ │ ← Updates instantly
│ └─────────────────┘ │
└─────────────────────┘
```

---

## 🎯 Field States

### 1. Unlinked Field (Not on Canvas)

```
┌────────────────────────────────────────┐
│ Company Name                      [🗑] │ ← Delete button (on hover)
├────────────────────────────────────────┤
│ ┌────────────────────────────────┐ [+]│ ← Add to canvas button
│ │ GRAPHIC MITRA STUDIO           │    │
│ └────────────────────────────────┘    │
└────────────────────────────────────────┘

Colors:
- Border: Gray (#d1d5db)
- Background: White
- Button: Blue (#3b82f6)
```

### 2. Linked Field (Connected to Canvas)

```
┌────────────────────────────────────────┐
│ Company Name  [Linked] [👁] [🔗] [🗑]  │ ← Action buttons
├────────────────────────────────────────┤
│ ┌────────────────────────────────┐  ● │ ← Pulse indicator
│ │ GRAPHIC MITRA STUDIO           │    │
│ └────────────────────────────────┘    │
├────────────────────────────────────────┤
│ 📊 42px • Arial                        │ ← Element info
└────────────────────────────────────────┘

Colors:
- Border: Green (#10b981)
- Background: Light green (#f0fdf4)
- Badge: Green with white text
- Indicator: Pulsing green dot
```

### 3. Hover State

```
┌────────────────────────────────────────┐
│ Company Name  [Linked] [👁] [🔗] [🗑]  │ ← All buttons visible
├────────────────────────────────────────┤
│ ┌────────────────────────────────┐  ● │
│ │ GRAPHIC MITRA STUDIO           │    │ ← Slightly elevated
│ └────────────────────────────────┘    │
└────────────────────────────────────────┘

Effects:
- Buttons fade in (opacity 0 → 1)
- Slight scale increase (1.0 → 1.02)
- Shadow appears
```

---

## 🎨 UI Components

### Action Buttons

```
┌──────┬──────┬──────┬──────┐
│  👁  │  🔗  │  🗑  │  +   │
│ View │Unlink│Delete│ Add  │
└──────┴──────┴──────┴──────┘

Button States:
- Default: Gray, opacity 0 (hidden)
- Hover: Colored, opacity 1 (visible)
- Active: Darker shade, scale 0.95
```

### Status Badges

```
┌─────────────────┐
│ [Linked] ✓      │ ← Green badge
└─────────────────┘

┌─────────────────┐
│ [Not linked] ⚠  │ ← Orange badge
└─────────────────┘

┌─────────────────┐
│ [Hidden] 👁‍🗨     │ ← Gray badge
└─────────────────┘
```

---

## 📊 Stats Dashboard

```
┌─────────────────────────────────────────┐
│           STATISTICS                     │
├─────────────┬─────────────┬─────────────┤
│      7      │      5      │      8      │
│   Fields    │   Linked    │   Canvas    │
│             │             │             │
│   Blue      │   Green     │    Gray     │
└─────────────┴─────────────┴─────────────┘

Real-time updates:
- Fields: Total text fields
- Linked: Connected to canvas
- Canvas: Total canvas elements
```

---

## 🔗 Linking Process

### Step 1: Unlinked Field

```
┌────────────────────────────────┐
│ Company Name              [+]  │ ← Click + button
│ [GRAPHIC MITRA STUDIO    ]     │
└────────────────────────────────┘
```

### Step 2: Creating Element

```
┌────────────────────────────────┐
│ Company Name         [⏳]      │ ← Loading indicator
│ [GRAPHIC MITRA STUDIO    ]     │
└────────────────────────────────┘
         ↓
    Creating...
         ↓
┌─────────────────────┐
│     CANVAS          │
│                     │
│ GRAPHIC MITRA       │ ← Element appears
│ STUDIO              │
└─────────────────────┘
```

### Step 3: Linked Field

```
┌────────────────────────────────┐
│ Company Name  [Linked] [👁] ●  │ ← Now linked!
│ [GRAPHIC MITRA STUDIO    ]     │
│ 📊 42px • Arial                │
└────────────────────────────────┘
```

---

## 🎯 User Workflows

### Workflow 1: Add New Text

```
1. Type in sidebar
   ┌──────────────┐
   │ [My Text]    │
   └──────────────┘

2. Click + button
   ┌──────────────┐
   │ [My Text] [+]│ ← Click
   └──────────────┘

3. Appears on canvas
   ┌──────────────┐
   │  My Text     │ ← On canvas
   └──────────────┘

4. Field shows linked
   ┌──────────────┐
   │ [Linked] ●   │
   │ [My Text]    │
   └──────────────┘
```

### Workflow 2: Edit Text

```
Option A - From Sidebar:
┌──────────────┐
│ [Old Text]   │ ← Edit here
└──────────────┘
       ↓
┌──────────────┐
│ [New Text]   │
└──────────────┘
       ↓
Canvas updates instantly

Option B - From Canvas:
┌──────────────┐
│  Old Text    │ ← Edit here
└──────────────┘
       ↓
┌──────────────┐
│  New Text    │
└──────────────┘
       ↓
Sidebar updates instantly
```

### Workflow 3: Unlink Field

```
1. Hover over field
   ┌────────────────────┐
   │ [Linked] [👁] [🔗] │ ← Buttons appear
   └────────────────────┘

2. Click unlink button
   ┌────────────────────┐
   │ [Linked] [👁] [🔗] │ ← Click
   └────────────────────┘

3. Field becomes unlinked
   ┌────────────────────┐
   │ Company Name  [+]  │ ← Back to unlinked
   └────────────────────┘

4. Element stays on canvas
   ┌──────────────┐
   │  Text        │ ← Still exists
   └──────────────┘
```

---

## 📱 Responsive Layout

### Desktop View (> 1024px)

```
┌────────────────────────────────────────────────────┐
│  Sidebar (320px)  │      Canvas (Flexible)         │
│                   │                                │
│  [Text Fields]    │    [Canvas Elements]           │
│  [Text Fields]    │                                │
│  [Text Fields]    │                                │
│                   │                                │
│  [Stats]          │                                │
└────────────────────────────────────────────────────┘
```

### Tablet View (768px - 1024px)

```
┌────────────────────────────────────────┐
│  Sidebar (280px)  │   Canvas           │
│                   │                    │
│  [Fields]         │   [Elements]       │
│  [Fields]         │                    │
│                   │                    │
└────────────────────────────────────────┘
```

### Mobile View (< 768px)

```
┌────────────────────┐
│  Tabs: [Text][Canvas]
├────────────────────┤
│                    │
│  [Text Fields]     │
│  [Text Fields]     │
│  [Text Fields]     │
│                    │
└────────────────────┘
```

---

## 🎨 Color Scheme

### Primary Colors

```
┌─────────────────────────────────────┐
│ State      │ Color    │ Hex         │
├─────────────────────────────────────┤
│ Linked     │ Green    │ #10b981     │
│ Unlinked   │ Gray     │ #d1d5db     │
│ Hover      │ Blue     │ #3b82f6     │
│ Warning    │ Orange   │ #f59e0b     │
│ Danger     │ Red      │ #ef4444     │
│ Success    │ Green    │ #22c55e     │
└─────────────────────────────────────┘
```

### Background Colors

```
┌─────────────────────────────────────┐
│ Element    │ Color    │ Hex         │
├─────────────────────────────────────┤
│ Sidebar    │ White    │ #ffffff     │
│ Canvas     │ Gray     │ #f3f4f6     │
│ Linked     │ Lt Green │ #f0fdf4     │
│ Unlinked   │ White    │ #ffffff     │
│ Hover      │ Lt Blue  │ #eff6ff     │
└─────────────────────────────────────┘
```

---

## 🎬 Animations

### Field Entry Animation

```
Frame 1 (0ms):
┌────────────┐
│            │ ← Invisible, y: +10px
└────────────┘

Frame 2 (50ms):
┌────────────┐
│  [Field]   │ ← Fading in, y: +5px
└────────────┘

Frame 3 (100ms):
┌────────────┐
│  [Field]   │ ← Fully visible, y: 0px
└────────────┘
```

### Pulse Animation

```
Frame 1:  ●  (scale: 1.0, opacity: 1.0)
Frame 2:  ⚫  (scale: 1.2, opacity: 0.8)
Frame 3:  ●  (scale: 1.0, opacity: 1.0)

Duration: 2s
Repeat: Infinite
```

### Button Hover

```
Default:  [Button]  (scale: 1.0)
Hover:    [Button]  (scale: 1.1)
Active:   [Button]  (scale: 0.95)

Transition: 0.2s ease
```

---

## 📊 Unlinked Elements Section

```
┌────────────────────────────────────────┐
│ 📊 Unlinked Canvas Elements (3)        │
├────────────────────────────────────────┤
│ ┌────────────────────────────────────┐ │
│ │ Random Text 1          [Not linked]│ │
│ │ 18px • Arial                  [✏] │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Random Text 2          [Not linked]│ │
│ │ 24px • Helvetica              [✏] │ │
│ └────────────────────────────────────┘ │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Random Text 3          [Not linked]│ │
│ │ 16px • Times                  [✏] │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘

Colors:
- Border: Orange (#f59e0b)
- Background: Light orange (#fff7ed)
- Badge: Orange with white text
```

---

## 🎯 Quick Text Styles

```
┌──────────────────────────────────────┐
│ Quick Add Text Styles                │
├──────────────────────────────────────┤
│ ┌────────────┬────────────┐          │
│ │ Heading    │ Subheading │          │
│ │ 36px       │ 24px       │  [+]     │
│ └────────────┴────────────┘          │
│ ┌────────────┬────────────┐          │
│ │ Body       │ Small      │          │
│ │ 16px       │ 12px       │  [+]     │
│ └────────────┴────────────┘          │
└──────────────────────────────────────┘

Click any style to add to canvas
```

---

## 🔍 Element Info Display

```
┌────────────────────────────────────┐
│ Company Name  [Linked]             │
│ [GRAPHIC MITRA STUDIO        ]  ● │
├────────────────────────────────────┤
│ 📊 42px • Arial                    │ ← Font info
│ 🎨 #222222                         │ ← Color
│ 📐 850 × 63                        │ ← Dimensions
│ 📍 (100, 150)                      │ ← Position
└────────────────────────────────────┘
```

---

## 🎉 Complete UI Layout

```
┌─────────────────────────────────────────────────────────┐
│                    QUICKCARD EDITOR                      │
├──────────────┬──────────────────────────────────────────┤
│   SIDEBAR    │              CANVAS                      │
│              │                                          │
│ ┌──────────┐ │    ┌──────────────────────────┐        │
│ │ 🎨 Dynamic│ │    │                          │        │
│ │ Text      │ │    │  GRAPHIC MITRA STUDIO   │ ●      │
│ │ Fields    │ │    │                          │        │
│ └──────────┘ │    │      John Doe            │ ●      │
│              │    │                          │        │
│ Company Name │    │   Creative Director      │ ●      │
│ [Input] [+]  │    │                          │        │
│              │    │  +1 (555) 123-4567      │ ●      │
│ Full Name    │    │                          │        │
│ [Input] [👁] │    │  john@example.com        │ ●      │
│              │    │                          │        │
│ Job Title    │    │  www.example.com         │ ●      │
│ [Input] [👁] │    │                          │        │
│              │    │  123 Main Street...      │ ●      │
│ [+ Add Field]│    │                          │        │
│              │    └──────────────────────────┘        │
│ ┌──────────┐ │                                          │
│ │ Stats    │ │                                          │
│ │ 7│5│8    │ │                                          │
│ └──────────┘ │                                          │
└──────────────┴──────────────────────────────────────────┘
```

---

## ✅ Visual Checklist

### Field States:
- [x] Unlinked field (gray border, + button)
- [x] Linked field (green border, badges)
- [x] Hover state (buttons visible)
- [x] Active state (pressed effect)

### Indicators:
- [x] Linked badge (green)
- [x] Pulse indicator (animated)
- [x] Element info (font, size)
- [x] Status icons (eye, unlink, trash)

### Sections:
- [x] Text fields list
- [x] Add custom field button
- [x] Unlinked elements section
- [x] Quick text styles
- [x] Stats dashboard

### Animations:
- [x] Field entry (fade + slide)
- [x] Pulse indicator (scale + opacity)
- [x] Button hover (scale)
- [x] Smooth transitions

---

## 🎊 Success!

Your dynamic text-layer system has a **professional, intuitive UI** with:

✅ Clear visual states
✅ Smooth animations
✅ Intuitive interactions
✅ Real-time feedback
✅ Professional design

**Ready to impress users!** 🚀

---

**Visual Guide Complete!**
**Status**: ✅ All UI Elements Documented
**Date**: May 11, 2026
