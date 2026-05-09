# 🚀 Quick Reference: Advanced Text Toolbar

## 📦 Installation (Already Done ✅)

```bash
cd frontend
npm install react-colorful  # ✅ Already installed
```

## 📁 File Structure

```
frontend/
├── components/
│   └── customize/
│       ├── AdvancedTextToolbar.tsx    ← Main toolbar component
│       ├── ProfessionalTextElement.tsx ← Canvas text element
│       └── CustomizeCanvas.tsx         ← Canvas container
├── store/
│   └── editor.store.ts                 ← State management
└── app/
    └── customize/
        └── page.tsx                    ← Main page (integrated)
```

## 🎯 Quick Start

### 1. Import the Toolbar
```typescript
import AdvancedTextToolbar from '@/components/customize/AdvancedTextToolbar'
```

### 2. Use in Your Page
```typescript
{selectedId && <AdvancedTextToolbar />}
```

### 3. That's It!
The toolbar automatically:
- Reads selected element from store
- Updates element properties
- Handles all user interactions
- Manages dropdowns and color pickers

## 🔧 Store Integration

### Access Store
```typescript
import { useEditorStore } from '@/store/editor.store'

const { 
  elements,           // All canvas elements
  selectedId,         // Currently selected element ID
  updateElement,      // Update element properties
  duplicateElement,   // Duplicate element
  deleteElement,      // Delete element
  bringForward,       // Move layer up
  sendBackward,       // Move layer down
  bringToFront,       // Move to top
  sendToBack,         // Move to bottom
  undo,              // Undo last change
  redo,              // Redo change
} = useEditorStore()
```

### Update Element
```typescript
// Change font size
updateElement(selectedId, { fontSize: 48 })

// Change color
updateElement(selectedId, { fill: '#FF0000' })

// Change multiple properties
updateElement(selectedId, { 
  fontSize: 48,
  fill: '#FF0000',
  fontWeight: 'bold'
})
```

## 🎨 Element Properties

### Text Element Interface
```typescript
interface CanvasElement {
  id: string
  type: 'text' | 'image' | 'shape'
  x: number
  y: number
  width: number
  height: number
  rotation: number
  
  // Text properties
  text?: string
  fontSize?: number              // 8-200
  fontFamily?: string            // 'Inter', 'Poppins', etc.
  fontWeight?: string            // 'normal', 'bold', '300', etc.
  fill?: string                  // HEX color '#000000'
  stroke?: string                // Outline color
  strokeWidth?: number           // 0-10
  align?: 'left' | 'center' | 'right' | 'justify'
  letterSpacing?: number         // -5 to 20
  lineHeight?: number            // 0.8 to 3.0
  opacity?: number               // 0 to 1
  
  // Layer
  zIndex: number
  locked?: boolean
  visible?: boolean
}
```

## ⌨️ Keyboard Shortcuts

```typescript
// In your page component
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()
      undo()
    }
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()
      redo()
    }
    if (e.ctrlKey && e.key === 'd') {
      e.preventDefault()
      duplicateElement(selectedId)
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      deleteElement(selectedId)
    }
    if (e.key === 'Escape') {
      selectElement(null)
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

## 🎨 Customization

### Change Toolbar Position
```typescript
// In AdvancedTextToolbar.tsx
<motion.div
  className="absolute top-20 left-1/2 transform -translate-x-1/2"
  // Change to:
  // top-10 = Higher
  // top-40 = Lower
  // left-0 = Left side
  // right-0 = Right side
>
```

### Add More Fonts
```typescript
// In AdvancedTextToolbar.tsx
const FONTS = [
  'Secuela',
  'Inter',
  'Poppins',
  // Add your fonts here:
  'Your Custom Font',
  'Another Font',
]
```

### Change Color Scheme
```typescript
// Blue accent (current)
className="bg-blue-100 text-blue-600"

// Change to green
className="bg-green-100 text-green-600"

// Change to purple
className="bg-purple-100 text-purple-600"
```

## 🔍 Debugging

### Check Selected Element
```typescript
const element = elements.find(el => el.id === selectedId)
console.log('Selected element:', element)
```

### Check All Elements
```typescript
console.log('All elements:', elements)
```

### Check History
```typescript
const { history } = useEditorStore()
console.log('Past:', history.past.length)
console.log('Future:', history.future.length)
```

## 🐛 Common Issues

### Toolbar Not Appearing
```typescript
// Check if element is selected
console.log('Selected ID:', selectedId)

// Check if element exists
const element = elements.find(el => el.id === selectedId)
console.log('Element found:', !!element)

// Check if element is text type
console.log('Is text:', element?.type === 'text')
```

### Color Picker Not Working
```typescript
// Check if react-colorful is installed
npm list react-colorful

