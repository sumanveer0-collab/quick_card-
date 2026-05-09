'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import {
  ArrowLeft, Loader2, Sparkles, ChevronRight,
  Phone, Mail, Globe, MapPin, User, Building2,
  MessageSquare, QrCode, Check, Crown, RotateCcw,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import { replacePlaceholders } from '@/lib/template-engine'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Template {
  _id: string
  name: string
  category: string
  isPremium?: boolean
  layoutConfig: Record<string, any>
  frontHTML?: string
  backHTML?: string
  frontCSS?: string
  backCSS?: string
}

interface FormData {
  name: string
  businessName: string
  phone: string
  email: string
  address: string
  website: string
  tagline: string
  qrEnabled: boolean
}

// ─── Iframe preview helper ────────────────────────────────────────────────────
function buildDoc(html: string, css: string, layout: Record<string, any>, data: Partial<FormData>, isFront = true): string {
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const font = layout.fontFamily || 'Inter'
  const accent = layout.accent || '#fbbf24'
  const filled = replacePlaceholders(html, {
    name: data.name || 'Your Name',
    businessName: data.businessName || 'Business Name',
    phone: data.phone || '+91 9876543210',
    email: data.email || 'you@example.com',
    address: data.address || '123 Main Street, City',
    website: data.website || 'www.yoursite.com',
    tagline: data.tagline || 'Your Tagline',
    logoUrl: '',
    qrCodeUrl: '',
  })

  const hasLogoSlot = html.includes('{{logoUrl}}') || html.includes('logoUrl')
  const logoOverlay = ''  // create page doesn't have logo upload yet

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

function PreviewIframe({ html, title }: { html: string; title: string }) {
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

// ─── Fallback card (no HTML) ──────────────────────────────────────────────────
function FallbackPreview({ layout, data }: { layout: Record<string, any>; data: Partial<FormData> }) {
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const secondary = layout.secondaryColor || 'rgba(255,255,255,0.7)'
  return (
    <div style={{ width: '100%', height: '100%', background: bg, fontFamily: layout.fontFamily || 'Inter', padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: primary, opacity: 0.08 }} />
      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: primary, opacity: 0.08 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: layout.accent || '#fbbf24' }} />
      <div>
        <p style={{ fontSize: '16px', fontWeight: 800, color: primary, lineHeight: 1.2 }}>{data.businessName || 'Business Name'}</p>
        {data.tagline && <p style={{ fontSize: '9px', color: primary, opacity: 0.7, marginTop: '3px', fontStyle: 'italic' }}>{data.tagline}</p>}
        <p style={{ fontSize: '11px', fontWeight: 600, color: secondary, marginTop: '10px' }}>{data.name || 'Your Name'}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {data.phone && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>📞 {data.phone}</p>}
        {data.email && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>✉ {data.email}</p>}
        {data.website && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>🌐 {data.website}</p>}
        {data.address && <p style={{ fontSize: '9px', color: primary, opacity: 0.85, whiteSpace: 'normal', wordBreak: 'break-word' }}>📍 {data.address}</p>}
      </div>
      <div style={{ position: 'absolute', bottom: '6px', right: '10px', fontSize: '7px', color: primary, opacity: 0.25 }}>Made with QuickCard</div>
    </div>
  )
}

