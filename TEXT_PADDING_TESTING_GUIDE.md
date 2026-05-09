# Text Padding & Alignment Testing Guide

## ✅ IMPLEMENTATION STATUS: COMPLETE

All text padding and alignment features have been successfully implemented. This guide helps verify the implementation is working correctly.

---

## 🧪 TESTING CHECKLIST

### 1. **Text Padding Tests**

#### Test 1.1: Visual Padding
- [ ] Open `/customize` page
- [ ] Add a text element to canvas
- [ ] Select the text element
- [ ] **VERIFY**: Blue selection border is visible
- [ ] **VERIFY**: Subtle blue background shows padding area (12px horizontal, 8px vertical)
- [ ] **VERIFY**: Text content does NOT touch the selection border edges

#### Test 1.2: Padding During Resize
- [ ] Select a text element
- [ ] Drag a corner resize handle to make it larger
- [ ] **VERIFY**: Text maintains 12px/8px padding from edges
- [ ] Drag a corner resize handle to make it smaller
- [ ] **VERIFY**: Padding is still maintained
- [ ] **VERIFY**: Text wraps naturally within the padded area

#### Test 1.3: Padding During Zoom
- [ ] Add text element
- [ ] Use zoom controls to zoom in (150%)
- [ ] **VERIFY**: Padding scales proportionally
- [ ] Zoom out (50%)
- [ ] **VERIFY**: Padding still visible and proportional

---

### 2. **Horizontal Alignment Tests**

#### Test 2.1: Left Alignment
- [ ] Add text element
- [ ] Select it
- [ ] Click "Align Left" button in floating toolbar
- [ ] **VERIFY**: Text aligns to left side (with padding)
- [ ] **VERIFY**: Button shows active state (blue background)

#### Test 2.2: Center Alignment
- [ ] Select text element
- [ ] Click "Align Center" button
- [ ] **VERIFY**: Text centers horizontally (within padded area)
- [ ] **VERIFY**: Button shows active state

#### Test 2.3: Right Alignment
- [ ] Select text element
- [ ] Click "Align Right" button
- [ ] **VERIFY**: Text aligns to right side (with padding)
- [ ] **VERIFY**: Button shows active state

---

### 3. **Vertical Alignment Tests**

#### Test 3.1: Top Alignment
- [ ] Add text element with height > text height
- [ ] Select it
- [ ] Click "Align Top" button (⬆ icon)
- [ ] **VERIFY**: Text aligns to top (with padding)
- [ ] **VERIFY**: Button shows active state

#### Test 3.2: Middle Alignment
- [ ] Select text element
- [ ] Click "Align Middle" button (↕ icon)
- [ ] **VERIFY**: Text centers vertically
- [ ] **VERIFY**: Button shows active state (default)

#### Test 3.3: Bottom Alignment
- [ ] Select text element
- [ ] Click "Align Bottom" button (⬇ icon)
- [ ] **VERIFY**: Text aligns to bottom (with padding)
- [ ] **VERIFY**: Button shows active state

---

### 4. **Combined Alignment Tests**

Test all 9 combinations:

#### Test 4.1: Top-Left
- [ ] Set vertical: top, horizontal: left
- [ ] **VERIFY**: Text in top-left corner (with padding)

#### Test 4.2: Top-Center
- [ ] Set vertical: top, horizontal: center
- [ ] **VERIFY**: Text at top, centered horizontally

#### Test 4.3: Top-Right
- [ ] Set vertical: top, horizontal: right
- [ ] **VERIFY**: Text in top-right corner

#### Test 4.4: Middle-Left
- [ ] Set vertical: middle, horizontal: left
- [ ] **VERIFY**: Text centered vertically, left aligned

#### Test 4.5: Middle-Center
- [ ] Set vertical: middle, horizontal: center
- [ ] **VERIFY**: Text perfectly centered (default)

#### Test 4.6: Middle-Right
- [ ] Set vertical: middle, horizontal: right
- [ ] **VERIFY**: Text centered vertically, right aligned

#### Test 4.7: Bottom-Left
- [ ] Set vertical: bottom, horizontal: left
- [ ] **VERIFY**: Text in bottom-left corner

#### Test 4.8: Bottom-Center
- [ ] Set vertical: bottom, horizontal: center
- [ ] **VERIFY**: Text at bottom, centered horizontally

#### Test 4.9: Bottom-Right
- [ ] Set vertical: bottom, horizontal: right
- [ ] **VERIFY**: Text in bottom-right corner

---

### 5. **Resize Behavior Tests**

