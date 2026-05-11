'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { fabric } from 'fabric'
import { TextObjectData, FabricTextbox, CanvasEditorProps } from '@/types/fabric.types'
import TextToolbar from './TextToolbar'
import { generateId } from '@/lib/utils'

// Configure Fabric.js defaults
fabric.Object.prototype.transparentCorners = false
fabric.Object.prototype.cornerColor = '#2563eb'
fabric.Object.prototype.cornerStyle = 'circle'
fabric.Object.prototype.cornerSize = 8
fabric.Object.prototype.borderColor = '#2563eb'
fabric.Object.prototype.borderScaleFactor = 2

export default function CanvasEditor({ 
  width, 
  height, 
  onTextChange,
  initialTexts = []
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [selectedText, setSelectedText] = useState<FabricTextbox | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [textObjects, setTextObjects] = useState<TextObjectData[]>([])

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    })

    fabricCanvasRef.current = canvas

    // Load initial texts
    initialTexts.forEach(textData => {
      addTextToCanvas(textData)
    })

    // Canvas event listeners
    canvas.on('selection:created', handleSelection)
    canvas.on('selection:updated', handleSelection)
    canvas.on('selection:cleared', handleSelectionCleared)
    canvas.on('object:modified', handleObjectModified)
    canvas.on('text:changed', handleTextChanged)
    canvas.on('mouse:down', handleSingleClick)
    canvas.on('mouse:dblclick', handleDoubleClick)

    // Enhanced text editing behavior
    canvas.on('text:editing:entered', () => setIsEditing(true))
    canvas.on('text:editing:exited', () => setIsEditing(false))

    return () => {
      canvas.dispose()
    }
  }, [width, height])

  // Handle text selection
  const handleSelection = useCallback((e: fabric.IEvent) => {
    const activeObject = e.selected?.[0] || e.target
    if (activeObject && activeObject.type === 'textbox') {
      setSelectedText(activeObject as FabricTextbox)
      setIsEditing(false)
    }
  }, [])

  // Handle selection cleared
  const handleSelectionCleared = useCallback(() => {
    setSelectedText(null)
    setIsEditing(false)
  }, [])

  // Handle object modification (resize, move, rotate)
  const handleObjectModified = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox' && obj.id) {
      updateTextObjectData(obj)
      autoResizeTextbox(obj)
    }
  }, [])

  // Handle text content changes
  const handleTextChanged = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox' && obj.id) {
      updateTextObjectData(obj)
      autoResizeTextbox(obj)
    }
  }, [])

  // Handle single click to enter edit mode (one-click editing)
  const handleSingleClick = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox') {
      // If already selected and clicked again, enter edit mode
      if (selectedText === obj && !isEditing) {
        obj.enterEditing()
        setIsEditing(true)
      }
    }
  }, [selectedText, isEditing])

  // Handle double click to enter edit mode (fallback)
  const handleDoubleClick = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox') {
      obj.enterEditing()
      setIsEditing(true)
      setSelectedText(obj)
    }
  }, [])

  // Enhanced auto resize textbox to prevent text clipping
  const autoResizeTextbox = useCallback((textbox: FabricTextbox) => {
    if (!textbox || textbox.type !== 'textbox') return

    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Get text metrics
    const text = textbox.text || ''
    if (!text.trim()) return

    // Calculate required dimensions more accurately
    const textLines = text.split('\n')
    const ctx = canvas.getContext('2d')
    
    // Set font for accurate measurement
    ctx.font = `${textbox.fontStyle} ${textbox.fontWeight} ${textbox.fontSize}px ${textbox.fontFamily}`
    
    // Calculate max line width
    let maxLineWidth = 0
    textLines.forEach(line => {
      const lineWidth = ctx.measureText(line || ' ').width
      maxLineWidth = Math.max(maxLineWidth, lineWidth)
    })
    
    // Calculate height
    const lineHeight = textbox.fontSize! * (textbox.lineHeight || 1.16)
    const totalHeight = textLines.length * lineHeight
    
    // Add padding for better visual appearance
    const horizontalPadding = 20
    const verticalPadding = 10
    
    const newWidth = Math.max(maxLineWidth + horizontalPadding, 60)
    const newHeight = Math.max(totalHeight + verticalPadding, 30)

    // Only update if there's a significant change to avoid constant re-rendering
    const widthDiff = Math.abs((textbox.width || 0) - newWidth)
    const heightDiff = Math.abs((textbox.height || 0) - newHeight)
    
    if (widthDiff > 10 || heightDiff > 5) {
      textbox.set({
        width: newWidth,
        height: newHeight
      })
      
      // Ensure text stays within canvas bounds
      const canvasWidth = canvas.width || 800
      const canvasHeight = canvas.height || 600
      
      // Adjust position if text goes outside canvas
      let newLeft = textbox.left || 0
      let newTop = textbox.top || 0
      
      if (newLeft + newWidth > canvasWidth) {
        newLeft = canvasWidth - newWidth - 10
      }
      if (newTop + newHeight > canvasHeight) {
        newTop = canvasHeight - newHeight - 10
      }
      
      if (newLeft !== textbox.left || newTop !== textbox.top) {
        textbox.set({ left: Math.max(0, newLeft), top: Math.max(0, newTop) })
      }
      
      canvas.renderAll()
    }
  }, [])

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
      return updated
    })

    onTextChange?.(textObjects)
  }, [textObjects, onTextChange])

  // Add new text to canvas with enhanced controls
  const addTextToCanvas = useCallback((textData?: Partial<TextObjectData>) => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const id = textData?.id || generateId()
    
    const textbox = new fabric.Textbox(textData?.text || 'Click to edit text', {
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
      padding: 8,
      borderColor: '#2563eb',
      cornerColor: '#2563eb',
      cornerStyle: 'circle',
      cornerSize: 10,
      transparentCorners: false,
      hasRotatingPoint: true,
      // Enhanced move and resize controls
      lockUniScaling: false,
      centeredScaling: false,
      centeredRotation: true,
      // Better visual feedback
      borderDashArray: [5, 5],
      borderOpacityWhenMoving: 0.8,
    }) as FabricTextbox

    textbox.id = id
    textbox.customData = textData as TextObjectData

    // Enhanced controls for better UX
    textbox.setControlsVisibility({
      mt: true, // middle top
      mb: true, // middle bottom
      ml: true, // middle left
      mr: true, // middle right
      bl: true, // bottom left
      br: true, // bottom right
      tl: true, // top left
      tr: true, // top right
      mtr: true, // middle top rotate
    })

    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()

    // Auto resize after adding with a slight delay
    setTimeout(() => autoResizeTextbox(textbox), 150)

    return textbox
  }, [autoResizeTextbox])

  // Update selected text properties
  const updateSelectedText = useCallback((properties: Partial<TextObjectData>) => {
    if (!selectedText || !fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    
    // Update textbox properties
    selectedText.set(properties as any)
    
    // Handle font size changes - trigger auto resize
    if (properties.fontSize) {
      setTimeout(() => autoResizeTextbox(selectedText), 50)
    }
    
    canvas.renderAll()
    updateTextObjectData(selectedText)
  }, [selectedText, autoResizeTextbox, updateTextObjectData])

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
    })
  }, [selectedText, updateTextObjectData])

  // Delete selected text
  const deleteSelectedText = useCallback(() => {
    if (!selectedText || !fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    canvas.remove(selectedText)
    canvas.renderAll()
    
    setTextObjects(prev => prev.filter(obj => obj.id !== selectedText.id))
    setSelectedText(null)
  }, [selectedText])

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

  // Enhanced add new text button handler
  const handleAddText = useCallback(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Calculate a good position for new text
    const canvasWidth = canvas.width || 800
    const canvasHeight = canvas.height || 600
    
    // Try to place text in a free area
    const existingTexts = textObjects
    let left = 50
    let top = 50
    
    // Simple algorithm to avoid overlapping
    for (let i = 0; i < existingTexts.length; i++) {
      const existing = existingTexts[i]
      if (Math.abs(left - existing.left) < 100 && Math.abs(top - existing.top) < 50) {
        left += 120
        if (left > canvasWidth - 200) {
          left = 50
          top += 80
        }
      }
    }
    
    const textbox = addTextToCanvas({
      text: 'Click to edit',
      left: Math.min(left, canvasWidth - 200),
      top: Math.min(top, canvasHeight - 100),
      fontSize: 18,
    })
    
    if (textbox) {
      // Enter edit mode immediately after a short delay
      setTimeout(() => {
        textbox.enterEditing()
        setIsEditing(true)
      }, 200)
    }
  }, [addTextToCanvas, textObjects])

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedText) return

      // ESC to exit editing
      if (e.key === 'Escape' && isEditing) {
        selectedText.exitEditing()
        setIsEditing(false)
        return
      }

      // Enter to start editing if not already editing
      if (e.key === 'Enter' && !isEditing) {
        e.preventDefault()
        selectedText.enterEditing()
        setIsEditing(true)
        return
      }

      // Delete key
      if (e.key === 'Delete' && !isEditing) {
        e.preventDefault()
        deleteSelectedText()
        return
      }

      // Ctrl+D to duplicate
      if (e.ctrlKey && e.key === 'd' && !isEditing) {
        e.preventDefault()
        duplicateSelectedText()
        return
      }

      // Arrow keys for precise movement (when not editing)
      if (!isEditing && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        const moveDistance = e.shiftKey ? 10 : 1
        const currentLeft = selectedText.left || 0
        const currentTop = selectedText.top || 0
        
        let newLeft = currentLeft
        let newTop = currentTop
        
        switch (e.key) {
          case 'ArrowUp':
            newTop = Math.max(0, currentTop - moveDistance)
            break
          case 'ArrowDown':
            newTop = currentTop + moveDistance
            break
          case 'ArrowLeft':
            newLeft = Math.max(0, currentLeft - moveDistance)
            break
          case 'ArrowRight':
            newLeft = currentLeft + moveDistance
            break
        }
        
        selectedText.set({ left: newLeft, top: newTop })
        fabricCanvasRef.current?.renderAll()
        updateTextObjectData(selectedText)
        return
      }

      // Ctrl+B for bold
      if (e.ctrlKey && e.key === 'b' && !isEditing) {
        e.preventDefault()
        const isBold = selectedText.fontWeight === 'bold'
        updateSelectedText({ fontWeight: isBold ? 'normal' : 'bold' })
        return
      }

      // Ctrl+I for italic
      if (e.ctrlKey && e.key === 'i' && !isEditing) {
        e.preventDefault()
        const isItalic = selectedText.fontStyle === 'italic'
        updateSelectedText({ fontStyle: isItalic ? 'normal' : 'italic' })
        return
      }

      // Ctrl+U for underline
      if (e.ctrlKey && e.key === 'u' && !isEditing) {
        e.preventDefault()
        updateSelectedText({ underline: !selectedText.underline })
        return
      }

      // Ctrl + Plus/Minus for font size
      if (e.ctrlKey && (e.key === '=' || e.key === '+') && !isEditing) {
        e.preventDefault()
        const currentSize = selectedText.fontSize || 16
        updateSelectedText({ fontSize: Math.min(200, currentSize + 2) })
        return
      }

      if (e.ctrlKey && e.key === '-' && !isEditing) {
        e.preventDefault()
        const currentSize = selectedText.fontSize || 16
        updateSelectedText({ fontSize: Math.max(8, currentSize - 2) })
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedText, isEditing, deleteSelectedText, duplicateSelectedText, updateSelectedText, updateTextObjectData])

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-lg cursor-crosshair"
      />

      {/* Enhanced Add Text Button */}
      <button
        onClick={handleAddText}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Text
      </button>

      {/* Quick Help */}
      {selectedText && !isEditing && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white text-xs px-3 py-2 rounded-lg">
          <div>Click again to edit • Arrow keys to move • Del to delete</div>
          <div>Ctrl+B Bold • Ctrl+I Italic • Ctrl+D Duplicate</div>
        </div>
      )}

      {/* Editing Indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-green-600 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          Editing Text - Press ESC to finish
        </div>
      )}

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
    </div>
  )
}