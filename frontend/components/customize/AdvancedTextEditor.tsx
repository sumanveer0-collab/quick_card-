'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Plus, Minus, Type, Palette, RotateCw, Copy, Trash2,
  ChevronUp, ChevronDown, X, Edit3
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface AdvancedTextEditorProps {
  elementId: string
  onClose: () => void
  displayScale: number
}

export default function AdvancedTextEditor({
  elementId,
  onClose,
  displayScale
}: AdvancedTextEditorProps) {
  const { elements, updateElement, duplicateElement, deleteElement } = useEditorStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontSelector, setShowFontSelector] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const element = elements.find(el => el.id === elementId && el.type === 'text')
  
  if (!element) return null

  const {
    text = 'Text',
    fontSize = 16,
    fontFamily = 'Arial',
    fontWeight = 'normal',
    fill = '#000000',
    align = 'left',
    x = 0,
    y = 0,
    width = 200,
    height = 50,
    rotation = 0
  } = element

  // Calculate position for toolbar and editor
  const editorStyle = {
    left: x * displayScale,
    top: y * displayScale,
    width: width * displayScale,
    minHeight: height * displayScale,
    fontSize: Math.max(12, fontSize * displayScale * 0.8),
    fontFamily,
    fontWeight,
    color: fill,
    textAlign: align as 'left' | 'center' | 'right',
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'top left'
  }

  const toolbarStyle = {
    left: x * displayScale,
    top: Math.max(10, (y - 80) * displayScale),
  }

  // Font options
  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino'
  ]

  const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72]

  const colorPresets = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ]

  // Handle text change
  const handleTextChange = (newText: string) => {
    updateElement(elementId, { text: newText })
  }

  // Handle style changes
  const handleStyleChange = (properties: any) => {
    updateElement(elementId, properties)
  }

  // Toggle editing mode
  const toggleEditing = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setTimeout(() => {
        textareaRef.current?.focus()
        textareaRef.current?.select()
      }, 100)
    }
  }

  // Auto-resize textarea
  const autoResize = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
      
      // Update element dimensions
      const newHeight = Math.max(textarea.scrollHeight / displayScale, 30)
      handleStyleChange({ height: newHeight })
    }
  }

  useEffect(() => {
    if (isEditing) {
      autoResize()
    }
  }, [text, isEditing])

  // Handle keyboard shortcuts
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

  return (
    <div className="absolute z-50" style={{ left: 0, top: 0 }}>
      {/* Advanced Floating Toolbar */}
      <AnimatePresence>
        {!isEditing && (
          <motion.div
            ref={toolbarRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-max"
            style={toolbarStyle}
          >
            <div className="flex items-center gap-3 flex-wrap max-w-4xl">
              {/* Font Family */}
              <div className="relative">
                <button
                  onClick={() => setShowFontSelector(!showFontSelector)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors min-w-[120px]"
                >
                  <Type className="w-4 h-4" />
                  <span className="text-sm font-medium truncate" style={{ fontFamily }}>
                    {fontFamily}
                  </span>
                </button>
                
                {showFontSelector && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {fontOptions.map(font => (
                      <button
                        key={font}
                        onClick={() => {
                          handleStyleChange({ fontFamily: font })
                          setShowFontSelector(false)
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          font === fontFamily ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Font Size */}
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => handleStyleChange({ fontSize: Math.max(8, fontSize - 2) })}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <select
                  value={fontSize}
                  onChange={(e) => handleStyleChange({ fontSize: parseInt(e.target.value) })}
                  className="px-3 py-2 border-0 bg-transparent text-sm font-medium focus:outline-none min-w-[60px]"
                >
                  {fontSizeOptions.map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
                
                <button
                  onClick={() => handleStyleChange({ fontSize: Math.min(72, fontSize + 2) })}
                  className="p-2 hover:bg-gray-200 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStyleChange({ 
                    fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                  className={`p-3 rounded-lg transition-colors ${
                    fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStyleChange({ 
                    fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                  className={`p-3 rounded-lg transition-colors ${
                    element.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStyleChange({ 
                    textDecoration: element.textDecoration === 'underline' ? 'none' : 'underline' 
                  })}
                  className={`p-3 rounded-lg transition-colors ${
                    element.textDecoration === 'underline' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Text Alignment */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStyleChange({ align: 'left' })}
                  className={`p-3 rounded-lg transition-colors ${
                    align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleStyleChange({ align: 'center' })}
                  className={`p-3 rounded-lg transition-colors ${
                    align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleStyleChange({ align: 'right' })}
                  className={`p-3 rounded-lg transition-colors ${
                    align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Color Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Palette className="w-4 h-4" />
                  <div 
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: fill }}
                  />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 w-64">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                      <div className="grid grid-cols-8 gap-2 mb-3">
                        {colorPresets.map(color => (
                          <button
                            key={color}
                            onClick={() => {
                              handleStyleChange({ fill: color })
                              setShowColorPicker(false)
                            }}
                            className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                              fill === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        value={fill}
                        onChange={(e) => handleStyleChange({ fill: e.target.value })}
                        className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Rotation */}
              <div className="flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={rotation}
                  onChange={(e) => handleStyleChange({ rotation: parseFloat(e.target.value) })}
                  className="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-500 min-w-[40px]">{rotation}°</span>
              </div>

              <div className="w-px h-8 bg-gray-300" />

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => duplicateElement(elementId)}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Duplicate (Ctrl+D)"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    deleteElement(elementId)
                    onClose()
                  }}
                  className="p-3 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                  title="Delete (Del)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={onClose}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Editor */}
      <div
        className="absolute border-2 border-dashed border-blue-500 bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden"
        style={editorStyle}
        onClick={toggleEditing}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full resize-none border-none outline-none bg-transparent p-3 leading-relaxed"
            style={{
              fontSize: Math.max(12, fontSize * displayScale * 0.8),
              fontFamily,
              fontWeight,
              color: fill,
              textAlign: align as 'left' | 'center' | 'right'
            }}
            autoFocus
            placeholder="Enter your text..."
          />
        ) : (
          <div
            className="w-full h-full p-3 cursor-text leading-relaxed"
            style={{
              fontSize: Math.max(12, fontSize * displayScale * 0.8),
              fontFamily,
              fontWeight,
              color: fill,
              textAlign: align as 'left' | 'center' | 'right',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {text || 'Click to edit text'}
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isEditing && (
        <div 
          className="absolute bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium pointer-events-none"
          style={{ 
            left: editorStyle.left, 
            top: (y * displayScale) + (height * displayScale) + 10 
          }}
        >
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            <span>Click to edit • Enter to type • Esc to close</span>
          </div>
        </div>
      )}
    </div>
  )
}