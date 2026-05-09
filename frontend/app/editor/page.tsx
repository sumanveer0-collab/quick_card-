'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Download, FileImage, FileText, Share2,
  MessageCircle, Copy, Loader2, Check, Save,
  Palette, Type, RefreshCw, Eye, Sparkles, Crown,
  Phone, Mail, Globe, MapPin, ImagePlus, X as XIcon,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import CardRenderer, { TemplateData } from '@/components/CardRenderer'
import api from '@/lib/api'
import { CardData } from '@/lib/template-engine'

const FONTS = ['Inter', 'Poppins', 'Montserrat', 'Playfair Display', 'Roboto', 'Lato', 'Raleway', 'Oswald']

const PRESET_COLORS = [
  '#1d4ed8', '#7c3aed', '#0f172a', '#14532d', '#92400e',
  '#be185d', '#0369a1', '#1a1a2e', '#ffffff', '#f8fafc',
]

interface GradientPickerProps {
  value: string
  onChange: (css: string) => void
}

function GradientPicker({ value, onChange }: GradientPickerProps) {
  const [color1, setColor1] = useState('#667eea')
  const [color2, setColor2] = useState('#764ba2')
  const [angle, setAngle] = useState(135)

  const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Color 1</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color1} onChange={e => setColor1(e.target.value)}
              className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 flex-shrink-0" />
            <span className="text-xs font-mono text-gray-500">{color1}</span>
          </div>
        </div>
        <div className="flex-1">
          <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Color 2</label>
          <div className="flex items-center gap-2">
            <input type="color" value={color2} onChange={e => setColor2(e.target.value)}
              className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 flex-shrink-0" />
            <span className="text-xs font-mono text-gray-500">{color2}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">
          Angle: {angle}°
        </label>
        <input type="range" min="0" max="360" value={angle}
          onChange={e => setAngle(Number(e.target.value))}
          className="w-full accent-blue-600" />
      </div>
      {/* Live preview swatch */}
      <div className="h-8 rounded-xl border border-gray-200" style={{ background: gradient }} />
      <button
        onClick={() => onChange(gradient)}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
      >
        Apply Gradient
      </button>
    </div>
  )
}

