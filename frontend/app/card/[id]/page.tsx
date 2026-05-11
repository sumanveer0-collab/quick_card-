'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { ArrowLeft, Download, Share2, Edit, Printer, Loader2, CheckCircle, Clock, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

interface Card {
  _id: string
  businessName: string
  name: string
  phone: string
  email: string
  address: string
  website: string
  tagline: string
  services: string[]
  imageUrl?: string
  printReadyUrl?: string
  shareSlug: string
  hasWatermark: boolean
  qrCodeUrl?: string
  socialLinks?: Record<string, string>
  templateId: { name: string; layoutConfig: Record<string, any> }
}

export default function CardDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [printLoading, setPrintLoading] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [jobStatus, setJobStatus] = useState<string | null>(null)

  useEffect(() => {
    loadCard()
  }, [id])

  useEffect(() => {
    if (!jobId) return
    const interval = setInterval(async () => {
      try {
        const { data } = await api.get(`/card/job/${jobId}`)
        setJobStatus(data.data.status)
        if (data.data.status === 'done') {
          clearInterval(interval)
          setJobId(null)
          toast.success('Print-ready file ready!')
          loadCard()
        } else if (data.data.status === 'failed') {
          clearInterval(interval)
          setJobId(null)
          toast.error('Generation failed. Try again.')
        }
      } catch { clearInterval(interval) }
    }, 3000)
    return () => clearInterval(interval)
  }, [jobId])

  const loadCard = async () => {
    try {
      const { data } = await api.get(`/card/list`)
      const found = data.data.find((c: Card) => c._id === id)
      if (found) setCard(found)
    } catch { toast.error('Failed to load card') }
    finally { setLoading(false) }
  }

  const generatePrintReady = async () => {
    if (!card) return
    setPrintLoading(true)
    try {
      const { data } = await api.post('/card/print-ready', { cardId: card._id })
      setJobId(data.data.jobId)
      setJobStatus('pending')
      toast.success('Generating print-ready file...')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to generate')
    } finally {
      setPrintLoading(false)
    }
  }

  const shareWhatsApp = () => {
    if (!card) return
    const url = `${window.location.origin}/c/${card.shareSlug}`
    const msg = `Check out my business card: ${url}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const copyLink = () => {
    if (!card) return
    navigator.clipboard.writeText(`${window.location.origin}/c/${card.shareSlug}`)
    toast.success('Link copied!')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
    </div>
  )

  if (!card) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Card not found</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  )

  const layout = card.templateId?.layoutConfig || {}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{card.businessName}</h1>
          <Link href={`/edit/${card._id}`} className="ml-auto btn-secondary flex items-center gap-2 text-sm py-2">
            <Edit className="w-4 h-4" /> Edit
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Card Preview</h3>
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{ background: layout.background || '#1d4ed8', aspectRatio: '1.75', padding: '24px' }}
              >
                {card.imageUrl ? (
                  <Image src={card.imageUrl} alt={card.businessName} fill className="object-cover" />
                ) : (
                  <div className="flex flex-col justify-center h-full">
                    <p className="font-bold text-xl" style={{ color: layout.primaryColor || '#fff', fontFamily: layout.fontFamily || 'Inter' }}>{card.businessName}</p>
                    {card.tagline && <p className="text-sm mt-1 opacity-80" style={{ color: layout.primaryColor || '#fff' }}>{card.tagline}</p>}
                    <p className="text-base mt-3 font-medium" style={{ color: layout.primaryColor || '#fff' }}>{card.name}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm opacity-70" style={{ color: layout.primaryColor || '#fff' }}>📞 {card.phone}</p>
                      <p className="text-sm opacity-70" style={{ color: layout.primaryColor || '#fff' }}>✉ {card.email}</p>
                      {card.website && <p className="text-sm opacity-70" style={{ color: layout.primaryColor || '#fff' }}>🌐 {card.website}</p>}
                    </div>
                  </div>
                )}
                {card.hasWatermark && (
                  <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">Made with QuickCard</div>
                )}
                {card.qrCodeUrl && (
                  <div className="absolute top-3 right-3 w-12 h-12 bg-white rounded-lg overflow-hidden">
                    <Image src={card.qrCodeUrl} alt="QR" width={48} height={48} />
                  </div>
                )}
              </div>
            </div>

            {/* Job Status */}
            {jobStatus && jobStatus !== 'done' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-600 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-brand-700">Generating print-ready file...</p>
                  <p className="text-xs text-brand-500">This takes 15-30 seconds</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4">
            {/* Share Actions */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Share</h3>
              <div className="space-y-3">
                <button onClick={shareWhatsApp} className="w-full flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-2xl transition-colors">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Share on WhatsApp</span>
                </button>
                <button onClick={copyLink} className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Copy Share Link</span>
                </button>
              </div>
            </div>

            {/* Download Actions */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Download</h3>
              <div className="space-y-3">
                {card.imageUrl && (
                  <a href={card.imageUrl} download className="w-full flex items-center gap-3 p-3 bg-brand-50 hover:bg-brand-100 rounded-2xl transition-colors">
                    <Download className="w-5 h-5 text-brand-600" />
                    <span className="text-sm font-medium text-brand-700">Download PNG</span>
                  </a>
                )}
                {card.printReadyUrl ? (
                  <a href={card.printReadyUrl} download className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium text-purple-700">Download Print-Ready (300 DPI)</p>
                      <p className="text-xs text-purple-500">Ready for professional printing</p>
                    </div>
                  </a>
                ) : (
                  <button onClick={generatePrintReady} disabled={printLoading || !!jobId} className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors disabled:opacity-50">
                    <Printer className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700">
                        {printLoading || jobId ? 'Generating...' : 'Generate Print-Ready (Pro)'}
                      </p>
                      <p className="text-xs text-gray-400">300 DPI · 3.5×2 inch · Bleed marks</p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Card Details */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Details</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Name', card.name],
                  ['Phone', card.phone],
                  ['Email', card.email],
                  card.address && ['Address', card.address],
                  card.website && ['Website', card.website],
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label as string} className="flex gap-2">
                    <span className="text-gray-400 w-16 flex-shrink-0">{label}</span>
                    <span className="text-gray-700 font-medium">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
