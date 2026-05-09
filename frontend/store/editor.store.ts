import { create } from 'zustand'

// ═══════════════════════════════════════════════════════════════════════════════
// PRINT-ACCURATE DIMENSIONS (300 DPI)
// ═══════════════════════════════════════════════════════════════════════════════
// Standard Business Card: 3.5" × 2"
// Bleed: 0.125" (all sides)
// Total with bleed: 3.75" × 2.25"
// At 300 DPI:
export const PRINT_DPI = 300
export const CARD_WIDTH_INCH = 3.5
export const CARD_HEIGHT_INCH = 2.0
export const BLEED_INCH = 0.125
export const SAFE_MARGIN_INCH = 0.125

// Pixel dimensions at 300 DPI
export const CARD_WIDTH_PX = CARD_WIDTH_INCH * PRINT_DPI // 1050px
export const CARD_HEIGHT_PX = CARD_HEIGHT_INCH * PRINT_DPI // 600px
export const BLEED_PX = BLEED_INCH * PRINT_DPI // 37.5px
export const SAFE_MARGIN_PX = SAFE_MARGIN_INCH * PRINT_DPI // 37.5px

// Total canvas size (with bleed)
export const CANVAS_WIDTH_PX = CARD_WIDTH_PX + (BLEED_PX * 2) // 1125px
export const CANVAS_HEIGHT_PX = CARD_HEIGHT_PX + (BLEED_PX * 2) // 675px

// Safe area boundaries (inside trim line)
export const SAFE_AREA_X = BLEED_PX + SAFE_MARGIN_PX
export const SAFE_AREA_Y = BLEED_PX + SAFE_MARGIN_PX
export const SAFE_AREA_WIDTH = CARD_WIDTH_PX - (SAFE_MARGIN_PX * 2)
export const SAFE_AREA_HEIGHT = CARD_HEIGHT_PX - (SAFE_MARGIN_PX * 2)

export type ElementType = 'text' | 'image' | 'shape' | 'icon' | 'logo' | 'qr'

export interface CanvasElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  // Text specific
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fill?: string
  stroke?: string
  strokeWidth?: number
  align?: 'left' | 'center' | 'right'
  verticalAlign?: 'top' | 'middle' | 'bottom'
  letterSpacing?: number
  lineHeight?: number
  padding?: { horizontal: number; vertical: number }
  // Image specific
  src?: string
  // Shape specific
  shapeType?: 'rect' | 'circle' | 'line' | 'triangle' | 'star' | 'arrow' | 'polygon'
  cornerRadius?: number
  // Graphic specific (shapes, icons)
  svg?: string
  name?: string
  category?: string
  // Layer
  zIndex: number
  locked?: boolean
  visible?: boolean
  opacity?: number
  // Warning flag
  outsideSafeArea?: boolean
}

export interface EditorHistory {
  past: CanvasElement[][]
  present: CanvasElement[]
  future: CanvasElement[][]
}

interface EditorState {
  // Canvas elements
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
  
  // Card face
  currentFace: 'front' | 'back'
  
  // Background
  background: string
  
  // History
  history: EditorHistory
  
  // Actions
  addElement: (element: Omit<CanvasElement, 'id' | 'zIndex'>) => void
  updateElement: (id: string, updates: Partial<CanvasElement>) => void
  deleteElement: (id: string) => void
  selectElement: (id: string | null) => void
  duplicateElement: (id: string) => void
  
  // Layer management
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  
  // Canvas controls
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleBleed: () => void
  toggleTrim: () => void
  toggleSafety: () => void
  toggleSnapToGrid: () => void
  setCurrentFace: (face: 'front' | 'back') => void
  setBackground: (bg: string) => void
  
  // History
  undo: () => void
  redo: () => void
  saveHistory: () => void
  
  // Reset
  reset: () => void
}

const initialElements: CanvasElement[] = [
  {
    id: 'el_default_1',
    type: 'text',
    text: 'GRAPHIC MITRA STUDIO',
    x: 100,
    y: 150,
    width: 850,
    height: 100,
    fontSize: 48,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#322F30',
    align: 'center',
    verticalAlign: 'middle',
    letterSpacing: 0,
    lineHeight: 1.2,
    rotation: 0,
    zIndex: 0,
    visible: true,
    locked: false,
    padding: { horizontal: 12, vertical: 8 },
  },
]

const initialHistory: EditorHistory = {
  past: [],
  present: initialElements,
  future: [],
}

