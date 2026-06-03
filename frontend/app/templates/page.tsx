'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Search, Heart, Crown, Loader2, Upload,
  Check, X, ChevronRight, Pencil,
  RotateCcw, SlidersHorizontal,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Template } from '@/components/TemplateCard'
import api from '@/lib/api'
import { replacePlaceholders } from '@/lib/template-engine'
import Image from 'next/image'

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function TemplateSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden ring-1 ring-gray-200 animate-pulse bg-white">
      <div className="bg-gray-200" style={{ aspectRatio: '1.75' }} />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-2 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  )
}

// ─── Iframe helper ────────────────────────────────────────────────────────────
function buildPreviewDoc(html: string, css: string, layout: Record<string, any>, formData?: Record<string, any>, isFront = true): string {
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const font = layout.fontFamily || 'Inter'
  const accent = layout.accent || '#fbbf24'
  const data = {
    name: formData?.name || 'Your Name',
    businessName: formData?.businessName || 'Business Name',
    phone: formData?.phone || '+91 98765 43210',
    email: formData?.email || 'you@example.com',
    address: formData?.address || '123 MG Road, Mumbai',
    website: formData?.website || 'www.yoursite.com',
    tagline: formData?.tagline || 'Your Tagline Here',
    logoUrl: formData?.logoUrl || '',
    qrCodeUrl: formData?.qrCodeUrl || '',
  }
  const filled = replacePlaceholders(html, data)
  const hasLogoSlot = html.includes('{{logoUrl}}') || html.includes('logoUrl')
  const logoUrl = formData?.logoUrl || ''
  const logoOverlay = (logoUrl && !hasLogoSlot)
    ? isFront
      ? `<img src="${logoUrl}" alt="Logo" style="position:fixed;top:8px;right:8px;width:28px;height:28px;object-fit:contain;border-radius:4px;z-index:100;" />`
      : `<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:100;"><img src="${logoUrl}" alt="Logo" style="width:44px;height:44px;object-fit:contain;border-radius:6px;" /></div>`
    : ''
  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>*{box-sizing:border-box;margin:0;padding:0;}html,body{width:100%;height:100%;font-family:'${font}',sans-serif;overflow:hidden;}:root{--bg:${bg};--primary:${primary};--font:'${font}',sans-serif;--accent:${accent};}${css || ''}</style>
</head><body>${filled}${logoOverlay}</body></html>`
}

function ModalIframe({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const doc = ref.current.contentDocument
    if (doc) { doc.open(); doc.write(html); doc.close() }
  }, [html])
  return <iframe ref={ref} title={title} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} sandbox="allow-same-origin" />
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
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
  const bg = layout.background || '#1d4ed8'

  const flip = (target: 'front' | 'back') => {
    if (target === side) return
    setFlipping(true)
    setTimeout(() => { setSide(target); setFlipping(false) }, 220)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
        className="relative w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxWidth: '820px' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
          <X className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 bg-gradient-to-br from-gray-50 to-gray-100" style={{ minHeight: 320 }}>
            <div style={{ perspective: '900px', width: '100%', maxWidth: 400 }}>
              <motion.div animate={{ rotateY: flipping ? 90 : 0 }} transition={{ duration: 0.22 }} style={{ width: '100%', transformStyle: 'preserve-3d' }}>
                <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1.75', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                  <div style={{ position: 'absolute', inset: 0, opacity: side === 'front' ? 1 : 0, transition: 'opacity 0.15s' }}>
                    {frontDoc ? <ModalIframe html={frontDoc} title="front" /> : <div style={{ width: '100%', height: '100%', background: bg }} />}
                  </div>
                  {hasBack && (
                    <div style={{ position: 'absolute', inset: 0, opacity: side === 'back' ? 1 : 0, transition: 'opacity 0.15s' }}>
                      <ModalIframe html={backDoc!} title="back" />
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
              {(['front', 'back'] as const).map(s => (
                <button key={s} onClick={() => flip(s)} disabled={s === 'back' && !hasBack}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold capitalize disabled:opacity-30 ${side === s ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                  {s}
                </button>
              ))}
              {hasBack && <button onClick={() => flip(side === 'front' ? 'back' : 'front')} className="p-2 hover:bg-gray-100 rounded-lg"><RotateCcw className="w-3.5 h-3.5 text-gray-400" /></button>}
            </div>
          </div>
          <div className="w-full md:w-64 flex flex-col p-6 border-t md:border-t-0 md:border-l border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h2>
            <p className="text-xs text-gray-400 capitalize mb-5">{template.category} · Business Card</p>
            <div className="flex-1" />
            <div className="space-y-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={onSelect}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-200">
                <Pencil className="w-4 h-4" /> Use This Template
              </motion.button>
              <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50">Browse More</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Card Thumbnail Component ─────────────────────────────────────────────────
function CardThumbnail({ template, onSelect, isFavorite, onFavorite }: {
  template: Template
  onSelect: (t: Template) => void
  isFavorite: boolean
  onFavorite: (id: string) => void
}) {
  const [imgError, setImgError] = useState(false)
  const layout = template.layoutConfig || {}
  const bg = layout.background || '#1d4ed8'

  const thumbnailUrl = template.thumbnailUrl || `/templates/thumbnails/${template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.jpg`

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(template)}
    >
      {/* Heart / Favorite */}
      <button
        className="absolute top-2.5 right-2.5 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow transition-all"
        onClick={e => { e.stopPropagation(); onFavorite(template._id) }}
        title="Favorite"
      >
        <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
      </button>

      {/* FREE badge */}
      {!template.isPremium && (
        <div className="absolute top-2.5 left-2.5 z-20 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
          FREE
        </div>
      )}
      {/* PRO badge */}
      {template.isPremium && (
        <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-0.5 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded">
          <Crown className="w-2.5 h-2.5" /> PRO
        </div>
      )}

      {/* Card Preview Area — full card, no footer text */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1.75' }}>
        {!imgError ? (
          <Image
            src={thumbnailUrl}
            alt={template.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: bg }}>
            <span className="text-white/60 text-xs">{template.name}</span>
          </div>
        )}

        {/* Subtle hover tint — no buttons */}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors duration-200 pointer-events-none" />
      </div>
    </div>
  )
}

// ─── Upload Logo Card ─────────────────────────────────────────────────────────
function UploadLogoCard({ onUpload }: { onUpload: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 text-center p-4"
      style={{ aspectRatio: '1.6' }}
      onClick={() => fileRef.current?.click()}
    >
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
        const file = e.target.files?.[0]
        if (file) {
          const url = URL.createObjectURL(file)
          onUpload(url)
          toast.success('Logo uploaded!')
        }
      }} />
      <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
        <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-700">Upload your logo</p>
        <p className="text-[10px] text-gray-400 mt-0.5">Drop your file here or <span className="text-blue-500">click to upload</span></p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TemplatesPage() {
  const router = useRouter()

  const [templates, setTemplates] = useState<Template[]>([])
  const [filtered, setFiltered] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [keyword, setKeyword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
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
      const res = await fetch(`${apiUrl}/templates?limit=50`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      const raw = json.data
      const list: Template[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []
      setTemplates(list)
      setFiltered(list)
    } catch (e: any) {
      console.error('Templates load error:', e.message)
    } finally {
      setLoading(false)
    }
  }

  // Search / filter
  const handleSearch = () => {
    let result = [...templates]
    if (businessName.trim()) {
      result = result.filter(t => t.name.toLowerCase().includes(businessName.toLowerCase()) || t.category.toLowerCase().includes(businessName.toLowerCase()))
    }
    if (keyword.trim()) {
      result = result.filter(t => t.name.toLowerCase().includes(keyword.toLowerCase()) || t.category.toLowerCase().includes(keyword.toLowerCase()))
    }
    setFiltered(result)
  }

  useEffect(() => { handleSearch() }, [businessName, keyword, templates])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSelect = (template: Template) => {
    setSelectedTemplate(template)
    setPreviewTemplate(null)
    toast.success(`"${template.name}" selected!`, { icon: '✓', duration: 1500 })
  }

  const handleContinue = async () => {
    if (!selectedTemplate) return toast.error('Please select a template first')
    const hasFormData = formData?.name?.trim() && formData?.businessName?.trim() && formData?.phone?.trim() && formData?.email?.trim()
    if (!hasFormData) {
      sessionStorage.setItem('qc_selected_template', JSON.stringify(selectedTemplate))
      router.push('/create')
      return
    }
    const token = localStorage.getItem('accessToken')
    if (!token) {
      sessionStorage.setItem('qc_selected_template', JSON.stringify(selectedTemplate))
      toast.error('Please login to create your card')
      router.push('/login')
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        name: formData.name || '', businessName: formData.businessName || '',
        phone: formData.phone || '', email: formData.email || '',
        templateId: selectedTemplate._id,
        ...(formData.address && { address: formData.address }),
        ...(formData.website && { website: formData.website }),
        ...(formData.tagline && { tagline: formData.tagline }),
        qrEnabled: formData.qrEnabled === true || formData.qrEnabled === 'true',
        themeMode: formData.themeMode || 'light',
      }
      const { data } = await api.post('/card/create', payload)
      sessionStorage.removeItem('qc_form_data')
      toast.success('🎉 Card created!')
      router.push(`/editor?cardId=${data.data._id}&templateId=${selectedTemplate._id}`)
    } catch (e: any) {
      const status = e.response?.status
      const msg = e.response?.data?.message
      if (status === 401 || !e.response) { router.push('/login'); return }
      toast.error(Array.isArray(msg) ? msg[0] : msg || 'Failed to create card')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero / Header Section (Dark) ── */}
      <div style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' }} className="py-14 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          Business Card Templates
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-300 text-base md:text-lg max-w-xl mx-auto leading-relaxed"
        >
          Discover beautiful business cards instantly. Browse business card templates tailored for
          you and create a business card you love in seconds. Start for free!
        </motion.p>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 items-center">
          {/* Business name */}
          <div className="flex items-center gap-0 border border-gray-300 rounded-lg overflow-hidden flex-1 bg-white hover:border-gray-400 transition-colors">
            <span className="px-3 py-2.5 text-xs font-semibold text-gray-500 border-r border-gray-200 bg-gray-50 whitespace-nowrap">Business name</span>
            <input
              className="flex-1 px-3 py-2.5 text-sm text-gray-700 focus:outline-none bg-transparent"
              placeholder="Enter your business name"
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
            />
          </div>

          {/* Keywords */}
          <div className="flex items-center gap-0 border border-gray-300 rounded-lg overflow-hidden flex-1 bg-white hover:border-gray-400 transition-colors">
            <span className="px-3 py-2.5 text-xs font-semibold text-gray-500 border-r border-gray-200 bg-gray-50 whitespace-nowrap">Keywords</span>
            <input
              className="flex-1 px-3 py-2.5 text-sm text-gray-700 focus:outline-none bg-transparent"
              placeholder="Search by keyword"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>

          {/* Search btn */}
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-md shadow-blue-200"
          >
            <Search className="w-4 h-4" /> Search
          </button>

          {/* More filters */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> More
          </button>
        </div>

        {/* More filters panel */}
        {showMore && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            <div className="flex flex-wrap gap-2">
              {['minimal', 'professional', 'creative', 'corporate', 'food', 'beauty', 'fitness', 'local'].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setKeyword(cat); setShowMore(false) }}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 capitalize transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Template Grid ── */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-28">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <TemplateSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Upload logo card — first slot */}
            <UploadLogoCard onUpload={url => setFormData(prev => ({ ...prev, logoUrl: url }))} />

            {/* Template cards */}
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-gray-500 font-medium">No templates found</p>
                <button onClick={() => { setBusinessName(''); setKeyword('') }} className="mt-3 text-blue-600 text-sm hover:underline">
                  Clear search
                </button>
              </div>
            ) : (
              filtered.map(template => (
                <CardThumbnail
                  key={template._id}
                  template={template}
                  onSelect={t => {
                    handleSelect(t)
                    router.push(`/customize?templateId=${t._id}`)
                  }}
                  isFavorite={favorites.has(template._id)}
                  onFavorite={toggleFavorite}
                />
              ))
            )}
          </div>
        )}

        {/* Results count */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-sm text-gray-400 mt-8">
            Showing <span className="font-semibold text-gray-600">{filtered.length}</span> business card templates
          </p>
        )}
      </div>

      {/* ── Fixed Bottom Bar (only when template selected) ── */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl"
          >
            <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-6 rounded-lg flex-shrink-0" style={{ background: selectedTemplate.layoutConfig?.background || '#1d4ed8' }} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{selectedTemplate.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{selectedTemplate.category}</p>
                </div>
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                disabled={submitting}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-200"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <>Continue <ChevronRight className="w-4 h-4" /></>}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview Modal ── */}
      <AnimatePresence>
        {previewTemplate && (
          <PreviewModal
            template={previewTemplate}
            formData={formData}
            onClose={() => setPreviewTemplate(null)}
            onSelect={() => handleSelect(previewTemplate)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
