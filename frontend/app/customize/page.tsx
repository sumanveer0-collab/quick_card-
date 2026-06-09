'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Type, Image, Shapes, Palette, Layout, Droplet,
  ZoomIn, ZoomOut, Undo, Redo, Eye, Loader2,
  CreditCard, RefreshCw, ChevronRight,
  Share2, Save, Download, Printer
} from 'lucide-react'
import CustomizeSidebar from '@/components/customize/CustomizeSidebar'
import CustomizeCanvas from '@/components/customize/CustomizeCanvas'
import PreviewModal from '@/components/customize/PreviewModal'
import TextEditPanel from '@/components/customize/TextEditPanel'
import { useEditorStore } from '@/store/editor.store'
import { useProductStore } from '@/store/product.store'
import { useDesigns } from '@/hooks/useDesigns'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useLoadDesign } from '@/hooks/useLoadDesign'
import { templates } from '@/lib/templates'
import { resolveTemplateFromUrl } from '@/lib/templates/catalog-templates'
import api from '@/lib/api'
import toast from 'react-hot-toast'

type TabType = 'text' | 'uploads' | 'graphics' | 'background' | 'templates' | 'color'

// ── Inner component that uses useSearchParams ──────────────────────────────
function CustomizeEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const designId = searchParams.get('designId')
  const templateId = searchParams.get('templateId')
  // designId from URL can be either a saved-design mongo ID OR a catalog designId (e.g. 'corp-blue')
  // We distinguish them: catalog designIds never contain ObjectId chars and are short slugs.
  const catalogDesignId = searchParams.get('designId')  // may be catalog slug
  const savedDesignId = designId && designId.length === 24 ? designId : null  // mongo ObjectId = 24 chars

  const { zoom, setZoom, undo, redo, history, selectedId, elements, background, addElement, setBackground, setTemplateHtml } = useEditorStore()
  const { calculateTotalPrice, selections } = useProductStore()
  const [activeTab, setActiveTab] = useState<TabType>('text')
  const [designName, setDesignName] = useState('Untitled Design')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [textEditId, setTextEditId] = useState<string | null>(null)

  // Open text edit panel when a text element is selected on canvas
  useEffect(() => {
    if (selectedId) {
      const el = elements.find(e => e.id === selectedId)
      if (el?.type === 'text') {
        setTextEditId(selectedId)
        setActiveTab('text')
      } else {
        // Non-text selected — only close editor if Text tab isn't the active tab
        setTextEditId(null)
      }
    } else {
      setTextEditId(null)
    }
  }, [selectedId, elements])

  // When Text tab is clicked, auto-select the first text element if any
  const handleTabClick = (id: TabType) => {
    setActiveTab(id)
    if (id === 'text') {
      const firstText = elements.find(e => e.type === 'text')
      if (firstText) {
        useEditorStore.getState().selectElement(firstText.id)
        setTextEditId(firstText.id)
      } else {
        setTextEditId(null)
      }
    } else {
      // Switching away from text tab — deselect text editor but keep canvas selection
      if (textEditId) {
        setTextEditId(null)
      }
    }
  }

  const { createDesign } = useDesigns()
  const { loadDesign } = useLoadDesign()
  const { manualSave } = useAutoSave({
    designId: savedDesignId,
    enabled: !!savedDesignId,
    debounceMs: 3000,
  })

  useEffect(() => {
    const loadContent = async () => {
      const store = useEditorStore.getState()

      // ── 1. Saved design (mongo ID) ────────────────────────────────────────
      if (savedDesignId) {
        const design = await loadDesign(savedDesignId)
        if (design) setDesignName(design.designName)
        return
      }

      // ── 2. Catalog design (e.g. ?templateId=corp-blue&designId=corp-blue) ─
      //    Try to resolve from the 25 CARD_DESIGNS first — this is the primary
      //    path when the user clicks a card on /business-cards/search.
      const catalogResolved = resolveTemplateFromUrl(templateId, catalogDesignId)
      if (catalogResolved) {
        store.reset()
        setDesignName(catalogResolved.name)
        setBackground(catalogResolved.background)
        catalogResolved.elements.forEach(({ id: _id, zIndex: _z, ...el }) => addElement(el as any))
        toast.success(`"${catalogResolved.name}" loaded!`)
        return
      }

      // ── 3. API template (server-side template with frontHTML) ─────────────
      if (templateId) {
        let apiTemplate: any = null

        // Check sessionStorage first (set by TemplatesPanel)
        try {
          const saved = sessionStorage.getItem('qc_selected_template_full')
          if (saved) {
            apiTemplate = JSON.parse(saved)
            sessionStorage.removeItem('qc_selected_template_full')
          }
        } catch {}

        // Fetch from API
        if (!apiTemplate) {
          try {
            const res = await api.get(`/templates/${templateId}`)
            apiTemplate = res.data.data || res.data
          } catch {}
        }

        if (apiTemplate) {
          store.reset()
          setDesignName(`${apiTemplate.name} - Customized`)
          setBackground(apiTemplate.layoutConfig?.background || '#ffffff')
          if (apiTemplate.frontHTML) setTemplateHtml(apiTemplate.frontHTML, apiTemplate.frontCSS || '')
          toast.success(`"${apiTemplate.name}" loaded!`)
          return
        }

        // ── 4. Local static template (lib/templates/index.ts) ────────────────
        const localTmpl = templates.find(t => t.id === templateId)
        if (localTmpl) {
          store.reset()
          setDesignName(localTmpl.name)
          setBackground(localTmpl.background)
          localTmpl.elements.forEach(({ id: _id, zIndex: _z, ...el }) => addElement(el as any))
          toast.success(`"${localTmpl.name}" loaded!`)
          return
        }
      }

      // ── 5. Blank canvas fallback ──────────────────────────────────────────
      if (elements.length === 0) {
        loadDefaultTemplate()
      }
    }

    const loadDefaultTemplate = () => {
      const def = templates.find(t => t.id === 'default-card')
      if (def) {
        setBackground(def.background)
        def.elements.forEach(({ id: _id, zIndex: _z, ...el }) => addElement(el as any))
      } else {
        import('@/lib/template-to-canvas').then(({ createDefaultCanvasElements }) => {
          createDefaultCanvasElements().forEach(({ id: _id, zIndex: _z, ...el }) => addElement(el as any))
        })
      }
    }

    loadContent()
  }, [savedDesignId, templateId, catalogDesignId])

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
    if (savedDesignId) await manualSave()
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
    if (savedDesignId) await manualSave()
    router.push(savedDesignId ? `/product-options?designId=${savedDesignId}` : '/product-options')
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Find the Konva stage container to capture
      const stageEl = document.querySelector('[data-canvas-stage]') as HTMLElement
        ?? document.querySelector('.konvajs-content') as HTMLElement
      if (!stageEl) { toast.error('Canvas not ready'); return }
      const { toPng } = await import('html-to-image')
      const url = await toPng(stageEl, { quality: 1, pixelRatio: 2, cacheBust: true })
      const a = document.createElement('a')
      a.download = `${designName || 'quickcard-design'}.png`
      a.href = url
      a.click()
      toast.success('Design downloaded!')
    } catch {
      toast.error('Download failed. Try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = async () => {
    try {
      const stageEl = document.querySelector('[data-canvas-stage]') as HTMLElement
        ?? document.querySelector('.konvajs-content') as HTMLElement
      if (!stageEl) { toast.error('Canvas not ready'); return }
      const { toPng } = await import('html-to-image')
      const url = await toPng(stageEl, { quality: 1, pixelRatio: 3, cacheBust: true })
      const win = window.open('', '_blank')
      if (!win) { toast.error('Please allow popups to print'); return }
      win.document.write(`
        <html><head><title>Print – ${designName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
          img { max-width: 100%; height: auto; }
          @media print { body { margin: 0; } }
        </style></head>
        <body>
          <img src="${url}" onload="window.print(); window.close();" />
        </body></html>
      `)
      win.document.close()
    } catch {
      toast.error('Print failed. Try again.')
    }
  }

  const handleShare = async () => {
    const url = designId
      ? `${window.location.origin}/customize?designId=${designId}`
      : window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: designName, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard!')
      }
    } catch {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied!')
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

      {/* ── Vistaprint-style top header ── */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-40">
        {/* Left: logo + title + undo/redo */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-1.5 font-bold text-base text-blue-600 mr-2">
            <CreditCard className="w-5 h-5" />
            <span>QuickCard</span>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200" />

          {/* Editable product/design name */}
          <input
            type="text"
            value={designName}
            onChange={e => setDesignName(e.target.value)}
            className="text-sm font-semibold text-gray-800 bg-transparent border-none outline-none hover:bg-gray-100 focus:bg-gray-100 rounded px-2 py-1 min-w-[160px] max-w-[280px] truncate cursor-pointer"
            title="Click to rename"
          />

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200" />

          {/* Undo / Redo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <Undo className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <Redo className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => window.location.reload()}
            title="Refresh"
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>

          {/* Auto-save indicator */}
          {savedDesignId && (
            <span className="text-[11px] text-green-600 font-medium ml-1">● Auto-saving</span>
          )}
        </div>

        {/* Right: Preview + price + Next */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 shadow-sm transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>

          {/* Price badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-800">
            <span className="text-xs text-gray-500 font-normal">
              {selections.quantity} cards •
            </span>
            <span>₹{calculateTotalPrice()}</span>
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        {/* Icon nav */}
        <div className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 gap-2">
          {tabs.map(({ id, icon: Icon, label }) => {
            const isActive = activeTab === id
            return (
              <motion.button
                key={id}
                onClick={() => handleTabClick(id)}
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

        {/* Sidebar — shows TextEditPanel on left when text selected, otherwise normal sidebar */}
        <AnimatePresence mode="wait">
          {textEditId ? (
            <TextEditPanel
              key={textEditId}
              elementId={textEditId}
              onClose={() => {
                setTextEditId(null)
                setActiveTab('text')
                useEditorStore.getState().selectElement(null)
              }}
            />
          ) : (
            <CustomizeSidebar activeTab={activeTab} />
          )}
        </AnimatePresence>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
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

      {/* ── BrandCrowd-style bottom action bar ── */}
      <div className="h-14 bg-white border-t border-gray-200 flex items-center justify-center gap-3 shrink-0 shadow-[0_-1px_4px_rgba(0,0,0,0.06)] z-40 px-4">
        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>

        {/* Save Progress */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving…' : 'Save Progress'}
        </button>

        {/* Download – green accent */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
        >
          <Download className="w-4 h-4" />
          {isDownloading ? 'Downloading…' : 'Download'}
        </button>

        {/* Print */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium border border-gray-300 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
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
