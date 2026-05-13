'use client'
import QuickCardTemplateGallery from '@/components/QuickCardTemplateGallery'
import Navbar from '@/components/Navbar'

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <QuickCardTemplateGallery />
    </div>
  )
}
