'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Plus, Minus, Type, Palette, RotateCw, Copy, Trash2, X,
  ChevronDown, List, ListOrdered, Strikethrough
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface CanvasTextEditorProps {
  elementId: string
  onClose: () => void
  displayScale: number
  canvasRef: React.RefObject<HTMLDivElement>
}

export default function CanvasTextEditor({
  elementId,
  onClose,
  displayScale,
  canvasRef
}: CanvasTextEditorProps) {
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

  // Get canvas container position
  const getCanvasPosition = () => {
    if (!canvasRef.current) return { left: 0, top: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    return { left: rect.left, top: rect.top }
  }

  const canvasPos = getCanvasPosition()

  // Calculate position for toolbar and editor relative to canvas
  const toolbarStyle = {
    left: canvasPos.left + (x * displayScale) + (width * displayScale / 2),
    top: canvasPos.top + (y * displayScale) - 60,
    transform: 'translateX(-50%)',
    zIndex: 1000
  }

  const editorStyle = {
    left: canvasPos.left + (x * displayScale),
    top: canvasPos.top + (y * displayScale),
    width: width * displayScale,
    minHeight: height * displayScale,
    fontSize: Math.max(12, fontSize * displayScale * 0.8),
    fontFamily,
    fontWeight,
    color: fill,
    textAlign: align as 'left' | 'center' | 'right',
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'top left',
    zIndex: 999
  }

  // Font options
  const fontOptions = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino',
    'Garamond', 'Bookman', 'Avant Garde', 'Optima', 'Futura'
  ]

  const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72, 96]

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
        setShowFontSelector(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Floating Toolbar - Positioned above canvas */}
      <AnimatePresence>
        {!isEditing && (
          <motion.div
            ref={toolbarRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 p-2"
            style={toolbarStyle}
          >
            <div className="flex items-center gap-1 flex-wrap">
              {/* Font Family */}
              <div className="relative">
                <button
                  onClick={() => setShowFontSelector(!showFontSelector)}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-sm hover:bg-gray-100 transition-colors min-w-[100px]"
                >
                  <span className="truncate" style={{ fontFamily }}>
                    {fontFamily}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                
                {showFontSelector && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {fontOptions.map(font => (
                      <button
                        key={font}
                        onClick={() => {
                          handleStyleChange({ fontFamily: font })
                          setShowFontSelector(false)
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
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

              <div className="w-px h-6 bg-gray-300" />

              {/* Font Size */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStyleChange({ fontSize: Math.max(8, fontSize - 2) })}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                
                <select
                  value={fontSize}
                  onChange={(e) => handleStyleChange({ fontSize: parseInt(e.target.value) })}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[50px]"
                >
                  {fontSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => handleStyleChange({ fontSize: Math.min(96, fontSize + 2) })}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStyleChange({ 
                    fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                  className={`p-2 rounded transition-colors ${
                    fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStyleChange({ 
                    fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                  className={`p-2 rounded transition-colors ${
                    element.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleStyleChange({ 
                    underline: !element.underline
                  })}
                  className={`p-2 rounded transition-colors ${
                    element.underline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Underline className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Text Alignment */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStyleChange({ align: 'left' })}
                  className={`p-2 rounded transition-colors ${
                    align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleStyleChange({ align: 'center' })}
                  className={`p-2 rounded transition-colors ${
                    align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleStyleChange({ align: 'right' })}
                  className={`p-2 rounded transition-colors ${
                    align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Lists */}
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <List className="w-4 h-4" />
                </button>
                
                <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                  <ListOrdered className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Format Menu */}
              <button className="px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors">
                Format
              </button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Color Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: fill }}
                  />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50 w-64">
                    <div className="grid grid-cols-8 gap-1 mb-3">
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
                      className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* More Options */}
              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Strikethrough className="w-4 h-4" />
              </button>

              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                <Type className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-300" />

              {/* Actions */}
              <button
                onClick={() => duplicateElement(elementId)}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Duplicate"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => {
                  deleteElement(elementId)
                  onClose()
                }}
                className="p-2 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Editor - Positioned on canvas */}
      <div
        className="fixed bg-transparent overflow-hidden cursor-text"
        style={editorStyle}
        onClick={toggleEditing}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full resize-none border-none outline-none bg-white/95 backdrop-blur-sm p-2 leading-relaxed rounded-lg"
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
            className="w-full h-full p-2 leading-relaxed"
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

      {/* Selection removed - no visual indicators */}
    </>
  )
}