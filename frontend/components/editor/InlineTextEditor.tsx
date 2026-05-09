'use client'
import { useEffect, useRef, useState } from 'react'
import { useEditorStore } from '@/store/editor.store'

interface InlineTextEditorProps {
  elementId: string
  onClose: () => void
  displayScale: number
}

export default function InlineTextEditor({ elementId, onClose, displayScale }: InlineTextEditorProps) {
  const { elements, updateElement } = useEditorStore()
  const element = elements.find((el) => el.id === elementId)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState(element?.text || '')

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSave()
      }
      // Prevent canvas shortcuts while editing
      e.stopPropagation()
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [text])

  if (!element || element.type !== 'text') return null

  const handleSave = () => {
    if (text.trim()) {
      updateElement(elementId, { text: text.trim() })
    }
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    // Live update
    updateElement(elementId, { text: newText })
  }

  // Professional text padding (matching ProfessionalTextElement)
  const TEXT_PADDING = {
    horizontal: 12,
    vertical: 8,
  }

  // Calculate position and size based on element and display scale
  // Account for padding offset
  const scaledX = (element.x + TEXT_PADDING.horizontal) * displayScale
  const scaledY = (element.y + TEXT_PADDING.vertical) * displayScale
  const scaledWidth = (element.width - (TEXT_PADDING.horizontal * 2)) * displayScale
  const scaledHeight = (element.height - (TEXT_PADDING.vertical * 2)) * displayScale
  const scaledFontSize = (element.fontSize || 16) * displayScale

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onBlur={handleSave}
        className="absolute pointer-events-auto resize-none bg-white/90 backdrop-blur-sm border-2 border-blue-500 rounded outline-none shadow-lg"
        style={{
          left: `${scaledX}px`,
          top: `${scaledY}px`,
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          fontSize: `${scaledFontSize}px`,
          fontFamily: element.fontFamily || 'Inter',
          fontWeight: element.fontWeight || 'normal',
          color: element.fill || '#000000',
          textAlign: (element.align as any) || 'left',
          letterSpacing: `${(element.letterSpacing || 0) * displayScale}px`,
          lineHeight: element.lineHeight || 1.2,
          padding: '2px',
          overflow: 'hidden',
          wordWrap: 'break-word',
        }}
      />
    </div>
  )
}
