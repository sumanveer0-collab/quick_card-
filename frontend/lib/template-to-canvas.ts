import { CanvasElement } from '@/store/editor.store'
import { TemplateData } from '@/store/template.store'

/**
 * Convert HTML/CSS template to Konva canvas elements
 * This is a simplified converter - you can enhance it based on your template structure
 */
export function convertTemplateToCanvasElements(
  template: TemplateData,
  face: 'front' | 'back' = 'front'
): CanvasElement[] {
  const elements: CanvasElement[] = []
  
  // If template has canvas JSON, use it directly
  const canvasJson = face === 'front' ? template.frontCanvasJson : template.backCanvasJson
  if (canvasJson) {
    return canvasJson
  }
  
  // Otherwise, create basic elements from layout config
  const layout = template.layoutConfig || {}
  const baseY = 100
  const centerX = 562.5 // Half of 1125px canvas width
  
  // Add business name text
  elements.push({
    id: `el_business_name_${Date.now()}`,
    type: 'text',
    text: '',
    x: centerX - 200,
    y: baseY,
    width: 400,
    height: 60,
    fontSize: 32,
    fontFamily: layout.fontFamily || 'Inter',
    fontWeight: 700,
    fill: layout.primaryColor || '#000000',
    align: 'center',
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 1,
  })
  
  // Add tagline/subtitle
  elements.push({
    id: `el_tagline_${Date.now() + 1}`,
    type: 'text',
    text: '',
    x: centerX - 200,
    y: baseY + 70,
    width: 400,
    height: 30,
    fontSize: 16,
    fontFamily: layout.fontFamily || 'Inter',
    fontWeight: 400,
    fill: layout.secondaryColor || layout.primaryColor || '#666666',
    align: 'center',
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    zIndex: 2,
  })
  
  // Add contact info section
  const contactY = baseY + 150
  const contactItems = [
    { icon: '📞', text: '', id: 'phone' },
    { icon: '✉️', text: '', id: 'email' },
    { icon: '🌐', text: '', id: 'website' },
  ]
  
  contactItems.forEach((item, index) => {
    elements.push({
      id: `el_${item.id}_${Date.now() + 3 + index}`,
      type: 'text',
      text: '',
      x: centerX - 150,
      y: contactY + (index * 35),
      width: 300,
      height: 30,
      fontSize: 14,
      fontFamily: layout.fontFamily || 'Inter',
      fontWeight: 400,
      fill: layout.primaryColor || '#333333',
      align: 'center',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 3 + index,
    })
  })
  
  // Add decorative shape (optional)
  if (layout.accent) {
    elements.push({
      id: `el_accent_shape_${Date.now() + 10}`,
      type: 'shape',
      shapeType: 'circle',
      x: 100,
      y: 100,
      width: 80,
      height: 80,
      fill: layout.accent,
      opacity: 0.3,
      rotation: 0,
      visible: true,
      locked: false,
      zIndex: 0,
    })
  }
  
  return elements
}

/**
 * Extract editable fields from template
 */
export function getTemplateEditableFields(template: TemplateData): string[] {
  const fields: string[] = []
  
  // Check HTML for placeholders
  const html = template.frontHTML || ''
  
  if (html.includes('{{businessName}}') || html.includes('businessName')) {
    fields.push('businessName')
  }
  if (html.includes('{{name}}') || html.includes('name')) {
    fields.push('name')
  }
  if (html.includes('{{phone}}') || html.includes('phone')) {
    fields.push('phone')
  }
  if (html.includes('{{email}}') || html.includes('email')) {
    fields.push('email')
  }
  if (html.includes('{{website}}') || html.includes('website')) {
    fields.push('website')
  }
  if (html.includes('{{address}}') || html.includes('address')) {
    fields.push('address')
  }
  if (html.includes('{{tagline}}') || html.includes('tagline')) {
    fields.push('tagline')
  }
  if (html.includes('{{logoUrl}}') || html.includes('logoUrl')) {
    fields.push('logo')
  }
  if (html.includes('{{qrCodeUrl}}') || html.includes('qrCodeUrl')) {
    fields.push('qrCode')
  }
  
  return fields
}

/**
 * Get template color palette
 */
export function getTemplateColors(template: TemplateData): string[] {
  const colors: string[] = []
  const layout = template.layoutConfig || {}
  
  if (layout.background) colors.push(layout.background)
  if (layout.primaryColor) colors.push(layout.primaryColor)
  if (layout.secondaryColor) colors.push(layout.secondaryColor)
  if (layout.accent) colors.push(layout.accent)
  
  // Add from color palette if available
  if (template.colorPalette) {
    colors.push(...template.colorPalette)
  }
  
  // Remove duplicates
  return Array.from(new Set(colors))
}

/**
 * Apply template theme to existing canvas elements
 */
export function applyTemplateTheme(
  elements: CanvasElement[],
  template: TemplateData
): CanvasElement[] {
  const layout = template.layoutConfig || {}
  
  return elements.map(element => {
    const updated = { ...element }
    
    // Update text elements with template fonts and colors
    if (element.type === 'text') {
      if (layout.fontFamily) {
        updated.fontFamily = layout.fontFamily
      }
      if (layout.primaryColor && !element.fill?.startsWith('#')) {
        updated.fill = layout.primaryColor
      }
    }
    
    // Update shapes with template colors
    if (element.type === 'shape' && layout.accent) {
      updated.fill = layout.accent
    }
    
    return updated
  })
}

/**
 * Create default canvas elements for empty template
 */
export function createDefaultCanvasElements(): CanvasElement[] {
  const centerX = 562.5 // Half of 1125px canvas width
  
  return [
    {
      id: `el_default_business_${Date.now()}`,
      type: 'text',
      text: '',
      x: centerX - 200,
      y: 150,
      width: 400,
      height: 80,
      fontSize: 48,
      fontFamily: 'Inter',
      fontWeight: 700,
      fill: '#000000',
      align: 'center',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 1,
    },
    {
      id: `el_default_name_${Date.now() + 1}`,
      type: 'text',
      text: '',
      x: centerX - 150,
      y: 250,
      width: 300,
      height: 40,
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: 600,
      fill: '#3B82F6',
      align: 'center',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 2,
    },
    {
      id: `el_default_title_${Date.now() + 2}`,
      type: 'text',
      text: '',
      x: centerX - 150,
      y: 300,
      width: 300,
      height: 30,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 400,
      fill: '#666666',
      align: 'center',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 3,
    },
    {
      id: `el_default_phone_${Date.now() + 3}`,
      type: 'text',
      text: '',
      x: centerX - 150,
      y: 380,
      width: 300,
      height: 25,
      fontSize: 14,
      fontFamily: 'Inter',
      fontWeight: 400,
      fill: '#333333',
      align: 'center',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 4,
    },
    {
      id: `el_default_email_${Date.now() + 4}`,
      type: 'text',
      text: '',
      x: centerX - 150,
      y: 415,
      width: 300,
      height: 25,
      fontSize: 14,
      fontFamily: 'Inter',
      fontWeight: 400,
      fill: '#333333',
      align: 'center',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 5,
    },
    {
      id: `el_default_website_${Date.now() + 5}`,
      type: 'text',
      text: '',
      x: centerX - 150,
      y: 450,
      width: 300,
      height: 25,
      fontSize: 14,
      fontFamily: 'Inter',
      fontWeight: 400,
      fill: '#333333',
      align: 'center',
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 6,
    },
  ]
}
