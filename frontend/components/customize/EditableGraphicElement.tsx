'use client'
import React, { useRef, useEffect } from 'react'
import { Group, Rect, Circle, Star, RegularPolygon, Arrow, Line, Transformer } from 'react-konva'
import Konva from 'konva'

interface EditableGraphicElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
}

export default function EditableGraphicElement({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd
}: EditableGraphicElementProps) {
  const groupRef = useRef<Konva.Group>(null)
  const transformerRef = useRef<Konva.Transformer>(null)

  // Attach transformer to selected element
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

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

  const renderShape = () => {
    const commonProps = {
      fill: element.fill || '#3b82f6',
      stroke: element.stroke || 'none',
      strokeWidth: element.strokeWidth || 0,
      opacity: element.opacity || 1,
    }

    // Match by name (sidebar shapes) OR by shapeType (SidebarTools shapes)
    const key = element.name || element.shapeType || ''

    switch (key) {
      case 'Rectangle':
      case 'Rounded Rect':
      case 'rect':
        return (
          <Rect
            width={element.width}
            height={element.height}
            cornerRadius={key === 'Rounded Rect' ? 18 : (element.cornerRadius || 0)}
            {...commonProps}
          />
        )

      case 'Circle':
      case 'circle':
        return (
          <Circle
            x={element.width / 2}
            y={element.height / 2}
            radius={Math.min(element.width, element.height) / 2}
            {...commonProps}
          />
        )

      case 'Triangle':
      case 'triangle':
        return (
          <RegularPolygon
            x={element.width / 2}
            y={element.height / 2}
            sides={3}
            radius={Math.min(element.width, element.height) / 2}
            rotation={0}
            {...commonProps}
          />
        )

      case 'Star':
      case 'star':
        return (
          <Star
            x={element.width / 2}
            y={element.height / 2}
            numPoints={5}
            innerRadius={Math.min(element.width, element.height) / 4}
            outerRadius={Math.min(element.width, element.height) / 2}
            {...commonProps}
          />
        )

      case 'Hexagon':
        return (
          <RegularPolygon
            x={element.width / 2}
            y={element.height / 2}
            sides={6}
            radius={Math.min(element.width, element.height) / 2}
            {...commonProps}
          />
        )

      case 'Diamond':
        return (
          <RegularPolygon
            x={element.width / 2}
            y={element.height / 2}
            sides={4}
            radius={Math.min(element.width, element.height) / 2}
            rotation={45}
            {...commonProps}
          />
        )

      case 'Pentagon':
        return (
          <RegularPolygon
            x={element.width / 2}
            y={element.height / 2}
            sides={5}
            radius={Math.min(element.width, element.height) / 2}
            rotation={-18}
            {...commonProps}
          />
        )

      case 'Octagon':
        return (
          <RegularPolygon
            x={element.width / 2}
            y={element.height / 2}
            sides={8}
            radius={Math.min(element.width, element.height) / 2}
            {...commonProps}
          />
        )

      case 'Line':
      case 'line':
        return (
          <Line
            points={[0, element.height / 2, element.width, element.height / 2]}
            strokeWidth={element.strokeWidth || 4}
            stroke={element.fill || '#3b82f6'}
            lineCap="round"
          />
        )

      case 'Arrow Right':
      case 'arrow':
        return (
          <Group>
            <Rect x={0} y={element.height * 0.3} width={element.width * 0.7} height={element.height * 0.4} {...commonProps} />
            <RegularPolygon x={element.width * 0.85} y={element.height / 2} sides={3} radius={element.height * 0.3} rotation={90} {...commonProps} />
          </Group>
        )

      case 'Arrow Left':
        return (
          <Group>
            <Rect x={element.width * 0.3} y={element.height * 0.3} width={element.width * 0.7} height={element.height * 0.4} {...commonProps} />
            <RegularPolygon x={element.width * 0.15} y={element.height / 2} sides={3} radius={element.height * 0.3} rotation={-90} {...commonProps} />
          </Group>
        )

      case 'Arrow Up':
        return (
          <Group>
            <Rect x={element.width * 0.3} y={element.height * 0.3} width={element.width * 0.4} height={element.height * 0.7} {...commonProps} />
            <RegularPolygon x={element.width / 2} y={element.height * 0.15} sides={3} radius={element.width * 0.3} rotation={0} {...commonProps} />
          </Group>
        )

      case 'Arrow Down':
        return (
          <Group>
            <Rect x={element.width * 0.3} y={0} width={element.width * 0.4} height={element.height * 0.7} {...commonProps} />
            <RegularPolygon x={element.width / 2} y={element.height * 0.85} sides={3} radius={element.width * 0.3} rotation={180} {...commonProps} />
          </Group>
        )

      default:
        return (
          <Rect width={element.width} height={element.height} cornerRadius={element.cornerRadius || 0} {...commonProps} />
        )
    }
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
        name={`graphic-${element.id}`}
      >
        {/* Shape content */}
        {renderShape()}
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