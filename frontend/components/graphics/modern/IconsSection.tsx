'use client'
import React, { useMemo } from 'react'
import { Star } from 'lucide-react'
import GraphicCard from './GraphicCard'
import { ALL_ICONS } from '@/lib/graphics/icons'
import { generateId } from '@/lib/utils'

interface IconsSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

export default function IconsSection({ searchTerm, onAddElement }: IconsSectionProps) {
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return ALL_ICONS
    return ALL_ICONS.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm])

  const handleAddIcon = (icon: any) => {
    onAddElement({
      id: generateId(),
      type: 'icon',
      category: icon.category,
      name: icon.name,
      svg: icon.svg,
      width: 48,
      height: 48,
      fill: '#000000',
      stroke: 'none',
      strokeWidth: 0,
      opacity: 1,
      rotation: 0,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      visible: true,
      locked: false,
      zIndex: Date.now()
    })
  }

  if (filteredIcons.length === 0) return null

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <Star className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Icons</h3>
          <p className="text-xs text-gray-500">{filteredIcons.length} items</p>
        </div>
      </div>

      {/* Icons Grid - 4 columns for smaller icons */}
      <div className="grid grid-cols-4 gap-2">
        {filteredIcons.map((icon, index) => (
          <GraphicCard
            key={icon.id}
            onClick={() => handleAddIcon(icon)}
            delay={index * 0.02}
          >
            <div 
              className="w-full h-full flex items-center justify-center text-gray-700"
              dangerouslySetInnerHTML={{ __html: icon.svg }}
              title={icon.name}
            />
          </GraphicCard>
        ))}
      </div>
    </section>
  )
}
