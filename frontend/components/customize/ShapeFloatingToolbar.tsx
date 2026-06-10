'use client'
/**
 * ShapeFloatingToolbar
 *
 * Compact toolbar pinned to the top-centre of the visiting-card canvas.
 * Only shown when a shape element is selected.
 *
 *   ┌─────────────────────────────────────┐
 *   │ 🔒  ⧉  🗑  opacity  👁  ↻          │
 *   └─────────────────────────────────────┘
 */
import { motion } from 'framer-motion'
import {
  Lock, Unlock, Copy, Trash2, Eye, EyeOff,
  RotateCw, Droplets,
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface Props {
  elementId: string
  onDelete?: () => void
}

export default function ShapeFloatingToolbar({ elementId, onDelete }: Props) {
  const {
    elements, updateElement, duplicateElement, deleteElement,
  } = useEditorStore()

  const el = elements.find(e => e.id === elementId)
  if (!el || el.type !== 'shape') return null

  const handleDelete = () => {
    deleteElement(elementId)
    onDelete?.()
  }

  const handleRotate = () => {
    const newRot = ((el.rotation || 0) + 45) % 360
    updateElement(elementId, { rotation: newRot })
  }

  const handleOpacityChange = (value: number) => {
    updateElement(elementId, { opacity: value / 100 })
  }

  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[200] pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, y: -4, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.96 }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        className="bg-white rounded-xl shadow-xl border border-gray-200 flex items-center px-1.5 py-1 gap-0.5"
      >
        {/* Lock / Unlock */}
        <ToolBtn
          active={!!(el.locked)}
          activeClass="bg-orange-50 text-orange-600"
          onClick={() => updateElement(elementId, { locked: !el.locked })}
          title={el.locked ? 'Unlock' : 'Lock'}
        >
          {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </ToolBtn>

        {/* Duplicate */}
        <ToolBtn onClick={() => duplicateElement(elementId)} title="Duplicate (Ctrl+D)">
          <Copy className="w-3.5 h-3.5" />
        </ToolBtn>

        {/* Delete */}
        <ToolBtn
          onClick={handleDelete}
          title="Delete"
          hoverClass="hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </ToolBtn>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Opacity */}
        <div className="flex items-center gap-1 px-1" title="Opacity">
          <Droplets className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round((el.opacity ?? 1) * 100)}
            onChange={(e) => handleOpacityChange(Number(e.target.value))}
            className="w-16 h-1 accent-blue-600 cursor-pointer"
          />
          <span className="text-[10px] font-mono text-gray-500 w-7 text-right flex-shrink-0">
            {Math.round((el.opacity ?? 1) * 100)}%
          </span>
        </div>

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* Visibility */}
        <ToolBtn
          active={el.visible === false}
          activeClass="bg-gray-100 text-gray-500"
          onClick={() => updateElement(elementId, { visible: el.visible === false })}
          title={el.visible !== false ? 'Hide' : 'Show'}
        >
          {el.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </ToolBtn>

        {/* Rotate */}
        <ToolBtn onClick={handleRotate} title="Rotate 45°">
          <RotateCw className="w-3.5 h-3.5" />
        </ToolBtn>

      </motion.div>
    </div>
  )
}

// ── Small helpers ─────────────────────────────────────────────────────────────
function ToolBtn({
  children, onClick, title, active = false,
  activeClass = 'bg-blue-50 text-blue-600',
  hoverClass = 'hover:bg-gray-100',
}: {
  children: React.ReactNode
  onClick: () => void
  title: string
  active?: boolean
  activeClass?: string
  hoverClass?: string
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded-lg text-gray-600 transition-colors ${
        active ? activeClass : `${hoverClass}`
      }`}
    >
      {children}
    </button>
  )
}

