'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Plus, Minus, Palette
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { useState, useRef, useEffect } from 'react'

interface FloatingTextToolbarProps {
  elementId: string
  position: { x: number; y: number }
  onClose: () => void
}

const FONTS = [
  'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Raleway', 'Oswald', 'Georgia', 'Arial'
]

export default function FloatingTextToolbar({ elementId, position, onClose }: FloatingTextToolbarProps) {
  const { elements, updateElement } = useEditorStore()
  const element = elements.find((el) => el.id === elementId)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!element || element.type !== 'text') return null

  const handleFontChange = (fontFamily: string) => {
    updateElement(elementId, { fontFamily })
  }

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, (element.fontSize || 16) + delta))
    updateElement(elementId, { fontSize: newSize })
  }

  const handleToggleBold = () => {
    const isBold = element.fontWeight === 'bold' || element.fontWeight === '700'
    updateElement(elementId, { fontWeight: isBold ? 'normal' : 'bold' })
  }

  const handleToggleItalic = () => {
    const isItalic = element.fontWeight?.includes('italic')
    const baseWeight = element.fontWeight?.replace('italic', '').trim() || 'normal'
    updateElement(elementId, { 
      fontWeight: isItalic ? baseWeight : `${baseWeight} italic` 
    })
  }

  const handleAlignChange = (align: string) => {
    updateElement(elementId, { align })
  }

  const handleColorChange = (color: string) => {
    updateElement(elementId, { fill: color })
    setShowColorPicker(false)
  }

  const handleLetterSpacingChange = (delta: number) => {
    const newSpacing = (element.letterSpacing || 0) + delta
    updateElement(elementId, { letterSpacing: Math.max(-5, Math.min(20, newSpacing)) })
  }

  const handleLineHeightChange = (delta: number) => {
    const newHeight = (element.lineHeight || 1.2) + delta
    updateElement(elementId, { lineHeight: Math.max(0.8, Math.min(2.5, newHeight)) })
  }

  const isBold = element.fontWeight === 'bold' || element.fontWeight === '700'
  const isItalic = element.fontWeight?.includes('italic')

  return (
    <AnimatePresence>
      <motion.div
        ref={toolbarRef}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-2"
        style={{
          left: `${position.x}px`,
          top: `${position.y - 60}px`,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="flex items-center gap-1">
          {/* Font Family */}
          <select
            value={element.fontFamily || 'Inter'}
            onChange={(e) => handleFontChange(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            style={{ fontFamily: element.fontFamily || 'Inter' }}
          >
            {FONTS.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Font Size */}
          <div className="flex items-center gap-0.5 bg-gray-50 rounded-lg px-1">
            <button
              onClick={() => handleFontSizeChange(-2)}
              className="p-1 hover:bg-white rounded transition-colors"
              title="Decrease font size"
            >
              <Minus className="w-3 h-3 text-gray-600" />
            </button>
            <span className="text-xs font-semibold text-gray-700 min-w-[28px] text-center">
              {element.fontSize || 16}
            </span>
            <button
              onClick={() => handleFontSizeChange(2)}
              className="p-1 hover:bg-white rounded transition-colors"
              title="Increase font size"
            >
              <Plus className="w-3 h-3 text-gray-600" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Bold */}
          <button
            onClick={handleToggleBold}
            className={`p-1.5 rounded-lg transition-all ${
              isBold
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            onClick={handleToggleItalic}
            className={`p-1.5 rounded-lg transition-all ${
              isItalic
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Text Alignment */}
          <button
            onClick={() => handleAlignChange('left')}
            className={`p-1.5 rounded-lg transition-all ${
              element.align === 'left'
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignChange('center')}
            className={`p-1.5 rounded-lg transition-all ${
              element.align === 'center'
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignChange('right')}
            className={`p-1.5 rounded-lg transition-all ${
              element.align === 'right'
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Align right"
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="Text color"
            >
              <Palette className="w-4 h-4 text-gray-600" />
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: element.fill || '#000000' }}
              />
            </button>

            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50"
              >
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {[
                    '#000000', '#374151', '#6b7280', '#ffffff',
                    '#ef4444', '#f97316', '#f59e0b', '#eab308',
                    '#84cc16', '#22c55e', '#10b981', '#14b8a6',
                    '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
                    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-6 h-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-110"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={element.fill || '#000000'}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-8 rounded-lg border border-gray-200 cursor-pointer"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Tooltip arrow */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45" />
      </motion.div>
    </AnimatePresence>
  )
}
