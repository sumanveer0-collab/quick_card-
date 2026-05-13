'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Crown, Eye, Pencil, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { replacePlaceholders } from '@/lib/template-engine'

export interface Template {
  _id: string
  name: string
  category: string
  previewImage: string
  thumbnailUrl?: string // Direct thumbnail URL
  isPremium: boolean
  isFeatured?: boolean // Featured badge
  layoutConfig: Record<string, any>
  frontHTML?: string
  backHTML?: string
  frontCSS?: string
  backCSS?: string
  description?: string // Short description
  colorPalette?: string[] // Color palette preview
}

interface TemplateCardProps {
  template: Template
  selected: boolean
  onSelect: (t: Template) => void
  onPreview?: (t: Template) => void
  onCustomize?: (t: Template) => void
  formData?: Record<string, any>
}

/** Build a sandboxed iframe HTML document from template HTML + CSS + layoutConfig */
function buildThumbnailDoc(html: string, css: string, layout: Record<string, any>, formData?: Record<string, any>, isFront = true): string {
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const font = layout.fontFamily || 'Inter'
  const accent = layout.accent || '#fbbf24'

  const data = {
    name: formData?.name || 'Your Name',
    businessName: formData?.businessName || 'Business Name',
    phone: formData?.phone || '+91 9876543210',
    email: formData?.email || 'you@example.com',
    address: formData?.address || '123 Main Street, City',
    website: formData?.website || 'www.yoursite.com',
    tagline: formData?.tagline || 'Your Tagline Here',
    logoUrl: formData?.logoUrl || '',
    qrCodeUrl: formData?.qrCodeUrl || '',
  }

  const filled = replacePlaceholders(html, data)

  // Inject logo overlay for templates that don't have a built-in logo slot
  const hasLogoSlot = html.includes('{{logoUrl}}') || html.includes('logoUrl')
  const logoUrl = formData?.logoUrl || ''
  const logoOverlay = (logoUrl && !hasLogoSlot)
    ? isFront
      ? `<img src="${logoUrl}" alt="Logo" style="position:fixed;top:8px;right:8px;width:28px;height:28px;object-fit:contain;border-radius:4px;background:rgba(255,255,255,0.15);padding:2px;z-index:100;" />`
      : `<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:100;"><img src="${logoUrl}" alt="Logo" style="width:44px;height:44px;object-fit:contain;border-radius:6px;background:rgba(255,255,255,0.15);padding:2px;" /></div>`
    : ''

  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;font-family:'${font}',sans-serif;overflow:hidden;}
