# 🚀 Quick Installation Guide - Advanced VistaPrint Editor

## ✅ 3-Step Installation

### **Step 1: Install Color Picker**
```bash
cd frontend
npm install react-colorful
```

### **Step 2: Update Customize Page**
Open `frontend/app/customize/page.tsx` and replace the import:

```typescript
// OLD:
import FloatingToolbar from '@/components/customize/FloatingToolbar'

// NEW:
import AdvancedTextToolbar from '@/components/customize/AdvancedTextToolbar'
```

Then replace the component:

```typescript
// OLD:
{selectedId && <FloatingToolbar />}

// NEW:
{selectedId && <AdvancedTextToolbar />}
```

### **Step 3: Start the Server**
```bash
npm run dev
```

Navigate to: `http://localhost:3000/customize`

---

## ✅ What You Get

### **Advanced Toolbar with:**
- ✅ 16 Font families
- ✅ Font size slider (8-200px)
- ✅ 6 Font weights
- ✅ Bold, Italic, Underline
- ✅ 4 Text alignments
- ✅ HEX color picker
- ✅ Outline/stroke color
- ✅ Text transform (AA, aa, Aa)
- ✅ Rotation controls
- ✅ Letter spacing slider
- ✅ Line height slider
- ✅ Opacity slider
- ✅ Layer management
- ✅ Lock, duplicate, delete

---

## 🎯 Test Checklist

### **Basic Features:**
- [ ] Select text element
- [ ] Toolbar appears
- [ ] Change font family
- [ ] Adjust font size with slider
- [ ] Click Bold button
- [ ] Change text color
- [ ] Change alignment

### **Advanced Features:**
- [ ] Open color picker (HEX)
- [ ] Add text outline
- [ ] Adjust letter spacing
- [ ] Adjust line height
- [ ] Change opacity
- [ ] Rotate text
- [ ] Transform to uppercase

### **Layer Controls:**
- [ ] Open layers menu
- [ ] Bring to front
- [ ] Send to back
- [ ] Lock element
- [ ] Duplicate element
- [ ] Delete element

---

## 💡 Pro Tips

### **Tip 1: Color Picker**
Click the palette icon to open the HEX color picker. You can:
- Drag to select color
- Type HEX code directly
- See live preview

### **Tip 2: Sliders**
Use sliders for fine control:
- Letter spacing: -5 to 20
- Line height: 0.8 to 3.0
- Opacity: 0% to 100%

### **Tip 3: Text Transform**
Quick case conversion:
- AA = UPPERCASE
- aa = lowercase
- Aa = Capitalize Each Word

### **Tip 4: Layers**
Manage element stacking:
- Bring to Front = Top layer
- Send to Back = Bottom layer
- Forward/Backward = One layer at a time

---

## 🐛 Troubleshooting

### **Issue: Toolbar doesn't appear**
**Solution:** Make sure you've replaced `FloatingToolbar` with `AdvancedTextToolbar` in the customize page.

### **Issue: Color picker not working**
**Solution:** Install `react-colorful`:
```bash
npm install react-colorful
```

### **Issue: Fonts not loading**
**Solution:** Fonts are loaded from system. For Google Fonts, add to `layout.tsx`:
```typescript
import { Inter, Poppins, Montserrat } from 'next/font/google'
```

---

## 📚 Documentation

- **Complete Guide**: `VISTAPRINT_ADVANCED_FEATURES_COMPLETE.md`
- **Feature List**: All VistaPrint features implemented
- **Code Examples**: See `AdvancedTextToolbar.tsx`

---

## 🎉 You're Done!

Your professional VistaPrint-style editor is ready to use! 🎨✨

**Next Steps:**
1. Test all features
2. Customize colors/fonts as needed
3. Add more templates
4. Implement export functionality
