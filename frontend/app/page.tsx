'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Plus, Zap, Share2, Trash2, Copy, Download, Eye, CreditCard, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/api'

interface Card {
  _id: string
  businessName: string
  name: string
  phone: string
  imageUrl?: string
  shareSlug: string
  hasWatermark: boolean
  templateId: { name: string; previewImage: string }
  createdAt: string
}

export default function HomePage() {
  const router = useRouter()
  const { user, fetchProfile } = useAuthStore()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    fetchProfile()
    loadCards()
  }, [page])

  const loadCards = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/card/list?page=${page}&limit=9`)
      setCards(data.data)
      setTotalPages(data.meta?.totalPages || 1)
    } catch {
      toast.error('Failed to load cards')
    } finally {
      setLoading(false)
    }
  }

  const deleteCard = async (id: string) => {
    if (!confirm('Delete this card?')) return
    try {
      await api.delete(`/card/${id}`)
      toast.success('Card deleted')
      loadCards()
    } catch { toast.error('Failed to delete') }
  }

  const duplicateCard = async (id: string) => {
    try {
      await api.post(`/card/duplicate/${id}`)
      toast.success('Card duplicated!')
      loadCards()
    } catch { toast.error('Failed to duplicate') }
  }

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`)
    toast.success('Link copied!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user ? `Welcome, ${user.name || 'there'} 👋` : 'My Cards'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{cards.length} card{cards.length !== 1 ? 's' : ''} created</p>
          </div>
          <Link href="/create" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Card
          </Link>
        </div>

        {/* Upgrade Banner (free users) */}
        {user?.plan === 'free' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-3xl p-6 mb-8 text-white flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-lg">Upgrade to Pro</span>
              </div>
              <p className="text-blue-100 text-sm">Remove watermark · 5 print-ready exports · Premium templates</p>
            </div>
            <Link href="/upgrade" className="bg-white text-brand-600 font-bold px-5 py-2.5 rounded-2xl hover:bg-blue-50 transition-colors whitespace-nowrap">
              ₹99/month
            </Link>
          </motion.div>
        )}

        {/* AI Generator CTA */}
        <Link href="/ai" className="block mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-brand-50 border border-purple-100 rounded-3xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Try AI Card Generator</p>
              <p className="text-sm text-gray-500">Enter your business type → AI creates your card instantly</p>
            </div>
            <div className="ml-auto text-brand-600 font-semibold text-sm">Try Free →</div>
          </div>
        </Link>

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-24">
            <CreditCard className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No cards yet</h3>
            <p className="text-gray-400 mb-6">Create your first business card in seconds</p>
            <Link href="/create" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Your First Card
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, i) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-3xl overflow-hidden card-shadow border border-gray-100"
                >
                  {/* Card Preview */}
                  <div className="relative h-44 bg-gradient-to-br from-brand-600 to-purple-600 overflow-hidden">
                    {card.imageUrl ? (
                      <Image src={card.imageUrl} alt={card.businessName} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                        <p className="font-bold text-lg text-center">{card.businessName}</p>
                        <p className="text-blue-200 text-sm">{card.name}</p>
                        <p className="text-blue-200 text-xs mt-1">{card.phone}</p>
                      </div>
                    )}
                    {card.hasWatermark && (
                      <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                        Made with QuickCard
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 truncate">{card.businessName}</p>
                    <p className="text-sm text-gray-500 truncate">{card.name}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-1 mt-3">
                      <Link href={`/editor?cardId=${card._id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-brand-600 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Edit
                      </Link>
                      <button onClick={() => copyLink(card.shareSlug)} className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </button>
                      <button onClick={() => duplicateCard(card._id)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteCard(card._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page === i + 1 ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
