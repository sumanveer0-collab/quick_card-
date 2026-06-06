'use client'
import { useState, useRef, useCallback } from 'react'
import { useEditorStore } from '@/store/editor.store'
import { Check, Plus, Pipette } from 'lucide-react'

// ── Colour palettes ──────────────────────────────────────────────────────────

const DEFAULT_COLORS = [
  '#000000', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#ffffff',
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#ec4899', '#f43f5e', '#0ea5e9', '#0284c7', '#1d4ed8',
]

const GRADIENT_COLORS = [
  'linear-gradient(135deg,#f97316,#ef4444)',
  'linear-gradient(135deg,#f59e0b,#f97316)',
  'linear-gradient(135deg,#84cc16,#10b981)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#ec4899,#f43f5e)',
  'linear-gradient(135deg,#8b5cf6,#3b82f6)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#1d4ed8,#6366f1)',
  'linear-gradient(135deg,#0f172a,#1e293b)',
  'linear-gradient(135deg,#fbbf24,#f59e0b)',
  'linear-gradient(135deg,#f9a8d4,#ec4899)',
]

const RECOMMENDED_COLORS = [
  '#3b82f6', '#1d4ed8', '#6366f1', '#8b5cf6',
  '#10b981', '#0ea5e9', '#f59e0b', '#ef4444',
]

// ── Small colour swatch ──────────────────────────────────────────────────────

function Swatch({
  color, selected, onClick, size = 'md',
}: {
  color: string; selected?: boolean; onClick: () => void; size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8'
  const isGrad = color.includes('gradient')

  return (
    <button
      onClick={onClick}
      title={color}
      className={`${dim} rounded-md border-2 transition-all hover:scale-110 relative flex-shrink-0 ${
        selected ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-400'
      }`}
      style={{ background: color }}
    >
      {selected && (
        <Check
          className="absolute inset-0 m-auto text-white drop-shadow"
          style={{ width: 12, height: 12 }}
          strokeWidth={3}
        />
      )}
    </button>
  )
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
      {children}
    </p>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function ColorPanel() {
  const { elements, selectedId, updateElement, background, setBackground } = useEditorStore()
  const selectedEl = elements.find(el => el.id === selectedId)

  // Custom colour input
  const [customColor, setCustomColor] = useState('#3b82f6')
  const pickerRef = useRef<HTMLInputElement>(null)

  // Current element fill or card background
  const currentFill: string = selectedEl
    ? (selectedEl.fill || '#000000')
    : background || '#ffffff'

  const applyColor = useCallback((color: string) => {
    if (selectedEl) {
      updateElement(selectedEl.id, { fill: color })
    } else {
      setBackground(color)
    }
  }, [selectedEl, updateElement, setBackground])

  // Derive "logo colours" from all shape/text elements (unique fills)
  const logoColors = Array.from(
    new Set(
      elements
        .filter(el => el.fill && el.fill !== 'transparent' && el.fill !== 'none')
        .map(el => el.fill as string)
    )
  ).slice(0, 8)

  return (
    <div className="space-y-5">
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-gray-900">
          {selectedEl ? `Edit ${selectedEl.type === 'shape' ? 'Shape' : selectedEl.type === 'text' ? 'Text' : 'Element'}` : 'Card Background'}
        </h2>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {selectedEl ? `Select element colour` : 'Change background colour'}
        </p>
      </div>

      {/* Current colour + custom picker */}
      <div>
        <SectionLabel>New color</SectionLabel>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Colour preview chip */}
          <div
            className="w-8 h-8 rounded-md border border-gray-300 shadow-sm flex-shrink-0"
            style={{ background: currentFill }}
          />

          {/* Native colour picker trigger */}
          <button
            onClick={() => pickerRef.current?.click()}
            className="w-8 h-8 rounded-md border-2 border-dashed border-gray-300 hover:border-blue-400 flex items-center justify-center bg-white transition-colors"
            title="Pick custom colour"
          >
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
          <input
            ref={pickerRef}
            type="color"
            className="sr-only"
            value={customColor.startsWith('#') ? customColor : '#3b82f6'}
            onChange={e => {
              setCustomColor(e.target.value)
              applyColor(e.target.value)
            }}
          />

          {/* Hex text input */}
          <input
            type="text"
            value={currentFill.startsWith('#') ? currentFill : ''}
            maxLength={7}
            placeholder="#000000"
            onChange={e => {
              const v = e.target.value
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) applyColor(v)
            }}
            className="flex-1 min-w-0 text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:outline-none focus:border-blue-400 font-mono"
          />
        </div>
      </div>

      {/* Recommended colours */}
      <div>
        <SectionLabel>Recommended colors</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDED_COLORS.map(c => (
            <Swatch key={c} color={c} selected={currentFill === c} onClick={() => applyColor(c)} />
          ))}
        </div>
      </div>

      {/* Logo / element colours — auto-extracted */}
      {logoColors.length > 0 && (
        <div>
          <SectionLabel>Element colors</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {logoColors.map(c => (
              <Swatch key={c} color={c} selected={currentFill === c} onClick={() => applyColor(c)} />
            ))}
          </div>
        </div>
      )}

      {/* Default colour grid */}
      <div>
        <SectionLabel>Default colors</SectionLabel>
        <div className="grid grid-cols-6 gap-1.5">
          {DEFAULT_COLORS.map(c => (
            <Swatch key={c} color={c} size="sm" selected={currentFill === c} onClick={() => applyColor(c)} />
          ))}
        </div>
      </div>

      {/* Gradient colours */}
      <div>
        <SectionLabel>Gradient colors</SectionLabel>
        <div className="grid grid-cols-6 gap-1.5">
          {GRADIENT_COLORS.map(g => (
            <button
              key={g}
              onClick={() => applyColor(g)}
              title="Gradient"
              className={`w-6 h-6 rounded-md border-2 transition-all hover:scale-110 ${
                currentFill === g ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ background: g }}
            />
          ))}
        </div>
      </div>

      {/* Apply to all hint */}
      {selectedEl && (
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => {
              const fill = selectedEl.fill || '#000000'
              elements.forEach(el => {
                if (el.type === selectedEl.type && el.id !== selectedEl.id) {
                  updateElement(el.id, { fill })
                }
              })
            }}
            className="w-full py-2 text-xs font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Apply to all {selectedEl.type === 'shape' ? 'shapes' : selectedEl.type === 'text' ? 'text' : 'elements'}
          </button>
        </div>
      )}
    </div>
  )
}
