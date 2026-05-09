# QuickCard Professional Editor - Quick Reference

## 🚀 Quick Start

```bash
# 1. Navigate to frontend
cd frontend

# 2. Dependencies already installed
# konva, react-konva@18, react-colorful, use-image

# 3. Start dev server
npm run dev

# 4. Open browser
http://localhost:3000/card-editor
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + D` | Duplicate |
| `Delete` | Delete |
| `Escape` | Deselect |

---

## 🎨 Quick Actions

### Add Elements
- **Text**: Click "Text" button → Double-click to edit
- **Image**: Click "Image" button → Select file (max 5MB)
- **Shape**: Click "Rectangle" or "Circle" button

### Edit Elements
- **Move**: Drag element
- **Resize**: Drag corner handles
- **Rotate**: Use rotation handle
- **Style**: Use left sidebar controls

### Layer Management
- **Front**: Click "Bring to Front" button
- **Back**: Click "Send to Back" button
- **Lock**: Click lock icon
- **Delete**: Click delete button or press Delete key

---

## 📐 Canvas Dimensions

```
Card Size:     3.5" × 2" (336×192px)
Bleed:         0.125" (12px)
Safety Zone:   0.1875" (18px inside)
Grid Size:     10px
Zoom Range:    50% - 200%
```

---

## 🎯 Print Guidelines

| Zone | Color | Purpose |
|------|-------|---------|
| **Bleed** | Red dashed | Extra area for printing |
| **Trim** | Blue solid | Exact cut line |
| **Safety** | Green dashed | Keep content inside |

---

## 📁 File Locations

```
frontend/
├── app/card-editor/page.tsx          # Main editor
├── components/editor/
│   ├── SidebarTools.tsx              # Left panel
│   ├── CanvasPreview.tsx             # Canvas
│   ├── TopbarControls.tsx            # Top bar
│   └── ColorPicker.tsx               # Color picker
└── store/editor.store.ts             # State
```

---

## 🔧 Common Tasks

### Change Background
1. Open "Background" section in sidebar
2. Choose solid or gradient
3. Use color picker or presets

### Customize Text
1. Select text element
2. Open "Text Editor" section
3. Adjust font, size, color, etc.

### Export Card
1. Click "PNG" or "PDF" button in top bar
2. (Feature placeholder - implement with html-to-image)

---

## 🐛 Quick Fixes

**Element won't drag?**
→ Check if locked (lock icon in top bar)

**Text won't edit?**
→ Double-click the text element

**Slow performance?**
→ Reduce elements, disable grid, lower zoom

**Export not working?**
→ Feature placeholder (needs implementation)

---

## 📚 Documentation

- **Full Docs**: `CARD_EDITOR_DOCUMENTATION.md`
- **Setup Guide**: `EDITOR_SETUP.md`
- **Summary**: `EDITOR_IMPLEMENTATION_SUMMARY.md`

---

## 💡 Pro Tips

1. Use **Snap to Grid** for perfect alignment
2. Keep content inside **Safety Zone** (green)
3. Use **Ctrl+D** to quickly duplicate elements
4. **Lock** elements to prevent accidental moves
5. Use **Zoom** for detailed work

---

## 🎨 Color Presets

**Solid Colors** (20 presets):
- Blues, Purples, Greens, Reds, Oranges, etc.

**Gradient Presets** (6 presets):
- Purple-Pink, Blue-Cyan, Purple-Pink, Orange-Red, Green, Blue

---

## 🔤 Font Options

Inter • Poppins • Montserrat • Playfair Display  
Roboto • Lato • Raleway • Oswald • Georgia • Arial

---

## 📊 Element Types

### Text
- Font family, size, weight
- Color, alignment
- Letter spacing, line height

### Image
- Upload (max 5MB)
- Drag, resize, rotate

### Shape
- Rectangle, Circle, Line
- Fill, stroke, corner radius

---

## 🎯 Workflow

1. **Add** elements (text, images, shapes)
2. **Style** using sidebar controls
3. **Arrange** with layer management
4. **Align** using grid and snap
5. **Export** as PNG or PDF

---

## 🆘 Need Help?

1. Check `CARD_EDITOR_DOCUMENTATION.md`
2. Review component code comments
3. Check browser console
4. Contact development team

---

**Quick Access**: `http://localhost:3000/card-editor`

**Happy Designing! 🎨**
