'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Type, Edit3, Trash2, Eye, EyeOff, Link, Unlink, Layers } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

// Text field definition with binding to canvas element
interface TextFieldDefinition {
  id: string
  fieldKey: string // unique key like 'companyName', 'fullName'
  label: string
  placeholder: string
  value: string
  elementId: string | null // linked canvas element ID
  defaultStyle: {
    fontSize: number
    fontFamily: string
    fontWeight: string | number
    color: string
    align: 'left' | 'center' | 'right'
  }
}

// Default business card fields
const DEFAULT_FIELDS: Omit<TextFieldDefinition, 'elementId'>[] = [
  {
    id: 'field_company',
    fieldKey: 'companyName',
    label: 'Company Name',
    placeholder: 'Enter company name',
    value: '',
    defaultStyle: {
      fontSize: 42,
      fontFamily: 'Arial',
      fontWeight: 700,
      color: '#222222',
      align: 'center'
    }
  },
  {
    id: 'field_fullname',
    fieldKey: 'fullName',
    label: 'Full Name',
    placeholder: 'Enter your full name',
    value: '',
    defaultStyle: {
      fontSize: 28,
      fontFamily: 'Arial',
      fontWeight: 600,
      color: '#333333',
      align: 'center'
    }
  },
  {
    id: 'field_jobtitle',
    fieldKey: 'jobTitle',
    label: 'Job Title',
    placeholder: 'Enter your job title',
    value: '',
    defaultStyle: {
      fontSize: 18,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#666666',
      align: 'center'
    }
  },
  {
    id: 'field_phone',
    fieldKey: 'phone',
    label: 'Phone',
    placeholder: 'Enter phone number',
    value: '',
    defaultStyle: {
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#444444',
      align: 'left'
    }
  },
  {
    id: 'field_email',
    fieldKey: 'email',
    label: 'Email',
    placeholder: 'Enter email address',
    value: '',
    defaultStyle: {
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#444444',
      align: 'left'
    }
  },
  {
    id: 'field_website',
    fieldKey: 'website',
    label: 'Website',
    placeholder: 'Enter website',
    value: '',
    defaultStyle: {
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#444444',
      align: 'left'
    }
  },
  {
    id: 'field_address',
    fieldKey: 'address',
    label: 'Address',
    placeholder: 'Enter address',
    value: '',
    defaultStyle: {
      fontSize: 14,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      color: '#666666',
      align: 'left'
    }
  }
]

