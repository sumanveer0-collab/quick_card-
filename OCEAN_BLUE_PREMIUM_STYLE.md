# Ocean Blue Premium - QuickCard Style Documentation

## Template Overview
**Name**: Ocean Blue Premium  
**Category**: Creative  
**Type**: Premium Modern Business Card  
**Status**: ✅ Implemented

---

## Style Settings (QuickCard Compatible)

```json
{
  "background": "linear-gradient(135deg, #0369a1, #0891b2)",
  "textColor": "#e0f2fe",
  "secondaryTextColor": "rgba(224,242,254,0.7)",
  "accentColor": "#fbbf24",
  "fontFamily": "Poppins",
  "borderRadius": "16px",
  "shadow": "0 10px 30px rgba(0,0,0,0.15)",
  "overlayEffect": "soft-circle-glow",
  "layout": "modern-corporate",
  "logoPosition": "top-right",
  "divider": true
}
```

---

## Design Specifications

### Background
- **Type**: Linear gradient
- **Angle**: 135 degrees
- **Color 1**: `#0369a1` (Sky Blue 700)
- **Color 2**: `#0891b2` (Cyan 600)
- **Effect**: Smooth premium glossy appearance
- **Overlay**: Subtle transparent circle (120px, rgba(255,255,255,0.12)) on top-right corner

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Business Name**: 
  - Size: 17px
  - Weight: 700 (Bold)
  - Color: #e0f2fe
  - Letter spacing: -0.3px
- **Tagline**:
  - Size: 9px
  - Color: rgba(224,242,254,0.7)
  - Style: Italic
  - Letter spacing: 0.5px
- **Contact Details**:
  - Size: 10px
  - Weight: 500 (Medium)
  - Color: #e0f2fe

### Color Palette
- **Primary Text**: `#e0f2fe` (Sky 100)
- **Secondary Text**: `rgba(224,242,254,0.7)` (Sky 100 with 70% opacity)
- **Accent/Highlights**: `#fbbf24` (Amber 400)
- **Icon Background**: `rgba(251,191,36,0.2)` (Amber with transparency)

### Layout Structure

#### Front Face
```
┌─────────────────────────────────────┐
│ Business Name          [Logo Box]   │
│ Tagline                              │
│ ━━━━ (Divider)                      │
│                                      │
│                                      │
│ 📞 Phone                            │
│ ✉ Email                             │
│ 🌐 Website                          │
│ 📍 Address                          │
└─────────────────────────────────────┘
```

#### Back Face
```
┌─────────────────────────────────────┐
│                                      │
│          [Logo Container]            │
│         BUSINESS NAME                │
│           tagline                    │
│                                      │
│            [QR Code]                 │
│                                      │
└─────────────────────────────────────┘
```

### Visual Effects

#### Glassmorphism
- **Logo Container**: 
  - Background: `rgba(255,255,255,0.15)`
  - Backdrop filter: `blur(10px)`
  - Border radius: 12px
  - Shadow: `0 4px 12px rgba(0,0,0,0.1)`

#### Rounded Corners
- **Card**: 16px border radius
- **Logo container**: 12px border radius
- **Icons**: 50% (circular)
- **Divider**: 2px border radius

#### Shadows
- **Card**: `0 10px 30px rgba(0,0,0,0.15)`
- **Logo container**: `0 4px 12px rgba(0,0,0,0.1)`
- **Divider**: `0 2px 8px rgba(251,191,36,0.3)`

#### Icons
- **Size**: 16px × 16px
- **Shape**: Circular
- **Background**: `rgba(251,191,36,0.2)`
- **Color**: #fbbf24
- **Emoji size**: 8px

### Dimensions
- **Card Size**: 336px × 192px (standard business card ratio)
- **Logo (Front)**: 52px × 52px
- **Logo (Back)**: 68px × 68px
- **QR Code**: 52px × 52px
- **Divider**: 48px × 2px

---

## Implementation Details

### Template Variables (Placeholders)
- `{{businessName}}` - Company/Business name
- `{{tagline}}` - Business tagline or slogan
- `{{name}}` - Contact person name
- `{{phone}}` - Phone number
- `{{email}}` - Email address
- `{{website}}` - Website URL
- `{{address}}` - Physical address
- `{{logoUrl}}` - Logo image URL
- `{{qrCodeUrl}}` - QR code image URL

### Responsive Features
- Logo fallback: Gradient background with business initials if no logo provided
- QR code fallback: Dashed border placeholder if no QR code provided
- Text wrapping: Address field supports multi-line text
- Flexible spacing: Maintains balanced layout across different content lengths

---

## Print-Ready Specifications

### Output Quality
- **Resolution**: Ultra HD preview
- **Format**: Professional print-ready appearance
- **Color Mode**: RGB (web), CMYK-ready for print conversion
- **Bleed**: Supports 3mm bleed for professional printing

### Professional Features
- Clean UI appearance
- Minimal corporate style
- High contrast for readability
- Professional color scheme
- Modern design language

---

## Usage in QuickCard App

### Template Location
File: `src/modules/template/template.service.ts`

### Template Constants
- `oceanBluePremiumFront` - Front face HTML
- `oceanBluePremiumBack` - Back face HTML

### Database Entry
```javascript
{
  name: 'Ocean Blue Premium',
  category: TemplateCategory.CREATIVE,
  isPremium: false,
  previewImage: 'https://placehold.co/400x240/0369a1/e0f2fe?text=Ocean+Blue+Premium',
  layoutConfig: {
    background: 'linear-gradient(135deg,#0369a1,#0891b2)',
    primaryColor: '#e0f2fe',
    secondaryColor: 'rgba(224,242,254,0.7)',
    fontFamily: 'Poppins',
    accent: '#fbbf24',
  },
  frontHTML: oceanBluePremiumFront,
  backHTML: oceanBluePremiumBack,
  frontCSS: '',
  backCSS: '',
  isActive: true,
}
```

---

## Design Philosophy

### Modern Corporate Identity
- Professional yet approachable
- Clean and uncluttered
- Focus on essential information
- Premium feel without being ostentatious

### Visual Hierarchy
1. Business name (most prominent)
2. Logo (visual anchor)
3. Contact information (easily scannable)
4. Tagline (supporting context)

### Accessibility
- High contrast ratios for text readability
- Clear icon indicators for contact methods
- Adequate spacing between elements
- Legible font sizes

---

## Compatibility

### Browser Support
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

### Export Formats
- ✅ PNG (high resolution)
- ✅ PDF (print-ready)
- ✅ HTML preview
- ✅ Digital sharing

---

## Version History

**v1.0** (Current)
- Initial implementation
- Glassmorphism effects
- Modern gradient background
- Professional layout
- Print-ready specifications

---

*Created for QuickCard - Professional Business Card Generator*
