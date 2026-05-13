# 📝 Inline Text Editing - Architecture Diagram

## 🏗️ System Architecture

This document provides visual diagrams of the inline text editing system architecture.

---

## 1️⃣ Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     QuickCard Application                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CustomizeCanvas.tsx                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Konva Stage (Canvas)                     │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │                  Konva Layer                        │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │  │
│  │  │  │  Text    │  │  Image   │  │  Shape   │         │  │  │
│  │  │  │ Element  │  │ Element  │  │ Element  │         │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘         │  │  │
│  │  │                                                     │  │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │  │
│  │  │  │  Icon    │  │   QR     │  │  Logo    │         │  │  │
│  │  │  │ Element  │  │ Element  │  │ Element  │         │  │  │
│  │  │  └──────────┘  └──────────┘  └──────────┘         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │          CanvasTextEditor.tsx (Overlay)                   │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │              Floating Toolbar                       │  │  │
│  │  │  [Font▼] [Size] [B][I][U] [≡] [🎨] [×]           │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                      ▼                                    │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │           Text Editor Area                          │  │  │
│  │  │  ╔═══════════════════════════════════════╗          │  │  │
│  │  │  ║  Your Text Here...                   ║          │  │  │
│  │  │  ║  [Editable Textarea]                 ║          │  │  │
│  │  │  ╚═══════════════════════════════════════╝          │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    editor.store.ts (Zustand)                    │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  State:                                                   │  │
│  │  - elements: CanvasElement[]                             │  │
│  │  - selectedId: string | null                             │  │
│  │  - zoom: number                                          │  │
│  │  - background: string                                    │  │
│  │                                                           │  │
│  │  Actions:                                                │  │
│  │  - addElement(element)                                   │  │
│  │  - updateElement(id, updates)                            │  │
│  │  - deleteElement(id)                                     │  │
│  │  - selectElement(id)                                     │  │
│  │  - duplicateElement(id)                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Data Flow Diagram

```
┌─────────────┐
│    User     │
│   Action    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              User Interactions                          │
├─────────────────────────────────────────────────────────┤
│  • Click text element                                   │
│  • Double-click to edit                                 │
│  • Type new text                                        │
│  • Click toolbar buttons                                │
│  • Drag to move                                         │
│  • Resize with handles                                  │
│  • Press keyboard shortcuts                             │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│           CustomizeCanvas.tsx                           │
├─────────────────────────────────────────────────────────┤
│  Event Handlers:                                        │
│  • handleSelect(id)                                     │
│  • handleTextDoubleClick(id)                            │
│  • handleDragEnd(element, x, y)                         │
│  • handleTransformEnd(element, attrs)                   │
│  • handleCloseTextEditor()                              │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│            CanvasTextEditor.tsx                         │
├─────────────────────────────────────────────────────────┤
│  State:                                                 │
│  • isEditing: boolean                                   │
│  • showColorPicker: boolean                             │
│  • showFontSelector: boolean                            │
│                                                         │
│  Functions:                                             │
│  • handleTextChange(text)                               │
│  • handleStyleChange(properties)                        │
│  • autoResize()                                         │
│  • toggleEditing()                                      │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              editor.store.ts                            │
├─────────────────────────────────────────────────────────┤
│  Store Actions:                                         │
│  • updateElement(id, { text, fontSize, ... })           │
│  • selectElement(id)                                    │
│  • deleteElement(id)                                    │
│  • duplicateElement(id)                                 │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              State Update                               │
├─────────────────────────────────────────────────────────┤
│  • elements array updated                               │
│  • selectedId updated                                   │
│  • React re-renders components                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              UI Update                                  │
├─────────────────────────────────────────────────────────┤
│  • Konva canvas re-renders                              │
│  • Text element updates                                 │
│  • Toolbar updates                                      │
│  • Visual feedback shows                                │
└─────────────────────────────────────────────────────────┘
```

---

## 3️⃣ State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Zustand Store (editor.store.ts)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │         Global State                    │
        ├─────────────────────────────────────────┤
        │  elements: CanvasElement[]              │
        │  selectedId: string | null              │
        │  zoom: number                           │
        │  showGrid: boolean                      │
        │  showBleed: boolean                     │
        │  showTrim: boolean                      │
        │  showSafety: boolean                    │
        │  snapToGrid: boolean                    │
        │  currentFace: 'front' | 'back'          │
        │  background: string                     │
        │  history: EditorHistory                 │
        └─────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   CustomizeCanvas.tsx     │   │  CanvasTextEditor.tsx     │
