'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  ChevronDown, ChevronLeft, Plus, Copy, Trash2,
  Lock, Unlock, Eye, EyeOff,
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown,
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { measureKonvaText, getFittedTextX } from './CanvaStyleTextElement'

const FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lato', 'Open Sans',
  'Playfair Display', 'Raleway', 'Oswald', 'Merriweather', 'Ubuntu',
  'Nunito', 'Dancing Script', 'Pacifico', 'Lobster', 'Abril Fatface',
  'Bebas Neue', 'Unica One', 'Anton', 'Barlow', 'Exo 2', 'Outfit',
  'DM Sans', 'Space Grotesk', 'Plus Jakarta Sans', 'Source Sans Pro',
  'PT Sans', 'Noto Sans', 'Sora', 'Manrope',
]

function Slider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format?: (v: number) => string
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-mono text-gray-500 w-10 text-right">{format ? format(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-[5px] rounded-full cursor-pointer appearance-none"
        style={{ background: `linear-gradient(to right,#2563eb 0%,#2563eb ${pct}%,#e2e8f0 ${pct}%,#e2e8f0 100%)` }}
      />
    </div>
  )
}

function Check({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer py-0.5">
      <div onClick={() => onChange(!value)}
        className={`w-[17px] h-[17px] rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-colors ${
          value ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'
        }`}>
        {value && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700 select-none">{label}</span>
    </label>
  )
}

interface Props { elementId: string; onClose: () => void }

export default function TextEditPanel({ elementId, onClose }: Props) {
  const { elements, updateElement, addElement, duplicateElement, deleteElement,
    bringForward, sendBackward, bringToFront, sendToBack } = useEditorStore()

  const el = elements.find(e => e.id === elementId)

  // ── Local UI state — initialised from element, then drives updateElement directly ──
  const [text, setText]           = useState(el?.text ?? '')
  const [fontFamily, setFontFamily] = useState(el?.fontFamily ?? 'Inter')
  const [fontSize, setFontSize]   = useState(Number(el?.fontSize ?? 24))
  const [bold, setBold]           = useState(el?.fontWeight === 'bold' || el?.fontWeight === 700)
  const [italic, setItalic]       = useState(el?.fontStyle === 'italic')
  const [underline, setUnderline] = useState(!!(el?.underline))
  const [color, setColor]         = useState(el?.fill ?? '#000000')
  const [align, setAlign]         = useState<'left'|'center'|'right'|'justify'>((el?.align as any) ?? 'left')
  const [spacing, setSpacing]     = useState(Number(el?.letterSpacing ?? 0))
  const [lineH, setLineH]         = useState(Number(el?.lineHeight ?? 1.2))
  const [opacity, setOpacity]     = useState(Number(el?.opacity ?? 1))
  const [outline, setOutline]     = useState(!!(el?.strokeWidth && el.strokeWidth > 0))
  const [shadow, setShadow]       = useState(false)
  const [curved, setCurved]       = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [fontSearch, setFontSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Re-init all state when switching to a different element
  useEffect(() => {
    if (!el) return
    setText(el.text ?? '')
    setFontFamily(el.fontFamily ?? 'Inter')
    setFontSize(Number(el.fontSize ?? 24))
    setBold(el.fontWeight === 'bold' || el.fontWeight === 700)
    setItalic(el.fontStyle === 'italic')
    setUnderline(!!(el.underline))
    setColor(el.fill ?? '#000000')
    setAlign((el.align as any) ?? 'left')
    setSpacing(Number(el.letterSpacing ?? 0))
    setLineH(Number(el.lineHeight ?? 1.2))
    setOpacity(Number(el.opacity ?? 1))
    setOutline(!!(el.strokeWidth && el.strokeWidth > 0))
    setShadow(false)
    setCurved(false)
  }, [elementId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [elementId])

  const filteredFonts = useMemo(
    () => fontSearch ? FONTS.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase())) : FONTS,
    [fontSearch]
  )

  if (!el) return null

  // ── Direct update helpers — call updateElement immediately, no debounce needed ──
  const apply = (patch: Partial<typeof el>) => updateElement(elementId, patch as any)

  const handleTextChange = (v: string) => { setText(v); apply({ text: v }) }
  const handleFontFamily = (v: string) => { setFontFamily(v); apply({ fontFamily: v }) }
  const handleFontSize = (v: number) => {
    const size = Math.max(6, Math.min(300, Math.round(v)))
    setFontSize(size)

    const fitted = measureKonvaText({
      text: el.text,
      fontSize: size,
      fontFamily: el.fontFamily,
      fontWeight: el.fontWeight,
      fontStyle: el.fontStyle,
      letterSpacing: el.letterSpacing,
      lineHeight: el.lineHeight,
    })

    const patch: Record<string, number> = {
      fontSize: size,
      width: fitted.width,
      height: fitted.height,
    }

    if (el.align === 'center' || el.align === 'right') {
      patch.x = getFittedTextX(el.x, el.width, fitted.width, el.align)
    }

    apply(patch)
  }
  const handleBold       = () => { const n = !bold; setBold(n); apply({ fontWeight: n ? 'bold' : 'normal' }) }
  const handleItalic     = () => { const n = !italic; setItalic(n); apply({ fontStyle: n ? 'italic' : 'normal' }) }
  const handleUnderline  = () => { const n = !underline; setUnderline(n); apply({ underline: n, textDecoration: n ? 'underline' : 'none' }) }
  const handleColor      = (v: string) => { setColor(v); apply({ fill: v }) }
  const handleAlign      = (v: typeof align) => { setAlign(v); apply({ align: v }) }
  const handleSpacing    = (v: number) => { setSpacing(v); apply({ letterSpacing: v }) }
  const handleLineH      = (v: number) => { setLineH(v); apply({ lineHeight: v }) }
  const handleOpacity    = (v: number) => { setOpacity(v); apply({ opacity: v }) }
  const handleOutline    = (v: boolean) => {
    setOutline(v)
    apply({
      stroke: v ? (color === '#ffffff' ? '#000000' : '#ffffff') : undefined,
      strokeWidth: v ? Math.max(2, Math.round(fontSize * 0.04)) : 0,
    })
  }
  const handleCase = (fn: (s: string) => string) => {
    const v = fn(text); setText(v); apply({ text: v })
  }

  const handleAddText = () => addElement({
    type: 'text', text: 'New Text',
    x: 200, y: 300, width: 400, height: 60,
    fontSize: 28, fontFamily: 'Inter', fontWeight: 'normal',
    fill: '#000000', align: 'left', rotation: 0, visible: true, locked: false,
  })

  return (
    <motion.div
      key={elementId}
      initial={{ x: -16, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -16, opacity: 0 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className="w-80 bg-white border-r border-gray-200 flex flex-col h-full z-30 shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-500" title="Back">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-gray-900">Edit Text</span>
        </div>
        <button onClick={handleAddText}
          className="flex items-center gap-1 text-[10px] font-bold text-gray-700 border border-gray-300 rounded px-2 py-[3px] hover:bg-gray-50 tracking-wide">
          <Plus className="w-3 h-3" />ADD TEXT
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>

        {/* Text input */}
        <input ref={inputRef} type="text" value={text} onChange={e => handleTextChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          placeholder="Enter text…" />

        {/* Font family */}
        <div className="relative">
          <button onClick={() => setShowFontPicker(v => !v)}
            className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white hover:border-blue-400 transition-colors">
            <span className="truncate" style={{ fontFamily }}>{fontFamily}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showFontPicker ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showFontPicker && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                <div className="p-2 border-b border-gray-100">
                  <input type="text" value={fontSearch} onChange={e => setFontSearch(e.target.value)}
                    placeholder="Search fonts…"
                    className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400" />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredFonts.map(f => (
                    <button key={f} onClick={() => { handleFontFamily(f); setShowFontPicker(false); setFontSearch('') }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition-colors ${f === fontFamily ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-700'}`}
                      style={{ fontFamily: f }}>
                      {f}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Color + Size + B I U */}
        <div className="flex items-center gap-1.5">
          {/* Color */}
          <div className="relative w-9 h-9 rounded-lg border-2 border-gray-200 overflow-hidden cursor-pointer flex-shrink-0 shadow-sm"
            style={{ backgroundColor: color }}>
            <input type="color" value={color} onChange={e => handleColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" title="Text color" />
          </div>

          {/* Size stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
            <button onClick={() => handleFontSize(Math.max(6, fontSize - 1))}
              className="px-2.5 py-2 text-gray-600 hover:bg-gray-100 text-sm font-bold select-none leading-none">−</button>
            <input type="number" value={fontSize} min={6} max={300}
              onChange={e => handleFontSize(Math.max(6, parseInt(e.target.value) || 6))}
              className="w-10 text-center text-sm font-semibold border-0 focus:outline-none bg-white text-gray-800 appearance-none" />
            <button onClick={() => handleFontSize(Math.min(300, fontSize + 1))}
              className="px-2.5 py-2 text-gray-600 hover:bg-gray-100 text-sm font-bold select-none leading-none">+</button>
          </div>

          {/* B */}
          <button onClick={handleBold}
            className={`w-8 h-9 flex items-center justify-center rounded-lg border text-sm font-bold transition-colors ${
              bold ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`} title="Bold">B</button>

          {/* I */}
          <button onClick={handleItalic}
            className={`w-8 h-9 flex items-center justify-center rounded-lg border text-sm italic font-serif transition-colors ${
              italic ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`} title="Italic">I</button>

          {/* U */}
          <button onClick={handleUnderline}
            className={`w-8 h-9 flex items-center justify-center rounded-lg border text-sm underline transition-colors ${
              underline ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`} title="Underline">U</button>
        </div>

        {/* Case */}
        <div className="flex gap-1">
          {([
            ['AB', 'Uppercase', (s: string) => s.toUpperCase()],
            ['ab', 'Lowercase', (s: string) => s.toLowerCase()],
            ['Ab', 'Capitalize', (s: string) => s.replace(/\b\w/g, c => c.toUpperCase())],
          ] as const).map(([lbl, title, fn]) => (
            <button key={lbl} onClick={() => handleCase(fn as any)} title={title}
              className="flex-1 py-1.5 text-xs font-bold border border-gray-200 rounded hover:bg-gray-50 text-gray-600 transition-colors">
              {lbl}
            </button>
          ))}
        </div>

        {/* Alignment */}
        <div className="flex gap-1">
          {(['left','center','right','justify'] as const).map(a => {
            const Icon = a==='left' ? AlignLeft : a==='center' ? AlignCenter : a==='right' ? AlignRight : AlignJustify
            return (
              <button key={a} onClick={() => handleAlign(a)} title={`Align ${a}`}
                className={`flex-1 py-1.5 flex items-center justify-center rounded border transition-colors ${
                  align === a ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}>
                <Icon className="w-4 h-4" />
              </button>
            )
          })}
        </div>

        {/* Sliders */}
        <div className="space-y-3 pt-1">
          <Slider label="Letter Spacing" value={spacing} min={-5} max={30} step={0.5} onChange={handleSpacing} />
          <Slider label="Line Height"    value={lineH}   min={0.8} max={3} step={0.1} onChange={handleLineH}  format={v => v.toFixed(1)} />
          <Slider label="Opacity"        value={opacity} min={0}   max={1} step={0.01} onChange={handleOpacity} format={v => `${Math.round(v*100)}%`} />
        </div>

        <div className="border-t border-gray-100" />

        {/* Effects */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Effects</p>
          <div className="space-y-1.5">
            <Check label="Outline"     value={outline} onChange={handleOutline} />
            <Check label="Shadow"      value={shadow}  onChange={setShadow} />
            <Check label="Curved text" value={curved}  onChange={setCurved} />
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Layer order */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Layer Order</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Bring Forward',  icon: ArrowUp,      fn: () => bringForward(elementId) },
              { label: 'Send Backward',  icon: ArrowDown,    fn: () => sendBackward(elementId) },
              { label: 'Bring to Front', icon: ChevronsUp,   fn: () => bringToFront(elementId) },
              { label: 'Send to Back',   icon: ChevronsDown, fn: () => sendToBack(elementId) },
            ].map(({ label, icon: Icon, fn }) => (
              <button key={label} onClick={fn}
                className="flex items-center gap-1.5 px-2.5 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Icon className="w-3 h-3 flex-shrink-0" />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Lock + Visible */}
        <div className="flex gap-1.5">
          <button onClick={() => updateElement(elementId, { locked: !el.locked })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg border transition-colors ${
              el.locked ? 'bg-orange-50 border-orange-400 text-orange-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {el.locked ? 'Locked' : 'Lock'}
          </button>
          <button onClick={() => updateElement(elementId, { visible: el.visible === false })}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg border transition-colors ${
              el.visible === false ? 'bg-gray-100 border-gray-300 text-gray-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {el.visible !== false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {el.visible !== false ? 'Visible' : 'Hidden'}
          </button>
        </div>

        {/* Duplicate + Delete */}
        <div className="flex gap-1.5">
          <button onClick={() => duplicateElement(elementId)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition-colors">
            <Copy className="w-3.5 h-3.5" />Duplicate
          </button>
          <button onClick={() => { deleteElement(elementId); onClose() }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />Delete
          </button>
        </div>

        {/* Position info */}
        <div className="pt-1 pb-2 border-t border-gray-100">
          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-gray-400">
            <span>X:{Math.round(el.x)}</span>
            <span>Y:{Math.round(el.y)}</span>
            <span>W:{Math.round(el.width)}</span>
            <span>H:{Math.round(el.height)}</span>
          </div>
        </div>

      </div>
    </motion.div>
  )
}
