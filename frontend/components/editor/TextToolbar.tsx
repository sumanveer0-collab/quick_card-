'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Plus, Minus, Copy, Trash2, ChevronUp, ChevronDown, RotateCw,
  Palette, Type, Move, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react'
import { TextControlsProps } from '@/types/fabric.types'
import FontSelector from './FontSelector'
import ColorPicker from './ColorPicker'

export default function TextToolbar({
  selectedText,
  onUpdate,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward
}: TextControlsProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })

  // Update toolbar position based on selected text
  useEffect(() => {
    if (!selectedText) return

    const canvas = selectedText.canvas
    if (!canvas) return

    const textBounds = selectedText.getBoundingRect()
    const canvasElement = canvas.getElement()
    const canvasRect = canvasElement.getBoundingClientRect()

    // Position toolbar above the selected text
    const x = canvasRect.left + textBounds.left + (textBounds.width / 2)
    const y = canvasRect.top + textBounds.top - 60

    setToolbarPosition({ x, y })
  }, [selectedText])

  if (!selectedText) return null

  const fontSize = selectedText.fontSize || 16
  const fontWeight = selectedText.fontWeight || 'normal'
  const fontStyle = selectedText.fontStyle || 'normal'
  const underline = selectedText.underline || false
  const textAlign = selectedText.textAlign || 'left'
  const fill = selectedText.fill as string || '#000000'
  const charSpacing = selectedText.charSpacing || 0
  const lineHeight = selectedText.lineHeight || 1.16
  const angle = selectedText.angle || 0

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(200, fontSize + delta))
    onUpdate({ fontSize: newSize })
  }

  const handleFontSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value) || 16
    onUpdate({ fontSize: Math.max(8, Math.min(200, newSize)) })
  }

  const toggleBold = () => {
    onUpdate({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })
  }

  const toggleItalic = () => {
    onUpdate({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' })
  }

  const toggleUnderline = () => {
    onUpdate({ underline: !underline })
  }

  const handleAlignment = (align: string) => {
    onUpdate({ textAlign: align })
  }

  const handleColorChange = (color: string) => {
    onUpdate({ fill: color })
    setShowColorPicker(false)
  }

  const handleCharSpacing = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ charSpacing: parseFloat(e.target.value) || 0 })
  }

  const handleLineHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ lineHeight: parseFloat(e.target.value) || 1.16 })
  }

  const handleRotation = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ angle: parseFloat(e.target.value) || 0 })
  }

  // Move controls
  const moveText = (direction: 'up' | 'down' | 'left' | 'right', distance: number = 5) => {
    const currentLeft = selectedText.left || 0
    const currentTop = selectedText.top || 0
    
    let newLeft = currentLeft
    let newTop = currentTop
    
    switch (direction) {
      case 'up':
        newTop = Math.max(0, currentTop - distance)
        break
      case 'down':
        newTop = currentTop + distance
        break
      case 'left':
        newLeft = Math.max(0, currentLeft - distance)
        break
      case 'right':
        newLeft = currentLeft + distance
        break
    }
    
    onUpdate({ left: newLeft, top: newTop })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-3"
        style={{
          left: toolbarPosition.x,
          top: toolbarPosition.y,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="flex items-center gap-2 flex-wrap max-w-4xl">
          {/* Font Family */}
          <div className="flex items-center gap-1">
            <FontSelector
              value={selectedText.fontFamily || 'Arial'}
              onChange={(fontFamily) => onUpdate({ fontFamily })}
            />
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Font Size Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleFontSizeChange(-2)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeInput}
              className="w-12 px-1 py-1 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              min="8"
              max="200"
            />
            
            <button
              onClick={() => handleFontSizeChange(2)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleBold}
              className={`p-2 rounded transition-colors ${
                fontWeight === 'bold' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleItalic}
              className={`p-2 rounded transition-colors ${
                fontStyle === 'italic' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleUnderline}
              className={`p-2 rounded transition-colors ${
                underline 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Text Alignment */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAlignment('left')}
              className={`p-2 rounded transition-colors ${
                textAlign === 'left' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
              title="Align left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleAlignment('center')}
              className={`p-2 rounded transition-colors ${
                textAlign === 'center' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
              title="Align center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleAlignment('right')}
              className={`p-2 rounded transition-colors ${
                textAlign === 'right' 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100'
              }`}
              title="Align right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
              title="Text color"
            >
              <Palette className="w-4 h-4" />
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ backgroundColor: fill }}
              />
            </button>
            
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 z-10">
                <ColorPicker
                  color={fill}
                  onChange={handleColorChange}
                />
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Advanced Controls */}
          <div className="flex items-center gap-2">
            {/* Letter Spacing */}
            <div className="flex items-center gap-1">
              <Type className="w-3 h-3 text-gray-500" />
              <input
                type="range"
                min="-5"
                max="20"
                step="0.5"
                value={charSpacing}
                onChange={handleCharSpacing}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                title={`Letter spacing: ${charSpacing}px`}
              />
            </div>

            {/* Line Height */}
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">LH</span>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.1"
                value={lineHeight}
                onChange={handleLineHeight}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                title={`Line height: ${lineHeight}`}
              />
            </div>

            {/* Rotation */}
            <div className="flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-gray-500" />
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={angle}
                onChange={handleRotation}
                className="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                title={`Rotation: ${angle}°`}
              />
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Move Controls */}
          <div className="flex items-center gap-1">
            <Move className="w-3 h-3 text-gray-500" />
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <button
                onClick={() => moveText('up')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Move up"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <div></div>
              
              <button
                onClick={() => moveText('left')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Move left"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <div></div>
              <button
                onClick={() => moveText('right')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Move right"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
              
              <div></div>
              <button
                onClick={() => moveText('down')}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Move down"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
              <div></div>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onDuplicate}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Duplicate (Ctrl+D)"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              onClick={onBringForward}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Bring forward"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            
            <button
              onClick={onSendBackward}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Send backward"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
              title="Delete (Del)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}