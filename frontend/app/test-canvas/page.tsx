'use client'
import { useState } from 'react'
import InteractiveCardCanvas from '@/components/card/InteractiveCardCanvas'

export default function TestCanvasPage() {
  const [card] = useState({
    businessName: 'GRAPHIC MITRA STUDIO',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john@example.com',
    website: 'www.example.com',
    tagline: 'Professional Design Services',
    qrCodeUrl: null,
    hasWatermark: true
  })

  const [layout] = useState({
    background: 'linear-gradient(135deg, #0369a1, #0891b2)',
    primaryColor: '#ffffff',
    fontFamily: 'Inter'
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Interactive Card Canvas Test
          </h1>
          <p className="text-gray-600">
            Test the one-click text editing, resizing, and moving features
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Interactive Business Card Editor
          </h2>
          
          <div className="max-w-2xl mx-auto">
            <InteractiveCardCanvas 
              card={card} 
              layout={layout}
              onSave={(elements) => {
                console.log('Saved elements:', elements)
              }}
            />
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Click</strong> on any text to select it</li>
              <li>• <strong>Double-click</strong> on text to edit it</li>
              <li>• <strong>Drag</strong> text elements to move them around</li>
              <li>• <strong>Drag corners</strong> to resize text elements</li>
              <li>• Use the <strong>floating toolbar</strong> to format text</li>
              <li>• Press <strong>Delete</strong> to remove selected text</li>
              <li>• Press <strong>Ctrl+D</strong> to duplicate selected text</li>
              <li>• Click <strong>"Add Text"</strong> to create new text elements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}