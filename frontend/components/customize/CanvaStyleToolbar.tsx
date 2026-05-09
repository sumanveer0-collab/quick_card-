'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Unlock, Copy, Trash2, MoreHorizontal,
  Type, Palette, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { useState, useRef, useEffect } from 'react'

const FONTS = [
  'Secuela', 'Inter', 'Poppins', 'Montserrat', 'Playfair Display',
  'Roboto', 'Lato', 'Raleway', 'Oswald', 'Georgia', 'Arial'
]

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72]

export default function CanvaStyleToolbar() {
  const { elements, selectedId, updateElement, duplicateElement, deleteElement } = useEditorStore()
  const element = elements.find((el) => el.id === selectedId)
  const [showMore, setShowMore] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showFontMenu, setShowFontMenu] = useState(false)
  const [showSizeMenu, setShowSizeMenu] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setShowMore(false)
        setShowColorPicker(false)
        setShowFontMenu(false)
        setShowSizeMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!element) return null

  const isTextElement = element.type === 'text'
  const isBold = element.fontWeight === 'bold' || element.fontWeight === '700'
  const isItalic = element.fontWeight?.includes('italic')

  const handleFontChange = (fontFamily: string) => {
    updateElement(selectedId!, { fontFamily })
    setShowFontMenu(false)
  }

  const handleFontSizeChange = (newSize: number) => {
    updateElement(selectedId!, { fontSize: newSize })
    setShowSizeMenu(false)
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

  const handleAlignChange = (align: 'left' | 'center' | 'right') => {
    updateElement(selectedId!, { align })
  }

  const handleColorChange = (color: string) => {
    updateElement(selectedId!, { fill: color })
    setShowColorPicker(false)
  }

  const handleToggleLock = () => {
    updateElement(selectedId!, { locked: !element.locked })
  }

  // Calculate toolbar position (above element)
  const toolbarStyle = {
    position: 'absolute' as const,
    top: `${element.y - 60}px`,
    left: `${element.x + element.width / 2}px`,
    transform: 'translateX(-50%)',
  }

  return (
    <motion.div
      ref={toolbarRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="fixed z-50"
      style={toolbarStyle}
    >
      {/* Main Compact Toolbar */}
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex items-center gap-0.5 p-1">
        {/* Lock/Unlock */}
        <button
          onClick={handleToggleLock}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title={element.locked ? 'Unlock' : 'Lock'}
        >
          {element.locked ? (
            <Lock className="w-4 h-4 text-gray-700" />
          ) : (
            <Unlock className="w-4 h-4 text-gray-700" />
          )}
        </button>

        {/* Duplicate */}
        <button
          onClick={() => duplicateElement(selectedId!)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Duplicate"
        >
          <Copy className="w-4 h-4 text-gray-700" />
        </button>

        {/* Delete */}
        <button
          onClick={() => deleteElement(selectedId!)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* More Options */}
        <button
          onClick={() => setShowMore(!showMore)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Extended Toolbar (More Options) */}
      <AnimatePresence>
        {showMore && isTextElement && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl border border-gray-200 p-2 min-w-[400px]"
          >
            <div className="flex items-center gap-2 flex-wrap">
              {/* Font Family */}
              <div className="relative">
                <button
                  onClick={() => setShowFontMenu(!showFontMenu)}
                  className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 border border-gray-200 flex items-center gap-2"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span style={{ fontFamily: element.fontFamily || 'Inter' }}>
                    {element.fontFamily || 'Inter'}
                  </span>
                </button>

                {showFontMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-60 overflow-y-auto"
                  >
                    {FONTS.map((font) => (
                      <button
                        key={font}
                        onClick={() => handleFontChange(font)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm whitespace-nowrap"
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Font Size */}
              <div className="relative">
                <button
                  onClick={() => setShowSizeMenu(!showSizeMenu)}
                  className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 border border-gray-200 min-w-[60px]"
                >
                  {element.fontSize || 16}
                </button>

                {showSizeMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-full mt-1 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 max-h-60 overflow-y-auto"
                  >
                    {FONT_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleFontSizeChange(size)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                      >
                        {size}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-200" />

              {/* Bold */}
              <button
                onClick={handleToggleBold}
                className={`p-2 rounded transition-all ${
                  isBold ? 'bg-cyan-100 text-cyan-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>

              {/* Italic */}
              <button
                onClick={handleToggleItalic}
                className={`p-2 rounded transition-all ${
                  isItalic ? 'bg-cyan-100 text-cyan-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-200" />

              {/* Alignment */}
              <button
                onClick={() => handleAlignChange('left')}
                className={`p-2 rounded transition-all ${
                  element.align === 'left' ? 'bg-cyan-100 text-cyan-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Align left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleAlignChange('center')}
                className={`p-2 rounded transition-all ${
                  element.align === 'center' ? 'bg-cyan-100 text-cyan-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Align center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleAlignChange('right')}
                className={`p-2 rounded transition-all ${
                  element.align === 'right' ? 'bg-cyan-100 text-cyan-700' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title="Align right"
              >
                <AlignRight className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-gray-200" />

              {/* Color Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 hover:bg-gray-100 rounded transition-colors relative"
                  title="Text color"
                >
                  <Palette className="w-4 h-4 text-gray-700" />
                  <div
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: element.fill || '#000000' }}
                  />
                </button>

                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50"
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
                          className="w-7 h-7 rounded-md border-2 border-gray-200 hover:border-cyan-500 transition-all hover:scale-110"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
