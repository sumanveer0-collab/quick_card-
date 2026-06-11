'use client'
import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Circle, Image as KonvaImage, Line, Group, Transformer } from 'react-konva'
import Konva from 'konva'
import { useEditorStore, CANVAS_WIDTH_PX, CANVAS_HEIGHT_PX, BLEED_PX, SAFE_AREA_X, SAFE_AREA_Y, SAFE_AREA_WIDTH, SAFE_AREA_HEIGHT, CARD_WIDTH_PX, CARD_HEIGHT_PX } from '@/store/editor.store'
import useImage from 'use-image'
import toast from 'react-hot-toast'
import InlineTextEditor from '../editor/InlineTextEditor'
import VistaprintTextEditor from './VistaprintTextEditor'
import AdvancedTextEditor from './AdvancedTextEditor'
import QuickTextEditButton from './QuickTextEditButton'
import { FloatingToolbar } from '../graphics/modern'
import EditableGraphicElement from './EditableGraphicElement'
import SVGGraphicElement from './SVGGraphicElement'
import IconElement from './IconElement'
import ProfessionalTextElement from './ProfessionalTextElement'
import CanvaStyleTextElement from './CanvaStyleTextElement'
import CanvaStyleToolbar from './CanvaStyleToolbar'
import CanvaQuickActions from './CanvaQuickActions'
import CanvasTextEditor from './CanvasTextEditor'
import FilteredImage from './FilteredImage'
import VistaprintFloatingToolbar from './VistaprintFloatingToolbar'
import { ElementPrimaryToolbar, ElementSecondaryToolbar } from './ElementFloatingToolbars'
import { replacePlaceholders } from '@/lib/template-engine'
import { isGradientBackground } from '@/lib/background-palette'

