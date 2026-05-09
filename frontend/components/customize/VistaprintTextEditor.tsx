'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Plus, Minus, Copy, Trash2, ChevronUp, ChevronDown, RotateCw,
  Palette, Type, X
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface VistaprintTextEditorProps {
  elementId: string
  onClose: () => void
  displayScale: number
}

export default function VistaprintTextEditor({
  elementId,
  onClose,
  displayScale
}: VistaprintTextEditorProps) {
  const { elements, updateElement, duplicateElement, deleteElement } = useEditorStore()
  const [isEditing, setIsEditing] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
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
    height = 50
  } = element

  // Calculate position for toolbar and editor
  const editorStyle = {
    left: x * displayScale,
    top: y * displayScale,
    width: width * displayScale,
    minHeight: height * displayScale,
    fontSize: fontSize * displayScale,
    fontFamily,
    fontWeight,
    color: fill,
    textAlign: align as 'left' | 'center' | 'right'
  }

  const toolbarStyle = {
    left: x * displayScale,
    top: (y - 60) * displayScale,
  }

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
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, elementId, deleteElement, duplicateElement, onClose])

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
      
      // Update element dimensions
      const newHeight = Math.max(textarea.scrollHeight / displayScale, 30)
      handleStyleChange({ height: newHeight })
    }
  }, [displayScale])

  useEffect(() => {
    if (isEditing) {
      autoResize()
    }
  }, [text, isEditing, autoResize])

  const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72]
  const colorPresets = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080'
  ]

  return (
    <div className="absolute z-50" style={{ left: 0, top: 0 }}>
      {/* Floating Toolbar */}
      <AnimatePresence>
        {!isEditing && (
          <motion.div
            ref={toolbarRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute bg-white rounded-lg shadow-2xl border border-gray-200 p-3 min-w-max"
            style={toolbarStyle}
          >
            <div className="flex items-center gap-2 flex-wrap">
              {/* Font Size */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStyleChange({ fontSize: Math.max(8, fontSize - 2) })}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                
                <select
                  value={fontSize}
                  onChange={(e) => handleStyleChange({ fontSize: parseInt(e.target.value) })}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {fontSizeOptions.map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
                
                <button
                  onClick={() => handleStyleChange({ fontSize: Math.min(72, fontSize + 2) })}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Text Formatting */}
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

              <div className="w-px h-6 bg-gray-300" />

              {/* Alignment */}
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

              <div className="w-px h-6 bg-gray-300" />

              {/* Color Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
                >
                  <Palette className="w-4 h-4" />
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: fill }}
                  />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
                    <div className="grid grid-cols-4 gap-1 mb-3">
                      {colorPresets.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            handleStyleChange({ fill: color })
                            setShowColorPicker(false)
                          }}
                          className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
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

      {/* Text Editor */}
      <div
        className="absolute border-2 border-dashed border-blue-500 bg-white/90 backdrop-blur-sm"
        style={editorStyle}
        onClick={toggleEditing}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="w-full h-full resize-none border-none outline-none bg-transparent p-2"
            style={{
              fontSize: fontSize * displayScale,
              fontFamily,
              fontWeight,
              color: fill,
              textAlign: align as 'left' | 'center' | 'right'
            }}
            autoFocus
          />
        ) : (
          <div
            className="w-full h-full p-2 cursor-text"
            style={{
              fontSize: fontSize * displayScale,
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
          className="absolute bg-black/80 text-white px-2 py-1 rounded text-xs font-medium pointer-events-none"
          style={{ 
            left: editorStyle.left, 
            top: editorStyle.top + (height * displayScale) + 5 
          }}
        >
          Click to edit • Enter to type • ESC to close
        </div>
      )}
    </div>
  )
}