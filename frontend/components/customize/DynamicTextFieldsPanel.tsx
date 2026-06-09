'use client'
/**
 * DynamicTextFieldsPanel
 *
 * Shown in the Text tab when NO text element is selected.
 * Lists all existing text layers on the canvas — clicking one selects it
 * which triggers TextEditPanel to open automatically.
 */
import { MousePointer2, Type } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

export default function DynamicTextFieldsPanel() {
  const { elements, selectElement } = useEditorStore()

  const textElements = elements.filter(e => e.type === 'text' && e.visible !== false)

  return (
    <div className="px-4 pt-5 pb-4 space-y-4">

      {/* Header */}
      <div className="flex items-center gap-2">
        <Type className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-bold text-gray-900">Text</span>
      </div>

      {textElements.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center text-center gap-3 py-8">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <MousePointer2 className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No text on canvas yet</p>
          <p className="text-xs text-gray-400 leading-relaxed px-2">
            Click any text on the card to edit it, or add a template that has text.
          </p>
        </div>
      ) : (
        /* Text layer list */
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 mb-2">
            Click a text layer below to edit it
          </p>
          {textElements.map((el) => (
            <button
              key={el.id}
              onClick={() => selectElement(el.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
            >
              <p
                className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700"
                style={{
                  fontFamily: el.fontFamily || 'Inter',
                  fontWeight: el.fontWeight || 'normal',
                }}
              >
                {el.text || <span className="italic text-gray-400">Empty text</span>}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {el.fontFamily || 'Inter'} · {el.fontSize || 16}px
              </p>
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
