'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Type, Image, Shapes, Palette, Layout, Droplet,
  ZoomIn, ZoomOut, Undo, Redo, Eye, ArrowRight
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import CustomizeSidebar from '@/components/customize/CustomizeSidebar'
import CustomizeCanvas from '@/components/customize/CustomizeCanvas'
import PreviewModal from '@/components/customize/PreviewModal'
import { useEditorStore } from '@/store/editor.store'
import { useProductStore } from '@/store/product.store'
import { useDesigns } from '@/hooks/useDesigns'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useLoadDesign } from '@/hooks/useLoadDesign'
import { templates } from '@/lib/templates'
import api from '@/lib/api'
import toast from 'react-hot-toast'

type TabType = 'text' | 'uploads' | 'graphics' | 'background' | 'templates' | 'color'

export default function CustomizePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const designId = searchParams.get('designId')
  const templateId = searchParams.get('templateId')
  
  const { zoom, setZoom, undo, redo, history, selectedId, elements, background, addElement, setBackground, setTemplateHtml } = useEditorStore()
  const { calculateTotalPrice, selections } = useProductStore()
  const [activeTab, setActiveTab] = useState<TabType>('text')
  const [designName, setDesignName] = useState('Untitled Design')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const { createDesign, updateDesign } = useDesigns()
  const { loadDesign, loading: loadingDesign } = useLoadDesign()
  const { manualSave } = useAutoSave({
    designId,
    enabled: !!designId, // Enable auto-save only if editing existing design
    debounceMs: 3000,
  })

  // Load design if designId is provided, load template if templateId is provided, otherwise load default template
  useEffect(() => {
    const loadContent = async () => {
      if (designId) {
        // Load existing saved design
        const design = await loadDesign(designId)
        if (design) {
          setDesignName(design.designName)
        }
      } else if (templateId) {
        // Load template from session storage or API
        let template: any = null
        
        // First, try to get from session storage (passed from templates page)
        try {
          const savedTemplate = sessionStorage.getItem('qc_selected_template_full')
          if (savedTemplate) {
            template = JSON.parse(savedTemplate)
            sessionStorage.removeItem('qc_selected_template_full') // Clean up
          }
        } catch (e) {
          console.error('Failed to parse saved template:', e)
        }
        
        // If not in session storage, fetch from API
        if (!template) {
          try {
            const response = await api.get(`/templates/${templateId}`)
            template = response.data.data || response.data
          } catch (error) {
            console.error('Failed to load template from API:', error)
          }
        }
        
        if (template) {
          // Clear canvas
          const store = useEditorStore.getState()
          store.reset()
          
          // Set template name
          setDesignName(`${template.name} - Customized`)
          
          // Set background from template
          const bg = template.layoutConfig?.background || '#FFFFFF'
          setBackground(bg)

          // ── NEW: store the raw HTML/CSS so CustomizeCanvas renders it as iframe ──
          if (template.frontHTML) {
            setTemplateHtml(template.frontHTML, template.frontCSS || '')
          }

          toast.success(`Template "${template.name}" loaded! Start customizing.`)
        } else {
          toast.error('Failed to load template. Loading default template.')
          loadDefaultTemplate()
        }
      } else if (elements.length === 0) {
        // Load default template if canvas is empty
        loadDefaultTemplate()
      }
    }
    
    const loadDefaultTemplate = () => {
      const defaultTemplate = templates.find(t => t.id === 'default-card')
      if (defaultTemplate) {
        setBackground(defaultTemplate.background)
        defaultTemplate.elements.forEach((element) => {
          const { id, zIndex, ...elementData } = element
          addElement(elementData as any)
        })
      } else {
        // If no default template, create basic elements
        import('@/lib/template-to-canvas').then(({ createDefaultCanvasElements }) => {
          const defaultElements = createDefaultCanvasElements()
          defaultElements.forEach((element) => {
            const { id, zIndex, ...elementData } = element
            addElement(elementData as any)
          })
        })
      }
    }
    
    loadContent()
  }, [designId, templateId, loadDesign])

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

  const handleNext = async () => {
    // Auto-save before proceeding
    if (designId) {
      await manualSave()
    }
    
    // Navigate to product options
    if (designId) {
      router.push(`/product-options?designId=${designId}`)
    } else {
      router.push('/product-options')
    }
  }

  const tabs = [
    { id: 'text' as TabType, icon: Type, label: 'Text' },
    { id: 'uploads' as TabType, icon: Image, label: 'Uploads' },
    { id: 'graphics' as TabType, icon: Shapes, label: 'Graphics' },
    { id: 'background' as TabType, icon: Palette, label: 'Background' },
    { id: 'templates' as TabType, icon: Layout, label: 'Templates' },
    { id: 'color' as TabType, icon: Droplet, label: 'Color' },
  ]

  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Main Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Icon Navigation */}
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

        {/* Sidebar Panel */}
        <CustomizeSidebar activeTab={activeTab} />

        {/* Center Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Top Action Bar */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
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

              {/* Preview */}
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2 border border-gray-300 shadow-sm"
                title="Preview Design"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white text-sm font-semibold transition-opacity flex items-center gap-2 shadow-md"
                title="Continue to Product Options"
              >
                Next
                <ArrowRight className="w-4 h-4" />
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

      {/* Preview Modal */}
      <PreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  )
}
