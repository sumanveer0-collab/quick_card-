# 📝 Inline Text Editing - Quick Reference

## 🚀 Quick Start Guide

### For Users

**How to Edit Text on Canvas:**

1. **Select Text**: Click once on any text element
2. **Edit Text**: Double-click to start editing
3. **Type**: Start typing your new text
4. **Format**: Use toolbar above text to format
5. **Finish**: Click outside or press Esc

**Keyboard Shortcuts:**
- `Ctrl + B` = Bold
- `Ctrl + I` = Italic
- `Ctrl + D` = Duplicate
- `Delete` = Remove text
- `Esc` = Close editor

---

### For Developers

**Enable Inline Text Editor:**

```typescript
// In CustomizeCanvas.tsx
const useCanvasTextEditor = true // ✅ Enable
const useVistaprintEditor = false // ❌ Disable old editor
const useAdvancedEditor = false // ❌ Disable advanced editor
```

**Component Structure:**

```
CustomizeCanvas.tsx
├── CanvasTextEditor.tsx (Main inline editor)
│   ├── Floating Toolbar
│   ├── Text Editor Area
│   └── Visual Indicators
└── editor.store.ts (State management)
```

**Key Props:**

```typescript
interface CanvasTextEditorProps {
  elementId: string // Text element ID
  onClose: () => void // Close callback
  displayScale: number // Canvas zoom scale
  canvasRef: React.RefObject<HTMLDivElement> // Canvas container ref
}
```

---

## 📐 Position Calculation

### Canvas Position Formula

```typescript
// Get canvas container position
const canvasPos = getCanvasPosition()

// Calculate editor position (account for bleed area)
const editorStyle = {
  left: canvasPos.left + ((x + BLEED_PX) * displayScale),
  top: canvasPos.top + ((y + BLEED_PX) * displayScale),
  width: width * displayScale,
  minHeight: height * displayScale,
  fontSize: Math.max(12, fontSize * displayScale),
  // ...
}
```

### Toolbar Position Formula

```typescript
// Position toolbar above text element
const toolbarStyle = {
  left: canvasPos.left + ((x + BLEED_PX) * displayScale) + (width * displayScale / 2),
  top: canvasPos.top + ((y + BLEED_PX) * displayScale) - 60,
  transform: 'translateX(-50%)',
  zIndex: 1000
}
```

---

## 🎨 Styling Classes

### Selection States

```css
/* Unselected (hover) */
.hover:ring-2.hover:ring-blue-300.hover:ring-offset-1

/* Selected */
.ring-2.ring-blue-300.ring-offset-2

/* Editing */
.ring-2.ring-blue-500.ring-offset-2
```

### Editor Container

```css
.fixed.overflow-visible.cursor-text.transition-all.duration-200
.bg-white/95.backdrop-blur-sm.p-3.leading-relaxed.rounded-lg.shadow-lg
```

### Toolbar

```css
.fixed.bg-white.rounded-lg.shadow-2xl.border.border-gray-200.p-2
```

---

## 🔧 Key Functions

### 1. Auto-Resize Text Box

```typescript
const autoResize = () => {
  const textarea = textareaRef.current
  if (textarea) {
    textarea.style.height = 'auto'
    const newScrollHeight = textarea.scrollHeight
    textarea.style.height = newScrollHeight + 'px'
    
    const newHeight = Math.max(newScrollHeight / displayScale, 30)
    const newWidth = Math.max(textarea.scrollWidth / displayScale, 100)
    
    handleStyleChange({ 
      height: newHeight,
      ...(textarea.scrollWidth > textarea.clientWidth ? { width: newWidth } : {})
    })
  }
}
```

### 2. Handle Text Change

```typescript
const handleTextChange = (newText: string) => {
  updateElement(elementId, { text: newText })
}
```

### 3. Handle Style Change

```typescript
const handleStyleChange = (properties: any) => {
  updateElement(elementId, properties)
}
```

### 4. Toggle Editing Mode

```typescript
const toggleEditing = () => {
  setIsEditing(!isEditing)
  if (!isEditing) {
    setTimeout(() => {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }, 100)
  }
}
```

---

## 📊 State Management

### Editor Store

```typescript
// Add text element
addElement({
  type: 'text',
  x: 100,
  y: 100,
  width: 200,
  height: 50,
  text: 'Your Text',
  fontSize: 16,
  fontFamily: 'Arial',
  fontWeight: 'normal',
  fill: '#000000',
  align: 'left',
  rotation: 0
})

// Update text element
updateElement(elementId, {
  text: 'New Text',
  fontSize: 20,
  fontWeight: 'bold'
})

// Delete text element
deleteElement(elementId)

// Duplicate text element
duplicateElement(elementId)
```

### Canvas State

```typescript
const [canvasTextEditorId, setCanvasTextEditorId] = useState<string | null>(null)
const [displayScale, setDisplayScale] = useState(1)

// Open editor
setCanvasTextEditorId(elementId)

// Close editor
setCanvasTextEditorId(null)
```

---

## 🎯 Font Options

### Available Fonts (15)

```typescript
const fontOptions = [
  'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
  'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino',
  'Garamond', 'Bookman', 'Avant Garde', 'Optima', 'Futura'
]
```