#### Test 5.1: Stable Font Size
- [ ] Add text with fontSize: 24
- [ ] Note the font size
- [ ] Resize container to 2x width
- [ ] **VERIFY**: Font size is still 24 (unchanged)
- [ ] Resize container to 0.5x width
- [ ] **VERIFY**: Font size is still 24

#### Test 5.2: Text Wrapping
- [ ] Add text: "This is a long text that should wrap"
- [ ] Make container narrow
- [ ] **VERIFY**: Text wraps to multiple lines
- [ ] **VERIFY**: No horizontal scrolling
- [ ] **VERIFY**: Padding maintained on all sides

#### Test 5.3: Minimum Size Constraints
- [ ] Try to resize text very small
- [ ] **VERIFY**: Cannot resize below 60px width
- [ ] **VERIFY**: Cannot resize below 30px height
- [ ] **VERIFY**: Resize handles stop at minimum

#### Test 5.4: No Distortion
- [ ] Add text element
- [ ] Resize diagonally (corner handle)
- [ ] **VERIFY**: Text does NOT stretch or distort
- [ ] **VERIFY**: Text remains crisp and readable
- [ ] **VERIFY**: Only container size changes

---

### 6. **Selection & Visual Feedback Tests**

#### Test 6.1: Selection Border
- [ ] Click on text element
- [ ] **VERIFY**: Blue border appears (2px solid)
- [ ] **VERIFY**: Border has 4px corner radius
- [ ] **VERIFY**: Border does NOT overlap text content

#### Test 6.2: Padding Indicator
- [ ] Select text element
- [ ] **VERIFY**: Subtle blue background (5% opacity) shows padding area
- [ ] **VERIFY**: Padding area is clearly visible
- [ ] Deselect element
- [ ] **VERIFY**: Padding indicator disappears

#### Test 6.3: Transform Handles
- [ ] Select text element
- [ ] **VERIFY**: 6 resize handles visible (corners + middle sides)
- [ ] **VERIFY**: Handles are 8px size
- [ ] **VERIFY**: Handles have blue stroke, white fill
- [ ] **VERIFY**: Rotation handle visible at top

---

### 7. **Safe Area Detection Tests**

#### Test 7.1: Inside Safe Area
- [ ] Add text element in center of canvas
- [ ] **VERIFY**: Normal blue selection border
- [ ] **VERIFY**: No warning indicators

#### Test 7.2: Outside Safe Area
- [ ] Drag text element outside safe area (green dashed line)
- [ ] **VERIFY**: Orange dashed border appears
- [ ] **VERIFY**: Toast notification: "⚠️ Element is outside safe area!"
- [ ] **VERIFY**: outsideSafeArea flag is set

#### Test 7.3: Partially Outside
- [ ] Position text so it overlaps safe area boundary
- [ ] **VERIFY**: Orange warning border shows
- [ ] **VERIFY**: Warning persists until fully inside

#### Test 7.4: Warning Persistence
- [ ] Move text outside safe area
- [ ] Deselect element
- [ ] **VERIFY**: Orange dashed border still visible (even when not selected)
- [ ] Move back inside safe area
- [ ] **VERIFY**: Warning border disappears

---

### 8. **Inline Text Editing Tests**

#### Test 8.1: Enter Edit Mode
- [ ] Double-click text element
- [ ] **VERIFY**: Textarea overlay appears
- [ ] **VERIFY**: Textarea positioned correctly (accounting for padding)
- [ ] **VERIFY**: Text is selected/highlighted
- [ ] **VERIFY**: Canvas text fades to 30% opacity

#### Test 8.2: Edit Mode Positioning
- [ ] Double-click text element
- [ ] **VERIFY**: Textarea starts at padding offset (12px, 8px from element origin)
- [ ] **VERIFY**: Textarea width = element.width - 24px (2 × 12px padding)
- [ ] **VERIFY**: Textarea height = element.height - 16px (2 × 8px padding)

#### Test 8.3: Live Editing
- [ ] Enter edit mode
- [ ] Type new text
- [ ] **VERIFY**: Canvas text updates in real-time
- [ ] **VERIFY**: Sidebar shows updated text
- [ ] **VERIFY**: Floating toolbar reflects changes

#### Test 8.4: Exit Edit Mode
- [ ] Enter edit mode
- [ ] Press Escape
- [ ] **VERIFY**: Edit mode closes
- [ ] **VERIFY**: Text opacity returns to 100%
- [ ] **VERIFY**: Changes are saved
- [ ] Click outside textarea
- [ ] **VERIFY**: Edit mode closes (blur event)

