'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Image, Shapes, Palette, Layout, Droplet, MoreHorizontal,
  ArrowLeft, ZoomIn, ZoomOut, Undo, Redo, Save, Download, FolderOpen, Maximize, Minimize, Settings, Package, RotateCcw, Edit3
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import CustomizeSidebar from '@/components/customize/CustomizeSidebar'
import CustomizeCanvas from '@/components/customize/CustomizeCanvas'
import ProductOptionsModal from '@/components/customize/ProductOptionsModal'
import ChangeOrientationModal from '@/components/customize/ChangeOrientationModal'
import EnhancedTextEditor from '@/components/customize/EnhancedTextEditor'
import { useEditorStore } from '@/store/editor.store'
import { useProductStore } from '@/store/product.store'
import { useDesigns } from '@/hooks/useDesigns'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useLoadDesign } from '@/hooks/useLoadDesign'
import toast from 'react-hot-toast'

type TabType = 'text' | 'uploads' | 'graphics' | 'background' | 'templates' | 'color' | 'product' | 'more'

export default function CustomizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const designId = searchParams.get('designId')
  
  const { zoom, setZoom, undo, redo, history, selectedId, elements, background } = useEditorStore()
  const { 
    isOptionsModalOpen, 
    openOptionsModal, 
    closeOptionsModal, 
    selections, 
    setSelections,
    calculateTotalPrice 
  } = useProductStore()
  const [activeTab, setActiveTab] = useState<TabType>('text')
  const [designName, setDesignName] = useState('Untitled Design')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isFullCanvas, setIsFullCanvas] = useState(false)
  const [showOrientationModal, setShowOrientationModal] = useState(false)
  const [showEnhancedTextEditor, setShowEnhancedTextEditor] = useState(false)

  const { createDesign, updateDesign } = useDesigns()
  const { loadDesign, loading: loadingDesign } = useLoadDesign()
  const { manualSave } = useAutoSave({
    designId,
    enabled: !!designId, // Enable auto-save only if editing existing design
    debounceMs: 3000,
  })

  // Load design if designId is provided
  useEffect(() => {
    if (designId) {
      loadDesign(designId).then((design) => {
        if (design) {
          setDesignName(design.designName)
        }
      })
    }
  }, [designId, loadDesign])

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    // Allow access without login for demo purposes
    // if (!token) {
    //   router.push('/login')
    //   return
    // }

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        redo()
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.shiftKey) {
        const selectedId = useEditorStore.getState().selectedId
        if (selectedId) {
          e.preventDefault()
          useEditorStore.getState().deleteElement(selectedId)
        }
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        const selectedId = useEditorStore.getState().selectedId
        if (selectedId) {
          useEditorStore.getState().duplicateElement(selectedId)
        }
      }
      if (e.key === 'Escape') {
        useEditorStore.getState().selectElement(null)
      }
      // Ctrl+S to save
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, undo, redo, designId])

  const handleSave = async () => {
    if (designId) {
      // Update existing design
      await manualSave()
    } else {
      // Show save dialog for new design
      setShowSaveDialog(true)
    }
  }

  const handleProductOptionsConfirm = (newSelections: Record<string, string>) => {
    setSelections(newSelections)
    toast.success('Product options updated successfully!')
  }

  const handleSaveAsNew = async () => {
    if (!designName.trim()) {
      toast.error('Please enter a design name')
      return
    }

    setIsSaving(true)
    try {
      const newDesign = await createDesign({
        designName: designName.trim(),
        canvas: {
          width: 1125,
          height: 675,
          background,
        },
        elements,
      })

      if (newDesign) {
        setShowSaveDialog(false)
        // Redirect to edit mode with the new design ID
        router.push(`/customize?designId=${newDesign._id}`)
      }
    } catch (error) {
      console.error('Save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'text' as TabType, icon: Type, label: 'Text' },
    { id: 'uploads' as TabType, icon: Image, label: 'Uploads' },
    { id: 'graphics' as TabType, icon: Shapes, label: 'Graphics' },
    { id: 'background' as TabType, icon: Palette, label: 'Background' },
    { id: 'templates' as TabType, icon: Layout, label: 'Templates' },
    { id: 'color' as TabType, icon: Droplet, label: 'Color' },
    { id: 'product' as TabType, icon: Package, label: 'Product' },
    { id: 'more' as TabType, icon: MoreHorizontal, label: 'More' },
  ]

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Icon Navigation */}
        {!isFullCanvas && (
          <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[9px] font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 border-2 border-blue-500 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Sidebar Panel */}
        {!isFullCanvas && <CustomizeSidebar activeTab={activeTab} />}

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Top Action Bar */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h1 className="text-sm font-bold text-gray-900">{designName}</h1>
                <p className="text-xs text-gray-500">
                  {selections.orientation === 'horizontal' ? '5.2cm × 9cm' : '9cm × 5.2cm'} • 
                  {selections.quantity} cards • ₹{calculateTotalPrice()}
                  {designId && <span className="ml-2 text-green-600">● Auto-saving</span>}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Enhanced Text Editor */}
              <button
                onClick={() => setShowEnhancedTextEditor(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 text-sm font-medium transition-colors flex items-center gap-2"
                title="Professional Text Editor"
              >
                <Edit3 className="w-4 h-4" />
                Text Editor
              </button>

              {/* Change Orientation */}
              <button
                onClick={() => setShowOrientationModal(true)}
                className="px-4 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-700 text-sm font-medium transition-colors flex items-center gap-2"
                title="Change Orientation"
              >
                <RotateCcw className="w-4 h-4" />
                Orientation
              </button>

              {/* Product Options */}
              <button
                onClick={openOptionsModal}
                className="px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium transition-colors flex items-center gap-2"
                title="Product Options"
              >
                <Settings className="w-4 h-4" />
                Options
              </button>

              {/* Full Canvas Toggle */}
              <button
                onClick={() => setIsFullCanvas(!isFullCanvas)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title={isFullCanvas ? "Exit Full Canvas" : "Full Canvas Mode"}
              >
                {isFullCanvas ? (
                  <Minimize className="w-4 h-4 text-gray-600" />
                ) : (
                  <Maximize className="w-4 h-4 text-gray-600" />
                )}
              </button>

              <div className="w-px h-6 bg-gray-200" />

              {/* Undo/Redo */}
              <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo (Ctrl+Y)"
              >
                <Redo className="w-4 h-4 text-gray-600" />
              </button>

              <div className="w-px h-6 bg-gray-200 mx-2" />

              {/* My Designs */}
              <button
                onClick={() => router.push('/designs')}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2"
                title="My Designs"
              >
                <FolderOpen className="w-4 h-4" />
                My Designs
              </button>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                title="Save (Ctrl+S)"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>

              {/* Download */}
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white text-sm font-semibold transition-opacity flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          {/* Canvas */}
          <CustomizeCanvas />

          {/* Zoom Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
              <button
                onClick={() => setZoom(Math.max(25, zoom - 10))}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom Out (Ctrl + Mouse Wheel)"
              >
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-700 min-w-[50px] text-center">
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(Math.min(300, zoom + 10))}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Zoom In (Ctrl + Mouse Wheel)"
              >
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* Reset Zoom */}
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button
                onClick={() => setZoom(100)}
                className="px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Reset Zoom (100%)"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Save Design</h2>
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="Enter design name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsNew}
                disabled={isSaving || !designName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Text Editor */}
      <EnhancedTextEditor
        isOpen={showEnhancedTextEditor}
        onClose={() => setShowEnhancedTextEditor(false)}
        canvasWidth={1125}
        canvasHeight={675}
      />

      {/* Change Orientation Modal */}
      <ChangeOrientationModal
        isOpen={showOrientationModal}
        onClose={() => setShowOrientationModal(false)}
      />

      {/* Product Options Modal */}
      <ProductOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={closeOptionsModal}
        onConfirm={handleProductOptionsConfirm}
        productType="business-card"
      />
    </div>
  )
}
