'use client'
import { motion } from 'framer-motion'
import {
  Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd,
  Plus, Minus, Palette, Copy, Trash2, Lock, Unlock
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { useState } from 'react'

const FONTS = [
  'Secuela', 'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Raleway', 'Oswald', 'Georgia', 'Arial'
]

export default function FloatingToolbar() {
  const { elements, selectedId, updateElement, duplicateElement, deleteElement } = useEditorStore()
  const element = elements.find((el) => el.id === selectedId)
  const [showColorPicker, setShowColorPicker] = useState(false)

  if (!element) return null

  const isTextElement = element.type === 'text'
  const isBold = element.fontWeight === 'bold' || element.fontWeight === '700'
  const isItalic = element.fontWeight?.includes('italic')

  const handleFontChange = (fontFamily: string) => {
    // Calculate required height for new font family
    const calculateTextHeight = () => {
      if (typeof window === 'undefined') return element.height
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return element.height
      
      context.font = `${element.fontSize || 16}px ${fontFamily}`
      
      const availableWidth = element.width - 24 // Minus padding
      const words = (element.text || '').split(' ')
      let lines = 1
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = context.measureText(testLine)
        
        if (metrics.width > availableWidth && currentLine) {
          lines++
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      
      const lineHeight = element.lineHeight || 1.2
      const textHeight = lines * (element.fontSize || 16) * lineHeight
      return Math.max(textHeight + 16, 30) // Add padding, minimum 30px
    }
    
    const requiredHeight = calculateTextHeight()
    
    // Update both font family and height if needed
    const updates: any = { fontFamily }
    if (requiredHeight > element.height) {
      updates.height = requiredHeight
    }
    
    updateElement(selectedId!, updates)
  }

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, (element.fontSize || 16) + delta))
    
    // Calculate required height for new font size using canvas measurement
    const calculateTextHeight = () => {
      if (typeof window === 'undefined') return element.height
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return element.height
      
      context.font = `${newSize}px ${element.fontFamily || 'Inter'}`
      
      const availableWidth = element.width - 24 // Minus padding
      const words = (element.text || '').split(' ')
      let lines = 1
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = context.measureText(testLine)
        
        if (metrics.width > availableWidth && currentLine) {
          lines++
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      
      const lineHeight = element.lineHeight || 1.2
      const textHeight = lines * newSize * lineHeight
      return Math.max(textHeight + 16, 30) // Add padding, minimum 30px
    }
    
    const requiredHeight = calculateTextHeight()
    
    // Update both font size and height if needed
    const updates: any = { fontSize: newSize }
    if (requiredHeight > element.height) {
      updates.height = requiredHeight
    }
    
    updateElement(selectedId!, updates)
  }

  const handleToggleBold = () => {
    const newWeight = isBold ? 'normal' : 'bold'
    
    // Calculate required height for new font weight
    const calculateTextHeight = () => {
      if (typeof window === 'undefined') return element.height
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return element.height
      
      context.font = `${newWeight} ${element.fontSize || 16}px ${element.fontFamily || 'Inter'}`
      
      const availableWidth = element.width - 24
      const words = (element.text || '').split(' ')
      let lines = 1
      let currentLine = ''
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word
        const metrics = context.measureText(testLine)
        
        if (metrics.width > availableWidth && currentLine) {
          lines++
          currentLine = word
        } else {
          currentLine = testLine
        }
      }
      
      const lineHeight = element.lineHeight || 1.2
      const textHeight = lines * (element.fontSize || 16) * lineHeight
      return Math.max(textHeight + 16, 30)
    }
    
    const requiredHeight = calculateTextHeight()
    
    const updates: any = { fontWeight: newWeight }
    if (requiredHeight > element.height) {
      updates.height = requiredHeight
    }
    
    updateElement(selectedId!, updates)
  }

  const handleToggleItalic = () => {
    const baseWeight = element.fontWeight?.replace('italic', '').trim() || 'normal'
    updateElement(selectedId!, { 
      fontWeight: isItalic ? baseWeight : `${baseWeight} italic` 
    })
  }

  const handleAlignChange = (align: 'left' | 'center' | 'right') => {
    updateElement(selectedId!, { align })
  }

  const handleVerticalAlignChange = (verticalAlign: 'top' | 'middle' | 'bottom') => {
    updateElement(selectedId!, { verticalAlign })
  }

  const handleColorChange = (color: string) => {
    updateElement(selectedId!, { fill: color })
    setShowColorPicker(false)
  }

  const handleToggleLock = () => {
    updateElement(selectedId!, { locked: !element.locked })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 px-3 py-2 flex items-center gap-1">
        {/* Text-specific controls */}
        {isTextElement && (
          <>
            {/* Font Family */}
            <select
              value={element.fontFamily || 'Inter'}
              onChange={(e) => handleFontChange(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg px-1">
              <button
                onClick={() => handleFontSizeChange(-2)}
                className="p-1.5 hover:bg-white rounded-lg transition-colors"
                title="Decrease font size"
              >
                <Minus className="w-3.5 h-3.5 text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-700 min-w-[32px] text-center">
                {element.fontSize || 16}
              </span>
              <button
                onClick={() => handleFontSizeChange(2)}
                className="p-1.5 hover:bg-white rounded-lg transition-colors"
                title="Increase font size"
              >
                <Plus className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Bold/Italic */}
            <button
              onClick={handleToggleBold}
              className={`p-2 rounded-lg transition-all ${
                isBold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={handleToggleItalic}
              className={`p-2 rounded-lg transition-all ${
                isItalic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Horizontal Alignment */}
            <button
              onClick={() => handleAlignChange('left')}
              className={`p-2 rounded-lg transition-all ${
                element.align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAlignChange('center')}
              className={`p-2 rounded-lg transition-all ${
                element.align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAlignChange('right')}
              className={`p-2 rounded-lg transition-all ${
                element.align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align right"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Vertical Alignment */}
            <button
              onClick={() => handleVerticalAlignChange('top')}
              className={`p-2 rounded-lg transition-all ${
                element.verticalAlign === 'top' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align top"
            >
              <AlignVerticalJustifyStart className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleVerticalAlignChange('middle')}
              className={`p-2 rounded-lg transition-all ${
                (element.verticalAlign === 'middle' || !element.verticalAlign) ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align middle"
            >
              <AlignVerticalJustifyCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleVerticalAlignChange('bottom')}
              className={`p-2 rounded-lg transition-all ${
                element.verticalAlign === 'bottom' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Align bottom"
            >
              <AlignVerticalJustifyEnd className="w-4 h-4" />
            </button>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
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
                  <div className="grid grid-cols-6 gap-2">
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
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="w-px h-6 bg-gray-200 mx-1" />
          </>
        )}

        {/* Common controls */}
        <button
          onClick={handleToggleLock}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title={element.locked ? 'Unlock' : 'Lock'}
        >
          {element.locked ? (
            <Lock className="w-4 h-4 text-gray-600" />
          ) : (
            <Unlock className="w-4 h-4 text-gray-600" />
          )}
        </button>

        <button
          onClick={() => duplicateElement(selectedId!)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Duplicate (Ctrl+D)"
        >
          <Copy className="w-4 h-4 text-gray-600" />
        </button>

        <button
          onClick={() => deleteElement(selectedId!)}
          className="p-2 rounded-lg hover:bg-red-50 transition-colors"
          title="Delete (Del)"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </motion.div>
  )
}
