'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  ArrowLeft, Download, FileImage, FileText, Share2,
  MessageCircle, Copy, Loader2, Edit, Check, RefreshCw,
  Maximize2, ZoomIn, ZoomOut,
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'
import { replacePlaceholders, generateDefaultHtml, buildCardDocument, CardData } from '@/lib/template-engine'

interface Template {
  _id: string
  name: string
  category: string
  html?: string
  css?: string
  layoutConfig: Record<string, any>
  isPremium: boolean
}

export default function PreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const cardRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [template, setTemplate] = useState<Template | null>(null)
  const [cardData, setCardData] = useState<CardData>({})
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<'png' | 'pdf' | null>(null)
  const [copied, setCopied] = useState(false)
  const [zoom, setZoom] = useState(1)

  // Get templateId + cardId from URL or sessionStorage
  const templateId = searchParams.get('templateId')
  const cardId = searchParams.get('cardId')

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load form data from sessionStorage
      let data: CardData = {}
      try {
        const saved = sessionStorage.getItem('qc_form_data')
        if (saved) data = JSON.parse(saved)
      } catch {}

      // If cardId provided, load from API
      if (cardId) {
        const { data: res } = await api.get(`/card/list`)
        const card = res.data?.find((c: any) => c._id === cardId)
        if (card) {
          data = {
            name: card.name,
            businessName: card.businessName,
            phone: card.phone,
            email: card.email,
            address: card.address,
            website: card.website,
            tagline: card.tagline,
            logoUrl: card.logoUrl,
            qrCodeUrl: card.qrCodeUrl,
            services: card.services,
            socialLinks: card.socialLinks,
          }
        }
      }

      setCardData(data)

      // Load template
      const tid = templateId || (() => {
        try { return JSON.parse(sessionStorage.getItem('qc_selected_template') || '{}')._id } catch { return null }
      })()

      if (tid) {
        const { data: tRes } = await api.get(`/templates/${tid}`)
        setTemplate(tRes.data)
      }
    } catch (e: any) {
      toast.error('Failed to load preview')
    } finally {
      setLoading(false)
    }
  }

  // Build rendered HTML
  const getRenderedHtml = useCallback(() => {
    if (!template) return ''
    const layout = template.layoutConfig || {}

    if (template.html) {
      // Use template's HTML with placeholder replacement
      return buildCardDocument(template.html, template.css || '', cardData, layout)
    }
    // Fallback: generate from layoutConfig
    const bodyHtml = generateDefaultHtml(cardData, layout)
    return buildCardDocument(bodyHtml, '', cardData, layout)
  }, [template, cardData])

  // Inject into iframe
  useEffect(() => {
    if (!iframeRef.current || !template) return
    const doc = iframeRef.current.contentDocument
    if (doc) {
      doc.open()
      doc.write(getRenderedHtml())
      doc.close()
    }
  }, [template, cardData, getRenderedHtml])

  // ── Download PNG ──────────────────────────────────────────────────────────
  const downloadPng = async () => {
    if (!cardRef.current) return
    setDownloading('png')
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3, // 3x = ~300 DPI equivalent
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = `${cardData.businessName || 'quickcard'}-card.png`
      link.href = dataUrl
      link.click()
      toast.success('PNG downloaded!')
    } catch (e) {
      toast.error('PNG download failed')
    } finally {
      setDownloading(null)
    }
  }

  // ── Download PDF ──────────────────────────────────────────────────────────
  const downloadPdf = async () => {
    if (!cardRef.current) return
    setDownloading('pdf')
    try {
      const { toPng } = await import('html-to-image')
      const { jsPDF } = await import('jspdf')

      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 3 })

      // Standard business card: 3.5 × 2 inches
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'in',
        format: [3.5, 2],
      })

      pdf.addImage(dataUrl, 'PNG', 0, 0, 3.5, 2)
      pdf.save(`${cardData.businessName || 'quickcard'}-card.pdf`)
      toast.success('PDF downloaded!')
    } catch (e) {
      toast.error('PDF download failed')
    } finally {
      setDownloading(null)
    }
  }

  // ── Share ─────────────────────────────────────────────────────────────────
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading your card...</p>
        </div>
      </div>
    )
  }

  const layout = template?.layoutConfig || {}
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Card Preview</h1>
            <p className="text-gray-500 text-sm">
              {template ? `Template: ${template.name}` : 'Your business card'}
            </p>
          </div>
          <Link href="/create" className="ml-auto flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 transition-colors">
            <Edit className="w-4 h-4" /> Edit
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Card Preview (3/5) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* Zoom controls */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Preview</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <ZoomOut className="w-4 h-4 text-gray-500" />
                </button>
                <span className="text-xs text-gray-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <ZoomIn className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={() => setZoom(1)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Card container — this is what gets captured for download */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px]">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease',
                }}
              >
                {/* The actual card — captured by html-to-image */}
                <div
                  ref={cardRef}
                  style={{
                    width: '336px',
                    height: '192px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    position: 'relative',
                    background: bg,
                    fontFamily: layout.fontFamily || 'Inter',
                  }}
                >
                  {template?.html ? (
                    // HTML template — render in iframe
                    <iframe
                      ref={iframeRef}
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      title="Card Preview"
                      sandbox="allow-same-origin"
                    />
                  ) : (
                    // Fallback: CSS-in-JS render
                    <div
                      style={{
                        width: '100%', height: '100%',
                        background: bg,
                        padding: '20px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Decorative */}
                      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: primary, opacity: 0.08 }} />
                      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: primary, opacity: 0.08 }} />
                      {/* Accent bar */}
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: layout.accent || '#fbbf24' }} />

                      <div>
                        <p style={{ fontSize: '16px', fontWeight: 700, color: primary, lineHeight: 1.2 }}>
                          {cardData.businessName || 'Business Name'}
                        </p>
                        {cardData.tagline && (
                          <p style={{ fontSize: '9px', color: primary, opacity: 0.7, marginTop: '3px', fontStyle: 'italic' }}>
                            {cardData.tagline}
                          </p>
                        )}
                        <p style={{ fontSize: '11px', fontWeight: 600, color: layout.secondaryColor || 'rgba(255,255,255,0.8)', marginTop: '10px' }}>
                          {cardData.name || 'Your Name'}
                        </p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {cardData.phone && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>📞 {cardData.phone}</p>}
                        {cardData.email && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>✉ {cardData.email}</p>}
                        {cardData.website && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>🌐 {cardData.website}</p>}
                        {cardData.address && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>📍 {cardData.address}</p>}
                      </div>

                      {cardData.qrCodeUrl && (
                        <img src={cardData.qrCodeUrl} alt="QR" style={{ position: 'absolute', top: '12px', right: '12px', width: '44px', height: '44px', borderRadius: '6px', background: '#fff', padding: '2px' }} />
                      )}
                      <div style={{ position: 'absolute', bottom: '6px', right: '10px', fontSize: '7px', color: primary, opacity: 0.25 }}>
                        Made with QuickCard
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card info */}
            {template && (
              <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-gray-100">
                <div className="w-8 h-5 rounded-md" style={{ background: bg }} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{template.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{template.category}</p>
                </div>
                <Link href="/templates" className="ml-auto text-xs text-blue-600 hover:underline">Change</Link>
              </div>
            )}
          </motion.div>

          {/* ── Actions (2/5) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Download */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" /> Download
              </h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={downloadPng}
                  disabled={!!downloading}
                  className="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors disabled:opacity-60"
                >
                  {downloading === 'png' ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <FileImage className="w-5 h-5 text-blue-600" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-blue-700">Download PNG</p>
                    <p className="text-xs text-blue-400">High quality · 3x resolution</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={downloadPdf}
                  disabled={!!downloading}
                  className="w-full flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors disabled:opacity-60"
                >
                  {downloading === 'pdf' ? (
                    <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5 text-purple-600" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-purple-700">Download PDF</p>
                    <p className="text-xs text-purple-400">3.5×2 inch · Print ready</p>
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-green-600" /> Share
              </h3>
              <div className="space-y-3">
                <button
                  onClick={shareWhatsApp}
                  className="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-2xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-green-700">Share on WhatsApp</p>
                    <p className="text-xs text-green-400">Send to contacts instantly</p>
                  </div>
                </button>

                <button
                  onClick={copyLink}
                  className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-700">{copied ? 'Copied!' : 'Copy Link'}</p>
                    <p className="text-xs text-gray-400">Share anywhere</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Card Details */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Card Details</h3>
              <div className="space-y-2.5">
                {[
                  ['Name', cardData.name],
                  ['Business', cardData.businessName],
                  ['Phone', cardData.phone],
                  ['Email', cardData.email],
                  cardData.website && ['Website', cardData.website],
                  cardData.address && ['Address', cardData.address],
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label as string} className="flex gap-3">
                    <span className="text-xs text-gray-400 w-16 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-xs text-gray-700 font-medium break-all">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
