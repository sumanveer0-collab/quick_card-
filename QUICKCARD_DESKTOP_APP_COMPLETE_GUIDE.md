# QuickCard Desktop App - Complete UI Flow Guide

## 📱 Overview

This document outlines the complete page-by-page UI flow for the QuickCard Desktop Application, designed to provide a professional business card design experience similar to Canva and Vistaprint.

---

## 🎯 Application Architecture

### Tech Stack
**Frontend:**
- Electron.js (Desktop wrapper)
- React 18+ with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations

**Canvas Engine:**
- Konva.js (already implemented)
- Fabric.js (alternative option)

**Backend:**
- Node.js + NestJS (already implemented)
- MongoDB (already implemented)

**Storage:**
- Cloudinary for images
- Local storage for drafts

---

## 📄 Complete Page Flow

### 1. **Splash Screen** 🚀
**Purpose:** Desktop app loading + branding

**UI Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│          ┌─────────────┐            │
│          │             │            │
│          │  QuickCard  │            │
│          │    Logo     │            │
│          │             │            │
│          └─────────────┘            │
│                                     │
│       [Animated Business Card]     │
│                                     │
│       ━━━━━━━━━━━━━━━━━━━          │
│       Loading... 45%                │
│                                     │
│       Version 1.0.0                 │
│       Initializing Editor...        │
│                                     │
└─────────────────────────────────────┘
```

**Features:**
- Dark gradient background (#1a1a2e → #16213e)
- Glassmorphism logo card
- Smooth fade animation
- Progress bar with percentage
- Version info at bottom

**Duration:** 2-3 seconds

---

### 2. **Welcome / Onboarding Screen** 👋
**Purpose:** First-time user introduction

**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Left Side (50%)        │  Right Side (50%)              │
│                         │                                │
│  ┌──────────────────┐   │  ┌──────────────────────────┐ │
│  │                  │   │  │  Step 1 of 3             │ │
│  │  Large Preview   │   │  │                          │ │
│  │  Business Cards  │   │  │  Create Professional     │ │
│  │  Slider          │   │  │  Business Cards          │ │
│  │                  │   │  │                          │ │
│  └──────────────────┘   │  │  ✓ Thousands of templates│ │
│                         │  │  ✓ AI design support     │ │
│  Gradient Background    │  │  ✓ Easy customization    │ │
│                         │  │                          │ │
│                         │  │  [Next] [Skip Intro]     │ │
│                         │  └──────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**3 Steps:**

**Step 1: Create Professional Business Cards**
- Thousands of templates
- AI design support
- Industry-specific designs

**Step 2: Customize Everything**
- Drag & Drop
- Resize & Rotate
- Text Editing
- Layers system

**Step 3: Export & Print**
- PNG, JPG, PDF, SVG
- CMYK Print Ready
- 300 DPI quality
- Bleed marks

**Buttons:**
- "Get Started" (primary)
- "Skip Intro" (secondary)

---

### 3. **Login Page** 🔐
**Purpose:** User authentication

**Desktop Layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Left Preview (40%)     │  Right Login Form (60%)        │
│                         │                                │
│  ┌──────────────────┐   │  Welcome Back                  │
│  │                  │   │                                │
│  │  Live Card       │   │  ┌──────────────────────────┐ │
│  │  Preview         │   │  │ Email                    │ │
│  │  Template        │   │  └──────────────────────────┘ │
│  │  Slider          │   │                                │
│  │                  │   │  ┌──────────────────────────┐ │
│  └──────────────────┘   │  │ Password                 │ │
│                         │  └──────────────────────────┘ │
│  Gradient Mesh BG       │                                │
│                         │  ☐ Remember Me                 │
│                         │  Forgot Password?              │
│                         │                                │
│                         │  [Login Button]                │
│                         │                                │
│                         │  ─── or continue with ───      │
│                         │                                │
│                         │  [Google] [Apple]              │
│                         │                                │
│                         │  Don't have account? Sign Up   │
└──────────────────────────────────────────────────────────┘
```

**UI Features:**
- Modern shadow cards
- Floating input labels
- Animated login button
- Background mesh gradient
- Social login options

---

