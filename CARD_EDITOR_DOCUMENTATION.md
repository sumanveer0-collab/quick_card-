# QuickCard Professional Business Card Editor

## 🎯 Overview

A **VistaPrint-level** professional business card customization editor built with React, Konva.js, and modern UI/UX principles. This editor provides a complete visual design experience with drag-and-drop functionality, real-time preview, and professional print guidelines.

---

## 🏗️ Architecture

### **Tech Stack**
- **React 18** + **Next.js 14** - Frontend framework
- **TypeScript** - Type safety
- **Konva.js** + **react-konva** - Canvas manipulation engine
- **Zustand** - State management
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling
- **react-colorful** - Advanced color picker
- **Lucide React** - Icon system

### **Component Structure**

```
frontend/
├── app/
│   └── card-editor/
│       └── page.tsx                 # Main editor page
├── components/
│   └── editor/
│       ├── SidebarTools.tsx         # Left tools panel
│       ├── CanvasPreview.tsx        # Center canvas with Konva
│       ├── TopbarControls.tsx       # Top control bar
│       └── ColorPicker.tsx          # Advanced color picker
└── store/
    └── editor.store.ts              # Zustand state management
```

---

## 🎨 Features

### **1. Three-Panel Layout System**

#### **LEFT SIDEBAR (Tools Panel)**
- ✅ Collapsible sections with smooth animations
- ✅ Add Elements (Text, Images, Shapes)
- ✅ Background customization (Solid + Gradient)
- ✅ Text Editor (Font, Size, Weight, Alignment, Spacing)
- ✅ Shape Editor (Fill, Stroke, Corner Radius)
- ✅ Color Picker with presets
- ✅ Delete element button

#### **CENTER CANVAS (Preview Area)**
- ✅ Business card dimensions: 3.5" × 2" (336×192px at 96 DPI)
- ✅ Drag & drop elements
- ✅ Resize handles with transformers
- ✅ Snap-to-grid functionality
- ✅ Zoom controls (50% - 200%)
- ✅ Front/Back face toggle
- ✅ Print guidelines:
  - **Bleed Area** (red dashed border)
  - **Trim Line** (blue solid border)
  - **Safety Zone** (green dashed border)
- ✅ Grid overlay (toggleable)
- ✅ Real-time element rendering

#### **TOP BAR (Control Bar)**
- ✅ Undo/Redo with history management
- ✅ Front/Back face switcher
- ✅ Element controls (when selected):
  - Duplicate
  - Bring to Front/Forward
  - Send to Back/Backward
  - Lock/Unlock
  - Delete
- ✅ Zoom controls (+/- and reset)
- ✅ View toggles (Grid, Bleed, Snap)
- ✅ Export buttons (PNG, PDF)
- ✅ Save design

---

## 🎯 Core Functionality

### **Element Management**

#### **Text Elements**
```typescript
{
  type: 'text',
  text: string,
  fontSize: number,
  fontFamily: string,
  fontWeight: string,
  fill: string,
  align: 'left' | 'center' | 'right',
  letterSpacing: number,
  lineHeight: number,
  x, y, width, height, rotation
}
```

**Features:**
- Double-click to edit text inline
- Font family dropdown (10 fonts)
- Font size slider (8-72px)
- Font weight options (normal, bold, 600, 700, 800)
- Text alignment (left, center, right)
- Color picker with HEX support
- Letter spacing control (-5 to 20px)
- Line height control (0.8 to 2.5)

#### **Image Elements**
```typescript
{
  type: 'image',
  src: string (base64 or URL),
  x, y, width, height, rotation
}
```

**Features:**
- Upload from file (max 5MB)
- Drag to reposition
- Resize with handles
- Rotate
- Maintain aspect ratio

#### **Shape Elements**
```typescript
{
  type: 'shape',
  shapeType: 'rect' | 'circle' | 'line',
  fill: string,
  stroke: string,
  strokeWidth: number,
  cornerRadius: number (rect only),
  x, y, width, height, rotation
}
```

**Features:**
- Rectangle, Circle, Line shapes
- Fill color picker
- Stroke color picker
- Stroke width slider (0-20px)
- Corner radius for rectangles (0-50px)

---

### **Layer Management**

- **Z-Index System**: Each element has a zIndex property
- **Bring Forward**: Move element up one layer
- **Send Backward**: Move element down one layer
- **Bring to Front**: Move element to top layer
- **Send to Back**: Move element to bottom layer
- **Visual Feedback**: Selected elements show blue stroke

---

### **Canvas Controls**

