'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Droplet,
  Square
} from 'lucide-react'

interface FloatingToolbarProps {
  selectedElement: any
  onUpdate: (properties: any) => void
  onDuplicate: () => void
  onDelete: () => void
  onBringForward: () => void
  onSendBackward: () => void
  position?: { x: number; y: number }
}

export default function FloatingToolbar({
  selectedElement,
  onUpdate,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
  position
}: FloatingToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showOpacitySlider, setShowOpacitySlider] = useState(false)

  if (!selectedElement) return null

  const canChangeFillColor = ['shape', 'icon', 'illustration'].includes(selectedElement.type)
  const canChangeStroke = selectedElement.type === 'shape'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 bg-white rounded-full shadow-2xl border border-gray-200 px-2 py-2 flex items-center gap-1"
      style={{
        left: position?.x || '50%',
        top: position?.y || 100,
        transform: position ? 'none' : 'translateX(-50%)'
      }}
    >
      {/* Fill Color */}
      {canChangeFillColor && (
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
            title="Fill Color"
          >
            <Palette className="w-4 h-4 text-gray-700" />
            <div
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: selectedElement.fill || '#000000' }}
            />
          </button>

          <AnimatePresence>
            {showColorPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-48"
              >
                <p className="text-xs font-medium text-gray-700 mb-2">Fill Color</p>
                <input
                  type="color"
                  value={selectedElement.fill || '#000000'}
                  onChange={(e) => onUpdate({ fill: e.target.value })}
                  className="w-full h-10 rounded-lg cursor-pointer"
                />
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {['#000000', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280', '#FFFFFF'].map(color => (
                    <button
                      key={color}
                      onClick={() => onUpdate({ fill: color })}
                      className="w-6 h-6 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Stroke Color */}
      {canChangeStroke && (
        <button
          onClick={() => {
            const currentStroke = selectedElement.stroke === 'none' ? '#000000' : 'none'
            onUpdate({ stroke: currentStroke, strokeWidth: currentStroke === 'none' ? 0 : 2 })
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Border"
        >
          <Square className="w-4 h-4 text-gray-700" />
        </button>
      )}

      {/* Opacity */}
      <div className="relative">
        <button
          onClick={() => setShowOpacitySlider(!showOpacitySlider)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Opacity"
        >
          <Droplet className="w-4 h-4 text-gray-700" />
        </button>

        <AnimatePresence>
          {showOpacitySlider && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-3 w-48"
            >
              <p className="text-xs font-medium text-gray-700 mb-2">
                Opacity: {Math.round((selectedElement.opacity || 1) * 100)}%
              </p>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedElement.opacity || 1}
                onChange={(e) => onUpdate({ opacity: parseFloat(e.target.value) })}
                className="w-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Duplicate"
      >
        <Copy className="w-4 h-4 text-gray-700" />
      </button>

      {/* Lock/Unlock */}
      <button
        onClick={() => onUpdate({ locked: !selectedElement.locked })}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title={selectedElement.locked ? 'Unlock' : 'Lock'}
      >
        {selectedElement.locked ? (
          <Lock className="w-4 h-4 text-gray-700" />
        ) : (
          <Unlock className="w-4 h-4 text-gray-700" />
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Bring Forward */}
      <button
        onClick={onBringForward}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Bring Forward"
      >
        <ArrowUp className="w-4 h-4 text-gray-700" />
      </button>

      {/* Send Backward */}
      <button
        onClick={onSendBackward}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        title="Send Backward"
      >
        <ArrowDown className="w-4 h-4 text-gray-700" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-2 rounded-full hover:bg-red-100 transition-colors group"
        title="Delete"
      >
        <Trash2 className="w-4 h-4 text-gray-700 group-hover:text-red-600" />
      </button>
    </motion.div>
  )
}
