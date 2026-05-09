'use client'
import { useRef, useEffect, useState } from 'react'
import { Group, Rect, Text, Transformer } from 'react-konva'
import Konva from 'konva'

interface ProfessionalTextElementProps {
  element: any
  isSelected: boolean
  isEditing: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onTransformEnd: (attrs: any) => void
  onDoubleClick: () => void
}

// Professional text padding (like VistaPrint)
const TEXT_PADDING = {
  horizontal: 12,
  vertical: 8,
}

// Helper function to calculate required dimensions for text
const calculateTextDimensions = (
  text: string,
  fontSize: number,
  width: number,
  lineHeight: number = 1.2,
  fontFamily: string = 'Inter',
  fontWeight: string = 'normal'
): { width: number; height: number; lines: number } => {
  if (typeof window === 'undefined') {
    return {
      width: width,
      height: fontSize * lineHeight + TEXT_PADDING.vertical * 2,
      lines: 1
    }
  }
  
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    return {
      width: width,
      height: fontSize * lineHeight + TEXT_PADDING.vertical * 2,
      lines: 1
    }
  }
  
  // Set font with weight
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  
  // Calculate available width for text (minus padding)
  const availableWidth = width - (TEXT_PADDING.horizontal * 2)
  
  // Split text into words and calculate lines
  const words = text.split(' ')
  let lines = 1
  let currentLine = ''
  let maxLineWidth = 0
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = context.measureText(testLine)
    
    if (metrics.width > availableWidth && currentLine) {
      maxLineWidth = Math.max(maxLineWidth, context.measureText(currentLine).width)
      lines++
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  // Measure final line
  if (currentLine) {
    maxLineWidth = Math.max(maxLineWidth, context.measureText(currentLine).width)
  }
  
  // Calculate total height: lines * fontSize * lineHeight + padding
  const textHeight = lines * fontSize * lineHeight
  const totalHeight = textHeight + (TEXT_PADDING.vertical * 2)
  
  return {
    width: maxLineWidth + (TEXT_PADDING.horizontal * 2),
    height: Math.max(totalHeight, 30), // Minimum 30px
    lines
  }
}

