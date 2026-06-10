'use client'
import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { Group, Rect, Text, Transformer, Circle, Line } from 'react-konva'
import Konva from 'konva'

interface CanvaStyleTextElementProps {
  element: any
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
  onDoubleClick: () => void
}

// Canva-style padding (minimal)
const TEXT_PADDING = {
  horizontal: 16,
  vertical: 12,
}

// Canva brand colors
const CANVA_CYAN = '#00C4CC'
const CANVA_HANDLE_SIZE = 12

const buildFontStyle = (element: {
  fontStyle?: string
  fontWeight?: string | number
}) => {
  const parts = [
    element.fontStyle === 'italic' ? 'italic' : '',
    element.fontWeight === 'bold' || element.fontWeight === 700 || element.fontWeight === '700' ? 'bold' : '',
  ].filter(Boolean)
  return parts.join(' ') || 'normal'
}

// Konva-native measurement — matches what is actually painted on canvas.
export const measureKonvaText = (element: {
  text?: string
  fontSize?: number
  fontFamily?: string
  fontStyle?: string
  fontWeight?: string | number
  letterSpacing?: number
  lineHeight?: number
}): { width: number; height: number } => {
  const text = element.text || ' '
  const fontSize = element.fontSize || 16
  const lines = Math.max(1, text.split('\n').length)
  const fallback = {
    width: Math.max(80, text.length * fontSize * 0.65 + TEXT_PADDING.horizontal * 2),
    height: Math.max(40, lines * fontSize * (element.lineHeight || 1.2) + TEXT_PADDING.vertical * 2),
  }

  if (typeof window === 'undefined') return fallback

  const probe = new Konva.Text({
    text,
    fontSize,
    fontFamily: element.fontFamily || 'Inter',
    fontStyle: buildFontStyle(element),
    letterSpacing: element.letterSpacing || 0,
    lineHeight: element.lineHeight || 1.2,
    wrap: 'none',
    padding: 0,
  })

  return {
    width: Math.max(80, Math.ceil(probe.width()) + TEXT_PADDING.horizontal * 2 + 4),
    height: Math.max(40, Math.ceil(probe.height()) + TEXT_PADDING.vertical * 2 + 4),
  }
}

export const getFittedTextX = (
  x: number,
  storedWidth: number,
  fittedWidth: number,
  align: string | undefined,
) => {
  if (align === 'center') return x + (storedWidth - fittedWidth) / 2
  if (align === 'right') return x + (storedWidth - fittedWidth)
  return x
}

const getFittedX = getFittedTextX

const readFontSize = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : 16
}

