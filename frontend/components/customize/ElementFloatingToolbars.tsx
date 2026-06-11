'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2, Replace, Crop, Eraser, Maximize2, Sparkles,
  SlidersHorizontal, Grid3x3, MoreHorizontal, X, ExternalLink,
  Copy, Trash2, Lock, Unlock, RotateCw, Sun, Contrast, Droplets,
  Palette, Plus, FlipHorizontal,
} from 'lucide-react'
import {
  useEditorStore,
  SAFE_AREA_WIDTH, SAFE_AREA_HEIGHT, SAFE_AREA_X, SAFE_AREA_Y,
  type CanvasElement,
} from '@/store/editor.store'
import toast from 'react-hot-toast'
import { ALL_ICONS } from '@/lib/graphics/icons'
import { flattenIconSvg } from '@/lib/graphics/flatten-icon-svg'

type Variant = 'image' | 'shape' | 'icon'

const ICON_COLORS = [
  '#000000', '#ffffff', '#3b82f6', '#10b981', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899', '#6b7280', '#0ea5e9',
]

// ─── Primary toolbar (fixed top of canvas) ───────────────────────────────────

export function ElementPrimaryToolbar({
  elementId,
  variant,
}: {
  elementId: string
  variant: Variant
}) {
  const { elements, updateElement } = useEditorStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const colorRef = useRef<HTMLInputElement>(null)
  const [showAdjust, setShowAdjust] = useState(false)

  const el = elements.find(e => e.id === elementId)
  if (!el || el.type !== variant) return null

  if (variant === 'icon') {
    return <IconPrimaryToolbar elementId={elementId} el={el} />
  }

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const src = ev.target?.result as string
      if (src) {
        updateElement(elementId, { src })
        toast.success('Image replaced')
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleExpand = () => {
    const scale = 1.12
    const newW = Math.min(SAFE_AREA_WIDTH, el.width * scale)
    const newH = Math.min(SAFE_AREA_HEIGHT, el.height * scale)
    updateElement(elementId, {
      width: newW,
      height: newH,
      x: SAFE_AREA_X + (SAFE_AREA_WIDTH - newW) / 2,
      y: SAFE_AREA_Y + (SAFE_AREA_HEIGHT - newH) / 2,
    })
    toast.success(variant === 'image' ? 'Image expanded' : 'Shape expanded')
  }

  const handleSmartEdit = () => {
    if (variant === 'image') {
      updateElement(elementId, {
        brightness: Math.min(30, (el.brightness || 0) + 10),
        contrast: Math.min(25, (el.contrast || 0) + 8),
        sharpen: Math.min(40, (el.sharpen || 0) + 15),
      })
      toast.success('Image enhanced')
    } else {
      updateElement(elementId, {
        opacity: Math.min(1, (el.opacity ?? 1) + 0.05),
      })
      toast.success('Style applied')
    }
  }

  const handleSharpen = () => {
    if (variant === 'image') {
      updateElement(elementId, { sharpen: Math.min(100, (el.sharpen || 0) + 20) })
      toast.success('Sharpen applied')
    } else {
      updateElement(elementId, { strokeWidth: Math.min(20, (el.strokeWidth || 0) + 2) })
      toast.success('Outline enhanced')
    }
  }

  const handleCrop = () => {
    if (variant === 'image') {
      toast('Crop tool coming soon', { icon: '✂️' })
    } else {
      const ratio = 0.9
      updateElement(elementId, {
        width: el.width * ratio,
        height: el.height * ratio,
        x: el.x + el.width * (1 - ratio) / 2,
        y: el.y + el.height * (1 - ratio) / 2,
      })
      toast.success('Shape trimmed')
    }
  }

  const handleRemoveBg = () => {
    if (variant === 'image') {
      toast('Background removal coming soon', { icon: '✨' })
    } else {
      updateElement(elementId, { fill: 'transparent', opacity: 0.85 })
      toast.success('Fill cleared')
    }
  }

  const handleTransparency = () => {
    const next = (el.opacity ?? 1) > 0.5 ? 0.5 : 1
    updateElement(elementId, { opacity: next })
  }

  const handleExport = () => {
    if (variant === 'image' && el.src) {
      const a = document.createElement('a')
      a.href = el.src
      a.download = 'element.png'
      a.click()
      toast.success('Download started')
    } else {
      toast('Export available for images', { icon: '📤' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      className="relative"
    >
      <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center px-1 py-1 gap-0.5 whitespace-nowrap">
        <button
          type="button"
          onClick={handleSmartEdit}
          className="flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-800 text-xs font-semibold transition-colors"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Smart Edit
        </button>

        <Divider />

        <IconBtn
          icon={variant === 'image' ? Replace : Palette}
          title={variant === 'image' ? 'Replace image' : 'Change color'}
          onClick={() => variant === 'image' ? fileRef.current?.click() : colorRef.current?.click()}
        />
        <IconBtn icon={Crop} title="Crop" onClick={handleCrop} />
        <IconBtn icon={Eraser} title={variant === 'image' ? 'Remove background' : 'Clear fill'} onClick={handleRemoveBg} />
        <IconBtn icon={Maximize2} title="Expand" onClick={handleExpand} />
        <IconBtn icon={Sparkles} title={variant === 'image' ? 'Sharpen' : 'Enhance outline'} onClick={handleSharpen} />

        <Divider />

        <IconBtn
          icon={SlidersHorizontal}
          title="Adjust"
          active={showAdjust}
          onClick={() => setShowAdjust(v => !v)}
        />
        <IconBtn icon={Grid3x3} title="Transparency" onClick={handleTransparency} />
        <IconBtn icon={ExternalLink} title="Download" onClick={handleExport} />
      </div>

      <AnimatePresence>
        {showAdjust && (
          <AdjustPanel el={el} elementId={elementId} variant={variant} onClose={() => setShowAdjust(false)} />
        )}
      </AnimatePresence>

      {variant === 'image' && (
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleReplaceFile} />
      )}
      {variant === 'shape' && (
        <input
          ref={colorRef}
          type="color"
          className="hidden"
          value={el.fill?.startsWith('#') ? el.fill : '#3b82f6'}
          onChange={e => updateElement(elementId, { fill: e.target.value })}
        />
      )}
    </motion.div>
  )
}

// ─── Icon primary toolbar (Vistaprint-style labeled buttons) ───────────────

function IconPrimaryToolbar({ elementId, el }: { elementId: string; el: CanvasElement }) {
  const { updateElement } = useEditorStore()
  const colorRef = useRef<HTMLInputElement>(null)
  const [showReplace, setShowReplace] = useState(false)
  const [showColor, setShowColor] = useState(false)

  const handleCrop = () => {
    const ratio = 0.9
    updateElement(elementId, {
      width: el.width * ratio,
      height: el.height * ratio,
      x: el.x + el.width * (1 - ratio) / 2,
      y: el.y + el.height * (1 - ratio) / 2,
    })
    toast.success('Icon trimmed')
  }

  const handleTransparency = () => {
    const next = (el.opacity ?? 1) > 0.5 ? 0.5 : 1
    updateElement(elementId, { opacity: next })
    toast.success(`Opacity ${Math.round(next * 100)}%`)
  }

  const handleFlip = () => {
    updateElement(elementId, { scaleX: (el.scaleX || 1) * -1 })
    toast.success('Flipped')
  }

  const setColor = (color: string) => {
    updateElement(elementId, { fill: color })
    toast.success('Color updated')
  }

  const replaceIcon = (svg: string, name: string) => {
    updateElement(elementId, { svg: flattenIconSvg(svg), name })
    setShowReplace(false)
    toast.success(`Replaced with ${name}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.14, ease: 'easeOut' }}
      className="relative"
    >
      <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center px-1 py-1 gap-0.5 whitespace-nowrap">
        <LabeledBtn icon={Replace} label="Replace" onClick={() => { setShowReplace(v => !v); setShowColor(false) }} active={showReplace} />
        <Divider />
        <LabeledBtn icon={Crop} label="Crop" onClick={handleCrop} />
        <LabeledBtn icon={Eraser} label="Remove BG" disabled />
        <LabeledBtn icon={Sparkles} label="Sharpen" disabled />
        <LabeledBtn icon={Palette} label="Color" onClick={() => { setShowColor(v => !v); setShowReplace(false) }} active={showColor} />
        <IconBtn icon={Grid3x3} title="Transparency" onClick={handleTransparency} />
        <IconBtn icon={FlipHorizontal} title="Flip horizontal" onClick={handleFlip} />
      </div>

      <AnimatePresence>
        {showReplace && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50"
          >
            <p className="text-xs font-bold text-gray-700 mb-2">Replace icon</p>
            <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
              {ALL_ICONS.map(icon => (
                <button
                  key={icon.id}
                  type="button"
                  title={icon.name}
                  onClick={() => replaceIcon(icon.svg, icon.name)}
                  className="w-10 h-10 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 flex items-center justify-center p-1.5 transition-colors"
                  dangerouslySetInnerHTML={{
                    __html: flattenIconSvg(icon.svg, el.fill || '#000000'),
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        {showColor && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50"
          >
            <p className="text-xs font-bold text-gray-700 mb-2">Icon color</p>
            <input
              ref={colorRef}
              type="color"
              value={el.fill?.startsWith('#') ? el.fill : '#000000'}
              onChange={e => setColor(e.target.value)}
              className="w-full h-9 rounded-lg cursor-pointer mb-2"
            />
            <div className="grid grid-cols-5 gap-1.5">
              {ICON_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    el.fill === c ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Secondary toolbar (above/below selected element on card) ────────────────

export function ElementSecondaryToolbar({
  elementId,
  displayScale,
  onDelete,
  placement = 'below',
}: {
  elementId: string
  displayScale: number
  onDelete?: () => void
  placement?: 'above' | 'below'
}) {
  const { elements, updateElement, duplicateElement, deleteElement } = useEditorStore()
  const [showMore, setShowMore] = useState(false)

  const el = elements.find(e => e.id === elementId)
  if (!el || (el.type !== 'image' && el.type !== 'shape' && el.type !== 'icon')) return null

  const centerX = (el.x + el.width / 2) * displayScale
  const topY = placement === 'above'
    ? el.y * displayScale - 46
    : (el.y + el.height) * displayScale + 10

  const handleDelete = () => {
    deleteElement(elementId)
    onDelete?.()
  }

  return (
    <div
      className="absolute z-[200] pointer-events-none"
      style={{ left: centerX, top: topY, transform: 'translateX(-50%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative pointer-events-auto"
      >
        <div className="bg-white rounded-full shadow-lg border border-gray-200 flex items-center px-1 py-1 gap-0.5">
          <SecBtn
            icon={el.locked ? Lock : Unlock}
            title={el.locked ? 'Unlock' : 'Lock'}
            active={!!el.locked}
            onClick={() => updateElement(elementId, { locked: !el.locked })}
          />
          <SecBtn
            icon={Copy}
            title="Duplicate"
            onClick={() => duplicateElement(elementId)}
          />
          <SecBtn
            icon={Trash2}
            title="Delete"
            danger
            onClick={handleDelete}
          />
          <SecBtn
            icon={MoreHorizontal}
            title="More"
            active={showMore}
            onClick={() => setShowMore(v => !v)}
          />
        </div>

        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-1 min-w-[148px]"
            >
              <MoreItem icon={RotateCw} label="Rotate 90°" onClick={() => updateElement(elementId, { rotation: ((el.rotation || 0) + 90) % 360 })} />
              <MoreItem icon={FlipHorizontal} label="Flip horizontal" onClick={() => updateElement(elementId, { scaleX: (el.scaleX || 1) * -1 })} />
              {el.type === 'shape' && (
                <MoreItem icon={Plus} label="Thicker stroke" onClick={() => updateElement(elementId, { strokeWidth: (el.strokeWidth || 0) + 1 })} />
              )}
              <MoreItem
                icon={Droplets}
                label={`Opacity ${Math.round((el.opacity ?? 1) * 100)}%`}
                onClick={() => updateElement(elementId, { opacity: (el.opacity ?? 1) > 0.5 ? 0.3 : 1 })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ─── Shared UI pieces ────────────────────────────────────────────────────────

function AdjustPanel({
  el, elementId, variant, onClose,
}: {
  el: CanvasElement
  elementId: string
  variant: Variant
  onClose: () => void
}) {
  const { updateElement } = useEditorStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-3 space-y-2.5 z-50"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-700">Adjust</span>
        <button type="button" onClick={onClose} className="p-0.5 hover:bg-gray-100 rounded">
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>

      {variant === 'image' && (
        <>
          <SliderRow icon={Sun} label="Brightness" value={el.brightness || 0} min={-100} max={100}
            onChange={v => updateElement(elementId, { brightness: v })} />
          <SliderRow icon={Contrast} label="Contrast" value={el.contrast || 0} min={-100} max={100}
            onChange={v => updateElement(elementId, { contrast: v })} />
        </>
      )}

      {variant === 'shape' && (
        <SliderRow icon={Palette} label="Stroke" value={el.strokeWidth || 0} min={0} max={20}
          onChange={v => updateElement(elementId, { strokeWidth: v })} />
      )}

      <SliderRow icon={Droplets} label="Opacity" value={Math.round((el.opacity ?? 1) * 100)} min={0} max={100}
        onChange={v => updateElement(elementId, { opacity: v / 100 })} />
    </motion.div>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />
}

function LabeledBtn({ icon: Icon, label, onClick, active = false, disabled = false }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick?: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex-shrink-0 ${
        disabled
          ? 'text-gray-300 cursor-not-allowed'
          : active
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-800 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}

function IconBtn({ icon: Icon, title, onClick, active = false }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-full text-gray-700 transition-colors flex-shrink-0 ${
        active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
      }`}>
      <Icon className="w-4 h-4" />
    </button>
  )
}

function SecBtn({ icon: Icon, title, onClick, active = false, danger = false }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  onClick: () => void
  active?: boolean
  danger?: boolean
}) {
  return (
    <button type="button" onClick={onClick} title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors flex-shrink-0 ${
        danger ? 'text-red-600 hover:bg-red-50' : active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
      }`}>
      <Icon className="w-4 h-4" />
    </button>
  )
}

function SliderRow({ icon: Icon, label, value, min, max, onChange }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500 flex items-center gap-1">
          <Icon className="w-3 h-3" /> {label}
        </span>
        <span className="text-[10px] font-mono text-gray-400">{value}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 accent-blue-600 cursor-pointer" />
    </div>
  )
}

function MoreItem({ icon: Icon, label, onClick }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}
