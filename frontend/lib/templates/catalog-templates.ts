/**
 * catalog-templates.ts
 *
 * Converts the 25 CARD_DESIGNS (SVG 350×200 coordinate space) from
 * BusinessCardMiniPreview into full Konva CanvasElement[] arrays
 * at print resolution (1125×675 canvas with 37.5px bleed).
 *
 * Scale factors:
 *   SVG viewBox  → 350 × 200
 *   Canvas total → 1125 × 675  (with bleed on each side)
 *   Card trim    → 1050 × 600  (inside bleed)
 *   Bleed offset → 37.5px each side
 *
 *   scaleX = 1050 / 350 = 3.0
 *   scaleY = 600  / 200 = 3.0
 *
 * All coordinates are multiplied by 3 and offset by BLEED (37.5).
 */

import { CanvasElement } from '@/store/editor.store'
import { CARD_DESIGNS, CardDesign, CardElement } from '@/components/business-cards/search/BusinessCardMiniPreview'

const SCALE = 3        // 350→1050, 200→600
const BLEED = 37.5     // px offset from canvas edge to trim area

// ─── Coordinate helpers ───────────────────────────────────────────────────────
const sx = (v: number) => v * SCALE + BLEED
const sy = (v: number) => v * SCALE + BLEED
const sw = (v: number) => v * SCALE
const sh = (v: number) => v * SCALE

// Font scale: SVG sizes are in "SVG px" for a 350-wide card.
// At print resolution (1050px wide), we multiply by 3 then apply a
// typographic correction factor so text looks proportional on canvas.
// BrandCrowd-style: headline ~48–72px canvas, contact ~18–24px canvas.
const sf = (v: number) => Math.round(v * SCALE * 0.9)

let _idCounter = 0
const uid = (prefix: string) => `cat_${prefix}_${++_idCounter}_${Math.random().toString(36).slice(2, 7)}`

// ─── Convert a single CardElement → CanvasElement(s) ─────────────────────────
function convertElement(el: CardElement, zIndex: number): CanvasElement | CanvasElement[] | null {
  switch (el.kind) {

    case 'rect':
      return {
        id: uid('rect'),
        type: 'shape',
        shapeType: 'rect',
        x: sx(el.x),
        y: sy(el.y),
        width: sw(el.w),
        height: sh(el.h),
        fill: el.fill,
        stroke: 'none',
        strokeWidth: 0,
        cornerRadius: el.radius ? el.radius * SCALE : 0,
        rotation: 0,
        opacity: el.opacity ?? 1,
        visible: true,
        locked: false,
        zIndex,
      }

    case 'circle': {
      const r = el.r * SCALE
      return {
        id: uid('circle'),
        type: 'shape',
        shapeType: 'circle',
        // Konva circles: x,y is top-left of bounding box
        x: sx(el.cx) - r,
        y: sy(el.cy) - r,
        width: r * 2,
        height: r * 2,
        fill: el.fill,
        stroke: 'none',
        strokeWidth: 0,
        rotation: 0,
        opacity: el.opacity ?? 1,
        visible: true,
        locked: false,
        zIndex,
      }
    }

    case 'line':
      return {
        id: uid('line'),
        type: 'shape',
        shapeType: 'rect',
        x: sx(Math.min(el.x1, el.x2)),
        y: sy(Math.min(el.y1, el.y2)),
        width: sw(Math.abs(el.x2 - el.x1)) || sw(el.width ?? 1),
        height: sh(Math.abs(el.y2 - el.y1)) || sh(el.width ?? 1),
        fill: el.stroke,
        stroke: 'none',
        strokeWidth: 0,
        cornerRadius: 0,
        rotation: 0,
        opacity: el.opacity ?? 1,
        visible: true,
        locked: false,
        zIndex,
      }

    case 'text': {
      const rawX = el.x * SCALE + BLEED
      const rawY = el.y * SCALE + BLEED
      const fSize = sf(el.size)
      const isBold = el.weight === 'bold'

      // Calculate natural text width based on content
      // Bold chars are ~0.62× fontSize wide, normal ~0.52×
      const charW = fSize * (isBold ? 0.62 : 0.52)
      const naturalWidth = Math.ceil(el.text.length * charW) + 32 // +32 for padding
      // Clamp: minimum 2× fontSize, maximum full card width
      const width = Math.min(Math.max(naturalWidth, fSize * 2), sw(340))
      const height = Math.round(fSize * 1.8)

      // Anchor → left-edge x
      let x = rawX
      if (el.align === 'center') x = rawX - width / 2
      if (el.align === 'right')  x = rawX - width

      // Clamp to canvas area
      x = Math.max(BLEED, Math.min(x, BLEED + sw(340) - 40))

      // Y: SVG y is text baseline → convert to top of box
      const y = Math.max(BLEED, rawY - fSize * 0.85)

      return {
        id: uid('text'),
        type: 'text',
        text: el.text,
        x,
        y,
        width,
        height,
        fontSize: fSize,
        fontFamily: 'Inter',
        fontWeight: isBold ? 'bold' : 'normal',
        fill: el.fill,
        align: el.align ?? 'left',
        letterSpacing: el.spacing ? el.spacing * 0.4 : 0,
        lineHeight: 1.2,
        rotation: 0,
        opacity: el.opacity ?? 1,
        visible: true,
        locked: false,
        zIndex,
      }
    }

    case 'triangle':
      // Convert SVG polygon points string to a Konva rect approximation
      // (triangles are decorative shapes — render as small rect)
      return null

    default:
      return null
  }
}

