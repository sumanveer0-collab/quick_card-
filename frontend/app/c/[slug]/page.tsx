import { Metadata } from 'next'
import Image from 'next/image'
import { Phone, Mail, Globe, MapPin, MessageCircle, Share2 } from 'lucide-react'

interface Card {
  businessName: string
  name: string
  phone: string
  email: string
  address?: string
  website?: string
  tagline?: string
  services?: string[]
  imageUrl?: string
  qrCodeUrl?: string
  hasWatermark?: boolean
  socialLinks?: Record<string, string>
  template?: { layoutConfig: Record<string, any> }
}

async function getCard(slug: string): Promise<Card | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/c/${slug}`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.data
  } catch { return null }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const card = await getCard(params.slug)
  if (!card) return { title: 'Card not found – QuickCard' }
  return {
    title: `${card.businessName} – ${card.name} | QuickCard`,
    description: card.tagline || `Contact ${card.name} at ${card.businessName}`,
    openGraph: {
      title: card.businessName,
      description: card.tagline,
      images: card.imageUrl ? [card.imageUrl] : [],
    },
  }
}

export default async function PublicCardPage({ params }: { params: { slug: string } }) {
  const card = await getCard(params.slug)

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-2xl font-bold text-gray-700 mb-2">Card not found</p>
          <p className="text-gray-400">This card may have been deleted or the link is invalid.</p>
        </div>
      </div>
    )
  }

  const layout = card.template?.layoutConfig || {}
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const font = layout.fontFamily || 'Inter'

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card Visual */}
        <div
          className="rounded-3xl overflow-hidden shadow-2xl mb-6 relative"
          style={{ background: bg, fontFamily: font }}
        >
          {card.imageUrl ? (
            <div className="relative aspect-[1.75]">
              <Image src={card.imageUrl} alt={card.businessName} fill className="object-cover" />
            </div>
          ) : (
            <div className="p-8" style={{ color: primary }}>
              <h1 className="text-2xl font-bold">{card.businessName}</h1>
              {card.tagline && <p className="text-sm mt-1 opacity-80 italic">{card.tagline}</p>}
              <p className="text-lg font-medium mt-4">{card.name}</p>
              <div className="mt-3 space-y-1.5 text-sm opacity-80">
                <p>📞 {card.phone}</p>
                <p>✉ {card.email}</p>
                {card.website && <p>🌐 {card.website}</p>}
                {card.address && <p>📍 {card.address}</p>}
              </div>
            </div>
          )}
          {card.hasWatermark && (
            <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">Made with QuickCard</div>
          )}
          {card.qrCodeUrl && (
            <div className="absolute top-3 right-3 w-14 h-14 bg-white rounded-xl overflow-hidden shadow-lg">
              <Image src={card.qrCodeUrl} alt="QR" width={56} height={56} />
            </div>
          )}
        </div>

        {/* Contact Actions */}
        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-3">
          <h2 className="font-bold text-gray-900 text-lg">{card.businessName}</h2>
          <p className="text-gray-500 text-sm">{card.name}</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <a href={`tel:${card.phone}`} className="flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium py-3 rounded-2xl transition-colors text-sm">
              <Phone className="w-4 h-4" /> Call
            </a>
            <a href={`https://wa.me/${card.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-2xl transition-colors text-sm">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <a href={`mailto:${card.email}`} className="flex items-center justify-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium py-3 rounded-2xl transition-colors text-sm">
              <Mail className="w-4 h-4" /> Email
            </a>
            {card.website && (
              <a href={card.website.startsWith('http') ? card.website : `https://${card.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 rounded-2xl transition-colors text-sm">
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
          </div>

          {card.services && card.services.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-400 mb-2">SERVICES</p>
              <div className="flex flex-wrap gap-2">
                {card.services.map((s, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          )}

          {card.address && (
            <div className="flex items-start gap-2 text-sm text-gray-500 pt-2">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{card.address}</span>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by <a href="/" className="text-brand-600 font-medium">QuickCard</a>
        </p>
      </div>
    </div>
  )
}
