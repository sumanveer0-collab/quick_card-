'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { fabric } from 'fabric'
import { useEditorStore } from '@/store/editor.store'
import { TextObjectData, FabricTextbox } from '@/types/fabric.types'
import TextToolbar from './TextToolbar'
import { generateId } from '@/lib/utils'

interface FabricTextEditorProps {
  width: number
  height: number
  backgroundColor?: string
  onTextObjectsChange?: (objects: TextObjectData[]) => void
}

export default function FabricTextEditor({ 
  width, 
  height, 
  backgroundColor = '#ffffff',
  onTextObjectsChange 
}: FabricTextEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [selectedText, setSelectedText] = useState<FabricTextbox | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [textObjects, setTextObjects] = useState<TextObjectData[]>([])

  // Get editor store functions
  const { addElement, updateElement, deleteElement, selectElement } = useEditorStore()

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    // Configure Fabric.js defaults for professional appearance
    fabric.Object.prototype.transparentCorners = false
    fabric.Object.prototype.cornerColor = '#2563eb'
    fabric.Object.prototype.cornerStyle = 'circle'
    fabric.Object.prototype.cornerSize = 10
    fabric.Object.prototype.borderColor = '#2563eb'
    fabric.Object.prototype.borderScaleFactor = 2
    fabric.Object.prototype.padding = 5

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor,
      selection: true,
      preserveObjectStacking: true,
      allowTouchScrolling: false,
      imageSmoothingEnabled: true,
      enableRetinaScaling: true,
    })

    fabricCanvasRef.current = canvas

    // Enhanced event listeners
    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', handleSelectionCleared)
    canvas.on('object:modified', handleObjectModified)
    canvas.on('object:moving', handleObjectMoving)
    canvas.on('object:scaling', handleObjectScaling)
    canvas.on('object:rotating', handleObjectRotating)
    canvas.on('text:changed', handleTextChanged)
    canvas.on('text:editing:entered', handleEditingEntered)
    canvas.on('text:editing:exited', handleEditingExited)
    canvas.on('mouse:dblclick', handleDoubleClick)

    return () => {
      canvas.dispose()
    }
  }, [width, height, backgroundColor])

  // Handle text selection
  const handleSelection = useCallback((e: fabric.IEvent) => {
    const activeObject = e.selected?.[0] || e.target
    if (activeObject && activeObject.type === 'textbox') {
      const textObj = activeObject as FabricTextbox
      setSelectedText(textObj)
      setIsEditing(false)
      
      // Sync with main editor store
      if (textObj.id) {
        selectElement(textObj.id)
      }
    }
  }, [selectElement])

  // Handle selection cleared
  const handleSelectionCleared = useCallback(() => {
    setSelectedText(null)
    setIsEditing(false)
    selectElement(null)
  }, [selectElement])

  // Handle object modification (resize, move, rotate)
  const handleObjectModified = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox' && obj.id) {
      autoResizeTextbox(obj)
      updateTextObjectData(obj)
      syncWithEditorStore(obj)
    }
  }, [])

  // Handle object moving
  const handleObjectMoving = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox') {
      // Keep object within canvas bounds
      const bound = obj.getBoundingRect()
      
      if (bound.left < 0) {
        obj.left = Math.max(obj.left, obj.left - bound.left)
      }
      if (bound.top < 0) {
        obj.top = Math.max(obj.top, obj.top - bound.top)
      }
      if (bound.left + bound.width > width) {
        obj.left = Math.min(obj.left, width - bound.width + obj.left - bound.left)
      }
      if (bound.top + bound.height > height) {
        obj.top = Math.min(obj.top, height - bound.height + obj.top - bound.top)
      }
    }
  }, [width, height])

  // Handle object scaling
  const handleObjectScaling = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox') {
      // Prevent text from becoming too small or too large
      const minScale = 0.1
      const maxScale = 5
      
      if (obj.scaleX! < minScale) obj.scaleX = minScale
      if (obj.scaleY! < minScale) obj.scaleY = minScale
      if (obj.scaleX! > maxScale) obj.scaleX = maxScale
      if (obj.scaleY! > maxScale) obj.scaleY = maxScale
    }
  }, [])

  // Handle object rotating
  const handleObjectRotating = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox') {
      // Snap to 15-degree increments when shift is held
      if (e.e && (e.e as KeyboardEvent).shiftKey) {
        obj.angle = Math.round((obj.angle || 0) / 15) * 15
      }
    }
  }, [])

  // Handle text content changes
  const handleTextChanged = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox' && obj.id) {
      autoResizeTextbox(obj)
      updateTextObjectData(obj)
      syncWithEditorStore(obj)
    }
  }, [])

  // Handle entering edit mode
  const handleEditingEntered = useCallback((e: fabric.IEvent) => {
    setIsEditing(true)
  }, [])

  // Handle exiting edit mode
  const handleEditingExited = useCallback((e: fabric.IEvent) => {
    setIsEditing(false)
    const obj = e.target as FabricTextbox
    if (obj && obj.id) {
      autoResizeTextbox(obj)
      updateTextObjectData(obj)
    }
  }, [])

  // Handle double click to enter edit mode
  const handleDoubleClick = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox') {
      obj.enterEditing()
      obj.selectAll()
      setIsEditing(true)
      setSelectedText(obj)
    }
  }, [])

  // Auto resize textbox to prevent text clipping - CRITICAL FEATURE
  const autoResizeTextbox = useCallback((textbox: FabricTextbox) => {
    if (!textbox || textbox.type !== 'textbox') return

    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Force text measurement update
    textbox._clearCache()
    textbox.initDimensions()

    // Get actual text dimensions
    const textLines = textbox._textLines || []
    const lineHeight = textbox.getHeightOfLine(0)
    const totalHeight = textLines.length * lineHeight * (textbox.lineHeight || 1.16)
    
    // Calculate maximum line width
    let maxLineWidth = 0
    textLines.forEach((line: any, index: number) => {
      const lineWidth = textbox.getLineWidth(index)
      maxLineWidth = Math.max(maxLineWidth, lineWidth)
    })

    // Add padding to prevent clipping
    const padding = 20
    const minWidth = 50
    const minHeight = 30
    
    const newWidth = Math.max(maxLineWidth + padding, minWidth)
    const newHeight = Math.max(totalHeight + padding, minHeight)

    // Only update if dimensions changed significantly
    const widthDiff = Math.abs((textbox.width || 0) - newWidth)
    const heightDiff = Math.abs((textbox.height || 0) - newHeight)
    
    if (widthDiff > 5 || heightDiff > 5) {
      textbox.set({
        width: newWidth,
        height: newHeight
      })
      
      // Ensure text stays within canvas bounds after resize
      const bound = textbox.getBoundingRect()
      if (bound.left + bound.width > width) {
        textbox.left = width - bound.width
      }
      if (bound.top + bound.height > height) {
        textbox.top = height - bound.height
      }
      
      canvas.renderAll()
    }
  }, [width, height])

  // Update text object data in state
  const updateTextObjectData = useCallback((textbox: FabricTextbox) => {
    if (!textbox.id) return

    const textData: TextObjectData = {
      id: textbox.id,
      text: textbox.text || '',
      fontFamily: textbox.fontFamily || 'Arial',
      fontSize: textbox.fontSize || 16,
      fontWeight: textbox.fontWeight || 'normal',
      fontStyle: textbox.fontStyle || 'normal',
      underline: textbox.underline || false,
      fill: textbox.fill as string || '#000000',
      textAlign: textbox.textAlign || 'left',
      charSpacing: textbox.charSpacing || 0,
      lineHeight: textbox.lineHeight || 1.16,
      angle: textbox.angle || 0,
      opacity: textbox.opacity || 1,
      width: textbox.width || 200,
      height: textbox.height || 50,
      left: textbox.left || 0,
      top: textbox.top || 0,
      editable: true,
      lockScalingFlip: true,
      scaleX: textbox.scaleX || 1,
      scaleY: textbox.scaleY || 1
    }

    setTextObjects(prev => {
      const updated = prev.map(obj => obj.id === textData.id ? textData : obj)
      if (!prev.find(obj => obj.id === textData.id)) {
        updated.push(textData)
      }
      onTextObjectsChange?.(updated)
      return updated
    })
  }, [onTextObjectsChange])

  // Sync with main editor store
  const syncWithEditorStore = useCallback((textbox: FabricTextbox) => {
    if (!textbox.id) return

    const elementData = {
      type: 'text' as const,
      text: textbox.text || '',
      x: textbox.left || 0,
      y: textbox.top || 0,
      width: textbox.width || 200,
      height: textbox.height || 50,
      fontSize: textbox.fontSize || 16,
      fontFamily: textbox.fontFamily || 'Arial',
      fontWeight: textbox.fontWeight || 'normal',
      fill: textbox.fill as string || '#000000',
      align: textbox.textAlign || 'left',
      rotation: textbox.angle || 0,
      visible: true,
      locked: false,
    }

    updateElement(textbox.id, elementData)
  }, [updateElement])

  // Add new text to canvas
  const addTextToCanvas = useCallback((textData?: Partial<TextObjectData>) => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const id = textData?.id || generateId()
    
    const textbox = new fabric.Textbox(textData?.text || 'Add your text', {
      left: textData?.left || 100,
      top: textData?.top || 100,
      width: textData?.width || 200,
      height: textData?.height || 50,
      fontFamily: textData?.fontFamily || 'Arial',
      fontSize: textData?.fontSize || 18,
      fontWeight: textData?.fontWeight || 'normal',
      fontStyle: textData?.fontStyle || 'normal',
      underline: textData?.underline || false,
      fill: textData?.fill || '#000000',
      textAlign: textData?.textAlign || 'left',
      charSpacing: textData?.charSpacing || 0,
      lineHeight: textData?.lineHeight || 1.16,
      angle: textData?.angle || 0,
      opacity: textData?.opacity || 1,
      editable: true,
      lockScalingFlip: true,
      splitByGrapheme: true,
      padding: 10,
      borderColor: '#2563eb',
      cornerColor: '#2563eb',
      cornerStyle: 'circle',
      cornerSize: 10,
      transparentCorners: false,
      hasRotatingPoint: true,
      centeredRotation: true,
      centeredScaling: false,
    }) as FabricTextbox

    textbox.id = id
    textbox.customData = textData as TextObjectData

    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()

    // Auto resize after adding
    setTimeout(() => {
      autoResizeTextbox(textbox)
      updateTextObjectData(textbox)
      syncWithEditorStore(textbox)
    }, 100)

    return textbox
  }, [autoResizeTextbox, updateTextObjectData, syncWithEditorStore])

  // Update selected text properties
  const updateSelectedText = useCallback((properties: Partial<TextObjectData>) => {
    if (!selectedText || !fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    
    // Update textbox properties
    selectedText.set(properties as any)
    
    // Handle font size changes - trigger auto resize
    if (properties.fontSize || properties.fontFamily || properties.fontWeight || properties.fontStyle) {
      setTimeout(() => autoResizeTextbox(selectedText), 50)
    }
    
    canvas.renderAll()
    updateTextObjectData(selectedText)
    syncWithEditorStore(selectedText)
  }, [selectedText, autoResizeTextbox, updateTextObjectData, syncWithEditorStore])

  // Duplicate selected text
  const duplicateSelectedText = useCallback(() => {
    if (!selectedText || !fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    
    selectedText.clone((cloned: FabricTextbox) => {
      cloned.id = generateId()
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      })
      
      canvas.add(cloned)
      canvas.setActiveObject(cloned)
      canvas.renderAll()
      
      updateTextObjectData(cloned)
      syncWithEditorStore(cloned)
    })
  }, [selectedText, updateTextObjectData, syncWithEditorStore])

  // Delete selected text
  const deleteSelectedText = useCallback(() => {
    if (!selectedText || !fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    canvas.remove(selectedText)
    canvas.renderAll()
    
    if (selectedText.id) {
      deleteElement(selectedText.id)
    }
    
    setTextObjects(prev => prev.filter(obj => obj.id !== selectedText.id))
    setSelectedText(null)
  }, [selectedText, deleteElement])

  // Bring forward
  const bringForward = useCallback(() => {
    if (!selectedText || !fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    canvas.bringForward(selectedText)
    canvas.renderAll()
  }, [selectedText])

  // Send backward
  const sendBackward = useCallback(() => {
    if (!selectedText || !fabricCanvasRef.current) return
    
    const canvas = fabricCanvasRef.current
    canvas.sendBackwards(selectedText)
    canvas.renderAll()
  }, [selectedText])

  // Add new text button handler
  const handleAddText = useCallback(() => {
    const textbox = addTextToCanvas({
      text: 'New Text',
      left: Math.random() * (width - 200),
      top: Math.random() * (height - 100),
      fontSize: 18,
    })
    
    if (textbox) {
      // Enter edit mode immediately
      setTimeout(() => {
        textbox.enterEditing()
        textbox.selectAll()
        setIsEditing(true)
      }, 150)
    }
  }, [addTextToCanvas, width, height])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedText) return

      // ESC to exit editing
      if (e.key === 'Escape' && isEditing) {
        selectedText.exitEditing()
        setIsEditing(false)
        return
      }

      // Prevent shortcuts during editing
      if (isEditing) return

      // Delete key
      if (e.key === 'Delete') {
        e.preventDefault()
        deleteSelectedText()
        return
      }

      // Ctrl+D to duplicate
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        duplicateSelectedText()
        return
      }

      // Ctrl+B for bold
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault()
        const isBold = selectedText.fontWeight === 'bold'
        updateSelectedText({ fontWeight: isBold ? 'normal' : 'bold' })
        return
      }

      // Ctrl+I for italic
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault()
        const isItalic = selectedText.fontStyle === 'italic'
        updateSelectedText({ fontStyle: isItalic ? 'normal' : 'italic' })
        return
      }

      // Ctrl+U for underline
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault()
        updateSelectedText({ underline: !selectedText.underline })
        return
      }

      // Arrow keys for fine positioning
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const step = e.shiftKey ? 10 : 1
        const left = selectedText.left || 0
        const top = selectedText.top || 0
        
        switch (e.key) {
          case 'ArrowUp':
            updateSelectedText({ top: Math.max(0, top - step) })
            break
          case 'ArrowDown':
            updateSelectedText({ top: Math.min(height - (selectedText.height || 0), top + step) })
            break
          case 'ArrowLeft':
            updateSelectedText({ left: Math.max(0, left - step) })
            break
          case 'ArrowRight':
            updateSelectedText({ left: Math.min(width - (selectedText.width || 0), left + step) })
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedText, isEditing, deleteSelectedText, duplicateSelectedText, updateSelectedText, width, height])

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="block mx-auto shadow-lg"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />

      {/* Add Text Button */}
      <button
        onClick={handleAddText}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2"
      >
        <span className="text-lg">+</span>
        Add Text
      </button>

      {/* Text Toolbar */}
      {selectedText && !isEditing && (
        <TextToolbar
          selectedText={selectedText}
          onUpdate={updateSelectedText}
          onDuplicate={duplicateSelectedText}
          onDelete={deleteSelectedText}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
        />
      )}

      {/* Editing Indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          Editing Mode - Press ESC to exit
        </div>
      )}
    </div>
  )
}