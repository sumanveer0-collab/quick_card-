# 🎨 Image Editor Filters - Visual Guide

## 📖 FILTER REFERENCE

Complete guide to all available filters and their effects.

---

## 🔆 OPACITY

**What it does**: Controls transparency of the element

**Range**: 0% to 100%
- **0%** = Completely transparent (invisible)
- **50%** = Semi-transparent
- **100%** = Fully opaque (default)

**Use cases**:
- Create watermark effects
- Layer elements with transparency
- Fade elements into background
- Create ghost/overlay effects

**Technical**: Direct opacity property on Konva element

---

## ☀️ BRIGHTNESS

**What it does**: Makes the element lighter or darker

**Range**: -100 to +100
- **-100** = Maximum darkness (nearly black)
- **0** = Normal brightness (default)
- **+100** = Maximum brightness (nearly white)

**Use cases**:
- Lighten dark images
- Darken overexposed images
- Create mood/atmosphere
- Match lighting across elements

**Technical**: `Konva.Filters.Brighten` with value normalized to -1 to 1

**Example values**:
- `-50` = Noticeably darker
- `-25` = Slightly darker
- `+25` = Slightly brighter
- `+50` = Noticeably brighter

---

## 🎭 CONTRAST

**What it does**: Increases or decreases the difference between light and dark areas

**Range**: -100 to +100
- **-100** = Minimum contrast (flat, washed out)
- **0** = Normal contrast (default)
- **+100** = Maximum contrast (dramatic, punchy)

**Use cases**:
- Make images pop with more contrast
- Soften harsh images with less contrast
- Create dramatic effects
- Improve readability

**Technical**: `Konva.Filters.Contrast` with direct value

**Example values**:
- `-50` = Soft, low contrast
- `-25` = Slightly muted
- `+25` = Slightly enhanced
- `+50` = High contrast, dramatic

---

## 🌈 SATURATION

**What it does**: Controls color intensity

**Range**: -100 to +100
- **-100** = Grayscale (no color)
- **0** = Normal saturation (default)
- **+100** = Maximum saturation (vibrant, intense colors)

**Use cases**:
- Create black & white effects (-100)
- Enhance dull colors
- Create vintage/muted looks
- Make colors pop

**Technical**: `Konva.Filters.HSL` with saturation normalized to 0 to 2 (1 = normal)

**Example values**:
- `-100` = Complete grayscale
- `-50` = Muted, desaturated
- `+25` = Slightly more vibrant
- `+50` = Very vibrant colors

---

## 🌫️ BLUR

**What it does**: Applies gaussian blur effect

**Range**: 0 to 100
- **0** = No blur (default)
- **25** = Slight blur
- **50** = Medium blur
- **100** = Heavy blur

**Use cases**:
- Create depth of field effects
- Soften backgrounds
- Create dreamy/soft effects
- Reduce noise/grain
- Create motion blur illusion

**Technical**: `Konva.Filters.Blur` with radius scaled (value / 5)

**Example values**:
- `10` = Very subtle blur
- `25` = Noticeable soft focus
- `50` = Strong blur
- `75+` = Heavy blur effect

---

## ✨ SHARPEN

**What it does**: Enhances edges and details

**Range**: 0 to 100
- **0** = No sharpening (default)
- **25** = Slight sharpening
- **50** = Medium sharpening
- **100** = Maximum sharpening

**Use cases**:
- Enhance blurry images
- Make text more readable
- Bring out details
- Create crisp, clean look
- Compensate for scaling

**Technical**: `Konva.Filters.Enhance` with value normalized to 0 to 1

**Example values**:
- `15` = Subtle enhancement
- `30` = Noticeable sharpening
- `50` = Strong sharpening
- `75+` = Very sharp (may create artifacts)

**Warning**: Too much sharpening can create halos and artifacts

---

## 🔄 ROTATE

**What it does**: Rotates element 90° clockwise

**Action**: Click to rotate
- Each click rotates 90° more
- 4 clicks = full rotation (360°)

**Use cases**:
- Fix orientation
- Create dynamic layouts
- Adjust element positioning

**Technical**: Updates rotation property by +90 degrees

---

## ↔️ FLIP HORIZONTAL

**What it does**: Mirrors element horizontally (left ↔ right)

**Action**: Click to flip
- Click again to flip back
- Toggle behavior

**Use cases**:
- Mirror images
- Create symmetrical designs
- Fix orientation
- Create reflections

**Technical**: Inverts scaleX property (1 ↔ -1)

---

## ↕️ FLIP VERTICAL

**What it does**: Mirrors element vertically (top ↔ bottom)

**Action**: Click to flip
- Click again to flip back
- Toggle behavior

**Use cases**:
- Mirror images
- Create reflections
- Fix orientation
- Create upside-down effects

**Technical**: Inverts scaleY property (1 ↔ -1)

---

## 🔒 LOCK/UNLOCK

**What it does**: Prevents or allows dragging

