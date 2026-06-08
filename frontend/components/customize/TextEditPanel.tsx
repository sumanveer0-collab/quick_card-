'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Bold, Italic, Underline, Strikethrough,
  ChevronDown, Plus, Copy, Trash2,
  Lock, Unlock, Eye, EyeOff,
  ArrowUp, ArrowDown, ChevronsUp, ChevronsDown,
  RotateCw, Type, Sparkles,
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

// ─── Constants ────────────────────────────────────────────────────────────────
const FONT_FAMILIES = [
  'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lato', 'Open Sans',
  'Playfair Display', 'Raleway', 'Oswald', 'Merriweather', 'Ubuntu',
  'Nunito', 'Source Sans Pro', 'PT Sans', 'Noto Sans', 'Dancing Script',
  'Pacifico', 'Lobster', 'Abril Fatface', 'Bebas Neue', 'Unica One',
  'Anton', 'Barlow', 'Exo 2', 'Outfit', 'DM Sans', 'Sora', 'Manrope',
  'Space Grotesk', 'Plus Jakarta Sans',
]

const FONT_SIZES = [6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96, 120]

const COLOR_PRESETS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#6b7280',
  '#1e293b', '#334155', '#64748b', '#94a3b8',
  '#dc2626', '#d97706', '#16a34a', '#2563eb',
  '#7c3aed', '#db2777', '#0891b2', '#059669',
  '#991b1b', '#92400e', '#166534', '#1e40af',
  '#6d28d9', '#9d174d', '#155e75', '#065f46',
]

const TEXT_PRESETS = [
  { label: 'Heading',    fontSize: 48, fontWeight: 'bold',   fontFamily: 'Poppins',   text: 'Your Heading' },
  { label: 'Subheading', fontSize: 28, fontWeight: '600',    fontFamily: 'Inter',     text: 'Subheading' },
  { label: 'Body',       fontSize: 18, fontWeight: 'normal', fontFamily: 'Inter',     text: 'Body text here' },
  { label: 'Caption',    fontSize: 12, fontWeight: 'normal', fontFamily: 'Inter',     text: 'Caption text' },
  { label: 'Luxury',     fontSize: 40, fontWeight: 'bold',   fontFamily: 'Playfair Display', text: 'LUXURY' },
  { label: 'Bold',       fontSize: 52, fontWeight: 'bold',   fontFamily: 'Bebas Neue', text: 'BOLD TEXT' },
  { label: 'Minimal',    fontSize: 22, fontWeight: '300',    fontFamily: 'Raleway',   text: 'minimal' },
  { label: 'Modern',     fontSize: 32, fontWeight: 'bold',   fontFamily: 'Montserrat', text: 'MODERN' },
]

