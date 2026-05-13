'use client'
import { useEffect, useRef } from 'react'
import { Transformer } from 'react-konva'
import Konva from 'konva'

interface ResizeTransformerProps {
  selectedShapeName: string
  onTransformEnd?: (attrs: any) => void
  keepRatio?: boolean
  enabledAnchors?: string[]
  boundBoxFunc?: (oldBox: any, newBox: any) => any
}

export default function ResizeTransformer({
  selectedShapeName,
  onTransformEnd,
  keepRatio = false,
  enabledAnchors = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center'],
  boundBoxFunc,
}: ResizeTransformerProps) {
  const transformerRef = useRef<Konva.Transformer>(null)

  useEffect(() => {
    if (transformerRef.current) {
      const stage = transformerRef.current.getStage()
      if (stage) {
        const selectedNode = stage.findOne('.' + selectedShapeName)
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode])
          transformerRef.current.getLayer()?.batchDraw()
        } else {
          transformerRef.current.nodes([])
        }
      }
    }
  }, [selectedShapeName])

  return (
    <Transformer
      ref={transformerRef}
      keepRatio={keepRatio}
      enabledAnchors={enabledAnchors}
      boundBoxFunc={boundBoxFunc}
      rotateEnabled={true}
      borderStroke="#3b82f6"
      borderStrokeWidth={2}
      anchorFill="#ffffff"
      anchorStroke="#3b82f6"
      anchorStrokeWidth={2}
      anchorSize={10}
      anchorCornerRadius={5}
      rotateAnchorOffset={30}
      padding={5}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()

        // Reset scale and update width/height
        node.scaleX(1)
        node.scaleY(1)

        const attrs = {
          x: node.x(),
          y: node.y(),
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: node.rotation(),
        }

        if (onTransformEnd) {
          onTransformEnd(attrs)
        }
      }}
    />
  )
}
