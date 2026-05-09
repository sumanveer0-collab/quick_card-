'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Palette, RotateCw, Copy, Trash2, ChevronUp, ChevronDown,
  Move, Square, Circle, Minus, Plus, Eye, EyeOff, Lock, Unlock
} from 'lucide-react'
import { GraphicToolbarProps } from '@/types/graphics.types'

export default function GraphicElementToolbar({
  selectedElement,
  onUpdate,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward
}: GraphicToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })

  // Update toolbar position based on selected element
  useEffect(() => {
    if (!selectedElement) return

    // Position toolbar above the selected element with canvas scaling
    const x = (selectedElement.x + (selectedElement.width / 2))
    const y = (selectedElement.y - 60)

    setToolbarPosition({ x, y })
  }, [selectedElement])

  if (!selectedElement) return null

  const {
    fill = '#3b82f6',
    stroke = 'none',
    strokeWidth = 0,
    opacity = 1,
    rotation = 0,
    width = 100,
    height = 100,
    visible = true,
    locked = false
  } = selectedElement

  const colorPresets = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ]

  const handleColorChange = (color: string) => {
    onUpdate({ fill: color })
    setShowColorPicker(false)
  }

  const handleStrokeColorChange = (color: string) => {
    onUpdate({ stroke: color, strokeWidth: strokeWidth || 2 })
  }

  const handleSizeChange = (dimension: 'width' | 'height', delta: number) => {
    const newValue = Math.max(10, (dimension === 'width' ? width : height) + delta)
    onUpdate({ [dimension]: newValue })
  }

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ opacity: parseFloat(e.target.value) })
  }

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ rotation: parseFloat(e.target.value) })
  }

  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ strokeWidth: parseFloat(e.target.value) })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-3"
        style={{
          left: toolbarPosition.x,
          top: toolbarPosition.y,
          transform: 'translateX(-50%)',
        }}
      >
        <div className="flex items-center gap-2 flex-wrap max-w-4xl">
          {/* Size Controls */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
            <div className="flex items-center gap-1">
              <Square className="w-3 h-3 text-gray-500" />
              <button
                onClick={() => handleSizeChange('width', -10)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Decrease width"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-mono min-w-[30px] text-center">{Math.round(width)}</span>
              <button
                onClick={() => handleSizeChange('width', 10)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Increase width"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            
            <div className="w-px h-4 bg-gray-300 mx-1" />
            
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-gray-500 rounded-sm" />
              <button
                onClick={() => handleSizeChange('height', -10)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Decrease height"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-mono min-w-[30px] text-center">{Math.round(height)}</span>
              <button
                onClick={() => handleSizeChange('height', 10)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
                title="Increase height"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Fill Color */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded transition-colors"
              title="Fill color"
            >
              <Palette className="w-4 h-4" />
              <div 
                className="w-6 h-6 rounded border-2 border-gray-300"
                style={{ backgroundColor: fill }}
              />
            </button>
            
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 w-64">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Fill Color</label>
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    {colorPresets.map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                          fill === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={fill}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Stroke Color</label>
                  <div className="grid grid-cols-8 gap-1 mb-2">
                    {colorPresets.map(color => (
                      <button
                        key={color}
                        onClick={() => handleStrokeColorChange(color)}
                        className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                          stroke === color ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={stroke === 'none' ? '#000000' : stroke}
                    onChange={(e) => handleStrokeColorChange(e.target.value)}
                    className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Stroke Width: {strokeWidth}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={strokeWidth}
                    onChange={handleStrokeWidthChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Opacity Control */}
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={opacity}
              onChange={handleOpacityChange}
              className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              title={`Opacity: ${Math.round(opacity * 100)}%`}
            />
            <span className="text-xs text-gray-500 min-w-[30px]">{Math.round(opacity * 100)}%</span>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Rotation Control */}
          <div className="flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={rotation}
              onChange={handleRotationChange}
              className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              title={`Rotation: ${rotation}°`}
            />
            <span className="text-xs text-gray-500 min-w-[35px]">{rotation}°</span>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Visibility Toggle */}
          <button
            onClick={() => onUpdate({ visible: !visible })}
            className={`p-2 rounded transition-colors ${
              visible ? 'hover:bg-gray-100' : 'bg-gray-200 text-gray-500'
            }`}
            title={visible ? 'Hide element' : 'Show element'}
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Lock Toggle */}
          <button
            onClick={() => onUpdate({ locked: !locked })}
            className={`p-2 rounded transition-colors ${
              locked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'
            }`}
            title={locked ? 'Unlock element' : 'Lock element'}
          >
            {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          <div className="w-px h-6 bg-gray-300" />

          {/* Layer Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={onBringForward}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Bring forward"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            
            <button
              onClick={onSendBackward}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Send backward"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onDuplicate}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Duplicate element"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <button
              onClick={onDelete}
              className="p-2 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
              title="Delete element"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}