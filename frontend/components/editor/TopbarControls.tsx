'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Undo, Redo, ZoomIn, ZoomOut, Grid, Eye, EyeOff, Download,
  Save, RotateCcw, Layers, ArrowUpCircle, ArrowDownCircle,
  Copy, Trash2, Lock, Unlock, FileImage, FileText
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import toast from 'react-hot-toast'

export default function TopbarControls() {
  const {
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    showBleed,
    toggleBleed,
    showTrim,
    toggleTrim,
    showSafety,
    toggleSafety,
    snapToGrid,
    toggleSnapToGrid,
    currentFace,
    setCurrentFace,
    undo,
    redo,
    history,
    selectedId,
    elements,
    duplicateElement,
    deleteElement,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    updateElement,
  } = useEditorStore()

  const [downloading, setDownloading] = useState(false)

  const selectedElement = elements.find((el) => el.id === selectedId)
  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const handleZoomIn = () => setZoom(zoom + 10)
  const handleZoomOut = () => setZoom(zoom - 10)
  const handleResetZoom = () => setZoom(100)

  const handleExportPNG = async () => {
    setDownloading(true)
    try {
      // Export logic will be implemented in the main editor page
      toast.success('Export feature coming soon!')
    } catch (error) {
      toast.error('Export failed')
    } finally {
      setDownloading(false)
    }
  }

  const handleSave = () => {
    toast.success('Design saved!')
  }

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 h-16 gap-4">
        {/* Left: Undo/Redo */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Face toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentFace('front')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentFace === 'front'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Front
            </button>
            <button
              onClick={() => setCurrentFace('back')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                currentFace === 'back'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Back
            </button>
          </div>
        </div>

        {/* Center: Element controls (show when element is selected) */}
        {selectedElement && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <button
              onClick={() => duplicateElement(selectedId!)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Duplicate (Ctrl+D)"
            >
              <Copy className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            </button>

            <div className="w-px h-6 bg-gray-200" />

            <button
              onClick={() => bringToFront(selectedId!)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Bring to Front"
            >
              <ArrowUpCircle className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            </button>
            <button
              onClick={() => bringForward(selectedId!)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Bring Forward"
            >
              <Layers className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            </button>
            <button
              onClick={() => sendBackward(selectedId!)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Send Backward"
            >
              <Layers className="w-4 h-4 text-gray-600 group-hover:text-blue-600 rotate-180" />
            </button>
            <button
              onClick={() => sendToBack(selectedId!)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title="Send to Back"
            >
              <ArrowDownCircle className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
            </button>

            <div className="w-px h-6 bg-gray-200" />

            <button
              onClick={() => updateElement(selectedId!, { locked: !selectedElement.locked })}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
              title={selectedElement.locked ? 'Unlock' : 'Lock'}
            >
              {selectedElement.locked ? (
                <Lock className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              ) : (
                <Unlock className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
              )}
            </button>

            <button
              onClick={() => deleteElement(selectedId!)}
              className="p-2 rounded-lg hover:bg-red-50 transition-colors group"
              title="Delete (Del)"
            >
              <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
            </button>
          </motion.div>
        )}

        {/* Right: View controls & actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1.5 rounded-md hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-md hover:bg-white transition-colors text-xs font-semibold text-gray-600 min-w-[50px]"
              title="Reset Zoom"
            >
              {zoom}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-1.5 rounded-md hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200" />

          {/* View toggles */}
          <button
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-colors ${
              showGrid ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={toggleBleed}
            className={`p-2 rounded-lg transition-colors ${
              showBleed ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Bleed Area"
          >
            {showBleed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleTrim}
            className={`p-2 rounded-lg transition-colors ${
              showTrim ? 'bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Trim/Cut Line"
          >
            {showTrim ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleSafety}
            className={`p-2 rounded-lg transition-colors ${
              showSafety ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Toggle Safe Area"
          >
            {showSafety ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleSnapToGrid}
            className={`p-2 rounded-lg transition-colors ${
              snapToGrid ? 'bg-purple-50 text-purple-600' : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Snap to Grid"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-200" />

          {/* Export buttons */}
          <button
            onClick={handleExportPNG}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Export as PNG"
          >
            <FileImage className="w-3.5 h-3.5" />
            PNG
          </button>

          <button
            onClick={handleExportPNG}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Export as PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
            title="Save Design"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
