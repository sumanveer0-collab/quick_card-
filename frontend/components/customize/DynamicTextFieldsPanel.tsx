'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Type, Heading1, Heading2, AlignLeft, Hash } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

// ─── Quick-add text styles ────────────────────────────────────────────────────
const QUICK_STYLES = [
  {
    id: 'heading',
    label: 'Add a heading',
    preview: 'Heading',
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    fill: '#1a1a1a',
    icon: Heading1,
  },
  {
    id: 'subheading',
    label: 'Add a subheading',
    preview: 'Subheading',
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'Inter',
    fill: '#374151',
    icon: Heading2,
  },
  {
    id: 'body',
    label: 'Add a little bit of body text',
    preview: 'Body text',
    fontSize: 18,
    fontWeight: 'normal',
    fontFamily: 'Inter',
    fill: '#4b5563',
    icon: AlignLeft,
  },
]

// ─── Field definitions ────────────────────────────────────────────────────────
const DEFAULT_FIELDS = [
  { id: 'f_company',  label: 'Company Name', placeholder: 'Enter company name',   fontSize: 42, fontWeight: 700,        fill: '#222222', align: 'center' as const },
  { id: 'f_name',     label: 'Full Name',     placeholder: 'Enter your full name', fontSize: 28, fontWeight: 600,        fill: '#333333', align: 'center' as const },
  { id: 'f_title',    label: 'Job Title',     placeholder: 'Enter your job title', fontSize: 18, fontWeight: 'normal',   fill: '#666666', align: 'center' as const },
  { id: 'f_phone',    label: 'Phone',         placeholder: 'Enter phone number',   fontSize: 16, fontWeight: 'normal',   fill: '#444444', align: 'left' as const },
  { id: 'f_email',    label: 'Email',         placeholder: 'Enter email address',  fontSize: 16, fontWeight: 'normal',   fill: '#444444', align: 'left' as const },
  { id: 'f_website',  label: 'Website',       placeholder: 'Enter website',        fontSize: 16, fontWeight: 'normal',   fill: '#444444', align: 'left' as const },
  { id: 'f_address',  label: 'Address',       placeholder: 'Enter address',        fontSize: 14, fontWeight: 'normal',   fill: '#666666', align: 'left' as const },
]

interface Field {
  id: string
  label: string
  placeholder: string
  fontSize: number
  fontWeight: number | string
  fill: string
  align: 'left' | 'center' | 'right'
  value: string
  elementId: string | null
}

export default function DynamicTextFieldsPanel() {
  const { elements, addElement, updateElement, selectElement } = useEditorStore()

  const [fields, setFields] = useState<Field[]>(
    DEFAULT_FIELDS.map(f => ({ ...f, value: '', elementId: null }))
  )

  // Sync canvas → sidebar
  useEffect(() => {
    const textEls = elements.filter(el => el.type === 'text')
    setFields(prev => prev.map(field => {
      if (!field.elementId) return field
      const el = textEls.find(e => e.id === field.elementId)
      if (el && el.text !== field.value) return { ...field, value: el.text ?? '' }
      return field
    }))
  }, [elements])

  // Sidebar → canvas
  const handleChange = (fieldId: string, value: string) => {
    setFields(prev => prev.map(f => {
      if (f.id !== fieldId) return f
      if (f.elementId) updateElement(f.elementId, { text: value })
      return { ...f, value }
    }))
  }

  const handleAdd = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId)
    if (!field) return
    const yCount = elements.filter(el => el.type === 'text').length
    addElement({
      type: 'text',
      text: field.value || field.placeholder,
      x: 112,
      y: 150 + yCount * 75,
      width: 850,
      height: Math.round(field.fontSize * 1.6),
      fontSize: field.fontSize,
      fontFamily: 'Arial',
      fontWeight: field.fontWeight,
      fill: field.fill,
      align: field.align,
      verticalAlign: 'middle',
      letterSpacing: 0,
      lineHeight: 1.2,
      rotation: 0,
      visible: true,
      locked: false,
    })
    setTimeout(() => {
      const all = useEditorStore.getState().elements
      const last = all[all.length - 1]
      if (last) {
        setFields(prev => prev.map(f => f.id === fieldId ? { ...f, elementId: last.id } : f))
      }
    }, 50)
  }

  const handleAddQuick = (style: typeof QUICK_STYLES[number]) => {
    const yCount = elements.filter(el => el.type === 'text').length
    addElement({
      type: 'text',
      text: style.preview,
      x: 112,
      y: 150 + yCount * 75,
      width: 850,
      height: Math.round(style.fontSize * 1.6),
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
    const yCount = elements.filter(el => el.type === 'text').length
    addElement({
      type: 'text',
      text: 'Custom Text',
      x: 112,
      y: 150 + yCount * 75,
      width: 600,
      height: 50,
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
    <div className="space-y-0">
      {/* ── Quick-add styles (top section, BrandCrowd style) ── */}
      <div className="px-5 pt-5 pb-4">
        <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Type className="w-4 h-4 text-blue-500" />Text
        </h2>
        <p className="text-xs text-gray-500 mb-4">Click to add text to your design</p>

        <div className="space-y-2">
          {QUICK_STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => handleAddQuick(style)}
              className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all group"
            >
              <span
                className="block leading-tight truncate"
                style={{
                  fontSize: `${Math.min(style.fontSize / 2.5, 22)}px`,
                  fontWeight: style.fontWeight,
                  fontFamily: style.fontFamily,
                  color: '#1a1a1a',
                }}
              >
                {style.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleAddCustom}
          className="mt-3 w-full py-2.5 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />Add Custom Text
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="h-2 bg-gray-50 border-y border-gray-100" />

      {/* ── Dynamic Fields ── */}
      <div className="px-5 pt-4 pb-6 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Card Fields</span>
        </div>
        <p className="text-xs text-gray-400 -mt-1">Edit field values then click + to add to canvas</p>

        <AnimatePresence>
          {fields.map((field, i) => {
            const isLinked = !!field.elementId
            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ delay: i * 0.03 }}
              >
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  {field.label}
                  {isLinked && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-normal">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse inline-block" />
                      Live
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={field.value}
                    onChange={e => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    onClick={() => field.elementId && selectElement(field.elementId)}
                    className={`flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      isLinked
                        ? 'border-green-300 focus:ring-green-400 bg-green-50/30'
                        : 'border-gray-200 focus:ring-blue-400'
                    }`}
                  />
                  {!isLinked && (
                    <button
                      onClick={() => handleAdd(field.id)}
                      title="Add to canvas"
                      className="w-8 h-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
