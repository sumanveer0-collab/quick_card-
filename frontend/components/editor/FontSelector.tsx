'use client'
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { FontSelectorProps, FontOption } from '@/types/fabric.types'

const GOOGLE_FONTS: FontOption[] = [
  { label: 'Arial', value: 'Arial', category: 'sans-serif' },
  { label: 'Helvetica', value: 'Helvetica', category: 'sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman', category: 'serif' },
  { label: 'Georgia', value: 'Georgia', category: 'serif' },
  { label: 'Verdana', value: 'Verdana', category: 'sans-serif' },
  { label: 'Courier New', value: 'Courier New', category: 'monospace' },
  { label: 'Impact', value: 'Impact', category: 'sans-serif' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS', category: 'display' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS', category: 'sans-serif' },
  { label: 'Palatino', value: 'Palatino', category: 'serif' },
  { label: 'Garamond', value: 'Garamond', category: 'serif' },
  { label: 'Bookman', value: 'Bookman', category: 'serif' },
  { label: 'Avant Garde', value: 'Avant Garde', category: 'sans-serif' },
  { label: 'Optima', value: 'Optima', category: 'sans-serif' },
  { label: 'Futura', value: 'Futura', category: 'sans-serif' },
  { label: 'Gill Sans', value: 'Gill Sans', category: 'sans-serif' },
  { label: 'Baskerville', value: 'Baskerville', category: 'serif' },
  { label: 'Didot', value: 'Didot', category: 'serif' },
  { label: 'American Typewriter', value: 'American Typewriter', category: 'serif' },
  { label: 'Andale Mono', value: 'Andale Mono', category: 'monospace' },
]

export default function FontSelector({ value, onChange }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredFonts = GOOGLE_FONTS.filter(font =>
    font.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedFont = GOOGLE_FONTS.find(font => font.value === value) || GOOGLE_FONTS[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleFontSelect = (font: FontOption) => {
    onChange(font.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors min-w-[120px]"
      >
        <span 
          className="text-sm font-medium truncate"
          style={{ fontFamily: selectedFont.value }}
        >
          {selectedFont.label}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Font List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredFonts.map((font) => (
              <button
                key={font.value}
                onClick={() => handleFontSelect(font)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                  font.value === value ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="font-medium"
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {font.category}
                  </span>
                </div>
                <div 
                  className="text-sm text-gray-600 mt-1"
                  style={{ fontFamily: font.value }}
                >
                  The quick brown fox jumps
                </div>
              </button>
            ))}
          </div>

          {filteredFonts.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No fonts found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}