export default function CanvaStyleTextElement({
  element,
  isSelected,
  isEditing,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onDoubleClick,
}: CanvaStyleTextElementProps) {
  const groupRef = useRef<Konva.Group>(null)
  const textRef = useRef<Konva.Text>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [isResizing, setIsResizing] = useState(false)
  const fontPx = readFontSize(element.fontSize)
  const [boxSize, setBoxSize] = useState(() => measureKonvaText({ ...element, fontSize: fontPx }))

  useLayoutEffect(() => {
    const measure = () => {
      const node = textRef.current
      if (node && node.fontSize() !== fontPx) {
        node.fontSize(fontPx)
        node.clearCache()
      }

      const next = node
        ? {
            width: Math.max(80, Math.ceil(node.width()) + TEXT_PADDING.horizontal * 2 + 4),
            height: Math.max(40, Math.ceil(node.height()) + TEXT_PADDING.vertical * 2 + 4),
          }
        : measureKonvaText({ ...element, fontSize: fontPx })

      setBoxSize(prev =>
        prev.width === next.width && prev.height === next.height ? prev : next
      )

      node?.getLayer()?.batchDraw()
    }

    measure()
    const frame = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(frame)
  }, [
    element.text,
    fontPx,
    element.fontFamily,
    element.fontWeight,
    element.fontStyle,
    element.letterSpacing,
    element.lineHeight,
  ])

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected, boxSize.width, boxSize.height])

  const boxWidth = boxSize.width
  const boxHeight = boxSize.height
  const boxX = getFittedX(element.x, element.width, boxWidth, element.align)

  // Persist tight bounds when templates load with an oversized full-card width.
  useEffect(() => {
    if (isResizing || isEditing) return

    const looksLikeFullCardWidth = element.width >= 900
    const needsWider = boxWidth > element.width + 2
    const needsTaller = boxHeight > element.height + 2
    const needsNarrower = element.width > boxWidth + 8
    const needsShorter = element.height > boxHeight + 8
    if (!looksLikeFullCardWidth && !needsWider && !needsTaller && !needsNarrower && !needsShorter) return

    const patch: Record<string, number> = {}
    if (looksLikeFullCardWidth || needsWider || needsNarrower) {
      patch.width = boxWidth
      if (looksLikeFullCardWidth || needsNarrower || needsWider) {
        patch.x = getFittedX(element.x, element.width, boxWidth, element.align)
      }
    }
    if (needsTaller || needsShorter) patch.height = boxHeight
    onTransformEnd(patch)
  }, [
    boxWidth, boxHeight, element.width, element.height, element.x, element.align,
    element.text, element.fontSize, element.fontFamily, element.fontWeight,
    element.letterSpacing, element.lineHeight, isResizing, isEditing,
  ]) // eslint-disable-line react-hooks/exhaustive-deps

  // Check if text is outside safe area
  const isOutsideSafe = element.outsideSafeArea || false

  return (
    <>
      <Group
        ref={groupRef}
        x={boxX}
        y={element.y}
        rotation={element.rotation}
        draggable={!isEditing && !element.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={onDoubleClick}
        onDblTap={onDoubleClick}
        onDragEnd={(e) => {
          onDragEnd(e.target.x(), e.target.y())
        }}
        onTransformStart={() => {
          setIsResizing(true)
        }}
        onTransform={() => {
          setIsResizing(true)
        }}
        onTransformEnd={() => {
          const node = groupRef.current
          if (!node) return

          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          const scale = Math.abs(scaleY - 1) >= Math.abs(scaleX - 1) ? scaleY : scaleX
          const newFontSize = Math.max(6, Math.min(300, Math.round(fontPx * scale)))
          const fitted = measureKonvaText({ ...element, fontSize: newFontSize })

          onTransformEnd({
            x: node.x(),
            y: node.y(),
            width: fitted.width,
            height: fitted.height,
            rotation: node.rotation(),
            fontSize: newFontSize,
          })

          setTimeout(() => setIsResizing(false), 100)
        }}
      >
        {/* Canva-style selection border - Removed */}
        {/* {isSelected && (
          <Rect
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            fill="transparent"
            stroke={isOutsideSafe ? '#f59e0b' : CANVA_CYAN}
            strokeWidth={2}
            dash={isOutsideSafe ? [5, 5] : undefined}
            cornerRadius={0}
          />
        )} */}

        {/* Transparent hit area so the Group receives clicks even when Text has listening=false */}
        <Rect
          x={0}
          y={0}
          width={boxWidth}
          height={boxHeight}
          fill="transparent"
          listening={true}
        />

        {/* Actual text with padding - NO CLIPPING */}
        <Text
          ref={textRef}
          x={TEXT_PADDING.horizontal}
          y={TEXT_PADDING.vertical}
          text={element.text || ''}
          fontSize={fontPx}
          fontFamily={element.fontFamily || 'Inter'}
          fontStyle={buildFontStyle(element)}
          fill={element.fill || '#000000'}
          stroke={element.stroke || undefined}
          strokeWidth={element.strokeWidth || 0}
          align={element.align || 'left'}
          verticalAlign="top"
          letterSpacing={element.letterSpacing || 0}
          lineHeight={element.lineHeight || 1.2}
          wrap="none"
          ellipsis={false}
          opacity={isEditing ? 0.3 : (element.opacity !== undefined ? element.opacity : 1)}
          listening={false}
        />

        {/* Outside safe area warning indicator */}
        {isOutsideSafe && !isSelected && (
          <Rect
            x={0}
            y={0}
            width={boxWidth}
            height={boxHeight}
            stroke="#f59e0b"
            strokeWidth={2}
            dash={[5, 5]}
            cornerRadius={0}
            listening={false}
          />
        )}
      </Group>

      {/* Canva-style Transformer with circular handles */}
      {isSelected && !isEditing && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          rotateAnchorOffset={40}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'middle-left',
            'middle-right',
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 48 || newBox.height < 28) return oldBox
            return newBox
          }}
          anchorSize={CANVA_HANDLE_SIZE}
          anchorStroke={CANVA_CYAN}
          anchorFill="#ffffff"
          anchorCornerRadius={CANVA_HANDLE_SIZE / 2}
          anchorStrokeWidth={2}
          borderStroke={CANVA_CYAN}
          borderStrokeWidth={2}
          borderDash={[]}
          rotateAnchorCursor="grab"
        />
      )}

      {/* Canva-style rotation handle (circle at top) */}
      {isSelected && !isEditing && (
        <Group>
          <Line
            points={[
              boxX + boxWidth / 2,
              element.y - 40,
              boxX + boxWidth / 2,
              element.y,
            ]}
            stroke={CANVA_CYAN}
            strokeWidth={2}
            listening={false}
          />
          <Circle
            x={boxX + boxWidth / 2}
            y={element.y - 40}
            radius={8}
            fill="#ffffff"
            stroke={CANVA_CYAN}
            strokeWidth={2}
            listening={false}
          />
        </Group>
      )}
    </>
  )
}
