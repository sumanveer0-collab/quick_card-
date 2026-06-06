'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Type, Image, Shapes, Palette, Layout, Droplet,
  ZoomIn, ZoomOut, Undo, Redo, Eye, ArrowRight, Loader2
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

// ── Inner component that uses useSearchParams ──────────────────────────────
function CustomizeEditor() {
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

  const { createDesign } = useDesigns()
  const { loadDesign } = useLoadDesign()
  const { manualSave } = useAutoSave({
    designId,
    enabled: !!designId,
    debounceMs: 3000,
  })

  useEffect(() => {
    const loadContent = async () => {
      if (designId) {
        const design = await loadDesign(designId)
        if (design) setDesignName(design.designName)
      } else if (templateId) {
        let template: any = null

        try {
          const saved = sessionStorage.getItem('qc_selected_template_full')
          if (saved) { template = JSON.parse(saved); sessionStorage.removeItem('qc_selected_template_full') }
        } catch {}

        if (!template) {
          try {
            const res = await api.get(`/templates/${templateId}`)
            template = res.data.data || res.data
          } catch {}
        }

        if (template) {
          useEditorStore.getState().reset()
          setDesignName(`${template.name} - Customized`)
          setBackground(template.layoutConfig?.background || '#ffffff')
          if (template.frontHTML) setTemplateHtml(template.frontHTML, template.frontCSS || '')
          toast.success(`"${template.name}" loaded!`)
        } else {
          loadDefaultTemplate()
        }
      } else if (elements.length === 0) {
        loadDefaultTemplate()
      }
    }

    const loadDefaultTemplate = () => {
      const def = templates.find(t => t.id === 'default-card')
      if (def) {
        setBackground(def.background)
        def.elements.forEach(({ id, zIndex, ...el }) => addElement(el as any))
      } else {
        import('@/lib/template-to-canvas').then(({ createDefaultCanvasElements }) => {
          createDefaultCanvasElements().forEach(({ id, zIndex, ...el }) => addElement(el as any))
        })
      }
    }

    loadContent()
  }, [designId, templateId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) { e.preventDefault(); redo() }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.shiftKey) {
        const sid = useEditorStore.getState().selectedId
        if (sid) { e.preventDefault(); useEditorStore.getState().deleteElement(sid) }
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        const sid = useEditorStore.getState().selectedId
        if (sid) useEditorStore.getState().duplicateElement(sid)
      }
      if (e.key === 'Escape') useEditorStore.getState().selectElement(null)
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, designId])

  const handleSave = async () => {
    if (designId) await manualSave()
    else setShowSaveDialog(true)
  }

  const handleSaveAsNew = async () => {
    if (!designName.trim()) return toast.error('Please enter a design name')
    setIsSaving(true)
    try {
      const newDesign = await createDesign({
        designName: designName.trim(),
        canvas: { width: 1125, height: 675, background },
        elements,
      })
      if (newDesign) {
        setShowSaveDialog(false)
        router.push(`/customize?designId=${newDesign._id}`)
      }
    } catch {}
    finally { setIsSaving(false) }
  }

  const handleNext = async () => {
    if (designId) await manualSave()
    router.push(designId ? `/product-options?designId=${designId}` : '/product-options')
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
      <div className="flex-1 flex overflow-hidden">

        {/* Icon nav */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2">
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id
            return (
              <motion.button
                key={id}
                onClick={() => setActiveTab(id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium">{label}</span>
                {isActive && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 border-2 border-blue-500 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Sidebar */}
        <CustomizeSidebar activeTab={activeTab} />

        {/* Canvas area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Top bar */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-gray-900">{designName}</h1>
              <p className="text-xs text-gray-500">
                9cm × 5.2cm • {selections.quantity} cards • ₹{calculateTotalPrice()}
                {designId && <span className="ml-2 text-green-600">● Auto-saving</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={undo} disabled={!canUndo} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30" title="Undo (Ctrl+Z)">
                <Undo className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={redo} disabled={!canRedo} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30" title="Redo (Ctrl+Y)">
                <Redo className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-6 bg-gray-200 mx-2" />
              <button onClick={() => setShowPreview(true)}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium flex items-center gap-2 shadow-sm">
                <Eye className="w-4 h-4" /> Preview
              </button>
              <button onClick={handleNext}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white text-sm font-semibold flex items-center gap-2 shadow-md">
                Next <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <CustomizeCanvas />

          {/* Zoom controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
              <button onClick={() => setZoom(Math.max(25, zoom - 10))} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <ZoomOut className="w-4 h-4 text-gray-600" />
              </button>
              <span className="text-sm font-semibold text-gray-700 min-w-[50px] text-center">{zoom}%</span>
              <button onClick={() => setZoom(Math.min(300, zoom + 10))} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <ZoomIn className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-px h-4 bg-gray-300 mx-1" />
              <button onClick={() => setZoom(100)} className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded">Reset</button>
            </div>
          </div>
        </div>
      </div>

      {/* Save dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Save Design</h2>
            <input type="text" value={designName} onChange={e => setDesignName(e.target.value)}
              placeholder="Enter design name" autoFocus
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
            <div className="flex gap-3">
              <button onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium">Cancel</button>
              <button onClick={handleSaveAsNew} disabled={isSaving || !designName.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <PreviewModal isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  )
}

// ── Page export with Suspense boundary ────────────────────────────────────
export default function CustomizePage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading editor...</p>
        </div>
      </div>
    }>
      <CustomizeEditor />
    </Suspense>
  )
}