### Font Sizes

```typescript
const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72, 96]
```

---

## 🎨 Color Presets

### 24 Preset Colors

```typescript
const colorPresets = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
]
```

---

## ⌨️ Keyboard Shortcuts Implementation

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false)
      onClose()
    }
    
    if (!isEditing) {
      if (e.key === 'Enter') {
        toggleEditing()
      }
      if (e.key === 'Delete') {
        deleteElement(elementId)
        onClose()
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        duplicateElement(elementId)
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        handleStyleChange({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault()
        handleStyleChange({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })
      }
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [isEditing, elementId, fontWeight, element.fontStyle])
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Text Position Offset

**Problem**: Text appears offset from actual position

**Solution**: Account for bleed area
```typescript
left: canvasPos.left + ((x + BLEED_PX) * displayScale)
```

### Issue 2: Font Size Too Small

**Problem**: Font appears smaller than expected

**Solution**: Use full display scale
```typescript
fontSize: Math.max(12, fontSize * displayScale) // Not * 0.8
```

### Issue 3: Text Box Not Expanding

**Problem**: Text box doesn't grow with content

**Solution**: Implement auto-resize
```typescript
textarea.style.height = 'auto'
textarea.style.height = textarea.scrollHeight + 'px'
```

### Issue 4: Toolbar Position Wrong

**Problem**: Toolbar appears in wrong location

**Solution**: Calculate position relative to canvas + bleed
```typescript
left: canvasPos.left + ((x + BLEED_PX) * displayScale) + (width * displayScale / 2)
```

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-konva": "^18.2.10",
  "konva": "^9.2.0",
  "zustand": "^4.4.1",
  "framer-motion": "^10.16.4",
  "lucide-react": "^0.292.0",
  "tailwindcss": "^3.3.5"
}
```

---

## 🧪 Testing

### Manual Testing Checklist

```typescript
// Selection
✅ Click text to select
✅ Blue ring appears
✅ Toolbar shows above text
✅ Resize handles appear

// Editing
✅ Double-click to edit
✅ Cursor appears in text
✅ Can type new text
✅ Text auto-resizes
✅ Click outside to finish

// Formatting
✅ Font family changes
✅ Font size increases/decreases
✅ Bold/italic/underline work
✅ Text alignment changes
✅ Color picker works

// Actions
✅ Duplicate creates copy
✅ Delete removes text
✅ Esc closes editor
✅ Keyboard shortcuts work
```

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import CanvasTextEditor from './CanvasTextEditor'

test('should open editor on double click', () => {
  const { container } = render(
    <CanvasTextEditor
      elementId="test-id"
      onClose={() => {}}
      displayScale={1}
      canvasRef={{ current: null }}
    />
  )
  
  const textElement = screen.getByText('Click to edit text')
  fireEvent.doubleClick(textElement)
  
  expect(screen.getByRole('textbox')).toBeInTheDocument()
})
```

---

## 📚 API Reference

### CanvasTextEditor Component

```typescript
<CanvasTextEditor
  elementId={string}        // Required: Text element ID
  onClose={() => void}      // Required: Close callback
  displayScale={number}     // Required: Canvas zoom scale (0.5 - 2.0)
  canvasRef={RefObject}     // Required: Canvas container ref
/>
```

### Editor Store Methods

```typescript
// Add element
addElement(element: Omit<CanvasElement, 'id' | 'zIndex'>): void

// Update element
updateElement(id: string, updates: Partial<CanvasElement>): void

// Delete element
deleteElement(id: string): void

// Select element
selectElement(id: string | null): void

// Duplicate element
duplicateElement(id: string): void
```

---

## 🎯 Performance Tips

1. **Debounce Text Updates**: Use debounce for frequent text changes
2. **Memoize Calculations**: Cache position calculations
3. **Lazy Load Fonts**: Load fonts only when dropdown opens
4. **Optimize Re-renders**: Use React.memo for toolbar components
5. **Virtual Scrolling**: Use virtual scrolling for long font lists

---

## 🔗 Related Files

```
frontend/
├── components/
│   └── customize/
│       ├── CanvasTextEditor.tsx          ← Main component
│       ├── CustomizeCanvas.tsx           ← Canvas integration
│       ├── ProfessionalTextElement.tsx   ← Text rendering
│       └── CanvaStyleTextElement.tsx     ← Alternative rendering
└── store/
    └── editor.store.ts                   ← State management
```

---

## 📖 Documentation Links

- [Full Implementation Guide](./INLINE_TEXT_EDITING_VISTAPRINT_STYLE.md)
- [Visual Guide](./INLINE_TEXT_EDITING_VISUAL_GUIDE.md)
- [Canvas Text Editor](./CANVAS_TEXT_EDITOR_IMPLEMENTATION.md)
- [Template System](./TEMPLATE_TO_EDITOR_FLOW_COMPLETE.md)

---

## 🎉 Quick Commands

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Type check
npm run type-check

# Lint code
npm run lint
```

---

**Quick Reference Version**: 1.0.0  
**Last Updated**: May 13, 2026  
**Status**: ✅ Complete