export default function ProfessionalTextElement({
  element,
  isSelected,
  isEditing,
  onSelect,
  onDragEnd,
  onTransformEnd,
  onDoubleClick,
}: ProfessionalTextElementProps) {
  const groupRef = useRef<Konva.Group>(null)
  const textRef = useRef<Konva.Text>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  // 🔥 SMART AUTO-RESIZE: Ensures text NEVER gets clipped
  useEffect(() => {
    if (textRef.current && element.text && !isResizing) {
      requestAnimationFrame(() => {
        // Get actual text dimensions from Konva
        const actualTextHeight = textRef.current?.height() || 0
        const actualTextWidth = textRef.current?.width() || 0
        
        // Calculate required dimensions
        const dimensions = calculateTextDimensions(
          element.text,
          element.fontSize || 16,
          element.width,
          element.lineHeight || 1.2,
          element.fontFamily || 'Inter',
          element.fontWeight || 'normal'
        )
        
        // Determine if we need to resize
        const requiredHeight = Math.max(
          actualTextHeight + (TEXT_PADDING.vertical * 2),
          dimensions.height
        )
        
        const needsHeightResize = requiredHeight > element.height
        
        // Auto-expand container if text would be clipped
        if (needsHeightResize) {
          onTransformEnd({
            height: requiredHeight,
          })
        }
      })
    }
  }, [element.text, element.fontSize, element.fontFamily, element.fontWeight, element.width, element.lineHeight, isResizing])

  // Calculate text dimensions with padding
  const textWidth = element.width - (TEXT_PADDING.horizontal * 2)
  const textHeight = element.height - (TEXT_PADDING.vertical * 2)

  // Determine vertical alignment
  const getVerticalAlign = () => {
    if (element.verticalAlign === 'top') return TEXT_PADDING.vertical
    if (element.verticalAlign === 'bottom') {
      return element.height - textHeight - TEXT_PADDING.vertical
    }
    // Center (default)
    return (element.height - textHeight) / 2
  }

  const textY = getVerticalAlign()

  // Check if text is outside safe area
  const isOutsideSafe = element.outsideSafeArea || false

  return (
    <>
      <Group
        ref={groupRef}
        x={element.x}
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
          // During transform, prevent auto-resize
          setIsResizing(true)
        }}
        onTransformEnd={(e) => {
          const node = groupRef.current
          if (!node) return

          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          // Reset scale
          node.scaleX(1)
          node.scaleY(1)

          // Calculate new dimensions
          const newWidth = Math.max(60, node.width() * scaleX)
          const newHeight = Math.max(30, node.height() * scaleY)

          // Calculate if text fits in new dimensions
          const dimensions = calculateTextDimensions(
            element.text || '',
            element.fontSize || 16,
            newWidth,
            element.lineHeight || 1.2,
            element.fontFamily || 'Inter',
            element.fontWeight || 'normal'
          )

          // Ensure height is sufficient for text
          const finalHeight = Math.max(newHeight, dimensions.height)

          onTransformEnd({
            x: node.x(),
            y: node.y(),
            width: newWidth,
            height: finalHeight,
            rotation: node.rotation(),
          })

          // Re-enable auto-resize after transform
          setTimeout(() => setIsResizing(false), 100)
        }}
      >
        {/* Background box (for padding visualization when selected) - Removed */}
        {/* {isSelected && (
          <Rect
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            fill="transparent"
            stroke={isOutsideSafe ? '#f59e0b' : '#3b82f6'}
            strokeWidth={2}
            dash={isOutsideSafe ? [5, 5] : undefined}
            cornerRadius={4}
          />
        )} */}

        {/* Padding indicator (subtle background) - Removed */}
        {/* {isSelected && !isEditing && (
          <Rect
            x={TEXT_PADDING.horizontal}
            y={TEXT_PADDING.vertical}
            width={textWidth}
            height={textHeight}
            fill="#3b82f6"
            opacity={0.05}
            cornerRadius={2}
          />
        )} */}

        {/* Actual text with padding - NO CLIPPING */}
        <Text
          ref={textRef}
          x={TEXT_PADDING.horizontal}
          y={textY}
          width={textWidth}
          text={element.text || ''}
          fontSize={element.fontSize || 16}
          fontFamily={element.fontFamily || 'Inter'}
          fontStyle={element.fontWeight || 'normal'}
          fill={element.fill || '#000000'}
          stroke={element.stroke || undefined}
          strokeWidth={element.strokeWidth || 0}
          align={element.align || 'left'}
          verticalAlign="middle"
          letterSpacing={element.letterSpacing || 0}
          lineHeight={element.lineHeight || 1.2}
          wrap="word"
          ellipsis={false}
          opacity={isEditing ? 0.3 : (element.opacity !== undefined ? element.opacity : 1)}
          listening={false}
        />

        {/* Outside safe area warning indicator - Removed */}
        {/* {isOutsideSafe && !isSelected && (
          <Rect
            x={0}
            y={0}
            width={element.width}
            height={element.height}
            stroke="#f59e0b"
            strokeWidth={2}
            dash={[5, 5]}
            cornerRadius={4}
            listening={false}
          />
        )} */}
      </Group>

      {/* Transformer for resizing - Hidden/Minimal handles */}
      {isSelected && !isEditing && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={false}
          enabledAnchors={[
            'top-left',
            'top-right',
            'bottom-left',
            'bottom-right',
            'middle-left',
            'middle-right',
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // Minimum size constraints
            const minWidth = 60
            const minHeight = 30

            // Prevent making box smaller than minimum
            if (newBox.width < minWidth || newBox.height < minHeight) {
              return oldBox
            }

            // Calculate if text would fit in new box
            const dimensions = calculateTextDimensions(
              element.text || '',
              element.fontSize || 16,
              newBox.width,
              element.lineHeight || 1.2,
              element.fontFamily || 'Inter',
              element.fontWeight || 'normal'
            )

            // If text wouldn't fit, prevent resize
            if (dimensions.height > newBox.height) {
              return {
                ...newBox,
                height: dimensions.height
              }
            }

            return newBox
          }}
          anchorSize={6}
          anchorStroke="transparent"
          anchorFill="transparent"
          anchorCornerRadius={0}
          borderStroke="transparent"
          borderStrokeWidth={0}
          borderDash={[]}
        />
      )}
    </>
  )
}
