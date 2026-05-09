import { ShapeData } from '@/types/graphics.types'

export const BASIC_SHAPES: ShapeData[] = [
  {
    id: 'rectangle',
    type: 'rectangle',
    name: 'Rectangle',
    category: 'basic',
    defaultWidth: 150,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="20" width="80" height="60" fill="currentColor" stroke="none"/>
    </svg>`
  },
  {
    id: 'circle',
    type: 'circle',
    name: 'Circle',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="currentColor" stroke="none"/>
    </svg>`
  },
  {
    id: 'triangle',
    type: 'triangle',
    name: 'Triangle',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,10 90,80 10,80" fill="currentColor" stroke="none"/>
    </svg>`
  },
  {
    id: 'line',
    type: 'line',
    name: 'Line',
    category: 'basic',
    defaultWidth: 150,
    defaultHeight: 4,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'star',
    type: 'star',
    name: 'Star',
    category: 'decorative',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'arrow-right',
    type: 'arrow',
    name: 'Arrow Right',
    category: 'arrows',
    defaultWidth: 120,
    defaultHeight: 60,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="10,30 70,30 70,20 90,50 70,80 70,70 10,70" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'arrow-left',
    type: 'arrow',
    name: 'Arrow Left',
    category: 'arrows',
    defaultWidth: 120,
    defaultHeight: 60,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="90,30 30,30 30,20 10,50 30,80 30,70 90,70" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'arrow-up',
    type: 'arrow',
    name: 'Arrow Up',
    category: 'arrows',
    defaultWidth: 60,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,90 30,30 20,30 50,10 80,30 70,30 70,90" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'arrow-down',
    type: 'arrow',
    name: 'Arrow Down',
    category: 'arrows',
    defaultWidth: 60,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,10 30,70 20,70 50,90 80,70 70,70 70,10" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'hexagon',
    type: 'polygon',
    name: 'Hexagon',
    category: 'basic',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="25,15 75,15 90,50 75,85 25,85 10,50" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'diamond',
    type: 'polygon',
    name: 'Diamond',
    category: 'decorative',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,10 90,50 50,90 10,50" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'heart',
    type: 'polygon',
    name: 'Heart',
    category: 'decorative',
    defaultWidth: 100,
    defaultHeight: 100,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,85 C50,85 20,65 20,45 C20,35 25,25 35,25 C40,25 45,30 50,35 C55,30 60,25 65,25 C75,25 80,35 80,45 C80,65 50,85 50,85 Z" fill="currentColor"/>
    </svg>`
  }
]

export const BUSINESS_SHAPES: ShapeData[] = [
  {
    id: 'speech-bubble',
    type: 'polygon',
    name: 'Speech Bubble',
    category: 'business',
    defaultWidth: 120,
    defaultHeight: 80,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M10,20 Q10,10 20,10 L80,10 Q90,10 90,20 L90,50 Q90,60 80,60 L30,60 L20,75 L25,60 L20,60 Q10,60 10,50 Z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'badge',
    type: 'polygon',
    name: 'Badge',
    category: 'business',
    defaultWidth: 100,
    defaultHeight: 120,
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M20,10 L80,10 Q90,10 90,20 L90,60 L70,75 L50,65 L30,75 L10,60 L10,20 Q10,10 20,10 Z" fill="currentColor"/>
    </svg>`
  }
]

export const ALL_SHAPES = [...BASIC_SHAPES, ...BUSINESS_SHAPES]