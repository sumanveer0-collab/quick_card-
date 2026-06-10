'use client'
/**
 * ShapeFloatingToolbar
 *
 * Compact floating toolbar that appears above a selected shape/image/icon
 * on the canvas. Matches the Vistaprint/VistaCreate reference:
 *
 *   ┌─────────────────────────────────────┐
 *   │ 🔒  ⧉  🗑  ↑  ↓  👁  ···          │
 *   └─────────────────────────────────────┘
 *
 * Positioned above the selected element using its canvas coordinates
 * and the current displayScale.
 */
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Lock, Unlock, Copy, Trash2, Eye, EyeOff,
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown,
  MoreHorizontal, RotateCw,
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface Props {
  elementId: string
  displayScale: number
  canvasRef: React.RefObject<HTMLDivElement>
  onDelete?: () => void
}

export default function ShapeFloatingToolbar({ elementId, displayScale, canvasRef, onDelete }: Props) {
  const {
    elements, updateElement, duplicateElement, deleteElement,
    bringForward, sendBackward, bringToFront, sendToBack,
  } = useEditorStore()

  const [showMore, setShowMore] = useState(false)
  const [rotation, setRotation] = useState(0)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const el = elements.find(e => e.id === elementId)
  if (!el) return null

  // ── Position above the element ────────────────────────────────────────────
  const getPosition = () => {
    if (!canvasRef.current) return { left: '50%', top: '0px', transform: 'translateX(-50%)' }
    const rect = canvasRef.current.getBoundingClientRect()
    const BLEED = 37.5

    // Element centre X in screen coordinates
    const elLeft   = rect.left + (el.x + BLEED) * displayScale
    const elCentreX = elLeft + (el.width * displayScale) / 2
    const elTop    = rect.top  + (el.y + BLEED) * displayScale

    const toolbarW = 280
    let left = elCentreX - toolbarW / 2
    // Keep inside viewport
    left = Math.max(8, Math.min(left, window.innerWidth - toolbarW - 8))
    const top = Math.max(8, elTop - 48)

    return { left: `${left}px`, top: `${top}px`, transform: 'none' }
  }

  const pos = getPosition()

  const handleDelete = () => {
    deleteElement(elementId)
    onDelete?.()
  }

  const handleRotate = () => {
    const newRot = ((el.rotation || 0) + 45) % 360
    setRotation(newRot)
    updateElement(elementId, { rotation: newRot })
  }

  // Close "more" panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowMore(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      ref={toolbarRef}
      className="fixed z-[200]"
      style={{ left: pos.left, top: pos.top, transform: pos.transform }}
    >
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.96 }}
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

        {/* Bring Forward */}
        <ToolBtn onClick={() => bringForward(elementId)} title="Bring Forward">
          <ArrowUp className="w-3.5 h-3.5" />
        </ToolBtn>

        {/* Send Backward */}
        <ToolBtn onClick={() => sendBackward(elementId)} title="Send Backward">
          <ArrowDown className="w-3.5 h-3.5" />
        </ToolBtn>

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

        <div className="w-px h-5 bg-gray-200 mx-0.5" />

        {/* More options */}
        <div className="relative">
          <ToolBtn
            active={showMore}
            activeClass="bg-gray-100"
            onClick={() => setShowMore(v => !v)}
            title="More options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </ToolBtn>

          <AnimatePresence>
            {showMore && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 min-w-[160px] z-50"
              >
                <MenuBtn icon={ChevronsUp}   label="Bring to Front" onClick={() => { bringToFront(elementId); setShowMore(false) }} />
                <MenuBtn icon={ChevronsDown} label="Send to Back"   onClick={() => { sendToBack(elementId);  setShowMore(false) }} />
                <div className="my-1 border-t border-gray-100" />
                <MenuBtn icon={Copy}    label="Duplicate"  onClick={() => { duplicateElement(elementId); setShowMore(false) }} />
                <MenuBtn icon={Trash2}  label="Delete"     onClick={() => { handleDelete(); setShowMore(false) }} danger />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Opacity + position hint */}
      <div className="mt-1 flex items-center justify-center gap-3 text-[10px] font-mono text-white/70 select-none pointer-events-none">
        <span>{Math.round((el.opacity ?? 1) * 100)}% opacity</span>
        <span>·</span>
        <span>{Math.round(el.rotation || 0)}° rotation</span>
      </div>
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

function MenuBtn({
  icon: Icon, label, onClick, danger = false,
}: { icon: any; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {label}
    </button>
  )
}
