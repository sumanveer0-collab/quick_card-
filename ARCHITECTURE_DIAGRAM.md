# QuickCard Professional Editor - Architecture Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         QUICKCARD EDITOR                             │
│                    (VistaPrint-Level Editor)                         │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          TOP BAR (64px)                              │
├─────────────────────────────────────────────────────────────────────┤
│  [Undo] [Redo]  │  [Front|Back]  │  [Layer Controls]  │  [Zoom]    │
│                 │                 │  [Lock] [Delete]   │  [Export]  │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────────────────────────────────────────────┐
│              │                                                       │
│   SIDEBAR    │              CANVAS PREVIEW                          │
│   (320px)    │              (Flexible Width)                        │
│              │                                                       │
│ ┌──────────┐ │  ┌─────────────────────────────────────────────┐   │
│ │ Add      │ │  │  ┌─────────────────────────────────────┐   │   │
│ │ Elements │ │  │  │  Bleed Area (Red Dashed)            │   │   │
│ │          │ │  │  │  ┌───────────────────────────────┐  │   │   │
│ │ [Text]   │ │  │  │  │ Trim Line (Blue Solid)        │  │   │   │
│ │ [Image]  │ │  │  │  │ ┌─────────────────────────┐   │  │   │   │
│ │ [Shape]  │ │  │  │  │ │ Safety Zone (Green)     │   │  │   │   │
│ └──────────┘ │  │  │  │ │                         │   │  │   │   │
│              │  │  │  │ │   [Business Card]       │   │  │   │   │
│ ┌──────────┐ │  │  │  │ │   336 × 192 px          │   │  │   │   │
│ │ Back-    │ │  │  │  │ │                         │   │  │   │   │
│ │ ground   │ │  │  │  │ │   [Elements Here]       │   │  │   │   │
│ │          │ │  │  │  │ │                         │   │  │   │   │
│ │ [Solid]  │ │  │  │  │ └─────────────────────────┘   │  │   │   │
│ │ [Grad.]  │ │  │  │  └───────────────────────────────┘  │   │   │
│ └──────────┘ │  │  └─────────────────────────────────────┘   │   │
│              │  │                                              │   │
│ ┌──────────┐ │  │  [Grid Overlay] [Zoom: 100%]               │   │
│ │ Text     │ │  └──────────────────────────────────────────────┘   │
│ │ Editor   │ │                                                      │
│ │          │ │                                                      │
│ │ [Font]   │ │                                                      │
│ │ [Size]   │ │                                                      │
│ │ [Color]  │ │                                                      │
│ └──────────┘ │                                                      │
│              │                                                      │
│ ┌──────────┐ │                                                      │
│ │ Shape    │ │                                                      │
│ │ Editor   │ │                                                      │
│ │          │ │                                                      │
│ │ [Fill]   │ │                                                      │
│ │ [Stroke] │ │                                                      │
│ └──────────┘ │                                                      │
│              │                                                      │
└──────────────┴──────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                      CANVAS FOOTER (48px)                            │
├─────────────────────────────────────────────────────────────────────┤
│  [Bleed] [Trim] [Safety] - Print Guidelines Legend                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    REACT COMPONENTS                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ SidebarTools │  │CanvasPreview │  │TopbarControls│             │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘             │
│         │                  │                  │                      │
│         └──────────────────┼──────────────────┘                      │
│                            │                                         │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ZUSTAND STORE                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  State:                                                     │    │
│  │  - elements: CanvasElement[]                               │    │
│  │  - selectedId: string | null                               │    │
│  │  - zoom, grid, bleed, trim, safety                         │    │
│  │  - history: { past, present, future }                      │    │
│  │                                                             │    │
│  │  Actions:                                                   │    │
│  │  - addElement, updateElement, deleteElement                │    │
│  │  - selectElement, duplicateElement                         │    │
│  │  - bringForward, sendBackward, etc.                        │    │
│  │  - undo, redo, saveHistory                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    KONVA.JS CANVAS                                   │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  Stage (336×192px)                                          │    │
│  │  ├─ Layer                                                   │    │
│  │  │  ├─ Grid Lines                                           │    │
│  │  │  ├─ Safety Zone Rectangle                               │    │
│  │  │  ├─ Trim Line Rectangle                                 │    │
│  │  │  ├─ Text Elements                                        │    │
│  │  │  ├─ Image Elements (with Transformer)                   │    │
│  │  │  └─ Shape Elements                                       │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Component Hierarchy

