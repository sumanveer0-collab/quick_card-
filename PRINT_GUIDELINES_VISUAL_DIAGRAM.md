# Print Guidelines Visual Diagram

## 📐 Business Card Layout (Top View)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ╔═══════════════════════════════════════════════════════════════╗ │
│  ║                        BLEED AREA                             ║ │
│  ║                    (Red Dashed Border)                        ║ │
│  ║                      0.125" / 37.5px                          ║ │
│  ║                                                               ║ │
│  ║   ┌───────────────────────────────────────────────────────┐   ║ │
│  ║   │                                                       │   ║ │
│  ║   │              TRIM / CUT LINE                          │   ║ │
│  ║   │           (Dark Gray Solid Border)                    │   ║ │
│  ║   │              3.5" × 2" / 1050 × 600px                 │   ║ │
│  ║   │                                                       │   ║ │
│  ║   │   ┌───────────────────────────────────────────┐       │   ║ │
│  ║   │   │                                           │       │   ║ │
│  ║   │   │         SAFE AREA                         │       │   ║ │
│  ║   │   │    (Green Dashed Border)                  │       │   ║ │
│  ║   │   │    3.25" × 1.75" / 975 × 525px            │       │   ║ │
│  ║   │   │                                           │       │   ║ │
│  ║   │   │    ┌─────────────────────────┐            │       │   ║ │
│  ║   │   │    │                         │            │       │   ║ │
│  ║   │   │    │   YOUR CONTENT HERE     │            │       │   ║ │
│  ║   │   │    │   (Text, Logo, Images)  │            │       │   ║ │
│  ║   │   │    │                         │            │       │   ║ │
│  ║   │   │    └─────────────────────────┘            │       │   ║ │
│  ║   │   │                                           │       │   ║ │
│  ║   │   │    Keep important content inside          │       │   ║ │
│  ║   │   │    this green zone!                       │       │   ║ │
│  ║   │   │                                           │       │   ║ │
│  ║   │   └───────────────────────────────────────────┘       │   ║ │
│  ║   │                                                       │   ║ │
│  ║   │   ← 0.125" Safe Margin →                             │   ║ │
│  ║   │                                                       │   ║ │
│  ║   └───────────────────────────────────────────────────────┘   ║ │
│  ║                                                               ║ │
│  ║   ← 0.125" Bleed →                                            ║ │
│  ║                                                               ║ │
│  ╚═══════════════════════════════════════════════════════════════╝ │
│                                                                     │
│              Total Canvas: 3.75" × 2.25" / 1125 × 675px             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📏 Dimension Breakdown

### Layer 1: Canvas (Outermost)
```
┌─────────────────────────────────────┐
│  Total Canvas with Bleed            │
│  3.75" × 2.25"                      │
│  1125px × 675px @ 300 DPI           │
└─────────────────────────────────────┘
```

### Layer 2: Bleed Area (Red)
```
╔═══════════════════════════════════╗
║  Bleed Area (Red Overlay)         ║
║  0.125" on all sides              ║
║  37.5px @ 300 DPI                 ║
║  Purpose: Prevent white edges     ║
╚═══════════════════════════════════╝
```

### Layer 3: Trim/Cut Line (Dark Gray)
```
┌───────────────────────────────────┐
│  Final Card Size                  │
│  3.5" × 2"                        │
│  1050px × 600px @ 300 DPI         │
│  Where card will be cut           │
└───────────────────────────────────┘
```

### Layer 4: Safe Area (Green)
```
┌───────────────────────────────────┐
│  Safe Content Area                │
│  3.25" × 1.75"                    │
│  975px × 525px @ 300 DPI          │
│  Keep important content inside    │
└───────────────────────────────────┘
```

---

## 🎨 Color-Coded Zones

### 🔴 RED ZONE (Bleed Area)
- **What**: Extra area outside final card size
- **Why**: Prevents white edges if cutting is slightly off
- **Rule**: Extend background colors/images into this area
- **Warning**: Don't put important content here (will be cut off)

### ⚫ GRAY LINE (Trim/Cut Line)
- **What**: Final card boundary
- **Why**: Shows where card will be physically cut
- **Rule**: This is the final card size (3.5" × 2")
- **Warning**: Content near this line may be cut off

### 🟢 GREEN ZONE (Safe Area)
- **What**: Safe content area
- **Why**: Guarantees content won't be cut off
- **Rule**: Keep ALL important content (text, logos, QR codes) inside
- **Warning**: Content outside this area may be cut off or too close to edge

---

## 📊 Measurement Reference

### Horizontal Measurements (Width)
```
|←─────── 3.75" / 1125px ───────→|
|                                 |
|← 0.125" →|← 3.5" →|← 0.125" →|
|  Bleed   |  Card  |  Bleed   |
|          |        |          |
|  37.5px  | 1050px |  37.5px  |
|          |        |          |
|    |← 0.125" →|← 3.25" →|← 0.125" →|
|    |  Margin  |  Safe  |  Margin  |
|    |          |        |          |
|    |  37.5px  | 975px  |  37.5px  |
```