#### **Zoom System**
- Range: 50% - 200%
- Increment: 10%
- Keyboard shortcuts: Ctrl + Plus/Minus
- Reset to 100% button

#### **Grid System**
- Grid size: 10px
- Toggle visibility
- Snap-to-grid functionality
- Visual grid lines in light gray

#### **Print Guidelines**
```
Bleed Area:    12px (0.125")  - Red dashed border
Trim Line:     0px            - Blue solid border
Safety Zone:   18px (0.1875") - Green dashed border
```

**Purpose:**
- **Bleed**: Extra area for printing (content can extend here)
- **Trim**: Exact cut line for final card
- **Safety**: Keep important content inside this zone

---

### **Color System**

#### **Solid Colors**
- HEX color picker with live preview
- 20 preset colors
- Manual HEX input
- Color swatch preview

#### **Gradient Colors**
- Two-color gradient builder
- Angle control (0-360°)
- Live gradient preview
- 6 gradient presets
- Format: `linear-gradient(135deg, #color1, #color2)`

---

### **History Management**

#### **Undo/Redo System**
```typescript
interface EditorHistory {
  past: CanvasElement[][]
  present: CanvasElement[]
  future: CanvasElement[][]
}
```

**Features:**
- Unlimited undo/redo
- Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo)
- Visual feedback (disabled when no history)
- Automatic history save on changes

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + Shift + Z` | Redo (alternative) |
| `Ctrl + D` | Duplicate selected element |
| `Delete` | Delete selected element |
| `Backspace` | Delete selected element |
| `Escape` | Deselect element |

---

## 🎨 Design System

### **Colors**
- **Primary**: Blue (#3b82f6, #2563eb)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Gray Scale**: 50-900

### **Typography**
- **Font Families**: Inter, Poppins, Montserrat, Playfair Display, Roboto, Lato, Raleway, Oswald, Georgia, Arial
- **Font Sizes**: 8px - 72px
- **Font Weights**: 400 (normal), 600, 700 (bold), 800

### **Spacing**
- **Grid Size**: 10px
- **Padding**: 4px, 8px, 12px, 16px, 20px, 24px
- **Border Radius**: 8px, 12px, 16px, 20px, 24px

### **Shadows**
- **Small**: `0 1px 2px rgba(0,0,0,0.05)`
- **Medium**: `0 4px 6px rgba(0,0,0,0.1)`
- **Large**: `0 10px 15px rgba(0,0,0,0.1)`
- **XL**: `0 20px 25px rgba(0,0,0,0.1)`
- **2XL**: `0 25px 50px rgba(0,0,0,0.25)`

---

## 📐 Canvas Specifications

### **Dimensions**
- **Card Size**: 3.5" × 2" (standard business card)
- **Pixels (96 DPI)**: 336px × 192px
- **Pixels (300 DPI)**: 1050px × 600px (for print export)

### **Print Guidelines**
```
Total Canvas:  360px × 216px (with bleed)
Card Area:     336px × 192px
Safety Zone:   300px × 156px (inside margins)
```

### **Coordinate System**
- Origin: Top-left corner (0, 0)
- X-axis: Left to right
- Y-axis: Top to bottom

---

## 🔄 State Management (Zustand)

### **Store Structure**
```typescript
interface EditorState {
  // Elements
  elements: CanvasElement[]
  selectedId: string | null
  
  // Canvas settings
  zoom: number
  showGrid: boolean
  showBleed: boolean
  showTrim: boolean
  showSafety: boolean
  snapToGrid: boolean
  gridSize: number
  currentFace: 'front' | 'back'
  background: string
  
  // History
  history: EditorHistory
  