// ─── Convert a full CardDesign → { elements, background } ────────────────────
export interface ResolvedTemplate {
  id: string
  name: string
  background: string
  elements: CanvasElement[]
}

export function resolveCardDesign(design: CardDesign, name: string): ResolvedTemplate {
  _idCounter = 0   // reset counter per design so IDs are stable
  const elements: CanvasElement[] = []
  let z = 0

  for (const el of design.elements) {
    const converted = convertElement(el, z++)
    if (!converted) continue
    if (Array.isArray(converted)) elements.push(...converted)
    else elements.push(converted)
  }

  return {
    id: design.id,
    name,
    background: design.background,
    elements,
  }
}

// ─── Catalog template ID → design ID mapping ─────────────────────────────────
// Maps the templateId values used in catalog.ts → CARD_DESIGNS[x].id
// Multiple catalog items share a templateId so we use the designId from the URL.

const CATALOG_TEMPLATE_ID_TO_DESIGN_ID: Record<string, string> = {
  'corporate-blue-001':    'corp-blue',
  'luxury-black-gold-001': 'luxury-gold',
  'modern-gradient-001':   'creative-purple',
  'minimal-white-001':     'minimal-white',
  'tech-startup-001':      'tech-dark',
  'real-estate-001':       'real-estate',
  'medical-001':           'medical-blue',
  'photography-001':       'photography',
  'restaurant-001':        'restaurant',
  'creative-designer-001': 'orange-bold',
  'qr-business-001':       'qr-modern',
}

// Names for each design ID
const DESIGN_NAMES: Record<string, string> = {
  'corp-blue':       'Corporate Blue Professional',
  'luxury-gold':     'Luxury Black Gold',
  'creative-purple': 'Creative Gradient Purple',
  'minimal-white':   'Minimal White Elegant',
  'tech-dark':       'Tech Dark Cyan',
  'real-estate':     'Real Estate Professional',
  'medical-blue':    'Medical Clean Blue',
  'photography':     'Photography Studio Dark',
  'restaurant':      'Restaurant Warm Orange',
  'navy-split':      'Corporate Navy Professional',
  'rose-elegant':    'Rose Pink Beauty',
  'emerald':         'Emerald Finance',
  'orange-bold':     'Bold Agency Orange',
  'ink-black':       'Studio Noir Minimal',
  'sky-architect':   'Architect Sky Blue',
  'indigo-wave':     'Wave Digital Indigo',
  'teal-consult':    'Teal Consulting',
  'yellow-startup':  'Spark Labs Startup',
  'red-lawyer':      'Red Law Firm',
  'pastel-minimal':  'Pastel Purple Fashion',
  'classic-border':  'Classic Black Border',
  'sunset-gradient': 'Sunset Events Gradient',
  'steel-gray':      'Steel Industries Gray',
  'qr-modern':       'QR Code Modern',
  'vintage-brown':   'Heritage Crafts Vintage',
}

/**
 * Resolve a templateId from the URL to canvas-ready elements.
 *
 * The URL can carry either:
 *   - ?templateId=corporate-blue-001   (catalog templateId)
 *   - ?designId=corp-blue              (catalog designId — more specific)
 *
 * Priority: designId > templateId → CATALOG_TEMPLATE_ID_TO_DESIGN_ID[templateId]
 */
export function resolveTemplateFromUrl(
  templateId: string | null,
  designId: string | null,
): ResolvedTemplate | null {
  // 1. Prefer designId directly
  let targetDesignId = designId ?? null

  // 2. Fall back to mapping from templateId
  if (!targetDesignId && templateId) {
    targetDesignId = CATALOG_TEMPLATE_ID_TO_DESIGN_ID[templateId] ?? null
    // If still not found, try treating templateId AS a designId
    if (!targetDesignId && CARD_DESIGNS.find(d => d.id === templateId)) {
      targetDesignId = templateId
    }
  }

  if (!targetDesignId) return null

  const design = CARD_DESIGNS.find(d => d.id === targetDesignId)
  if (!design) return null

  const name = DESIGN_NAMES[targetDesignId] ?? design.id
  return resolveCardDesign(design, name)
}

// ─── Pre-resolved map (all 25 designs, eager) ────────────────────────────────
// Exported so TemplatesPanel and other components can use it without re-computing.
export const ALL_RESOLVED_TEMPLATES: Record<string, ResolvedTemplate> = Object.fromEntries(
  CARD_DESIGNS.map(d => [d.id, resolveCardDesign(d, DESIGN_NAMES[d.id] ?? d.id)])
)