// ─── Input field wrapper ──────────────────────────────────────────────────────
function Field({ icon: Icon, label, required, error, children }: {
  icon: React.ElementType
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 block">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const inputCls = 'w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all'

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CreateCardPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [flipping, setFlipping] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { qrEnabled: false },
  })
  const formValues = watch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    loadTemplates()
    try {
      const saved = sessionStorage.getItem('qc_selected_template')
      if (saved) setSelectedTemplate(JSON.parse(saved))
    } catch {}
  }, [])

  const loadTemplates = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
      const res = await fetch(`${apiUrl}/templates?limit=20`)
      if (!res.ok) throw new Error()
      const json = await res.json()
      const raw = json.data
      const list: Template[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []
      setTemplates(list)
      if (list.length > 0) {
        setSelectedTemplate(prev => prev ?? list[0])
      }
    } catch { /* silent */ }
    finally { setLoadingTemplates(false) }
  }

  const onSubmit = (data: FormData) => {
    sessionStorage.setItem('qc_form_data', JSON.stringify(data))
    if (selectedTemplate) sessionStorage.setItem('qc_selected_template', JSON.stringify(selectedTemplate))
    router.push('/templates')
  }

  const flip = (target: 'front' | 'back') => {
    if (target === side) return
    setFlipping(true)
    setTimeout(() => { setSide(target); setFlipping(false) }, 200)
  }

  const layout = selectedTemplate?.layoutConfig || {}
  const hasFront = !!selectedTemplate?.frontHTML
  const hasBack = !!selectedTemplate?.backHTML

  const frontDoc = hasFront
    ? buildDoc(selectedTemplate!.frontHTML!, selectedTemplate!.frontCSS || '', layout, formValues)
    : null
  const backDoc = hasBack
    ? buildDoc(selectedTemplate!.backHTML!, selectedTemplate!.backCSS || '', layout, formValues)
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Business Card</h1>
            <p className="text-gray-500 text-sm mt-0.5">Fill in your details and pick a template</p>
          </div>
          <Link
            href="/ai"
            className="ml-auto flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-2xl transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Use AI
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ══ LEFT — Form ══════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Form panel */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Card Information</p>

                {/* Name + Business */}
                <div className="grid grid-cols-2 gap-3">
                  <Field icon={User} label="Your Name" required error={errors.name?.message}>
                    <input className={inputCls} placeholder="Rani Sharma" {...register('name', { required: 'Required' })} />
                  </Field>
                  <Field icon={Building2} label="Business Name" required error={errors.businessName?.message}>
                    <input className={inputCls} placeholder="Sharma Enterprises" {...register('businessName', { required: 'Required' })} />
                  </Field>
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <Field icon={Phone} label="Phone" required error={errors.phone?.message}>
                    <input className={inputCls} placeholder="+91 9876543210" {...register('phone', { required: 'Required' })} />
                  </Field>
                  <Field icon={Mail} label="Email" required error={errors.email?.message}>
                    <input className={inputCls} type="email" placeholder="you@example.com" {...register('email', { required: 'Required' })} />
                  </Field>
                </div>

                {/* Tagline */}
                <Field icon={MessageSquare} label="Tagline">
                  <input className={inputCls} placeholder="Your Trusted Partner" {...register('tagline')} />
                </Field>

                {/* Address */}
                <Field icon={MapPin} label="Address">
                  <input className={inputCls} placeholder="123 MG Road, Mumbai 400001" {...register('address')} />
                </Field>

                {/* Website */}
                <Field icon={Globe} label="Website">
                  <input className={inputCls} placeholder="www.yoursite.com" {...register('website')} />
                </Field>

                {/* QR toggle */}
                <label className="flex items-center gap-3 p-3.5 bg-blue-50 hover:bg-blue-100 rounded-2xl cursor-pointer transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" {...register('qrEnabled')} />
                  <QrCode className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-700">Add QR Code (WhatsApp / Share link)</span>
                </label>
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-200"
              >
                Choose Template <ChevronRight className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>

          {/* ══ RIGHT — Preview + Template strip ═════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 }}
            className="space-y-4"
          >
            {/* ── Live Preview stage (same as editor + templates modal) ── */}
            <div
              className="rounded-3xl overflow-hidden border border-indigo-100 shadow-sm"
              style={{ background: 'linear-gradient(145deg, #f8faff 0%, #eef2ff 100%)' }}
            >
              {/* Stage header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Live Preview</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Updates as you type</p>
                </div>
                {selectedTemplate && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/80 text-gray-600 border border-gray-200 capitalize">
                      {selectedTemplate.category}
                    </span>
                    {selectedTemplate.isPremium && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                        <Crown className="w-3 h-3" /> PRO
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card mockup */}
              <div className="flex flex-col items-center gap-4 px-6 pb-7 pt-3 w-full overflow-hidden">
                <div style={{ perspective: '900px', width: '100%', maxWidth: '420px' }}>
                  <motion.div
                    animate={{ rotateY: flipping ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeIn' }}
                    style={{ width: '100%', transformStyle: 'preserve-3d' }}
                  >
                    <div
                      className="relative rounded-2xl overflow-hidden"
                      style={{
                        aspectRatio: '1.75',
                        boxShadow: '0 20px 56px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.06)',
                      }}
                    >
                      {/* Front */}
                      <div style={{ position: 'absolute', inset: 0, opacity: side === 'front' ? 1 : 0, transition: 'opacity 0.15s' }}>
                        {frontDoc
                          ? <PreviewIframe html={frontDoc} title="front" />
                          : <FallbackPreview layout={layout} data={formValues} />
                        }
                      </div>
                      {/* Back */}
                      {hasBack && (
                        <div style={{ position: 'absolute', inset: 0, opacity: side === 'back' ? 1 : 0, transition: 'opacity 0.15s' }}>
                          <PreviewIframe html={backDoc!} title="back" />
                        </div>
                      )}
                      {/* Shine */}
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)' }} />
                    </div>
                  </motion.div>
                </div>

                {/* Front / Back toggle */}
                <div className="flex items-center gap-1 bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
                  {(['front', 'back'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
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
                      type="button"
                      onClick={() => flip(side === 'front' ? 'back' : 'front')}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors ml-0.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ── Template strip ── */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Templates
                  {templates.length > 0 && <span className="ml-1.5 text-gray-300">({templates.length})</span>}
                </p>
                <Link
                  href="/templates"
                  onClick={() => {
                    try { sessionStorage.setItem('qc_form_data', JSON.stringify(watch())) } catch {}
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  View all →
                </Link>
              </div>

              {loadingTemplates ? (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-24 rounded-xl overflow-hidden animate-pulse">
                      <div className="bg-gray-200 h-14" />
                      <div className="bg-white p-1.5"><div className="h-2 bg-gray-200 rounded w-3/4" /></div>
                    </div>
                  ))}
                </div>
              ) : templates.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-4">No templates loaded</p>
              ) : (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
                  {templates.map(t => {
                    const isSelected = selectedTemplate?._id === t._id
                    const tBg = t.layoutConfig?.background || '#1d4ed8'
                    return (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => { setSelectedTemplate(t); setSide('front') }}
                        className={`relative flex-shrink-0 w-24 rounded-xl overflow-hidden border-2 transition-all ${
                          isSelected
                            ? 'border-blue-600 shadow-md shadow-blue-100'
                            : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        {/* Mini card preview */}
                        <div className="h-14 relative" style={{ background: tBg }}>
                          <div className="p-1.5">
                            <div className="h-1.5 w-10 rounded-full mb-1" style={{ background: t.layoutConfig?.primaryColor || '#fff', opacity: 0.9 }} />
                            <div className="h-1 w-7 rounded-full" style={{ background: t.layoutConfig?.primaryColor || '#fff', opacity: 0.5 }} />
                          </div>
                          {/* Selected check */}
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                            </div>
                          )}
                          {/* PRO badge */}
                          {t.isPremium && (
                            <div className="absolute top-1 left-1 bg-amber-400 text-amber-900 text-[7px] font-bold px-1 py-0.5 rounded-full leading-none">PRO</div>
                          )}
                        </div>
                        <p className="text-[9px] text-center py-1.5 text-gray-600 font-medium truncate px-1 bg-white">{t.name}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
