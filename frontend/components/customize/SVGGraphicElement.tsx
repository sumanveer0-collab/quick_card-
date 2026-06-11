'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Group, Image as KonvaImage, Rect } from 'react-konva'
import Konva from 'konva'
import ShapeTransformer from './ShapeTransformer'
import { isGradientFill, shapeFillProps } from '@/lib/konva-gradient-fill'

interface SVGGraphicElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
}

function svgToImage(svg: string, width: number, height: number, fill: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const coloured = svg.replace(/currentColor/g, fill || '#000000')
    const withSize = coloured.replace(/<svg([^>]*)>/, (match, attrs) => {
      const hasW = /width=/.test(attrs)
      const hasH = /height=/.test(attrs)
      let extra = ''
      if (!hasW) extra += ` width="${width}"`
      if (!hasH) extra += ` height="${height}"`
      return `<svg${attrs}${extra}>`
    })

    const blob = new Blob([withSize], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const img = new window.Image()
    img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG load failed')) }
    img.src = url
  })
}

export default function SVGGraphicElement({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: SVGGraphicElementProps) {
  const groupRef = useRef<Konva.Group>(null)
  const [svgImg, setSvgImg] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!element.svg) return
    let cancelled = false
    svgToImage(
      element.svg,
      element.width || 100,
      element.height || 100,
      element.fill || '#000000',
    )
      .then(img => { if (!cancelled) setSvgImg(img) })
      .catch(() => { if (!cancelled) setSvgImg(null) })
    return () => { cancelled = true }
  }, [element.svg, element.fill, element.width, element.height])

  const solidFill = element.fill || '#000000'
  const fallbackFillProps = isGradientFill(element.fill)
    ? shapeFillProps(element.fill, element.width, element.height)
    : { fill: solidFill }

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
        opacity={element.opacity ?? 1}
        visible={element.visible !== false}
        name={`svg-graphic-${element.id}`}
      >
        {svgImg ? (
          <KonvaImage
            image={svgImg}
            width={element.width}
            height={element.height}
          />
        ) : (
          <Rect
            width={element.width}
            height={element.height}
            cornerRadius={element.cornerRadius || 0}
            {...fallbackFillProps}
          />
        )}
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
