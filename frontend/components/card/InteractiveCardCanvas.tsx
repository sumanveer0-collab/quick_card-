'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Stage, Layer, Text, Transformer } from 'react-konva'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Plus, Minus, Copy, Trash2, X
} from 'lucide-react'
import Konva from 'konva'

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  width: number
  height: number
  fontSize: number
  fontFamily: string
  fontWeight: string
  fontStyle: string
  fill: string
  align: string
  rotation: number
  draggable: boolean
}

interface InteractiveCardCanvasProps {
  card: any
  layout: any
  onSave?: (elements: TextElement[]) => void
}

export default function InteractiveCardCanvas({ card, layout, onSave }: InteractiveCardCanvasProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [textElements, setTextElements] = useState<TextElement[]>([])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [showToolbar, setShowToolbar] = useState(false)
  const [editingText, setEditingText] = useState('')
  const [stageSize, setStageSize] = useState({ width: 400, height: 240 })
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Initialize default text elements from card data
  useEffect(() => {
    const defaultElements: TextElement[] = [
      {
        id: 'business-name',
        text: card.businessName || 'Business Name',
        x: 24,
        y: 20,
        width: 300,
        height: 40,
        fontSize: 24,
        fontFamily: layout.fontFamily || 'Inter',
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: layout.primaryColor || '#ffffff',
        align: 'left',
        rotation: 0,
        draggable: true
      },
      {
        id: 'tagline',
        text: card.tagline || 'Your tagline here',
        x: 24,
        y: 65,
        width: 300,
        height: 20,
        fontSize: 14,
        fontFamily: layout.fontFamily || 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: layout.primaryColor || '#ffffff',
        align: 'left',
        rotation: 0,
        draggable: true
      },
      {
        id: 'name',
        text: card.name || 'Your Name',
        x: 24,
        y: 100,
        width: 200,
        height: 25,
        fontSize: 16,
        fontFamily: layout.fontFamily || 'Inter',
        fontWeight: '500',
        fontStyle: 'normal',
        fill: layout.primaryColor || '#ffffff',
        align: 'left',
        rotation: 0,
        draggable: true
      },
      {
        id: 'phone',
        text: `📞 ${card.phone || '+1 (555) 123-4567'}`,
        x: 24,
        y: 135,
        width: 200,
        height: 20,
        fontSize: 12,
        fontFamily: layout.fontFamily || 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: layout.primaryColor || '#ffffff',
        align: 'left',
        rotation: 0,
        draggable: true
      },
      {
        id: 'email',
        text: `✉ ${card.email || 'email@example.com'}`,
        x: 24,
        y: 155,
        width: 200,
        height: 20,
        fontSize: 12,
        fontFamily: layout.fontFamily || 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: layout.primaryColor || '#ffffff',
        align: 'left',
        rotation: 0,
        draggable: true
      }
    ]

    if (card.website) {
      defaultElements.push({
        id: 'website',
        text: `🌐 ${card.website}`,
        x: 24,
        y: 175,
        width: 200,
        height: 20,
        fontSize: 12,
        fontFamily: layout.fontFamily || 'Inter',
        fontWeight: 'normal',
        fontStyle: 'normal',
        fill: layout.primaryColor || '#ffffff',
        align: 'left',
        rotation: 0,
        draggable: true
      })
    }

    setTextElements(defaultElements)
  }, [card, layout])

  // Update stage size based on container
  const updateStageSize = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const aspectRatio = 1.75 // Standard business card ratio
      setStageSize({
        width: containerWidth,
        height: containerWidth / aspectRatio
      })
    }
  }, [])

  useEffect(() => {
    updateStageSize()
    window.addEventListener('resize', updateStageSize)
    return () => window.removeEventListener('resize', updateStageSize)
  }, [updateStageSize])

  // Handle element selection
  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
    setShowToolbar(true)
    setIsEditing(null)
    setShowColorPicker(false)
    
    // Update transformer
    setTimeout(() => {
      const transformer = transformerRef.current
      const stage = stageRef.current
      if (transformer && stage) {
        const selectedNode = stage.findOne(`#${id}`)
        if (selectedNode) {
          transformer.nodes([selectedNode])
          transformer.getLayer()?.batchDraw()
        }
      }
    }, 10)
  }, [])

  // Handle deselection
  const handleDeselect = useCallback(() => {
    setSelectedId(null)
    setShowToolbar(false)
    setIsEditing(null)
    setShowColorPicker(false)
    
    const transformer = transformerRef.current
    if (transformer) {
      transformer.nodes([])
      transformer.getLayer()?.batchDraw()
    }
  }, [])

  // Handle text double click for editing
  const handleTextDoubleClick = useCallback((id: string) => {
    const element = textElements.find(el => el.id === id)
    if (element) {
      setIsEditing(id)
      setEditingText(element.text)
      setSelectedId(id)
      setShowToolbar(false)
      setShowColorPicker(false)
    }
  }, [textElements])

  // Update text element
  const updateElement = useCallback((id: string, updates: Partial<TextElement>) => {
    setTextElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...updates } : el)
    )
  }, [])

  // Handle text change
  const handleTextChange = useCallback((newText: string) => {
    if (isEditing) {
      updateElement(isEditing, { text: newText })
      setEditingText(newText)
    }
  }, [isEditing, updateElement])

  // Handle text editing finish
  const finishEditing = useCallback(() => {
    setIsEditing(null)
    setEditingText('')
    if (selectedId) {
      setShowToolbar(true)
    }
  }, [selectedId])

  // Handle drag end
  const handleDragEnd = useCallback((id: string, e: any) => {
    updateElement(id, {
      x: e.target.x(),
      y: e.target.y()
    })
  }, [updateElement])

  // Handle transform end
  const handleTransformEnd = useCallback((id: string, e: any) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()
    
    // Reset scale and apply to dimensions
    node.scaleX(1)
    node.scaleY(1)
    
    updateElement(id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(20, node.width() * scaleX),
      height: Math.max(10, node.height() * scaleY),
      rotation: node.rotation()
    })
  }, [updateElement])

  // Duplicate element
  const duplicateElement = useCallback(() => {
    if (!selectedId) return
    
    const element = textElements.find(el => el.id === selectedId)
    if (element) {
      const newElement = {
        ...element,
        id: `${element.id}-copy-${Date.now()}`,
        x: element.x + 20,
        y: element.y + 20
      }
      setTextElements(prev => [...prev, newElement])
      handleSelect(newElement.id)
    }
  }, [selectedId, textElements, handleSelect])

  // Delete element
  const deleteElement = useCallback(() => {
    if (!selectedId) return
    
    setTextElements(prev => prev.filter(el => el.id !== selectedId))
    handleDeselect()
  }, [selectedId, handleDeselect])

  // Add new text element
  const addTextElement = useCallback(() => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      text: 'New Text',
      x: 50,
      y: 50,
      width: 150,
      height: 30,
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fill: layout.primaryColor || '#ffffff',
      align: 'left',
      rotation: 0,
      draggable: true
    }
    
    setTextElements(prev => [...prev, newElement])
    handleSelect(newElement.id)
  }, [layout.primaryColor, handleSelect])

  // Get selected element
  const selectedElement = textElements.find(el => el.id === selectedId)

  const fontSizeOptions = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48]

  const colorPresets = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#C0C0C0', '#808080'
  ]

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) return
      
      if (e.key === 'Delete' && selectedId) {
        deleteElement()
      }
      if (e.key === 'Escape') {
        handleDeselect()
      }
      if (e.ctrlKey && e.key === 'd' && selectedId) {
        e.preventDefault()
        duplicateElement()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditing, selectedId, deleteElement, handleDeselect, duplicateElement])

  return (
    <div className="relative" ref={containerRef}>
      {/* Canvas Container */}
      <div 
        className="rounded-2xl overflow-hidden relative shadow-lg cursor-pointer"
        style={{ 
          background: layout.background || '#1d4ed8',
          aspectRatio: '1.75'
        }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={(e) => {
            // Deselect when clicking on empty area
            const clickedOnEmpty = e.target === e.target.getStage()
            if (clickedOnEmpty) {
              handleDeselect()
            }
          }}
          onTouchStart={(e) => {
            // Handle touch for mobile
            const clickedOnEmpty = e.target === e.target.getStage()
            if (clickedOnEmpty) {
              handleDeselect()
            }
          }}
        >
          <Layer>
            {/* Render text elements */}
            {textElements.map((element) => (
              <Text
                key={element.id}
                id={element.id}
                text={element.text}
                x={element.x}
                y={element.y}
                width={element.width}
                fontSize={element.fontSize}
                fontFamily={element.fontFamily}
                fontStyle={element.fontWeight === 'bold' ? 'bold' : element.fontStyle}
                fill={element.fill}
                align={element.align as any}
                rotation={element.rotation}
                draggable={element.draggable && !isEditing}
                onClick={() => !isEditing && handleSelect(element.id)}
                onTap={() => !isEditing && handleSelect(element.id)}
                onDblClick={() => handleTextDoubleClick(element.id)}
                onDblTap={() => handleTextDoubleClick(element.id)}
                onDragEnd={(e) => handleDragEnd(element.id, e)}
                onTransformEnd={(e) => handleTransformEnd(element.id, e)}
                // Visual feedback for selection
                stroke={selectedId === element.id && !isEditing ? '#4F46E5' : undefined}
                strokeWidth={selectedId === element.id && !isEditing ? 1 : 0}
                dash={selectedId === element.id && !isEditing ? [5, 5] : undefined}
                // Better touch handling
                hitStrokeWidth={10}
              />
            ))}
            
            {/* Transformer for selected element */}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit resize
                if (newBox.width < 20 || newBox.height < 10) {
                  return oldBox
                }
                return newBox
              }}
              enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
              rotateEnabled={true}
              borderStroke="#4F46E5"
              borderStrokeWidth={2}
              anchorStroke="#4F46E5"
              anchorFill="#FFFFFF"
              anchorSize={8}
              rotateAnchorOffset={20}
              visible={!!selectedId && !isEditing}
            />
          </Layer>
        </Stage>

        {/* QR Code */}
        {card.qrCodeUrl && (
          <div className="absolute top-3 right-3 w-12 h-12 bg-white rounded-lg overflow-hidden">
            <img src={card.qrCodeUrl} alt="QR" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Watermark */}
        {card.hasWatermark && (
          <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full">
            Made with QuickCard
          </div>
        )}
      </div>

      {/* Floating Toolbar */}
      <AnimatePresence>
        {showToolbar && selectedElement && !isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl border border-gray-200 p-2 z-50 max-w-full overflow-x-auto"
          >
            <div className="flex items-center gap-1 flex-nowrap">
              {/* Font Size */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => updateElement(selectedId!, { fontSize: Math.max(8, selectedElement.fontSize - 2) })}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                
                <select
                  value={selectedElement.fontSize}
                  onChange={(e) => updateElement(selectedId!, { fontSize: parseInt(e.target.value) })}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[50px]"
                >
                  {fontSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                
                <button
                  onClick={() => updateElement(selectedId!, { fontSize: Math.min(72, selectedElement.fontSize + 2) })}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Text Formatting */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => updateElement(selectedId!, { 
                    fontWeight: selectedElement.fontWeight === 'bold' ? 'normal' : 'bold' 
                  })}
                  className={`p-2 rounded transition-colors ${
                    selectedElement.fontWeight === 'bold' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Bold className="w-4 h-4" />
                </button>

                <button
                  onClick={() => updateElement(selectedId!, { 
                    fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' 
                  })}
                  className={`p-2 rounded transition-colors ${
                    selectedElement.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Italic className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Text Alignment */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => updateElement(selectedId!, { align: 'left' })}
                  className={`p-2 rounded transition-colors ${
                    selectedElement.align === 'left' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => updateElement(selectedId!, { align: 'center' })}
                  className={`p-2 rounded transition-colors ${
                    selectedElement.align === 'center' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => updateElement(selectedId!, { align: 'right' })}
                  className={`p-2 rounded transition-colors ${
                    selectedElement.align === 'right' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Color Picker */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded transition-colors"
                >
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: selectedElement.fill }}
                  />
                </button>
                
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-50 w-48">
                    <div className="grid grid-cols-8 gap-1 mb-2">
                      {colorPresets.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            updateElement(selectedId!, { fill: color })
                            setShowColorPicker(false)
                          }}
                          className={`w-5 h-5 rounded border-2 transition-all hover:scale-110 ${
                            selectedElement.fill === color ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <input
                      type="color"
                      value={selectedElement.fill}
                      onChange={(e) => updateElement(selectedId!, { fill: e.target.value })}
                      className="w-full h-6 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="w-px h-6 bg-gray-300" />

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={duplicateElement}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  onClick={deleteElement}
                  className="p-2 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Editing Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={finishEditing}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Text</h3>
                <button
                  onClick={finishEditing}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <textarea
                value={editingText}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your text..."
                autoFocus
              />
              
              <div className="flex gap-2 mt-4">
                <button
                  onClick={finishEditing}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
                <button
                  onClick={finishEditing}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Text Button */}
      <button
        onClick={addTextElement}
        className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-lg"
      >
        <Plus className="w-4 h-4" />
        Add Text
      </button>

      {/* Instructions */}
      <div className="absolute -bottom-20 left-0 right-0 text-center text-xs text-gray-500">
        Click to select • Double-click to edit • Drag to move • Drag corners to resize
      </div>
    </div>
  )
}