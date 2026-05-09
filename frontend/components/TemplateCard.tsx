'use client'
import { motion } from 'framer-motion'
import { Check, Crown, Eye } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { replacePlaceholders } from '@/lib/template-engine'

export interface Template {
  _id: string
  name: string
  category: string
  previewImage: string
  isPremium: boolean
  layoutConfig: Record<string, any>
  frontHTML?: string
  backHTML?: string
  frontCSS?: string
  backCSS?: string
}

interface TemplateCardProps {
  template: Template
  selected: boolean
  onSelect: (t: Template) => void
  onPreview?: (t: Template) => void
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

export default function TemplateCard({ template, selected, onSelect, onPreview, formData }: TemplateCardProps) {
  const [hovered, setHovered] = useState(false)
  const [showBack, setShowBack] = useState(false)

  const layout = template.layoutConfig || {}
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const secondary = layout.secondaryColor || 'rgba(255,255,255,0.7)'
  const font = layout.fontFamily || 'Inter'

  const hasFrontHTML = !!template.frontHTML
  const hasBackHTML = !!template.backHTML

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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={handleHoverEnd}
      onClick={() => onSelect(template)}
      className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 ${
        selected
          ? 'ring-2 ring-blue-600 ring-offset-2 shadow-xl shadow-blue-100'
          : 'ring-1 ring-gray-200 hover:ring-blue-300 hover:shadow-lg'
      }`}
    >
      {/* ── Card Preview Area ── */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '1.75' }}
      >
        {hasFrontHTML ? (
          /* Iframe-based preview for templates with HTML */
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
        ) : (
          /* Fallback: layoutConfig-based JSX preview */
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

        {/* ── Hover Overlay ── */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-between p-2"
            style={{ background: 'rgba(0,0,0,0.45)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Front / Back toggle — only shown when backHTML exists */}
            {hasBackHTML && (
              <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full p-0.5 mt-1">
                <button
                  onClick={e => { e.stopPropagation(); setShowBack(false) }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    !showBack ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setShowBack(true) }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    showBack ? 'bg-white text-gray-900' : 'text-white hover:bg-white/20'
                  }`}
                >
                  Back
                </button>
              </div>
            )}

            {/* Preview button */}
            {onPreview && (
              <button
                onClick={e => { e.stopPropagation(); onPreview(template) }}
                className="flex items-center gap-1.5 bg-white text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors mb-1"
              >
                <Eye className="w-3 h-3" /> Preview
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="bg-white px-3 py-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-800 truncate max-w-[100px]">{template.name}</p>
          <p className="text-[10px] text-gray-400 capitalize">{template.category}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {template.isPremium && (
            <span className="flex items-center gap-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-amber-200">
              <Crown className="w-2.5 h-2.5" /> PRO
            </span>
          )}
          {selected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
