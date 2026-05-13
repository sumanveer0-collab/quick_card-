# Developer Quick Reference - Template System

## 🚀 Quick Start

### Adding a New Template
```typescript
// In frontend/lib/templates/index.ts or similar

export const myNewTemplate = {
  id: 'my-new-template',
  name: 'My New Template',
  description: 'A brief description of the template',
  category: 'Business', // Must match existing category or create new
  background: '#FFFFFF',
  elements: [
    {
      type: 'text',
      text: 'Company Name',
      x: 100,
      y: 50,
      width: 300,
      height: 60,
      fontSize: 32,
      fontFamily: 'Arial',
      fontWeight: 700,
      fill: '#000000',
      // ... other properties
    },
    // ... more elements
  ]
}

// Add to templates array
export const templates = [
  // ... existing templates
  myNewTemplate,
]
```

---

## 🔍 Search & Filter Implementation

### State Management
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState('All')
```

### Dynamic Categories
```typescript
const categories = useMemo(() => {
  const cats = new Set(templates.map(t => t.category))
  return ['All', ...Array.from(cats)]
}, [])
```

### Filter Logic
```typescript
const filteredTemplates = useMemo(() => {
  return templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'All' || 
      template.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })
}, [searchQuery, selectedCategory])
```

---

## 🎨 Template Structure

### Required Fields
```typescript
interface Template {
  id: string              // Unique identifier
  name: string            // Display name
  description?: string    // Optional description
  category: string        // Category for filtering
  background: string      // CSS color or gradient
  elements: CanvasElement[] // Array of canvas elements
}
```

### Element Types
```typescript
type CanvasElement = 
  | TextElement 
  | ImageElement 
  | ShapeElement 
  | GraphicElement
```

### Text Element
```typescript
{
  type: 'text',
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
  fontFamily: string,
  fontWeight: number | string,
  fontStyle?: 'normal' | 'italic',
  fill: string,
  align?: 'left' | 'center' | 'right',
  rotation?: number,
  visible?: boolean,
  locked?: boolean,
}
```

### Image Element
```typescript
{
  type: 'image',
  src: string,
  x: number,
  y: number,
  width: number,
  height: number,
  rotation?: number,
  visible?: boolean,
  locked?: boolean,
}
```

### Shape Element
```typescript
{
  type: 'shape',
  shapeType: 'rect' | 'circle',
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke?: string,
  strokeWidth?: number,
  cornerRadius?: number,
  rotation?: number,
  visible?: boolean,
  locked?: boolean,
}
```

---

## 🛠️ Common Tasks

### 1. Add New Category
```typescript
// Just add templates with the new category
// Categories are generated automatically

const newTemplate = {
  id: 'medical-card-1',
  name: 'Medical Card',
  category: 'Medical', // New category
  // ... rest of template
}
```

### 2. Modify Search Behavior
```typescript
// In CustomizeSidebar.tsx
const filteredTemplates = useMemo(() => {
  return templates.filter(template => {
    // Add custom search logic here
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags?.some(tag => tag.includes(searchQuery.toLowerCase())) // Example: search tags
    
    // ... rest of filter logic
  })
}, [searchQuery, selectedCategory])
```

### 3. Add Template Tags
```typescript
// Extend template interface
interface Template {
  // ... existing fields
  tags?: string[] // Add tags field
}

// Use in template
const template = {
  id: 'modern-card',
  name: 'Modern Card',
  tags: ['professional', 'clean', 'minimal'], // Add tags
  // ... rest
}

// Search tags
const matchesSearch = searchQuery === '' || 
  template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  template.tags?.some(tag => tag.includes(searchQuery.toLowerCase()))
```

### 4. Add Sort Options
```typescript
const [sortBy, setSortBy] = useState<'name' | 'date' | 'popular'>('name')

const sortedTemplates = useMemo(() => {
  const filtered = filteredTemplates
  
  switch (sortBy) {
    case 'name':
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    case 'date':
      return [...filtered].sort((a, b) => b.createdAt - a.createdAt)
    case 'popular':
      return [...filtered].sort((a, b) => b.downloads - a.downloads)
    default:
      return filtered
  }
}, [filteredTemplates, sortBy])
```

### 5. Add Template Preview
```typescript
const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)

// In template card
<button
  onMouseEnter={() => setPreviewTemplate(template)}
  onMouseLeave={() => setPreviewTemplate(null)}
  onClick={() => handleLoadTemplate(template.id)}
>
  {/* Card content */}
</button>

