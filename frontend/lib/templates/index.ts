import { CanvasElement } from '@/store/editor.store'
import graphicMitraTemplate from './graphic-mitra-template'
import defaultTemplate from './default-template'
import {
  modernBlueProfessional,
  minimalWhiteElegant,
  creativeGradient,
  luxuryBlackGold,
  modernTech,
} from './premium-templates'
import {
  corporateNavy,
  realEstateElegant,
  medicalClean,
  qrModern,
  photographyStudio,
} from './additional-templates'

export interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  elements: CanvasElement[]
  background: string
}

export const templates: Template[] = [
  {
    id: 'modern-blue-professional',
    name: 'Modern Blue Professional',
    description: 'Clean and professional design perfect for corporate use',
    category: 'professional',
    thumbnail: '/templates/thumbnails/modern-blue-professional.svg',
    elements: modernBlueProfessional,
    background: '#1e40af',
  },
  {
    id: 'minimal-white-elegant',
    name: 'Minimal White Elegant',
    description: 'Ultra-clean minimalist design with elegant typography',
    category: 'minimal',
    thumbnail: '/templates/thumbnails/minimal-white.svg',
    elements: minimalWhiteElegant,
    background: '#ffffff',
  },
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    description: 'Bold gradient design for creative professionals',
    category: 'creative',
    thumbnail: '/templates/thumbnails/creative-gradient.svg',
    elements: creativeGradient,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'luxury-black-gold',
    name: 'Luxury Black Gold',
    description: 'Premium black card with elegant gold accents',
    category: 'professional',
    thumbnail: '/templates/thumbnails/luxury-black-gold.svg',
    elements: luxuryBlackGold,
    background: '#1a1a1a',
  },
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Futuristic design for tech companies and startups',
    category: 'corporate',
    thumbnail: '/templates/thumbnails/modern-tech.svg',
    elements: modernTech,
    background: '#0f172a',
  },
  {
    id: 'corporate-navy',
    name: 'Corporate Navy',
    description: 'Traditional corporate design with navy blue and silver',
    category: 'corporate',
    thumbnail: '/templates/thumbnails/corporate-navy.svg',
    elements: corporateNavy,
    background: '#1e3a8a',
  },
  {
    id: 'real-estate-elegant',
    name: 'Real Estate Elegant',
    description: 'Upscale design perfect for real estate professionals',
    category: 'professional',
    thumbnail: '/templates/thumbnails/real-estate-elegant.svg',
    elements: realEstateElegant,
    background: '#ffffff',
  },
  {
    id: 'medical-clean',
    name: 'Medical Clean',
    description: 'Professional and trustworthy design for healthcare',
    category: 'professional',
    thumbnail: '/templates/thumbnails/medical-clean.svg',
    elements: medicalClean,
    background: '#ffffff',
  },
  {
    id: 'qr-modern',
    name: 'QR Modern',
    description: 'Modern design with prominent QR code for easy scanning',
    category: 'creative',
    thumbnail: '/templates/thumbnails/qr-modern.svg',
    elements: qrModern,
    background: '#ffffff',
  },
  {
    id: 'photography-studio',
    name: 'Photography Studio',
    description: 'Bold black design with image showcase area',
    category: 'creative',
    thumbnail: '/templates/thumbnails/photography-studio.svg',
    elements: photographyStudio,
    background: '#000000',
  },
  {
    id: 'default-card',
    name: 'Default Business Card',
    description: 'Simple and clean business card template',
    category: 'minimal',
    elements: defaultTemplate,
    background: '#FFFFFF',
  },
  {
    id: 'graphic-mitra-studio',
    name: 'Graphic Mitra Studio',
    description: 'Professional business card with bold color blocks and modern typography',
    category: 'creative',
    elements: graphicMitraTemplate,
    background: '#FFFFFF',
  },
]

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((template) => template.id === id)
}

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter((template) => template.category === category)
}

export default templates
