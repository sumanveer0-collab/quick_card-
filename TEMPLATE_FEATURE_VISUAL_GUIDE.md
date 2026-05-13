# 🎨 Template Feature - Visual Guide

## 📍 Feature Locations

### 1. Default Template (Auto-loads)
```
When you open: http://localhost:3000/customize

Canvas automatically shows:
┌─────────────────────────────────┐
│ ○                               │
│                                 │
│        Your Company             │
│         Your Name               │
│         Job Title               │
│    ─────────────────────        │
│    📞 +1 (555) 123-4567         │
│    ✉️ your.email@company.com    │
│    🌐 www.yourcompany.com       │
│                               ○ │
└─────────────────────────────────┘
```

---

### 2. Change Template Button
```
Top Toolbar:
┌─────────────────────────────────────────────────┐
│ [← Back]  [Change Template] [Text Editor] ...  │
└─────────────────────────────────────────────────┘
              ↑
         Click here!
```

---

### 3. Template Selector Modal
```
┌───────────────────────────────────────────────┐
│ Choose Template                          [×]  │
│ Select a template to start your design       │
├───────────────────────────────────────────────┤
│ 🔍 Search templates...  [All Categories ▼]   │
├───────────────────────────────────────────────┤
│                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │    D    │  │    G    │  │    M    │      │
│  │         │  │         │  │         │      │
│  │ Default │  │ Graphic │  │ Modern  │      │
│  │  Card   │  │  Mitra  │  │  Green  │      │
│  │ [Basic] │  │[Creative]│  │[Modern] │      │
│  └─────────┘  └─────────┘  └─────────┘      │
│                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │    C    │  │    L    │  │    T    │      │
│  │         │  │         │  │         │      │
│  │Corporate│  │  Luxury │  │  Tech   │      │
│  │  Blue   │  │  Gold   │  │ Startup │      │
│  │[Corporate]│ │[Luxury] │  │  [Tech] │      │
│  └─────────┘  └─────────┘  └─────────┘      │
│                                               │
├───────────────────────────────────────────────┤
│ 6 templates available            [Cancel]    │
└───────────────────────────────────────────────┘
```

---

## 🎯 User Interactions

### Opening Editor (First Time)
```
Step 1: Navigate to /customize
        ↓
Step 2: Default template loads automatically
        ↓
Step 3: Canvas shows professional business card
        ↓
Step 4: Start editing!
```

---

### Changing Template
```
Step 1: Click "Change Template" button
        ↓
Step 2: Modal opens with template grid
        ↓
Step 3: Search or filter (optional)
        ↓
Step 4: Hover over template card
        ↓
        ┌─────────┐
        │    D    │ ← Hover effects:
        │    ✓    │   - Scale up
        │ Default │   - Shadow
        │  Card   │   - Check icon
        │ [Basic] │   - Blue overlay
        └─────────┘
        ↓
Step 5: Click template
        ↓
Step 6: Confirmation dialog
        ┌─────────────────────────────┐
        │ This will replace your      │
        │ current design. Continue?   │
        │                             │
        │   [Cancel]  [OK]            │
        └─────────────────────────────┘
        ↓
Step 7: Click OK
        ↓
Step 8: Canvas clears
        ↓
Step 9: New template loads
        ↓
Step 10: Success toast appears
         ┌──────────────────────────┐
         │ ✓ Template "Default Card"│
         │   loaded!                │
         └──────────────────────────┘
        ↓
Step 11: Modal closes
        ↓
Step 12: Start customizing!
```

---

## 🎨 Visual States

### Template Card States

**Normal State**:
```
┌─────────┐
│    D    │
│         │
│ Default │
│  Card   │
│ [Basic] │
└─────────┘
```

**Hover State**:
```
┌─────────┐ ← Scaled up (1.02x)
│    D  ✓ │ ← Check icon appears
│    ▓    │ ← Blue overlay
│ Default │ ← Text turns blue
│  Card   │
│ [Basic] │
└─────────┘
    ↑
  Shadow increases
```

**Click State**:
```
┌─────────┐ ← Scales down (0.98x)
│    D  ✓ │
│    ▓    │
│ Default │
│  Card   │
│ [Basic] │
└─────────┘
```

---

## 🎯 Default Template Layout

