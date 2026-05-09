# QuickCard Professional Editor - Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

The required packages have already been installed:

```bash
cd frontend
npm install konva react-konva@18 react-colorful use-image --legacy-peer-deps
```

**Installed Packages:**
- `konva` - Canvas manipulation library
- `react-konva@18` - React bindings for Konva (compatible with React 18)
- `react-colorful` - Advanced color picker component
- `use-image` - React hook for loading images in Konva

---

### 2. File Structure

```
frontend/
├── app/
│   └── card-editor/
│       └── page.tsx                 ✅ Main editor page
├── components/
│   └── editor/
│       ├── SidebarTools.tsx         ✅ Left tools panel
│       ├── CanvasPreview.tsx        ✅ Canvas with Konva
│       ├── TopbarControls.tsx       ✅ Top control bar
│       └── ColorPicker.tsx          ✅ Color picker
└── store/
    └── editor.store.ts              ✅ Zustand store
```

---

### 3. Access the Editor

**Development:**
```bash
cd frontend
npm run dev
```

**Navigate to:**
```
http://localhost:3000/card-editor
```

---

## 🎯 Features Implemented

### ✅ **Core Features**
- [x] Three-panel layout (Sidebar, Canvas, Topbar)
- [x] Drag & drop elements
- [x] Resize with handles
- [x] Rotate elements
- [x] Snap to grid
- [x] Zoom controls (50%-200%)
- [x] Undo/Redo with history
- [x] Front/Back face toggle

### ✅ **Element Types**
- [x] Text (with full typography controls)
- [x] Images (upload & resize)
- [x] Shapes (Rectangle, Circle, Line)

### ✅ **Styling Controls**
- [x] Background (Solid + Gradient)
- [x] Color picker with presets
- [x] Font family (10 fonts)
- [x] Font size (8-72px)
- [x] Font weight
- [x] Text alignment
- [x] Letter spacing
- [x] Line height
- [x] Shape fill & stroke

### ✅ **Layer Management**
- [x] Bring to Front/Forward
- [x] Send to Back/Backward
- [x] Lock/Unlock elements
- [x] Delete elements
- [x] Duplicate elements

### ✅ **Print Guidelines**
- [x] Bleed area (red dashed)
- [x] Trim line (blue solid)
- [x] Safety zone (green dashed)
- [x] Grid overlay
- [x] Dimension labels

### ✅ **UX Enhancements**
- [x] Smooth animations (Framer Motion)
- [x] Keyboard shortcuts
- [x] Collapsible sidebar sections
- [x] Welcome tutorial
- [x] Visual feedback
- [x] Hover states

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + D` | Duplicate |
| `Delete` | Delete element |
| `Escape` | Deselect |

---

## 🎨 Usage Examples

### **1. Add Text**
1. Click "Text" button in sidebar
2. Double-click text to edit
3. Use sidebar to customize font, size, color

### **2. Add Image**
1. Click "Image" button in sidebar
2. Select image file (max 5MB)
3. Drag to reposition, resize with handles

### **3. Add Shape**
1. Click "Rectangle" or "Circle" in sidebar
2. Drag to reposition
3. Use sidebar to customize fill, stroke

### **4. Change Background**
1. Open "Background" section in sidebar
2. Choose solid color or gradient
3. Use presets or custom colors

### **5. Layer Management**
1. Select element
2. Use top bar buttons to change order
3. Lock element to prevent accidental moves

---

## 🔧 Configuration

### **Canvas Dimensions**
Edit in `frontend/components/editor/CanvasPreview.tsx`:
```typescript
const CARD_WIDTH = 336  // 3.5 inches at 96 DPI
const CARD_HEIGHT = 192 // 2 inches at 96 DPI
const BLEED = 12        // 0.125 inch bleed
const SAFETY_MARGIN = 18 // 0.1875 inch safety
```

### **Grid Size**
Edit in `frontend/store/editor.store.ts`:
```typescript
gridSize: 10, // pixels
```

### **Zoom Range**
Edit in `frontend/store/editor.store.ts`:
```typescript
setZoom: (zoom) => set({ zoom: Math.max(50, Math.min(200, zoom)) }),
```

### **Font List**
Edit in `frontend/components/editor/SidebarTools.tsx`:
```typescript
const FONTS = [
  'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Raleway', 'Oswald', 'Georgia', 'Arial'
]
```

---

## 🐛 Troubleshooting

### **Issue: Konva not rendering**
**Solution:**
- Check browser console for errors
- Ensure `react-konva@18` is installed (not v19)
- Clear node_modules and reinstall

### **Issue: Images not loading**
**Solution:**
- Check image file size (max 5MB)
- Ensure image format is supported (PNG, JPG, SVG)
- Check browser console for CORS errors

### **Issue: Slow performance**
**Solution:**
- Reduce number of elements
- Disable grid overlay
- Lower zoom level
- Close other browser tabs

### **Issue: Export not working**
**Solution:**
- Export feature is placeholder (implement with html-to-image)
- Check browser console for errors

---

## 📦 Next Steps

### **Phase 1: Complete Export**
```typescript
// In TopbarControls.tsx
import { toPng } from 'html-to-image'

const handleExportPNG = async () => {
  const stage = stageRef.current
  const dataURL = stage.toDataURL({ pixelRatio: 3 })
  // Download logic
}
```

### **Phase 2: Add Templates**
- Create template presets
- Load template data into canvas
- Save custom templates

### **Phase 3: Integration**
- Connect to backend API
- Save designs to database
- Load existing designs

### **Phase 4: Advanced Features**
- QR code generator
- AI suggestions
- Background removal
- Custom fonts

---

## 📚 Documentation

- **Full Documentation**: See `CARD_EDITOR_DOCUMENTATION.md`
- **API Reference**: See component files for detailed props
- **State Management**: See `editor.store.ts` for Zustand store

---

## 🎉 Success!

Your professional business card editor is now ready! 🚀

**Access it at:** `http://localhost:3000/card-editor`

---

## 💡 Tips

1. **Start Simple**: Add text and shapes first
2. **Use Grid**: Enable snap-to-grid for alignment
3. **Safety Zone**: Keep important content inside green zone
4. **Keyboard Shortcuts**: Use Ctrl+Z/Y for undo/redo
5. **Layer Order**: Use top bar to manage element stacking

---

## 🆘 Support

For issues or questions:
1. Check `CARD_EDITOR_DOCUMENTATION.md`
2. Review component code comments
3. Check browser console for errors
4. Contact development team

---

**Happy Designing! 🎨**
