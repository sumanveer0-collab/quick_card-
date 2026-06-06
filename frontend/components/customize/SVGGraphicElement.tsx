'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Group, Image as KonvaImage, Rect, Transformer } from 'react-konva'
import Konva from 'konva'

interface SVGGraphicElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
}

/** Convert an SVG string to an HTMLImageElement via Blob URL */
function svgToImage(svg: string, width: number, height: number, fill: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // Replace fill="currentColor" / currentColor with the actual fill
    const coloured = svg
      .replace(/currentColor/g, fill || '#000000')

    // Ensure explicit dimensions on the <svg> tag
    const withSize = coloured.replace(
      /<svg([^>]*)>/,
      (match, attrs) => {
        const hasW = /width=/.test(attrs)
        const hasH = /height=/.test(attrs)
        let extra = ''
        if (!hasW) extra += ` width="${width}"`
        if (!hasH) extra += ` height="${height}"`
        return `<svg${attrs}${extra}>`
      }
    )

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
  const transformerRef = useRef<Konva.Transformer>(null)
  const [svgImg, setSvgImg] = useState<HTMLImageElement | null>(null)

  // Attach transformer when selected
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  // Re-render whenever svg / fill / dimensions change
  useEffect(() => {
    if (!element.svg) return
    let cancelled = false
    svgToImage(
      element.svg,
      element.width || 100,
      element.height || 100,
      element.fill || '#3b82f6'
    )
      .then(img => { if (!cancelled) setSvgImg(img) })
      .catch(() => { if (!cancelled) setSvgImg(null) })
    return () => { cancelled = true }
  }, [element.svg, element.fill, element.width, element.height])

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragEnd(e.target.x(), e.target.y())
  }

  const handleTransformEnd = () => {
    const node = groupRef.current
    if (!node) return
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    node.scaleX(1)
    node.scaleY(1)
    onTransformEnd({
      x: node.x(),
      y: node.y(),
      width: Math.max(10, element.width * scaleX),
      height: Math.max(10, element.height * scaleY),
      rotation: node.rotation(),
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
        opacity={element.opacity ?? 1}
        visible={element.visible !== false}
        name={`svg-graphic-${element.id}`}
      >
        {/* Hit area */}
        <Rect width={element.width} height={element.height} fill="transparent" />

        {/* SVG rendered as a crisp raster image */}
        {svgImg && (
          <KonvaImage
            image={svgImg}
            width={element.width}
            height={element.height}
          />
        )}

        {/* Fallback solid rect if SVG fails to load */}
        {!svgImg && (
          <Rect
            width={element.width}
            height={element.height}
            fill={element.fill || '#3b82f6'}
            cornerRadius={element.cornerRadius || 0}
          />
        )}
      </Group>

      {isSelected && (
        <Transformer
          ref={transformerRef}
          keepRatio={false}
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
            'middle-left', 'middle-right', 'top-center', 'bottom-center',
          ]}
          rotateEnabled={true}
          borderStroke="#3b82f6"
          borderStrokeWidth={2}
          anchorFill="#ffffff"
          anchorStroke="#3b82f6"
          anchorStrokeWidth={2}
          anchorSize={10}
          anchorCornerRadius={5}
          rotateAnchorOffset={28}
          padding={4}
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 10 || newBox.height < 10 ? oldBox : newBox
          }
        />
      )}
    </>
  )
}