**States**:
- **Locked** 🔒 = Cannot drag (orange icon)
- **Unlocked** 🔓 = Can drag (gray icon)

**Use cases**:
- Protect positioned elements
- Prevent accidental moves
- Lock background elements
- Secure final layouts

**Technical**: Sets locked property (true/false)

---

## 👁️ SHOW/HIDE

**What it does**: Toggles element visibility

**States**:
- **Visible** 👁️ = Element shown (eye icon)
- **Hidden** 👁️‍🗨️ = Element hidden (eye-off icon)

**Use cases**:
- Temporarily hide elements
- Compare designs
- Work on specific layers
- Create variations

**Technical**: Sets visible property (true/false)

**Note**: Hidden elements still exist, just not rendered

---

## 📋 DUPLICATE

**What it does**: Creates exact copy of element

**Action**: Click to duplicate
- New element positioned slightly offset
- All properties copied (including filters)

**Use cases**:
- Create multiple similar elements
- Build patterns
- Save time on repetitive elements
- Create variations

**Technical**: Calls duplicateElement from store

---

## 🗑️ DELETE

**What it does**: Removes element from canvas

**Action**: Click to delete
- Confirmation dialog appears
- Permanent action (no undo yet)

**Use cases**:
- Remove unwanted elements
- Clean up canvas
- Start over on specific elements

**Technical**: Calls deleteElement from store

---

## 🔄 RESET ALL

**What it does**: Resets all adjustments to default values

**Resets**:
- Opacity → 100%
- Brightness → 0
- Contrast → 0
- Saturation → 0
- Blur → 0
- Sharpen → 0

**Use cases**:
- Start over with adjustments
- Remove all effects quickly
- Compare before/after
- Fix over-adjusted elements

**Technical**: Updates all filter values to defaults in store

**Note**: Does NOT reset rotation, flip, position, or size

---

## 🎨 COMBINING FILTERS

Filters can be combined for creative effects:

### Popular Combinations

**Vintage Look**:
- Saturation: -30
- Contrast: +15
- Brightness: +10

**Dramatic B&W**:
- Saturation: -100
- Contrast: +40
- Brightness: -10

**Soft Focus**:
- Blur: 15
- Brightness: +10
- Contrast: -10

**Sharp & Vibrant**:
- Sharpen: 30
- Saturation: +25
- Contrast: +15

**Dreamy Effect**:
- Blur: 25
- Brightness: +20
- Saturation: -20
- Opacity: 80%

**High Contrast B&W**:
- Saturation: -100
- Contrast: +60
- Sharpen: 20

---

## ⚡ PERFORMANCE TIPS

1. **Use filters sparingly** - Each filter adds processing
2. **Blur is expensive** - Use lower values when possible
3. **Combine similar adjustments** - Better than multiple small changes
4. **Reset unused filters** - Improves performance
5. **Cache is automatic** - Filters are cached for performance

---

## 🎯 BEST PRACTICES

### For Images
- Start with brightness/contrast before other adjustments
- Use saturation carefully (easy to overdo)
- Sharpen last for best results
- Keep blur under 50 for most uses

### For Icons
- Avoid blur (makes icons unclear)
- Use brightness to match theme
- Saturation can create color variations
- Sharpen can help small icons

### For Shapes
- Filters work but may not be necessary
- Opacity is most useful for shapes
- Blur can create soft shadow effects
- Brightness can create tints

### For Illustrations
- All filters work well
- Saturation great for color variations
- Contrast can enhance details
- Blur for depth effects

---

## 🔍 TROUBLESHOOTING

**Filter not visible?**
- Check if value is at default (0 or 100%)
- Try more extreme values first
- Ensure element is selected

**Performance slow?**
- Reduce blur value
- Use fewer filters simultaneously
- Reset unused filters

**Effect too strong?**
- Use smaller increments (5-10 at a time)
- Reset and start over
- Combine with opacity for subtlety

**Can't see changes?**
- Element might be hidden
- Check if locked
- Ensure adjustment panel is open

---

## 📚 TECHNICAL REFERENCE

### Konva Filters Used

- `Konva.Filters.Brighten` - Brightness adjustment
- `Konva.Filters.Contrast` - Contrast adjustment
- `Konva.Filters.HSL` - Hue/Saturation/Lightness (used for saturation)
- `Konva.Filters.Blur` - Gaussian blur
- `Konva.Filters.Enhance` - Sharpening/enhancement

### Value Ranges

| Filter | UI Range | Konva Range | Conversion |
|--------|----------|-------------|------------|
| Opacity | 0-100% | 0-1 | value / 100 |
| Brightness | -100 to +100 | -1 to +1 | value / 100 |
| Contrast | -100 to +100 | -100 to +100 | direct |
| Saturation | -100 to +100 | 0 to 2 | 1 + (value / 100) |
| Blur | 0 to 100 | 0 to 20 | value / 5 |
| Sharpen | 0 to 100 | 0 to 1 | value / 100 |

---

**Last Updated**: Current Session
**Version**: 1.0.0
**Status**: ✅ Complete