// ─── Section component ────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Slider row ───────────────────────────────────────────────────────────────
function SliderRow({ label, value, min, max, step, onChange, format }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; format?: (v: number) => string
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-mono text-gray-500 min-w-[36px] text-right">
          {format ? format(value) : value}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full cursor-pointer appearance-none"
        style={{ background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)` }}
      />
    </div>
  )
}

// ─── Toggle button ────────────────────────────────────────────────────────────
function ToggleBtn({ active, onClick, title, children }: {
  active: boolean; onClick: () => void; title: string; children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex-1 py-2 flex items-center justify-center rounded border transition-all ${
        active
          ? 'bg-blue-50 border-blue-500 text-blue-600'
          : 'border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

// ─── CheckRow ─────────────────────────────────────────────────────────────────
function CheckRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={() => onChange(!value)}
        className={`w-[18px] h-[18px] rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-colors ${
          value ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300 hover:border-blue-400'
        }`}
      >
        {value && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-700 select-none group-hover:text-gray-900">{label}</span>
    </label>
  )
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
interface TextEditPanelProps {
  elementId: string
  onClose: () => void
}

export default function TextEditPanel({ elementId, onClose }: TextEditPanelProps) {
  const { elements, updateElement, addElement, duplicateElement, deleteElement,
    bringForward, sendBackward, bringToFront, sendToBack } = useEditorStore()

  const el = elements.find(e => e.id === elementId)

  // ── local state ──────────────────────────────────────────────────────────
  const [text, setText]           = useState(el?.text ?? '')
  const [fontFamily, setFontFamily] = useState(el?.fontFamily ?? 'Inter')
  const [fontSize, setFontSize]   = useState(Number(el?.fontSize ?? 24))
  const [fontWeight, setFontWeight] = useState<string>(String(el?.fontWeight ?? 'normal'))
  const [italic, setItalic]       = useState(el?.fontStyle === 'italic')
  const [underline, setUnderline] = useState(el?.textDecoration === 'underline')
  const [strikethrough, setStrikethrough] = useState(el?.textDecoration === 'line-through')
  const [color, setColor]         = useState(el?.fill ?? '#000000')
  const [align, setAlign]         = useState<'left'|'center'|'right'|'justify'>((el?.align as any) ?? 'left')
  const [letterSpacing, setLetterSpacing] = useState(Number(el?.letterSpacing ?? 0))
  const [lineHeight, setLineHeight] = useState(Number(el?.lineHeight ?? 1.2))
  const [opacity, setOpacity]     = useState(Number(el?.opacity ?? 1))
  const [rotation, setRotation]   = useState(Number(el?.rotation ?? 0))
  const [locked, setLocked]       = useState(el?.locked ?? false)
  const [visible, setVisible]     = useState(el?.visible !== false)
  const [shadow, setShadow]       = useState(false)
  const [outline, setOutline]     = useState(false)
  const [curvedText, setCurvedText] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [showFontSearch, setShowFontSearch] = useState(false)
  const [fontSearch, setFontSearch] = useState('')

  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Focus on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  // Sync to canvas in real-time (debounced)
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sync = useCallback((patch: Record<string, unknown>) => {
    if (!el) return
    if (pending.current) clearTimeout(pending.current)
    pending.current = setTimeout(() => updateElement(elementId, patch), 30)
  }, [elementId, el])

  useEffect(() => { sync({ text }) }, [text])
  useEffect(() => { sync({ fontFamily }) }, [fontFamily])
  useEffect(() => { sync({ fontSize }) }, [fontSize])
  useEffect(() => { sync({ fontWeight }) }, [fontWeight])
  useEffect(() => { sync({ fontStyle: italic ? 'italic' : 'normal' }) }, [italic])
  useEffect(() => {
    sync({ textDecoration: strikethrough ? 'line-through' : underline ? 'underline' : 'none', underline })
  }, [underline, strikethrough])
  useEffect(() => { sync({ fill: color }) }, [color])
  useEffect(() => { sync({ align }) }, [align])
  useEffect(() => { sync({ letterSpacing }) }, [letterSpacing])
  useEffect(() => { sync({ lineHeight }) }, [lineHeight])
  useEffect(() => { sync({ opacity }) }, [opacity])
  useEffect(() => { sync({ rotation }) }, [rotation])
  useEffect(() => { sync({ locked }) }, [locked])
  useEffect(() => { sync({ visible }) }, [visible])
  useEffect(() => {
    sync({
      stroke: outline ? (color === '#ffffff' ? '#000000' : '#ffffff') : undefined,
      strokeWidth: outline ? 2 : 0,
    })
  }, [outline, color])

  const filteredFonts = useMemo(
    () => FONT_FAMILIES.filter(f => f.toLowerCase().includes(fontSearch.toLowerCase())),
    [fontSearch]
  )

  if (!el) return null

  const handleAddText = () => {
    addElement({
      type: 'text', text: 'New Text',
      x: 300, y: 300, width: 300, height: 60,
      fontSize: 28, fontFamily: 'Inter', fontWeight: 'normal',
      fill: '#000000', align: 'left', rotation: 0, visible: true, locked: false,
    })
  }

  const applyPreset = (preset: typeof TEXT_PRESETS[number]) => {
    setText(preset.text)
    setFontFamily(preset.fontFamily)
    setFontSize(preset.fontSize)
    setFontWeight(preset.fontWeight)
    setShowPresets(false)
    updateElement(elementId, {
      text: preset.text, fontFamily: preset.fontFamily,
      fontSize: preset.fontSize, fontWeight: preset.fontWeight,
    })
  }

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col shrink-0 z-30 overflow-hidden"
      style={{ width: '256px', minWidth: '256px' }}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-gray-900">Edit Text</span>
        </div>
        <button onClick={handleAddText}
          className="text-[10px] font-bold text-gray-700 border border-gray-300 rounded px-2 py-[3px] hover:bg-gray-50 tracking-wide flex items-center gap-1">
          <Plus className="w-3 h-3" />ADD TEXT
        </button>
      </div>

      {/* ── Scrollable body ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>

        {/* CONTENT */}
        <Section title="Content">
          <textarea
            ref={inputRef}
            value={text}
            rows={3}
            onChange={e => setText(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 leading-relaxed"
            placeholder="Enter text…"
          />

          {/* Text Presets */}
          <div>
            <button onClick={() => setShowPresets(v => !v)}
              className="w-full flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 py-1">
              <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Text Presets</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPresets ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {showPresets && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {TEXT_PRESETS.map(p => (
                      <button key={p.label} onClick={() => applyPreset(p)}
                        className="text-left px-2.5 py-2 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all">
                        <div className="text-[11px] font-bold text-gray-800">{p.label}</div>
                        <div className="text-[10px] text-gray-400">{p.fontSize}px · {p.fontFamily.split(' ')[0]}</div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* TYPOGRAPHY */}
        <Section title="Typography">
          {/* Font Family */}
          <div className="relative">
            <button onClick={() => setShowFontSearch(v => !v)}
              className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 hover:border-blue-400 transition-colors bg-white">
              <span className="truncate" style={{ fontFamily }}>{fontFamily}</span>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>
            <AnimatePresence>
              {showFontSearch && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                  <div className="p-2 border-b border-gray-100">
                    <input type="text" value={fontSearch} onChange={e => setFontSearch(e.target.value)}
                      placeholder="Search fonts…"
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredFonts.map(f => (
                      <button key={f} onClick={() => { setFontFamily(f); setShowFontSearch(false); setFontSearch('') }}
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

          {/* Size + Weight */}
          <div className="flex items-center gap-2">
            {/* Font size stepper */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-1">
              <button onClick={() => setFontSize(s => Math.max(6, s - 1))}
                className="px-2.5 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium select-none">–</button>
              <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                className="flex-1 text-center text-sm font-semibold border-0 focus:outline-none bg-white text-gray-800 cursor-pointer">
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setFontSize(s => Math.min(200, s + 1))}
                className="px-2.5 py-2 text-gray-600 hover:bg-gray-100 text-sm font-medium select-none">+</button>
            </div>
            {/* Weight dropdown */}
            <select value={fontWeight} onChange={e => setFontWeight(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-400 bg-white">
              <option value="100">Thin</option>
              <option value="300">Light</option>
              <option value="normal">Regular</option>
              <option value="500">Medium</option>
              <option value="600">SemiBold</option>
              <option value="bold">Bold</option>
              <option value="800">ExtraBold</option>
              <option value="900">Black</option>
            </select>
          </div>

          {/* Style toggles */}
          <div className="flex gap-1">
            <ToggleBtn active={fontWeight === 'bold'} onClick={() => setFontWeight(w => w === 'bold' ? 'normal' : 'bold')} title="Bold">
              <Bold className="w-4 h-4" />
            </ToggleBtn>
            <ToggleBtn active={italic} onClick={() => setItalic(v => !v)} title="Italic">
              <Italic className="w-4 h-4" />
            </ToggleBtn>
            <ToggleBtn active={underline} onClick={() => { setUnderline(v => !v); setStrikethrough(false) }} title="Underline">
              <Underline className="w-4 h-4" />
            </ToggleBtn>
            <ToggleBtn active={strikethrough} onClick={() => { setStrikethrough(v => !v); setUnderline(false) }} title="Strikethrough">
              <Strikethrough className="w-4 h-4" />
            </ToggleBtn>
          </div>

          {/* Case */}
          <div className="flex gap-1">
            {[
              { label: 'AB', title: 'Uppercase', fn: () => setText(t => t.toUpperCase()) },
              { label: 'ab', title: 'Lowercase', fn: () => setText(t => t.toLowerCase()) },
              { label: 'Ab', title: 'Capitalize', fn: () => setText(t => t.replace(/\b\w/g, c => c.toUpperCase())) },
            ].map(({ label, title, fn }) => (
              <button key={label} onClick={fn} title={title}
                className="flex-1 py-1.5 text-xs font-bold border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300 text-gray-600 transition-colors">
                {label}
              </button>
            ))}
          </div>
        </Section>

        {/* ALIGNMENT */}
        <Section title="Alignment">
          <div className="flex gap-1">
            {(['left','center','right','justify'] as const).map(a => {
              const Icon = a === 'left' ? AlignLeft : a === 'center' ? AlignCenter : a === 'right' ? AlignRight : AlignJustify
              return (
                <ToggleBtn key={a} active={align === a} onClick={() => setAlign(a)} title={`Align ${a}`}>
                  <Icon className="w-4 h-4" />
                </ToggleBtn>
              )
            })}
          </div>
        </Section>

        {/* COLOR */}
        <Section title="Color">
          {/* Swatch grid */}
          <div className="grid grid-cols-8 gap-1.5">
            {COLOR_PRESETS.map(c => (
              <button key={c} onClick={() => setColor(c)} title={c}
                className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-110 ${color === c ? 'border-blue-500 ring-2 ring-blue-200 ring-offset-1' : 'border-transparent'}`}
                style={{ backgroundColor: c, boxShadow: c === '#ffffff' ? 'inset 0 0 0 1px #e5e7eb' : undefined }} />
            ))}
          </div>
          {/* Custom color */}
          <div className="flex items-center gap-2 pt-1">
            <div className="relative w-9 h-9 rounded-lg border border-gray-200 overflow-hidden cursor-pointer flex-shrink-0 shadow-sm"
              style={{ backgroundColor: color }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
            </div>
            <input type="text" value={color} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setColor(e.target.value) }}
              className="flex-1 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded focus:outline-none focus:border-blue-400 text-gray-800 uppercase" />
            <SliderRow label="" value={opacity} min={0} max={1} step={0.01}
              onChange={setOpacity} format={v => `${Math.round(v * 100)}%`} />
          </div>
        </Section>

        {/* SPACING */}
        <Section title="Spacing">
          <SliderRow label="Letter Spacing" value={letterSpacing} min={-5} max={30} step={0.5}
            onChange={setLetterSpacing} />
          <SliderRow label="Line Height" value={lineHeight} min={0.8} max={3} step={0.1}
            onChange={setLineHeight} format={v => v.toFixed(1)} />
          <SliderRow label="Opacity" value={opacity} min={0} max={1} step={0.01}
            onChange={setOpacity} format={v => `${Math.round(v * 100)}%`} />
          <SliderRow label="Rotation" value={rotation} min={0} max={360} step={1}
            onChange={setRotation} format={v => `${v}°`} />
        </Section>

        {/* EFFECTS */}
        <Section title="Effects" defaultOpen={false}>
          <CheckRow label="Curved Text" value={curvedText} onChange={setCurvedText} />
          <CheckRow label="Outline" value={outline} onChange={setOutline} />
          <CheckRow label="Shadow" value={shadow} onChange={setShadow} />
        </Section>

        {/* LAYERS */}
        <Section title="Layer Controls" defaultOpen={false}>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: 'Bring Forward', icon: ArrowUp,     fn: () => bringForward(elementId) },
              { label: 'Send Backward', icon: ArrowDown,   fn: () => sendBackward(elementId) },
              { label: 'Bring to Front', icon: ChevronsUp,  fn: () => bringToFront(elementId) },
              { label: 'Send to Back',   icon: ChevronsDown, fn: () => sendToBack(elementId) },
            ].map(({ label, icon: Icon, fn }) => (
              <button key={label} onClick={fn}
                className="flex items-center gap-1.5 px-2.5 py-2 text-xs text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors">
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />{label}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 pt-1">
            <button onClick={() => { setLocked(v => !v) }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg border transition-colors ${locked ? 'bg-orange-50 border-orange-400 text-orange-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              {locked ? 'Locked' : 'Lock'}
            </button>
            <button onClick={() => setVisible(v => !v)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs rounded-lg border transition-colors ${!visible ? 'bg-gray-100 border-gray-400 text-gray-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {visible ? 'Visible' : 'Hidden'}
            </button>
          </div>

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
        </Section>

        {/* Position info footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-500">
            <span>X: {Math.round(el.x ?? 0)}</span>
            <span>Y: {Math.round(el.y ?? 0)}</span>
            <span>W: {Math.round(el.width ?? 0)}</span>
            <span>H: {Math.round(el.height ?? 0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
