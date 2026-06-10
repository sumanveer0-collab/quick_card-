'use client'

import { useCallback, useEffect, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Pipette, Ban } from 'lucide-react'
import {
  BACKGROUND_GRADIENTS,
  BACKGROUND_SWATCHES,
  isGradientBackground,
  pushRecentBackgroundColor,
  readRecentBackgroundColors,
  toPickerHex,
} from '@/lib/background-palette'

export interface BackgroundColorPickerProps {
  value: string
  onChange: (value: string) => void
  title?: string
  showGradients?: boolean
}

type TabId = 'swatches' | 'gradients'

function SwatchButton({
  color,
  selected,
  onClick,
  isGradient,
}: {
  color: string
  selected: boolean
  onClick: () => void
  isGradient?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={color}
      className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
        selected ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
      }`}
      style={{ background: isGradient ? color : color, backgroundColor: isGradient ? undefined : color }}
    />
  )
}

export default function BackgroundColorPicker({
  value,
  onChange,
  title = 'Background color',
  showGradients = true,
}: BackgroundColorPickerProps) {
  const [tab, setTab] = useState<TabId>('swatches')
  const [pickerHex, setPickerHex] = useState(() => toPickerHex(value))
  const [recent, setRecent] = useState<string[]>([])

  useEffect(() => {
    if (!isGradientBackground(value)) {
      setPickerHex(toPickerHex(value))
    }
  }, [value])

  useEffect(() => {
    setRecent(readRecentBackgroundColors())
  }, [value])

  const applySolid = useCallback((color: string) => {
    const hex = toPickerHex(color)
    setPickerHex(hex)
    pushRecentBackgroundColor(hex)
    setRecent(readRecentBackgroundColors())
    onChange(hex)
  }, [onChange])

  const applyGradient = useCallback((gradient: string) => {
    onChange(gradient)
  }, [onChange])

  const handleEyedropper = async () => {
    if (typeof window === 'undefined' || !('EyeDropper' in window)) return
    try {
      // @ts-expect-error EyeDropper is not in all TS lib versions
      const dropper = new window.EyeDropper()
      const result = await dropper.open()
      if (result?.sRGBHex) applySolid(result.sRGBHex)
    } catch {
      // user cancelled
    }
  }

  const isGradient = isGradientBackground(value)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        <p className="text-[11px] text-gray-400 mt-0.5">
          Pick a solid color or gradient for the card
        </p>
      </div>

      {/* Visual picker */}
      <div className="qc-bg-picker rounded-lg overflow-hidden border border-gray-200">
        <HexColorPicker
          color={pickerHex}
          onChange={(c) => {
            setPickerHex(c.toUpperCase())
            applySolid(c)
          }}
        />
      </div>

      {/* Hex + tools */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleEyedropper}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500"
          title="Pick color from screen"
        >
          <Pipette className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => applySolid('#FFFFFF')}
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-400"
          title="Reset to white"
        >
          <Ban className="w-4 h-4" />
        </button>
        <div className="flex-1 flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
          <span className="pl-2.5 text-xs text-gray-400 font-mono">#</span>
          <input
            type="text"
            value={isGradient ? '' : pickerHex.replace('#', '')}
            maxLength={6}
            placeholder="FFFFFF"
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
              if (raw.length === 6) applySolid(`#${raw}`)
              else setPickerHex(`#${raw.padEnd(6, '0').slice(0, 6)}`)
            }}
            className="flex-1 py-2 pr-2 text-xs font-mono uppercase focus:outline-none text-gray-800"
          />
        </div>
        <div
          className="w-9 h-9 rounded-lg border border-gray-200 flex-shrink-0"
          style={{ background: isGradient ? value : pickerHex }}
        />
      </div>

      {/* Tabs */}
      {showGradients && (
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setTab('swatches')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'swatches'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Swatches
          </button>
          <button
            type="button"
            onClick={() => setTab('gradients')}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
              tab === 'gradients'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            Gradients
          </button>
        </div>
      )}

      {/* Recent */}
      {tab === 'swatches' && recent.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Recent colors
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map(c => (
              <SwatchButton
                key={c}
                color={c}
                selected={!isGradient && value.toUpperCase() === c}
                onClick={() => applySolid(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Swatches grid */}
      {tab === 'swatches' && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Preset colors
          </p>
          <div className="grid grid-cols-6 gap-2">
            {BACKGROUND_SWATCHES.map(c => (
              <SwatchButton
                key={c}
                color={c}
                selected={!isGradient && value.toUpperCase() === c}
                onClick={() => applySolid(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Gradients */}
      {showGradients && tab === 'gradients' && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Gradient backgrounds
          </p>
          <div className="grid grid-cols-2 gap-2">
            {BACKGROUND_GRADIENTS.map(g => (
              <button
                key={g.value}
                type="button"
                onClick={() => applyGradient(g.value)}
                title={g.name}
                className={`aspect-[1.6] rounded-lg border-2 transition-all hover:scale-[1.02] ${
                  value === g.value
                    ? 'border-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ background: g.value }}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        .qc-bg-picker .react-colorful {
          width: 100%;
          height: 168px;
        }
        .qc-bg-picker .react-colorful__saturation {
          border-radius: 0;
        }
        .qc-bg-picker .react-colorful__hue {
          height: 16px;
        }
        .qc-bg-picker .react-colorful__pointer {
          width: 18px;
          height: 18px;
          border-width: 2px;
        }
      `}</style>
    </div>
  )
}
