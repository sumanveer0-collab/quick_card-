'use client'
import React, { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { ALL_SHAPES } from '@/lib/graphics/shapes'
import { generateId } from '@/lib/utils'

interface ShapesSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

export default function ShapesSection({ searchTerm, onAddElement }: ShapesSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const filteredShapes = useMemo(() => {
    if (!searchTerm) return ALL_SHAPES
    return ALL_SHAPES.filter(shape =>
      shape.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shape.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const visibleShapes = showAll ? filteredShapes : filteredShapes.slice(0, 9)

  const handleAddShape = (shape: any) => {
    onAddElement({
      id: generateId(),
      type: 'shape',
      shapeType: shape.type,
      category: shape.category,
      name: shape.name,
      svg: shape.svg,
      width: shape.defaultWidth,
      height: shape.defaultHeight,
      fill: '#1a1a1a',
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

  if (filteredShapes.length === 0) return null

  return (
    <section>
      {/* Section header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-gray-900">Shapes</span>
          <span className="ml-1.5 text-[10px] text-gray-400">{filteredShapes.length} items</span>
        </div>
        {filteredShapes.length > 9 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show less' : 'See all'} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3-column grid — dark thumbnails like Vistaprint */}
      <div className="grid grid-cols-3 gap-2">
        {visibleShapes.map(shape => (
          <button
            key={shape.id}
            onClick={() => handleAddShape(shape)}
            title={shape.name}
            className="aspect-square flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-150 p-3 group"
          >
            {/* SVG rendered with black fill like Vistaprint */}
            <div
              className="w-full h-full flex items-center justify-center text-gray-900 group-hover:text-blue-600 transition-colors"
              style={{ color: '#111827' }}
              dangerouslySetInnerHTML={{ __html: shape.svg }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