```
CardEditorPage
├── Navbar
├── TopbarControls
│   ├── Undo/Redo Buttons
│   ├── Face Switcher
│   ├── Element Controls (conditional)
│   ├── Zoom Controls
│   ├── View Toggles
│   └── Export Buttons
├── Main Layout
│   ├── SidebarTools
│   │   ├── CollapsibleSection (Add Elements)
│   │   │   ├── Text Button
│   │   │   ├── Image Upload
│   │   │   ├── Rectangle Button
│   │   │   └── Circle Button
│   │   ├── CollapsibleSection (Background)
│   │   │   └── ColorPicker
│   │   │       ├── Solid Mode
│   │   │       │   ├── HexColorPicker
│   │   │       │   └── Preset Colors
│   │   │       └── Gradient Mode
│   │   │           ├── Color 1 Picker
│   │   │           ├── Color 2 Picker
│   │   │           ├── Angle Slider
│   │   │           └── Gradient Presets
│   │   ├── CollapsibleSection (Text Editor) [conditional]
│   │   │   ├── Font Family Dropdown
│   │   │   ├── Font Size Slider
│   │   │   ├── Font Weight Buttons
│   │   │   ├── Alignment Buttons
│   │   │   ├── ColorPicker
│   │   │   ├── Letter Spacing Slider
│   │   │   └── Line Height Slider
│   │   └── CollapsibleSection (Shape Editor) [conditional]
│   │       ├── Fill ColorPicker
│   │       ├── Stroke ColorPicker
│   │       ├── Stroke Width Slider
│   │       └── Corner Radius Slider
│   └── CanvasPreview
│       ├── Canvas Container (with background)
│       └── Konva Stage
│           └── Konva Layer
│               ├── Grid Lines
│               ├── Safety Zone
│               ├── Trim Line
│               ├── Text Elements
│               ├── Image Elements (with Transformer)
│               └── Shape Elements
└── WelcomeTutorial (modal)
```

---

## 🔌 State Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ZUSTAND STORE FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

User Action
    │
    ▼
Component calls store action
    │
    ▼
Store updates state
    │
    ├─► Save to history (if needed)
    │
    ▼
All subscribed components re-render
    │
    ├─► SidebarTools updates controls
    ├─► CanvasPreview re-renders elements
    └─► TopbarControls updates buttons

Example: Add Text Element
    │
    ▼
1. User clicks "Text" button in SidebarTools
    │
    ▼
2. SidebarTools calls: addElement({ type: 'text', ... })
    │
    ▼
3. Store creates new element with unique ID and zIndex
    │
    ▼
4. Store adds element to elements array
    │
    ▼
5. Store sets selectedId to new element ID
    │
    ▼
6. Store calls saveHistory()
    │
    ▼
7. CanvasPreview re-renders with new text element
    │
    ▼
8. SidebarTools shows Text Editor section
    │
    ▼
9. TopbarControls shows element controls
```

---

## 🎯 Element Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ELEMENT LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────────┘

CREATE
    │
    ▼
addElement({ type, x, y, ... })
    │
    ├─► Generate unique ID
    ├─► Assign zIndex (elements.length)
    ├─► Add to elements array
    ├─► Set as selected
    └─► Save history
    │
    ▼
RENDER
    │
    ├─► CanvasPreview maps elements
    ├─► Renders based on type (Text, Image, Shape)
    └─► Applies position, size, rotation, style
    │
    ▼
UPDATE
    │
    ▼
updateElement(id, { fontSize: 24, ... })
    │
    ├─► Find element by ID
    ├─► Merge updates
    ├─► Update elements array
    └─► Save history
    │
    ▼
TRANSFORM
    │
    ├─► User drags element
    ├─► onDragEnd event
    ├─► updateElement(id, { x, y })
    │
    ├─► User resizes element
    ├─► onTransformEnd event
    └─► updateElement(id, { width, height, rotation })
    │
    ▼
LAYER MANAGEMENT
    │
    ├─► bringForward(id) → swap zIndex with next
    ├─► sendBackward(id) → swap zIndex with previous
    ├─► bringToFront(id) → set zIndex to max + 1
    └─► sendToBack(id) → set zIndex to min - 1
    │
    ▼
DELETE
    │
    ▼
deleteElement(id)
    │
    ├─► Filter out element from array
    ├─► Clear selectedId if was selected
    └─► Save history
```

