'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowLeft, ChevronRight, Search,
  X, Check, Loader2, LayoutGrid,
  Crown, RotateCcw, Pencil,
  Phone, Mail, Globe, MapPin,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import TemplateCard, { Template } from '@/components/TemplateCard'
import api from '@/lib/api'
import { replacePlaceholders } from '@/lib/template-engine'

const CATEGORIES = ['all', 'minimal', 'professional', 'creative', 'corporate', 'food', 'beauty', 'fitness', 'local']

// ─── Skeleton ────────────────────────────────────────────────────────────────
function TemplateSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden ring-1 ring-gray-100 animate-pulse">
      <div className="bg-gray-200" style={{ aspectRatio: '1.75' }} />
      <div className="bg-white p-3 space-y-1.5">
        <div className="h-3 bg-gray-200 rounded-full w-3/4" />
        <div className="h-2 bg-gray-100 rounded-full w-1/2" />
      </div>
    </div>
  )
}

// ─── Iframe helper (reused from TemplateCard) ─────────────────────────────────
function buildPreviewDoc(html: string, css: string, layout: Record<string, any>, formData?: Record<string, any>, isFront = true): string {
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const font = layout.fontFamily || 'Inter'
  const accent = layout.accent || '#fbbf24'
  const data = {
    name: formData?.name || 'Rani Sharma',
    businessName: formData?.businessName || 'Sharma Enterprises',
    phone: formData?.phone || '+91 98765 43210',
    email: formData?.email || 'rani@sharma.com',
    address: formData?.address || '123 MG Road, Mumbai 400001',
    website: formData?.website || 'www.sharma.com',
    tagline: formData?.tagline || 'Your Trusted Partner',
    logoUrl: formData?.logoUrl || '',
    qrCodeUrl: formData?.qrCodeUrl || '',
  }
  const filled = replacePlaceholders(html, data)

  const hasLogoSlot = html.includes('{{logoUrl}}') || html.includes('logoUrl')
  const logoUrl = formData?.logoUrl || ''
  const logoOverlay = (logoUrl && !hasLogoSlot)
    ? isFront
      ? `<img src="${logoUrl}" alt="Logo" style="position:fixed;top:10px;right:10px;width:36px;height:36px;object-fit:contain;border-radius:6px;background:rgba(255,255,255,0.15);padding:2px;z-index:100;" />`
      : `<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:100;"><img src="${logoUrl}" alt="Logo" style="width:56px;height:56px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,0.15);padding:3px;" /></div>`
    : ''

  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;font-family:'${font}',sans-serif;overflow:hidden;}
