'use client'
import React, { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { ALL_ICONS } from '@/lib/graphics/icons'
import { generateId } from '@/lib/utils'

interface IconsSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

export default function IconsSection({ searchTerm, onAddElement }: IconsSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const filteredIcons = useMemo(() => {
    if (!searchTerm) return ALL_ICONS
    return ALL_ICONS.filter(icon =>
      icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm])

  const visibleIcons = showAll ? filteredIcons : filteredIcons.slice(0, 9)

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
      x: 100 + Math.random() * 150,
      y: 100 + Math.random() * 100,
      visible: true,
      locked: false,
      zIndex: Date.now(),
    })
  }

  if (filteredIcons.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-gray-900">Icons</span>
          <span className="ml-1.5 text-[10px] text-gray-400">{filteredIcons.length} items</span>
        </div>
        {filteredIcons.length > 9 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show less' : 'See all'} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {visibleIcons.map(icon => (
          <button
            key={icon.id}
            onClick={() => handleAddIcon(icon)}
            title={icon.name}
            className="aspect-square flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-150 p-3 group"
          >
            <div
              className="w-full h-full flex items-center justify-center text-gray-900 group-hover:text-blue-600 transition-colors"
              style={{ color: '#111827' }}
              dangerouslySetInnerHTML={{ __html: icon.svg }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
