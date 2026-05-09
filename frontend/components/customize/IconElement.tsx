'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Group, Path, Rect } from 'react-konva'
import Konva from 'konva'

interface IconElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
}

export default function IconElement({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd
}: IconElementProps) {
  const groupRef = useRef<Konva.Group>(null)
  const [iconPaths, setIconPaths] = useState<string[]>([])

  // Extract paths from SVG
  useEffect(() => {
    if (element.svg) {
      try {
        const parser = new DOMParser()
        const svgDoc = parser.parseFromString(element.svg, 'image/svg+xml')
        const paths = Array.from(svgDoc.querySelectorAll('path'))
        const pathData = paths.map(path => path.getAttribute('d') || '')
        setIconPaths(pathData.filter(d => d))
      } catch (error) {
        console.warn('Failed to parse SVG:', error)
        setIconPaths([])
      }
    }
  }, [element.svg])

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragEnd(e.target.x(), e.target.y())
  }

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    const node = e.target as Konva.Group
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    
    // Reset scale and apply to dimensions
    node.scaleX(1)
    node.scaleY(1)
    
    onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: element.width * scaleX,
      height: element.height * scaleY,
      rotation: node.rotation()
    })
  }

  // Scale SVG paths to fit element dimensions
  const getScaledPath = (pathData: string): string => {
    if (!pathData) return ''
    
    // Simple scaling approach - scale all numbers in the path
    const scale = Math.min(element.width / 24, element.height / 24) // Assuming 24x24 viewBox
    
    return pathData.replace(/(\d+\.?\d*)/g, (match) => {
      const num = parseFloat(match)
      return (num * scale).toString()
    })
  }

  return (
    <Group
      ref={groupRef}
      x={element.x}
      y={element.y}
      rotation={element.rotation || 0}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
      opacity={element.opacity || 1}
    >
      {/* Selection border - Removed */}
      {/* {isSelected && (
        <Rect
          x={-2}
          y={-2}
          width={element.width + 4}
          height={element.height + 4}
          stroke="#2563eb"
          strokeWidth={2}
          dash={[5, 5]}
          fill="transparent"
        />
      )} */}
      
      {/* Icon background (for better visibility) */}
      <Rect
        width={element.width}
        height={element.height}
        fill="transparent"
      />
      
      {/* Render SVG paths */}
      {iconPaths.length > 0 ? (
        iconPaths.map((pathData, index) => (
          <Path
            key={index}
            data={getScaledPath(pathData)}
            fill={element.fill || '#000000'}
            stroke={element.stroke || 'none'}
            strokeWidth={element.strokeWidth || 0}
          />
        ))
      ) : (
        // Fallback: simple rectangle with icon placeholder
        <Group>
          <Rect
            width={element.width}
            height={element.height}
            fill={element.fill || '#000000'}
            stroke={element.stroke || 'none'}
            strokeWidth={element.strokeWidth || 0}
            cornerRadius={4}
          />
          {/* Simple icon placeholder */}
          <Rect
            x={element.width * 0.2}
            y={element.height * 0.2}
            width={element.width * 0.6}
            height={element.height * 0.6}
            fill="white"
            cornerRadius={2}
          />
        </Group>
      )}
    </Group>
  )
}