---

## 🎨 Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                      RENDERING PIPELINE                              │
└─────────────────────────────────────────────────────────────────────┘

State Change
    │
    ▼
React Re-render
    │
    ▼
CanvasPreview Component
    │
    ├─► Calculate stage size (based on zoom)
    ├─► Parse background (gradient or solid)
    └─► Render Konva Stage
        │
        ▼
        Konva Layer
        │
        ├─► Render Grid (if showGrid)
        │   └─► Vertical & Horizontal Lines
        │
        ├─► Render Safety Zone (if showSafety)
        │   └─► Green Dashed Rectangle
        │
        ├─► Render Trim Line (if showTrim)
        │   └─► Blue Solid Rectangle
        │
        └─► Render Elements (sorted by zIndex)
            │
            ├─► Text Elements
            │   ├─► Konva Text component
            │   ├─► Apply font, size, color, etc.
            │   ├─► Handle drag events
            │   └─► Handle double-click to edit
            │
            ├─► Image Elements
            │   ├─► Load image with use-image hook
            │   ├─► Konva Image component
            │   ├─► Konva Transformer (if selected)
            │   ├─► Handle drag events
            │   └─► Handle transform events
            │
            └─► Shape Elements
                ├─► Konva Rect / Circle / Line
                ├─► Apply fill, stroke, etc.
                └─► Handle drag events
```

---

## 🔄 History Management

```
┌─────────────────────────────────────────────────────────────────────┐
│                      HISTORY SYSTEM                                  │
└─────────────────────────────────────────────────────────────────────┘

Initial State
    │
    history: {
        past: [],
        present: [],
        future: []
    }
    │
    ▼
User makes change (add/update/delete element)
    │
    ▼
saveHistory() called
    │
    ├─► Push current present to past array
    ├─► Set present to current elements
    └─► Clear future array
    │
    history: {
        past: [[...oldElements]],
        present: [...currentElements],
        future: []
    }
    │
    ▼
User clicks Undo
    │
    ▼
undo() called
    │
    ├─► Pop last state from past
    ├─► Push current present to future
    ├─► Set present to popped state
    └─► Update elements to present
    │
    history: {
        past: [],
        present: [...oldElements],
        future: [[...currentElements]]
    }
    │
    ▼
User clicks Redo
    │
    ▼
redo() called
    │
    ├─► Pop first state from future
    ├─► Push current present to past
    ├─► Set present to popped state
    └─► Update elements to present
    │
    history: {
        past: [[...oldElements]],
        present: [...currentElements],
        future: []
    }
```

---

## 📦 Dependencies Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DEPENDENCIES                                    │
└─────────────────────────────────────────────────────────────────────┘

React 18
    │
    ├─► Next.js 14
    │   └─► App Router
    │
    ├─► TypeScript
    │   └─► Type Safety
    │
    ├─► Tailwind CSS
    │   └─► Styling
    │
    ├─► Konva.js
    │   ├─► Canvas Engine
    │   └─► react-konva@18
    │       └─► React Bindings
    │
    ├─► Zustand
    │   └─► State Management
    │
    ├─► Framer Motion
    │   └─► Animations
    │
    ├─► react-colorful
    │   └─► Color Picker
    │
    ├─► use-image
    │   └─► Image Loading
    │
    └─► Lucide React
        └─► Icons
```

---

## 🎯 Performance Optimization

```
┌─────────────────────────────────────────────────────────────────────┐
│                   PERFORMANCE STRATEGIES                             │
└─────────────────────────────────────────────────────────────────────┘

1. State Management
   └─► Zustand (minimal re-renders)

2. Canvas Rendering
   └─► Konva.js (efficient canvas updates)

3. Component Optimization
   ├─► Conditional rendering
   ├─► Memoization where needed
   └─► Lazy loading

4. Event Handling
   ├─► Debounced updates
   └─► Throttled drag events

5. Image Optimization
   ├─► use-image hook (caching)
   └─► File size limits (5MB)

6. Animation Performance
   ├─► Framer Motion (GPU accelerated)
   └─► CSS transforms

7. Grid Rendering
   └─► Only render when visible
```

---

*This architecture provides a scalable, maintainable, and performant foundation for the QuickCard Professional Editor.*
