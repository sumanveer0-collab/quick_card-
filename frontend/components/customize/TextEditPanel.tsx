'use client'
/**
 * TextEditPanel — Left-side text editor panel
 *
 * Replaces the normal sidebar on the LEFT when any text is clicked on canvas.
 * All controls are fully expanded and visible (no collapsing needed).
 *
 * Layout:
 *   ┌─────────────────────────────────┐
 *   │ ← Edit Text        [ADD TEXT]   │
 *   ├─────────────────────────────────┤
 *   │ [text input field             ] │
 *   │ [font family dropdown       ▾ ] │
 *   │ [■ color] [─ 41 +] [B] [I] [U] │
 *   │ [≡] [≡] [≡] [≡]  alignment     │
 *   │ Letter Spacing ●────────────  0 │
 *   │ Line Height ●───────────────1.2 │
 *   │ Opacity ●──────────────────100% │
 *   ├─────────────────────────────────┤
 *   │ □ Curved text                   │
 *   │ □ Outline                       │
 *   │ □ Shadow                        │
 *   ├─────────────────────────────────┤
 *   │ [↑] [↓] [⇑] [⇓]  layer order   │
 *   │ [🔒 Lock] [👁 Visible]          │
 *   │ [⧉ Duplicate] [🗑 Delete]       │
 *   ├─────────────────────────────────┤
 *   │  X:300  Y:150  W:850  H:60      │
 *   └─────────────────────────────────┘
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline,
  ChevronDown, ChevronLeft, Plus, Copy, Trash2,
  Lock, Unlock, Eye, EyeOff,
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown,
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

// ─── Font list ────────────────────────────────────────────────────────────────
const FONTS = [
  'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lato', 'Open Sans',
  'Playfair Display', 'Raleway', 'Oswald', 'Merriweather', 'Ubuntu',
  'Nunito', 'Dancing Script', 'Pacifico', 'Lobster', 'Abril Fatface',
  'Bebas Neue', 'Unica One', 'Anton', 'Barlow', 'Exo 2', 'Outfit',
  'DM Sans', 'Space Grotesk', 'Plus Jakarta Sans', 'Source Sans Pro',
  'PT Sans', 'Noto Sans', 'Sora', 'Manrope',
]

// ─── Slider helper ────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format?: (v: number) => string
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-mono text-gray-500">{format ? format(value) : value}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-[5px] rounded-full cursor-pointer appearance-none"
        style={{ background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)` }}
      />
    </div>
  )
}

// ─── Toggle button ────────────────────────────────────────────────────────────
function Tog({ active, onClick, title, children }: {
  active: boolean; onClick: () => void; title: string; children: React.ReactNode
}) {
  return (
    <button onClick={onClick} title={title}
      className={`flex-1 py-1.5 flex items-center justify-center rounded border transition-colors text-sm ${
        active ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
      }`}>
      {children}
    </button>
  )
}

// ─── Checkbox row ─────────────────────────────────────────────────────────────
function Check({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <div onClick={() => onChange(!value)}
        className={`w-[17px] h-[17px] rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-colors ${
          value ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'
        }`}>
        {value && (
          <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700 select-none">{label}</span>
    </label>
  )
}

// ─── Section divider label ────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="pt-1 pb-2">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
interface Props { elementId: string; onClose: () => void }

export default function TextEditPanel({ elementId, onClose }: Props) {
  const {
    elements, updateElement, addElement,
    duplicateElement, deleteElement,
    bringForward, sendBackward, bringToFront, sendToBack,
  } = useEditorStore()

  const el = elements.find(e => e.id === elementId)

  // ── local state ──────────────────────────────────────────────────────────
  const [text, setText]           = useState(el?.text ?? '')
  const [fontFamily, setFont]     = useState(el?.fontFamily ?? 'Inter')
  const [fontSize, setSize]       = useState(Number(el?.fontSize ?? 24))
  const [bold, setBold]           = useState(el?.fontWeight === 'bold' || el?.fontWeight === 700)
  const [italic, setItalic]       = useState(el?.fontStyle === 'italic')
  const [underline, setUnderline] = useState(!!(el?.underline))
  const [color, setColor]         = useState(el?.fill ?? '#000000')
  const [align, setAlign]         = useState<'left'|'center'|'right'|'justify'>((el?.align as any) ?? 'left')
  const [spacing, setSpacing]     = useState(Number(el?.letterSpacing ?? 0))
  const [lineH, setLineH]         = useState(Number(el?.lineHeight ?? 1.2))
  const [opacity, setOpacity]     = useState(Number(el?.opacity ?? 1))
  const [outline, setOutline]     = useState(false)
  const [shadow, setShadow]       = useState(false)
  const [curved, setCurved]       = useState(false)
  const [showFontPicker, setShowFontPicker] = useState(false)
  const [fontSearch, setFontSearch] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  // Re-sync ALL state when switching elements
  useEffect(() => {
    if (!el) return
    setText(el.text ?? '')
    setFont(el.fontFamily ?? 'Inter')
    setSize(Number(el.fontSize ?? 24))
    setBold(el.fontWeight === 'bold' || el.fontWeight === 700)
    setItalic(el.fontStyle === 'italic')
    setUnderline(!!(el.underline))
    setColor(el.fill ?? '#000000')
    setAlign((el.align as any) ?? 'left')
    setSpacing(Number(el.letterSpacing ?? 0))
    setLineH(Number(el.lineHeight ?? 1.2))
    setOpacity(Number(el.opacity ?? 1))
  }, [elementId])

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select() }, [elementId])

  // Debounced live-sync to canvas (25ms)
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sync = useCallback((patch: Record<string, unknown>) => {
    if (!el) return
    if (t.current) clearTimeout(t.current)
    t.current = setTimeout(() => updateElement(elementId, patch), 25)
  }, [elementId, el, updateElement])

  useEffect(() => { sync({ text }) },                              [text])
  useEffect(() => { sync({ fontFamily }) },                        [fontFamily])
  useEffect(() => { sync({ fontSize }) },                          [fontSize])
  useEffect(() => { sync({ fontWeight: bold ? 'bold' : 'normal' }) }, [bold])
  useEffect(() => { sync({ fontStyle: italic ? 'italic' : 'normal' }) }, [italic])
  useEffect(() => { sync({ underline, textDecoration: underline ? 'underline' : 'none' }) }, [underline])
  useEffect(() => { sync({ fill: color }) },                       [color])
  useEffect(() => { sync({ align }) },                             [align])
  useEffect(() => { sync({ letterSpacing: spacing }) },            [spacing])
  useEffect(() => { sync({ lineHeight: lineH }) },                 [lineH])
  useEffect(() => { sync({ opacity }) },                           [opacity])
  useEffect(() => {
    sync({
      stroke:      outline ? (color === '#ffffff' ? '#000000' : '#ffffff') : undefined,
      strokeWidth: outline ? Math.max(1, Math.round(fontSize * 0.04)) : 0,
    })
  }, [outline, color, fontSize])

  const filteredFonts = useMemo(
    () => fontSearch ? FONTS.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase())) : FONTS,
    [fontSearch]
  )

  if (!el) return null

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
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
            title="Back to sidebar">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-gray-900">Edit Text</span>
        </div>
        <button onClick={handleAddText}
          className="flex items-center gap-1 text-[10px] font-bold text-gray-700 border border-gray-300 rounded px-2 py-[3px] hover:bg-gray-50 tracking-wide">
          <Plus className="w-3 h-3" />ADD TEXT
        </button>
      </div>

      {/* ── Scrollable body ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>

        {/* ── Text content ── */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
          placeholder="Enter text…"
        />

        {/* ── Font family ── */}
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
                    <button key={f} onClick={() => { setFont(f); setShowFontPicker(false); setFontSearch('') }}
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

        {/* ── Color · Size · Style ── */}
        <div className="flex items-center gap-1.5">
          {/* Color swatch */}
          <div className="relative w-9 h-9 rounded-lg border border-gray-200 overflow-hidden cursor-pointer flex-shrink-0 shadow-sm"
            style={{ backgroundColor: color }}>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" title="Text color" />
          </div>

          {/* Font size stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
            <button onClick={() => setSize(s => Math.max(6, s - 1))}
              className="px-2 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium select-none">–</button>
            <input type="number" value={fontSize} min={6} max={300}
              onChange={e => setSize(Math.max(6, parseInt(e.target.value) || 6))}
              className="w-10 text-center text-sm font-semibold border-0 focus:outline-none bg-white text-gray-800 appearance-none" />
            <button onClick={() => setSize(s => Math.min(300, s + 1))}
              className="px-2 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium select-none">+</button>
          </div>

          {/* B I U */}
          <button onClick={() => setBold(v => !v)}
            className={`w-8 h-9 flex items-center justify-center rounded-lg border text-sm font-bold transition-colors ${bold ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            title="Bold">B</button>
          <button onClick={() => setItalic(v => !v)}
            className={`w-8 h-9 flex items-center justify-center rounded-lg border text-sm italic transition-colors ${italic ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            title="Italic">I</button>
          <button onClick={() => setUnderline(v => !v)}
            className={`w-8 h-9 flex items-center justify-center rounded-lg border text-sm underline transition-colors ${underline ? 'bg-blue-50 border-blue-500 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            title="Underline">U</button>
        </div>

        {/* ── Case toggle ── */}
        <div className="flex gap-1">
          {[
            { label: 'AB', title: 'UPPERCASE', fn: () => setText(t => t.toUpperCase()) },
            { label: 'ab', title: 'lowercase',  fn: () => setText(t => t.toLowerCase()) },
            { label: 'Ab', title: 'Capitalize', fn: () => setText(t => t.replace(/\b\w/g, c => c.toUpperCase())) },
          ].map(({ label, title, fn }) => (
            <button key={label} onClick={fn} title={title}
              className="flex-1 py-1.5 text-xs font-bold border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-colors">
              {label}
            </button>
          ))}
        </div>

        {/* ── Alignment ── */}
        <div className="flex gap-1">
          {(['left','center','right','justify'] as const).map(a => {
            const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : a === 'right' ? AlignRight : AlignJustify
            return (
              <Tog key={a} active={align === a} onClick={() => setAlign(a)} title={`Align ${a}`}>
                <Icon className="w-4 h-4" />
              </Tog>
            )
          })}
        </div>

        {/* ── Spacing sliders ── */}
        <div className="space-y-3">
          <Slider label="Letter Spacing" value={spacing} min={-5} max={30} step={0.5}
            onChange={setSpacing} />
          <Slider label="Line Height" value={lineH} min={0.8} max={3} step={0.1}
            onChange={setLineH} format={v => v.toFixed(1)} />
          <Slider label="Opacity" value={opacity} min={0} max={1} step={0.01}
            onChange={setOpacity} format={v => `${Math.round(v * 100)}%`} />
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-100" />

        {/* ── Effects ── */}
        <SectionLabel label="Effects" />
        <div className="space-y-1.5">
          <Check label="Outline"     value={outline}  onChange={setOutline} />
          <Check label="Shadow"      value={shadow}   onChange={setShadow} />
          <Check label="Curved text" value={curved}   onChange={setCurved} />
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-gray-100" />

        {/* ── Layer order ── */}
        <SectionLabel label="Layer Order" />
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Bring Forward', icon: ArrowUp,     fn: () => bringForward(elementId) },
            { label: 'Send Backward', icon: ArrowDown,   fn: () => sendBackward(elementId) },
            { label: 'Bring to Front', icon: ChevronsUp, fn: () => bringToFront(elementId) },
            { label: 'Send to Back', icon: ChevronsDown, fn: () => sendToBack(elementId) },
          ].map(({ label, icon: Icon, fn }) => (
            <button key={label} onClick={fn}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
              <Icon className="w-3 h-3 flex-shrink-0" />{label}
            </button>
          ))}
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
          <button onClick={() => updateElement(elementId, { visible: !(el.visible !== false) })}
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

        {/* ── Position info ── */}
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
