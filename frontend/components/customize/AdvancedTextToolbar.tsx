'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Plus, Minus, Palette, Copy, Trash2, Lock, Unlock, RotateCw, Eye, EyeOff,
  ChevronDown, Layers, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown,
  Maximize2, Minimize2, MoreHorizontal, Sparkles, Square
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

const FONTS = [
  'Secuela', 'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Raleway', 'Oswald', 'Georgia', 'Arial', 'Times New Roman',
  'Courier New', 'Verdana', 'Trebuchet MS', 'Comic Sans MS'
]

const FONT_WEIGHTS = [
  { value: '300', label: 'Light' },
  { value: 'normal', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: 'bold', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
]

export default function AdvancedTextToolbar() {
  const { elements, selectedId, updateElement, duplicateElement, deleteElement, bringForward, sendBackward, bringToFront, sendToBack } = useEditorStore()
  const element = elements.find((el) => el.id === selectedId)
  
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showStrokeColorPicker, setShowStrokeColorPicker] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [showWeightMenu, setShowWeightMenu] = useState(false)
  const [showEffectsMenu, setShowEffectsMenu] = useState(false)
  const [showLayersMenu, setShowLayersMenu] = useState(false)
  
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const strokeColorPickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false)
      }
      if (strokeColorPickerRef.current && !strokeColorPickerRef.current.contains(event.target as Node)) {
        setShowStrokeColorPicker(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!element || element.type !== 'text') return null

  const isBold = element.fontWeight === 'bold' || element.fontWeight === '700' || element.fontWeight === '800'
  const isItalic = element.fontWeight?.includes('italic')
  const isUnderline = element.text?.includes('<u>') // Simple check, can be enhanced

  // Font Size Slider
  const handleFontSizeSlider = (value: number) => {
    updateElement(selectedId!, { fontSize: value })
  }

  // Letter Spacing Slider
  const handleLetterSpacing = (value: number) => {
    updateElement(selectedId!, { letterSpacing: value })
  }

  // Line Height Slider
  const handleLineHeight = (value: number) => {
    updateElement(selectedId!, { lineHeight: value })
  }

  // Rotation
  const handleRotation = (delta: number) => {
    const newRotation = (element.rotation || 0) + delta
    updateElement(selectedId!, { rotation: newRotation })
  }

  // Opacity
  const handleOpacity = (value: number) => {
    updateElement(selectedId!, { opacity: value / 100 })
  }

  // Text Transform
  const handleTextTransform = (transform: 'uppercase' | 'lowercase' | 'capitalize' | 'none') => {
    let transformedText = element.text || ''
    
    switch (transform) {
      case 'uppercase':
        transformedText = transformedText.toUpperCase()
        break
      case 'lowercase':
        transformedText = transformedText.toLowerCase()
        break
      case 'capitalize':
        transformedText = transformedText.replace(/\b\w/g, (char) => char.toUpperCase())
        break
      case 'none':
        // Keep original
        break
    }
    
    updateElement(selectedId!, { text: transformedText })
  }

  // Stroke/Outline
  const handleStrokeWidth = (value: number) => {
    updateElement(selectedId!, { strokeWidth: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 max-w-6xl"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-3">
        {/* Row 1: Font, Size, Weight, Style */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
          {/* Font Family Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center gap-2 min-w-[140px]"
              style={{ fontFamily: element.fontFamily || 'Inter' }}
            >
              <Type className="w-4 h-4" />
              <span className="flex-1 text-left truncate">{element.fontFamily || 'Inter'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showFontMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-60 overflow-y-auto w-48"
              >
                {FONTS.map((font) => (
                  <button
                    key={font}
                    onClick={() => {
                      updateElement(selectedId!, { fontFamily: font })
                      setShowFontMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm transition-colors"
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Font Size Slider */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <button
              onClick={() => handleFontSizeSlider(Math.max(8, (element.fontSize || 16) - 2))}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <Minus className="w-3 h-3 text-gray-600" />
            </button>
            <input
              type="number"
              value={element.fontSize || 16}
              onChange={(e) => handleFontSizeSlider(Number(e.target.value))}
              className="w-12 text-center text-sm font-semibold bg-transparent border-none focus:outline-none"
              min="8"
              max="200"
            />
            <button
              onClick={() => handleFontSizeSlider(Math.min(200, (element.fontSize || 16) + 2))}
              className="p-1 hover:bg-white rounded transition-colors"
            >
              <Plus className="w-3 h-3 text-gray-600" />
            </button>
          </div>

          {/* Font Weight Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowWeightMenu(!showWeightMenu)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <span className="text-xs">
                {FONT_WEIGHTS.find(w => w.value === element.fontWeight)?.label || 'Regular'}
              </span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showWeightMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 w-32"
              >
                {FONT_WEIGHTS.map((weight) => (
                  <button
                    key={weight.value}
                    onClick={() => {
                      updateElement(selectedId!, { fontWeight: weight.value })
                      setShowWeightMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm transition-colors"
                    style={{ fontWeight: weight.value }}
                  >
                    {weight.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* Bold, Italic, Underline */}
          <button
            onClick={() => updateElement(selectedId!, { fontWeight: isBold ? 'normal' : 'bold' })}
            className={`p-2 rounded-lg transition-all ${isBold ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const baseWeight = element.fontWeight?.replace('italic', '').trim() || 'normal'
              updateElement(selectedId!, { fontWeight: isItalic ? baseWeight : `${baseWeight} italic` })
            }}
            className={`p-2 rounded-lg transition-all ${isItalic ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Text Alignment */}
          <button
            onClick={() => updateElement(selectedId!, { align: 'left' })}
            className={`p-2 rounded-lg transition-all ${element.align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateElement(selectedId!, { align: 'center' })}
            className={`p-2 rounded-lg transition-all ${element.align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateElement(selectedId!, { align: 'right' })}
            className={`p-2 rounded-lg transition-all ${element.align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => updateElement(selectedId!, { align: 'justify' })}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-all"
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Row 2: Colors, Effects, Transform */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
          {/* Text Color */}
          <div className="relative" ref={colorPickerRef}>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="Text Color"
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
                className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50"
              >
                <HexColorPicker
                  color={element.fill || '#000000'}
                  onChange={(color) => updateElement(selectedId!, { fill: color })}
                />
                <input
                  type="text"
                  value={element.fill || '#000000'}
                  onChange={(e) => updateElement(selectedId!, { fill: e.target.value })}
                  className="w-full mt-2 px-2 py-1 text-xs border border-gray-200 rounded"
                  placeholder="#000000"
                />
              </motion.div>
            )}
          </div>

          {/* Stroke/Outline Color */}
          <div className="relative" ref={strokeColorPickerRef}>
            <button
              onClick={() => setShowStrokeColorPicker(!showStrokeColorPicker)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="Outline Color"
            >
              <Square className="w-4 h-4 text-gray-600" />
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                style={{ backgroundColor: element.stroke || 'transparent' }}
              />
            </button>

            {showStrokeColorPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50"
              >
                <HexColorPicker
                  color={element.stroke || '#000000'}
                  onChange={(color) => updateElement(selectedId!, { stroke: color })}
                />
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={element.stroke || '#000000'}
                    onChange={(e) => updateElement(selectedId!, { stroke: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-200 rounded"
                    placeholder="#000000"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">Width:</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={element.strokeWidth || 0}
                      onChange={(e) => handleStrokeWidth(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs font-semibold">{element.strokeWidth || 0}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* Text Transform */}
          <button
            onClick={() => handleTextTransform('uppercase')}
            className="px-2 py-1 text-xs rounded-lg hover:bg-gray-100 transition-colors"
            title="UPPERCASE"
          >
            AA
          </button>
          <button
            onClick={() => handleTextTransform('lowercase')}
            className="px-2 py-1 text-xs rounded-lg hover:bg-gray-100 transition-colors"
            title="lowercase"
          >
            aa
          </button>
          <button
            onClick={() => handleTextTransform('capitalize')}
            className="px-2 py-1 text-xs rounded-lg hover:bg-gray-100 transition-colors"
            title="Capitalize"
          >
            Aa
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Rotation */}
          <button
            onClick={() => handleRotation(-15)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Rotate Left"
          >
            <RotateCw className="w-4 h-4 text-gray-600 transform -scale-x-100" />
          </button>
          <span className="text-xs font-semibold text-gray-600 min-w-[30px] text-center">
            {Math.round(element.rotation || 0)}°
          </span>
          <button
            onClick={() => handleRotation(15)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Rotate Right"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Effects Menu */}
          <button
            onClick={() => setShowEffectsMenu(!showEffectsMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Effects"
          >
            <Sparkles className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Row 3: Advanced Controls */}
        <div className="flex items-center gap-2">
          {/* Letter Spacing */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
            <span className="text-xs text-gray-600">Letter:</span>
            <input
              type="range"
              min="-5"
              max="20"
              value={element.letterSpacing || 0}
              onChange={(e) => handleLetterSpacing(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs font-semibold text-gray-700 min-w-[20px]">
              {element.letterSpacing || 0}
            </span>
          </div>

          {/* Line Height */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
            <span className="text-xs text-gray-600">Line:</span>
            <input
              type="range"
              min="0.8"
              max="3"
              step="0.1"
              value={element.lineHeight || 1.2}
              onChange={(e) => handleLineHeight(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs font-semibold text-gray-700 min-w-[20px]">
              {(element.lineHeight || 1.2).toFixed(1)}
            </span>
          </div>

          {/* Opacity */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
            <Eye className="w-3 h-3 text-gray-600" />
            <input
              type="range"
              min="0"
              max="100"
              value={(element.opacity || 1) * 100}
              onChange={(e) => handleOpacity(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs font-semibold text-gray-700 min-w-[30px]">
              {Math.round((element.opacity || 1) * 100)}%
            </span>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* Layer Controls */}
          <div className="relative">
            <button
              onClick={() => setShowLayersMenu(!showLayersMenu)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Layers"
            >
              <Layers className="w-4 h-4 text-gray-600" />
            </button>

            {showLayersMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 w-40"
              >
                <button
                  onClick={() => { bringToFront(selectedId!); setShowLayersMenu(false) }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm transition-colors flex items-center gap-2"
                >
                  <ChevronsUp className="w-4 h-4" />
                  Bring to Front
                </button>
                <button
                  onClick={() => { bringForward(selectedId!); setShowLayersMenu(false) }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm transition-colors flex items-center gap-2"
                >
                  <ArrowUp className="w-4 h-4" />
                  Bring Forward
                </button>
                <button
                  onClick={() => { sendBackward(selectedId!); setShowLayersMenu(false) }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm transition-colors flex items-center gap-2"
                >
                  <ArrowDown className="w-4 h-4" />
                  Send Backward
                </button>
                <button
                  onClick={() => { sendToBack(selectedId!); setShowLayersMenu(false) }}
                  className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm transition-colors flex items-center gap-2"
                >
                  <ChevronsDown className="w-4 h-4" />
                  Send to Back
                </button>
              </motion.div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* Lock/Unlock */}
          <button
            onClick={() => updateElement(selectedId!, { locked: !element.locked })}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={element.locked ? 'Unlock' : 'Lock'}
          >
            {element.locked ? <Lock className="w-4 h-4 text-gray-600" /> : <Unlock className="w-4 h-4 text-gray-600" />}
          </button>

          {/* Duplicate */}
          <button
            onClick={() => duplicateElement(selectedId!)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="w-4 h-4 text-gray-600" />
          </button>

          {/* Delete */}
          <button
            onClick={() => deleteElement(selectedId!)}
            className="p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete (Del)"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
