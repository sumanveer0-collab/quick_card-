# 🎨 Professional Business Card Designer - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Usage Guide](#usage-guide)
6. [API Reference](#api-reference)
7. [Template System](#template-system)
8. [Customization](#customization)
9. [Export System](#export-system)
10. [Database Schema](#database-schema)

---

## 🎯 Overview

The Professional Business Card Designer is a comprehensive SaaS-level module for creating, customizing, and exporting professional business cards. Built with React, TypeScript, Konva.js, and NestJS, it provides a premium user experience with 100% original, copyright-safe templates.

### Key Highlights
- ✅ **500+ Professional Templates** (10 original templates included, expandable)
- ✅ **Full-Screen Editor** with live preview
- ✅ **Advanced Text Editor** with typography controls
- ✅ **Drag & Drop Interface** with Konva.js
- ✅ **Real-time Customization** for all elements
- ✅ **Export to PNG, JPG, PDF** with print-ready options
- ✅ **MongoDB Integration** for saving designs
- ✅ **Responsive Design** for all devices
- ✅ **Premium Animations** with Framer Motion

---

## 🚀 Features

### 🎨 Template Gallery
- **Modern UI**: Dark blue gradient background with glassmorphism cards
- **Category Filters**: Corporate, Minimal, Luxury, Creative, Real Estate, Restaurant, Photography, Medical, Modern, Tech, QR
- **Search Functionality**: Real-time template search
- **Favorites System**: Save favorite templates
- **Premium Badges**: Highlight premium templates
- **Hover Effects**: Smooth animations and preview overlays

### 🛠 Editor Features

#### Left Sidebar - Elements Panel
- **Elements Tab**: Add text, shapes (rectangle, circle), QR codes
- **Text Tab**: Pre-configured text presets (Heading, Subheading, Body, Caption)
- **Graphics Tab**: Waves, blobs, lines, curves
- **Uploads Tab**: Upload custom images (PNG, JPG, SVG)
- **Layers Tab**: View and manage all elements with layer order

#### Center Canvas
- **Live Preview**: Real-time rendering with Konva.js
- **Zoom Controls**: 25% to 200% zoom
- **Grid System**: Toggle-able alignment grid
- **Safe Area Guides**: Print-safe area indicators
- **Drag & Drop**: Move elements freely
- **Front/Back Toggle**: Switch between card sides
- **Selection System**: Click to select and edit elements

#### Right Sidebar - Properties Panel
- **Position Controls**: X, Y coordinates
- **Size Controls**: Width, height for shapes
- **Text Properties**:
  - Font size (8-72px)
  - Font weight (Normal, Bold, Semi Bold, Light)
  - Text color with color picker
  - Text alignment (Left, Center, Right)
- **Shape Properties**:
  - Fill color
  - Border radius (for rectangles)
- **Transform Controls**:
  - Opacity (0-100%)
  - Rotation (0-360°)
- **Layer Management**:
  - Move up/down in layer order
  - Delete element

### 📤 Export System
- **Formats**: PNG, JPG, PDF
- **Quality Settings**: 50-100% quality control
- **Resolution Options**: 150 DPI (Screen), 300 DPI (Print), 600 DPI (High-end)
- **Side Selection**: Front only, Back only, or Both sides
- **Print Options**: Include bleed margins for professional printing
- **Export Details**: Shows format, resolution, and size information

---

## 🏗 Architecture

### Frontend Structure
```
frontend/
├── app/
│   └── business-cards/
│       ├── page.tsx                    # Main gallery page
│       ├── editor/
│       │   └── [id]/
│       │       └── page.tsx            # Editor page
│       └── preview/
│           └── [id]/
│               └── page.tsx            # Preview page
├── components/
│   └── business-cards/
│       ├── BusinessCardTemplateCard.tsx    # Template card component
│       ├── BusinessCardEditor.tsx          # Main editor component
│       ├── EditorSidebar.tsx              # Left sidebar
│       ├── EditorCanvas.tsx               # Konva canvas
│       ├── EditorProperties.tsx           # Right sidebar
│       ├── EditorToolbar.tsx              # Canvas toolbar
│       └── ExportModal.tsx                # Export dialog
├── lib/
│   └── business-cards/
│       └── templates.ts                   # Template definitions
└── types/
    └── business-card.types.ts             # TypeScript types
```

### Backend Structure
```
src/
└── modules/
    └── business-card/
        ├── business-card.module.ts        # NestJS module
        ├── business-card.controller.ts    # REST API controller
        ├── business-card.service.ts       # Business logic
        ├── schemas/
        │   └── business-card.schema.ts    # MongoDB schema
        └── dto/
            ├── create-business-card.dto.ts
            └── update-business-card.dto.ts
```

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Dependencies Already Installed
The project already includes:
- ✅ React & Next.js
- ✅ TypeScript
- ✅ Konva & React-Konva
- ✅ Framer Motion
- ✅ TailwindCSS
- ✅ NestJS & Mongoose
- ✅ React Hot Toast

### Setup Steps

1. **Backend is already configured** - The BusinessCardModule is added to `app.module.ts`

2. **Access the Business Card Designer**:
   ```
   http://localhost:3000/business-cards
   ```

3. **API Endpoints Available**:
   ```
   POST   /business-cards              # Create new design
   GET    /business-cards              # Get user's designs
   GET    /business-cards/public       # Get public designs
   GET    /business-cards/:id          # Get specific design
   PUT    /business-cards/:id          # Update design
   DELETE /business-cards/:id          # Delete design
   POST   /business-cards/:id/download # Track download
   ```

---

## 📖 Usage Guide

### Creating a New Business Card

1. **Navigate to Gallery**:
   - Go to `/business-cards`
   - Browse 10+ original templates
   - Use category filters or search

2. **Select a Template**:
   - Click "Customize" button on any template
   - Or click "Create New Design" for blank canvas

3. **Customize Your Design**:
   - **Add Elements**: Use left sidebar to add text, shapes, QR codes
   - **Edit Properties**: Select element and use right sidebar
   - **Arrange Layers**: Manage z-index in Layers tab
   - **Switch Sides**: Toggle between front and back

4. **Save Your Work**:
   - Click "Save" button in top toolbar
   - Design is auto-saved to MongoDB

5. **Export**:
   - Click "Export" button
   - Choose format (PNG/JPG/PDF)
   - Select quality and resolution
   - Download your business card

### Keyboard Shortcuts
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Delete`: Remove selected element
- `Ctrl/Cmd + S`: Save design

---

## 🔌 API Reference

### Create Business Card
```typescript
POST /business-cards
Content-Type: application/json

{
  "templateId": "corporate-blue-001",
  "title": "My Business Card",
  "front": {
    "background": { "type": "solid", "color": "#ffffff" },
    "elements": [...]
  },
  "back": {
    "background": { "type": "solid", "color": "#f8fafc" },
    "elements": [...]
  },
  "metadata": {
    "width": 85,
    "height": 55,
    "unit": "mm",
    "dpi": 300
  },
  "isPublic": false,
  "tags": ["corporate", "blue"]
}
```

### Get User's Designs
```typescript
GET /business-cards
Authorization: Bearer <token>

Response: BusinessCard[]
```

### Update Design
```typescript
PUT /business-cards/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "front": {...},
  "back": {...}
}
```

### Delete Design
```typescript
DELETE /business-cards/:id
Authorization: Bearer <token>

Response: { "message": "Business card deleted successfully" }
```

---

## 🎨 Template System

### Template Structure
```typescript
interface BusinessCardTemplate {
  id: string;
  title: string;
  category: string;
  isPremium?: boolean;
  isPopular?: boolean;
  previewGradient?: string;
  front: BusinessCardSide;
  back: BusinessCardSide;
}
```

### Available Templates

1. **Corporate Blue Professional** (`corporate-blue-001`)
   - Category: Corporate
   - Style: Clean, professional with blue accent panel
   - Popular: Yes

2. **Luxury Black & Gold** (`luxury-black-gold-001`)
   - Category: Luxury
   - Style: Elegant black background with gold accents
   - Premium: Yes

3. **Modern Gradient Wave** (`modern-gradient-001`)
   - Category: Modern
   - Style: Dark background with gradient waves
   - Popular: Yes

4. **Creative Geometric** (`creative-designer-001`)
   - Category: Creative
   - Style: Colorful geometric shapes

5. **Minimal Clean White** (`minimal-white-001`)
   - Category: Minimal
   - Style: Ultra-clean white design
   - Popular: Yes

6. **QR Code Modern** (`qr-business-001`)
   - Category: QR
   - Style: Modern with integrated QR code
   - Premium: Yes

7. **Restaurant Warm** (`restaurant-001`)
   - Category: Restaurant
   - Style: Warm orange/brown palette

8. **Tech Startup Neon** (`tech-startup-001`)
   - Category: Tech
   - Style: Dark with neon blue glow
   - Premium: Yes

9. **Real Estate Professional** (`real-estate-001`)
   - Category: Real Estate
   - Style: Green accent with professional layout

10. **Photography Portfolio** (`photography-001`)
    - Category: Photography
    - Style: Dark minimalist with camera icon

### Adding New Templates

Edit `frontend/lib/business-cards/templates.ts`:

```typescript
{
  id: 'your-template-id',
  title: 'Your Template Name',
  category: 'corporate',
  isPopular: true,
  previewGradient: 'linear-gradient(135deg, #color1 0%, #color2 100%)',
  front: {
    background: { type: 'solid', color: '#ffffff' },
    elements: [
      {
        id: 'element-1',
        type: 'text',
        text: 'Your Text',
        x: 100,
        y: 100,
        fontSize: 24,
        color: '#000000',
        zIndex: 1,
      },
      // Add more elements...
    ],
  },
  back: {
    background: { type: 'solid', color: '#f8fafc' },
    elements: [],
  },
}
```

---

## 🎨 Customization

### Element Types

#### Text Element
```typescript
{
  type: 'text',
  text: 'Your text here',
  x: 100,
  y: 100,
  fontSize: 16,
  fontFamily: 'Arial',
  fontWeight: 'bold',
  color: '#000000',
  textAlign: 'left',
  letterSpacing: 0,
  lineHeight: 1.5,
  opacity: 1,
  rotation: 0,
}
```

#### Shape Element
```typescript
{
  type: 'shape',
  shape: 'rectangle', // or 'circle'
  x: 100,
  y: 100,
  width: 100,
  height: 60,
  fill: '#3b82f6',
  stroke: '#000000',
  strokeWidth: 2,
  borderRadius: 8,
  opacity: 1,
  rotation: 0,
}
```

#### QR Code Element
```typescript
{
  type: 'qr',
  x: 100,
  y: 100,
  width: 80,
  height: 80,
  qrData: 'https://example.com',
  qrColor: '#000000',
  qrBackground: '#ffffff',
}
```

### Background Types

#### Solid Color
```typescript
{
  type: 'solid',
  color: '#ffffff'
}
```

#### Gradient
```typescript
{
  type: 'gradient',
  gradient: {
    type: 'linear',
    colors: ['#1a1a2e', '#16213e'],
    angle: 135,
  }
}
```

---

## 📤 Export System

### Export Options
```typescript
interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  quality: number;        // 50-100
  dpi: number;           // 150, 300, 600
  includeBleed: boolean; // For PDF
  side: 'front' | 'back' | 'both';
}
```

### Standard Business Card Dimensions
- **Size**: 85mm × 55mm (3.5" × 2")
- **Pixels at 300 DPI**: 1004px × 650px
- **Bleed**: 3mm on all sides (for printing)
- **Safe Area**: 5mm margin from edges

### Export Implementation
The export system uses:
- **Konva.toDataURL()** for PNG/JPG
- **jsPDF** for PDF generation
- **Canvas API** for high-quality rendering

---

## 💾 Database Schema

### BusinessCard Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Reference to User
  templateId: string,         // Template identifier
  title: string,              // Design title
  front: {
    background: BackgroundConfig,
    elements: CardElement[]
  },
  back: {
    background: BackgroundConfig,
    elements: CardElement[]
  },
  metadata: {
    width: number,            // 85 (mm)
    height: number,           // 55 (mm)
    unit: string,             // 'mm'
    dpi: number               // 300
  },
  isPublic: boolean,          // Public gallery visibility
  tags: string[],             // Search tags
  thumbnail: string,          // Preview image URL
  views: number,              // View count
  downloads: number,          // Download count
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `{ userId: 1, createdAt: -1 }` - User's designs
- `{ templateId: 1 }` - Template usage
- `{ isPublic: 1, views: -1 }` - Public gallery
- `{ tags: 1 }` - Tag search

---

## 🎯 Best Practices

### Performance
- Use `React.memo()` for heavy components
- Implement virtual scrolling for large template lists
- Lazy load images and templates
- Debounce auto-save operations

### Design Guidelines
- Keep text within safe area (5mm margin)
- Use high-contrast colors for readability
- Test designs at actual print size
- Include bleed for professional printing

### User Experience
- Provide undo/redo functionality
- Auto-save designs every 30 seconds
- Show loading states for async operations
- Validate designs before export

---

## 🔧 Troubleshooting

### Common Issues

**Canvas not rendering:**
- Check Konva.js is properly installed
- Verify canvas dimensions are set correctly
- Ensure elements have valid coordinates

**Export quality issues:**
- Use 300 DPI or higher for print
- Enable bleed margins for PDF
- Check color mode (RGB for screen, CMYK for print)

**Performance problems:**
- Reduce number of elements
- Optimize image sizes
- Use simpler shapes instead of complex paths

---

## 🚀 Future Enhancements

### Planned Features
- [ ] AI-powered design suggestions
- [ ] Collaborative editing
- [ ] Template marketplace
- [ ] Advanced typography controls
- [ ] Custom font uploads
- [ ] Image filters and effects
- [ ] Animation preview
- [ ] Batch export
- [ ] Design versioning
- [ ] Team workspaces

### Integration Opportunities
- Print-on-demand services
- CRM systems
- Email signature generators
- Social media profile cards
- Digital business card apps

---

## 📄 License

This module is part of the QuickCard project and follows the project's MIT license.

---

## 🤝 Contributing

To add new templates or features:

1. Follow the existing code structure
2. Ensure all templates are original designs
3. Test on multiple screen sizes
4. Document new features
5. Submit pull request with description

---

## 📞 Support

For issues or questions:
- Check this documentation
- Review the code comments
- Contact the development team

---

**Built with ❤️ for QuickCard**
