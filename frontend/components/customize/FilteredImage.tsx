'use client'
import { useEffect, useRef } from 'react'
import { Image as KonvaImage, Transformer } from 'react-konva'
import useImage from 'use-image'
import Konva from 'konva'

interface FilteredImageProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onChange: (attrs: any) => void
}

export default function FilteredImage({ element, isSelected, onSelect, onChange }: FilteredImageProps) {
  const [image] = useImage(element.src || '')
  const imageRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)

  // Attach transformer
  useEffect(() => {
    if (isSelected && transformerRef.current && imageRef.current) {
      transformerRef.current.nodes([imageRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  // Apply filters whenever adjustment values change
  useEffect(() => {
    if (imageRef.current && image) {
      const node = imageRef.current
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
      
      // Apply sharpen using Konva.Filters.Enhance or custom implementation
      if (element.sharpen && element.sharpen > 0) {
        filters.push(Konva.Filters.Enhance)
      }
      
      // Apply filters to node
      node.filters(filters)
      
      // Set filter values
      if (element.brightness && element.brightness !== 0) {
        // Brightness range: -100 to 100, Konva expects -1 to 1
        node.brightness(element.brightness / 100)
      }
      
      if (element.contrast && element.contrast !== 0) {
        // Contrast range: -100 to 100, Konva expects -100 to 100
        node.contrast(element.contrast)
      }
      
      if (element.saturation && element.saturation !== 0) {
        // Saturation range: -100 to 100, convert to 0 to 2 (1 is normal)
        node.saturation(1 + (element.saturation / 100))
      }
      
      if (element.blur && element.blur > 0) {
        // Blur range: 0 to 100, scale down for reasonable blur
        node.blurRadius(element.blur / 5)
      }
      
      if (element.sharpen && element.sharpen > 0) {
        // Sharpen range: 0 to 100, scale to 0 to 1
        node.enhance(element.sharpen / 100)
      }
      
      // Cache the node to apply filters
      if (filters.length > 0) {
        node.cache()
        node.getLayer()?.batchDraw()
      } else {
        // Clear cache if no filters
        node.clearCache()
        node.getLayer()?.batchDraw()
      }
    }
  }, [element.brightness, element.contrast, element.saturation, element.blur, element.sharpen, image])

  const handleTransformEnd = () => {
    const node = imageRef.current
    if (!node) return

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    node.scaleX(1)
    node.scaleY(1)

    onChange({
      x: node.x(),
      y: node.y(),
      width: Math.max(10, node.width() * scaleX),
      height: Math.max(10, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  return (
    <>
      <KonvaImage
        ref={imageRef}
        image={image}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        scaleX={element.scaleX || 1}
        scaleY={element.scaleY || 1}
        opacity={element.opacity || 1}
        draggable={!element.locked}
        visible={element.visible !== false}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={handleTransformEnd}
        name={`image-${element.id}`}
      />
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