:root{--bg:${bg};--primary:${primary};--font:'${font}',sans-serif;--accent:${accent};}
${css || ''}
</style></head><body>${filled}${logoOverlay}</body></html>`
}

function ModalIframe({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const doc = ref.current.contentDocument
    if (doc) { doc.open(); doc.write(html); doc.close() }
  }, [html])
  return (
    <iframe
      ref={ref}
      title={title}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      sandbox="allow-same-origin"
    />
  )
}

// ─── Category badge colours ───────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  minimal: 'bg-slate-100 text-slate-600',
  professional: 'bg-blue-50 text-blue-600',
  creative: 'bg-purple-50 text-purple-600',
  corporate: 'bg-indigo-50 text-indigo-600',
  food: 'bg-orange-50 text-orange-600',
  beauty: 'bg-pink-50 text-pink-600',
  fitness: 'bg-red-50 text-red-600',
  local: 'bg-green-50 text-green-600',
}

// ─── Premium Preview Modal ────────────────────────────────────────────────────
function PreviewModal({ template, formData, onClose, onSelect }: {
  template: Template
  formData: Record<string, any>
  onClose: () => void
  onSelect: () => void
}) {
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [flipping, setFlipping] = useState(false)
  const layout = template.layoutConfig || {}

  const hasFront = !!template.frontHTML
  const hasBack = !!template.backHTML

  const frontDoc = hasFront ? buildPreviewDoc(template.frontHTML!, template.frontCSS || '', layout, formData, true) : null
  const backDoc = hasBack ? buildPreviewDoc(template.backHTML!, template.backCSS || '', layout, formData, false) : null

  // Accent colour from layoutConfig for the detail panel
  const accent = layout.accent || '#2563eb'
  const bg = layout.background || '#1d4ed8'
  const categoryColor = CATEGORY_COLORS[template.category] || 'bg-gray-100 text-gray-600'

  const flip = (target: 'front' | 'back') => {
    if (target === side) return
    setFlipping(true)
    setTimeout(() => { setSide(target); setFlipping(false) }, 220)
  }

  // Sample contact rows for the right panel
  const contactRows = [
    { icon: Phone, label: formData?.phone || '+91 98765 43210' },
    { icon: Mail, label: formData?.email || 'rani@sharma.com' },
    { icon: Globe, label: formData?.website || 'www.sharma.com' },
    { icon: MapPin, label: formData?.address || '123 MG Road, Mumbai' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,10,20,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="relative w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxWidth: '860px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex flex-col md:flex-row">

          {/* ══ LEFT — Card stage ══════════════════════════════════════════════ */}
          <div
            className="flex-1 flex flex-col items-center justify-center gap-5 p-8 md:p-10 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, #f8faff 0%, #eef2ff 100%)', minHeight: '340px' }}
          >
            {/* Floating label */}
            <div className="flex items-center gap-2 self-start">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColor}`}>
                {template.category}
              </span>
              {template.isPremium && (
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  <Crown className="w-3 h-3" /> PRO
                </span>
              )}
            </div>

            {/* Card mockup with 3D flip */}
            <div style={{ perspective: '900px', width: '100%', maxWidth: '400px' }}>
              <motion.div
                animate={{ rotateY: flipping ? 90 : 0 }}
                transition={{ duration: 0.22, ease: 'easeIn' }}
                style={{ width: '100%', transformStyle: 'preserve-3d' }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    aspectRatio: '1.75',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                  }}
                >
                  {/* Front */}
                  <div style={{ position: 'absolute', inset: 0, opacity: side === 'front' ? 1 : 0, transition: 'opacity 0.15s' }}>
                    {frontDoc
                      ? <ModalIframe html={frontDoc} title="front" />
                      : (
                        <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ color: layout.primaryColor || '#fff', fontSize: 14, opacity: 0.6 }}>Front preview</span>
                        </div>
                      )
                    }
                  </div>
                  {/* Back */}
                  {hasBack && (
                    <div style={{ position: 'absolute', inset: 0, opacity: side === 'back' ? 1 : 0, transition: 'opacity 0.15s' }}>
                      <ModalIframe html={backDoc!} title="back" />
                    </div>
                  )}

                  {/* Shine overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)' }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Front / Back toggle */}
            <div className="flex items-center gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
              {(['front', 'back'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => flip(s)}
                  disabled={s === 'back' && !hasBack}
                  className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all capitalize disabled:opacity-30 disabled:cursor-not-allowed ${
                    side === s
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {s}
                </button>
              ))}
              {hasBack && (
                <button
                  onClick={() => flip(side === 'front' ? 'back' : 'front')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors ml-0.5"
                  title="Flip"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* ══ RIGHT — Details panel ══════════════════════════════════════════ */}
          <div className="w-full md:w-72 flex flex-col p-7 border-t md:border-t-0 md:border-l border-gray-100">

            {/* Template name + tagline */}
            <div className="mb-5">
              <h2 className="text-lg font-bold text-gray-900 leading-tight">{template.name}</h2>
              <p className="text-xs text-gray-400 mt-1 capitalize">{template.category} · Business Card</p>
            </div>

            {/* Colour swatch */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Colour Theme</p>
              <div className="flex items-center gap-2">
                {/* Primary bg swatch */}
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-md ring-2 ring-blue-500"
                  style={{ background: bg.includes('gradient') ? bg : bg }}
                  title="Background"
                />
                {/* Accent swatch */}
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ background: accent }}
                  title="Accent"
                />
                {/* Text swatch */}
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ background: layout.primaryColor || '#ffffff', outline: '1px solid #e5e7eb' }}
                  title="Text"
                />
              </div>
            </div>

            {/* Contact preview rows */}
            <div className="mb-6 space-y-2.5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Card Details</p>
              {/* Name + business */}
              <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-sm font-bold text-gray-900 leading-tight">{formData?.businessName || 'Sharma Enterprises'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formData?.name || 'Rani Sharma'}</p>
              </div>
              {/* Contact rows */}
              {contactRows.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2.5 px-1">
                  <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3 h-3 text-blue-500" />
                  </div>
                  <span className="text-xs text-gray-600 truncate">{label}</span>
                </div>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* CTA buttons */}
            <div className="space-y-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSelect}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-lg shadow-blue-200"
              >
                <Pencil className="w-4 h-4" />
                Use This Template
              </motion.button>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Browse More
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}