### Vertical Measurements (Height)
```
↑
│ 0.125" / 37.5px (Bleed)
↓
↑
│ 0.125" / 37.5px (Safe Margin)
↓
↑
│
│ 1.75" / 525px (Safe Area)
│
↓
↑
│ 0.125" / 37.5px (Safe Margin)
↓
↑
│ 0.125" / 37.5px (Bleed)
↓

Total: 2.25" / 675px
Card: 2.0" / 600px
```

---

## 🎯 Positioning Guide

### Element Positioning Formula

#### Center in Safe Area
```typescript
centerX = SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - (elementWidth / 2)
centerY = SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - (elementHeight / 2)

// Example for 200px wide text:
centerX = 75 + (975 / 2) - (200 / 2) = 75 + 487.5 - 100 = 462.5px
centerY = 75 + (525 / 2) - (40 / 2) = 75 + 262.5 - 20 = 317.5px
```

#### Top-Left of Safe Area
```typescript
x = SAFE_AREA_X = 75px
y = SAFE_AREA_Y = 75px
```

#### Bottom-Right of Safe Area
```typescript
x = SAFE_AREA_X + SAFE_AREA_WIDTH - elementWidth
y = SAFE_AREA_Y + SAFE_AREA_HEIGHT - elementHeight

// Example for 200px wide element:
x = 75 + 975 - 200 = 850px
y = 75 + 525 - 40 = 560px
```

---

## ⚠️ Warning Zones

### 🟠 ORANGE WARNING (Outside Safe Area)
```
┌─────────────────────────────────┐
│  ⚠️ WARNING ZONE               │
│  Content may be cut off         │
│  or too close to edge           │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ✅ SAFE ZONE          │   │
│  │  Content is safe        │   │
│  │                         │   │
│  └─────────────────────────┘   │
│                                 │
│  ⚠️ WARNING ZONE               │
└─────────────────────────────────┘
```

---

## 📐 Coordinate System

### Canvas Coordinates (0,0 at top-left)
```
(0, 0) ────────────────────────────→ X (1125)
  │
  │    BLEED AREA
  │    ┌─────────────────────────┐
  │    │ (37.5, 37.5)            │
  │    │  TRIM LINE              │
  │    │  ┌───────────────────┐  │
  │    │  │ (75, 75)          │  │
  │    │  │  SAFE AREA        │  │
  │    │  │                   │  │
  │    │  │         (1050, 600)  │
  │    │  └───────────────────┘  │
  │    │                         │
  │    └─────────────────────────┘
  ↓
  Y
(1125, 675)
```

### Key Coordinates
```
Canvas:     (0, 0) to (1125, 675)
Trim:       (37.5, 37.5) to (1087.5, 637.5)
Safe Area:  (75, 75) to (1050, 600)
```

---

## 🎨 Visual Examples

### ✅ CORRECT: Content in Safe Area
```
┌─────────────────────────────────┐
│  Bleed (Background extends)     │
│  ┌───────────────────────────┐  │
│  │  Trim Line                │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  Safe Area          │  │  │
│  │  │                     │  │  │
│  │  │  ┌─────────────┐    │  │  │
│  │  │  │ Your Logo   │    │  │  │
│  │  │  └─────────────┘    │  │  │
│  │  │                     │  │  │
│  │  │  Your Company Name  │  │  │
│  │  │  contact@email.com  │  │  │
│  │  │                     │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### ❌ WRONG: Content Outside Safe Area
```
┌─────────────────────────────────┐
│  Bleed                          │
│  ┌───────────────────────────┐  │
│  │  Trim Line                │  │
│  │  ┌─────────────────────┐  │  │
│  │  │  Safe Area          │  │  │
│┌────────────┐              │  │  │
││ Logo TOO   │              │  │  │  ⚠️ WILL BE CUT!
││ CLOSE!     │              │  │  │
│└────────────┘              │  │  │
│  │  │                     │  │  │
│  │  │  Company Name       │  │  │
│  │  │                     │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

---

## 🔍 Zoom Levels

### 50% Zoom (Minimum)
```
Display: 225 × 135 px
Actual: 1125 × 675 px
Scale: 0.2
```

### 100% Zoom (Default)
```
Display: 450 × 270 px
Actual: 1125 × 675 px
Scale: 0.4
```

### 200% Zoom (Maximum)
```
Display: 900 × 540 px
Actual: 1125 × 675 px
Scale: 0.8
```

---

## 📝 Quick Tips

### ✅ DO:
- ✅ Keep text inside green safe area
- ✅ Keep logos inside green safe area
- ✅ Extend background colors into red bleed area
- ✅ Extend background images into red bleed area
- ✅ Use high-resolution images (300 DPI)

### ❌ DON'T:
- ❌ Put important text near trim line
- ❌ Put logos outside safe area
- ❌ Use low-resolution images (<300 DPI)
- ❌ Ignore orange warning indicators
- ❌ Place QR codes outside safe area

---

## 🎓 Print Industry Terms

| Term | Definition |
|------|------------|
| **Bleed** | Extra area beyond trim line to prevent white edges |
| **Trim Line** | Where the card will be physically cut |
| **Safe Area** | Zone where content is guaranteed safe from cutting |
| **DPI** | Dots Per Inch - resolution measurement |
| **CMYK** | Color mode for professional printing |
| **RGB** | Color mode for digital/screen display |

---

**Remember**: When in doubt, keep it in the green zone! 🟢