### 4. **Signup Page** ✍️
**Purpose:** New user registration

**Form Fields:**
- Full Name
- Business Name
- Email
- Phone
- Password
- Confirm Password

**Right Side Preview:**
- Live generated business card preview
- Updates as user types business name

**UX Feature:**
- Real-time card preview generation
- Password strength indicator
- Email validation
- Phone number formatting

---

### 5. **Main Dashboard** 🏠
**Purpose:** Central hub for all features

**Desktop Structure:**
```
┌──────────────────────────────────────────────────────────┐
│ Sidebar │ Top Navbar                                      │
│ (15%)   │ ┌────────────────────────────────────────────┐ │
│         │ │ Search | Notifications | Profile           │ │
│ Home    │ └────────────────────────────────────────────┘ │
│ Designs │                                                 │
│ Templates│           Hero Banner                          │
│ AI Tools│     "Design Premium Business Cards Faster"     │
│ Brand Kit│     [Create New] [Browse Templates]            │
│ Settings│                                                 │
│         │           Category Grid                         │
│         │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │
│         │  │Corp│ │Mini│ │Luxe│ │Tech│                  │
│         │  └────┘ └────┘ └────┘ └────┘                  │
│         │                                                 │
│         │           Recent Designs                        │
│         │  ┌────────┐ ┌────────┐ ┌────────┐             │
│         │  │Design 1│ │Design 2│ │Design 3│             │
│         │  └────────┘ └────────┘ └────────┘             │
└──────────────────────────────────────────────────────────┘
```

---

### 6. **Sidebar Navigation** 📋
**Menu Items:**
- 🏠 Dashboard
- 🎨 My Designs
- 📄 Templates
- 🎯 Brand Kit
- 📤 Uploads
- 👥 Team
- 🤖 AI Generator
- 💳 Billing
- ⚙️ Settings

**Features:**
- Collapsible sidebar
- Active state highlighting
- Icon + label
- Smooth transitions

---

### 7. **Home Dashboard** 🎯
**Hero Section:**
- Heading: "Design Premium Business Cards Faster"
- Buttons: "Create New Card" | "Browse Templates"

**Template Categories (Grid Layout):**
- Corporate
- Minimal
- Luxury
- Medical
- Real Estate
- Photography
- Tech
- QR Cards

**Recent Designs:**
- Recent projects preview row
- Quick actions (Edit, Duplicate, Delete)

---

### 8. **Templates Page** 📚
**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ Filter Sidebar (20%)  │  Templates Grid (80%)            │
│                       │                                  │
│ Category              │  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ ☐ Corporate           │  │Tmp1│ │Tmp2│ │Tmp3│ │Tmp4│    │
│ ☐ Minimal             │  └────┘ └────┘ └────┘ └────┘    │
│ ☐ Luxury              │                                  │
│                       │  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│ Color                 │  │Tmp5│ │Tmp6│ │Tmp7│ │Tmp8│    │
│ ☐ Blue                │  └────┘ └────┘ └────┘ └────┘    │
│ ☐ Red                 │                                  │
│ ☐ Green               │                                  │
│                       │                                  │
│ Orientation           │                                  │
│ ○ Horizontal          │                                  │
│ ○ Vertical            │                                  │
│                       │                                  │
│ Type                  │                                  │
│ ☐ Premium             │                                  │
│ ☐ Free                │                                  │
└──────────────────────────────────────────────────────────┘
```

**Filter Options:**
- Category
- Color
- Orientation (Horizontal/Vertical)
- Premium/Free
- Modern/Classic

**Template Card Includes:**
- Thumbnail
- Template Name
- Like Button
- Preview Button
- Customize Button

---

### 9. **Template Preview Page** 👁️
**Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ Left Side (60%)         │  Right Side (40%)              │
│                         │                                │
│  ┌──────────────────┐   │  Template Details              │
│  │                  │   │                                │
│  │  Large Card      │   │  Modern Blue Professional      │
│  │  Preview         │   │  Category: Corporate           │
│  │                  │   │                                │
│  │  [Front/Back]    │   │  Options:                      │
│  │                  │   │  ○ Horizontal                  │
│  └──────────────────┘   │  ○ Vertical                    │
│                         │                                │
│  [Zoom Controls]        │  Front/Back Preview:           │
│                         │  [Front] [Back]                │
│                         │                                │
│                         │  Color Themes:                 │
│                         │  ● ● ● ● ●                     │
│                         │                                │
│                         │  [Use Template]                │
│                         │  [Preview Animation]           │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Large card preview
- Front/Back toggle
- Orientation options
- Color theme selector
- Zoom controls
- Animation preview

---

### 10. **Main Editor Page (Core UI)** 🎨
**Full Desktop Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ Top Navbar: File | Edit | View | Help | [Save] [Export]  │
├────────┬──────────────────────────────────┬──────────────┤
│ Left   │      Canvas Area                 │ Right        │
│ Toolbar│                                  │ Properties   │
│ (10%)  │  ┌────────────────────────────┐  │ Panel (20%)  │
│        │  │                            │  │              │
│ Tools: │  │   Business Card Canvas     │  │ Element:     │
│ ▢ Text │  │                            │  │ Text         │
│ ⬜ Shape│  │   [Front Side]             │  │              │
│ 🖼️ Image│  │                            │  │ Font: Inter  │
│ 📷 Upload│  │   Zoom: 100%              │  │ Size: 24px   │
│ 🎨 BG   │  │   Rulers | Grid            │  │ Color: #000  │
│ 📊 Layers│  │                            │  │              │
│        │  └────────────────────────────┘  │ [Apply]      │
│        │                                  │              │
│        │  [Front] [Back] [Zoom ±]         │              │
└────────┴──────────────────────────────────┴──────────────┘
```

