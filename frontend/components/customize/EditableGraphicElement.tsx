'use client'
import React, { useRef, useEffect } from 'react'
import { Group, Rect, Circle, Star, RegularPolygon, Arrow, Line } from 'react-konva'
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

  const renderShape = () => {
    const commonProps = {
      fill: element.fill || '#3b82f6',
      stroke: element.stroke || 'none',
      strokeWidth: element.strokeWidth || 0,
      opacity: element.opacity || 1,
    }

    switch (element.name) {
      case 'Rectangle':
        return (
          <Rect
            width={element.width}
            height={element.height}
            cornerRadius={8}
            {...commonProps}
          />
        )
      
      case 'Circle':
        return (
          <Circle
            x={element.width / 2}
            y={element.height / 2}
            radius={Math.min(element.width, element.height) / 2}
            {...commonProps}
          />
        )
      
      case 'Triangle':
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
      
      case 'Line':
        return (
          <Line
            points={[0, element.height / 2, element.width, element.height / 2]}
            strokeWidth={element.strokeWidth || 4}
            stroke={element.fill || '#3b82f6'}
            lineCap="round"
          />
        )
      
      case 'Arrow Right':
        return (
          <Group>
            <Rect
              x={0}
              y={element.height * 0.3}
              width={element.width * 0.7}
              height={element.height * 0.4}
              {...commonProps}
            />
            <RegularPolygon
              x={element.width * 0.85}
              y={element.height / 2}
              sides={3}
              radius={element.height * 0.3}
              rotation={90}
              {...commonProps}
            />
          </Group>
        )
      
      case 'Arrow Left':
        return (
          <Group>
            <Rect
              x={element.width * 0.3}
              y={element.height * 0.3}
              width={element.width * 0.7}
              height={element.height * 0.4}
              {...commonProps}
            />
            <RegularPolygon
              x={element.width * 0.15}
              y={element.height / 2}
              sides={3}
              radius={element.height * 0.3}
              rotation={-90}
              {...commonProps}
            />
          </Group>
        )
      
      case 'Arrow Up':
        return (
          <Group>
            <Rect
              x={element.width * 0.3}
              y={element.height * 0.3}
              width={element.width * 0.4}
              height={element.height * 0.7}
              {...commonProps}
            />
            <RegularPolygon
              x={element.width / 2}
              y={element.height * 0.15}
              sides={3}
              radius={element.width * 0.3}
              rotation={0}
              {...commonProps}
            />
          </Group>
        )
      
      case 'Arrow Down':
        return (
          <Group>
            <Rect
              x={element.width * 0.3}
              y={0}
              width={element.width * 0.4}
              height={element.height * 0.7}
              {...commonProps}
            />
            <RegularPolygon
              x={element.width / 2}
              y={element.height * 0.85}
              sides={3}
              radius={element.width * 0.3}
              rotation={180}
              {...commonProps}
            />
          </Group>
        )
      
      default:
        return (
          <Rect
            width={element.width}
            height={element.height}
            {...commonProps}
          />
        )
    }
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
    >
      {/* Selection border - Removed */}
      {/* {isSelected && (
        <Rect
          x={-5}
          y={-5}
          width={element.width + 10}
          height={element.height + 10}
          stroke="#2563eb"
          strokeWidth={2}
          dash={[5, 5]}
          fill="transparent"
        />
      )} */}
      
      {/* Shape content */}
      {renderShape()}
    </Group>
  )
}