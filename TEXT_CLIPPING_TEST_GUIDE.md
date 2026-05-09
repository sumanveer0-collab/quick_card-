# Text Clipping Fix - Quick Test Guide

## 🧪 Quick Verification Tests

Fast tests to verify the text clipping fix is working correctly.

---

## ⚡ QUICK TEST (2 minutes)

### Test 1: Basic Font Size Increase
1. Open `/customize` page
2. Add "Company Name" text to canvas
3. Select the text element
4. Click font size "+" button 5 times
5. **VERIFY**: ✅ Text fully visible, no clipping
6. **VERIFY**: ✅ Container height increased automatically

**Expected Result**:
```
Before (16px):
┌─────────────────────┐
│ COMPANY NAME        │
└─────────────────────┘

After (26px):
┌─────────────────────┐
│                     │
│ COMPANY NAME        │
│                     │
└─────────────────────┘
  ↑ Auto-expanded ✅
```

---

## 🎯 COMPREHENSIVE TESTS (10 minutes)

### Test 2: Large Font Size
1. Add text: "Hello World"
2. Increase font size to 48px
3. **VERIFY**: ✅ All text visible
4. Increase to 72px (maximum)
5. **VERIFY**: ✅ Container expanded, no clipping

### Test 3: Long Text with Wrapping
1. Add text: "This is a very long company name that should wrap to multiple lines"
2. Set font size to 24px
3. **VERIFY**: ✅ Text wraps to multiple lines
4. **VERIFY**: ✅ All lines visible
5. Increase font to 32px
6. **VERIFY**: ✅ Container expands, all text visible

### Test 4: Narrow Container
1. Add text: "Company Name"
2. Resize container to 100px wide
3. Increase font size to 32px
4. **VERIFY**: ✅ Text wraps to multiple lines
5. **VERIFY**: ✅ Container height expands
6. **VERIFY**: ✅ No horizontal clipping

### Test 5: Font Family Change
1. Add text at 24px
2. Change font to "Poppins" (wider)
3. **VERIFY**: ✅ Container adjusts if needed
4. Change to "Montserrat"
5. **VERIFY**: ✅ No clipping

### Test 6: Bold Text
1. Add text at 24px
2. Click Bold button
3. **VERIFY**: ✅ Text fully visible (bold is wider)
4. Increase font size
5. **VERIFY**: ✅ Container expands

---

## 🐛 EDGE CASE TESTS

### Test 7: Empty Text
1. Create text element
2. Delete all text
3. Increase font size
4. **VERIFY**: ✅ No errors
5. Add text back
6. **VERIFY**: ✅ Container adjusts

### Test 8: Special Characters
1. Add text: "© 2026 Company™ 🎉"
2. Increase font size to 32px
3. **VERIFY**: ✅ All characters visible
4. **VERIFY**: ✅ Emojis render correctly

### Test 9: Multiple Elements
1. Add 3 text elements
2. Increase font size on first element
3. **VERIFY**: ✅ Only first element expands
4. Increase font on second element
5. **VERIFY**: ✅ Only second element expands
6. **VERIFY**: ✅ No interference between elements

---

## ✅ PASS/FAIL CHECKLIST

Quick checklist for verification:

- [ ] Font size increase: Text fully visible
- [ ] Font size increase: Container auto-expands
- [ ] Large font (72px): No clipping
- [ ] Long text: Wraps correctly
- [ ] Long text: All lines visible
- [ ] Narrow container: Height expands
- [ ] Font family change: No clipping
- [ ] Bold text: Fully visible
- [ ] Special characters: Render correctly
- [ ] Multiple elements: Independent expansion
- [ ] No console errors
- [ ] Smooth performance (no lag)

---

## 🎨 VISUAL INDICATORS

### ✅ CORRECT (Text Fully Visible)
```
┌─────────────────────────┐
│                         │
│ COMPANY NAME            │  ← All text visible
│                         │
└─────────────────────────┘
```

### ❌ INCORRECT (Text Clipped)
```
┌─────────────────────────┐
│ COMPANY NAM█            │  ← Text cut off
└─────────────────────────┘
```

---

## 🚀 QUICK COMMANDS

### Start Frontend
```bash
cd frontend
npm run dev
```

### Open Test Page
```
http://localhost:3000/customize
```

---

## 📊 TEST RESULTS TEMPLATE

**Date**: _____________  
**Tester**: _____________  
**Browser**: _____________  

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Basic font increase | ☐ | ☐ | |
| Large font (72px) | ☐ | ☐ | |
| Long text wrapping | ☐ | ☐ | |
| Narrow container | ☐ | ☐ | |
| Font family change | ☐ | ☐ | |
| Bold text | ☐ | ☐ | |
| Empty text | ☐ | ☐ | |
| Special characters | ☐ | ☐ | |
| Multiple elements | ☐ | ☐ | |

**Overall Result**: ☐ PASS  ☐ FAIL

**Issues Found**: _____________

---

## 💡 TROUBLESHOOTING

### Issue: Text still clipping
**Solution**: Clear browser cache and reload

### Issue: Container not expanding
**Solution**: Check console for errors, verify useEffect is running

### Issue: Performance lag
**Solution**: Check if too many elements on canvas

---

**Quick Test Status**: ⬜ Not Started | ⏳ In Progress | ✅ Complete

**Last Updated**: May 4, 2026
