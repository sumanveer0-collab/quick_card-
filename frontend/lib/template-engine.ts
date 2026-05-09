/**
 * QuickCard Template Engine
 * Replaces {{placeholders}} in HTML templates with real user data.
 * XSS-safe: all values are HTML-escaped before injection.
 */

export interface CardData {
  name?: string
  businessName?: string
  phone?: string
  email?: string
  address?: string
  website?: string
  tagline?: string
  logoUrl?: string
  qrCodeUrl?: string
  services?: string[]
  socialLinks?: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
    whatsapp?: string
  }
}

/** Escape HTML special chars to prevent XSS */
function escapeHtml(str: string): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Replace all {{key}} placeholders in template HTML with escaped user data.
 * Unknown placeholders are replaced with empty string.
 */
export function replacePlaceholders(templateHtml: string, data: CardData): string {
  if (!templateHtml) return ''

  const flatMap: Record<string, string> = {
    name:         escapeHtml(data.name || ''),
    businessName: escapeHtml(data.businessName || ''),
    business:     escapeHtml(data.businessName || ''), // alias
    phone:        escapeHtml(data.phone || ''),
    email:        escapeHtml(data.email || ''),
    address:      escapeHtml(data.address || ''),
    website:      escapeHtml(data.website || ''),
    tagline:      escapeHtml(data.tagline || ''),
    logoUrl:      escapeHtml(data.logoUrl || ''),
    qrCodeUrl:    escapeHtml(data.qrCodeUrl || ''),
    services:     data.services?.map(s => escapeHtml(s)).join(', ') || '',
    instagram:    escapeHtml(data.socialLinks?.instagram || ''),
    facebook:     escapeHtml(data.socialLinks?.facebook || ''),
    twitter:      escapeHtml(data.socialLinks?.twitter || ''),
    linkedin:     escapeHtml(data.socialLinks?.linkedin || ''),
    whatsapp:     escapeHtml(data.socialLinks?.whatsapp || data.phone || ''),
    year:         new Date().getFullYear().toString(),
  }

  // Replace {{key}} patterns — unknown keys become empty string
  return templateHtml.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return flatMap[key] ?? ''
  })
}

/**
 * Build a complete HTML document from template html + css + user data.
 * Used for iframe rendering and Puppeteer export.
 */
export function buildCardDocument(
  templateHtml: string,
  templateCss: string,
  data: CardData,
  layoutConfig?: Record<string, any>,
): string {
  const filledHtml = replacePlaceholders(templateHtml, data)
  const filledCss  = replacePlaceholders(templateCss || '', data)

  const bg      = layoutConfig?.background || '#1d4ed8'
  const primary = layoutConfig?.primaryColor || '#ffffff'
  const font    = layoutConfig?.fontFamily || 'Inter'
  const accent  = layoutConfig?.accent || '#fbbf24'

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: ${bg};
      --primary: ${primary};
      --font: '${font}', sans-serif;
      --accent: ${accent};
    }
    html, body {
      width: 100%; height: 100%;
      font-family: var(--font);
      background: var(--bg);
      color: var(--primary);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    ${filledCss}
  </style>
</head>
<body>
  ${filledHtml}
</body>
</html>`
}

/**
 * Generate default HTML template from layoutConfig (for templates without html field).
 * This is the fallback renderer.
 */
export function generateDefaultHtml(data: CardData, layoutConfig: Record<string, any>): string {
  const bg      = layoutConfig?.background || '#1d4ed8'
  const primary = layoutConfig?.primaryColor || '#ffffff'
  const secondary = layoutConfig?.secondaryColor || 'rgba(255,255,255,0.7)'
  const font    = layoutConfig?.fontFamily || 'Inter'
  const accent  = layoutConfig?.accent || '#fbbf24'

  return `
<div style="
  width:100%; height:100%;
  background:${bg};
  font-family:'${font}',sans-serif;
  padding:28px 32px;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  position:relative;
  overflow:hidden;
">
  <!-- Decorative circles -->
  <div style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:${primary};opacity:0.08;"></div>
  <div style="position:absolute;bottom:-30px;left:-30px;width:120px;height:120px;border-radius:50%;background:${primary};opacity:0.08;"></div>
  <!-- Accent bar -->
  <div style="position:absolute;top:0;left:0;width:4px;height:100%;background:${accent};"></div>

  <div>
    <div style="font-size:20px;font-weight:700;color:${primary};line-height:1.2;">${escapeHtml(data.businessName || '')}</div>
    ${data.tagline ? `<div style="font-size:11px;color:${secondary};margin-top:4px;font-style:italic;">${escapeHtml(data.tagline)}</div>` : ''}
    <div style="font-size:14px;font-weight:600;color:${secondary};margin-top:12px;">${escapeHtml(data.name || '')}</div>
  </div>

  <div style="display:flex;flex-direction:column;gap:5px;">
    ${data.phone ? `<div style="font-size:11px;color:${primary};opacity:0.85;display:flex;align-items:center;gap:6px;">📞 ${escapeHtml(data.phone)}</div>` : ''}
    ${data.email ? `<div style="font-size:11px;color:${primary};opacity:0.85;display:flex;align-items:center;gap:6px;">✉ ${escapeHtml(data.email)}</div>` : ''}
    ${data.website ? `<div style="font-size:11px;color:${primary};opacity:0.85;display:flex;align-items:center;gap:6px;">🌐 ${escapeHtml(data.website)}</div>` : ''}
    ${data.address ? `<div style="font-size:11px;color:${primary};opacity:0.85;display:flex;align-items:center;gap:6px;">📍 ${escapeHtml(data.address)}</div>` : ''}
  </div>

  ${data.qrCodeUrl ? `<img src="${escapeHtml(data.qrCodeUrl)}" style="position:absolute;top:16px;right:16px;width:56px;height:56px;border-radius:8px;background:#fff;padding:3px;" />` : ''}
  <div style="position:absolute;bottom:8px;right:12px;font-size:8px;color:${primary};opacity:0.25;">Made with QuickCard</div>
</div>`
}
