'use client'
import React, { useRef } from 'react'
import { Rect, Ellipse, Star, RegularPolygon, Group } from 'react-konva'
import Konva from 'konva'
import ShapeTransformer from './ShapeTransformer'
import { shapeFillProps } from '@/lib/konva-gradient-fill'

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
  onTransformEnd,
}: EditableGraphicElementProps) {
  const rectRef = useRef<Konva.Rect>(null)
  const groupRef = useRef<Konva.Group>(null)

  const key = element.name || element.shapeType || ''
  const isSimpleRect = ['Rectangle', 'Rounded Rect', 'rect', 'Line', 'line', ''].includes(key)

  const fillProps = shapeFillProps(element.fill, element.width, element.height)

  const commonProps = {
    ...fillProps,
    stroke: element.stroke || 'none',
    strokeWidth: element.strokeWidth || 0,
    opacity: element.opacity || 1,
  }

  const renderComplexShape = () => {
    switch (key) {
      case 'Circle':
      case 'circle':
        return (
          <Ellipse
            x={element.width / 2}
            y={element.height / 2}
            radiusX={element.width / 2}
            radiusY={element.height / 2}
            {...commonProps}
            listening={false}
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
            {...commonProps}
            listening={false}
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
            listening={false}
          />
        )
      default:
        return (
          <Rect
            width={element.width}
            height={element.height}
            cornerRadius={element.cornerRadius || 0}
            {...commonProps}
            listening={false}
          />
        )
    }
  }

  if (isSimpleRect) {
    const cornerRadius = key === 'Rounded Rect' ? 18 : (element.cornerRadius || (key === 'line' || key === 'Line' ? 3 : 0))
    return (
      <>
        <Rect
          ref={rectRef}
          x={element.x}
          y={element.y}
          width={element.width}
          height={element.height}
          rotation={element.rotation || 0}
          cornerRadius={cornerRadius}
          draggable={!element.locked}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
          name={`graphic-${element.id}`}
          {...commonProps}
        />
        <ShapeTransformer
          nodeRef={rectRef}
          isSelected={isSelected}
          baseWidth={element.width}
          baseHeight={element.height}
          onTransformEnd={onTransformEnd}
        />
      </>
    )
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
        onDragEnd={(e) => onDragEnd(e.target.x(), e.target.y())}
        name={`graphic-${element.id}`}
      >
        <Rect width={element.width} height={element.height} fill="transparent" listening />
        {renderComplexShape()}
      </Group>

      <ShapeTransformer
        nodeRef={groupRef}
        isSelected={isSelected}
        baseWidth={element.width}
        baseHeight={element.height}
        onTransformEnd={onTransformEnd}
      />
    </>
  )
}
