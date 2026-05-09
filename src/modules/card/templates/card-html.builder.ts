import { CardDocument } from '../schemas/card.schema';
import { TemplateDocument } from '../../template/schemas/template.schema';

export function buildCardHtml(
  card: CardDocument,
  template: TemplateDocument,
  printReady = false,
): string {
  const layout = template.layoutConfig || {};
  const bg = layout.background || '#1a1a2e';
  const primaryColor = card.colorTheme?.primary || layout.primaryColor || '#ffffff';
  const secondaryColor = card.colorTheme?.secondary || '#cccccc';
  const fontFamily = layout.fontFamily || 'Inter';
  const textAlign = layout.textAlign || 'left';

  // 3mm bleed in px at 300 DPI = ~35px; at 96 DPI = ~11px
  const bleedPx = printReady ? 35 : 11;
  const cmykFilter = printReady
    ? 'filter: saturate(0.9) contrast(1.05);'
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Business Card</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .card {
      width: 100%;
      height: 100%;
      background: ${bg};
      font-family: '${fontFamily}', sans-serif;
      color: ${primaryColor};
      display: flex;
      flex-direction: ${layout.layout === 'vertical' ? 'column' : 'row'};
      align-items: center;
      justify-content: space-between;
      padding: ${bleedPx}px;
      position: relative;
      overflow: hidden;
      ${cmykFilter}
    }

    .card-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      text-align: ${textAlign};
    }

    .card-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: space-between;
      height: 100%;
    }

    .logo {
      width: ${printReady ? '120px' : '40px'};
      height: ${printReady ? '120px' : '40px'};
      object-fit: contain;
      border-radius: 8px;
      margin-bottom: ${printReady ? '20px' : '6px'};
    }

    .business-name {
      font-size: ${printReady ? '52px' : '17px'};
      font-weight: 700;
      line-height: 1.2;
      color: ${primaryColor};
      letter-spacing: -0.5px;
    }

    .tagline {
      font-size: ${printReady ? '24px' : '8px'};
      font-weight: 400;
      color: ${secondaryColor};
      margin-top: ${printReady ? '8px' : '2px'};
      font-style: italic;
    }

    .owner-name {
      font-size: ${printReady ? '32px' : '10px'};
      font-weight: 600;
      color: ${primaryColor};
      margin-top: ${printReady ? '16px' : '5px'};
    }

    .divider {
      width: ${printReady ? '80px' : '26px'};
      height: ${printReady ? '3px' : '1px'};
      background: ${primaryColor};
      margin: ${printReady ? '16px' : '5px'} 0;
      opacity: 0.6;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: ${printReady ? '8px' : '2px'};
    }

    .contact-item {
      font-size: ${printReady ? '22px' : '7px'};
      color: ${secondaryColor};
      display: flex;
      align-items: center;
      gap: ${printReady ? '8px' : '3px'};
    }

    .services {
      display: flex;
      flex-direction: column;
      gap: ${printReady ? '6px' : '2px'};
      margin-top: ${printReady ? '12px' : '4px'};
    }

    .service-item {
      font-size: ${printReady ? '18px' : '6px'};
      color: ${secondaryColor};
      opacity: 0.8;
    }

    .service-item::before {
      content: '• ';
      color: ${primaryColor};
    }

    .qr-code {
      width: ${printReady ? '150px' : '48px'};
      height: ${printReady ? '150px' : '48px'};
      object-fit: contain;
    }

    /* Print-ready bleed marks */
    ${printReady ? `
    .bleed-mark {
      position: absolute;
      background: rgba(0,0,0,0.3);
    }
    .bleed-top { top: ${bleedPx - 2}px; left: 0; right: 0; height: 1px; }
    .bleed-bottom { bottom: ${bleedPx - 2}px; left: 0; right: 0; height: 1px; }
    .bleed-left { left: ${bleedPx - 2}px; top: 0; bottom: 0; width: 1px; }
    .bleed-right { right: ${bleedPx - 2}px; top: 0; bottom: 0; width: 1px; }
    ` : ''}

    /* Decorative elements */
    .accent-circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.08;
      background: ${primaryColor};
    }
    .accent-1 {
      width: ${printReady ? '300px' : '96px'};
      height: ${printReady ? '300px' : '96px'};
      top: ${printReady ? '-100px' : '-32px'};
      right: ${printReady ? '-80px' : '-26px'};
    }
    .accent-2 {
      width: ${printReady ? '200px' : '64px'};
      height: ${printReady ? '200px' : '64px'};
      bottom: ${printReady ? '-60px' : '-19px'};
      left: ${printReady ? '-40px' : '-13px'};
    }
  </style>
</head>
<body>
  <div class="card">
    <!-- Decorative accents -->
    <div class="accent-circle accent-1"></div>
    <div class="accent-circle accent-2"></div>

    ${printReady ? `
    <div class="bleed-mark bleed-top"></div>
    <div class="bleed-mark bleed-bottom"></div>
    <div class="bleed-mark bleed-left"></div>
    <div class="bleed-mark bleed-right"></div>
    ` : ''}

    <div class="card-left">
      ${card.logoUrl ? `<img class="logo" src="${card.logoUrl}" alt="Logo" />` : ''}
      <div class="business-name">${escapeHtml(card.businessName)}</div>
      ${card.tagline ? `<div class="tagline">${escapeHtml(card.tagline)}</div>` : ''}
      <div class="owner-name">${escapeHtml(card.name)}</div>
      <div class="divider"></div>
      <div class="contact-info">
        <div class="contact-item">📞 ${escapeHtml(card.phone)}</div>
        <div class="contact-item">✉ ${escapeHtml(card.email)}</div>
        ${card.address ? `<div class="contact-item">📍 ${escapeHtml(card.address)}</div>` : ''}
      </div>
      ${card.services?.length ? `
      <div class="services">
        ${card.services.slice(0, 3).map((s) => `<div class="service-item">${escapeHtml(s)}</div>`).join('')}
      </div>` : ''}
    </div>

    ${card.qrCodeUrl ? `
    <div class="card-right">
      <img class="qr-code" src="${card.qrCodeUrl}" alt="QR Code" />
    </div>` : ''}
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
