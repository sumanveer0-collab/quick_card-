'use client'
/**
 * DynamicTextFieldsPanel — BrandCrowd-style left Text tab
 *
 * Shows only the 3 quick-add text style buttons + "Add Custom Text".
 * The full text editor appears on the RIGHT side (TextEditPanel)
 * when the user clicks a text element on canvas.
 */
import { Plus, Type } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

const QUICK_STYLES = [
  {
    id: 'heading',
    label: 'Add a heading',
    sample: 'HEADING',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    fill: '#1a1a1a',
    previewSize: 20,
  },
  {
    id: 'subheading',
    label: 'Add a subheading',
    sample: 'Subheading',
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'Inter',
    fill: '#374151',
    previewSize: 14,
  },
  {
    id: 'body',
    label: 'Add a little bit of body text',
    sample: 'Body text',
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Inter',
    fill: '#4b5563',
    previewSize: 11,
  },
]

export default function DynamicTextFieldsPanel() {
  const { elements, addElement } = useEditorStore()

  const nextY = () => {
    const textEls = elements.filter(e => e.type === 'text')
    return 150 + textEls.length * 80
  }

  const handleAddStyle = (style: typeof QUICK_STYLES[number]) => {
    addElement({
      type: 'text',
      text: style.sample,
      x: 112,
      y: nextY(),
      width: 850,
      height: Math.round(style.fontSize * 1.8),
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      fontWeight: style.fontWeight,
      fill: style.fill,
      align: 'center',
      verticalAlign: 'middle',
      letterSpacing: 0,
      lineHeight: 1.2,
      rotation: 0,
      visible: true,
      locked: false,
    })
  }

  const handleAddCustom = () => {
    addElement({
      type: 'text',
      text: 'Custom Text',
      x: 112,
      y: nextY(),
      width: 600,
      height: 60,
      fontSize: 24,
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fill: '#000000',
      align: 'left',
      verticalAlign: 'middle',
      letterSpacing: 0,
      lineHeight: 1.2,
      rotation: 0,
      visible: true,
      locked: false,
    })
  }

  return (
    <div className="px-5 pt-5 pb-6 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Type className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-bold text-gray-900">Text</span>
      </div>

      {/* Quick-add style buttons — exactly like BrandCrowd */}
      {QUICK_STYLES.map(style => (
        <button
          key={style.id}
          onClick={() => handleAddStyle(style)}
          className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all bg-white"
        >
          <span
            className="block leading-tight truncate text-gray-900"
            style={{
              fontSize: `${style.previewSize}px`,
              fontWeight: style.fontWeight,
              fontFamily: style.fontFamily,
            }}
          >
            {style.label}
          </span>
        </button>
      ))}

      {/* Add Custom Text button */}
      <button
        onClick={handleAddCustom}
        className="mt-1 w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Custom Text
      </button>

      {/* Hint */}
      <p className="text-[11px] text-gray-400 text-center pt-1">
        Click any text on the card to edit it
      </p>
    </div>
  )
}
