'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2, Replace, Crop, Eraser, Maximize2, Sparkles,
  SlidersHorizontal, Grid3x3, MoreHorizontal, X,
  Copy, Trash2, Lock, Unlock, RotateCw, Sun, Contrast, Droplets,
} from 'lucide-react'
import { useEditorStore, SAFE_AREA_WIDTH, SAFE_AREA_HEIGHT, SAFE_AREA_X, SAFE_AREA_Y } from '@/store/editor.store'
import toast from 'react-hot-toast'

interface Props {
  elementId: string
  onDelete?: () => void
}

export default function ImageFloatingToolbar({ elementId, onDelete }: Props) {
  const { elements, updateElement, duplicateElement, deleteElement } = useEditorStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [showAdjust, setShowAdjust] = useState(false)
  const [showMore, setShowMore] = useState(false)

  const el = elements.find(e => e.id === elementId)
  if (!el || el.type !== 'image') return null

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
    toast.success('Image expanded')
  }

  const handleSharpen = () => {
    const next = Math.min(100, (el.sharpen || 0) + 20)
    updateElement(elementId, { sharpen: next })
    toast.success('Sharpen applied')
  }

  const handleEnhance = () => {
    updateElement(elementId, {
      brightness: Math.min(30, (el.brightness || 0) + 10),
      contrast: Math.min(25, (el.contrast || 0) + 8),
      sharpen: Math.min(40, (el.sharpen || 0) + 15),
    })
    toast.success('Image enhanced')
  }

  const handleRemoveBg = () => {
    toast('Background removal coming soon', { icon: '✨' })
  }

  const handleCrop = () => {
    toast('Crop tool coming soon', { icon: '✂️' })
  }

  const handleDelete = () => {
    deleteElement(elementId)
    onDelete?.()
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
          {/* Enhance */}
          <button
            type="button"
            onClick={handleEnhance}
            className="flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-800 text-xs font-semibold transition-colors"
            title="Auto enhance"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Enhance
          </button>

          <Divider />

          <IconBtn icon={Replace} title="Replace image" onClick={() => fileRef.current?.click()} />
          <IconBtn icon={Crop} title="Crop" onClick={handleCrop} />
          <IconBtn icon={Eraser} title="Remove background" onClick={handleRemoveBg} />
          <IconBtn icon={Maximize2} title="Expand to fit" onClick={handleExpand} />
          <IconBtn icon={Sparkles} title="Sharpen" onClick={handleSharpen} />

          <Divider />

          <IconBtn
            icon={SlidersHorizontal}
            title="Adjust"
            active={showAdjust}
            onClick={() => { setShowAdjust(v => !v); setShowMore(false) }}
          />
          <IconBtn
            icon={Grid3x3}
            title="Opacity"
            onClick={() => {
              const next = (el.opacity ?? 1) > 0.5 ? 0.5 : 1
              updateElement(elementId, { opacity: next })
            }}
          />
          <IconBtn
            icon={MoreHorizontal}
            title="More options"
            active={showMore}
            onClick={() => { setShowMore(v => !v); setShowAdjust(false) }}
          />
        </div>

        {/* Adjust popover */}
        <AnimatePresence>
          {showAdjust && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-3 space-y-2.5"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-700">Adjust</span>
                <button type="button" onClick={() => setShowAdjust(false)} className="p-0.5 hover:bg-gray-100 rounded">
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
              <SliderRow
                icon={Sun}
                label="Brightness"
                value={el.brightness || 0}
                min={-100}
                max={100}
                onChange={v => updateElement(elementId, { brightness: v })}
              />
              <SliderRow
                icon={Contrast}
                label="Contrast"
                value={el.contrast || 0}
                min={-100}
                max={100}
                onChange={v => updateElement(elementId, { contrast: v })}
              />
              <SliderRow
                icon={Droplets}
                label="Opacity"
                value={Math.round((el.opacity ?? 1) * 100)}
                min={0}
                max={100}
                onChange={v => updateElement(elementId, { opacity: v / 100 })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* More popover */}
        <AnimatePresence>
          {showMore && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-1 min-w-[140px]"
            >
              <MoreItem
                icon={el.locked ? Lock : Unlock}
                label={el.locked ? 'Unlock' : 'Lock'}
                onClick={() => updateElement(elementId, { locked: !el.locked })}
              />
              <MoreItem icon={Copy} label="Duplicate" onClick={() => duplicateElement(elementId)} />
              <MoreItem icon={RotateCw} label="Rotate 90°" onClick={() => updateElement(elementId, { rotation: ((el.rotation || 0) + 90) % 360 })} />
              <MoreItem icon={Trash2} label="Delete" danger onClick={handleDelete} />
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleReplaceFile}
        />
    </motion.div>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />
}

function IconBtn({
  icon: Icon,
  title,
  onClick,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-full text-gray-700 transition-colors flex-shrink-0 ${
        active ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

function SliderRow({
  icon: Icon,
  label,
  value,
  min,
  max,
  onChange,
}: {
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
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 accent-blue-600 cursor-pointer"
      />
    </div>
  )
}

function MoreItem({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}
