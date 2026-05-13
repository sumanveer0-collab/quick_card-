'use client'
import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Shapes } from 'lucide-react'
import GraphicCard from './GraphicCard'
import { ALL_SHAPES } from '@/lib/graphics/shapes'
import { generateId } from '@/lib/utils'

interface ShapesSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

export default function ShapesSection({ searchTerm, onAddElement }: ShapesSectionProps) {
  const filteredShapes = useMemo(() => {
    if (!searchTerm) return ALL_SHAPES
    return ALL_SHAPES.filter(shape =>
      shape.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shape.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

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
      fill: '#3b82f6',
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

  if (filteredShapes.length === 0) return null

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <Shapes className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Shapes</h3>
          <p className="text-xs text-gray-500">{filteredShapes.length} items</p>
        </div>
      </div>

      {/* Shapes Grid */}
      <div className="grid grid-cols-3 gap-3">
        {filteredShapes.map((shape, index) => (
          <GraphicCard
            key={shape.id}
            onClick={() => handleAddShape(shape)}
            delay={index * 0.02}
          >
            <div 
              className="w-full h-full flex items-center justify-center text-gray-700"
              dangerouslySetInnerHTML={{ __html: shape.svg }}
            />
          </GraphicCard>
        ))}
      </div>
    </section>
  )
}
