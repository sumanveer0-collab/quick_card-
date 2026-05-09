# Customize Page Visual Guide

## 🎨 VISTAPRINT-STYLE LAYOUT

---

## 📐 FULL LAYOUT DIAGRAM

```
┌──────────────────────────────────────────────────────────────────────────┐
│  NAVBAR                                                                  │
│  QuickCard Logo                                    [Profile] [Logout]   │
└──────────────────────────────────────────────────────────────────────────┘
┌────┬─────────────────┬──────────────────────────────────────────────────┐
│    │                 │  TOP ACTION BAR                                  │
│    │                 │  ┌────┬──────────────────┬──────────────────────┐│
│    │                 │  │ ←  │ Business Card    │ [↶][↷] [Save][Down] ││
│    │                 │  │    │ 9cm×5.2cm•300DPI │                      ││
│    │                 │  └────┴──────────────────┴──────────────────────┘│
│ I  │   SIDEBAR       ├──────────────────────────────────────────────────┤
│ C  │   PANEL         │                                                  │
│ O  │                 │         FLOATING TOOLBAR (when selected)         │
│ N  │  ┌───────────┐  │    ┌──────────────────────────────────────────┐ │
│ S  │  │   Text    │  │    │[Font▼][- 16 +][B][I][≡≡≡][🎨][🔒][📋][🗑]│ │
│    │  │           │  │    └──────────────────────────────────────────┘ │
│ 📝 │  │ Company   │  │                      ▼                           │
│    │  │ Name      │  │              ┌─────────────────┐                 │
│ 🖼️ │  │ [input]   │  │              │                 │                 │
│    │  │ [Add]     │  │              │                 │                 │
│ 🔷 │  │           │  │              │     CANVAS      │                 │
│    │  │ Phone     │  │              │    9cm×5.2cm    │                 │
│ 🎨 │  │ [input]   │  │              │                 │                 │
│    │  │ [Add]     │  │              │                 │                 │
│ 📄 │  │           │  │              └─────────────────┘                 │
│    │  │ [+ New    │  │                                                  │
│ 💧 │  │  Field]   │  │              ┌─────────────┐                     │
│    │  │           │  │              │ [- 100% +]  │                     │
│ ⋯  │  └───────────┘  │              └─────────────┘                     │
│    │                 │                                                  │
└────┴─────────────────┴──────────────────────────────────────────────────┘
```

---

## 🎯 ICON SIDEBAR (Left)

```
┌────┐
│ 📝 │  Text
│    │  ← Active (blue bg)
├────┤
│ 🖼️ │  Uploads
│    │
├────┤
│ 🔷 │  Graphics
│    │
├────┤
│ 🎨 │  Background
│    │
├────┤
│ 📄 │  Templates
│    │
├────┤
│ 💧 │  Color
│    │
├────┤
│ ⋯  │  More
│    │
└────┘

Width: 80px
Icons: 20px
Labels: 9px
Gap: 8px
```

### Active State
```
┌────────┐
│ ┏━━━━┓ │  ← Blue border (2px)
│ ┃ 📝 ┃ │  ← Blue background
│ ┃Text┃ │  ← Blue text
│ ┗━━━━┛ │
└────────┘
```

### Hover State
```
┌────────┐
│ ┌────┐ │  ← Gray background
│ │ 📝 │ │  ← Scale 1.05
│ │Text│ │
│ └────┘ │
└────────┘
```

---

## 📋 SIDEBAR PANELS

### Text Panel
```
┌─────────────────────────────┐
│ Text                        │
│ Edit your text below...     │
│                             │
│ ┌─────────────────────────┐ │
│ │ COMPANY NAME         [×]│ │
│ │ ┌─────────────────────┐ │ │
│ │ │ COMPANY NAME        │ │ │
│ │ └─────────────────────┘ │ │
│ │ [Add to Canvas]         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ PHONE / OTHER           │ │
│ │ ┌─────────────────────┐ │ │
│ │ │ Phone / Other       │ │ │
│ │ └─────────────────────┘ │ │
│ │ [Add to Canvas]         │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │   + New Text Field      │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

Background: #f8f9fb
Cards: White with shadow
Buttons: Blue on hover
```

### Uploads Panel
```
┌─────────────────────────────┐
│ Uploads                     │
│ Add your logo or images     │
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │      ┌─────────┐        │ │
│ │      │    +    │        │ │
│ │      └─────────┘        │ │
│ │                         │ │
│ │   Upload Image          │ │
│ │   PNG, JPG up to 5MB    │ │
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘

Upload Area: Dashed border
Hover: Blue border + bg
Icon: Blue circle
```

