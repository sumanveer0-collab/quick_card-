/** Store uses top-left x,y; Konva rotates cleanly when pivot is the box center. */

export interface PivotBox {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

export function centerPivotKonvaProps(el: PivotBox) {
  const w = el.width
  const h = el.height
  return {
    offsetX: w / 2,
    offsetY: h / 2,
    x: el.x + w / 2,
    y: el.y + h / 2,
    rotation: el.rotation ?? 0,
  }
}

export function konvaNodeToTopLeft(
  node: { x: () => number; y: () => number; rotation: () => number },
  width: number,
  height: number,
) {
  return {
    x: node.x() - width / 2,
    y: node.y() - height / 2,
    rotation: node.rotation(),
  }
}

export function syncKonvaCenterPivot(
  node: { offsetX: (v: number) => void; offsetY: (v: number) => void },
  width: number,
  height: number,
) {
  node.offsetX(width / 2)
  node.offsetY(height / 2)
}
