'use client'
import React, { useMemo } from 'react'
import { Palette } from 'lucide-react'
import GraphicCard from './GraphicCard'
import { generateId } from '@/lib/utils'

interface IllustrationsSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

const PROFESSIONAL_ILLUSTRATIONS = [
  {
    id: 'ill-1',
    name: 'Business Growth',
    category: 'business',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="120" width="30" height="60" fill="#3B82F6" rx="4"/>
      <rect x="60" y="90" width="30" height="90" fill="#60A5FA" rx="4"/>
      <rect x="100" y="60" width="30" height="120" fill="#93C5FD" rx="4"/>
      <rect x="140" y="40" width="30" height="140" fill="#DBEAFE" rx="4"/>
      <path d="M30 110 L75 80 L115 50 L155 30" stroke="#10B981" stroke-width="3" fill="none"/>
      <circle cx="30" cy="110" r="5" fill="#10B981"/>
      <circle cx="75" cy="80" r="5" fill="#10B981"/>
      <circle cx="115" cy="50" r="5" fill="#10B981"/>
      <circle cx="155" cy="30" r="5" fill="#10B981"/>
    </svg>`,
    tags: ['growth', 'chart', 'business', 'success'],
    colors: ['#3B82F6', '#10B981']
  },
  {
    id: 'ill-2',
    name: 'Team Collaboration',
    category: 'business',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="25" fill="#8B5CF6"/>
      <circle cx="140" cy="60" r="25" fill="#EC4899"/>
      <circle cx="100" cy="120" r="25" fill="#F59E0B"/>
      <path d="M60 85 L100 95" stroke="#6B7280" stroke-width="3"/>
      <path d="M140 85 L100 95" stroke="#6B7280" stroke-width="3"/>
      <circle cx="60" cy="60" r="15" fill="white" opacity="0.3"/>
      <circle cx="140" cy="60" r="15" fill="white" opacity="0.3"/>
      <circle cx="100" cy="120" r="15" fill="white" opacity="0.3"/>
    </svg>`,
    tags: ['team', 'collaboration', 'people', 'network'],
    colors: ['#8B5CF6', '#EC4899', '#F59E0B']
  },
  {
    id: 'ill-3',
    name: 'Target Achievement',
    category: 'business',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#FEE2E2"/>
      <circle cx="100" cy="100" r="60" fill="#FECACA"/>
      <circle cx="100" cy="100" r="40" fill="#FCA5A5"/>
      <circle cx="100" cy="100" r="20" fill="#EF4444"/>
      <path d="M100 20 L110 90 L100 100 L90 90 Z" fill="#DC2626"/>
      <circle cx="100" cy="100" r="8" fill="#991B1B"/>
    </svg>`,
    tags: ['target', 'goal', 'achievement', 'focus'],
    colors: ['#EF4444', '#DC2626']
  },
  {
    id: 'ill-4',
    name: 'Innovation Bulb',
    category: 'creative',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="80" r="40" fill="#FCD34D"/>
      <rect x="85" y="120" width="30" height="40" fill="#9CA3AF" rx="4"/>
      <rect x="80" y="160" width="40" height="10" fill="#6B7280" rx="2"/>
      <path d="M70 80 L60 70 M130 80 L140 70 M100 40 L100 25 M70 50 L60 40 M130 50 L140 40" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <circle cx="100" cy="80" r="25" fill="#FEF3C7" opacity="0.5"/>
    </svg>`,
    tags: ['innovation', 'idea', 'creative', 'lightbulb'],
    colors: ['#FCD34D', '#F59E0B']
  },
  {
    id: 'ill-5',
    name: 'Success Trophy',
    category: 'achievement',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M70 60 L70 40 L130 40 L130 60" stroke="#F59E0B" stroke-width="4" fill="none"/>
      <rect x="80" y="60" width="40" height="50" fill="#FCD34D" rx="4"/>
      <rect x="90" y="110" width="20" height="40" fill="#D97706"/>
      <rect x="70" y="150" width="60" height="10" fill="#92400E" rx="2"/>
      <circle cx="100" cy="85" r="15" fill="#FEF3C7"/>
      <path d="M100 75 L105 85 L95 85 Z" fill="#F59E0B"/>
    </svg>`,
    tags: ['trophy', 'success', 'achievement', 'winner'],
    colors: ['#FCD34D', '#F59E0B']
  },
  {
    id: 'ill-6',
    name: 'Communication',
    category: 'communication',
    svg: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="60" width="70" height="50" fill="#3B82F6" rx="8"/>
      <path d="M50 110 L60 120 L70 110" fill="#3B82F6"/>
      <rect x="90" y="90" width="70" height="50" fill="#10B981" rx="8"/>
      <path d="M150 140 L140 150 L130 140" fill="#10B981"/>
      <circle cx="75" cy="85" r="3" fill="white"/>
      <circle cx="85" cy="85" r="3" fill="white"/>
      <circle cx="95" cy="85" r="3" fill="white"/>
      <circle cx="125" cy="115" r="3" fill="white"/>
      <circle cx="135" cy="115" r="3" fill="white"/>
      <circle cx="145" cy="115" r="3" fill="white"/>
    </svg>`,
    tags: ['communication', 'chat', 'message', 'conversation'],
    colors: ['#3B82F6', '#10B981']
  },
]

export default function IllustrationsSection({ searchTerm, onAddElement }: IllustrationsSectionProps) {
  const filteredIllustrations = useMemo(() => {
    if (!searchTerm) return PROFESSIONAL_ILLUSTRATIONS
    return PROFESSIONAL_ILLUSTRATIONS.filter(illustration =>
      illustration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      illustration.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      illustration.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm])

  const handleAddIllustration = (illustration: any) => {
    onAddElement({
      id: generateId(),
      type: 'illustration',
      category: illustration.category,
      name: illustration.name,
      svg: illustration.svg,
      width: 150,
      height: 150,
      fill: illustration.colors[0],
      opacity: 1,
      rotation: 0,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      visible: true,
      locked: false,
      zIndex: Date.now()
    })
  }

  if (filteredIllustrations.length === 0) return null

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
          <Palette className="w-4 h-4 text-pink-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Illustrations</h3>
          <p className="text-xs text-gray-500">{filteredIllustrations.length} items</p>
        </div>
      </div>

      {/* Illustrations Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredIllustrations.map((illustration, index) => (
          <GraphicCard
            key={illustration.id}
            onClick={() => handleAddIllustration(illustration)}
            delay={index * 0.02}
          >
            <div 
              className="w-full h-full flex items-center justify-center p-2"
              dangerouslySetInnerHTML={{ __html: illustration.svg }}
            />
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs font-medium text-gray-700 text-center truncate bg-white/90 rounded px-2 py-1">
                {illustration.name}
              </p>
            </div>
          </GraphicCard>
        ))}
      </div>
    </section>
  )
}
