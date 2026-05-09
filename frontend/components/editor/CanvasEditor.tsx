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
    canvas.on('mouse:dblclick', handleDoubleClick)

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

  // Handle double click to enter edit mode
  const handleDoubleClick = useCallback((e: fabric.IEvent) => {
    const obj = e.target as FabricTextbox
    if (obj && obj.type === 'textbox') {
      obj.enterEditing()
      setIsEditing(true)
      setSelectedText(obj)
    }
  }, [])

  // Auto resize textbox to prevent text clipping
  const autoResizeTextbox = useCallback((textbox: FabricTextbox) => {
    if (!textbox || textbox.type !== 'textbox') return

    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Calculate required dimensions
    const textLines = textbox.text?.split('\n') || ['']
    const maxLineWidth = Math.max(...textLines.map(line => 
      textbox.measureText(line || ' ').width
    ))
    
    const lineHeight = textbox.getHeightOfLine(0)
    const totalHeight = textLines.length * lineHeight * (textbox.lineHeight || 1.16)
    
    // Add padding
    const padding = 10
    const newWidth = Math.max(maxLineWidth + padding, 50)
    const newHeight = Math.max(totalHeight + padding, 30)

    // Update dimensions if needed
    if (Math.abs(textbox.width! - newWidth) > 5 || Math.abs(textbox.height! - newHeight) > 5) {
      textbox.set({
        width: newWidth,
        height: newHeight
      })
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
      fontSize: textData?.fontSize || 16,
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
      padding: 5,
      borderColor: '#2563eb',
      cornerColor: '#2563eb',
      cornerStyle: 'circle',
      cornerSize: 8,
      transparentCorners: false,
      hasRotatingPoint: true,
    }) as FabricTextbox

    textbox.id = id
    textbox.customData = textData as TextObjectData

    canvas.add(textbox)
    canvas.setActiveObject(textbox)
    canvas.renderAll()

    // Auto resize after adding
    setTimeout(() => autoResizeTextbox(textbox), 100)

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

  // Add new text button handler
  const handleAddText = useCallback(() => {
    const textbox = addTextToCanvas({
      text: 'New Text',
      left: Math.random() * (width - 200),
      top: Math.random() * (height - 100),
    })
    
    if (textbox) {
      // Enter edit mode immediately
      setTimeout(() => {
        textbox.enterEditing()
        setIsEditing(true)
      }, 100)
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
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedText, isEditing, deleteSelectedText, duplicateSelectedText, updateSelectedText])

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="border border-gray-300 shadow-lg"
      />

      {/* Add Text Button */}
      <button
        onClick={handleAddText}
        className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
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
    </div>
  )
}