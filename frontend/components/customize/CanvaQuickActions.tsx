'use client'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

export default function CanvaQuickActions() {
  const { elements, selectedId, updateElement } = useEditorStore()
  const element = elements.find((el) => el.id === selectedId)

  if (!element || element.type !== 'text') return null

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(200, (element.fontSize || 16) + delta))
    updateElement(selectedId!, { fontSize: newSize })
  }

  // Position below the element
  const quickActionsStyle = {
    position: 'absolute' as const,
    top: `${element.y + element.height + 20}px`,
    left: `${element.x + element.width / 2}px`,
    transform: 'translateX(-50%)',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-40"
      style={quickActionsStyle}
    >
      <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center gap-1 p-1">
        {/* Decrease Font Size */}
        <button
          onClick={() => handleFontSizeChange(-2)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          title="Decrease font size"
        >
          <Minus className="w-4 h-4 text-gray-700" />
        </button>

        {/* Current Font Size Display */}
        <div className="px-3 text-sm font-semibold text-gray-700 min-w-[40px] text-center">
          {element.fontSize || 16}
        </div>

        {/* Increase Font Size */}
        <button
          onClick={() => handleFontSizeChange(2)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          title="Increase font size"
        >
          <Plus className="w-4 h-4 text-gray-700" />
        </button>
      </div>
    </motion.div>
  )
}