// Reinstall if needed
npm install react-colorful
```

### Changes Not Applying
```typescript
// Check if updateElement is called
updateElement(selectedId, { fontSize: 48 })
console.log('Updated element:', elements.find(el => el.id === selectedId))

// Check if history is saved
saveHistory()
```

## 📊 Performance Tips

### Debounce Slider Updates
```typescript
const [debouncedValue, setDebouncedValue] = useState(value)

useEffect(() => {
  const timer = setTimeout(() => {
    updateElement(selectedId, { fontSize: debouncedValue })
  }, 100)
  
  return () => clearTimeout(timer)
}, [debouncedValue])
```

### Optimize Re-renders
```typescript
// Use React.memo for toolbar
export default React.memo(AdvancedTextToolbar)

// Use useMemo for expensive calculations
const dimensions = useMemo(() => 
  calculateTextDimensions(text, fontSize, width),
  [text, fontSize, width]
)
```

## 🎯 API Reference

### Store Actions

#### `updateElement(id, updates)`
Update element properties
```typescript
updateElement('el_123', { fontSize: 48 })
```

#### `duplicateElement(id)`
Create a copy of element
```typescript
duplicateElement('el_123')
```

#### `deleteElement(id)`
Remove element from canvas
```typescript
deleteElement('el_123')
```

#### `bringForward(id)`
Move element one layer up
```typescript
bringForward('el_123')
```

#### `sendBackward(id)`
Move element one layer down
```typescript
sendBackward('el_123')
```

#### `bringToFront(id)`
Move element to top layer
```typescript
bringToFront('el_123')
```

#### `sendToBack(id)`
Move element to bottom layer
```typescript
sendToBack('el_123')
```

#### `undo()`
Undo last change
```typescript
undo()
```

#### `redo()`
Redo change
```typescript
redo()
```

## 🎨 Styling Reference

### Toolbar Colors
```css
/* Active state */
bg-blue-100 text-blue-600

/* Hover state */
hover:bg-gray-100

/* Disabled state */
opacity-30 cursor-not-allowed

/* Border */
border border-gray-200

/* Shadow */
shadow-2xl
```

### Animation
```typescript
// Framer Motion variants
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
```

## 📝 Code Snippets

### Add Custom Button
```typescript
<button
  onClick={() => updateElement(selectedId, { /* your update */ })}
  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
  title="Your Button"
>
  <YourIcon className="w-4 h-4 text-gray-600" />
</button>
```

### Add Custom Slider
```typescript
<div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
  <span className="text-xs text-gray-600">Label:</span>
  <input
    type="range"
    min="0"
    max="100"
    value={element.yourProperty || 0}
    onChange={(e) => updateElement(selectedId, { 
      yourProperty: Number(e.target.value) 
    })}
    className="w-20"
  />
  <span className="text-xs font-semibold">
    {element.yourProperty || 0}
  </span>
</div>
```

### Add Custom Dropdown
```typescript
const [showMenu, setShowMenu] = useState(false)

<div className="relative">
  <button
    onClick={() => setShowMenu(!showMenu)}
    className="px-3 py-2 rounded-lg border border-gray-200"
  >
    {element.yourProperty || 'Select'}
    <ChevronDown className="w-3 h-3" />
  </button>
  
  {showMenu && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-full mt-1 bg-white rounded-lg shadow-xl"
    >
      {options.map(option => (
        <button
          key={option}
          onClick={() => {
            updateElement(selectedId, { yourProperty: option })
            setShowMenu(false)
          }}
          className="w-full px-4 py-2 hover:bg-blue-50"
        >
          {option}
        </button>
      ))}
    </motion.div>
  )}
</div>
```

## 🚀 Deployment Checklist

- [ ] All dependencies installed
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Toolbar appears when text selected
- [ ] All buttons work
- [ ] Color pickers work
- [ ] Sliders work
- [ ] Keyboard shortcuts work
- [ ] Undo/Redo works
- [ ] Auto-resize works
- [ ] Layer management works
- [ ] Performance is smooth (60fps)

## 📞 Support

### Check Documentation
- `ADVANCED_TEXT_EDITOR_COMPLETE.md` - Complete guide
- `ADVANCED_TOOLBAR_VISUAL_GUIDE.md` - Visual reference
- `TASK_5_COMPLETION_SUMMARY.md` - Summary

### Debug Steps
1. Check browser console for errors
2. Verify all files are saved
3. Clear browser cache
4. Restart dev server
5. Check TypeScript compilation

### Common Fixes
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

---

**Quick Reference Version:** 1.0.0  
**Last Updated:** May 5, 2026  
**Status:** ✅ Production Ready
