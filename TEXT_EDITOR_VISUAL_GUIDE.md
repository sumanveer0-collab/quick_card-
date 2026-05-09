# 🎨 Professional Text Editor - Visual Behavior Guide

## 🔍 Understanding the Text Behavior

### **BEFORE (Problem)**
```
┌─────────────────────┐
│ MAHAVEER SU...      │  ❌ Text gets cut off
│                     │  ❌ Fixed container size
└─────────────────────┘  ❌ Overflow: hidden
```

### **AFTER (Solution)**
```
┌─────────────────────┐
│ MAHAVEER SUMAN      │  ✅ Text fully visible
│                     │  ✅ Auto-expanding container
└─────────────────────┘  ✅ Overflow: visible
```

---

## 📏 Container Auto-Resize Behavior

### **Scenario 1: Font Size Increase**

**Step 1: Initial State (Font: 28px)**
```
┌──────────────────────────┐
│  MAHAVEER SUMAN          │  Height: 60px
└──────────────────────────┘
```

**Step 2: Click "+" Button (Font: 30px)**
```
┌──────────────────────────┐
│  MAHAVEER SUMAN          │  Height: 65px ⬆️
└──────────────────────────┘  (Auto-expanded)
```

**Step 3: Click "+" Again (Font: 32px)**
```
┌──────────────────────────┐
│  MAHAVEER SUMAN          │  Height: 70px ⬆️
└──────────────────────────┘  (Auto-expanded)
```

**Step 4: Large Font (Font: 44px)**
```
┌──────────────────────────┐
│                          │
│   MAHAVEER SUMAN         │  Height: 95px ⬆️
│                          │  (Auto-expanded)
└──────────────────────────┘
```

---

## 📝 Text Wrapping Behavior

### **Scenario 2: Long Text with Width Constraint**

**Step 1: Wide Container**
```
┌─────────────────────────────────────────┐
│  This is a very long text example       │  1 line
└─────────────────────────────────────────┘
```

**Step 2: Resize Width Smaller**
```
┌──────────────────────┐
│  This is a very      │  2 lines
│  long text example   │  Height auto-expanded ⬆️
└──────────────────────┘
```

**Step 3: Even Smaller Width**
```
┌──────────────┐
│  This is a   │  4 lines
│  very long   │  Height auto-expanded ⬆️
│  text        │
│  example     │
└──────────────┘
```

---

## 🎯 Card Border Clipping

### **Scenario 3: Text at Card Edge**

**Card Layout (Top View)**
```
┌─────────────────────────────────────────────┐
│ BLEED AREA (37.5px)                         │
│  ┌───────────────────────────────────────┐  │
│  │ TRIM LINE (Card Border)               │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │ SAFE AREA                       │  │  │
│  │  │                                 │  │  │
│  │  │  [Text Element]                 │  │  │
│  │  │                                 │  │  │
│  │  └─────────────────────────────────┘  │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Text Near Border (Side View)**
```
CARD BORDER (Trim Line)
│
│  ┌──────────────┐
│  │ MAHAVEER     │  ← Text container extends beyond border
│  │ SUMAN        │
│  └──────────────┘
│
│  But text clips here ✂️
│  (Layer clipping at card border)
│
▼
```

**Visual Result:**
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                    ┌──────────  │  ← Text clips at border
│                    │ MAHAVEER   │
│                    │ SUMAN      │
└────────────────────┴──────────  ┘
                     ↑
                     Card border (trim line)
```

---

## 🔧 Manual Resize Behavior

### **Scenario 4: User Drags Resize Handle**

**Step 1: Initial State**
```
┌──────────────────────────┐
│  MAHAVEER SUMAN          │  Width: 400px
└──────────────────────────┘  Height: 60px
```

**Step 2: User Drags Corner Handle Smaller**
```
┌─────────────────┐
│  MAHAVEER       │  Width: 300px ⬅️
│  SUMAN          │  Height: 75px ⬆️ (Auto-expanded for 2 lines)
└─────────────────┘
```

**Step 3: User Tries to Make Too Small**
```
┌──────────┐
│  MAHAVE  │  ❌ BLOCKED!
│  ER      │  Can't resize smaller than text content
│  SUMAN   │  boundBoxFunc prevents this
└──────────┘
```

**Step 4: User Drags Larger**
```
┌─────────────────────────────────┐
│  MAHAVEER SUMAN                 │  Width: 500px ➡️
└─────────────────────────────────┘  Height: 60px (Back to 1 line)
```

---

## 🎨 Resize Handles (Professional Style)

### **Visual Appearance**

**Selected Text Element:**
```
        Top-Left Handle
              ↓
        ┌─────●─────────────●─────┐  ← Top-Right Handle
        │                         │
        │                         │
Left    ●   MAHAVEER SUMAN        ●  Right Handle
Handle  │                         │
        │                         │
        └─────●─────────────●─────┘
              ↑                   ↑
        Bottom-Left         Bottom-Right
```

