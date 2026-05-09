'use client'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth.store'
import { CreditCard, LogOut, User, Zap } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuthStore()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-600">
          <CreditCard className="w-6 h-6" />
          QuickCard
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            Templates
          </Link>
          <Link href="/customize" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
            Editor
          </Link>
          
          {user ? (
            <>
              {user.plan === 'free' && (
                <Link href="/upgrade" className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-2xl hover:opacity-90 transition-opacity">
                  <Zap className="w-4 h-4" />
                  Upgrade Pro
                </Link>
              )}
              {user.plan === 'pro' && (
                <span className="bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">PRO</span>
              )}
              <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <span className="hidden sm:block font-medium">{user.name || 'Profile'}</span>
              </Link>
              <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Login</Link>
              <Link href="/login" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