---

### 11. **Left Toolbar (Tools Panel)** 🛠️
**Tools:**
- 📄 Templates
- 🔤 Text
- 📤 Upload
- 🏷️ Logo
- ⬜ Shapes
- 🎨 Icons
- 📱 QR Code
- 🎨 Background
- 📊 Layers

**Features:**
- Icon + tooltip
- Active state
- Keyboard shortcuts
- Collapsible sections

---

### 12. **Canvas Area** 🖼️
**Features:**
- Infinite workspace
- Zoom controls (25% - 400%)
- Rulers (horizontal/vertical)
- Snap guides
- Grid system
- Business Card Canvas (3.5" × 2")
- Front side / Back side toggle
- Bleed lines (red)
- Safe area (blue)

**Controls:**
- Pan (Space + Drag)
- Zoom (Ctrl + Mouse Wheel)
- Select (Click)
- Multi-select (Ctrl + Click)

---

### 13. **Element Resize System** 📐
**Features (Like Vistaprint and Canva):**
- 8 resize handles (corners + edges)
- Rotate handle (top center)
- Multi-select with bounding box
- Smart alignment guides
- Snap to grid
- Aspect ratio lock (Shift + Drag)
- Minimum size constraint

**Functions:**
- Corner resize (proportional)
- Edge resize (single dimension)
- Rotate (circular handle)
- Move (drag anywhere)

---

### 14. **Text Editing Panel** ✍️
**Options:**
- Font Family (dropdown with preview)
- Font Size (8px - 200px)
- Bold / Italic / Underline
- Line Height (0.8 - 3.0)
- Letter Spacing (-50 - 200)
- Text Align (Left/Center/Right)
- Text Shadow (X, Y, Blur, Color)
- Gradient Text (Linear/Radial)
- Text Transform (Uppercase/Lowercase/Capitalize)

---

### 15. **Image Editing Panel** 🖼️
**Features:**
- Crop (freeform, square, circle)
- Opacity (0% - 100%)
- Blur (0 - 100)
- Brightness (-100 - +100)
- Contrast (-100 - +100)
- Saturation (-100 - +100)
- Border Radius (0 - 50%)
- Remove Background (AI-powered)
- Shadow (X, Y, Blur, Spread, Color)
- Filters (Grayscale, Sepia, Invert)

---

### 16. **Layers Panel** 📊
**Structure:**
```
Layers
├─ Logo
├─ Name
├─ Phone Number
├─ QR Code
└─ Background
```