### Graphics Panel
```
┌─────────────────────────────┐
│ Graphics                    │
│ Add shapes to your design   │
│                             │
│ ┌───────────┬───────────┐   │
│ │ ┌───────┐ │ ┌───────┐ │   │
│ │ │   ▭   │ │ │   ●   │ │   │
│ │ └───────┘ │ └───────┘ │   │
│ │ Rectangle │  Circle   │   │
│ └───────────┴───────────┘   │
│ ┌───────────┬───────────┐   │
│ │ ┌───────┐ │           │   │
│ │ │   ─   │ │           │   │
│ │ └───────┘ │           │   │
│ │   Line    │           │   │
│ └───────────┴───────────┘   │
└─────────────────────────────┘

Grid: 2 columns
Cards: White with border
Hover: Blue border
```

### Background Panel
```
┌─────────────────────────────┐
│ Background                  │
│ Choose a background style   │
│                             │
│ GRADIENTS                   │
│ ┌──┬──┬──┐                  │
│ │██│██│██│                  │
│ ├──┼──┼──┤                  │
│ │██│██│██│                  │
│ └──┴──┴──┘                  │
│                             │
│ SOLID COLORS                │
│ ┌─┬─┬─┬─┬─┬─┐               │
│ │█│█│█│█│█│█│               │
│ ├─┼─┼─┼─┼─┼─┤               │
│ │█│█│█│█│█│█│               │
│ └─┴─┴─┴─┴─┴─┘               │
└─────────────────────────────┘

Gradients: 3×2 grid
Colors: 6×2 grid
Selected: Blue ring
```

---

## 🎛️ FLOATING TOOLBAR

### Full Toolbar (Text Selected)
```
┌────────────────────────────────────────────────────────────────┐
│ [Inter▼] │ [- 16 +] │ [B][I] │ [≡][≡][≡] │ [🎨] │ [🔒][📋][🗑] │
└────────────────────────────────────────────────────────────────┘
   Font      Size      Style    Alignment   Color   Actions

Background: White/95 + backdrop blur
Border: Gray/20
Shadow: 2xl
Padding: 12px
Gap: 4px
```

### Toolbar Sections

#### Font Controls
```
┌─────────┬───────────┐
│ Inter ▼ │ [- 16 +] │
└─────────┴───────────┘
  Dropdown   Stepper
```

#### Style Controls
```
┌────┬────┐
│ B  │ I  │
└────┴────┘
 Bold Italic

Active: Blue bg
Inactive: Gray hover
```

#### Alignment Controls
```
┌────┬────┬────┐
│ ≡  │ ≡  │ ≡  │
└────┴────┴────┘
Left Center Right

Active: Blue bg
```

#### Color Picker
```
┌────┐
│ 🎨 │  ← Click to open
└────┘
  │
  ▼
┌─────────────────┐
│ ┌─┬─┬─┬─┬─┬─┐  │
│ │█│█│█│█│█│█│  │
│ ├─┼─┼─┼─┼─┼─┤  │
│ │█│█│█│█│█│█│  │
│ ├─┼─┼─┼─┼─┼─┤  │
│ │█│█│█│█│█│█│  │
│ └─┴─┴─┴─┴─┴─┘  │
└─────────────────┘

20 preset colors
6×4 grid
```

#### Action Controls
```
┌────┬────┬────┐
│ 🔒 │ 📋 │ 🗑 │
└────┴────┴────┘
Lock Dup Delete

Lock: Toggle
Duplicate: Ctrl+D
Delete: Red hover
```

---

## 🖼️ CANVAS AREA

### Canvas with Element
```
┌─────────────────────────────────────┐
│                                     │
│  ┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐  │
│  ┆ Trim Line (gray dashed)     ┆  │
│  ┆                               ┆  │
│  ┆  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  ┆  │
│  ┆  ┊ Safe Area (green dash) ┊  ┆  │
│  ┆  ┊                         ┊  ┆  │
│  ┆  ┊  ┏━━━━━━━━━━━━━━━━┓   ┊  ┆  │
│  ┆  ┊  ┃ COMPANY NAME   ┃   ┊  ┆  │
│  ┆  ┊  ┗━━━━━━━━━━━━━━━━┛   ┊  ┆  │
│  ┆  ┊     ← Selected (blue)  ┊  ┆  │
│  ┆  ┊                         ┊  ┆  │
│  ┆  ┊  Phone / Other          ┊  ┆  │
│  ┆  ┊                         ┊  ┆  │
│  ┆  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  ┆  │
│  ┆                               ┆  │
│  └─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘  │
│                                     │
│         9cm × 5.2cm • 300 DPI       │
└─────────────────────────────────────┘

Background: Gradient
Shadow: 2xl
Rounded: lg
```