  // Actions
  addElement, updateElement, deleteElement,
  selectElement, duplicateElement,
  bringForward, sendBackward,
  bringToFront, sendToBack,
  setZoom, toggleGrid, toggleBleed,
  undo, redo, saveHistory, reset
}
```

---

## 🚀 Usage

### **1. Access the Editor**
```
Navigate to: /card-editor
```

### **2. Add Elements**
- Click "Text" to add text element
- Click "Image" to upload image
- Click "Rectangle" or "Circle" to add shapes

### **3. Edit Elements**
- **Select**: Click on element
- **Move**: Drag element
- **Resize**: Drag corner handles
- **Edit Text**: Double-click text element
- **Style**: Use left sidebar controls

### **4. Layer Management**
- Select element
- Use top bar buttons to change layer order

### **5. Export**
- Click "PNG" for high-quality image
- Click "PDF" for print-ready file
- Click "Save" to save design

---

## 🎯 UX Details

### **Smooth Animations**
- Framer Motion for all transitions
- 200ms duration for most animations
- Ease-in-out timing function
- Hover states on all interactive elements

### **Visual Feedback**
- Selected elements: Blue stroke
- Hover states: Background color change
- Disabled states: 30% opacity
- Loading states: Spinner animation

### **Responsive Design**
- Minimum width: 1280px (desktop-first)
- Sidebar: Fixed 320px width
- Canvas: Flexible, centered
- Top bar: Full width, fixed height

### **Accessibility**
- Keyboard navigation support
- Focus indicators
- ARIA labels on buttons
- Semantic HTML structure

---

## 📦 Export System

### **PNG Export**
- Format: PNG
- Quality: High (pixelRatio: 3-4)
- Dimensions: 336×192px (standard) or 1050×600px (print)
- Includes: All visible elements + background

### **PDF Export**
- Format: PDF
- Page size: 3.5" × 2" (landscape)
- Bleed: 0.125" (optional)
- Crop marks: Included in print mode
- Quality: 300 DPI

---

## 🔮 Future Enhancements

### **Phase 2 (Advanced Features)**
- [ ] Auto-align guides (Figma-style)
- [ ] Snap spacing indicators
- [ ] Smart guides for alignment
- [ ] Element grouping
- [ ] Copy/paste between faces

### **Phase 3 (Pro Features)**
- [ ] QR code generator
- [ ] AI template suggestions
- [ ] Background removal for images
- [ ] Custom fonts upload
- [ ] Template library integration
- [ ] Collaboration features

### **Phase 4 (Print Integration)**
- [ ] Direct print ordering
- [ ] Print preview mode
- [ ] CMYK color conversion
- [ ] Print specifications validator
- [ ] Bulk card generation

---

## 🐛 Known Limitations

1. **Browser Compatibility**: Best in Chrome/Edge (Chromium)
2. **Mobile Support**: Desktop-only (responsive mobile coming soon)
3. **File Size**: Image uploads limited to 5MB
4. **Performance**: May slow with 50+ elements
5. **Fonts**: Limited to web-safe fonts (custom fonts coming)

---

## 📝 Code Examples

### **Adding a Text Element**
```typescript
import { useEditorStore } from '@/store/editor.store'

const { addElement } = useEditorStore()

addElement({
  type: 'text',
  x: 100,
  y: 100,
  width: 200,
  height: 40,
  rotation: 0,
  text: 'Hello World',
  fontSize: 24,
  fontFamily: 'Inter',
  fontWeight: 'bold',
  fill: '#000000',
  align: 'center',
  visible: true,
})
```

### **Updating an Element**
```typescript
const { updateElement } = useEditorStore()

updateElement('element-id', {
  fontSize: 32,
  fill: '#3b82f6',
  fontWeight: 'bold',
})
```

### **Layer Management**
```typescript
const { bringToFront, sendToBack } = useEditorStore()

bringToFront('element-id')
sendToBack('element-id')
```

---

## 🎓 Best Practices

### **Performance**
1. Limit elements to 30-40 for smooth performance
2. Optimize images before upload (compress, resize)
3. Use solid colors instead of gradients when possible
4. Avoid excessive undo/redo operations

### **Design**
1. Keep important content inside safety zone
2. Use high-contrast colors for readability
3. Maintain consistent font families (2-3 max)
4. Align elements to grid for clean layout
5. Test print preview before exporting

### **Workflow**
1. Start with background color/gradient
2. Add main text elements first
3. Add decorative shapes/images
4. Fine-tune spacing and alignment
5. Export and review

---

## 🔧 Troubleshooting

### **Element not dragging**
- Check if element is locked (lock icon in top bar)
- Ensure element is selected (blue stroke)

### **Text not editable**
- Double-click the text element
- Ensure text element is selected

### **Export not working**
- Check browser console for errors
- Ensure all images are loaded
- Try reducing canvas zoom to 100%

### **Slow performance**
- Reduce number of elements
- Disable grid overlay
- Close other browser tabs
- Restart browser

---

## 📚 Resources

- **Konva.js Docs**: https://konvajs.org/docs/
- **React Konva**: https://github.com/konvajs/react-konva
- **Zustand**: https://github.com/pmndrs/zustand
- **Framer Motion**: https://www.framer.com/motion/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 🎉 Credits

Built with ❤️ for **QuickCard** - Professional Business Card Generator

**Version**: 1.0.0  
**Last Updated**: May 2026  
**License**: Proprietary

---

*For support or feature requests, contact the development team.*