// ── Template HTML iframe rendered behind Konva stage ──────────────────────
function TemplateIframe({ displayScale }: { displayScale: number }) {
  const { templateHtml, templateCss, background } = useEditorStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const el = iframeRef.current
    if (!el || !templateHtml) return

    const filled = replacePlaceholders(templateHtml, {
      name: 'Full Name',
      businessName: 'LOGO TEXT HERE',
      phone: '+91 99999 99999',
      email: 'hello@example.com',
      website: 'www.example.com',
      address: '123 Main Street, City',
      tagline: 'Slogan Here',
      logoUrl: '',
      qrCodeUrl: '',
    })

    const doc = `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Poppins:wght@400;600;700;800&family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;overflow:hidden;font-family:'Inter',sans-serif;}
${templateCss || ''}
</style>
</head><body>${filled}</body></html>`

    const docObj = el.contentDocument
    if (docObj) { docObj.open(); docObj.write(doc); docObj.close() }
  }, [templateHtml, templateCss, background])

  if (!templateHtml) return null

  // The iframe is written at full canvas resolution (1125×675)
  // then scaled down with transform to match the display scale
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: `${CANVAS_WIDTH_PX * displayScale}px`,
        height: `${CANVAS_HEIGHT_PX * displayScale}px`,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <iframe
        ref={iframeRef}
        title="template-preview"
        sandbox="allow-same-origin"
        style={{
          width: `${CANVAS_WIDTH_PX}px`,
          height: `${CANVAS_HEIGHT_PX}px`,
          border: 'none',
          display: 'block',
          transform: `scale(${displayScale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default function CustomizeCanvas() {
  const {
    elements,
    selectedId,
    selectElement,
    updateElement,
    duplicateElement,
    deleteElement,
    zoom,
    showSafety,
    snapToGrid,
    gridSize,
    background,
    setBackground,
    templateHtml,
  } = useEditorStore()

  const stageRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = useState({ width: CANVAS_WIDTH_PX, height: CANVAS_HEIGHT_PX })
  const [displayScale, setDisplayScale] = useState(1)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [vistaprintEditingId, setVistaprintEditingId] = useState<string | null>(null)
  const [advancedEditingId, setAdvancedEditingId] = useState<string | null>(null)
  const [selectedGraphicId, setSelectedGraphicId] = useState<string | null>(null)
  const [showZoomHint, setShowZoomHint] = useState(false)
  const [canvasTextEditorId, setCanvasTextEditorId] = useState<string | null>(null)
  const [vistaprintToolbarId, setVistaprintToolbarId] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false })
  const useCanvaStyle = true // Always use Canva style (floating toolbar)
  const useVistaprintEditor = false // Use Vistaprint-style editor
  const useAdvancedEditor = false // Use Advanced text editor - disabled
  const useCanvasTextEditor = false // Use new Canvas Text Editor - disabled
  const useVistaprintFloatingToolbar = false // Disabled — TextEditPanel on right side handles editing

  useEffect(() => {
    // Calculate scale based on available viewport space
    const updateScale = () => {
      // Get actual available space from the container if possible
      const sidebarWidth = 320  // left sidebar approx width
      const iconNavWidth = 80   // icon nav width
      const bottomBarH = 56     // bottom action bar
      const topBarH = 56        // top header

      const containerWidth = window.innerWidth - sidebarWidth - iconNavWidth - 32
      const containerHeight = window.innerHeight - topBarH - bottomBarH - 64

      const scaleX = containerWidth / CANVAS_WIDTH_PX
      const scaleY = containerHeight / CANVAS_HEIGHT_PX
      const autoScale = Math.min(scaleX, scaleY, 1.0) // Max scale 1.0

      const baseScale = Math.max(0.4, autoScale)
      const scale = baseScale * (zoom / 100)
      setDisplayScale(scale)
      setStageSize({
        width: CANVAS_WIDTH_PX * scale,
        height: CANVAS_HEIGHT_PX * scale,
      })
    }

    updateScale()
    
    // Update scale on window resize
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [zoom])

  // Add mouse wheel zoom functionality
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Only zoom when Ctrl is pressed and mouse is over the canvas
      if (!e.ctrlKey) return
      
      const canvasContainer = containerRef.current
      if (!canvasContainer) return
      
      const rect = canvasContainer.getBoundingClientRect()
      const isOverCanvas = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      )
      
      if (!isOverCanvas) return
      
      e.preventDefault()
      
      // Calculate zoom change
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1
      const currentZoom = useEditorStore.getState().zoom
      const newZoom = Math.min(Math.max(currentZoom * zoomFactor, 25), 300) // Min 25%, Max 300%
      
      useEditorStore.getState().setZoom(Math.round(newZoom))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        setShowZoomHint(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey) {
        setShowZoomHint(false)
      }
    }

    // Close context menu on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenu.show) {
        setContextMenu({ x: 0, y: 0, show: false })
      }
    }

    // Add event listeners
    document.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [contextMenu.show])

  const handleSelect = (id: string) => {
    selectElement(id)
    setEditingTextId(null)
    setVistaprintEditingId(null)
    setAdvancedEditingId(null)
    setCanvasTextEditorId(null)
    setVistaprintToolbarId(null)
    
    const element = elements.find(el => el.id === id)
    if (element?.type === 'shape') {
      setSelectedGraphicId(id)
    } else {
      setSelectedGraphicId(null)
    }

    // If it's a text element, show Vistaprint floating toolbar
    if (element && element.type === 'text') {
      if (useVistaprintFloatingToolbar) {
        setVistaprintToolbarId(id)
      } else if (useCanvasTextEditor) {
        setCanvasTextEditorId(id)
      }
    }
  }

  const handleDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      selectElement(null)
      setEditingTextId(null)
      setVistaprintEditingId(null)
      setAdvancedEditingId(null)
      setCanvasTextEditorId(null)
      setVistaprintToolbarId(null)
      setSelectedGraphicId(null)
    }
    // Hide context menu on any click
    setContextMenu({ x: 0, y: 0, show: false })
  }

  const handleTextDoubleClick = (id: string) => {
    if (useVistaprintFloatingToolbar) {
      // Vistaprint style: single click shows toolbar, double click enables inline editing
      setVistaprintToolbarId(id)
      selectElement(id)
    } else if (useCanvasTextEditor) {
      setCanvasTextEditorId(id)
      selectElement(id)
    } else if (useAdvancedEditor) {
      setAdvancedEditingId(id)
      selectElement(id)
    } else if (useVistaprintEditor) {
      setVistaprintEditingId(id)
      selectElement(id)
    } else {
      setEditingTextId(id)
      selectElement(id)
    }
  }

  const handleCloseTextEditor = () => {
    setEditingTextId(null)
    setVistaprintEditingId(null)
    setAdvancedEditingId(null)
    setCanvasTextEditorId(null)
    setVistaprintToolbarId(null)
  }

  // Handle right-click context menu
  const handleContextMenu = (e: any) => {
    e.evt.preventDefault()
    
    // Only show context menu if clicking on empty canvas
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      const stage = e.target.getStage()
      const pointerPosition = stage.getPointerPosition()
      const containerRect = containerRef.current?.getBoundingClientRect()
      
      if (containerRect && pointerPosition) {
        // Calculate position and ensure menu stays within viewport
        const menuWidth = 280
        const menuHeight = 400
        let x = containerRect.left + pointerPosition.x
        let y = containerRect.top + pointerPosition.y
        
        // Adjust if menu would go outside viewport
        if (x + menuWidth > window.innerWidth) {
          x = window.innerWidth - menuWidth - 10
        }
        if (y + menuHeight > window.innerHeight) {
          y = window.innerHeight - menuHeight - 10
        }
        
        setContextMenu({ x, y, show: true })
      }
    }
  }

  // Background color options
  const backgroundOptions = [
    // Gradients
    { name: 'Blue Gradient', value: 'linear-gradient(135deg, #0369a1, #0891b2)' },
    { name: 'Purple Gradient', value: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
    { name: 'Green Gradient', value: 'linear-gradient(135deg, #059669, #10b981)' },
    { name: 'Red Gradient', value: 'linear-gradient(135deg, #dc2626, #ef4444)' },
    { name: 'Orange Gradient', value: 'linear-gradient(135deg, #ea580c, #f97316)' },
    { name: 'Pink Gradient', value: 'linear-gradient(135deg, #db2777, #ec4899)' },
    { name: 'Teal Gradient', value: 'linear-gradient(135deg, #0d9488, #14b8a6)' },
    { name: 'Indigo Gradient', value: 'linear-gradient(135deg, #4f46e5, #6366f1)' },
    { name: 'Sunset Gradient', value: 'linear-gradient(135deg, #ff7e5f, #feb47b)' },
    { name: 'Ocean Gradient', value: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { name: 'Forest Gradient', value: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { name: 'Royal Gradient', value: 'linear-gradient(135deg, #8360c3, #2ebf91)' },
    // Solid Colors
    { name: 'White', value: '#ffffff' },
    { name: 'Light Gray', value: '#f3f4f6' },
    { name: 'Medium Gray', value: '#9ca3af' },
    { name: 'Dark Gray', value: '#374151' },
    { name: 'Black', value: '#000000' },
    { name: 'Navy Blue', value: '#1e3a8a' },
    { name: 'Forest Green', value: '#166534' },
    { name: 'Burgundy', value: '#7f1d1d' },
    { name: 'Deep Purple', value: '#581c87' },
    { name: 'Charcoal', value: '#1f2937' },
  ]

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground)
    setContextMenu({ x: 0, y: 0, show: false })
  }

  // Handle graphic element updates
  const handleUpdateGraphicElement = (properties: any) => {
    if (selectedGraphicId) {
      updateElement(selectedGraphicId, properties)
    }
  }

  // Handle graphic element actions
  const handleDuplicateGraphic = () => {
    if (selectedGraphicId) {
      duplicateElement(selectedGraphicId)
    }
  }

  const handleDeleteGraphic = () => {
    if (selectedGraphicId) {
      deleteElement(selectedGraphicId)
      setSelectedGraphicId(null)
    }
  }

  const handleBringGraphicForward = () => {
    if (selectedGraphicId) {
      const element = elements.find(el => el.id === selectedGraphicId)
      if (element) {
        updateElement(selectedGraphicId, { zIndex: (element.zIndex || 0) + 1 })
      }
    }
  }

  const handleSendGraphicBackward = () => {
    if (selectedGraphicId) {
      const element = elements.find(el => el.id === selectedGraphicId)
      if (element) {
        updateElement(selectedGraphicId, { zIndex: Math.max(0, (element.zIndex || 0) - 1) })
      }
    }
  }

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value
    return Math.round(value / gridSize) * gridSize
  }

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

  const handleDragEnd = (element: any, newX: number, newY: number) => {
    const snappedX = snapToGridValue(newX)
    const snappedY = snapToGridValue(newY)
    
    updateElement(element.id, { x: snappedX, y: snappedY })
    
    const tempElement = { ...element, x: snappedX, y: snappedY }
    const isOutside = checkSafeArea(tempElement)
    
    // Update outsideSafeArea flag
    updateElement(element.id, { outsideSafeArea: isOutside })
    
    if (isOutside) {
      toast.error('⚠️ Element is outside safe area!', {
        duration: 2000,
        position: 'top-center',
      })
    }
  }

  const handleTextTransformEnd = (element: any, attrs: any) => {
    updateElement(element.id, attrs)
    
    const tempElement = { ...element, ...attrs }
    const isOutside = checkSafeArea(tempElement)
    
    // Update outsideSafeArea flag
    updateElement(element.id, { outsideSafeArea: isOutside })
    
    if (isOutside) {
      toast.error('⚠️ Element is outside safe area!', {
        duration: 2000,
        position: 'top-center',
      })
    }
  }

  const getBackgroundStyle = () => {
    if (background.includes('gradient')) {
      return background
    }
    return background
  }

  const selectedToolbarEl = selectedId ? elements.find(e => e.id === selectedId) : null
  const toolbarVariant =
    selectedToolbarEl?.type === 'image' ? 'image'
    : selectedToolbarEl?.type === 'shape' ? 'shape'
    : selectedToolbarEl?.type === 'icon' ? 'icon'
    : null

  return (
    <div className="flex-1 relative min-h-0 flex flex-col">
      {/* Primary toolbar — fixed top of canvas (image + shape + icon) */}
      {toolbarVariant && selectedId && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
          <div className="pointer-events-auto">
            <ElementPrimaryToolbar elementId={selectedId} variant={toolbarVariant} />
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center p-6 bg-[#6b7280] overflow-auto relative min-h-0">
      <div className="relative" ref={containerRef}>
        {/* Card Canvas — full bleed size, no overflow clipping */}
        <div
          className="relative shadow-2xl"
          style={{
            width: stageSize.width,
            height: stageSize.height,
            background: templateHtml ? 'transparent' : getBackgroundStyle(),
            overflow: 'visible',
          }}
        >
          {/* Secondary toolbar — above icon, below image/shape */}
          {toolbarVariant && selectedId && (
            <ElementSecondaryToolbar
              elementId={selectedId}
              displayScale={displayScale}
              placement={toolbarVariant === 'icon' ? 'above' : 'below'}
              onDelete={() => {
                setSelectedGraphicId(null)
                selectElement(null)
              }}
            />
          )}

          {/* ── Template HTML iframe (rendered behind Konva stage) ── */}
          <TemplateIframe displayScale={displayScale} />

          <Stage
            ref={stageRef}
            width={CANVAS_WIDTH_PX}
            height={CANVAS_HEIGHT_PX}
            scaleX={displayScale}
            scaleY={displayScale}
            onMouseDown={handleDeselect}
            onTouchStart={handleDeselect}
            onContextMenu={handleContextMenu}
            style={{ position: 'relative', zIndex: 1, background: 'transparent', display: 'block' }}
          >
            {/* ── Layer 1: Bleed layer — images & shapes extend to full bleed boundary ── */}
            <Layer
              clipX={0}
              clipY={0}
              clipWidth={CANVAS_WIDTH_PX}
              clipHeight={CANVAS_HEIGHT_PX}
            >
              {!templateHtml && !isGradientBackground(background) && (
                <Rect
                  x={0}
                  y={0}
                  width={CANVAS_WIDTH_PX}
                  height={CANVAS_HEIGHT_PX}
                  fill={background || '#ffffff'}
                  listening={false}
                />
              )}

              {elements
                .filter((el) => el.visible !== false && (el.type === 'shape' || el.type === 'image' || el.type === 'icon'))
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => {
                  const isSelected = element.id === selectedId

                  if (element.type === 'image') {
                    return (
                      <FilteredImage
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onChange={(attrs) => {
                          updateElement(element.id, attrs)
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

                  if (element.type === 'icon') {
                    return (
                      <IconElement
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onDragEnd={(x, y) => handleDragEnd(element, x, y)}
                        onTransformEnd={(attrs) => handleTextTransformEnd(element, attrs)}
                      />
                    )
                  }

                  if (element.type === 'shape' && element.svg) {
                    return (
                      <SVGGraphicElement
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onDragEnd={(x, y) => handleDragEnd(element, x, y)}
                        onTransformEnd={(attrs) => handleTextTransformEnd(element, attrs)}
                      />
                    )
                  }

                  if (element.type === 'shape') {
                    return (
                      <EditableGraphicElement
                        key={element.id}
                        element={element}
                        isSelected={isSelected}
                        onSelect={() => handleSelect(element.id)}
                        onDragEnd={(x, y) => handleDragEnd(element, x, y)}
                        onTransformEnd={(attrs) => handleTextTransformEnd(element, attrs)}
                      />
                    )
                  }

                  return null
                })}
            </Layer>

            {/* ── Layer 2: Trim layer — text stays within trim boundary, guides shown here ── */}
            <Layer
              clipX={BLEED_PX}
              clipY={BLEED_PX}
              clipWidth={CARD_WIDTH_PX}
              clipHeight={CARD_HEIGHT_PX}
            >
              {/* Trim/Cut Line */}
              <Rect
                x={BLEED_PX}
                y={BLEED_PX}
                width={CARD_WIDTH_PX}
                height={CARD_HEIGHT_PX}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={1}
                dash={[6, 4]}
                listening={false}
              />

              {/* Safe Area */}
              {showSafety && (
                <Rect
                  x={SAFE_AREA_X}
                  y={SAFE_AREA_Y}
                  width={SAFE_AREA_WIDTH}
                  height={SAFE_AREA_HEIGHT}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth={1}
                  dash={[6, 4]}
                  listening={false}
                />
              )}

              {/* Text elements */}
              {elements
                .filter((el) => el.visible !== false && el.type === 'text')
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((element) => {
                  const isSelected = element.id === selectedId
                  const isEditing = editingTextId === element.id
                  const TextComponent = useCanvaStyle ? CanvaStyleTextElement : ProfessionalTextElement

                  return (
                    <TextComponent
                      key={element.id}
                      element={element}
                      isSelected={isSelected}
                      isEditing={isEditing}
                      onSelect={() => handleSelect(element.id)}
                      onDragEnd={(x, y) => handleDragEnd(element, x, y)}
                      onTransformEnd={(attrs) => handleTextTransformEnd(element, attrs)}
                      onDoubleClick={() => handleTextDoubleClick(element.id)}
                    />
                  )
                })}
            </Layer>
          </Stage>

          {/* Canvas Text Editor Overlay */}
          {canvasTextEditorId && useCanvasTextEditor && !useVistaprintFloatingToolbar && (
            <CanvasTextEditor
              elementId={canvasTextEditorId}
              onClose={handleCloseTextEditor}
              displayScale={displayScale}
              canvasRef={containerRef}
            />
          )}

          {/* Vistaprint Floating Toolbar */}
          {vistaprintToolbarId && useVistaprintFloatingToolbar && (
            <VistaprintFloatingToolbar
              elementId={vistaprintToolbarId}
              onClose={handleCloseTextEditor}
              displayScale={displayScale}
              canvasRef={containerRef}
            />
          )}

          {/* Inline Text Editor Overlay */}
          {editingTextId && !useVistaprintEditor && !useAdvancedEditor && !useCanvasTextEditor && (
            <InlineTextEditor
              elementId={editingTextId}
              onClose={handleCloseTextEditor}
              displayScale={displayScale}
            />
          )}

          {/* Vistaprint Text Editor Overlay */}
          {vistaprintEditingId && useVistaprintEditor && !useAdvancedEditor && (
            <VistaprintTextEditor
              elementId={vistaprintEditingId}
              onClose={handleCloseTextEditor}
              displayScale={displayScale}
            />
          )}

          {/* Advanced Text Editor Overlay */}
          {advancedEditingId && useAdvancedEditor && (
            <AdvancedTextEditor
              elementId={advancedEditingId}
              onClose={handleCloseTextEditor}
              displayScale={displayScale}
            />
          )}
        </div>

        {/* Canva-style Toolbar + Quick Actions removed — TextEditPanel on right side handles all text editing */}

        {/* Image Editor Toolbar — removed */}

        {/* Floating Toolbar for Graphics — removed */}

        {/* Card Info */}
        <div className="absolute -bottom-8 left-0 right-0 text-center text-xs text-gray-500 font-mono">
          9cm × 5.2cm • 300 DPI Print-Ready
        </div>

        {/* Right-Click Context Menu */}
        {contextMenu.show && (
          <div
            className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 min-w-[220px] max-w-[280px] animate-in fade-in-0 zoom-in-95 duration-200"
            style={{
              left: contextMenu.x,
              top: contextMenu.y,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Canvas Background</h3>
              <p className="text-xs text-gray-500 mt-1">Choose a background for your card</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto py-2">
              {/* Gradients Section */}
              <div className="px-4 py-2">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Gradients</h4>
                <div className="space-y-1">
                  {backgroundOptions.filter(option => option.value.includes('gradient')).map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleBackgroundChange(option.value)}
                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-lg group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
                        style={{ background: option.value }}
                      />
                      <span className="text-gray-700 flex-1">{option.name.replace(' Gradient', '')}</span>
                      {background === option.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Solid Colors Section */}
              <div className="px-4 py-2 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Solid Colors</h4>
                <div className="space-y-1">
                  {backgroundOptions.filter(option => !option.value.includes('gradient')).map((option) => (
                    <button
                      key={option.name}
                      onClick={() => handleBackgroundChange(option.value)}
                      className="w-full px-3 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 rounded-lg group"
                    >
                      <div
                        className="w-8 h-8 rounded-lg border border-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow"
                        style={{ backgroundColor: option.value }}
                      />
                      <span className="text-gray-700 flex-1">{option.name}</span>
                      {background === option.value && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-[10px] font-mono">⌘</span>
                </div>
                Right-click canvas to change background
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Hint */}
      {showZoomHint && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium z-20">
          Hold Ctrl + Scroll to zoom
        </div>
      )}
      </div>
    </div>
  )
}