**Functions:**
- 🔒 Lock/Unlock
- 👁️ Show/Hide
- 📋 Duplicate
- ⬆️⬇️ Reorder (drag & drop)
- 🗑️ Delete
- 📁 Group
- 🔗 Link

---

### 17. **QR Code Generator Panel** 📱
**Inputs:**
- Website URL
- Contact (vCard)
- WhatsApp
- Email
- Phone
- Text

**Customization:**
- QR Color (foreground)
- Background Color
- Frame Style (none, square, rounded)
- Logo inside QR (upload)
- Error Correction Level (L, M, Q, H)
- Size (100px - 1000px)

---

### 18. **Brand Kit Panel** 🎯
**Save:**
- Brand colors (palette)
- Fonts (primary, secondary)
- Logos (main, alternate)
- Templates (saved)

**UX:**
- One-click apply to all templates
- Sync across designs
- Export brand kit
- Import brand kit

---

### 19. **AI Business Card Generator** 🤖
**Inputs:**
- Business Name
- Industry (dropdown)
- Style (Modern, Classic, Minimal, Bold)
- Colors (auto or custom)
- Include Logo (yes/no)

**AI Output:**
- Auto-generated professional card
- 3 design variations
- Editable in main editor

**Features:**
- GPT-powered design suggestions
- Industry-specific templates
- Color palette generation
- Layout optimization

---

### 20. **Save Template Modal** 💾
**Fields:**
- Template Name
- Category (dropdown)
- Tags (comma-separated)
- Description
- Thumbnail (auto-generated)
- Visibility (Private/Public)

**Buttons:**
- Save Draft
- Publish
- Cancel

---

### 21. **My Designs Page** 📁
**Layout:**
- Grid/List toggle
- Sort by: Date, Name, Modified
- Filter: All, Drafts, Published

**Card Actions:**
- ✏️ Edit
- 📋 Duplicate
- ✏️ Rename
- 🗑️ Delete
- 📥 Download
- 📤 Share

**Features:**
- Bulk actions
- Search designs
- Folder organization

---

### 22. **Export Page** 📤
**Export Formats:**
- PNG (transparent background option)
- JPG (quality slider)
- PDF (vector, print-ready)
- SVG (editable vector)

**Print Options:**
- CMYK color mode
- 300 DPI resolution
- Bleed marks (3mm)
- Crop marks
- Color bars

**Buttons:**
- Download
- Share
- Print
- Save to Cloud

---

### 23. **Share Page** 🔗
**Share Options:**
- Copy Link (public URL)
- Email (send directly)
- WhatsApp
- Facebook
- Twitter
- LinkedIn

**Settings:**
- Allow comments
- Allow downloads
- Password protect
- Expiration date

---

### 24. **Team Collaboration Page** 👥
**Features:**
- Invite team members (email)
- Real-time editing (live cursors)
- Comments system
- Shared folders
- Version history
- Role management (Owner, Editor, Viewer)

**UI:**
- Team member list
- Activity feed
- Permissions matrix

---

### 25. **Premium Upgrade Page** 💎
**Plans:**
- **Free:** 5 designs, basic templates
- **Monthly:** $9.99/month - Unlimited designs, premium templates
- **Yearly:** $49.99/year - Save 58%, all features
- **Lifetime:** $149.99 - One-time payment

**Premium Features:**
- ✓ Premium templates
- ✓ AI generation
- ✓ Unlimited exports
- ✓ Remove watermark
- ✓ Priority support
- ✓ Team collaboration
- ✓ Brand kit
- ✓ Advanced analytics

---

### 26. **Notifications Panel** 🔔
**Notifications:**
- Design saved
- Export completed
- Template published
- Team member joined
- Comment added
- Payment successful

**Features:**
- Mark as read
- Clear all
- Filter by type
- Real-time updates

---

### 27. **Settings Page** ⚙️
**Sections:**

**Account:**
- Profile info
- Email
- Password
- Delete account

**Appearance:**
- Theme (Light/Dark/Auto)
- Language
- Font size
- Accent color

**Shortcuts:**
- Keyboard shortcuts list
- Customize shortcuts

**Billing:**
- Current plan
- Payment method
- Invoices
- Upgrade/Downgrade