export const useEditorStore = create<EditorState>((set, get) => ({
  elements: initialElements,
  selectedId: 'el_default_1', // Select the default element
  zoom: 100,
  showGrid: false,
  showBleed: true,
  showTrim: true,
  showSafety: true,
  snapToGrid: true,
  gridSize: 10,
  currentFace: 'front',
  background: 'linear-gradient(135deg, #0369a1, #0891b2)',
  history: initialHistory,

  addElement: (element) => {
    const newElement: CanvasElement = {
      ...element,
      id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      zIndex: get().elements.length,
    }
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedId: newElement.id,
    }))
    get().saveHistory()
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }))
    get().saveHistory()
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }))
    get().saveHistory()
  },

  selectElement: (id) => {
    set({ selectedId: id })
  },

  duplicateElement: (id) => {
    const element = get().elements.find((el) => el.id === id)
    if (!element) return
    
    const newElement: CanvasElement = {
      ...element,
      id: `el_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: get().elements.length,
    }
    
    set((state) => ({
      elements: [...state.elements, newElement],
      selectedId: newElement.id,
    }))
    get().saveHistory()
  },

  bringForward: (id) => {
    const elements = get().elements
    const index = elements.findIndex((el) => el.id === id)
    if (index === -1 || index === elements.length - 1) return
    
    const newElements = [...elements]
    const temp = newElements[index].zIndex
    newElements[index].zIndex = newElements[index + 1].zIndex
    newElements[index + 1].zIndex = temp
    
    set({ elements: newElements.sort((a, b) => a.zIndex - b.zIndex) })
    get().saveHistory()
  },

  sendBackward: (id) => {
    const elements = get().elements
    const index = elements.findIndex((el) => el.id === id)
    if (index === -1 || index === 0) return
    
    const newElements = [...elements]
    const temp = newElements[index].zIndex
    newElements[index].zIndex = newElements[index - 1].zIndex
    newElements[index - 1].zIndex = temp
    
    set({ elements: newElements.sort((a, b) => a.zIndex - b.zIndex) })
    get().saveHistory()
  },

  bringToFront: (id) => {
    const elements = get().elements
    const element = elements.find((el) => el.id === id)
    if (!element) return
    
    const maxZ = Math.max(...elements.map((el) => el.zIndex))
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, zIndex: maxZ + 1 } : el
      ).sort((a, b) => a.zIndex - b.zIndex),
    }))
    get().saveHistory()
  },

  sendToBack: (id) => {
    const elements = get().elements
    const element = elements.find((el) => el.id === id)
    if (!element) return
    
    const minZ = Math.min(...elements.map((el) => el.zIndex))
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, zIndex: minZ - 1 } : el
      ).sort((a, b) => a.zIndex - b.zIndex),
    }))
    get().saveHistory()
  },

  setZoom: (zoom) => set({ zoom: Math.max(50, Math.min(200, zoom)) }),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleBleed: () => set((state) => ({ showBleed: !state.showBleed })),
  toggleTrim: () => set((state) => ({ showTrim: !state.showTrim })),
  toggleSafety: () => set((state) => ({ showSafety: !state.showSafety })),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  setCurrentFace: (face) => set({ currentFace: face }),
  setBackground: (bg) => {
    set({ background: bg })
    get().saveHistory()
  },

  saveHistory: () => {
    const { elements, history } = get()
    set({
      history: {
        past: [...history.past, history.present],
        present: elements,
        future: [],
      },
    })
  },

  undo: () => {
    const { history } = get()
    if (history.past.length === 0) return
    
    const previous = history.past[history.past.length - 1]
    const newPast = history.past.slice(0, history.past.length - 1)
    
    set({
      elements: previous,
      history: {
        past: newPast,
        present: previous,
        future: [history.present, ...history.future],
      },
    })
  },

  redo: () => {
    const { history } = get()
    if (history.future.length === 0) return
    
    const next = history.future[0]
    const newFuture = history.future.slice(1)
    
    set({
      elements: next,
      history: {
        past: [...history.past, history.present],
        present: next,
        future: newFuture,
      },
    })
  },

  reset: () => {
    set({
      elements: initialElements,
      selectedId: null,
      zoom: 100,
      showGrid: false,
      showBleed: true,
      showTrim: true,
      showSafety: true,
      snapToGrid: true,
      currentFace: 'front',
      background: 'linear-gradient(135deg, #0369a1, #0891b2)',
      history: initialHistory,
    })
  },
}))
