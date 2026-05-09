import { CanvasElement } from '@/store/editor.store'
import graphicMitraTemplate from './graphic-mitra-template'

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
    id: 'graphic-mitra-studio',
    name: 'Graphic Mitra Studio',
    description: 'Professional business card with bold color blocks and modern typography',
    category: 'Creative',
    elements: graphicMitraTemplate,
    background: '#FFFFFF',
  },
  // Add more templates here
]

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((template) => template.id === id)
}

export const getTemplatesByCategory = (category: string): Template[] => {
  return templates.filter((template) => template.category === category)
}

export default templates