---

### 9. **Floating Toolbar Tests**

#### Test 9.1: Toolbar Appearance
- [ ] Select text element
- [ ] **VERIFY**: Floating toolbar appears at top center
- [ ] **VERIFY**: Glassmorphism effect (white/95% with backdrop blur)
- [ ] **VERIFY**: Smooth fade-in animation

#### Test 9.2: Font Controls
- [ ] Open font family dropdown
- [ ] **VERIFY**: 10 fonts listed (Inter, Poppins, Montserrat, etc.)
- [ ] Select different font
- [ ] **VERIFY**: Text updates immediately
- [ ] **VERIFY**: Dropdown shows font in its own typeface

#### Test 9.3: Font Size Controls
- [ ] Click "+" button
- [ ] **VERIFY**: Font size increases by 2
- [ ] **VERIFY**: Number updates in toolbar
- [ ] Click "-" button
- [ ] **VERIFY**: Font size decreases by 2
- [ ] **VERIFY**: Cannot go below 8px or above 72px

#### Test 9.4: Style Buttons
- [ ] Click Bold button
- [ ] **VERIFY**: Text becomes bold
- [ ] **VERIFY**: Button shows active state (blue background)
- [ ] Click Italic button
- [ ] **VERIFY**: Text becomes italic
- [ ] **VERIFY**: Both can be active simultaneously

#### Test 9.5: Color Picker
- [ ] Click color palette button
- [ ] **VERIFY**: Color picker dropdown appears
- [ ] **VERIFY**: 20 color swatches visible (6 columns)
- [ ] Click a color
- [ ] **VERIFY**: Text color changes
- [ ] **VERIFY**: Small color indicator on palette button updates

#### Test 9.6: Lock/Unlock
- [ ] Click lock button
- [ ] **VERIFY**: Element becomes locked (cannot drag)
- [ ] **VERIFY**: Icon changes to locked state
- [ ] Click unlock button
- [ ] **VERIFY**: Element becomes draggable again

#### Test 9.7: Duplicate
- [ ] Click duplicate button
- [ ] **VERIFY**: New element created
- [ ] **VERIFY**: Positioned 20px offset from original
- [ ] **VERIFY**: New element is selected

#### Test 9.8: Delete
- [ ] Click delete button
- [ ] **VERIFY**: Element is removed
- [ ] **VERIFY**: Toolbar disappears
- [ ] **VERIFY**: No element selected

---

### 10. **Sidebar Integration Tests**

#### Test 10.1: Add Text from Sidebar
- [ ] Open Text panel in sidebar
- [ ] Edit "Company Name" field
- [ ] Click "Add to Canvas"
- [ ] **VERIFY**: Text appears on canvas
- [ ] **VERIFY**: Proper dimensions (width based on text length)
- [ ] **VERIFY**: Default alignment: center/middle
- [ ] **VERIFY**: Padding property set: { horizontal: 12, vertical: 8 }

#### Test 10.2: Custom Text Fields
- [ ] Click "New Text Field" button
- [ ] **VERIFY**: New input field appears
- [ ] Enter custom text
- [ ] Click "Add to Canvas"
- [ ] **VERIFY**: Custom text added with proper padding

#### Test 10.3: Remove Custom Fields
- [ ] Add custom text field
- [ ] Click X button on custom field
- [ ] **VERIFY**: Field is removed from sidebar
- [ ] **VERIFY**: Default fields (Company Name, Phone) cannot be removed

---

### 11. **Performance Tests**

#### Test 11.1: Smooth Rendering
- [ ] Add 10 text elements
- [ ] Select each one
- [ ] **VERIFY**: No lag or jank
- [ ] **VERIFY**: Selection is instant
- [ ] **VERIFY**: Toolbar appears smoothly

#### Test 11.2: Resize Performance
- [ ] Add text element
- [ ] Rapidly resize by dragging handles
- [ ] **VERIFY**: Smooth 60fps animation
- [ ] **VERIFY**: No flickering
- [ ] **VERIFY**: Text reflows smoothly

#### Test 11.3: Drag Performance
- [ ] Add multiple text elements
- [ ] Drag them around canvas
- [ ] **VERIFY**: Smooth dragging
- [ ] **VERIFY**: No lag or stuttering
- [ ] **VERIFY**: Snap to grid works (if enabled)

---

### 12. **Edge Cases & Error Handling**

#### Test 12.1: Empty Text
- [ ] Create text element
- [ ] Delete all text content
- [ ] **VERIFY**: Element still visible (shows placeholder or empty box)
- [ ] **VERIFY**: Can still select and edit

