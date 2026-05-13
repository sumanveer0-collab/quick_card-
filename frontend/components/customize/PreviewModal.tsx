'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RotateCw, Eye } from 'lucide-react'
import { useEditorStore, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX } from '@/store/editor.store'
import { useProductStore } from '@/store/product.store'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { elements, background, currentFace } = useEditorStore()
  const { selections } = useProductStore()
  const [rotation, setRotation] = useState(0)
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front')
  const previewRef = useRef<HTMLDivElement>(null)

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Preview</h2>
                  <p className="text-xs text-gray-500">
                    {selections.orientation === 'horizontal' ? '5.2cm × 9cm' : '9cm × 5.2cm'} • 
                    Print-ready preview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Front/Back Switch */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCardSide('front')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      cardSide === 'front'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => setCardSide('back')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      cardSide === 'back'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Back
                  </button>
                </div>

                {/* Rotate */}
                <button
                  onClick={handleRotate}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Rotate"
                >
                  <RotateCw className="w-4 h-4 text-gray-600" />
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close Preview"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Preview Canvas */}
          <div className="absolute inset-0 top-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-auto">
            <motion.div
              ref={previewRef}
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
              }}
              className="relative bg-white rounded-lg shadow-2xl"
            >
              {/* Card Preview */}
              <div
                className="relative overflow-hidden rounded-lg"
                style={{
                  width: `${CANVAS_WIDTH_PX}px`,
                  height: `${CANVAS_HEIGHT_PX}px`,
                  background: background,
                }}
              >
                {/* Render Elements */}
                {elements
                  .filter((el) => el.visible !== false)
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((element) => {
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
                            textAlign: element.align,
                            display: 'flex',
                            alignItems: element.verticalAlign === 'top' ? 'flex-start' : element.verticalAlign === 'bottom' ? 'flex-end' : 'center',
                            letterSpacing: `${element.letterSpacing || 0}px`,
                            lineHeight: element.lineHeight || 1.2,
                            opacity: element.opacity || 1,
                            padding: element.padding ? `${element.padding.vertical}px ${element.padding.horizontal}px` : '0',
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
                            opacity: element.opacity || 1,
                            objectFit: 'cover',
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
                            borderRadius: element.shapeType === 'circle' ? '50%' : `${element.cornerRadius || 0}px`,
                            opacity: element.opacity || 1,
                          }}
                        />
                      )
                    }

                    return null
                  })}
              </div>

              {/* Card Shadow Effect */}
              <div className="absolute inset-0 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.3)] pointer-events-none" />
            </motion.div>
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>• Print-ready at 300 DPI</span>
                <span>• Includes bleed area</span>
                <span>• Safe area marked</span>
              </div>
              <div>
                Press ESC to close
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