├───────────────────────────┤   ├───────────────────────────┤
│  Local State:             │   │  Local State:             │
│  • canvasTextEditorId     │   │  • isEditing              │
│  • displayScale           │   │  • showColorPicker        │
│  • selectedGraphicId      │   │  • showFontSelector       │
│  • showImageEditor        │   │                           │
│                           │   │  Refs:                    │
│  Refs:                    │   │  • textareaRef            │
│  • stageRef               │   │  • toolbarRef             │
│  • containerRef           │   │  • editorContainerRef     │
└───────────────────────────┘   └───────────────────────────┘
                │                           │
                └───────────┬───────────────┘
                            ▼
                ┌───────────────────────────┐
                │   Store Actions           │
                ├───────────────────────────┤
                │  • addElement()           │
                │  • updateElement()        │
                │  • deleteElement()        │
                │  • selectElement()        │
                │  • duplicateElement()     │
                │  • setZoom()              │
                │  • setBackground()        │
                │  • undo()                 │
                │  • redo()                 │
                └───────────────────────────┘
```

---

## 4️⃣ Event Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Events                                │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Click Text   │   │ Double-Click  │   │  Keyboard     │
│   Element     │   │     Text      │   │  Shortcut     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ handleSelect  │   │handleTextDbl  │   │  handleKey    │
│    (id)       │   │  Click(id)    │   │   Down(e)     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ selectElement │   │setCanvasText  │   │ Toggle Bold/  │
│    (id)       │   │ EditorId(id)  │   │ Italic/etc    │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                ┌───────────────────────┐
                │  State Update         │
                │  (Zustand Store)      │
                └───────────┬───────────┘
                            ▼
                ┌───────────────────────┐
                │  React Re-render      │
                └───────────┬───────────┘
                            ▼
                ┌───────────────────────┐
                │  UI Update            │
                │  • Canvas             │
                │  • Toolbar            │
                │  • Editor             │
                └───────────────────────┘
```

---

## 5️⃣ Position Calculation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  Position Calculation                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  Input: Element Position                │
        │  • x: number (canvas coordinates)       │
        │  • y: number (canvas coordinates)       │
        │  • width: number                        │
        │  • height: number                       │
        │  • rotation: number                     │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Get Canvas Container Position          │
        │  const canvasPos = getCanvasPosition()  │
        │  • left: containerRect.left             │
        │  • top: containerRect.top               │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Account for Bleed Area                 │
        │  const BLEED_PX = 37.5                  │
        │  • x_adjusted = x + BLEED_PX            │
        │  • y_adjusted = y + BLEED_PX            │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Apply Display Scale                    │
        │  • displayScale = zoom / 100 * autoScale│
        │  • x_scaled = x_adjusted * displayScale │
        │  • y_scaled = y_adjusted * displayScale │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Calculate Final Position               │
        │  • left = canvasPos.left + x_scaled     │
        │  • top = canvasPos.top + y_scaled       │
        │  • width = width * displayScale         │
        │  • height = height * displayScale       │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Output: Screen Position                │
        │  editorStyle = {                        │
        │    left: calculated_left,               │
        │    top: calculated_top,                 │
        │    width: calculated_width,             │
        │    height: calculated_height,           │
        │    transform: `rotate(${rotation}deg)`  │
        │  }                                      │
        └─────────────────────────────────────────┘
```

---

## 6️⃣ Auto-Resize Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Types Text                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │  onChange Event Triggered               │
        │  • handleTextChange(e.target.value)     │
        │  • autoResize()                         │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Reset Textarea Height                  │
        │  textarea.style.height = 'auto'         │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Measure Content Size                   │
        │  • scrollHeight = textarea.scrollHeight │
        │  • scrollWidth = textarea.scrollWidth   │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Set New Textarea Height                │
        │  textarea.style.height = scrollHeight   │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Calculate Element Dimensions           │
        │  • newHeight = scrollHeight / scale     │
        │  • newWidth = scrollWidth / scale       │
        │  • Apply minimum constraints            │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Check if Width Update Needed           │
        │  if (scrollWidth > clientWidth) {       │
        │    update width                         │
        │  }                                      │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  Update Element in Store                │
        │  updateElement(id, {                    │
        │    height: newHeight,                   │
        │    width: newWidth (if needed)          │
        │  })                                     │
        └─────────────────┬───────────────────────┘
                          ▼
        ┌─────────────────────────────────────────┐
        │  React Re-renders                       │
        │  • Textarea updates                     │
        │  • Canvas element updates               │
        └─────────────────────────────────────────┘
```

---

