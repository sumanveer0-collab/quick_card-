'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Type, Edit3, Trash2, Eye, EyeOff } from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'

interface TextFieldData {
  id: string
  label: string
  placeholder: string
  value: string
  elementId?: string
}

export default function TextFieldsPanel() {
  const { elements, addElement, updateElement, selectElement, deleteElement } = useEditorStore()
  
  // Default text fields based on business card structure
  const [textFields, setTextFields] = useState<TextFieldData[]>([
    { id: 'full_name', label: 'Full Name', placeholder: 'Enter your full name', value: 'FULL NAME' },
    { id: 'job_title', label: 'Job Title', placeholder: 'Enter your job title', value: 'Job Title' },
    { id: 'company_name', label: 'Company Name', placeholder: 'Enter company name', value: 'COMPANY NAME' },
    { id: 'phone', label: 'Phone / Other', placeholder: 'Enter phone number', value: 'Phone / Other' },
    { id: 'address1', label: 'Address Line 1', placeholder: 'Enter address line 1', value: 'Address Line 1' },
    { id: 'email', label: 'Email / Other', placeholder: 'Enter email address', value: 'Email / Other' },
    { id: 'address2', label: 'Address Line 2', placeholder: 'Enter address line 2', value: 'Address Line 2' },
    { id: 'web', label: 'Web / Other', placeholder: 'Enter website or other info', value: 'Web / Other' }
  ])

  // Get text elements from canvas
  const textElements = elements.filter(el => el.type === 'text')

  // Handle text field value change
  const handleFieldChange = (fieldId: string, newValue: string) => {
    setTextFields(prev => 
      prev.map(field => 
        field.id === fieldId ? { ...field, value: newValue } : field
      )
    )

    // Update corresponding canvas element if it exists
    const field = textFields.find(f => f.id === fieldId)
    if (field?.elementId) {
      updateElement(field.elementId, { text: newValue })
    }
  }

  // Add new text field
  const handleAddTextField = () => {
    const newField: TextFieldData = {
      id: `field_${Date.now()}`,
      label: 'New Text Field',
      placeholder: 'Enter text',
      value: 'New Text'
    }
    
    setTextFields(prev => [...prev, newField])
    
    // Also add to canvas
    const newElement = {
      type: 'text' as const,
      text: newField.value,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      width: 300,
      height: 50,
      fontSize: 18,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fill: '#000000',
      align: 'left' as const,
      verticalAlign: 'middle' as const,
      letterSpacing: 0,
      lineHeight: 1.2,
      rotation: 0,
      visible: true,
      locked: false,
      padding: { horizontal: 12, vertical: 8 },
    }
    
    addElement(newElement)
  }

  // Remove text field
  const handleRemoveField = (fieldId: string) => {
    const field = textFields.find(f => f.id === fieldId)
    if (field?.elementId) {
      deleteElement(field.elementId)
    }
    setTextFields(prev => prev.filter(f => f.id !== fieldId))
  }

  // Connect field to canvas element
  const handleConnectToElement = (fieldId: string, elementId: string) => {
    setTextFields(prev =>
      prev.map(field =>
        field.id === fieldId ? { ...field, elementId } : field
      )
    )
    
    // Update element text with field value
    const field = textFields.find(f => f.id === fieldId)
    if (field) {
      updateElement(elementId, { text: field.value })
    }
  }

  // Create new text element from field
  const handleCreateElement = (fieldId: string) => {
    const field = textFields.find(f => f.id === fieldId)
    if (!field) return

    const newElement = {
      type: 'text' as const,
      text: field.value,
      x: Math.random() * 300 + 100,
      y: Math.random() * 200 + 100,
      width: 300,
      height: 50,
      fontSize: 18,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fill: '#000000',
      align: 'left' as const,
      verticalAlign: 'middle' as const,
      letterSpacing: 0,
      lineHeight: 1.2,
      rotation: 0,
      visible: true,
      locked: false,
      padding: { horizontal: 12, vertical: 8 },
    }
    
    addElement(newElement)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Text</h2>
        <p className="text-sm text-gray-500 mb-4">
          Edit your text below or click on the field you'd like to edit directly on your design.
        </p>
      </div>

      {/* Text Fields */}
      <div className="space-y-4">
        {textFields.map((field) => {
          const connectedElement = textElements.find(el => el.id === field.elementId)
          const isConnected = !!connectedElement
          
          return (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <div className="flex items-center gap-1">
                  {isConnected && (
                    <button
                      onClick={() => selectElement(field.elementId!)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Select on canvas"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveField(field.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {!isConnected && (
                  <button
                    onClick={() => handleCreateElement(field.id)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Add to canvas"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {isConnected && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Connected to canvas element</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Add New Field Button */}
      <button
        onClick={handleAddTextField}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        New Text Field
      </button>

      {/* Text Styles Section */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Text Styles</h3>
        <div className="space-y-2">
          {[
            { label: 'Heading', size: 32, weight: 'bold', sample: 'Main Heading' },
            { label: 'Subheading', size: 24, weight: '600', sample: 'Subheading Text' },
            { label: 'Body Text', size: 16, weight: 'normal', sample: 'Body content text' },
            { label: 'Small Text', size: 12, weight: 'normal', sample: 'Small details' },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                addElement({
                  type: 'text',
                  text: preset.sample,
                  x: Math.random() * 300 + 100,
                  y: Math.random() * 200 + 100,
                  width: 300,
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
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-gray-900 mb-1"
                    style={{
                      fontSize: `${Math.min(preset.size, 18)}px`,
                      fontWeight: preset.weight,
                    }}
                  >
                    {preset.label}
                  </p>
                  <p className="text-xs text-gray-500">{preset.sample}</p>
                </div>
                <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Text Elements */}
      {textElements.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Canvas Text Elements ({textElements.length})
          </h3>
          <div className="space-y-2">
            {textElements.map((element) => (
              <button
                key={element.id}
                onClick={() => selectElement(element.id)}
                className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
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
                    {!element.visible && (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                    <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}