**Storage:**
- Used space
- Total space
- Manage files

---

### 28. **Dark/Light Mode** 🌓
**Toggle Feature:**
- Auto switch (system preference)
- Manual toggle
- Smooth transition (0.3s)
- Persistent preference

**Colors:**
- Light: #ffffff, #f8f9fa
- Dark: #1a1a2e, #16213e

---

### 29. **Professional Desktop UX Features** ✨
**Must Add:**
- ↩️ Undo/Redo (Ctrl+Z / Ctrl+Y)
- ⌨️ Keyboard shortcuts (full list)
- 💾 Auto-save (every 30 seconds)
- 📤 Drag-drop uploads
- 🖱️ Right-click context menu
- 📄 Multi-page editing
- 📜 Version history
- 🔍 Search everywhere (Ctrl+K)
- 📋 Copy/Paste (Ctrl+C / Ctrl+V)
- 🔄 Duplicate (Ctrl+D)

---

### 30. **Recommended Desktop Tech Stack** 💻

**Frontend:**
- Electron.js (v28+)
- React 18+ with TypeScript
- Tailwind CSS v3
- Framer Motion

**Canvas Engine:**
- Konva.js (already implemented) ✅
- OR Fabric.js (alternative)

**Backend:**
- Node.js + NestJS ✅
- MongoDB ✅

**Storage:**
- Firebase (real-time sync)
- Cloudinary (image hosting)

**Additional:**
- Zustand (state management)
- React Query (data fetching)
- Socket.io (real-time collaboration)

---

### 31. **Complete Desktop Flow** 🔄

```
Splash Screen
    ↓
Onboarding (first time only)
    ↓
Login / Signup
    ↓
Dashboard
    ↓
Choose Template
    ↓
Preview Template
    ↓
Open Editor
    ↓
Customize Card
    ├─ Add Text
    ├─ Add Images
    ├─ Add Shapes
    ├─ Add QR Code
    └─ Adjust Layers
    ↓
Save Draft
    ↓
Export / Download
    ├─ PNG
    ├─ JPG
    ├─ PDF
    └─ SVG
    ↓
Share
    ├─ Copy Link
    ├─ Email
    └─ Social Media
```

---

## 📱 Mobile App Considerations

### Responsive Breakpoints
- **Desktop:** > 1024px
- **Tablet:** 768px - 1024px
- **Mobile:** < 768px

### Mobile-Specific Features
- Touch gestures (pinch to zoom, swipe)
- Bottom navigation bar
- Simplified toolbar
- Full-screen canvas mode
- Mobile-optimized export

---

## 🎯 Key Success Metrics

### Performance
- App launch time: < 3 seconds
- Canvas rendering: 60 FPS
- Auto-save latency: < 500ms
- Export time: < 5 seconds

### User Experience
- Onboarding completion: > 80%
- Template selection: < 2 minutes
- Design completion: < 10 minutes
- Export success rate: > 95%

---

## 📝 Implementation Priority

### Phase 1 (MVP) - 4 weeks
1. Splash Screen
2. Login/Signup
3. Dashboard
4. Templates Page
5. Main Editor (basic)
6. Export (PNG/JPG)

### Phase 2 - 4 weeks
7. Template Preview
8. Advanced Editor Tools
9. Layers Panel
10. Text Editing
11. Image Editing
12. Save/Load

### Phase 3 - 4 weeks
13. QR Code Generator
14. Brand Kit
15. AI Generator
16. My Designs
17. Share
18. Export (PDF/SVG)

### Phase 4 - 4 weeks
19. Team Collaboration
20. Premium/Upgrade
21. Settings
22. Notifications
23. Dark Mode
24. Keyboard Shortcuts

---

## 🎉 Conclusion

This comprehensive guide provides a complete roadmap for building the QuickCard Desktop Application. Each page is designed with user experience in mind, following modern design principles and best practices from industry leaders like Canva and Vistaprint.

**Total Pages:** 31  
**Estimated Development Time:** 16 weeks (4 months)  
**Team Size:** 3-5 developers

---

**Version:** 1.0.0  
**Last Updated:** May 13, 2026  
**Status:** 📋 Planning Complete - Ready for Development