### Element Positions
```
Canvas (800x550px):

Y=80:  ┌─────────────────────┐
       │   Your Company      │ ← Company Name (48px, bold)
       └─────────────────────┘

Y=180: ┌─────────────────────┐
       │    Your Name        │ ← Name (32px, blue)
       └─────────────────────┘

Y=240: ┌─────────────────────┐
       │    Job Title        │ ← Title (20px, gray)
       └─────────────────────┘

Y=300: ─────────────────────── ← Divider Line

Y=340: 📞 +1 (555) 123-4567    ← Phone

Y=385: ✉️ your.email@company.com ← Email

Y=430: 🌐 www.yourcompany.com   ← Website

Decorative:
○ (50, 30)  - Top-left circle
○ (710, 480) - Bottom-right circle
```

---

## 🎨 Color Scheme

### Default Template Colors
```
Company Name:  #1F2937 (Gray 800)
Your Name:     #3B82F6 (Blue 500)
Job Title:     #6B7280 (Gray 500)
Divider:       #E5E7EB (Gray 200)
Contact Info:  #374151 (Gray 700)
Decorative:    #3B82F6 (Blue 500, 20% opacity)
Background:    #FFFFFF (White)
```

### Change Template Button
```
Background: Green-Teal Gradient
  from-green-100 to-teal-100
  
Hover: Darker Gradient
  from-green-200 to-teal-200
  
Text: Green 700
  #047857
  
Icon: Layout icon
```

### Modal Colors
```
Header Background: Blue-Purple Gradient
  from-blue-50 to-purple-50
  
Modal Background: White
  #FFFFFF
  
Border: Gray 200
  #E5E7EB
  
Category Badge: Blue
  bg-blue-100 text-blue-600
  
Hover Overlay: Blue 500 (10% opacity)
  bg-blue-500/10
```

---

## 📱 Responsive Behavior

### Desktop (1920px+)
```
Modal: 4xl width (896px)
Grid: 3 columns
Cards: Large preview
```

### Laptop (1366px+)
```
Modal: 4xl width (896px)
Grid: 3 columns
Cards: Medium preview
```

### Tablet (768px+)
```
Modal: Full width - 40px
Grid: 2 columns
Cards: Medium preview
```

### Mobile (375px+)
```
Modal: Full width - 20px
Grid: 1 column
Cards: Full width
```

---

## 🎯 Animation Timeline

### Modal Open
```
0ms:   Backdrop opacity: 0
       Modal scale: 0.95, y: 20
       ↓
200ms: Backdrop opacity: 1
       Modal scale: 1, y: 0
       ↓
       Modal fully visible
```

### Template Card Hover
```
0ms:   Scale: 1.0, y: 0
       Border: gray-200
       Shadow: none
       ↓
200ms: Scale: 1.02, y: -2
       Border: blue-500
       Shadow: large
       Plus icon: visible
       Overlay: visible
```

### Template Selection
```
0ms:   Click template
       ↓
100ms: Confirmation dialog
       ↓
       User confirms
       ↓
200ms: Canvas clears
       ↓
400ms: New template loads
       ↓
600ms: Success toast
       ↓
800ms: Modal closes
```

---

## 🎊 Visual Summary

### Before (Blank Canvas)
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│         Empty Canvas            │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### After (Default Template)
```
┌─────────────────────────────────┐
│ ○                               │
│        Your Company             │
│         Your Name               │
│         Job Title               │
│    ─────────────────────        │
│    📞 +1 (555) 123-4567         │
│    ✉️ your.email@company.com    │
│    🌐 www.yourcompany.com       │
│                               ○ │
└─────────────────────────────────┘
```

### After Changing Template
```
┌─────────────────────────────────┐
│                                 │
│    [Different Template]         │
│    [Different Layout]           │
│    [Different Colors]           │
│    [Different Elements]         │
│                                 │
│                                 │
└─────────────────────────────────┘
```

---

## 🚀 Quick Reference

### Key Features
- ✅ Auto-loads default template
- ✅ Change Template button in toolbar
- ✅ Beautiful modal with search
- ✅ Category filtering
- ✅ Hover effects
- ✅ Confirmation dialog
- ✅ Success notification

### Key Files
- `default-template.ts` - Template definition
- `ChangeTemplateModal.tsx` - Modal component
- `customize/page.tsx` - Integration

### Key Functions
- `loadDefaultTemplate()` - Auto-load on open
- `handleSelectTemplate()` - Change template
- `reset()` - Clear canvas
- `addElement()` - Add elements

---

## 🎉 Enjoy!

Your template system is now fully functional with:
- Professional default template
- Easy template switching
- Beautiful UI
- Smooth animations

**Start creating amazing business cards!** 🚀✨
