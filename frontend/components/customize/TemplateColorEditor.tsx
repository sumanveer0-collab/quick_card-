'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Palette, Check, RefreshCw } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import toast from 'react-hot-toast'

interface ColorScheme {
  id: string
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  preview: string[]
}

const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: 'dark-purple',
    name: 'Dark Purple',
    primary: '#5B21B6',
    secondary: '#8B5CF6',
    accent: '#A78BFA',
    background: '#2E1065',
    text: '#FFFFFF',
    preview: ['#5B21B6', '#8B5CF6', '#A78BFA', '#2E1065']
  },
  {
    id: 'crimson-red',
    name: 'Crimson Red',
    primary: '#991B1B',
    secondary: '#DC2626',
    accent: '#F87171',
    background: '#7F1D1D',
    text: '#FFFFFF',
    preview: ['#991B1B', '#DC2626', '#F87171', '#7F1D1D']
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    primary: '#2D5016',
    secondary: '#4A7C2C',
    accent: '#D4AF37',
    background: '#1A3409',
    text: '#FFFFFF',
    preview: ['#2D5016', '#4A7C2C', '#D4AF37', '#1A3409']
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    primary: '#1E3A8A',
    secondary: '#3B82F6',
    accent: '#60A5FA',
    background: '#0F172A',
    text: '#FFFFFF',
    preview: ['#1E3A8A', '#3B82F6', '#60A5FA', '#0F172A']
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    primary: '#C2410C',
    secondary: '#F97316',
    accent: '#FB923C',
    background: '#7C2D12',
    text: '#FFFFFF',
    preview: ['#C2410C', '#F97316', '#FB923C', '#7C2D12']
  },
  {
    id: 'emerald-teal',
    name: 'Emerald Teal',
    primary: '#047857',
    secondary: '#10B981',
    accent: '#34D399',
    background: '#064E3B',
    text: '#FFFFFF',
    preview: ['#047857', '#10B981', '#34D399', '#064E3B']
  },
  {
    id: 'golden-yellow',
    name: 'Golden Yellow',
    primary: '#B45309',
    secondary: '#F59E0B',
    accent: '#FCD34D',
    background: '#78350F',
    text: '#FFFFFF',
    preview: ['#B45309', '#F59E0B', '#FCD34D', '#78350F']
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Navy',
    primary: '#1E293B',
    secondary: '#334155',
    accent: '#64748B',
    background: '#0F172A',
    text: '#FFFFFF',
    preview: ['#1E293B', '#334155', '#64748B', '#0F172A']
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    primary: '#BE185D',
    secondary: '#EC4899',
    accent: '#F9A8D4',
    background: '#831843',
    text: '#FFFFFF',
    preview: ['#BE185D', '#EC4899', '#F9A8D4', '#831843']
  },
  {
    id: 'slate-gray',
    name: 'Slate Gray',
    primary: '#475569',
    secondary: '#64748B',
    accent: '#94A3B8',
    background: '#1E293B',
    text: '#FFFFFF',
    preview: ['#475569', '#64748B', '#94A3B8', '#1E293B']
  },
  {
    id: 'bronze-brown',
    name: 'Bronze Brown',
    primary: '#78350F',
    secondary: '#92400E',
    accent: '#D97706',
    background: '#451A03',
    text: '#FFFFFF',
    preview: ['#78350F', '#92400E', '#D97706', '#451A03']
  },
  {
    id: 'mint-green',
    name: 'Mint Green',
    primary: '#059669',
    secondary: '#10B981',
    accent: '#6EE7B7',
    background: '#064E3B',
    text: '#FFFFFF',
    preview: ['#059669', '#10B981', '#6EE7B7', '#064E3B']
  }
]

interface TemplateColorEditorProps {
  compact?: boolean
}

