const fs = require('fs')
const path = require('path')

// Design categories with their placeholders
const designs = {
  shapes: [
    { id: 'standard', name: 'Standard Rectangle', color: '#3B82F6', icon: '▭' },
    { id: 'rounded', name: 'Rounded Corner', color: '#8B5CF6', icon: '▢' },
    { id: 'square', name: 'Square', color: '#EC4899', icon: '■' },
    { id: 'leaf', name: 'Leaf Shape', color: '#10B981', icon: '🍃' },
    { id: 'oval', name: 'Oval', color: '#F59E0B', icon: '⬭' },
  ],
  papers: [
    { id: 'glossy', name: 'Glossy Finish', color: '#06B6D4', icon: '✨' },
    { id: 'matte', name: 'Matte Finish', color: '#6366F1', icon: '▢' },
    { id: 'non-tearable', name: 'Non-Tearable', color: '#14B8A6', icon: '💪' },
    { id: 'spot-uv', name: 'Spot UV', color: '#8B5CF6', icon: '⚡' },
    { id: 'foil', name: 'Foil Stamping', color: '#F59E0B', icon: '✦' },
    { id: 'textured', name: 'Textured Linen', color: '#84CC16', icon: '▦' },
  ],
  specialty: [
    { id: 'qr-code', name: 'QR Code Cards', color: '#3B82F6', icon: '▦' },
    { id: 'nfc', name: 'NFC Smart Cards', color: '#8B5CF6', icon: '📡' },
    { id: 'transparent', name: 'Transparent Cards', color: '#06B6D4', icon: '◇' },
    { id: 'metal', name: 'Metal Cards', color: '#64748B', icon: '⬟' },
  ],
  creative: [
    { id: 'beauty-spa', name: 'Beauty & Spa', color: '#EC4899', icon: '💅' },
    { id: 'fashion', name: 'Fashion & Boutique', color: '#8B5CF6', icon: '👗' },
    { id: 'travel', name: 'Travel & Tourism', color: '#06B6D4', icon: '✈️' },
    { id: 'food', name: 'Food & Catering', color: '#F59E0B', icon: '🍽️' },
  ],
}

// Generate SVG placeholder
function generateSVG(design, category) {
  const width = 800
  const height = 500
  
  // Create gradient
  const gradientId = `grad-${design.id}`
  const color1 = design.color
  const color2 = adjustBrightness(design.color, -20)
  
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#${gradientId})"/>
  
  <!-- Decorative circles -->
  <circle cx="100" cy="80" r="120" fill="white" opacity="0.08"/>
  <circle cx="${width - 100}" cy="${height - 80}" r="150" fill="white" opacity="0.08"/>
  
  <!-- Card mockup -->
  <g transform="translate(${width/2 - 175}, ${height/2 - 105})">
    <rect x="0" y="0" width="350" height="210" rx="12" fill="white" filter="url(#shadow)"/>
    
    <!-- Card content -->
    <text x="25" y="45" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${color1}">
      ${design.name}
    </text>
    <text x="25" y="70" font-family="Arial, sans-serif" font-size="14" fill="#666">
      Premium Business Card
    </text>
    
    <!-- Icon -->
    <text x="175" y="140" font-size="48" text-anchor="middle">
      ${design.icon}
    </text>
    
    <!-- Bottom details -->
    <text x="25" y="185" font-family="Arial, sans-serif" font-size="11" fill="#999">
      QuickCard • ${category.charAt(0).toUpperCase() + category.slice(1)}
    </text>
  </g>
  
  <!-- Category badge -->
  <rect x="30" y="30" width="140" height="32" rx="16" fill="white" opacity="0.95"/>
  <text x="100" y="51" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="${color1}" text-anchor="middle">
    ${category.toUpperCase()}
  </text>
</svg>`
}

// Helper function to adjust color brightness
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1)
}

// Generate all placeholders
console.log('🎨 Generating business card design placeholders...\n')

let totalGenerated = 0

Object.entries(designs).forEach(([category, items]) => {
  const categoryPath = path.join(__dirname, '..', 'frontend', 'public', 'designs', category)
  
  // Ensure directory exists
  if (!fs.existsSync(categoryPath)) {
    fs.mkdirSync(categoryPath, { recursive: true })
  }
  
  items.forEach(design => {
    const svg = generateSVG(design, category)
    const filename = `${design.id}.svg`
    const filepath = path.join(categoryPath, filename)
    
    fs.writeFileSync(filepath, svg)
    console.log(`✓ Generated: ${category}/${filename}`)
    totalGenerated++
  })
})

console.log(`\n✨ Successfully generated ${totalGenerated} design placeholders!`)
console.log('\n📝 Next steps:')
console.log('1. Replace SVG files with actual JPG/PNG images for production')
console.log('2. Update image paths in page.tsx from .svg to .jpg')
console.log('3. Optimize images for web (recommended: 800x500px, <200KB)')
console.log('\n🎯 All placeholders are ready for the business card designs page!')
