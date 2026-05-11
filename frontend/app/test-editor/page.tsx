'use client'
import React, { useState } from 'react'
import CanvasEditor from '@/components/editor/CanvasEditor'
import { TextObjectData } from '@/types/fabric.types'

export default function TestEditorPage() {
  const [textObjects, setTextObjects] = useState<TextObjectData[]>([])

  const handleTextChange = (texts: TextObjectData[]) => {
    setTextObjects(texts)
    console.log('Text objects updated:', texts)
  }

  // Sample template texts for testing
  const sampleTexts: TextObjectData[] = [
    {
      id: 'sample-1',
      text: 'GRAPHIC MITRA STUDIO',
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fontStyle: 'normal',
      underline: false,
      fill: '#2563eb',
      textAlign: 'center',
      charSpacing: 2,
      lineHeight: 1.2,
      angle: 0,
      opacity: 1,
      width: 300,
      height: 60,
      left: 250,
      top: 100,
      editable: true,
      lockScalingFlip: true,
      scaleX: 1,
      scaleY: 1
    },
    {
      id: 'sample-2',
      text: 'Professional Design Services',
      fontFamily: 'Arial',
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'italic',
      underline: false,
      fill: '#64748b',
      textAlign: 'center',
      charSpacing: 1,
      lineHeight: 1.4,
      angle: 0,
      opacity: 1,
      width: 250,
      height: 40,
      left: 275,
      top: 180,
      editable: true,
      lockScalingFlip: true,
      scaleX: 1,
      scaleY: 1
    },
    {
      id: 'sample-3',
      text: 'Contact: info@graphicmitra.com\nPhone: +91 12345 67890',
      fontFamily: 'Arial',
      fontSize: 14,
      fontWeight: 'normal',
      fontStyle: 'normal',
      underline: false,
      fill: '#374151',
      textAlign: 'left',
      charSpacing: 0,
      lineHeight: 1.6,
      angle: 0,
      opacity: 1,
      width: 280,
      height: 60,
      left: 50,
      top: 350,
      editable: true,
      lockScalingFlip: true,
      scaleX: 1,
      scaleY: 1
    }
  ]

  const loadSampleTemplate = () => {
    setTextObjects(sampleTexts)
  }

  const clearCanvas = () => {
    setTextObjects([])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced Text Editor Test
          </h1>
          <p className="text-gray-600 mb-6">
            Test the one-click text editing, resize, and move features on the canvas below.
          </p>
          
          {/* Control Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={loadSampleTemplate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Load Sample Template
            </button>
            <button
              onClick={clearCanvas}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear Canvas
            </button>
          </div>

          {/* Feature Guide */}
          <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">How to Test Features:</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">One-Click Editing</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Click on any text to select it</li>
                  <li>• Click again to start editing</li>
                  <li>• Or press Enter to edit</li>
                  <li>• Press ESC to finish editing</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-green-600 mb-2">Resize & Move</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Drag corners to resize</li>
                  <li>• Drag text to move</li>
                  <li>• Use arrow keys for precise movement</li>
                  <li>• Hold Shift + arrows for faster movement</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-purple-600 mb-2">Keyboard Shortcuts</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ctrl+B: Bold</li>
                  <li>• Ctrl+I: Italic</li>
                  <li>• Ctrl+U: Underline</li>
                  <li>• Ctrl+D: Duplicate</li>
                  <li>• Ctrl +/-: Font size</li>
                  <li>• Delete: Remove text</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Editor */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CanvasEditor
            width={800}
            height={600}
            onTextChange={handleTextChange}
            initialTexts={textObjects}
          />
        </div>

        {/* Debug Info */}
        {textObjects.length > 0 && (
          <div className="mt-8 bg-gray-900 text-green-400 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Current Text Objects ({textObjects.length}):</h3>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(textObjects, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}