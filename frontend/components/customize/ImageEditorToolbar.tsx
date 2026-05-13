'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2,
  Replace,
  Crop,
  Eraser,
  Sparkles,
  SlidersHorizontal,
  RotateCw,
  Layers,
  Download,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  Image as ImageIcon,
  Scissors,
  Palette,
  Contrast,
  Sun,
  Droplet,
  Filter,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
  ZoomIn,
  ZoomOut,
  Move,
  X
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface ImageEditorToolbarProps {
  element: any
  onClose?: () => void
}

export default function ImageEditorToolbar({ element, onClose }: ImageEditorToolbarProps) {
  const { updateElement, duplicateElement, deleteElement } = useEditorStore()
  const [activeTab, setActiveTab] = useState<'edit' | 'adjust' | 'effects' | 'ai'>('edit')
  const [showCropModal, setShowCropModal] = useState(false)
  const [showReplaceModal, setShowReplaceModal] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [showAdjustPanel, setShowAdjustPanel] = useState(false)

  // Image adjustments state
  const [adjustments, setAdjustments] = useState({
    opacity: element.opacity || 1,
    brightness: element.brightness || 0,
    contrast: element.contrast || 0,
    saturation: element.saturation || 0,
    blur: element.blur || 0,
    sharpen: element.sharpen || 0,
  })

  const handleOpacityChange = (value: number) => {
    const newOpacity = value / 100
    setAdjustments(prev => ({ ...prev, opacity: newOpacity }))
    updateElement(element.id, { opacity: newOpacity })
  }

  const handleBrightnessChange = (value: number) => {
    setAdjustments(prev => ({ ...prev, brightness: value }))
    updateElement(element.id, { brightness: value })
  }

  const handleContrastChange = (value: number) => {
    setAdjustments(prev => ({ ...prev, contrast: value }))
    updateElement(element.id, { contrast: value })
  }

  const handleSaturationChange = (value: number) => {
    setAdjustments(prev => ({ ...prev, saturation: value }))
    updateElement(element.id, { saturation: value })
  }

  const handleBlurChange = (value: number) => {
    setAdjustments(prev => ({ ...prev, blur: value }))
    updateElement(element.id, { blur: value })
  }

  const handleSharpenChange = (value: number) => {
    setAdjustments(prev => ({ ...prev, sharpen: value }))
    updateElement(element.id, { sharpen: value })
  }

  const handleResetAdjustments = () => {
    const resetValues = {
      opacity: 1,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sharpen: 0,
    }
    setAdjustments(resetValues)
    updateElement(element.id, resetValues)
  }

  const handleRotate = (degrees: number) => {
    const currentRotation = element.rotation || 0
    updateElement(element.id, { rotation: currentRotation + degrees })
  }

  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      updateElement(element.id, { 
        scaleX: (element.scaleX || 1) * -1 
      })
    } else {
      updateElement(element.id, { 
        scaleY: (element.scaleY || 1) * -1 
      })
    }
  }

  const handleLock = () => {
    updateElement(element.id, { locked: !element.locked })
  }

  const handleVisibility = () => {
    updateElement(element.id, { visible: !element.visible })
  }

  const handleDuplicate = () => {
    duplicateElement(element.id)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this element?')) {
      deleteElement(element.id)
      onClose?.()
    }
  }

  const menuItems = [
    {
      id: 'edit',
      label: 'Edit',
      icon: Scissors,
      items: [
        { icon: Wand2, label: 'Edit with AI', action: () => setShowAIModal(true), color: 'purple' },
        { icon: Replace, label: 'Replace', action: () => setShowReplaceModal(true), color: 'blue' },
        { icon: Crop, label: 'Crop', action: () => setShowCropModal(true), color: 'green' },
        { icon: Eraser, label: 'Remove BG', action: () => {}, color: 'red' },
      ]
    },
    {
      id: 'adjust',
      label: 'Adjust',
      icon: SlidersHorizontal,
      items: [
        { icon: Sparkles, label: 'Sharpen', action: () => {}, color: 'yellow' },
        { icon: Sun, label: 'Brightness', action: () => {}, color: 'orange' },
        { icon: Contrast, label: 'Contrast', action: () => {}, color: 'indigo' },
        { icon: Droplet, label: 'Saturation', action: () => {}, color: 'cyan' },
      ]
    },
    {
      id: 'effects',
      label: 'Effects',
      icon: Palette,
      items: [
        { icon: Filter, label: 'Filters', action: () => {}, color: 'pink' },
        { icon: Layers, label: 'Opacity', action: () => setShowAdjustPanel(true), color: 'teal' },
        { icon: RotateCw, label: 'Rotate', action: () => handleRotate(90), color: 'violet' },
        { icon: FlipHorizontal, label: 'Flip', action: () => handleFlip('horizontal'), color: 'rose' },
      ]
    },
    {
      id: 'ai',
      label: 'AI Tools',
      icon: Sparkles,
      items: [
        { icon: Wand2, label: 'AI Enhance', action: () => {}, color: 'purple' },
        { icon: Eraser, label: 'AI Remove BG', action: () => {}, color: 'red' },
        { icon: Maximize2, label: 'AI Upscale', action: () => {}, color: 'blue' },
        { icon: Palette, label: 'AI Recolor', action: () => {}, color: 'green' },
      ]
    }
  ]

  return (
    <>
      {/* Main Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Top Action Bar */}
          <div className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            {/* Quick Actions */}
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
            >
              <Wand2 className="w-4 h-4" />
              Edit with AI
            </button>

            <button
              onClick={() => setShowReplaceModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
            >
              <Replace className="w-4 h-4" />
              Replace
            </button>

            <button
              onClick={() => setShowCropModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
            >
              <Crop className="w-4 h-4" />
              Crop
            </button>

            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
            >
              <Eraser className="w-4 h-4" />
              Remove BG
            </button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            {/* Adjustment Tools */}
            <button
              onClick={() => {}}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sharpen"
            >
              <Sparkles className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => setShowAdjustPanel(!showAdjustPanel)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Adjust"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => handleRotate(90)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Rotate 90°"
            >
              <RotateCw className="w-5 h-5 text-gray-700" />
            </button>

            <div className="w-px h-8 bg-gray-300 mx-2" />

            {/* Element Controls */}
            <button
              onClick={handleLock}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={element.locked ? 'Unlock' : 'Lock'}
            >
              {element.locked ? (
                <Lock className="w-5 h-5 text-orange-600" />
              ) : (
                <Unlock className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <button
              onClick={handleVisibility}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={element.visible ? 'Hide' : 'Show'}
            >
              {element.visible !== false ? (
                <Eye className="w-5 h-5 text-gray-700" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <button
              onClick={handleDuplicate}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>

            {onClose && (
              <>
                <div className="w-px h-8 bg-gray-300 mx-2" />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Opacity Slider (Always Visible) */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 w-16">Opacity</span>
              <input
                type="range"
                min="0"
                max="100"
                value={adjustments.opacity * 100}
                onChange={(e) => handleOpacityChange(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700 w-12 text-right">
                {Math.round(adjustments.opacity * 100)}%
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Adjustment Panel */}
      <AnimatePresence>
        {showAdjustPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-4 z-50 w-80"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Adjustments
                </h3>
                <button
                  onClick={() => setShowAdjustPanel(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                {/* Brightness */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Sun className="w-4 h-4 text-orange-500" />
                      Brightness
                    </label>
                    <span className="text-sm text-gray-600">{adjustments.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.brightness}
                    onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                  />
                </div>

                {/* Contrast */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Contrast className="w-4 h-4 text-indigo-500" />
                      Contrast
                    </label>
                    <span className="text-sm text-gray-600">{adjustments.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.contrast}
                    onChange={(e) => handleContrastChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Saturation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-cyan-500" />
                      Saturation
                    </label>
                    <span className="text-sm text-gray-600">{adjustments.saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={adjustments.saturation}
                    onChange={(e) => handleSaturationChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Sharpen */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      Sharpen
                    </label>
                    <span className="text-sm text-gray-600">{adjustments.sharpen}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={adjustments.sharpen}
                    onChange={(e) => handleSharpenChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>

                {/* Blur */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Filter className="w-4 h-4 text-purple-500" />
                      Blur
                    </label>
                    <span className="text-sm text-gray-600">{adjustments.blur}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={adjustments.blur}
                    onChange={(e) => handleBlurChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleResetAdjustments}
                  className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  Reset All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAIModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Wand2 className="w-6 h-6" />
                  AI Image Editor
                </h3>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Wand2, label: 'AI Enhance', desc: 'Auto-enhance image quality', color: 'purple' },
                    { icon: Eraser, label: 'Remove Background', desc: 'AI-powered background removal', color: 'red' },
                    { icon: Maximize2, label: 'Upscale', desc: 'Increase resolution with AI', color: 'blue' },
                    { icon: Palette, label: 'Recolor', desc: 'Change colors intelligently', color: 'green' },
                  ].map((tool) => (
                    <button
                      key={tool.label}
                      className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                    >
                      <tool.icon className={`w-8 h-8 text-${tool.color}-600 mb-2`} />
                      <h4 className="font-semibold text-gray-900 mb-1">{tool.label}</h4>
                      <p className="text-sm text-gray-600">{tool.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    AI features coming soon! 🚀
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replace Modal */}
      <AnimatePresence>
        {showReplaceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowReplaceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="px-6 py-4 bg-blue-600 flex items-center justify-between">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Replace className="w-6 h-6" />
                  Replace Image
                </h3>
                <button
                  onClick={() => setShowReplaceModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-1">Click to upload</p>
                  <p className="text-sm text-gray-500">or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, SVG up to 10MB</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crop Modal */}
      <AnimatePresence>
        {showCropModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCropModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden"
            >
              <div className="px-6 py-4 bg-green-600 flex items-center justify-between">
                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                  <Crop className="w-6 h-6" />
                  Crop Image
                </h3>
                <button
                  onClick={() => setShowCropModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-100 rounded-xl p-8 text-center">
                  <Crop className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">Crop tool coming soon!</p>
                  <p className="text-sm text-gray-500 mt-2">Interactive cropping interface</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
