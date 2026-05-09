export interface GraphicElement {
  id: string
  type: 'shape' | 'image' | 'icon' | 'illustration'
  category: string
  name: string
  src?: string
  svg?: string
  width: number
  height: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  opacity?: number
  rotation?: number
  x: number
  y: number
  locked?: boolean
  visible?: boolean
}

export interface ShapeData {
  id: string
  type: 'rectangle' | 'circle' | 'triangle' | 'line' | 'arrow' | 'star' | 'polygon'
  name: string
  svg: string
  defaultWidth: number
  defaultHeight: number
  category: 'basic' | 'arrows' | 'decorative' | 'business'
}

export interface IconData {
  id: string
  name: string
  category: string
  svg: string
  keywords: string[]
}

export interface ImageData {
  id: string
  name: string
  category: string
  src: string
  width: number
  height: number
  tags: string[]
}

export interface GraphicsLibraryProps {
  onAddElement: (element: Partial<GraphicElement>) => void
  searchTerm?: string
  selectedCategory?: string
}

export interface GraphicToolbarProps {
  selectedElement: GraphicElement | null
  onUpdate: (properties: Partial<GraphicElement>) => void
  onDuplicate: () => void
  onDelete: () => void
  onBringForward: () => void
  onSendBackward: () => void
}