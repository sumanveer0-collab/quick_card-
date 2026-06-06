'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Group, Image as KonvaImage, Rect, Transformer } from 'react-konva'
import Konva from 'konva'

interface IconElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
}

/** Convert an SVG string to an HTMLImageElement via data-URL */
function svgToImage(svg: string, width: number, height: number, fill: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // Replace currentColor with the actual fill colour
    const coloured = svg
      .replace(/currentColor/g, fill || '#000000')
      .replace(/fill="none"/g, `fill="${fill || '#000000'}"`)

    // Ensure the SVG has explicit width/height so the browser can render it
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
    img.onerror = reject
    img.src = url
  })
}

export default function IconElement({
  element,
  isSelected,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: IconElementProps) {
  const groupRef = useRef<Konva.Group>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [iconImg, setIconImg] = useState<HTMLImageElement | null>(null)

  // Attach transformer
  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  // Convert SVG → Image whenever svg / fill / size changes
  useEffect(() => {
    if (!element.svg) return
    let cancelled = false
    svgToImage(element.svg, element.width || 48, element.height || 48, element.fill || '#000000')
      .then(img => { if (!cancelled) setIconImg(img) })
      .catch(() => { if (!cancelled) setIconImg(null) })
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
        name={`icon-${element.id}`}
      >
        {/* Transparent hit area so clicks always register */}
        <Rect width={element.width} height={element.height} fill="transparent" />

        {/* Render the SVG as a raster image — pixel-perfect at any size */}
        {iconImg && (
          <KonvaImage
            image={iconImg}
            width={element.width}
            height={element.height}
          />
        )}
      </Group>

      {isSelected && (
        <Transformer
          ref={transformerRef}
          keepRatio={true}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
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
