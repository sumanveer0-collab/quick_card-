import type Konva from 'konva'

export const SHAPE_RESIZE_ANCHORS = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'middle-left',
  'middle-right',
  'top-center',
  'bottom-center',
] as const

const MIN_SIZE = 4

/** Bake scale into width/height. Works best on Konva.Rect nodes. */
export function bakeTransformToBox(
  node: Konva.Node,
  baseWidth: number,
  baseHeight: number,
) {
  const scaleX = node.scaleX()
  const scaleY = node.scaleY()

  node.scaleX(1)
  node.scaleY(1)

  const isRect = node.getClassName() === 'Rect'
  const sourceW = isRect ? (node as Konva.Rect).width() : baseWidth
  const sourceH = isRect ? (node as Konva.Rect).height() : baseHeight

  const newWidth = Math.max(MIN_SIZE, Math.abs(sourceW * scaleX))
  const newHeight = Math.max(MIN_SIZE, Math.abs(sourceH * scaleY))

  if (isRect) {
    ;(node as Konva.Rect).width(newWidth)
    ;(node as Konva.Rect).height(newHeight)
  }

  return {
    x: node.x(),
    y: node.y(),
    width: newWidth,
    height: newHeight,
    rotation: node.rotation(),
  }
}

/** Pill handles on sides, circles on corners — no offset (Konva positions anchors). */
export function vistaprintAnchorStyle(anchor: Konva.Rect) {
  anchor.fill('#ffffff')
  anchor.stroke('#3b82f6')
  anchor.strokeWidth(2)
  anchor.hitStrokeWidth(12)

  const name = anchor.name()

  if (name === 'top-center' || name === 'bottom-center') {
    anchor.width(36)
    anchor.height(12)
    anchor.cornerRadius(6)
    return
  }

  if (name === 'middle-left' || name === 'middle-right') {
    anchor.width(12)
    anchor.height(36)
    anchor.cornerRadius(6)
    return
  }

  if (name === 'rotater') return

  anchor.width(16)
  anchor.height(16)
  anchor.cornerRadius(8)
}

export function syncPatternScale(
  rect: Konva.Rect,
  width: number,
  height: number,
  img: HTMLImageElement | null,
) {
  if (!img) return
  const nw = img.naturalWidth || width
  const nh = img.naturalHeight || height
  rect.fillPatternScaleX(width / nw)
  rect.fillPatternScaleY(height / nh)
}