:root{--bg:${bg};--primary:${primary};--font:'${font}',sans-serif;--accent:${accent};}
${css || ''}
</style></head><body>${filled}${logoOverlay}</body></html>`
}

/** Sandboxed iframe that writes HTML directly to contentDocument */
function ThumbnailIframe({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const doc = ref.current.contentDocument
    if (doc) { doc.open(); doc.write(html); doc.close() }
  }, [html])
  return (
    <iframe
      ref={ref}
      title={title}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      sandbox="allow-same-origin"
    />
  )
}

export default function TemplateCard({ template, selected, onSelect, onPreview, onCustomize, formData }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false)
  const [showBack, setShowBack] = useState(false)
  const [imageError, setImageError] = useState(false)

  const layout = template.layoutConfig || {}
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const secondary = layout.secondaryColor || 'rgba(255,255,255,0.7)'
  const font = layout.fontFamily || 'Inter'

  const hasFrontHTML = !!template.frontHTML
  const hasBackHTML = !!template.backHTML

  // Generate thumbnail URL from template name or use provided thumbnailUrl
  const getThumbnailUrl = () => {
    if (template.thumbnailUrl) return template.thumbnailUrl
    
    // Generate thumbnail filename from template name
    const filename = template.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    
    return `/templates/thumbnails/${filename}.jpg`
  }

  const thumbnailUrl = getThumbnailUrl()

  // Extract color palette from layoutConfig
  const colorPalette = template.colorPalette || [
    layout.background || '#1d4ed8',
    layout.accent || '#fbbf24',
    layout.primaryColor || '#ffffff'
  ]

  const frontDoc = hasFrontHTML
    ? buildThumbnailDoc(template.frontHTML!, template.frontCSS || '', layout, formData, true)
    : null
  const backDoc = hasBackHTML
    ? buildThumbnailDoc(template.backHTML!, template.backCSS || '', layout, formData, false)
    : null

  // Reset to front when hover ends
  const handleHoverEnd = () => {
    setHovered(false)
    setShowBack(false)
  }

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={handleHoverEnd}
      onClick={() => onSelect(template)}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 ${
        selected
          ? 'ring-3 ring-blue-600 ring-offset-2 shadow-2xl shadow-blue-200'
          : 'ring-1 ring-gray-200 hover:ring-blue-400 hover:shadow-2xl hover:shadow-blue-100'
      }`}
      style={{
        background: 'linear-gradient(to bottom, #ffffff, #fafafa)',
      }}
    >
      {/* ── Premium Thumbnail Preview Area ── */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
        style={{ aspectRatio: '16/10' }}
      >
        {/* Thumbnail Image (if available and no error) */}
        {!imageError && (
          <div className="absolute inset-0">
            <Image
              src={thumbnailUrl}
              alt={template.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              style={{
                borderRadius: '16px 16px 0 0',
              }}
              onError={() => setImageError(true)}
              loading="lazy"
              quality={90}
            />
            
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Floating card effect shadow */}
            <div className="absolute inset-0 shadow-inner opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.05)' }} />
          </div>
        )}

        {/* Fallback: Iframe-based preview if thumbnail fails */}
        {imageError && hasFrontHTML && (
          <>
            {/* Front face */}
            <div
              style={{
                position: 'absolute', inset: 0,
                opacity: showBack ? 0 : 1,
                transition: 'opacity 0.25s ease',
              }}
            >
              <ThumbnailIframe html={frontDoc!} title={`${template.name} front`} />
            </div>
            {/* Back face */}
            {hasBackHTML && (
              <div
                style={{
                  position: 'absolute', inset: 0,
                  opacity: showBack ? 1 : 0,
                  transition: 'opacity 0.25s ease',
                }}
              >
                <ThumbnailIframe html={backDoc!} title={`${template.name} back`} />
              </div>
            )}
          </>
        )}

        {/* Fallback: layoutConfig-based JSX preview if no HTML */}
        {imageError && !hasFrontHTML && (
          <div
            style={{
              width: '100%', height: '100%',
              background: bg,
              fontFamily: font,
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10" style={{ background: primary, transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-14 h-14 rounded-full opacity-10" style={{ background: primary, transform: 'translate(-30%, 30%)' }} />

            <div>
              <div className="text-[11px] font-bold leading-tight truncate" style={{ color: primary }}>
                {formData?.businessName || template.name}
              </div>
              {formData?.tagline && (
                <div className="text-[8px] mt-0.5 opacity-70 truncate" style={{ color: primary }}>
                  {formData.tagline}
                </div>
              )}
              <div className="text-[9px] mt-1.5 font-medium" style={{ color: secondary }}>
                {formData?.name || 'Your Name'}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[7px] opacity-70 flex items-center gap-1" style={{ color: primary }}>
                <span>📞</span> {formData?.phone || '9876543210'}
              </div>
              <div className="text-[7px] opacity-70 flex items-center gap-1" style={{ color: primary }}>
                <span>✉</span> {formData?.email || 'you@example.com'}
              </div>
            </div>

            <div className="absolute bottom-1.5 right-2 text-[6px] opacity-30" style={{ color: primary }}>
              Made with QuickCard
            </div>
          </div>
        )}

        {/* ── Premium Badges (Top Left) ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {template.isFeatured && (
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg"
            >
              <Sparkles className="w-2.5 h-2.5" /> FEATURED
            </motion.div>
          )}
          {template.isPremium && (
            <motion.div
              initial={{ scale: 0, rotate: 12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.05 }}
              className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-lg"
            >
              <Crown className="w-2.5 h-2.5" /> PRO
            </motion.div>
          )}
        </div>

        {/* ── Hover Overlay with Actions ── */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-between p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-[2px]"
              onClick={e => e.stopPropagation()}
            >
              {/* Front / Back toggle — only shown when backHTML exists */}
              {hasBackHTML && !imageError && (
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md rounded-full p-0.5 mt-1 border border-white/30">
                  <button
                    onClick={e => { e.stopPropagation(); setShowBack(false) }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                      !showBack ? 'bg-white text-gray-900 shadow-md' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setShowBack(true) }}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all ${
                      showBack ? 'bg-white text-gray-900 shadow-md' : 'text-white hover:bg-white/20'
                    }`}
                  >
                    Back
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 w-full px-2">
                {/* Preview button */}
                {onPreview && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={e => { e.stopPropagation(); onPreview(template) }}
                    className="flex items-center justify-center gap-2 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-white transition-all shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5" /> Quick Preview
                  </motion.button>
                )}

                {/* Customize button */}
                {onCustomize && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={e => { 
                      e.stopPropagation()
                      // Save template to store before navigating
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('qc_selected_template_full', JSON.stringify(template))
                      }
                      onCustomize(template)
                    }}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-900/30"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Customize Now
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glossy shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* ── Premium Footer with Details ── */}
      <div className="bg-white px-4 py-3.5 border-t border-gray-100">
        {/* Template name and category */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">
              {template.name}
            </h3>
            <p className="text-[10px] text-gray-400 capitalize mt-0.5">
              {template.category}
            </p>
          </div>
          
          {/* Selection indicator */}
          {selected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 flex-shrink-0 ml-2"
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>

        {/* Description (if available) */}
        {template.description && (
          <p className="text-[10px] text-gray-500 leading-relaxed mb-2.5 line-clamp-2">
            {template.description}
          </p>
        )}

        {/* Color Palette Preview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {colorPalette.slice(0, 4).map((color, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 15 }}
                className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                style={{ 
                  background: color.includes('gradient') ? color : color,
                }}
                title={`Color ${i + 1}`}
              />
            ))}
          </div>

          {/* Hover hint */}
          <div className="text-[9px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Click to select
          </div>
        </div>
      </div>

      {/* Floating shadow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
    </motion.div>
  )
}
