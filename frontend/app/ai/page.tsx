'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { Sparkles, ArrowLeft, Loader2, Wand2, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

interface AiResult {
  businessName: string
  tagline: string
  services: string[]
  suggestedCategory: string
  colorTheme: { primary: string; secondary: string; background: string; text: string }
  suggestedTemplates: { _id: string; name: string; previewImage: string; isPremium: boolean }[]
}

const BUSINESS_EXAMPLES = ['Salon & Beauty', 'Software Developer', 'Restaurant', 'Gym & Fitness', 'Real Estate', 'Doctor', 'Photographer', 'Chartered Accountant', 'Boutique', 'Tutor']

export default function AiGeneratorPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AiResult | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const generate = async () => {
    if (!name.trim() || !businessType.trim()) return toast.error('Enter your name and business type')
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/ai/generate', { name, businessType })
      setResult(data.data)
      if (data.data.suggestedTemplates?.length > 0) {
        setSelectedTemplateId(data.data.suggestedTemplates[0]._id)
      }
      toast.success('AI generated your card content!')
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'AI generation failed')
    } finally {
      setLoading(false)
    }
  }

  const useResult = () => {
    if (!result || !selectedTemplateId) return
    const params = new URLSearchParams({
      businessName: result.businessName,
      tagline: result.tagline,
      templateId: selectedTemplateId,
      services: result.services.join(','),
    })
    router.push(`/create?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" /> AI Card Generator
            </h1>
            <p className="text-gray-500 text-sm">Tell us your business — AI creates your card content</p>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 card-shadow mb-6">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Name</label>
              <input className="input" placeholder="Priya Sharma" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Business Type</label>
              <input className="input" placeholder="e.g. Salon, Developer, Restaurant..." value={businessType} onChange={e => setBusinessType(e.target.value)} />
              <div className="flex flex-wrap gap-2 mt-3">
                {BUSINESS_EXAMPLES.map(ex => (
                  <button key={ex} onClick={() => setBusinessType(ex)} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${businessType === ex ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-300'}`}>
                    {ex}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generate} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating with AI...</>
              ) : (
                <><Wand2 className="w-4 h-4" /> Generate My Card</>
              )}
            </button>
          </div>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Generated Content */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 card-shadow">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h2 className="font-bold text-gray-900">AI Generated Content</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-brand-50 rounded-2xl">
                    <p className="text-xs text-brand-500 font-medium mb-1">BUSINESS NAME</p>
                    <p className="text-xl font-bold text-brand-700">{result.businessName}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl">
                    <p className="text-xs text-purple-500 font-medium mb-1">TAGLINE</p>
                    <p className="text-base font-medium text-purple-700 italic">"{result.tagline}"</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs text-gray-500 font-medium mb-2">SERVICES</p>
                    <div className="space-y-1">
                      {result.services.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs text-gray-500 font-medium mb-2">COLOR THEME</p>
                    <div className="flex gap-2">
                      {Object.entries(result.colorTheme).map(([key, color]) => (
                        <div key={key} className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 rounded-xl border border-gray-200" style={{ background: color }} />
                          <span className="text-[10px] text-gray-400">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Templates */}
              {result.suggestedTemplates?.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 card-shadow">
                  <h2 className="font-bold text-gray-900 mb-4">Suggested Templates</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {result.suggestedTemplates.map(t => (
                      <button key={t._id} onClick={() => setSelectedTemplateId(t._id)} className={`rounded-2xl overflow-hidden border-2 transition-all ${selectedTemplateId === t._id ? 'border-brand-600 shadow-md' : 'border-transparent hover:border-gray-200'}`}>
                        <div className="aspect-video bg-gradient-to-br from-brand-600 to-purple-600" />
                        <p className="text-xs text-center py-1.5 font-medium text-gray-600 truncate px-1">{t.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={useResult} className="btn-primary w-full flex items-center justify-center gap-2">
                Use This Content <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