## 7️⃣ Toolbar Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              User Clicks Toolbar Button                         │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Font Family  │   │   Font Size   │   │  Formatting   │
│   Selector    │   │   Control     │   │    Button     │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Show Dropdown │   │  Increase/    │   │  Toggle Bold/ │
│ with Fonts    │   │  Decrease     │   │  Italic/etc   │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ User Selects  │   │  Calculate    │   │  Calculate    │
│    Font       │   │  New Size     │   │  New Style    │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                ┌───────────────────────┐
                │  handleStyleChange    │
                │  (properties)         │
                └───────────┬───────────┘
                            ▼
                ┌───────────────────────┐
                │  updateElement        │
                │  (id, properties)     │
                └───────────┬───────────┘
                            ▼
                ┌───────────────────────┐
                │  Store Updates        │
                │  elements array       │
                └───────────┬───────────┘
                            ▼
                ┌───────────────────────┐
                │  React Re-renders     │
                │  • Text updates       │
                │  • Toolbar updates    │
                └───────────────────────┘
```

---

## 8️⃣ Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                  Component Lifecycle                            │
└─────────────────────────────────────────────────────────────────┘

1. Component Mount
   ┌─────────────────────────────────────────┐
   │  CanvasTextEditor mounts                │
   │  • Initialize state                     │
   │  • Setup refs                           │
   │  • Add event listeners                  │
   └─────────────────┬───────────────────────┘
                     ▼
2. Auto-Focus
   ┌─────────────────────────────────────────┐
   │  useEffect(() => {                      │
   │    textareaRef.current?.focus()         │
   │    textareaRef.current?.select()        │
   │  }, [])                                 │
   └─────────────────┬───────────────────────┘
                     ▼
3. User Interaction
   ┌─────────────────────────────────────────┐
   │  • User types text                      │
   │  • User clicks toolbar buttons          │
   │  • User presses keyboard shortcuts      │
   └─────────────────┬───────────────────────┘
                     ▼
4. State Updates
   ┌─────────────────────────────────────────┐
   │  • Local state updates (isEditing)      │
   │  • Store updates (element properties)   │
   │  • React triggers re-render             │
   └─────────────────┬───────────────────────┘
                     ▼
5. Re-render
   ┌─────────────────────────────────────────┐
   │  • Component re-renders                 │
   │  • Toolbar updates                      │
   │  • Editor area updates                  │
   │  • Visual feedback updates              │
   └─────────────────┬───────────────────────┘
                     ▼
6. Component Unmount
   ┌─────────────────────────────────────────┐
   │  • Remove event listeners               │
   │  • Cleanup refs                         │
   │  • Save final state                     │
   └─────────────────────────────────────────┘
```

---

## 9️⃣ Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Scenarios                              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Element Not  │   │  Outside Safe │   │  Invalid      │
│    Found      │   │     Area      │   │  Input        │
└───────┬───────┘   └───────┬───────┘   └───────┬───────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│  Return null  │   │  Show Warning │   │  Validate &   │
│  (no render)  │   │    Toast      │   │  Sanitize     │
└───────────────┘   └───────┬───────┘   └───────┬───────┘
                            │                   │
                            ▼                   ▼
                ┌───────────────────────┐   ┌───────────────┐
                │  Update element with  │   │  Apply valid  │
                │  outsideSafeArea flag │   │  value only   │
                └───────────────────────┘   └───────────────┘
```

---

## 🔟 Performance Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│                  Performance Optimizations                      │
└─────────────────────────────────────────────────────────────────┘

1. Memoization
   ┌─────────────────────────────────────────┐
   │  • useMemo for position calculations    │
   │  • React.memo for toolbar components    │
   │  • useCallback for event handlers       │
   └─────────────────────────────────────────┘

2. Debouncing
   ┌─────────────────────────────────────────┐
   │  • Debounce text change updates         │
   │  • Debounce resize calculations         │
   │  • Throttle scroll events               │
   └─────────────────────────────────────────┘

3. Lazy Loading
   ┌─────────────────────────────────────────┐
   │  • Load fonts on demand                 │
   │  • Lazy load color picker               │
   │  • Defer non-critical renders           │
   └─────────────────────────────────────────┘

4. Virtual Rendering
   ┌─────────────────────────────────────────┐
   │  • Only render visible elements         │
   │  • Virtualize long font lists           │
   │  • Cull off-screen elements             │
   └─────────────────────────────────────────┘

5. State Optimization
   ┌─────────────────────────────────────────┐
   │  • Minimize re-renders                  │
   │  • Batch state updates                  │
   │  • Use local state when possible        │
   └─────────────────────────────────────────┘
```

---

## 🎯 Summary

This architecture provides:

✅ **Modular Design**: Separate concerns (canvas, editor, store)  
✅ **Clear Data Flow**: Unidirectional data flow with Zustand  
✅ **Event-Driven**: Reactive to user interactions  
✅ **Performant**: Optimized rendering and calculations  
✅ **Maintainable**: Well-structured, documented code  
✅ **Scalable**: Easy to add new features  
✅ **Testable**: Clear separation of logic  

---

**Architecture Version**: 1.0.0  
**Last Updated**: May 13, 2026  
**Status**: ✅ Complete
