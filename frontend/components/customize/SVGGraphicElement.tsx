'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Group, Rect, Path, Transformer } from 'react-konva'
import Konva from 'konva'

interface SVGGraphicElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
}

export default function SVGGraphicElement({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd
}: SVGGraphicElementProps) {
  const groupRef = useRef<Konva.Group>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [pathData, setPathData] = useState<string>('')

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

  // Convert SVG to Konva path data
  useEffect(() => {
    if (element.svg) {
      // Extract path data from SVG
      const parser = new DOMParser()
      const svgDoc = parser.parseFromString(element.svg, 'image/svg+xml')
      const pathElement = svgDoc.querySelector('path')
      const polygonElement = svgDoc.querySelector('polygon')
      const rectElement = svgDoc.querySelector('rect')
      const circleElement = svgDoc.querySelector('circle')

      if (pathElement) {
        setPathData(pathElement.getAttribute('d') || '')
      } else if (polygonElement) {
        // Convert polygon points to path
        const points = polygonElement.getAttribute('points') || ''
        const pathD = convertPolygonToPath(points)
        setPathData(pathD)
      } else if (rectElement) {
        // Convert rect to path
        const x = parseFloat(rectElement.getAttribute('x') || '0')
        const y = parseFloat(rectElement.getAttribute('y') || '0')
        const width = parseFloat(rectElement.getAttribute('width') || '100')
        const height = parseFloat(rectElement.getAttribute('height') || '100')
        const pathD = `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${y + height} Z`
        setPathData(pathD)
      } else if (circleElement) {
        // Convert circle to path (approximate with bezier curves)
        const cx = parseFloat(circleElement.getAttribute('cx') || '50')
        const cy = parseFloat(circleElement.getAttribute('cy') || '50')
        const r = parseFloat(circleElement.getAttribute('r') || '25')
        const pathD = createCirclePath(cx, cy, r)
        setPathData(pathD)
      }
    }
  }, [element.svg])

  const convertPolygonToPath = (points: string): string => {
    const coords = points.trim().split(/[\s,]+/)
    if (coords.length < 4) return ''
    
    let path = `M${coords[0]},${coords[1]}`
    for (let i = 2; i < coords.length; i += 2) {
      if (coords[i] && coords[i + 1]) {
        path += ` L${coords[i]},${coords[i + 1]}`
      }
    }
    path += ' Z'
    return path
  }

  const createCirclePath = (cx: number, cy: number, r: number): string => {
    // Create circle using bezier curves
    const k = 0.552284749831 // Magic number for circle approximation
    const kx = k * r
    const ky = k * r
    
    return `M${cx - r},${cy} 
            C${cx - r},${cy - ky} ${cx - kx},${cy - r} ${cx},${cy - r}
            C${cx + kx},${cy - r} ${cx + r},${cy - ky} ${cx + r},${cy}
            C${cx + r},${cy + ky} ${cx + kx},${cy + r} ${cx},${cy + r}
            C${cx - kx},${cy + r} ${cx - r},${cy + ky} ${cx - r},${cy} Z`
  }

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

  // Scale path data to fit element dimensions
  const getScaledPathData = (): string => {
    if (!pathData) return ''
    
    // Simple scaling - in a real implementation, you'd want proper SVG path scaling
    const scaleX = element.width / 100
    const scaleY = element.height / 100
    
    return pathData.replace(/(\d+\.?\d*)/g, (match) => {
      const num = parseFloat(match)
      return (num * Math.min(scaleX, scaleY)).toString()
    })
  }

  return (
    <>
      <Group
        ref={groupRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation || 0}
        draggable={!element.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        opacity={element.opacity || 1}
        visible={element.visible !== false}
        name={`svg-graphic-${element.id}`}
      >
        {/* Background for selection */}
        <Rect
          width={element.width}
          height={element.height}
          fill="transparent"
          stroke="transparent"
          strokeWidth={0}
          dash={[]}
        />
        
        {/* SVG Path */}
        {pathData && (
          <Path
            data={getScaledPathData()}
            fill={element.fill || '#3b82f6'}
            stroke={element.stroke || 'none'}
            strokeWidth={element.strokeWidth || 0}
            scaleX={1}
            scaleY={1}
          />
        )}
        
        {/* Fallback rectangle if no path data */}
        {!pathData && (
          <Rect
            width={element.width}
            height={element.height}
            fill={element.fill || '#3b82f6'}
            stroke={element.stroke || 'none'}
            strokeWidth={element.strokeWidth || 0}
            cornerRadius={element.type === 'shape' && element.name === 'Rectangle' ? 8 : 0}
          />
        )}
      </Group>
      
      {/* Transformer for resizing */}
      {isSelected && (
        <Transformer
          ref={transformerRef}
          keepRatio={false}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'middle-left',
            'middle-right',
            'top-center',
            'bottom-center'
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