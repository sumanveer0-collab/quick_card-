import { ShapeData } from '@/types/graphics.types'

// ─── Row 1: Basic Shapes ────────────────────────────────────────────────────
export const BASIC_SHAPES: ShapeData[] = [
  {
    id: 'rectangle',
    type: 'rectangle',
    name: 'Rectangle',
    category: 'basic',
    defaultWidth: 150,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="60" fill="currentColor"/></svg>`
  },
  {
    id: 'circle',
    type: 'circle',
    name: 'Circle',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="44" fill="currentColor"/></svg>`
  },
  {
    id: 'triangle',
    type: 'triangle',
    name: 'Triangle',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,85 5,85" fill="currentColor"/></svg>`
  },

  // ─── Row 2 ────────────────────────────────────────────────────────────────
  {
    id: 'line',
    type: 'line',
    name: 'Line',
    category: 'basic',
    defaultWidth: 160,
    defaultHeight: 6,
    svg: `<svg viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="7" width="100" height="6" rx="3" fill="currentColor"/></svg>`
  },
  {
    id: 'star',
    type: 'star',
    name: 'Star',
    category: 'decorative',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/></svg>`
  },
  {
    id: 'arrow-right',
    type: 'arrow',
    name: 'Arrow Right',
    category: 'arrows',
    defaultWidth: 120,
    defaultHeight: 60,
    svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><polygon points="5,20 65,20 65,8 95,30 65,52 65,40 5,40" fill="currentColor"/></svg>`
  },

  // ─── Row 3 ────────────────────────────────────────────────────────────────
  {
    id: 'arrow-left',
    type: 'arrow',
    name: 'Arrow Left',
    category: 'arrows',
    defaultWidth: 120,
    defaultHeight: 60,
    svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><polygon points="95,20 35,20 35,8 5,30 35,52 35,40 95,40" fill="currentColor"/></svg>`
  },
  {
    id: 'arrow-up',
    type: 'arrow',
    name: 'Arrow Up',
    category: 'arrows',
    defaultWidth: 60,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,95 20,35 8,35 30,5 52,35 40,35 40,95" fill="currentColor"/></svg>`
  },
  {
    id: 'arrow-down',
    type: 'arrow',
    name: 'Arrow Down',
    category: 'arrows',
    defaultWidth: 60,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg"><polygon points="20,5 20,65 8,65 30,95 52,65 40,65 40,5" fill="currentColor"/></svg>`
  },

  // ─── Row 4 ────────────────────────────────────────────────────────────────
  {
    id: 'hexagon',
    type: 'polygon',
    name: 'Hexagon',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="25,10 75,10 95,50 75,90 25,90 5,50" fill="currentColor"/></svg>`
  },
  {
    id: 'diamond',
    type: 'polygon',
    name: 'Diamond',
    category: 'decorative',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="currentColor"/></svg>`
  },
  {
    id: 'heart',
    type: 'polygon',
    name: 'Heart',
    category: 'decorative',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,85 C50,85 15,62 15,38 C15,24 24,15 35,15 C42,15 48,19 50,24 C52,19 58,15 65,15 C76,15 85,24 85,38 C85,62 50,85 50,85 Z" fill="currentColor"/></svg>`
  },

  // ─── Row 5: More shapes ───────────────────────────────────────────────────
  {
    id: 'pentagon',
    type: 'polygon',
    name: 'Pentagon',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,36 78,90 22,90 5,36" fill="currentColor"/></svg>`
  },
  {
    id: 'rounded-rect',
    type: 'rectangle',
    name: 'Rounded Rect',
    category: 'basic',
    defaultWidth: 150,
    defaultHeight: 80,
    svg: `<svg viewBox="0 0 100 65" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="90" height="55" rx="18" ry="18" fill="currentColor"/></svg>`
  },
  {
    id: 'cross',
    type: 'polygon',
    name: 'Cross',
    category: 'basic',
    defaultWidth: 80,
    defaultHeight: 80,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M35,5 L65,5 L65,35 L95,35 L95,65 L65,65 L65,95 L35,95 L35,65 L5,65 L5,35 L35,35 Z" fill="currentColor"/></svg>`
  },

  // ─── Row 6: Arrows & Bubbles ──────────────────────────────────────────────
  {
    id: 'double-arrow',
    type: 'arrow',
    name: 'Double Arrow',
    category: 'arrows',
    defaultWidth: 140,
    defaultHeight: 60,
    svg: `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><polygon points="5,30 25,8 25,20 75,20 75,8 95,30 75,52 75,40 25,40 25,52" fill="currentColor"/></svg>`
  },
  {
    id: 'speech-bubble',
    type: 'polygon',
    name: 'Speech Bubble',
    category: 'business',
    defaultWidth: 130,
    defaultHeight: 90,
    svg: `<svg viewBox="0 0 100 85" xmlns="http://www.w3.org/2000/svg"><path d="M8,5 Q8,5 8,5 L92,5 Q95,5 95,8 L95,55 Q95,62 88,62 L38,62 L22,78 L26,62 L12,62 Q5,62 5,55 L5,12 Q5,5 8,5 Z" fill="currentColor"/></svg>`
  },
  {
    id: 'thought-bubble',
    type: 'polygon',
    name: 'Thought Bubble',
    category: 'business',
    defaultWidth: 130,
    defaultHeight: 95,
    svg: `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="35" rx="42" ry="28" fill="currentColor"/><circle cx="30" cy="68" r="7" fill="currentColor"/><circle cx="20" cy="80" r="4.5" fill="currentColor"/><circle cx="13" cy="88" r="3" fill="currentColor"/></svg>`
  },
]

// ─── Decorative / Business ──────────────────────────────────────────────────
export const BUSINESS_SHAPES: ShapeData[] = [
  {
    id: 'badge',
    type: 'polygon',
    name: 'Badge',
    category: 'business',
    defaultWidth: 90,
    defaultHeight: 110,
    svg: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M15,5 L65,5 Q75,5 75,15 L75,65 L60,78 L40,68 L20,78 L5,65 L5,15 Q5,5 15,5 Z" fill="currentColor"/></svg>`
  },
  {
    id: 'octagon',
    type: 'polygon',
    name: 'Octagon',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="currentColor"/></svg>`
  },
]

export const ALL_SHAPES: ShapeData[] = [...BASIC_SHAPES, ...BUSINESS_SHAPES]