// Preview modal
{previewTemplate && (
  <div className="preview-modal">
    <h3>{previewTemplate.name}</h3>
    <div className="preview-canvas">
      {/* Render preview */}
    </div>
  </div>
)}
```

---

## 🎯 Best Practices

### Template Design
1. **Consistent sizing:** Use standard business card dimensions
2. **Readable fonts:** Minimum 10px font size
3. **Color contrast:** Ensure text is readable
4. **Element spacing:** Leave breathing room
5. **Layer order:** Background → Graphics → Text

### Performance
1. **Use useMemo:** For expensive computations
2. **Lazy loading:** Load template thumbnails on demand
3. **Virtual scrolling:** For 100+ templates
4. **Debounce search:** Optimize search performance

### Code Quality
1. **Type safety:** Use TypeScript interfaces
2. **Clean imports:** Remove unused imports
3. **Consistent naming:** Follow naming conventions
4. **Comments:** Document complex logic
5. **Error handling:** Handle edge cases

---

## 🐛 Debugging

### Template Not Showing
```typescript
// Check template structure
console.log('Template:', template)

// Check if template matches filters
console.log('Matches search:', matchesSearch)
console.log('Matches category:', matchesCategory)

// Check filtered results
console.log('Filtered templates:', filteredTemplates)
```

### Search Not Working
```typescript
// Check search query
console.log('Search query:', searchQuery)

// Check search logic
const matchesSearch = searchQuery === '' || 
  template.name.toLowerCase().includes(searchQuery.toLowerCase())
console.log('Matches search:', matchesSearch)
```

### Category Filter Not Working
```typescript
// Check selected category
console.log('Selected category:', selectedCategory)

// Check template category
console.log('Template category:', template.category)

// Check category logic
const matchesCategory = selectedCategory === 'All' || 
  template.category === selectedCategory
console.log('Matches category:', matchesCategory)
```

### Template Not Loading
```typescript
// Check template ID
console.log('Template ID:', templateId)

// Check if template exists
const template = templates.find(t => t.id === templateId)
console.log('Found template:', template)

// Check element loading
template?.elements.forEach((element, index) => {
  console.log(`Element ${index}:`, element)
})
```

---

## 📦 File Structure

```
frontend/
├── components/
│   └── customize/
│       ├── CustomizeSidebar.tsx      # Main sidebar with search/filter
│       ├── CustomizeCanvas.tsx       # Canvas rendering
│       └── DynamicTextFieldsPanel.tsx # Text fields panel
├── lib/
│   └── templates/
│       ├── index.ts                  # Template exports
│       ├── default-card.ts           # Default template
│       ├── modern-green-template.ts  # Example template
│       └── ...                       # More templates
├── store/
│   └── editor.store.ts               # Editor state management
└── app/
    └── customize/
        └── page.tsx                  # Main customize page
```

---

## 🔗 Related Files

### Core Files
- `frontend/components/customize/CustomizeSidebar.tsx` - Search & filter logic
- `frontend/lib/templates/index.ts` - Template definitions
- `frontend/store/editor.store.ts` - Canvas state management

### Supporting Files
- `frontend/components/customize/CustomizeCanvas.tsx` - Canvas rendering
- `frontend/app/customize/page.tsx` - Main page layout
- `frontend/components/Navbar.tsx` - Top navigation

---

## 🎓 Learning Resources

### Key Concepts
1. **useMemo:** Optimize expensive computations
2. **Filter logic:** Combine multiple filters
3. **State management:** React hooks
4. **TypeScript:** Type safety
5. **Framer Motion:** Animations

### Code Examples
- Search implementation: `CustomizeSidebar.tsx` lines 20-35
- Filter logic: `CustomizeSidebar.tsx` lines 37-48
- Template loading: `CustomizeSidebar.tsx` lines 50-65
- Category generation: `CustomizeSidebar.tsx` lines 25-28

---

## 🚨 Common Pitfalls

### 1. Forgetting useMemo
```typescript
// ❌ Bad: Recalculates every render
const filteredTemplates = templates.filter(...)

// ✅ Good: Only recalculates when dependencies change
const filteredTemplates = useMemo(() => 
  templates.filter(...), 
  [searchQuery, selectedCategory]
)
```

### 2. Case-Sensitive Search
```typescript
// ❌ Bad: Case-sensitive
template.name.includes(searchQuery)

// ✅ Good: Case-insensitive
template.name.toLowerCase().includes(searchQuery.toLowerCase())
```

### 3. Missing Dependencies
```typescript
// ❌ Bad: Missing dependencies
const filteredTemplates = useMemo(() => 
  templates.filter(...), 
  [] // Missing searchQuery, selectedCategory
)

// ✅ Good: All dependencies included
const filteredTemplates = useMemo(() => 
  templates.filter(...), 
  [searchQuery, selectedCategory]
)
```

### 4. Not Handling Empty States
```typescript
// ❌ Bad: No empty state
{filteredTemplates.map(template => ...)}

// ✅ Good: Handle empty state
{filteredTemplates.length > 0 ? (
  filteredTemplates.map(template => ...)
) : (
  <EmptyState />
)}
```

---

## 📞 Support

For questions or issues:
1. Check this reference guide
2. Review code comments in `CustomizeSidebar.tsx`
3. Check TypeScript types in `editor.store.ts`
4. Test in development environment

---

**Last Updated:** May 12, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
