'use client'
import Link from 'next/link'
import { CreditCard } from 'lucide-react'

export default function Navbar() {

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-600">
          <CreditCard className="w-6 h-6" />
          QuickCard
        </Link>
      </div>
    </nav>
  )
}
