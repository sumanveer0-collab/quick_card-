# Business Card Template Thumbnails

This directory contains thumbnail images for business card templates.

## Specifications

- **Dimensions**: 800x500px (16:10 aspect ratio)
- **Format**: JPG (optimized)
- **Quality**: 90%
- **File Size**: < 200KB per image

## Current Thumbnails

- `modern-blue-professional.jpg` - Modern Blue Professional
- `creative-gradient.jpg` - Creative Gradient
- `modern-tech.jpg` - Modern Tech
- `photography-studio.jpg` - Photography Studio
- `minimal-white.jpg` - Minimal White
- `luxury-black-gold.jpg` - Luxury Black Gold
- `qr-modern.jpg` - QR Modern
- `corporate-navy.jpg` - Corporate Navy
- `real-estate-elegant.jpg` - Real Estate Elegant
- `medical-clean.jpg` - Medical Clean

## Creating New Thumbnails

See `THUMBNAIL_CREATION_GUIDE.md` in the project root for detailed instructions.

## Placeholder SVGs

The SVG files in this directory are placeholders. Replace them with actual
photographic mockups for production use.

To convert SVG to JPG:
```bash
# Using ImageMagick
convert -density 144 -quality 90 input.svg output.jpg

# Using Inkscape
inkscape --export-type=jpg --export-dpi=144 input.svg
```

## Optimization

After creating JPG thumbnails, optimize them:
```bash
# Using ImageOptim (Mac)
imageoptim --quality 90 *.jpg

# Using TinyJPG (Online)
# Visit https://tinyjpg.com and upload files
```