export default function CardEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const captureRef = useRef<HTMLDivElement>(null)

  const cardId = searchParams.get('cardId')
  const templateId = searchParams.get('templateId')

  const [template, setTemplate] = useState<TemplateData | null>(null)
  const [cardData, setCardData] = useState<CardData>({
    name: '', businessName: '', phone: '', email: '',
    address: '', website: '', tagline: '',
  })
  const [customLayout, setCustomLayout] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content')
  const [printQuality, setPrintQuality] = useState(false)
  const [sessionTemplates, setSessionTemplates] = useState<TemplateData[]>([])
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CardData, string>>>({})
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load card data
      if (cardId) {
        const { data: res } = await api.get('/card/list')
        const card = res.data?.find((c: any) => c._id === cardId)
        if (card) {
          setCardData({
            name: card.name || '',
            businessName: card.businessName || '',
            phone: card.phone || '',
            email: card.email || '',
            address: card.address || '',
            website: card.website || '',
            tagline: card.tagline || '',
            logoUrl: card.logoUrl || '',
            qrCodeUrl: card.qrCodeUrl || '',
            services: card.services || [],
          })
        }
      } else {
        // Load from sessionStorage
        try {
          const saved = sessionStorage.getItem('qc_form_data')
          if (saved) {
            const d = JSON.parse(saved)
            setCardData({
              name: d.name || '',
              businessName: d.businessName || '',
              phone: d.phone || '',
              email: d.email || '',
              address: d.address || '',
              website: d.website || '',
              tagline: d.tagline || '',
            })
          }
        } catch {}
      }

      // Load template
      const tid = templateId || (() => {
        try { return JSON.parse(sessionStorage.getItem('qc_selected_template') || '{}')._id } catch { return null }
      })()

      if (tid) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
        const res = await fetch(`${apiUrl}/templates/${tid}`)
        const json = await res.json()
        const t = json.data
        setTemplate(t)
        setCustomLayout({ ...t.layoutConfig })
      }
    } catch (e: any) {
      toast.error('Failed to load editor')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field: keyof CardData, value: string) => {
    setCardData(prev => ({ ...prev, [field]: value }))
    // Clear field error on change
    if (fieldErrors[field]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n })
    }
  }

  const handleStyleChange = (key: string, value: string) => {
    setCustomLayout(prev => ({ ...prev, [key]: value }))
  }

  // ── Logo upload (client-side base64 preview) ──────────────────────────────
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setCardData(prev => ({ ...prev, logoUrl: dataUrl }))
      toast.success('Logo added!')
    }
    reader.readAsDataURL(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleDuplicate = () => {
    if (!template) return
    const copy: TemplateData = {
      ...template,
      _id: `local_${Date.now()}`,
      name: `${template.name} (Copy)`,
      layoutConfig: { ...customLayout },
    }
    setSessionTemplates(prev => [...prev, copy])
    setTemplate(copy)
    setCustomLayout({ ...copy.layoutConfig })
    toast.success(`"${copy.name}" created`)
  }

  const mergedTemplate = template ? { ...template, layoutConfig: customLayout } : null

  // ── Save card ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!template) return toast.error('Please select a template first')

    // ── Client-side validation ────────────────────────────────────────────
    const required: Array<{ key: keyof CardData; label: string }> = [
      { key: 'businessName', label: 'Business Name' },
      { key: 'name',         label: 'Your Name' },
      { key: 'phone',        label: 'Phone' },
      { key: 'email',        label: 'Email' },
    ]
    const newErrors: Partial<Record<keyof CardData, string>> = {}
    for (const { key, label } of required) {
      if (!cardData[key]?.toString().trim()) {
        newErrors[key] = `${label} is required`
      }
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (cardData.email?.trim() && !emailRe.test(cardData.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors)
      setActiveTab('content')
      toast.error(Object.values(newErrors)[0], { duration: 4000 })
      return
    }
    setFieldErrors({})

    // Skip save if templateId is a local duplicate (not persisted to DB)
    if (template._id.startsWith('local_')) {
      toast.error('Duplicated templates cannot be saved. Choose a template from the library first.')
      return
    }

    setSaving(true)
    try {
      // Build a clean payload — omit empty optional strings and non-DTO fields
      const payload: Record<string, any> = {
        name:         cardData.name!.trim(),
        businessName: cardData.businessName!.trim(),
        phone:        cardData.phone!.trim(),
        email:        cardData.email!.trim().toLowerCase(),
        templateId:   template._id,
        qrEnabled:    false,
        themeMode:    'light',
      }
      if (cardData.tagline?.trim())  payload.tagline  = cardData.tagline.trim()
      if (cardData.address?.trim())  payload.address  = cardData.address.trim()
      if (cardData.website?.trim())  payload.website  = cardData.website.trim()
      // Only send logoUrl if it's a real URL (not a base64 data URL — those are too large for the API)
      if (cardData.logoUrl?.trim() && !cardData.logoUrl.startsWith('data:')) {
        payload.logoUrl = cardData.logoUrl.trim()
      }
      if (cardData.services?.length) payload.services = cardData.services

      if (cardId) {
        await api.put(`/card/update/${cardId}`, payload)
        toast.success('Card saved!')
      } else {
        const { data } = await api.post('/card/create', payload)
        sessionStorage.removeItem('qc_form_data')
        toast.success('Card created!')
        router.replace(`/editor?cardId=${data.data._id}&templateId=${template._id}`)
      }
    } catch (e: any) {
      const status  = e.response?.status
      const resData = e.response?.data

      if (status === 401) {
        toast.error('Session expired. Please login.')
        router.push('/login')
        return
      }

      // Show the most specific error available
      const errors: string[] = Array.isArray(resData?.errors) ? resData.errors : []
      const msg = errors[0] || resData?.message || 'Save failed. Please try again.'
      toast.error(msg, { duration: 5000 })

      // Log all errors for debugging
      if (errors.length > 1) {
        console.error('All validation errors:', errors)
      }
    } finally {
      setSaving(false)
    }
  }

  // ── Download PNG ──────────────────────────────────────────────────────────
  const downloadPng = async () => {
    if (!captureRef.current) return toast.error('Card not ready')
    setDownloading('png')
    try {
      const { toPng } = await import('html-to-image')
      const pixelRatio = printQuality ? 4 : 3
      const url = await toPng(captureRef.current, { quality: 1, pixelRatio, cacheBust: true })
      const a = document.createElement('a')
      a.download = `${cardData.businessName || 'quickcard'}.png`
      a.href = url
      a.click()
      toast.success('PNG downloaded!')
    } catch { toast.error('Download failed') }
    finally { setDownloading(null) }
  }

  const downloadPdf = async () => {
    if (!captureRef.current) return toast.error('Card not ready')
    setDownloading('pdf')
    try {
      const { toPng } = await import('html-to-image')
      const { jsPDF } = await import('jspdf')
      const pixelRatio = printQuality ? 4 : 3
      const url = await toPng(captureRef.current, { quality: 1, pixelRatio })
      const pageW = printQuality ? 3.75 : 3.5
      const pageH = printQuality ? 2.25 : 2.0
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [pageW, pageH] })
      const offsetX = printQuality ? 0.125 : 0
      const offsetY = printQuality ? 0.125 : 0
      pdf.addImage(url, 'PNG', offsetX, offsetY, 3.5, 2)
      if (printQuality) {
        // Draw crop marks at card boundary corners
        pdf.setDrawColor(0, 0, 0)
        pdf.setLineWidth(0.005)
        const x1 = offsetX, y1 = offsetY, x2 = offsetX + 3.5, y2 = offsetY + 2
        const m = 0.05 // mark length in inches
        // Top-left
        pdf.line(x1 - m, y1, x1, y1); pdf.line(x1, y1 - m, x1, y1)
        // Top-right
        pdf.line(x2, y1, x2 + m, y1); pdf.line(x2, y1 - m, x2, y1)
        // Bottom-left
        pdf.line(x1 - m, y2, x1, y2); pdf.line(x1, y2, x1, y2 + m)
        // Bottom-right
        pdf.line(x2, y2, x2 + m, y2); pdf.line(x2, y2, x2, y2 + m)
      }
      pdf.save(`${cardData.businessName || 'quickcard'}${printQuality ? '-print' : ''}.pdf`)
      toast.success(printQuality ? 'Print-ready PDF downloaded!' : 'PDF downloaded!')
    } catch { toast.error('Download failed') }
    finally { setDownloading(null) }
  }

  const shareWhatsApp = () => {
    const url = `${window.location.origin}/c/${cardId || 'preview'}`
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check my business card: ${url}`)}`, '_blank')
  }

  const copyLink = async () => {
    const url = `${window.location.origin}/c/${cardId || 'preview'}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading editor...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Top bar — same visual language as templates page bottom bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Left: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-gray-900 leading-tight">Card Editor</h1>
              <p className="text-xs text-gray-400 truncate">{template?.name || 'No template'}</p>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/templates"
              className="text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors font-semibold"
            >
              Change Template
            </Link>
            <Link
              href="/card-editor"
              className="text-xs text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 px-3 py-1.5 rounded-xl transition-opacity font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Pro Editor
            </Link>
            <button
              onClick={handleDuplicate}
              disabled={!template}
              className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors font-medium disabled:opacity-40"
              title="Duplicate template"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </button>
            <button
              onClick={downloadPng}
              disabled={!!downloading}
              className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors font-medium disabled:opacity-50"
            >
              {downloading === 'png' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileImage className="w-3.5 h-3.5" />}
              PNG
            </button>
            <button
              onClick={downloadPdf}
              disabled={!!downloading}
              className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors font-medium disabled:opacity-50"
            >
              {downloading === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
              PDF
            </button>
            <button
              onClick={() => setPrintQuality(q => !q)}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl transition-colors font-medium ${
                printQuality
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200'
                  : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
              }`}
              title={printQuality ? 'Print quality ON — 300 DPI + bleed' : 'Standard quality'}
            >
              🖨️ {printQuality ? 'Print ON' : 'Print'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-xl transition-colors font-semibold disabled:opacity-50 shadow-sm shadow-blue-200"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">

          {/* ── Left Panel: Editor ── */}
          <div className="space-y-4">
            {/* Tab switcher */}
            <div className="flex bg-white rounded-2xl p-1 border border-gray-100 shadow-sm">
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'content' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Eye className="w-4 h-4" /> Content
              </button>
              <button
                onClick={() => setActiveTab('style')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === 'style' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Palette className="w-4 h-4" /> Style
              </button>
            </div>

            {activeTab === 'content' ? (
              /* ── Content Fields ── */
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-gray-800 mb-4">Card Information</h3>

                {/* ── Logo Upload ── */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                    Logo / Brand Image
                  </label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  {cardData.logoUrl ? (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 bg-gray-50">
                      <img
                        src={cardData.logoUrl}
                        alt="Logo preview"
                        className="w-12 h-12 object-contain rounded-lg border border-gray-200 bg-white flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700">Logo uploaded</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Appears on card front &amp; back</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => logoInputRef.current?.click()}
                          className="text-[10px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                        >
                          Change
                        </button>
                        <button
                          onClick={() => setCardData(prev => ({ ...prev, logoUrl: '' }))}
                          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-400 hover:text-blue-600 text-xs font-semibold transition-all"
                    >
                      <ImagePlus className="w-4 h-4" />
                      Upload Logo (PNG, JPG, SVG — max 2 MB)
                    </button>
                  )}
                </div>

                {[
                  { key: 'businessName', label: 'Business Name', placeholder: 'Sharma Enterprises', required: true },
                  { key: 'name', label: 'Your Name', placeholder: 'Rani Sharma', required: true },
                  { key: 'tagline', label: 'Tagline', placeholder: 'Your trusted partner' },
                  { key: 'phone', label: 'Phone', placeholder: '+91 9876543210', required: true },
                  { key: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
                  { key: 'website', label: 'Website', placeholder: 'www.yoursite.com' },
                  { key: 'address', label: 'Address', placeholder: '123 MG Road, Mumbai' },
                ].map(({ key, label, placeholder, required }) => {
                  const err = fieldErrors[key as keyof CardData]
                  return (
                    <div key={key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                        {label} {required && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        className={`w-full px-3 py-2.5 rounded-xl border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all ${
                          err
                            ? 'border-red-400 focus:ring-red-400 bg-red-50'
                            : 'border-gray-200 focus:ring-blue-500'
                        }`}
                        placeholder={placeholder}
                        value={(cardData as any)[key] || ''}
                        onChange={e => handleFieldChange(key as keyof CardData, e.target.value)}
                      />
                      {err && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <span>⚠</span> {err}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              /* ── Style Controls ── */
              <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-5">
                <h3 className="text-sm font-bold text-gray-800">Style Customization</h3>

                {/* Background color */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Background</label>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="color"
                      value={customLayout.background?.startsWith('#') ? customLayout.background : '#1d4ed8'}
                      onChange={e => handleStyleChange('background', e.target.value)}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono"
                      value={customLayout.background || ''}
                      onChange={e => handleStyleChange('background', e.target.value)}
                      placeholder="#1d4ed8 or gradient"
                    />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {PRESET_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => handleStyleChange('background', c)}
                        className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
                        style={{ background: c, borderColor: customLayout.background === c ? '#2563eb' : '#e5e7eb' }}
                      />
                    ))}
                  </div>
                </div>

                {/* Primary color */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customLayout.primaryColor || '#ffffff'}
                      onChange={e => handleStyleChange('primaryColor', e.target.value)}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono"
                      value={customLayout.primaryColor || ''}
                      onChange={e => handleStyleChange('primaryColor', e.target.value)}
                    />
                  </div>
                </div>

                {/* Accent color */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customLayout.accent || '#fbbf24'}
                      onChange={e => handleStyleChange('accent', e.target.value)}
                      className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                    />
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-mono"
                      value={customLayout.accent || ''}
                      onChange={e => handleStyleChange('accent', e.target.value)}
                    />
                  </div>
                </div>

                {/* Font */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block flex items-center gap-1">
                    <Type className="w-3 h-3" /> Font Family
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FONTS.map(f => (
                      <button
                        key={f}
                        onClick={() => handleStyleChange('fontFamily', f)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${customLayout.fontFamily === f ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                        style={{ fontFamily: f }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <button
                  onClick={() => template && setCustomLayout({ ...template.layoutConfig })}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Reset to Default
                </button>

                {/* Gradient Picker */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                    Gradient Background
                  </label>
                  <GradientPicker
                    value={customLayout.background || ''}
                    onChange={v => handleStyleChange('background', v)}
                  />
                </div>
              </div>
            )}

            {/* Share actions */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Share</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={shareWhatsApp} className="flex items-center justify-center gap-2 py-2.5 bg-green-50 hover:bg-green-100 rounded-2xl text-xs font-semibold text-green-700 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
                <button onClick={copyLink} className="flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-xs font-semibold text-gray-700 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Right Panel: Live Preview ── */}
          <div className="space-y-4">
            {/* Preview stage — same gradient as templates modal */}
            <div
              className="rounded-3xl overflow-hidden border border-indigo-100 shadow-sm"
              style={{ background: 'linear-gradient(145deg, #f8faff 0%, #eef2ff 100%)' }}
            >
              {/* Stage header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2">
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Live Preview</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Changes update instantly</p>
                </div>
                {template && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/80 text-gray-600 border border-gray-200 capitalize">
                      {template.category}
                    </span>
                    {(template as any).isPremium && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                        <Crown className="w-3 h-3" /> PRO
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card stage */}
              <div className="flex flex-col items-center justify-center gap-5 px-6 pb-8 pt-4 min-h-[320px] w-full overflow-hidden">
                {mergedTemplate ? (
                  <CardRenderer
                    template={mergedTemplate}
                    cardData={cardData}
                    scale={1.4}
                    showFlip={true}
                    captureRef={captureRef}
                  />
                ) : (
                  <div className="text-center text-gray-400 py-10">
                    <div className="text-4xl mb-3">🎨</div>
                    <p className="text-sm font-medium text-gray-500">No template selected</p>
                    <Link href="/templates" className="text-blue-600 text-sm hover:underline mt-1.5 block">
                      Choose a template →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Card details summary — same style as templates modal right panel */}
            {(cardData.name || cardData.businessName) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
              >
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Card Summary</p>

                {/* Name block */}
                <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-2.5">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{cardData.businessName || '—'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cardData.name || '—'}</p>
                </div>

                {/* Contact rows */}
                <div className="space-y-2">
                  {[
                    { icon: Phone, value: cardData.phone },
                    { icon: Mail, value: cardData.email },
                    { icon: Globe, value: cardData.website },
                    { icon: MapPin, value: cardData.address },
                  ].filter(r => r.value).map(({ icon: Icon, value }, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-1">
                      <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3 h-3 text-blue-500" />
                      </div>
                      <span className="text-xs text-gray-600 truncate">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
