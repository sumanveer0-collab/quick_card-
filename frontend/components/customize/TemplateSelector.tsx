'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { templates } from '@/lib/templates'
import { useEditorStore } from '@/store/editor.store'
import toast from 'react-hot-toast'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const INDUSTRIES = [
  'Agriculture & Farming',
  'Animals & Pet Care',
  'Arts, Crafts, and Design',
  'Automotive & Transportation',
  'Beauty & Spa',
  'Construction & Contractors',
  'Education & Training',
  'Food & Restaurant',
  'Health & Medical',
  'Legal & Financial',
  'Real Estate',
  'Technology & IT',
  'All Industries'
]

const DESIGN_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Brown', value: '#92400e' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
]

export default function TemplateSelector({ isOpen, onClose }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [showIndustries, setShowIndustries] = useState(true)
  const [showColors, setShowColors] = useState(true)
  const [showOrientation, setShowOrientation] = useState(false)
  
  const { addElement, setBackground, reset, selectElement } = useEditorStore()

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) return

    // Clear existing elements and reset state
    reset()

    // Set background
    setBackground(template.background)

    // Add all template elements with fresh IDs
    template.elements.forEach((element) => {
      const { id, zIndex, ...elementData } = element
      addElement(elementData as any)
    })

    // Deselect any selected element
    selectElement(null)

    toast.success(`Template "${template.name}" loaded!`)
    onClose()
  }

  // Filter templates based on search and filters
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = !selectedIndustry || selectedIndustry === 'All Industries' || 
                           template.category === selectedIndustry
    // Color filtering would need template color metadata
    return matchesSearch && matchesIndustry
  })

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Change template</h2>
              <p className="text-sm text-gray-500 mt-1">Choose a new template to start editing.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex h-[calc(100%-80px)]">
            {/* Left Sidebar - Filters */}
            <div className="w-80 border-r border-gray-200 overflow-y-auto p-6 space-y-6">
              {/* Industry Filter */}
              <div>
                <button
                  onClick={() => setShowIndustries(!showIndustries)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="text-sm font-semibold text-gray-900">Industry</h3>
                  {showIndustries ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                
                {showIndustries && (
                  <div className="space-y-2">
                    {INDUSTRIES.map((industry) => (
                      <label
                        key={industry}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="radio"
                          name="industry"
                          checked={selectedIndustry === industry}
                          onChange={() => setSelectedIndustry(industry)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{industry}</span>
                      </label>
                    ))}
                    <button
                      onClick={() => setShowIndustries(false)}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </div>

              {/* Design Color Filter */}
              <div>
                <button
                  onClick={() => setShowColors(!showColors)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="text-sm font-semibold text-gray-900">Design colour</h3>
                  {showColors ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                
                {showColors && (
                  <div className="grid grid-cols-6 gap-2">
                    {DESIGN_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setSelectedColor(color.value)}
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          selectedColor === color.value
                            ? 'border-blue-500 ring-2 ring-blue-200 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Size & Orientation Filter */}
              <div>
                <button
                  onClick={() => setShowOrientation(!showOrientation)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <h3 className="text-sm font-semibold text-gray-900">Size & orientation</h3>
                  {showOrientation ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>
                
                {showOrientation && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="orientation" className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Horizontal (9cm × 5.2cm)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                      <input type="radio" name="orientation" className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">Vertical (5.2cm × 9cm)</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - Templates Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Search Bar */}
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Search designs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer"
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    {/* Template Preview */}
                    <div className="relative aspect-[1.75] rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-500 transition-all mb-3">
                      <div
                        className="w-full h-full"
                        style={{ background: template.background }}
                      >
                        {/* Template preview content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2" />
                            <div className="h-2 bg-white/30 rounded w-24 mx-auto mb-1" />
                            <div className="h-2 bg-white/20 rounded w-16 mx-auto" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-all flex items-center justify-center">
                        <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-all">
                          Use Template
                        </button>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {template.description}
                      </p>
                      
                      {/* Color Dots */}
                      <div className="flex gap-1 mt-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No Results */}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🎨</div>
                  <p className="text-gray-500 font-medium">No templates found</p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedIndustry(null)
                      setSelectedColor(null)
                    }}
                    className="mt-3 text-blue-600 text-sm hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 right-0 p-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Current template
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
