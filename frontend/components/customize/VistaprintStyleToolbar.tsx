'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Minus, Plus, ChevronDown,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Palette, MoreHorizontal, Trash2, Copy
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { useState, useRef, useEffect } from 'react'

const FONTS = [
  'Secuela', 'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Raleway', 'Oswald', 'Georgia', 'Arial', 'Times New Roman',
  'Courier New', 'Verdana', 'Trebuchet MS', 'Comic Sans MS'
]

export default function VistaprintStyleToolbar() {
  const { elements, selectedId, updateElement, duplicateElement, deleteElement } = useEditorStore()
  const element = elements.find((el) => el.id === selectedId)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowFontMenu(false)
        setShowColorPicker(false)
        setShowMoreMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!element || element.type !== 'text') return null

  const isBold = element.fontWeight === 'bold' || element.fontWeight === '700'
  const isItalic = element.fontWeight?.includes('italic')
  const currentFontSize = element.fontSize || 16

  const handleFontChange = (fontFamily: string) => {
    updateElement(selectedId!, { fontFamily })
    setShowFontMenu(false)
  }

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(200, currentFontSize + delta))
    updateElement(selectedId!, { fontSize: newSize })
  }

  const handleFontSizeInput = (value: string) => {
    const newSize = parseInt(value)
    if (!isNaN(newSize) && newSize >= 8 && newSize <= 200) {
      updateElement(selectedId!, { fontSize: newSize })
    }
  }

  const handleToggleBold = () => {
    const newWeight = isBold ? 'normal' : 'bold'
    updateElement(selectedId!, { fontWeight: newWeight })
  }

  const handleToggleItalic = () => {
    const baseWeight = element.fontWeight?.replace('italic', '').trim() || 'normal'
    updateElement(selectedId!, { 
      fontWeight: isItalic ? baseWeight : `${baseWeight} italic` 
    })
  }

  const handleAlignChange = (align: 'left' | 'center' | 'right' | 'justify') => {
    updateElement(selectedId!, { align })
  }

  const handleColorChange = (color: string) => {
    updateElement(selectedId!, { fill: color })
  }

  return (
    <motion.div
      ref={toolbarRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Text Label */}
          <div className="flex items-center gap-2 mr-2">
            <Type className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {element.text?.substring(0, 20) || 'Text'}
              {element.text && element.text.length > 20 ? '...' : ''}
            </span>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* Font Family Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFontMenu(!showFontMenu)}
              className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 border border-gray-300 flex items-center gap-2 min-w-[140px] justify-between"
            >
              <span style={{ fontFamily: element.fontFamily || 'Inter' }} className="truncate">
                {element.fontFamily || 'Inter'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {showFontMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-80 overflow-y-auto w-56"
              >
                {FONTS.map((font) => (
                  <button
                    key={font}
                    onClick={() => handleFontChange(font)}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 text-sm ${
                      element.fontFamily === font ? 'bg-blue-50 text-blue-700' : ''
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Font Size Controls */}
          <div className="flex items-center gap-1 border border-gray-300 rounded">
            <button
              onClick={() => handleFontSizeChange(-1)}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              title="Decrease font size"
            >
              <Minus className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <input
              type="number"
              value={currentFontSize}
              onChange={(e) => handleFontSizeInput(e.target.value)}
              className="w-12 text-center text-sm border-x border-gray-300 py-1 focus:outline-none focus:bg-blue-50"
              min="8"
              max="200"
            />
            <button
              onClick={() => handleFontSizeChange(1)}
              className="p-1.5 hover:bg-gray-100 transition-colors"
              title="Increase font size"
            >
              <Plus className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* Bold */}
          <button
            onClick={handleToggleBold}
            className={`p-2 rounded transition-all ${
              isBold ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            onClick={handleToggleItalic}
            className={`p-2 rounded transition-all ${
              isItalic ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Alignment */}
          <button
            onClick={() => handleAlignChange('left')}
            className={`p-2 rounded transition-all ${
              element.align === 'left' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Align left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignChange('center')}
            className={`p-2 rounded transition-all ${
              element.align === 'center' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Align center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignChange('right')}
            className={`p-2 rounded transition-all ${
              element.align === 'right' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Align right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlignChange('justify')}
            className={`p-2 rounded transition-all ${
              element.align === 'justify' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Color Picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 hover:bg-gray-100 rounded transition-colors flex items-center gap-2"
              title="Text color"
            >
              <Palette className="w-4 h-4 text-gray-700" />
              <div
                className="w-5 h-5 rounded border-2 border-gray-300"
                style={{ backgroundColor: element.fill || '#000000' }}
              />
            </button>

            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
              >
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    TEXT COLOR
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={element.fill || '#000000'}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-12 h-12 rounded border-2 border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={element.fill || '#000000'}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono uppercase"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-8 gap-2">
                  {[
                    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
                    '#800000', '#808080', '#800080', '#008000', '#000080', '#808000', '#008080', '#C0C0C0',
                    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-7 h-7 rounded border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-110"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-200 ml-auto" />

          {/* Quick Actions */}
          <button
            onClick={() => duplicateElement(selectedId!)}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4 text-gray-700" />
          </button>

          <button
            onClick={() => deleteElement(selectedId!)}
            className="p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
