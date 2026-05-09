'use client'
import React, { useState } from 'react'
import { ColorPickerProps } from '@/types/fabric.types'

const COLOR_PRESETS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
  '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#A9DFBF', '#F9E79F'
]

export default function ColorPicker({ color, onChange, presets = COLOR_PRESETS }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color)

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setCustomColor(newColor)
    onChange(newColor)
  }

  const handlePresetClick = (presetColor: string) => {
    setCustomColor(presetColor)
    onChange(presetColor)
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
      {/* Custom Color Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value)
              if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                onChange(e.target.value)
              }
            }}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Color Presets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Presets
        </label>
        <div className="grid grid-cols-8 gap-1">
          {presets.map((presetColor) => (
            <button
              key={presetColor}
              onClick={() => handlePresetClick(presetColor)}
              className={`w-6 h-6 rounded border-2 transition-all hover:scale-110 ${
                color === presetColor 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>

      {/* Recent Colors (placeholder for future enhancement) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Recent Colors
        </label>
        <div className="text-xs text-gray-500 text-center py-2">
          Recent colors will appear here
        </div>
      </div>
    </div>
  )
}