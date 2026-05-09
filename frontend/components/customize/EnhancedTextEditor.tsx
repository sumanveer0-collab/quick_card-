'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Edit3, X } from 'lucide-react'
// import FabricTextEditor from '../editor/FabricTextEditor'
import { useEditorStore } from '@/store/editor.store'
// import { TextObjectData } from '@/types/fabric.types'

interface EnhancedTextEditorProps {
  isOpen: boolean
  onClose: () => void
  canvasWidth?: number
  canvasHeight?: number
}

export default function EnhancedTextEditor({ 
  isOpen, 
  onClose,
  canvasWidth = 1125,
  canvasHeight = 675
}: EnhancedTextEditorProps) {
  const { elements, addElement, updateElement } = useEditorStore()
  // const [textObjects, setTextObjects] = useState<TextObjectData[]>([])

  // Convert existing text elements to Fabric format
  useEffect(() => {
    if (isOpen) {
      const textElements = elements.filter(el => el.type === 'text')
      // Temporarily disabled due to Fabric.js import issues
      /*
      const fabricTexts: TextObjectData[] = textElements.map(el => ({
        id: el.id,
        text: el.text || 'Text',
        fontFamily: el.fontFamily || 'Arial',
        fontSize: el.fontSize || 16,
        fontWeight: el.fontWeight || 'normal',
        fontStyle: 'normal',
        underline: false,
        fill: el.fill || '#000000',
        textAlign: el.align || 'left',
        charSpacing: 0,
        lineHeight: 1.16,
        angle: el.rotation || 0,
        opacity: 1,
        width: el.width || 200,
        height: el.height || 50,
        left: el.x || 0,
        top: el.y || 0,
        editable: true,
        lockScalingFlip: true
      }))
      setTextObjects(fabricTexts)
      */
    }
  }, [isOpen, elements])

  // Handle text objects change from Fabric editor
  const handleTextObjectsChange = (objects: any[]) => {
    // setTextObjects(objects)
    
    // Sync back to main editor store
    objects.forEach(textObj => {
      const existingElement = elements.find(el => el.id === textObj.id)
      
      const elementData = {
        type: 'text' as const,
        text: textObj.text,
        x: textObj.left,
        y: textObj.top,
        width: textObj.width,
        height: textObj.height,
        fontSize: textObj.fontSize,
        fontFamily: textObj.fontFamily,
        fontWeight: textObj.fontWeight,
        fill: textObj.fill,
        align: textObj.textAlign,
        rotation: textObj.angle,
        visible: true,
        locked: false,
      }

      if (existingElement) {
        updateElement(textObj.id, elementData)
      } else {
        addElement({ ...elementData, id: textObj.id })
      }
    })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Edit3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Professional Text Editor</h2>
                <p className="text-sm text-gray-600">
                  Advanced text editing with Fabric.js • Click text to select • Double-click to edit
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Editor Content */}
          <div className="p-6 bg-gray-50">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Temporarily disabled due to Fabric.js import issues */}
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Type className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Enhanced Text Editor</p>
                  <p className="text-sm">Fabric.js integration temporarily disabled</p>
                </div>
              </div>
              {/* <FabricTextEditor
                width={canvasWidth}
                height={canvasHeight}
                backgroundColor="#ffffff"
                onTextObjectsChange={handleTextObjectsChange}
                initialTexts={textObjects}
              /> */}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Single click to select</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Double click to edit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Drag to move</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
              >
                Close Editor
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}