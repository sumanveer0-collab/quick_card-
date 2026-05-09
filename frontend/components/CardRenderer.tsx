'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { replacePlaceholders, generateDefaultHtml, CardData } from '@/lib/template-engine'

export interface TemplateData {
  _id: string
  name: string
  category: string
  layoutConfig: Record<string, any>
  frontHTML?: string
  backHTML?: string
  frontCSS?: string
  backCSS?: string
  html?: string
  css?: string
}

interface CardRendererProps {
  template: TemplateData
  cardData: CardData
  scale?: number
  showFlip?: boolean
  captureRef?: React.RefObject<HTMLDivElement>
}

function escapeHtml(str: string): string {
  if (!str) return ''
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}

function buildFaceHtml(html: string, css: string, data: CardData, layout: Record<string, any>, isFront = true): string {
  const filled = replacePlaceholders(html, data)
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const font = layout.fontFamily || 'Inter'
  const accent = layout.accent || '#fbbf24'

  // If the template HTML already contains {{logoUrl}} it was replaced above.
  // For templates that don't have a logo slot, inject one as an overlay.
  const hasLogoSlot = html.includes('{{logoUrl}}') || html.includes('logoUrl')
  const logoOverlay = (data.logoUrl && !hasLogoSlot)
    ? isFront
      // Front: small logo top-right corner
      ? `<img src="${data.logoUrl}" alt="Logo" style="position:fixed;top:10px;right:10px;width:36px;height:36px;object-fit:contain;border-radius:6px;background:rgba(255,255,255,0.15);padding:2px;z-index:100;" />`
      // Back: logo centered
      : `<div style="position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;z-index:100;">
           <img src="${data.logoUrl}" alt="Logo" style="width:56px;height:56px;object-fit:contain;border-radius:8px;background:rgba(255,255,255,0.15);padding:3px;" />
         </div>`
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

function FaceIframe({ html, title }: { html: string; title: string }) {
  const ref = useRef<HTMLIFrameElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const doc = ref.current.contentDocument
    if (doc) { doc.open(); doc.write(html); doc.close() }
  }, [html])
  return <iframe ref={ref} title={title} style={{ width: '100%', height: '100%', border: 'none' }} sandbox="allow-same-origin" />
}

function FallbackCard({ data, layout }: { data: CardData; layout: Record<string, any> }) {
  const bg = layout.background || '#1d4ed8'
  const primary = layout.primaryColor || '#ffffff'
  const secondary = layout.secondaryColor || 'rgba(255,255,255,0.7)'
  const accent = layout.accent || '#fbbf24'

  return (
    <div style={{ width: '100%', height: '100%', background: bg, fontFamily: layout.fontFamily || 'Inter', padding: '20px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: primary, opacity: 0.08 }} />
      <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: primary, opacity: 0.08 }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: accent }} />
      <div>
        <p style={{ fontSize: '16px', fontWeight: 800, color: primary, lineHeight: 1.2 }}>{data.businessName || 'Business Name'}</p>
        {data.tagline && <p style={{ fontSize: '9px', color: primary, opacity: 0.7, marginTop: '3px', fontStyle: 'italic' }}>{data.tagline}</p>}
        <p style={{ fontSize: '11px', fontWeight: 600, color: secondary, marginTop: '10px' }}>{data.name || 'Your Name'}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {data.phone && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>📞 {data.phone}</p>}
        {data.email && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>✉ {data.email}</p>}
        {data.website && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>🌐 {data.website}</p>}
        {data.address && <p style={{ fontSize: '9px', color: primary, opacity: 0.85 }}>📍 {data.address}</p>}
      </div>
      {data.qrCodeUrl && <img src={data.qrCodeUrl} alt="QR" style={{ position: 'absolute', top: '12px', right: '12px', width: '44px', height: '44px', borderRadius: '6px', background: '#fff', padding: '2px' }} />}
      {data.logoUrl && !data.qrCodeUrl && <img src={data.logoUrl} alt="Logo" style={{ position: 'absolute', top: '10px', right: '10px', width: '36px', height: '36px', borderRadius: '6px', objectFit: 'contain', background: 'rgba(255,255,255,0.15)', padding: '2px' }} />}
      <div style={{ position: 'absolute', bottom: '6px', right: '10px', fontSize: '7px', color: primary, opacity: 0.25 }}>Made with QuickCard</div>
    </div>
  )
}

export default function CardRenderer({ template, cardData, scale = 1, showFlip = true, captureRef }: CardRendererProps) {
  const [flipped, setFlipped] = useState(false)
  const layout = template.layoutConfig || {}

  const hasFrontHTML = !!(template.frontHTML || template.html)
  const hasBackHTML = !!template.backHTML
  const canFlip = showFlip && hasBackHTML

  const frontHtml = template.frontHTML || template.html || ''
  const frontCss = template.frontCSS || template.css || ''
  const backHtml = template.backHTML || ''
  const backCss = template.backCSS || ''

  const frontDoc = hasFrontHTML ? buildFaceHtml(frontHtml, frontCss, cardData, layout, true) : ''
  const backDoc = hasBackHTML ? buildFaceHtml(backHtml, backCss, cardData, layout, false) : ''

  // The card's natural dimensions at scale=1
  const BASE_W = 336
  const BASE_H = 192

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Flip toggle */}
      {canFlip && (
        <div className="flex items-center gap-2 bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setFlipped(false)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${!flipped ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Front
          </button>
          <button
            onClick={() => setFlipped(true)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${flipped ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Back
          </button>
          <button onClick={() => setFlipped(f => !f)} className="p-1.5 hover:bg-gray-100 rounded-xl transition-colors" title="Flip card">
            <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      )}

      {/*
        Outer wrapper: constrains the visible area to the scaled card size.
        We set explicit width/height so the perspective container never overflows.
        overflow:hidden clips any sub-pixel bleed from the 3D transform.
      */}
      <div
        style={{
          width: `${BASE_W * scale}px`,
          height: `${BASE_H * scale}px`,
          maxWidth: '100%',
          perspective: '1000px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {/* Front face
              The face is rendered at BASE_W × BASE_H, then scaled up via
              transform: scale(scale) with transformOrigin: center so it
              fills the outer container symmetrically without overflowing.
          */}
          <div
            style={{
              position: 'absolute',
              // Center the BASE_W×BASE_H element inside the scaled container
              top: '50%',
              left: '50%',
              width: `${BASE_W}px`,
              height: `${BASE_H}px`,
              marginTop: `-${BASE_H / 2}px`,
              marginLeft: `-${BASE_W / 2}px`,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
            }}
          >
            {/* captureRef wraps the inner content at natural 336×192 for PNG/PDF export */}
            <div ref={captureRef} style={{ width: '100%', height: '100%' }}>
              {hasFrontHTML ? (
                <FaceIframe html={frontDoc} title="Card Front" />
              ) : (
                <FallbackCard data={cardData} layout={layout} />
              )}
            </div>
          </div>

          {/* Back face */}
          {canFlip && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${BASE_W}px`,
                height: `${BASE_H}px`,
                marginTop: `-${BASE_H / 2}px`,
                marginLeft: `-${BASE_W / 2}px`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                transform: `rotateY(180deg) scale(${scale})`,
                transformOrigin: 'center center',
              }}
            >
              <FaceIframe html={backDoc} title="Card Back" />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