### Element States

#### Normal
```
┌─────────────────┐
│ COMPANY NAME    │
└─────────────────┘
```

#### Selected
```
┏━━━━━━━━━━━━━━━━━┓
┃ COMPANY NAME    ┃  ← Blue border (3px)
┗━━━━━━━━━━━━━━━━━┛
```

#### Editing
```
┏━━━━━━━━━━━━━━━━━┓
┃ COMPANY NAME|   ┃  ← Cursor visible
┗━━━━━━━━━━━━━━━━━┛  ← Faded (30%)
```

#### Outside Safe Area
```
┏━━━━━━━━━━━━━━━━━┓
┃ COMPANY NAME    ┃  ← Orange border
┗━━━━━━━━━━━━━━━━━┛
⚠️ Outside safe area!
```

---

## 🔍 ZOOM CONTROLS

```
┌─────────────────┐
│ [-] 100% [+]    │
└─────────────────┘

Background: White/90 + blur
Border: Gray
Shadow: lg
Rounded: full
Padding: 8px 16px

Position: Bottom center
Z-index: 10
```

### Zoom States
```
50%  ← Minimum
75%
100% ← Default
125%
150%
200% ← Maximum
```

---

## 🎨 COLOR SCHEMES

### Sidebar Background
```
#f8f9fb  ← Soft gray-blue
```

### Canvas Background
```
linear-gradient(to br, #f9fafb, #f3f4f6)
```

### Card Backgrounds (Examples)
```
Gradient 1: linear-gradient(135deg, #0369a1, #0891b2)
Gradient 2: linear-gradient(135deg, #7c3aed, #a855f7)
Gradient 3: linear-gradient(135deg, #dc2626, #f97316)
```

### UI Colors
```
Primary: #3b82f6 (Blue)
Success: #10b981 (Green)
Warning: #f59e0b (Orange)
Danger: #ef4444 (Red)
Gray: #6b7280
```

---

## 📱 RESPONSIVE BEHAVIOR

### Desktop (>1024px)
```
[Icon][Sidebar][Canvas]
  80px   320px   Flex
```

### Tablet (768-1024px)
```
[Icon][Sidebar][Canvas]
  80px   280px   Flex
```

### Mobile (<768px)
```
[Canvas]
Full width
Sidebar: Drawer
```

---

## ✨ ANIMATION EXAMPLES

### Tab Switch
```
Frame 1 (0ms):
  opacity: 0
  x: -20px

Frame 2 (100ms):
  opacity: 0.5
  x: -10px

Frame 3 (200ms):
  opacity: 1
  x: 0px
  ✓ Complete
```

### Toolbar Appear
```
Frame 1 (0ms):
  opacity: 0
  y: -10px

Frame 2 (150ms):
  opacity: 1
  y: 0px
  ✓ Complete
```

### Button Hover
```
Normal:
  scale: 1.0

Hover:
  scale: 1.05
  transition: 150ms

Press:
  scale: 0.95
  transition: 100ms
```

---

## 🎯 INTERACTION PATTERNS

### Add Text Flow
```
1. Click "Text" icon
   ↓
2. Sidebar shows text panel
   ↓
3. Edit text in input
   ↓
4. Click "Add to Canvas"
   ↓
5. Text appears centered
   ↓
6. Drag to reposition
```

### Edit Text Flow
```
1. Double-click text
   ↓
2. Inline editor appears
   ↓
3. Type new text
   ↓
4. Press Escape
   ↓
5. Text saved
```

### Style Text Flow
```
1. Click text element
   ↓
2. Floating toolbar appears
   ↓
3. Click style button
   ↓
4. Style applies instantly
```

---

## 🎓 QUICK TIPS

### ✅ DO:
- ✅ Use icon navigation for quick access
- ✅ Add text fields dynamically
- ✅ Double-click to edit inline
- ✅ Use floating toolbar for styling
- ✅ Keep content in safe area

### ❌ DON'T:
- ❌ Overcrowd the canvas
- ❌ Place text outside safe area
- ❌ Use too many fonts
- ❌ Forget to save your work

---

**Remember**: The interface is designed for professional card creation with print-ready output! 🎨✨
