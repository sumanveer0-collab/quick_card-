'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { User, CreditCard, LogOut, Save, Loader2, Zap } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useAuthStore } from '@/store/auth.store'
import api from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const { user, fetchProfile, logout } = useAuthStore()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) { router.push('/login'); return }
    fetchProfile()
  }, [])

  useEffect(() => {
    if (user) setName(user.name || '')
  }, [user])

  const saveProfile = async () => {
    setSaving(true)
    try {
      await api.patch('/user/profile', { name })
      await fetchProfile()
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  if (!user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile</h1>

        {/* Plan Badge */}
        <div className={`rounded-3xl p-6 mb-6 ${user.plan === 'pro' ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${user.plan === 'pro' ? 'text-blue-200' : 'text-gray-500'}`}>Current Plan</p>
              <p className={`text-2xl font-bold mt-1 ${user.plan === 'pro' ? 'text-white' : 'text-gray-900'}`}>
                {user.plan === 'pro' ? '⚡ Pro' : 'Free'}
              </p>
            </div>
            {user.plan === 'free' && (
              <Link href="/upgrade" className="flex items-center gap-2 bg-brand-600 text-white font-semibold px-4 py-2 rounded-2xl hover:bg-brand-700 transition-colors text-sm">
                <Zap className="w-4 h-4" /> Upgrade
              </Link>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" /> Personal Info
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
            </div>
            {user.email && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                <input className="input bg-gray-50" value={user.email} disabled />
              </div>
            )}
            {user.phone && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                <input className="input bg-gray-50" value={user.phone} disabled />
              </div>
            )}
            <button onClick={saveProfile} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 card-shadow mb-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-600" /> Quick Links
          </h2>
          <div className="space-y-2">
            <Link href="/" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
              <span className="text-sm font-medium text-gray-700">My Cards</span>
              <span className="text-gray-400">→</span>
            </Link>
            <Link href="/create" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
              <span className="text-sm font-medium text-gray-700">Create New Card</span>
              <span className="text-gray-400">→</span>
            </Link>
            <Link href="/upgrade" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
              <span className="text-sm font-medium text-gray-700">Upgrade to Pro</span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 text-red-500 hover:bg-red-50 rounded-3xl transition-colors font-medium">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  )
}