#### Test 12.2: Very Long Text
- [ ] Add text with 500+ characters
- [ ] **VERIFY**: Text wraps correctly
- [ ] **VERIFY**: Container expands if needed
- [ ] **VERIFY**: No overflow issues

#### Test 12.3: Special Characters
- [ ] Add text with emojis: "Hello 👋 World 🌍"
- [ ] **VERIFY**: Renders correctly
- [ ] Add text with symbols: "© ® ™ € £ ¥"
- [ ] **VERIFY**: Renders correctly

#### Test 12.4: Multiple Selections
- [ ] Select text element
- [ ] Click another text element
- [ ] **VERIFY**: First element deselects
- [ ] **VERIFY**: Second element selects
- [ ] **VERIFY**: Toolbar updates for new selection

#### Test 12.5: Rotation with Padding
- [ ] Add text element
- [ ] Rotate 45 degrees
- [ ] **VERIFY**: Padding maintained during rotation
- [ ] **VERIFY**: Selection border rotates correctly
- [ ] **VERIFY**: Text remains readable

---

## 🎯 EXPECTED RESULTS SUMMARY

### Visual Quality
✅ Text never touches container edges  
✅ Professional spacing (12px/8px padding)  
✅ Clean selection borders  
✅ Smooth animations  
✅ No visual glitches  

### Functionality
✅ All alignment options work (9 combinations)  
✅ Resize without distortion  
✅ Text wraps naturally  
✅ Inline editing works  
✅ Safe area detection accurate  

### Performance
✅ Smooth 60fps rendering  
✅ No lag during interactions  
✅ Instant selection feedback  
✅ Fast text updates  

### User Experience
✅ Intuitive controls  
✅ Clear visual feedback  
✅ Professional feel  
✅ Matches VistaPrint quality  

---

## 🐛 KNOWN ISSUES (IF ANY)

_None currently identified. If you find any issues during testing, document them here:_

1. **Issue**: [Description]
   - **Steps to Reproduce**: [Steps]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]
   - **Severity**: [Low/Medium/High]

---

## 📊 TEST RESULTS

### Test Session 1
- **Date**: _____________
- **Tester**: _____________
- **Browser**: _____________
- **Tests Passed**: _____ / _____
- **Tests Failed**: _____ / _____
- **Notes**: _____________

### Test Session 2
- **Date**: _____________
- **Tester**: _____________
- **Browser**: _____________
- **Tests Passed**: _____ / _____
- **Tests Failed**: _____ / _____
- **Notes**: _____________

---

## 🚀 DEPLOYMENT CHECKLIST

Before deploying to production:

- [ ] All tests passed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Performance is acceptable (60fps)
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Mobile responsive (if applicable)
- [ ] Accessibility tested
- [ ] Documentation updated
- [ ] Code reviewed

---

## 📝 TESTING NOTES

### Tips for Effective Testing

1. **Test in Multiple Browsers**: Chrome, Firefox, Safari, Edge
2. **Test Different Screen Sizes**: Desktop, tablet, mobile
3. **Test Edge Cases**: Empty text, very long text, special characters
4. **Test Performance**: Add many elements, rapid interactions
5. **Test Combinations**: Try all alignment combinations
6. **Test Undo/Redo**: Verify history works with padding changes
7. **Test Zoom Levels**: 50%, 100%, 150%, 200%

### Common Issues to Watch For

- Text touching edges (padding not applied)
- Distortion during resize (font scaling instead of wrapping)
- Misaligned text (vertical alignment not working)
- Selection border overlapping text
- Padding not maintained during zoom
- Inline editor positioned incorrectly
- Safe area detection false positives/negatives
- Performance issues with many elements

---

## ✅ SIGN-OFF

**Implementation Complete**: ✅  
**Testing Complete**: ⬜  
**Ready for Production**: ⬜  

**Developer**: _____________  
**Date**: _____________  

**QA Tester**: _____________  
**Date**: _____________  

**Product Owner**: _____________  
**Date**: _____________  

---

## 📚 RELATED DOCUMENTATION

- `TEXT_PADDING_ALIGNMENT_FIX.md` - Implementation details
- `CUSTOMIZE_PAGE_VISUAL_GUIDE.md` - UI/UX guide
- `INLINE_TEXT_EDITING_IMPLEMENTATION.md` - Text editing system
- `PRINT_ACCURATE_EDITOR_IMPLEMENTATION.md` - Print specifications

---

**Last Updated**: May 4, 2026  
**Version**: 1.0  
**Status**: Ready for Testing
