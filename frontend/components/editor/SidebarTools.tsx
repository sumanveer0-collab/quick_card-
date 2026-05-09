'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Image, Square, Circle, Minus, ChevronDown, ChevronUp,
  Palette, Upload, Layers, Grid, Sparkles, AlignLeft, AlignCenter,
  AlignRight, Bold, Italic, Trash2
} from 'lucide-react'
import { useEditorStore, SAFE_AREA_X, SAFE_AREA_Y, SAFE_AREA_WIDTH, SAFE_AREA_HEIGHT } from '@/store/editor.store'
import ColorPicker from './ColorPicker'

const FONTS = [
  'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Raleway', 'Oswald', 'Georgia', 'Arial'
]

interface CollapsibleSectionProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
            {icon}
          </div>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SidebarTools() {
  const {
    addElement,
    updateElement,
    deleteElement,
    selectedId,
    elements,
    background,
    setBackground,
  } = useEditorStore()

  const selectedElement = elements.find((el) => el.id === selectedId)

  const handleAddText = () => {
    // Position text in center of safe area
    const centerX = SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - 100 // 100 = half of text width
    const centerY = SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - 20 // 20 = half of text height
    
    addElement({
      type: 'text',
      x: centerX,
      y: centerY,
      width: 200,
      height: 40,
      rotation: 0,
      text: 'Double click to edit',
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fill: '#000000',
      align: 'left',
      letterSpacing: 0,
      lineHeight: 1.2,
      visible: true,
    })
  }

  const handleAddShape = (shapeType: 'rect' | 'circle' | 'line') => {
    // Position shape in center of safe area
    const shapeWidth = shapeType === 'line' ? 200 : 100
    const shapeHeight = shapeType === 'line' ? 0 : 100
    const centerX = SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - (shapeWidth / 2)
    const centerY = SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - (shapeHeight / 2)
    
    addElement({
      type: 'shape',
      x: centerX,
      y: centerY,
      width: shapeWidth,
      height: shapeHeight,
      rotation: 0,
      shapeType,
      fill: '#3b82f6',
      stroke: '#1e40af',
      strokeWidth: 2,
      cornerRadius: shapeType === 'rect' ? 8 : 0,
      visible: true,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      
      // Position image in center of safe area
      const imageWidth = 150
      const imageHeight = 150
      const centerX = SAFE_AREA_X + (SAFE_AREA_WIDTH / 2) - (imageWidth / 2)
      const centerY = SAFE_AREA_Y + (SAFE_AREA_HEIGHT / 2) - (imageHeight / 2)
      
      addElement({
        type: 'image',
        x: centerX,
        y: centerY,
        width: imageWidth,
        height: imageHeight,
        rotation: 0,
        src: dataUrl,
        visible: true,
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          Tools
        </h2>
        <p className="text-xs text-gray-500 mt-1">Customize your business card</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Add Elements */}
        <CollapsibleSection title="Add Elements" icon={<Sparkles className="w-4 h-4" />}>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddText}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all group"
            >
              <Type className="w-5 h-5" />
              <span className="text-xs font-semibold">Text</span>
            </button>

            <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all cursor-pointer group">
              <Image className="w-5 h-5" />
              <span className="text-xs font-semibold">Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            <button
              onClick={() => handleAddShape('rect')}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all group"
            >
              <Square className="w-5 h-5" />
              <span className="text-xs font-semibold">Rectangle</span>
            </button>

            <button
              onClick={() => handleAddShape('circle')}
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all group"
            >
              <Circle className="w-5 h-5" />
              <span className="text-xs font-semibold">Circle</span>
            </button>
          </div>
        </CollapsibleSection>

        {/* Background */}
        <CollapsibleSection title="Background" icon={<Palette className="w-4 h-4" />}>
          <ColorPicker
            value={background}
            onChange={setBackground}
            label="Background Color"
          />
        </CollapsibleSection>

        {/* Text Editor (only show when text is selected) */}
        {selectedElement?.type === 'text' && (
          <CollapsibleSection title="Text Editor" icon={<Type className="w-4 h-4" />}>
            <div className="space-y-4">
              {/* Text Content */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Text Content
                </label>
                <textarea
                  value={selectedElement.text || ''}
                  onChange={(e) => updateElement(selectedId!, { text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all resize-none"
                  rows={3}
                  placeholder="Enter text..."
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Tip: Double-click text on canvas to edit inline
                </p>
              </div>

              {/* Font Family */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Font Family
                </label>
                <select
                  value={selectedElement.fontFamily || 'Inter'}
                  onChange={(e) => updateElement(selectedId!, { fontFamily: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
                >
                  {FONTS.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Font Size: {selectedElement.fontSize || 16}px
                </label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={selectedElement.fontSize || 16}
                  onChange={(e) => updateElement(selectedId!, { fontSize: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Font Weight */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Font Weight
                </label>
                <div className="flex gap-2">
                  {['normal', 'bold', '600', '700', '800'].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => updateElement(selectedId!, { fontWeight: weight })}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                        selectedElement.fontWeight === weight
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={{ fontWeight: weight }}
                    >
                      {weight === 'normal' ? 'Normal' : weight === 'bold' ? 'Bold' : weight}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Alignment */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Alignment
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'left', icon: AlignLeft },
                    { value: 'center', icon: AlignCenter },
                    { value: 'right', icon: AlignRight },
                  ].map(({ value, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => updateElement(selectedId!, { align: value })}
                      className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center ${
                        selectedElement.align === value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <ColorPicker
                value={selectedElement.fill || '#000000'}
                onChange={(color) => updateElement(selectedId!, { fill: color })}
                label="Text Color"
              />

              {/* Letter Spacing */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Letter Spacing: {selectedElement.letterSpacing || 0}px
                </label>
                <input
                  type="range"
                  min="-5"
                  max="20"
                  step="0.5"
                  value={selectedElement.letterSpacing || 0}
                  onChange={(e) => updateElement(selectedId!, { letterSpacing: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Line Height */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Line Height: {selectedElement.lineHeight || 1.2}
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={selectedElement.lineHeight || 1.2}
                  onChange={(e) => updateElement(selectedId!, { lineHeight: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </CollapsibleSection>
        )}

        {/* Shape Editor (only show when shape is selected) */}
        {selectedElement?.type === 'shape' && (
          <CollapsibleSection title="Shape Editor" icon={<Square className="w-4 h-4" />}>
            <div className="space-y-4">
              {/* Fill Color */}
              <ColorPicker
                value={selectedElement.fill || '#3b82f6'}
                onChange={(color) => updateElement(selectedId!, { fill: color })}
                label="Fill Color"
              />

              {/* Stroke Color */}
              <ColorPicker
                value={selectedElement.stroke || '#1e40af'}
                onChange={(color) => updateElement(selectedId!, { stroke: color })}
                label="Stroke Color"
              />

              {/* Stroke Width */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                  Stroke Width: {selectedElement.strokeWidth || 2}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={selectedElement.strokeWidth || 2}
                  onChange={(e) => updateElement(selectedId!, { strokeWidth: Number(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Corner Radius (for rectangles) */}
              {selectedElement.shapeType === 'rect' && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Corner Radius: {selectedElement.cornerRadius || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={selectedElement.cornerRadius || 0}
                    onChange={(e) => updateElement(selectedId!, { cornerRadius: Number(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Delete Element */}
        {selectedElement && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => deleteElement(selectedId!)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete Element
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
