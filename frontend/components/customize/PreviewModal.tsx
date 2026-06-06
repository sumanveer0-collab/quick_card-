'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCcw, Eye, Download } from 'lucide-react'
import { useEditorStore, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX } from '@/store/editor.store'
import { useProductStore } from '@/store/product.store'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

// Render the card canvas as a static snapshot
function CardSnapshot({ scale = 1 }: { scale?: number }) {
  const { elements, background } = useEditorStore()

  return (
    <div
      style={{
        width: `${CANVAS_WIDTH_PX}px`,
        height: `${CANVAS_HEIGHT_PX}px`,
        background: background || '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: '4px',
        flexShrink: 0,
      }}
    >
      {elements
        .filter(el => el.visible !== false)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(element => {
          if (element.type === 'text') {
            return (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  fontSize: `${element.fontSize}px`,
                  fontFamily: element.fontFamily,
                  fontWeight: element.fontWeight,
                  fontStyle: element.fontStyle,
                  color: element.fill,
                  textAlign: element.align as any,
                  display: 'flex',
                  alignItems:
                    element.verticalAlign === 'top' ? 'flex-start'
                    : element.verticalAlign === 'bottom' ? 'flex-end'
                    : 'center',
                  letterSpacing: `${element.letterSpacing || 0}px`,
                  lineHeight: element.lineHeight || 1.2,
                  opacity: element.opacity ?? 1,
                  padding: element.padding
                    ? `${element.padding.vertical}px ${element.padding.horizontal}px`
                    : '0',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {element.text}
              </div>
            )
          }

          if (element.type === 'image' && element.src) {
            return (
              <img
                key={element.id}
                src={element.src}
                alt=""
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  opacity: element.opacity ?? 1,
                  objectFit: 'cover',
                  pointerEvents: 'none',
                }}
              />
            )
          }

          if (element.type === 'shape') {
            return (
              <div
                key={element.id}
                style={{
                  position: 'absolute',
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  transform: `rotate(${element.rotation || 0}deg)`,
                  backgroundColor: element.fill,
                  border: element.stroke ? `${element.strokeWidth}px solid ${element.stroke}` : 'none',
                  borderRadius:
                    element.shapeType === 'circle' ? '50%' : `${element.cornerRadius || 0}px`,
                  opacity: element.opacity ?? 1,
                  pointerEvents: 'none',
                }}
              />
            )
          }
          return null
        })}
    </div>
  )
}

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { selections } = useProductStore()
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front')
  const [flipping, setFlipping] = useState(false)

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  const switchSide = (side: 'front' | 'back') => {
    if (side === cardSide) return
    setFlipping(true)
    setTimeout(() => { setCardSide(side); setFlipping(false) }, 200)
  }

  if (!isOpen) return null

  // Scale card to fit nicely in the preview area
  const SCALE = 0.52

  return (
    <AnimatePresence>
      <motion.div
        key="preview-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          key="preview-panel"
          initial={{ scale: 0.94, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 16 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="relative bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ width: '680px', maxWidth: '95vw', maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-blue-600" />
              <div>
                <span className="text-base font-bold text-gray-900">Preview</span>
                <span className="ml-3 text-xs text-gray-400">
                  {selections?.orientation === 'vertical' ? '9cm × 5.2cm' : '9cm × 5.2cm'} • Print-ready preview
                </span>
              </div>
            </div>

            {/* Front / Back toggle */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => switchSide('front')}
                  className={`px-5 py-2 text-sm font-semibold transition-colors ${
                    cardSide === 'front'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => switchSide('back')}
                  className={`px-5 py-2 text-sm font-semibold transition-colors border-l border-gray-200 ${
                    cardSide === 'back'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-gray-50 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Back
                </button>
              </div>

              {/* Rotate / flip icon */}
              <button
                onClick={() => switchSide(cardSide === 'front' ? 'back' : 'front')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Flip card"
              >
                <RotateCcw className="w-4 h-4 text-gray-500" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close (ESC)"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* ── Card Preview Area ── */}
          <div
            className="flex-1 flex items-center justify-center overflow-hidden"
            style={{ background: '#f8f9fb', minHeight: '340px', padding: '40px 32px' }}
          >
            <motion.div
              animate={{ rotateY: flipping ? 90 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{
                transformStyle: 'preserve-3d',
                position: 'relative',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.07)',
                width: `${CANVAS_WIDTH_PX * SCALE}px`,
                height: `${CANVAS_HEIGHT_PX * SCALE}px`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: '10px' }}>
                <CardSnapshot scale={SCALE} />
              </div>
            </motion.div>
          </div>

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-4 text-[11px] text-gray-400">
              <span>• Print-ready at 300 DPI</span>
              <span>• Includes bleed area</span>
              <span>• Safe area marked</span>
            </div>
            <span className="text-[11px] text-gray-400">Press ESC to close</span>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
