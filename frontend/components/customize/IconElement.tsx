'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Group, Path, Rect, Transformer } from 'react-konva'
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
  const transformerRef = useRef<Konva.Transformer>(null)
  const [iconPaths, setIconPaths] = useState<string[]>([])

  // Attach transformer to selected element
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  // Apply filters to the group
  useEffect(() => {
    if (groupRef.current) {
      const node = groupRef.current
      const filters: any[] = []
      
      // Collect active filters
      if (element.brightness && element.brightness !== 0) {
        filters.push(Konva.Filters.Brighten)
      }
      
      if (element.contrast && element.contrast !== 0) {
        filters.push(Konva.Filters.Contrast)
      }
      
      if (element.saturation && element.saturation !== 0) {
        filters.push(Konva.Filters.HSL)
      }
      
      if (element.blur && element.blur > 0) {
        filters.push(Konva.Filters.Blur)
      }
      
      if (element.sharpen && element.sharpen > 0) {
        filters.push(Konva.Filters.Enhance)
      }
      
      // Apply filters to node
      node.filters(filters)
      
      // Set filter values
      if (element.brightness && element.brightness !== 0) {
        node.brightness(element.brightness / 100)
      }
      
      if (element.contrast && element.contrast !== 0) {
        node.contrast(element.contrast)
      }
      
      if (element.saturation && element.saturation !== 0) {
        node.saturation(1 + (element.saturation / 100))
      }
      
      if (element.blur && element.blur > 0) {
        node.blurRadius(element.blur / 5)
      }
      
      if (element.sharpen && element.sharpen > 0) {
        node.enhance(element.sharpen / 100)
      }
      
      // Cache the node to apply filters
      if (filters.length > 0) {
        node.cache()
        node.getLayer()?.batchDraw()
      } else {
        node.clearCache()
        node.getLayer()?.batchDraw()
      }
    }
  }, [element.brightness, element.contrast, element.saturation, element.blur, element.sharpen])

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
    const node = groupRef.current
    if (!node) return
    
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    
    // Reset scale and apply to dimensions
    node.scaleX(1)
    node.scaleY(1)
    
    onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(10, element.width * scaleX),
      height: Math.max(10, element.height * scaleY),
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
    <>
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
        visible={element.visible !== false}
        name={`icon-${element.id}`}
      >
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
      
      {/* Transformer for resizing */}
      {isSelected && (
        <Transformer
          ref={transformerRef}
          keepRatio={true}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right'
          ]}
          rotateEnabled={true}
          borderStroke="#3b82f6"
          borderStrokeWidth={2}
          anchorFill="#ffffff"
          anchorStroke="#3b82f6"
          anchorStrokeWidth={2}
          anchorSize={12}
          anchorCornerRadius={6}
          rotateAnchorOffset={30}
          padding={5}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size constraint
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}