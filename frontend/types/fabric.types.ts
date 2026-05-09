import { fabric } from 'fabric'

export interface TextObjectData {
  id: string
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: string | number
  fontStyle: string
  underline: boolean
  fill: string
  textAlign: string
  charSpacing: number
  lineHeight: number
  angle: number
  opacity: number
  width: number
  height: number
  left: number
  top: number
  editable: boolean
  lockScalingFlip: boolean
  scaleX?: number
  scaleY?: number
}

export interface TextToolbarState {
  fontFamily: string
  fontSize: number
  fontWeight: string | number
  fontStyle: string
  underline: boolean
  fill: string
  textAlign: string
  charSpacing: number
  lineHeight: number
  angle: number
  opacity: number
}

export interface CanvasEditorProps {
  width: number
  height: number
  onTextChange?: (textObjects: TextObjectData[]) => void
  initialTexts?: TextObjectData[]
}

export interface FabricTextbox extends fabric.Textbox {
  id?: string
  customData?: TextObjectData
}

export interface FontOption {
  label: string
  value: string
  category?: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting'
}

export interface TextControlsProps {
  selectedText: FabricTextbox | null
  onUpdate: (properties: Partial<TextObjectData>) => void
  onDuplicate: () => void
  onDelete: () => void
  onBringForward: () => void
  onSendBackward: () => void
}

export interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  presets?: string[]
}

export interface FontSelectorProps {
  value: string
  onChange: (fontFamily: string) => void
  fonts: FontOption[]
}