'use client'
import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Circle, Text, Image as KonvaImage, Line, Transformer } from 'react-konva'
import { useEditorStore, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX, BLEED_PX, SAFE_AREA_X, SAFE_AREA_Y, SAFE_AREA_WIDTH, SAFE_AREA_HEIGHT, CARD_WIDTH_PX, CARD_HEIGHT_PX } from '@/store/editor.store'
import useImage from 'use-image'
import toast from 'react-hot-toast'
import FloatingTextToolbar from './FloatingTextToolbar'
import InlineTextEditor from './InlineTextEditor'

interface ImageElementProps {
  element: any
  isSelected: boolean
  onSelect: () => void
  onChange: (attrs: any) => void
}

function ImageElement({ element, isSelected, onSelect, onChange }: ImageElementProps) {
  const [image] = useImage(element.src || '')
  const imageRef = useRef<any>(null)
  const trRef = useRef<any>(null)

  useEffect(() => {
    if (isSelected && trRef.current && imageRef.current) {
      trRef.current.nodes([imageRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

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
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          })
        }}
        onTransformEnd={() => {
          const node = imageRef.current
          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          node.scaleX(1)
          node.scaleY(1)

          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
          })
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

export default function CanvasPreview() {
  const {
    elements,
    selectedId,
    selectElement,
    updateElement,
    zoom,
    showGrid,
    showBleed,
    showTrim,
    showSafety,
    snapToGrid,
    gridSize,
    background,
  } = useEditorStore()

  const stageRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: CANVAS_WIDTH_PX, height: CANVAS_HEIGHT_PX })
  const [displayScale, setDisplayScale] = useState(1)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [floatingToolbarPosition, setFloatingToolbarPosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    // Calculate display scale to fit canvas in viewport
    // At 100% zoom, we want to show the full canvas at a reasonable size
    const baseScale = 0.4 // Scale down from 300 DPI to fit screen
    const scale = baseScale * (zoom / 100)
    setDisplayScale(scale)
    setStageSize({
      width: CANVAS_WIDTH_PX * scale,
      height: CANVAS_HEIGHT_PX * scale,
    })
  }, [zoom])

  // Update floating toolbar position when selected text element changes
  useEffect(() => {
    if (selectedId && containerRef.current) {
      const element = elements.find((el) => el.id === selectedId)
      if (element && element.type === 'text') {
        const containerRect = containerRef.current.getBoundingClientRect()
        const scaledX = element.x * displayScale
        const scaledY = element.y * displayScale
        
        setFloatingToolbarPosition({
          x: containerRect.left + scaledX + (element.width * displayScale) / 2,
          y: containerRect.top + scaledY,
        })
      } else {
        setFloatingToolbarPosition(null)
      }
    } else {
      setFloatingToolbarPosition(null)
    }
  }, [selectedId, elements, displayScale])

  const handleSelect = (id: string) => {
    selectElement(id)
    setEditingTextId(null) // Exit edit mode when selecting
  }

  const handleDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectElement(null)
      setEditingTextId(null)
      setFloatingToolbarPosition(null)
    }
  }

  const handleTextDoubleClick = (id: string) => {
    setEditingTextId(id)
    selectElement(id)
  }

  const handleCloseTextEditor = () => {
    setEditingTextId(null)
  }

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value
    return Math.round(value / gridSize) * gridSize
  }

  // Check if element is outside safe area
  const checkSafeArea = (element: any) => {
    const safeX1 = SAFE_AREA_X
    const safeY1 = SAFE_AREA_Y
    const safeX2 = SAFE_AREA_X + SAFE_AREA_WIDTH
    const safeY2 = SAFE_AREA_Y + SAFE_AREA_HEIGHT

    const elX1 = element.x
    const elY1 = element.y
    const elX2 = element.x + element.width
    const elY2 = element.y + element.height

    return elX1 < safeX1 || elY1 < safeY1 || elX2 > safeX2 || elY2 > safeY2
  }

  // Show warning when element is dragged outside safe area
  const handleDragEnd = (element: any, newX: number, newY: number) => {
    const snappedX = snapToGridValue(newX)
    const snappedY = snapToGridValue(newY)
    
    updateElement(element.id, { x: snappedX, y: snappedY })
    
    // Check if outside safe area
    const tempElement = { ...element, x: snappedX, y: snappedY }
    if (checkSafeArea(tempElement)) {
      toast.error('⚠️ Element is outside safe area!', {
        duration: 2000,
        position: 'top-center',
      })
    }
  }

  // Parse background (gradient or solid)
  const getBackgroundStyle = () => {
    if (background.includes('gradient')) {
      return background
    }
    return background
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 overflow-auto">
      <div className="relative" ref={containerRef}>
        {/* Canvas container with background */}
        <div
          className="relative shadow-2xl"
          style={{
            width: stageSize.width,
            height: stageSize.height,
            background: getBackgroundStyle(),
            borderRadius: '8px',
          }}
        >
          <Stage
            ref={stageRef}
            width={CANVAS_WIDTH_PX}
            height={CANVAS_HEIGHT_PX}
            scaleX={displayScale}
            scaleY={displayScale}
            onMouseDown={handleDeselect}
            onTouchStart={handleDeselect}
          >
            <Layer>
              {/* ═══════════════════════════════════════════════════════════ */}
              {/* PRINT GUIDELINES LAYER (Non-selectable, always on top)      */}
              {/* ═══════════════════════════════════════════════════════════ */}

              {/* Grid (if enabled) */}
              {showGrid && (
                <>
                  {Array.from({ length: Math.ceil(CANVAS_WIDTH_PX / gridSize) }).map((_, i) => (
                    <Line
                      key={`v-${i}`}
                      points={[i * gridSize, 0, i * gridSize, CANVAS_HEIGHT_PX]}
                      stroke="#e5e7eb"
                      strokeWidth={0.5}
                      listening={false}
                    />
                  ))}
                  {Array.from({ length: Math.ceil(CANVAS_HEIGHT_PX / gridSize) }).map((_, i) => (
                    <Line
                      key={`h-${i}`}
                      points={[0, i * gridSize, CANVAS_WIDTH_PX, i * gridSize]}
                      stroke="#e5e7eb"
                      strokeWidth={0.5}
                      listening={false}
                    />
                  ))}
                </>
              )}

              {/* Bleed Area Overlay (Red semi-transparent) */}
              {showBleed && (
                <>
                  {/* Top bleed */}
                  <Rect
                    x={0}
                    y={0}
                    width={CANVAS_WIDTH_PX}
                    height={BLEED_PX}
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dash={[10, 5]}
                    listening={false}
                  />
                  {/* Bottom bleed */}
                  <Rect
                    x={0}
                    y={CANVAS_HEIGHT_PX - BLEED_PX}
                    width={CANVAS_WIDTH_PX}
                    height={BLEED_PX}
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dash={[10, 5]}
                    listening={false}
                  />
                  {/* Left bleed */}
                  <Rect
                    x={0}
                    y={BLEED_PX}
                    width={BLEED_PX}
                    height={CARD_HEIGHT_PX}
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dash={[10, 5]}
                    listening={false}
                  />
                  {/* Right bleed */}
                  <Rect
                    x={CANVAS_WIDTH_PX - BLEED_PX}
                    y={BLEED_PX}
                    width={BLEED_PX}
                    height={CARD_HEIGHT_PX}
                    fill="rgba(239, 68, 68, 0.15)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dash={[10, 5]}
                    listening={false}
                  />
                  {/* Bleed label */}
                  <Text
                    x={10}
                    y={10}
                    text="BLEED AREA (0.125″)"
                    fontSize={14}
                    fill="#ef4444"
                    fontStyle="bold"
                    listening={false}
                  />
                </>
              )}

              {/* Trim/Cut Line (Dark gray solid) */}
              {showTrim && (
                <>
                  <Rect
                    x={BLEED_PX}
                    y={BLEED_PX}
                    width={CARD_WIDTH_PX}
                    height={CARD_HEIGHT_PX}
                    stroke="#374151"
                    strokeWidth={3}
                    listening={false}
                  />
                  <Text
                    x={BLEED_PX + 10}
                    y={BLEED_PX + 10}
                    text="CUT LINE (3.5″ × 2″)"
                    fontSize={14}
                    fill="#374151"
                    fontStyle="bold"
                    listening={false}
                  />
                </>
              )}

              {/* Safe Area (Green dashed) */}
              {showSafety && (
                <>
                  <Rect
                    x={SAFE_AREA_X}
                    y={SAFE_AREA_Y}
                    width={SAFE_AREA_WIDTH}
                    height={SAFE_AREA_HEIGHT}
                    stroke="#10b981"
                    strokeWidth={2}
                    dash={[8, 4]}
                    listening={false}
                  />
                  <Text
                    x={SAFE_AREA_X + 10}
                    y={SAFE_AREA_Y + 10}
                    text="SAFE AREA (Keep content inside)"
                    fontSize={14}
                    fill="#10b981"
                    fontStyle="bold"
                    listening={false}
                  />
                </>
              )}

              {/* ═══════════════════════════════════════════════════════════ */}
              {/* USER ELEMENTS LAYER                                         */}
              {/* ═══════════════════════════════════════════════════════════ */}

              {/* Render elements */}
              {elements
                .filter((el) => el.visible !== false)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => {
                  const isSelected = element.id === selectedId
                  const outsideSafe = checkSafeArea(element)

                  if (element.type === 'text') {
                    return (
                      <Text
                        key={element.id}
                        text={element.text || ''}
                        x={element.x}
                        y={element.y}
                        width={element.width}
                        height={element.height}
                        fontSize={element.fontSize}
                        fontFamily={element.fontFamily}
                        fontStyle={element.fontWeight}
                        fill={element.fill}
                        align={element.align as any}
                        letterSpacing={element.letterSpacing}
                        lineHeight={element.lineHeight}
                        rotation={element.rotation}
                        draggable={editingTextId !== element.id}
                        onClick={() => handleSelect(element.id)}
                        onTap={() => handleSelect(element.id)}
                        onDragEnd={(e) => handleDragEnd(element, e.target.x(), e.target.y())}
                        onDblClick={() => handleTextDoubleClick(element.id)}
                        onDblTap={() => handleTextDoubleClick(element.id)}
                        stroke={isSelected ? '#3b82f6' : outsideSafe ? '#f59e0b' : undefined}
                        strokeWidth={isSelected ? 2 : outsideSafe ? 2 : 0}
                        opacity={editingTextId === element.id ? 0.3 : 1}
                      />
                    )
                  }

                  if (element.type === 'shape') {
                    if (element.shapeType === 'rect') {
                      return (
                        <Rect
                          key={element.id}
                          x={element.x}
                          y={element.y}
                          width={element.width}
                          height={element.height}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          cornerRadius={element.cornerRadius}
                          rotation={element.rotation}
                          draggable
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => handleDragEnd(element, e.target.x(), e.target.y())}
                        />
                      )
                    }

                    if (element.shapeType === 'circle') {
                      return (
                        <Circle
                          key={element.id}
                          x={element.x + element.width / 2}
                          y={element.y + element.height / 2}
                          radius={element.width / 2}
                          fill={element.fill}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          rotation={element.rotation}
                          draggable
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => {
                            handleDragEnd(element, e.target.x() - element.width / 2, e.target.y() - element.height / 2)
                          }}
                        />
                      )
                    }

                    if (element.shapeType === 'line') {
                      return (
                        <Line
                          key={element.id}
                          points={[element.x, element.y, element.x + element.width, element.y]}
                          stroke={element.stroke}
                          strokeWidth={element.strokeWidth}
                          draggable
                          onClick={() => handleSelect(element.id)}
                          onTap={() => handleSelect(element.id)}
                          onDragEnd={(e) => handleDragEnd(element, e.target.x(), e.target.y())}
                        />
                      )
                    }
                  }

                  if (element.type === 'image') {
                    return (
                      <ImageElement
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onChange={(attrs) => {
                          updateElement(element.id, attrs)
                          // Check safe area after transform
                          const tempElement = { ...element, ...attrs }
                          if (checkSafeArea(tempElement)) {
                            toast.error('⚠️ Element is outside safe area!', {
                              duration: 2000,
                              position: 'top-center',
                            })
                          }
                        }}
                      />
                    )
                  }

                  return null
                })}
            </Layer>
          </Stage>

          {/* Inline Text Editor Overlay */}
          {editingTextId && (
            <InlineTextEditor
              elementId={editingTextId}
              onClose={handleCloseTextEditor}
              displayScale={displayScale}
            />
          )}
        </div>

        {/* Dimension labels */}
        <div className="absolute -bottom-10 left-0 right-0 text-center text-xs text-gray-500 font-mono">
          Canvas: {CANVAS_WIDTH_PX} × {CANVAS_HEIGHT_PX}px (3.75" × 2.25" @ 300 DPI)
        </div>
        <div className="absolute -bottom-16 left-0 right-0 text-center text-xs text-gray-600 font-semibold">
          Card: {CARD_WIDTH_PX} × {CARD_HEIGHT_PX}px (3.5" × 2" final size)
        </div>
      </div>

      {/* Floating Text Toolbar */}
      {selectedId && floatingToolbarPosition && !editingTextId && (
        <FloatingTextToolbar
          elementId={selectedId}
          position={floatingToolbarPosition}
          onClose={() => selectElement(null)}
        />
      )}
    </div>
  )
}
