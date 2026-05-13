'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  ChevronDown, Type, Palette, MoreHorizontal, Copy, Trash2, Lock,
  Unlock, Eye, EyeOff, RotateCw, ArrowUp, ArrowDown, Minus, Plus,
  Strikethrough, Subscript, Superscript, List, ListOrdered,
  AlignJustify, ChevronsUp, ChevronsDown, Maximize2, Minimize2
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface VistaprintFloatingToolbarProps {
  elementId: string
  onClose: () => void
  displayScale: number
  canvasRef: React.RefObject<HTMLDivElement>
}

export default function VistaprintFloatingToolbar({
  elementId,
  onClose,
  displayScale,
  canvasRef
}: VistaprintFloatingToolbarProps) {
  const { elements, updateElement, duplicateElement, deleteElement, bringForward, sendBackward, bringToFront, sendToBack } = useEditorStore()
  const [showFontDropdown, setShowFontDropdown] = useState(false)
  const [showSizeDropdown, setShowSizeDropdown] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showMoreOptions, setShowMoreOptions] = useState(false)
  const [showLetterSpacing, setShowLetterSpacing] = useState(false)
  const [showLineHeight, setShowLineHeight] = useState(false)
  const [showOpacity, setShowOpacity] = useState(false)
  
  const toolbarRef = useRef<HTMLDivElement>(null)
  const element = elements.find(el => el.id === elementId && el.type === 'text')
  
  if (!element) return null

  const {
    text = 'Text',
    fontSize = 16,
    fontFamily = 'Arial',
    fontWeight = 'normal',
    fontStyle = 'normal',
    fill = '#000000',
    align = 'left',
    x = 0,
    y = 0,
    width = 200,
    rotation = 0,
    opacity = 1,
    locked = false,
    visible = true,
    underline = false,
    letterSpacing = 0,
    lineHeight = 1.2
  } = element

  // Font families
  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino',
    'Garamond', 'Bookman', 'Avant Garde', 'Optima', 'Futura',
    'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'
  ]

  // Font sizes
  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96]

  // Color presets
  const colorPresets = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#1ABC9C', '#34495E', '#95A5A6'
  ]

  // Calculate toolbar position
  const getToolbarPosition = () => {
    if (!canvasRef.current) return { left: 0, top: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    const BLEED_PX = 37.5
    
    return {
      left: rect.left + ((x + BLEED_PX) * displayScale) + (width * displayScale / 2),
      top: rect.top + ((y + BLEED_PX) * displayScale) - 70
    }
  }

  const toolbarPos = getToolbarPosition()

  // Update element properties
  const handleUpdate = (updates: any) => {
    updateElement(elementId, updates)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowFontDropdown(false)
        setShowSizeDropdown(false)
        setShowColorPicker(false)
        setShowMoreOptions(false)
        setShowLetterSpacing(false)
        setShowLineHeight(false)
        setShowOpacity(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <motion.div
      ref={toolbarRef}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 z-[1000]"
      style={{
        left: toolbarPos.left,
        top: toolbarPos.top,
        transform: 'translateX(-50%)',
        minWidth: '600px'
      }}
    >
      {/* Main Toolbar */}
      <div className="flex items-center gap-1 p-2">
        {/* Font Family */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFontDropdown(!showFontDropdown)
              setShowSizeDropdown(false)
              setShowColorPicker(false)
              setShowMoreOptions(false)
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium transition-colors min-w-[120px]"
          >
            <span className="truncate" style={{ fontFamily }}>{fontFamily}</span>
            <ChevronDown className="w-3 h-3 flex-shrink-0" />
          </button>
          
          <AnimatePresence>
            {showFontDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
              >
                {fontFamilies.map(font => (
                  <button
                    key={font}
                    onClick={() => {
                      handleUpdate({ fontFamily: font })
                      setShowFontDropdown(false)
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors ${
                      font === fontFamily ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Font Size */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleUpdate({ fontSize: Math.max(8, fontSize - 2) })}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Decrease size"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => {
                setShowSizeDropdown(!showSizeDropdown)
                setShowFontDropdown(false)
                setShowColorPicker(false)
                setShowMoreOptions(false)
              }}
              className="flex items-center gap-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium transition-colors min-w-[60px]"
            >
              <span>{fontSize}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <AnimatePresence>
              {showSizeDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 w-24 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
                >
                  {fontSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        handleUpdate({ fontSize: size })
                        setShowSizeDropdown(false)
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        size === fontSize ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button
            onClick={() => handleUpdate({ fontSize: Math.min(96, fontSize + 2) })}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Increase size"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleUpdate({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' })}
            className={`p-2 rounded transition-colors ${
              fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleUpdate({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' })}
            className={`p-2 rounded transition-colors ${
              fontStyle === 'italic' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleUpdate({ underline: !underline })}
            className={`p-2 rounded transition-colors ${
              underline ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
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
            onClick={() => handleUpdate({ align: 'left' })}
            className={`p-2 rounded transition-colors ${
              align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleUpdate({ align: 'center' })}
            className={`p-2 rounded transition-colors ${
              align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleUpdate({ align: 'right' })}
            className={`p-2 rounded transition-colors ${
              align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker)
              setShowFontDropdown(false)
              setShowSizeDropdown(false)
              setShowMoreOptions(false)
            }}
            className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors"
            title="Text Color"
          >
            <div className="w-5 h-5 rounded border-2 border-gray-300" style={{ backgroundColor: fill }} />
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50 w-72"
              >
                <div className="mb-3">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Color Presets</label>
                  <div className="grid grid-cols-8 gap-2">
                    {colorPresets.map(color => (
                      <button
                        key={color}
                        onClick={() => {
                          handleUpdate({ fill: color })
                          setShowColorPicker(false)
                        }}
                        className={`w-7 h-7 rounded border-2 transition-all hover:scale-110 ${
                          fill === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Custom Color</label>
                  <input
                    type="color"
                    value={fill}
                    onChange={(e) => handleUpdate({ fill: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Layer Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => bringForward(elementId)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Bring Forward"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => sendBackward(elementId)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Send Backward"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Quick Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleUpdate({ locked: !locked })}
            className={`p-2 rounded transition-colors ${
              locked ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
            }`}
            title={locked ? 'Unlock' : 'Lock'}
          >
            {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleUpdate({ visible: !visible })}
            className={`p-2 rounded transition-colors ${
              !visible ? 'bg-gray-200 text-gray-600' : 'hover:bg-gray-100'
            }`}
            title={visible ? 'Hide' : 'Show'}
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={() => duplicateElement(elementId)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              deleteElement(elementId)
              onClose()
            }}
            className="p-2 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
            title="Delete (Del)"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* More Options */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMoreOptions(!showMoreOptions)
              setShowFontDropdown(false)
              setShowSizeDropdown(false)
              setShowColorPicker(false)
            }}
            className={`p-2 rounded transition-colors ${
              showMoreOptions ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          <AnimatePresence>
            {showMoreOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-2 z-50 w-64"
              >
                {/* Letter Spacing */}
                <div className="p-3 border-b border-gray-100">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Letter Spacing</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="-5"
                      max="20"
                      step="0.5"
                      value={letterSpacing || 0}
                      onChange={(e) => handleUpdate({ letterSpacing: parseFloat(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono w-10 text-right">{letterSpacing || 0}</span>
                  </div>
                </div>

                {/* Line Height */}
                <div className="p-3 border-b border-gray-100">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Line Height</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0.8"
                      max="3"
                      step="0.1"
                      value={lineHeight || 1.2}
                      onChange={(e) => handleUpdate({ lineHeight: parseFloat(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono w-10 text-right">{(lineHeight || 1.2).toFixed(1)}</span>
                  </div>
                </div>

                {/* Opacity */}
                <div className="p-3 border-b border-gray-100">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Opacity</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={opacity || 1}
                      onChange={(e) => handleUpdate({ opacity: parseFloat(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono w-10 text-right">{Math.round((opacity || 1) * 100)}%</span>
                  </div>
                </div>

                {/* Rotation */}
                <div className="p-3">
                  <label className="text-xs font-semibold text-gray-700 mb-2 block">Rotation</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="5"
                      value={rotation || 0}
                      onChange={(e) => handleUpdate({ rotation: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono w-10 text-right">{rotation || 0}°</span>
                  </div>
                </div>

                {/* Layer Actions */}
                <div className="p-2 border-t border-gray-100 space-y-1">
                  <button
                    onClick={() => {
                      bringToFront(elementId)
                      setShowMoreOptions(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                  >
                    <ChevronsUp className="w-4 h-4" />
                    Bring to Front
                  </button>
                  <button
                    onClick={() => {
                      sendToBack(elementId)
                      setShowMoreOptions(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                  >
                    <ChevronsDown className="w-4 h-4" />
                    Send to Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toolbar Info */}
      <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-200 rounded-b-xl">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Click text to edit • Drag to move • Esc to close</span>
          <span className="font-mono">{Math.round(width)}×{Math.round(element.height || 50)}px</span>
        </div>
      </div>
    </motion.div>
  )
}
