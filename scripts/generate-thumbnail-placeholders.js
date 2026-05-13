/**
 * Generate Placeholder Thumbnails for Business Card Templates
 * 
 * This script creates SVG-based placeholder thumbnails that can be used
 * until real photographic thumbnails are created.
 * 
 * Usage: node scripts/generate-thumbnail-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Template definitions with design specifications
const templates = [
  {
    name: 'Modern Blue Professional',
    filename: 'modern-blue-professional.jpg',
    colors: {
      bg: '#1e40af',
      accent: '#fbbf24',
      text: '#ffffff'
    },
    style: 'corporate'
  },
  {
    name: 'Creative Gradient',
    filename: 'creative-gradient.jpg',
    colors: {
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: '#f093fb',
      text: '#ffffff'
    },
    style: 'creative'
  },
  {
    name: 'Modern Tech',
    filename: 'modern-tech.jpg',
    colors: {
      bg: '#0f172a',
      accent: '#06b6d4',
      text: '#ffffff'
    },
    style: 'tech'
  },
  {
    name: 'Photography Studio',
    filename: 'photography-studio.jpg',
    colors: {
      bg: '#000000',
      accent: '#ffffff',
      text: '#ffffff'
    },
    style: 'photography'
  },
  {
    name: 'Minimal White',
    filename: 'minimal-white.jpg',
    colors: {
      bg: '#ffffff',
      accent: '#000000',
      text: '#000000'
    },
    style: 'minimal'
  },
  {
    name: 'Luxury Black Gold',
    filename: 'luxury-black-gold.jpg',
    colors: {
      bg: '#1a1a1a',
      accent: '#d4af37',
      text: '#d4af37'
    },
    style: 'luxury'
  },
  {
    name: 'QR Modern',
    filename: 'qr-modern.jpg',
    colors: {
      bg: '#ffffff',
      accent: '#3b82f6',
      text: '#1f2937'
    },
    style: 'qr'
  },
  {
    name: 'Corporate Navy',
    filename: 'corporate-navy.jpg',
    colors: {
      bg: '#1e3a8a',
      accent: '#c0c0c0',
      text: '#ffffff'
    },
    style: 'corporate'
  },
  {
    name: 'Real Estate Elegant',
    filename: 'real-estate-elegant.jpg',
    colors: {
      bg: '#ffffff',
      accent: '#d4af37',
      text: '#1f2937'
    },
    style: 'real-estate'
  },
  {
    name: 'Medical Clean',
    filename: 'medical-clean.jpg',
    colors: {
      bg: '#ffffff',
      accent: '#0ea5e9',
      text: '#1e40af'
    },
    style: 'medical'
  }
];

/**
 * Generate SVG thumbnail for a template
 */