export default function TemplateColorEditor({ compact = false }: TemplateColorEditorProps) {
  const { elements, updateElement, setBackground, background } = useEditorStore()
  const [selectedScheme, setSelectedScheme] = useState<string>('dark-purple')
  const [isApplying, setIsApplying] = useState(false)

  const applyColorScheme = (scheme: ColorScheme) => {
    setIsApplying(true)
    setSelectedScheme(scheme.id)

    try {
      // Update background
      setBackground(scheme.background)

      // Update all elements with color mapping
      elements.forEach((element) => {
        if (element.type === 'text') {
          // Map text colors
          const currentColor = element.fill?.toLowerCase()
          let newColor = scheme.text

          // If text is currently a dark color, keep it dark
          if (currentColor && (
            currentColor.includes('#000') ||
            currentColor.includes('#1a') ||
            currentColor.includes('#2d') ||
            currentColor.includes('#3') ||
            currentColor.includes('#4') ||
            currentColor.includes('#5')
          )) {
            newColor = scheme.primary
          }
          // If text is currently a gold/yellow/orange color, map to accent
          else if (currentColor && (
            currentColor.includes('#d4af') ||
            currentColor.includes('#fcd') ||
            currentColor.includes('#f59') ||
            currentColor.includes('#fb9') ||
            currentColor.includes('#fbb')
          )) {
            newColor = scheme.accent
          }

          updateElement(element.id, { fill: newColor })
        } else if (element.type === 'shape') {
          // Map shape colors intelligently
          const currentFill = element.fill?.toLowerCase() || ''
          let newFill = scheme.secondary // Default to secondary for shapes

          // Detect color family and map appropriately
          if (currentFill) {
            // Green shades → Secondary
            if (currentFill.includes('#4a7') || 
                currentFill.includes('#10b') || 
                currentFill.includes('#059') ||
                currentFill.includes('#047') ||
                currentFill.includes('#2d5') ||
                currentFill.includes('green')) {
              newFill = scheme.secondary
            }
            // Gold/Yellow/Orange shades → Accent
            else if (currentFill.includes('#d4af') || 
                     currentFill.includes('#fcd') ||
                     currentFill.includes('#f59') ||
                     currentFill.includes('#fb9') ||
                     currentFill.includes('#fbb') ||
                     currentFill.includes('gold') ||
                     currentFill.includes('yellow') ||
                     currentFill.includes('orange')) {
              newFill = scheme.accent
            }
            // Dark shades → Background
            else if (currentFill.includes('#1a3') || 
                     currentFill.includes('#064') ||
                     currentFill.includes('#0f1') ||
                     currentFill.includes('#2e1') ||
                     currentFill.includes('#451')) {
              newFill = scheme.background
            }
            // Blue shades → Primary
            else if (currentFill.includes('#1e3') ||
                     currentFill.includes('#3b8') ||
                     currentFill.includes('#60a') ||
                     currentFill.includes('blue')) {
              newFill = scheme.primary
            }
            // Purple shades → Primary
            else if (currentFill.includes('#5b2') ||
                     currentFill.includes('#8b5') ||
                     currentFill.includes('#a78') ||
                     currentFill.includes('purple')) {
              newFill = scheme.primary
            }
            // Red shades → Primary
            else if (currentFill.includes('#991') ||
                     currentFill.includes('#dc2') ||
                     currentFill.includes('#f87') ||
                     currentFill.includes('red')) {
              newFill = scheme.primary
            }
            // Any other color → Secondary (default)
            else {
              newFill = scheme.secondary
            }
          }

          // Update stroke color to match or complement
          const currentStroke = element.stroke?.toLowerCase() || ''
          let newStroke = scheme.primary

          if (currentStroke) {
            // Match stroke to fill logic
            if (currentStroke.includes('#d4af') || 
                currentStroke.includes('#fcd') ||
                currentStroke.includes('gold') ||
                currentStroke.includes('yellow')) {
              newStroke = scheme.accent
            } else if (currentStroke.includes('#4a7') || 
                       currentStroke.includes('#10b') ||
                       currentStroke.includes('green')) {
              newStroke = scheme.secondary
            } else {
              newStroke = scheme.primary
            }
          }

          updateElement(element.id, {
            fill: newFill,
            stroke: newStroke
          })
        }
      })

      toast.success(`Applied ${scheme.name} color scheme!`)
    } catch (error) {
      console.error('Error applying color scheme:', error)
      toast.error('Failed to apply color scheme')
    } finally {
      setTimeout(() => setIsApplying(false), 500)
    }
  }

  const resetColors = () => {
    setSelectedScheme('dark-purple')
    toast.success('Color scheme reset')
  }

  const selectedSchemeData = COLOR_SCHEMES.find(s => s.id === selectedScheme)

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Template Colors
          </h3>
          {selectedScheme && (
            <button
              onClick={resetColors}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {COLOR_SCHEMES.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => applyColorScheme(scheme)}
              disabled={isApplying}
              className={`relative group ${isApplying ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={scheme.name}
            >
              <div className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedScheme === scheme.id
                  ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                  : 'border-gray-200 hover:border-gray-400 hover:scale-105'
              }`}>
                <div className="grid grid-cols-2 h-full">
                  {scheme.preview.map((color, index) => (
                    <div
                      key={index}
                      className="w-full h-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {selectedScheme === scheme.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}

              <p className="text-[10px] text-gray-600 mt-1 text-center truncate">
                {scheme.name}
              </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Vistaprint-style full view (simplified)
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Template color</h2>
        <p className="text-sm text-gray-600 mt-1">
          Selected color: <span className="font-semibold">{selectedSchemeData?.name || 'Dark Purple'}</span>
        </p>
      </div>

      {/* Circular Color Swatches - Vistaprint Style (Only 5 colors) */}
      <div className="flex gap-3">
        {COLOR_SCHEMES.slice(0, 5).map((scheme) => (
          <button
            key={scheme.id}
            onClick={() => applyColorScheme(scheme)}
            disabled={isApplying}
            className={`relative group ${isApplying ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={scheme.name}
          >
            <div className={`w-10 h-10 rounded-full border-2 transition-all ${
              selectedScheme === scheme.id
                ? 'border-blue-500 ring-2 ring-blue-200 scale-110'
                : 'border-gray-300 hover:border-gray-400 hover:scale-105'
            }`}
              style={{ backgroundColor: scheme.primary }}
            >
              {selectedScheme === scheme.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
