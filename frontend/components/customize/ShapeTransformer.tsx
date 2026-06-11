'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Transformer } from 'react-konva'
import Konva from 'konva'
import {
  SHAPE_RESIZE_ANCHORS,
  bakeTransformToBox,
  vistaprintAnchorStyle,
} from '@/lib/konva-shape-transform'

interface ShapeTransformerProps {
  nodeRef: React.RefObject<Konva.Node | null>
  isSelected: boolean
  baseWidth: number
  baseHeight: number
  onTransformEnd: (attrs: ReturnType<typeof bakeTransformToBox>) => void
}

export default function ShapeTransformer({
  nodeRef,
  isSelected,
  baseWidth,
  baseHeight,
  onTransformEnd,
}: ShapeTransformerProps) {
  const transformerRef = useRef<Konva.Transformer>(null)

  const finishTransform = useCallback(() => {
    const node = nodeRef.current
    if (!node) return
    onTransformEnd(bakeTransformToBox(node, baseWidth, baseHeight))
  }, [baseWidth, baseHeight, nodeRef, onTransformEnd])

  useEffect(() => {
    if (!isSelected || !transformerRef.current || !nodeRef.current) return
    const tr = transformerRef.current
    tr.nodes([nodeRef.current])
    tr.forceUpdate()
    tr.getLayer()?.batchDraw()
  }, [isSelected, nodeRef, baseWidth, baseHeight])

  if (!isSelected) return null

  return (
    <Transformer
      ref={transformerRef}
      keepRatio={false}
      centeredScaling={false}
      resizeEnabled
      rotateEnabled
      enabledAnchors={[...SHAPE_RESIZE_ANCHORS]}
      anchorStyleFunc={vistaprintAnchorStyle}
      borderStroke="#3b82f6"
      borderStrokeWidth={1.5}
      anchorFill="#ffffff"
      anchorStroke="#3b82f6"
      anchorSize={16}
      rotateAnchorOffset={34}
      padding={0}
      boundBoxFunc={(oldBox, newBox) =>
        newBox.width < 4 || newBox.height < 4 ? oldBox : newBox
      }
      onTransformEnd={finishTransform}
    />
  )
}