export default function TemplatesPage() {
  const router = useRouter()

  const [templates, setTemplates] = useState<Template[]>([])
  const [filtered, setFiltered] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Form data passed via URL or sessionStorage
  const [formData, setFormData] = useState<Record<string, any>>({})

  useEffect(() => {
    // Templates are public — no auth required
    // Load form data from sessionStorage if available
    try {
      const saved = sessionStorage.getItem('qc_form_data')
      if (saved) setFormData(JSON.parse(saved))
    } catch {}

    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setLoading(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
      const res = await fetch(`${apiUrl}/templates?limit=20`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const raw = json.data
      const list: Template[] = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.data)
          ? raw.data
          : []
      setTemplates(list)
      setFiltered(list)
    } catch (e: any) {
      // Silent fail — don't show toast on load, just log
      console.error('Templates load error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter logic
  useEffect(() => {
    let result = [...templates]
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory)
    }
    if (search.trim()) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFiltered(result)
  }, [activeCategory, search, templates])

  const handleContinue = async () => {
    if (!selectedTemplate) return toast.error('Please select a template first')

    const hasFormData = formData &&
      formData.name?.trim() &&
      formData.businessName?.trim() &&
      formData.phone?.trim() &&
      formData.email?.trim()

    if (!hasFormData) {
      // No valid form data — save template and go fill the form
      sessionStorage.setItem('qc_selected_template', JSON.stringify(selectedTemplate))
      router.push('/create')
      return
    }

    // Check login before creating card
    const token = localStorage.getItem('accessToken')
    if (!token) {
      sessionStorage.setItem('qc_selected_template', JSON.stringify(selectedTemplate))
      toast.error('Please login to create your card')
      router.push('/login')
      return
    }

    // Has form data — create card directly
    setSubmitting(true)
    try {
      // Sanitize formData — only send fields the DTO accepts, with correct types
      const payload = {
        name: formData.name || '',
        businessName: formData.businessName || '',
        phone: formData.phone || '',
        email: formData.email || '',
        templateId: selectedTemplate._id,
        ...(formData.address && { address: formData.address }),
        ...(formData.website && { website: formData.website }),
        ...(formData.tagline && { tagline: formData.tagline }),
        qrEnabled: formData.qrEnabled === true || formData.qrEnabled === 'true',
        themeMode: formData.themeMode || 'light',
      }

      // Validate required fields before sending
      if (!payload.name.trim()) { setSubmitting(false); return toast.error('Name is required') }
      if (!payload.businessName.trim()) { setSubmitting(false); return toast.error('Business name is required') }
      if (!payload.phone.trim()) { setSubmitting(false); return toast.error('Phone is required') }
      if (!payload.email.trim()) { setSubmitting(false); return toast.error('Email is required') }

      const { data } = await api.post('/card/create', payload)
      sessionStorage.removeItem('qc_form_data')
      toast.success('🎉 Card created!')
      router.push(`/editor?cardId=${data.data._id}&templateId=${selectedTemplate._id}`)
    } catch (e: any) {
      const status = e.response?.status
      const msg = e.response?.data?.message

      if (status === 401 || !e.response) {
        // Token expired or network error — save state and redirect to login
        sessionStorage.setItem('qc_selected_template', JSON.stringify(selectedTemplate))
        toast.error('Session expired. Please login again.')
        router.push('/login')
        return
      }

      if (Array.isArray(msg)) {
        toast.error(msg[0])
      } else {
        toast.error(msg || 'Failed to create card. Please try again.')
      }
      console.error('Card create error:', e.response?.data || e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSelectFromModal = (template: Template) => {
    setSelectedTemplate(template)
    setPreviewTemplate(null)
    toast.success(`"${template.name}" selected!`, { icon: '✓' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link href="/create" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to form
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Card Template</h1>
          <p className="text-gray-500">Select a design that matches your brand</p>
        </motion.div>

        {/* ── Search + Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Search templates..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Result count */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-2xl px-4 py-3">
            <LayoutGrid className="w-4 h-4" />
            <span>{filtered.length} templates</span>
          </div>
        </motion.div>

        {/* ── Category Pills ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide"
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {cat === 'all' ? '✦ All' : cat}
            </button>
          ))}
        </motion.div>

        {/* ── Template Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <TemplateSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <p className="text-gray-500 font-medium">No templates found</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }} className="mt-3 text-blue-600 text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((template, i) => (
                <motion.div
                  key={template._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <TemplateCard
                    template={template}
                    selected={selectedTemplate?._id === template._id}
                    onSelect={t => {
                      setSelectedTemplate(t)
                      toast.success(`"${t.name}" selected!`, { icon: '✓', duration: 1500 })
                    }}
                    onPreview={t => setPreviewTemplate(t)}
                    formData={formData}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── Fixed Bottom Bar ── */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-2xl"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Selected info */}
          <div className="flex items-center gap-3 min-w-0">
            {selectedTemplate ? (
              <>
                <div
                  className="w-10 h-6 rounded-lg flex-shrink-0"
                  style={{ background: selectedTemplate.layoutConfig?.background || '#1d4ed8' }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedTemplate.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{selectedTemplate.category}</p>
                </div>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">← Select a template to continue</p>
            )}
          </div>

          {/* Continue button */}
          <motion.button
            whileHover={selectedTemplate ? { scale: 1.02 } : {}}
            whileTap={selectedTemplate ? { scale: 0.98 } : {}}
            onClick={handleContinue}
            disabled={!selectedTemplate || submitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-sm transition-all flex-shrink-0 ${
              selectedTemplate
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
            ) : (
              <>{formData?.name?.trim() && formData?.businessName?.trim() && formData?.phone?.trim() && formData?.email?.trim() ? 'Create Card' : 'Continue'} <ChevronRight className="w-4 h-4" /></>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            formData={formData}
            onClose={() => setPreviewTemplate(null)}
            onSelect={() => handleSelectFromModal(previewTemplate)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