export default function DynamicTextFieldsPanel() {
  const { elements, addElement, updateElement, selectElement, deleteElement } = useEditorStore()
  
  // Initialize fields with null elementId
  const [textFields, setTextFields] = useState<TextFieldDefinition[]>(
    DEFAULT_FIELDS.map(field => ({ ...field, elementId: null }))
  )

  // Sync canvas text changes back to fields
  useEffect(() => {
    const textElements = elements.filter(el => el.type === 'text')
    
    setTextFields(prev => prev.map(field => {
      if (field.elementId) {
        const element = textElements.find(el => el.id === field.elementId)
        if (element && element.text !== field.value) {
          // Canvas text changed, update field value
          return { ...field, value: element.text || '' }
        }
      }
      return field
    }))
  }, [elements])

  // Handle field value change (sidebar input)
  const handleFieldChange = (fieldId: string, newValue: string) => {
    setTextFields(prev => 
      prev.map(field => {
        if (field.id === fieldId) {
          // Update field value
          const updated = { ...field, value: newValue }
          
          // If linked to canvas element, update it too
          if (field.elementId) {
            updateElement(field.elementId, { text: newValue })
          }
          
          return updated
        }
        return field
      })
    )
  }

  // Create canvas element from field
  const handleCreateElement = (fieldId: string) => {
    const field = textFields.find(f => f.id === fieldId)
    if (!field) return

    // Calculate position based on existing elements
    const textElements = elements.filter(el => el.type === 'text')
    const yOffset = textElements.length * 80 + 100

    const newElement = {
      type: 'text' as const,
      text: field.value,
      x: 100,
      y: yOffset,
      width: 850,
      height: field.defaultStyle.fontSize * 1.5,
      fontSize: field.defaultStyle.fontSize,
      fontFamily: field.defaultStyle.fontFamily,
      fontWeight: field.defaultStyle.fontWeight,
      fill: field.defaultStyle.color,
      align: field.defaultStyle.align,
      verticalAlign: 'middle' as const,
      letterSpacing: 0,
      lineHeight: 1.2,
      rotation: 0,
      visible: true,
      locked: false,
      padding: { horizontal: 12, vertical: 8 },
    }
    
    // Add element and get its ID
    addElement(newElement)
    
    // Link field to the newly created element
    // We need to get the ID of the just-added element
    setTimeout(() => {
      const allElements = useEditorStore.getState().elements
      const lastElement = allElements[allElements.length - 1]
      if (lastElement) {
        setTextFields(prev =>
          prev.map(f =>
            f.id === fieldId ? { ...f, elementId: lastElement.id } : f
          )
        )
      }
    }, 50)
  }

  // Unlink field from canvas element
  const handleUnlinkElement = (fieldId: string) => {
    setTextFields(prev =>
      prev.map(field =>
        field.id === fieldId ? { ...field, elementId: null } : field
      )
    )
  }

  // Delete field and its canvas element
  const handleDeleteField = (fieldId: string) => {
    const field = textFields.find(f => f.id === fieldId)
    if (field?.elementId) {
      deleteElement(field.elementId)
    }
    setTextFields(prev => prev.filter(f => f.id !== fieldId))
  }

  // Add new custom field
  const handleAddCustomField = () => {
    const newField: TextFieldDefinition = {
      id: `field_custom_${Date.now()}`,
      fieldKey: `custom_${Date.now()}`,
      label: 'Custom Text',
      placeholder: 'Enter custom text',
      value: 'Custom Text',
      elementId: null,
      defaultStyle: {
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        color: '#000000',
        align: 'left'
      }
    }
    
    setTextFields(prev => [...prev, newField])
  }

  // Get text elements from canvas
  const textElements = elements.filter(el => el.type === 'text')
  const linkedElementIds = textFields.map(f => f.elementId).filter(Boolean)
  const unlinkedElements = textElements.filter(el => !linkedElementIds.includes(el.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Type className="w-5 h-5" />
          Dynamic Text Fields
        </h2>
        <p className="text-sm text-gray-500">
          Edit text below and see it update on canvas instantly. Click + to add to canvas.
        </p>
      </div>

      {/* Text Fields */}
      <div className="space-y-3">
        <AnimatePresence>
          {textFields.map((field, index) => {
            const isLinked = !!field.elementId
            const element = isLinked ? elements.find(el => el.id === field.elementId) : null
            
            return (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                {/* Field Label */}
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    {field.label}
                    {isLinked && (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <Link className="w-3 h-3" />
                        Linked
                      </span>
                    )}
                  </label>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isLinked && (
                      <>
                        <button
                          onClick={() => selectElement(field.elementId!)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Select on canvas"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUnlinkElement(field.id)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Unlink from canvas"
                        >
                          <Unlink className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteField(field.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Input Field */}
                <div className="relative">
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      isLinked
                        ? 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50/30'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    style={{
                      fontSize: `${Math.min(field.defaultStyle.fontSize / 2, 14)}px`,
                      fontWeight: field.defaultStyle.fontWeight,
                    }}
                  />
                  
                  {/* Add to Canvas Button */}
                  {!isLinked && (
                    <button
                      onClick={() => handleCreateElement(field.id)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110"
                      title="Add to canvas"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  )}
                  
                  {/* Linked Indicator */}
                  {isLinked && element && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                {/* Element Info */}
                {isLinked && element && (
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {element.fontSize}px • {element.fontFamily}
                    </span>
                    {!element.visible && (
                      <span className="flex items-center gap-1 text-orange-600">
                        <EyeOff className="w-3 h-3" />
                        Hidden
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Add Custom Field Button */}
      <button
        onClick={handleAddCustomField}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
      >
        <Plus className="w-5 h-5" />
        Add Custom Text Field
      </button>

      {/* Unlinked Canvas Elements */}
      {unlinkedElements.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Unlinked Canvas Elements ({unlinkedElements.length})
          </h3>
          <div className="space-y-2">
            {unlinkedElements.map((element) => (
              <button
                key={element.id}
                onClick={() => selectElement(element.id)}
                className="w-full p-3 text-left border border-orange-200 bg-orange-50/30 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {element.text || 'Empty text'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {element.fontSize}px • {element.fontFamily}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Not linked
                    </span>
                    <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
                  </div>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            These elements exist on canvas but aren't linked to any field. You can still edit them directly on canvas.
          </p>
        </div>
      )}

      {/* Quick Text Styles */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Add Text Styles</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Heading', size: 36, weight: 'bold', sample: 'Heading' },
            { label: 'Subheading', size: 24, weight: '600', sample: 'Subheading' },
            { label: 'Body', size: 16, weight: 'normal', sample: 'Body Text' },
            { label: 'Small', size: 12, weight: 'normal', sample: 'Small Text' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                const yOffset = elements.filter(el => el.type === 'text').length * 80 + 100
                addElement({
                  type: 'text',
                  text: preset.sample,
                  x: 100,
                  y: yOffset,
                  width: 400,
                  height: preset.size * 1.5,
                  fontSize: preset.size,
                  fontFamily: 'Arial',
                  fontWeight: preset.weight,
                  fill: '#000000',
                  align: 'left',
                  verticalAlign: 'middle',
                  letterSpacing: 0,
                  lineHeight: 1.2,
                  rotation: 0,
                  visible: true,
                  locked: false,
                  padding: { horizontal: 12, vertical: 8 },
                })
              }}
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-900">{preset.label}</p>
                  <p className="text-xs text-gray-500">{preset.size}px</p>
                </div>
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{textFields.length}</p>
            <p className="text-xs text-gray-600">Fields</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {textFields.filter(f => f.elementId).length}
            </p>
            <p className="text-xs text-gray-600">Linked</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-600">{textElements.length}</p>
            <p className="text-xs text-gray-600">Canvas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