function generateSVGThumbnail(template) {
  const { name, colors, style } = template;
  
  // Determine if background is gradient
  const isGradient = colors.bg.includes('gradient');
  const bgDef = isGradient 
    ? `<defs>
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>`
    : '';
  
  const bgFill = isGradient ? 'url(#bg-gradient)' : colors.bg;
  
  // Generate style-specific decorations
  let decorations = '';
  
  switch (style) {
    case 'corporate':
      decorations = `
        <circle cx="520" cy="120" r="40" fill="${colors.accent}" opacity="0.3"/>
        <rect x="80" y="280" width="120" height="4" fill="${colors.accent}" rx="2"/>
      `;
      break;
    case 'creative':
      decorations = `
        <circle cx="500" cy="100" r="60" fill="${colors.accent}" opacity="0.2"/>
        <circle cx="120" cy="320" r="40" fill="${colors.accent}" opacity="0.15"/>
        <path d="M 80 150 Q 150 120 220 150" stroke="${colors.accent}" stroke-width="3" fill="none" opacity="0.4"/>
      `;
      break;
    case 'tech':
      decorations = `
        <rect x="450" y="80" width="80" height="80" fill="${colors.accent}" opacity="0.1" rx="8"/>
        <line x1="80" y1="280" x2="200" y2="280" stroke="${colors.accent}" stroke-width="2" opacity="0.5"/>
        <line x1="80" y1="300" x2="180" y2="300" stroke="${colors.accent}" stroke-width="2" opacity="0.3"/>
      `;
      break;
    case 'minimal':
      decorations = `
        <rect x="80" y="100" width="2" height="60" fill="${colors.accent}" opacity="0.3"/>
        <rect x="80" y="280" width="100" height="1" fill="${colors.accent}" opacity="0.2"/>
      `;
      break;
    case 'luxury':
      decorations = `
        <circle cx="300" cy="171" r="50" fill="${colors.accent}" opacity="0.15"/>
        <rect x="80" y="120" width="80" height="2" fill="${colors.accent}" opacity="0.5"/>
      `;
      break;
    case 'qr':
      decorations = `
        <rect x="420" y="100" width="100" height="100" fill="${colors.text}" opacity="0.1" rx="8"/>
        <rect x="440" y="120" width="20" height="20" fill="${colors.text}" opacity="0.3"/>
        <rect x="480" y="120" width="20" height="20" fill="${colors.text}" opacity="0.3"/>
        <rect x="440" y="160" width="20" height="20" fill="${colors.text}" opacity="0.3"/>
        <rect x="480" y="160" width="20" height="20" fill="${colors.text}" opacity="0.3"/>
      `;
      break;
    default:
      decorations = `
        <circle cx="500" cy="120" r="50" fill="${colors.accent}" opacity="0.2"/>
      `;
  }
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
  ${bgDef}
  
  <!-- Background -->
  <rect width="800" height="500" fill="#f5f5f5"/>
  
  <!-- Card with shadow -->
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="16"/>
      <feOffset dx="0" dy="12" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.12"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Business Card -->
  <rect x="100" y="78.5" width="600" height="343" rx="16" fill="${bgFill}" filter="url(#shadow)"/>
  
  <!-- Decorative elements -->
  ${decorations}
  
  <!-- Company Name -->
  <text x="300" y="200" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${colors.text}" text-anchor="middle">
    ${name.split(' ')[0].toUpperCase()}
  </text>
  <text x="300" y="235" font-family="Arial, sans-serif" font-size="24" font-weight="normal" fill="${colors.text}" text-anchor="middle" opacity="0.8">
    ${name.split(' ').slice(1).join(' ')}
  </text>
  
  <!-- Contact Info -->
  <text x="80" y="300" font-family="Arial, sans-serif" font-size="12" fill="${colors.text}" opacity="0.7">
    Your Name
  </text>
  <text x="80" y="320" font-family="Arial, sans-serif" font-size="10" fill="${colors.text}" opacity="0.6">
    +91 98765 43210
  </text>
  <text x="80" y="335" font-family="Arial, sans-serif" font-size="10" fill="${colors.text}" opacity="0.6">
    you@example.com
  </text>
  
  <!-- Shine effect -->
  <rect x="100" y="78.5" width="600" height="343" rx="16" fill="url(#shine)" opacity="0.1"/>
  <defs>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
    </linearGradient>
  </defs>
</svg>`;
  
  return svg;
}

/**
 * Save SVG as file
 */
function saveSVG(template, svg) {
  const outputDir = path.join(__dirname, '..', 'frontend', 'public', 'templates', 'thumbnails');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save as SVG (can be converted to JPG later)
  const svgFilename = template.filename.replace('.jpg', '.svg');
  const svgPath = path.join(outputDir, svgFilename);
  
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ Generated: ${svgFilename}`);
}

/**
 * Generate README for thumbnails directory
 */
function generateReadme() {
  const readme = `# Business Card Template Thumbnails

This directory contains thumbnail images for business card templates.

## Specifications

- **Dimensions**: 800x500px (16:10 aspect ratio)
- **Format**: JPG (optimized)
- **Quality**: 90%
- **File Size**: < 200KB per image

## Current Thumbnails

${templates.map(t => `- \`${t.filename}\` - ${t.name}`).join('\n')}

## Creating New Thumbnails

See \`THUMBNAIL_CREATION_GUIDE.md\` in the project root for detailed instructions.

## Placeholder SVGs

The SVG files in this directory are placeholders. Replace them with actual
photographic mockups for production use.

To convert SVG to JPG:
\`\`\`bash
# Using ImageMagick
convert -density 144 -quality 90 input.svg output.jpg

# Using Inkscape
inkscape --export-type=jpg --export-dpi=144 input.svg
\`\`\`

## Optimization

After creating JPG thumbnails, optimize them:
\`\`\`bash
# Using ImageOptim (Mac)
imageoptim --quality 90 *.jpg

# Using TinyJPG (Online)
# Visit https://tinyjpg.com and upload files
\`\`\`
`;
  
  const outputDir = path.join(__dirname, '..', 'frontend', 'public', 'templates', 'thumbnails');
  const readmePath = path.join(outputDir, 'README.md');
  
  fs.writeFileSync(readmePath, readme);
  console.log('✓ Generated: README.md');
}

/**
 * Main execution
 */
function main() {
  console.log('🎨 Generating placeholder thumbnails...\n');
  
  templates.forEach(template => {
    const svg = generateSVGThumbnail(template);
    saveSVG(template, svg);
  });
  
  generateReadme();
  
  console.log('\n✅ Done! Generated', templates.length, 'placeholder thumbnails');
  console.log('\n📝 Next steps:');
  console.log('1. Convert SVG files to JPG using ImageMagick or Inkscape');
  console.log('2. Replace with actual photographic mockups');
  console.log('3. Optimize JPG files to < 200KB');
  console.log('4. Test in the template gallery');
  console.log('\nSee THUMBNAIL_CREATION_GUIDE.md for detailed instructions.');
}

// Run the script
main();