**Handle Specifications:**
- Size: 8px × 8px
- Color: Blue (#3b82f6) stroke, White fill
- Corner Radius: 2px
- Border: Dashed blue line (4px dash, 4px gap)

**Active Handles:**
- ✅ Top-Left
- ✅ Top-Right
- ✅ Bottom-Left
- ✅ Bottom-Right
- ✅ Middle-Left
- ✅ Middle-Right
- ❌ Top-Center (disabled)
- ❌ Bottom-Center (disabled)

---

## ⚠️ Safe Area Warnings

### **Scenario 5: Element Outside Safe Area**

**Inside Safe Area (Normal):**
```
┌─────────────────────────────────┐
│ Safe Area (Green Dashed)        │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │  ┌──────────────────┐     │  │
│  │  │ MAHAVEER SUMAN   │     │  │  ← Blue border (selected)
│  │  └──────────────────┘     │  │
│  │                           │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Outside Safe Area (Warning):**
```
┌─────────────────────────────────┐
│ Safe Area (Green Dashed)        │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │                           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐   │  ← Orange dashed border
│    MAHAVEER SUMAN              │  ← Warning indicator
│  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘   │
└─────────────────────────────────┘

🔔 Toast: "⚠️ Element is outside safe area!"
```

---

## 🎭 Edit Mode vs View Mode

### **View Mode (Single Click)**
```
┌──────────────────────────┐
│  MAHAVEER SUMAN          │  ← Blue border
└──────────────────────────┘  ← Resize handles visible
        ↑
   Floating Toolbar
   [Font] [Size] [Bold] [Align] [Color]
```

### **Edit Mode (Double Click)**
```
┌──────────────────────────┐
│  MAHAVEER SUMAN|         │  ← Cursor blinking
└──────────────────────────┘  ← Text is editable
        ↑
   Inline Text Editor Active
   (Can type, select, copy, paste)
```

---

## 📊 Padding Visualization

### **Text Container Structure**

**With Padding (12px horizontal, 8px vertical):**
```
┌─────────────────────────────────┐
│ ↕ 8px (Top Padding)             │
│ ┌─────────────────────────────┐ │
│ │← 12px                  12px→│ │
│ │                             │ │
│ │   MAHAVEER SUMAN            │ │  ← Actual text
│ │                             │ │
│ └─────────────────────────────┘ │
│ ↕ 8px (Bottom Padding)          │
└─────────────────────────────────┘
```

**Padding Indicator (When Selected):**
```
┌─────────────────────────────────┐
│                                 │
│ ┌─────────────────────────────┐ │
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │  ← Light blue background
│ │░░ MAHAVEER SUMAN ░░░░░░░░░░░│ │     (opacity: 0.05)
│ │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│ │     Shows text area
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## 🔄 Auto-Resize Flow Diagram

```
User Action
    ↓
┌───────────────────────────────────┐
│ Font Size Change / Text Edit     │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│ calculateTextDimensions()         │
│ - Measure text with canvas API    │
│ - Calculate word wrapping         │
│ - Count lines                     │
│ - Determine required height       │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│ Compare with current height       │
└───────────────────────────────────┘
    ↓
    ├─ Required > Current?
    │       ↓ YES
    │   ┌───────────────────────────┐
    │   │ Auto-expand container     │
    │   │ updateElement({ height }) │
    │   └───────────────────────────┘
    │
    └─ NO
        ↓
    ┌───────────────────────────────┐
    │ Keep current size             │
    └───────────────────────────────┘
```

---

## 🎯 Key Differences from Standard Text Box

| Feature | Standard Text Box | Professional Text Element |
|---------|------------------|---------------------------|
| **Overflow** | `overflow: hidden` ❌ | `overflow: visible` ✅ |
| **Resize** | Fixed size ❌ | Auto-expands ✅ |
| **Wrapping** | May truncate ❌ | Word wrap + expand ✅ |
| **Clipping** | Clips inside box ❌ | Clips at card border ✅ |
| **Handles** | Basic ❌ | Professional (VistaPrint) ✅ |
| **Measurement** | Approximate ❌ | Canvas API (precise) ✅ |

---

## 💡 User Experience Flow

### **Typical User Journey:**

1. **Add Text**
   ```
   Click "Add Text" → Text appears on canvas
   ```

2. **Edit Content**
   ```
   Double-click → Type text → Container auto-expands
   ```

3. **Style Text**
   ```
   Select → Use toolbar → Font size increases → Container grows
   ```

4. **Position Text**
   ```
   Drag to move → Orange warning if outside safe area
   ```

5. **Resize Container**
   ```
   Drag handles → Text reflows → Can't make smaller than content
   ```

6. **Final Check**
   ```
   Zoom out → Verify text is readable → Check safe area
   ```

---

## 🎓 Technical Implementation Highlights

### **1. Dual Measurement System**
```typescript
// Method 1: Konva Text actual dimensions
const actualTextHeight = textRef.current?.height() || 0

// Method 2: Canvas 2D Context measurement
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
context.font = `${fontSize}px ${fontFamily}`
const metrics = context.measureText(text)
```

### **2. Resize State Management**
```typescript
const [isResizing, setIsResizing] = useState(false)

// Prevents auto-resize during manual resize
useEffect(() => {
  if (!isResizing) {
    // Auto-resize logic
  }
}, [element.text, element.fontSize, isResizing])
```

### **3. Layer Clipping**
```typescript
<Layer
  clipX={BLEED_PX}
  clipY={BLEED_PX}
  clipWidth={CARD_WIDTH_PX}
  clipHeight={CARD_HEIGHT_PX}
>
  {/* All elements clip at card border */}
</Layer>
```

---

## 🚀 Performance Optimizations

### **1. RequestAnimationFrame**
```typescript
requestAnimationFrame(() => {
  // Auto-resize calculations
  // Runs at 60fps, prevents layout thrashing
})
```

### **2. Conditional Rendering**
```typescript
{isSelected && !isEditing && (
  <Transformer ... />  // Only render when needed
)}
```

### **3. Event Optimization**
```typescript
<Text listening={false} />  // Disable events on text
<Group draggable={!isEditing && !element.locked}>  // Handle events on group
```

---

**This visual guide demonstrates the professional text editor behavior that matches VistaPrint's industry-standard UX.**
