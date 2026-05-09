# 🔤 Secuela Font Setup Guide

## ✅ Changes Applied

I've updated your QuickCard app with the styling from your HTML:

### **Default Text Element:**
- **Text**: "GRAPHIC MITRA STUDIO" (uppercase)
- **Font Size**: 48px
- **Font Weight**: Bold
- **Color**: #322F30 (dark gray, matching rgb(50, 47, 48))
- **Alignment**: Center
- **Width**: 850px (to fit the longer text)
- **Height**: 100px (to accommodate larger font)

### **Font Lists Updated:**
- Added "Secuela" to the top of font dropdowns in:
  - `FloatingToolbar.tsx` (VistaPrint style)
  - `CanvaStyleToolbar.tsx` (Canva style)
  - `editor.store.ts` (default element)

---

## 🔤 How to Add Secuela Font

The Secuela font needs to be added to your project. Here are the methods:

### **Method 1: Google Fonts (If Available)**

If Secuela is available on Google Fonts:

1. **Add to `frontend/app/layout.tsx`:**
```typescript
import { Inter, Secuela } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const secuela = Secuela({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-secuela'
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} ${secuela.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

2. **Add to `frontend/tailwind.config.ts`:**
```typescript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        secuela: ['var(--font-secuela)', 'sans-serif'],
      },
    },
  },
}
```

---

### **Method 2: Custom Font Files (Recommended)**

If you have Secuela font files (.woff, .woff2, .ttf):

#### **Step 1: Create Font Directory**
```bash
mkdir -p frontend/public/fonts
```

#### **Step 2: Add Font Files**
Place your Secuela font files in `frontend/public/fonts/`:
```
frontend/public/fonts/
  ├── Secuela-Regular.woff2
  ├── Secuela-Regular.woff
  ├── Secuela-Bold.woff2
  └── Secuela-Bold.woff
```

#### **Step 3: Add Font Face in `frontend/app/globals.css`**
```css
@font-face {
  font-family: 'Secuela';
  src: url('/fonts/Secuela-Regular.woff2') format('woff2'),
       url('/fonts/Secuela-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Secuela';
  src: url('/fonts/Secuela-Bold.woff2') format('woff2'),
       url('/fonts/Secuela-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

---

### **Method 3: Adobe Fonts / Typekit**

If Secuela is from Adobe Fonts:

1. **Add to `frontend/app/layout.tsx` head:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/YOUR_KIT_ID.css" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

2. **Use in CSS:**
```css
.text-secuela {
  font-family: 'Secuela', sans-serif;
}
```

---

### **Method 4: CDN Link (If Available)**

If Secuela is available via CDN:

**Add to `frontend/app/layout.tsx`:**
```typescript
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.cdnfonts.com/css/secuela" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## 🎨 Current Default Styling

Your default text element now has these properties:

```typescript
{
  text: 'GRAPHIC MITRA STUDIO',
  fontSize: 48,
  fontFamily: 'Arial',  // Will use Secuela once font is loaded
  fontWeight: 'bold',
  fill: '#322F30',      // Dark gray (rgb(50, 47, 48))
  align: 'center',
  width: 850,
  height: 100,
}
```

---

## 🔄 Temporary Fallback

Until you add the Secuela font files, the text will use **Arial Bold** as a fallback, which is similar in appearance.

To use Secuela immediately after adding the font:

1. **Update the default element** in `frontend/store/editor.store.ts`:
```typescript
fontFamily: 'Secuela',  // Change from 'Arial' to 'Secuela'
```

---

## 🧪 Testing

### **Step 1: Start the Server**
```bash
cd frontend
npm run dev
```

### **Step 2: Navigate to Customize Page**
```
http://localhost:3000/customize
```

### **Step 3: Verify Default Text**
You should see:
- ✅ Text: "GRAPHIC MITRA STUDIO"
- ✅ Font size: 48px
- ✅ Bold weight
- ✅ Dark gray color (#322F30)
- ✅ Centered alignment

### **Step 4: Test Font Dropdown**
1. Select the text
2. Open font dropdown
3. Verify "Secuela" is at the top of the list
4. Select it to apply (once font is loaded)

---

## 📝 Where to Get Secuela Font

### **Option 1: Purchase/License**
- Check the font foundry where Secuela is available
- Purchase a web font license
- Download the font files

### **Option 2: Check Existing Assets**
- Look in your design files (Figma, Adobe XD, etc.)
- Check if you already have the font files
- Export from design tool if available

### **Option 3: Use Similar Font**
If Secuela is not available, similar fonts:
- **Montserrat Bold** (free, Google Fonts)
- **Poppins Bold** (free, Google Fonts)
- **Raleway Bold** (free, Google Fonts)

---

## 🎯 Quick Setup (If You Have Font Files)

1. **Copy font files to:**
```bash
frontend/public/fonts/Secuela-Bold.woff2
```

2. **Add to `frontend/app/globals.css`:**
```css
@font-face {
  font-family: 'Secuela';
  src: url('/fonts/Secuela-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}
```

3. **Update default in `frontend/store/editor.store.ts`:**
```typescript
fontFamily: 'Secuela',
```

4. **Restart dev server:**
```bash
npm run dev
```

---

## ✅ What's Already Done

- ✅ Default text changed to "GRAPHIC MITRA STUDIO"
- ✅ Font size set to 48px
- ✅ Font weight set to bold
- ✅ Color set to #322F30 (dark gray)
- ✅ Text alignment set to center
- ✅ Container sized appropriately (850×100)
- ✅ "Secuela" added to font dropdowns
- ✅ Text transform to uppercase (automatic in default)

---

## 🚀 Next Steps

1. **Add Secuela font files** (see methods above)
2. **Update fontFamily** to 'Secuela' in editor.store.ts
3. **Test the application**
4. **Verify font renders correctly**

---

## 💡 Pro Tip

If you don't have access to Secuela font, you can use **Montserrat Bold** as a very similar alternative:

```typescript
// In editor.store.ts
fontFamily: 'Montserrat',
fontWeight: 'bold',
```

Montserrat is free and available via Google Fonts, and has a similar geometric, bold appearance to Secuela.

---

**Status**: ✅ Text styling applied, waiting for Secuela font files
**Fallback**: Arial Bold (currently active)
**Next**: Add Secuela font files to complete the setup
