'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Upload, Palette, Layers, Settings, Layout
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { useState, useMemo } from 'react'
import { templates } from '@/lib/templates'
import ProductOptionsPanel from './ProductOptionsPanel'
import { GraphicsSidebar } from '../graphics/modern'
import DynamicTextFieldsPanel from './DynamicTextFieldsPanel'
import toast from 'react-hot-toast'

type TabType = 'text' | 'uploads' | 'graphics' | 'background' | 'templates' | 'color' | 'product' | 'more'

interface CustomizeSidebarProps {
  activeTab: TabType
}

export default function CustomizeSidebar({ activeTab }: CustomizeSidebarProps) {
  const { addElement, setBackground, background } = useEditorStore()
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  
  // Template search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Get unique categories from templates
  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category))
    return ['All', ...Array.from(cats)]
  }, [])

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesSearch = searchQuery === '' || 
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Load Template
  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) return

    // Clear existing elements
    const store = useEditorStore.getState()
    store.reset()

    // Set background
    setBackground(template.background)

    // Add all template elements
    template.elements.forEach((element) => {
      const { id, zIndex, ...elementData } = element
      addElement(elementData as any)
    })
    
    toast.success(`Template "${template.name}" applied!`)
  }

  // Add Graphic Element
  const handleAddGraphicElement = (elementData: any) => {
    addElement({
      type: elementData.type,
      ...elementData,
      visible: true,
      locked: false,
    })
  }

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setUploadedImages((prev) => [...prev, imageUrl])
      
      addElement({
        type: 'image',
        src: imageUrl,
        x: 200,
        y: 150,
        width: 200,
        height: 200,
        rotation: 0,
        visible: true,
        locked: false,
      })
    }
    reader.readAsDataURL(file)
  }

  // Background Colors
  const backgroundColors = [
    '#ffffff', '#f3f4f6', '#e5e7eb', '#d1d5db',
    '#3b82f6', '#2563eb', '#1e40af', '#1e3a8a',
    '#10b981', '#059669', '#047857', '#065f46',
    '#f59e0b', '#d97706', '#b45309', '#92400e',
    '#ef4444', '#dc2626', '#b91c1c', '#991b1b',
    '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6',
  ]

  // Background Gradients
  const backgroundGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  ]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-80 bg-white border-r border-gray-200 overflow-y-auto"
      >
        <div className="p-6">
          {/* TEXT TAB */}
          {activeTab === 'text' && (
            <DynamicTextFieldsPanel />
          )}

          {/* UPLOADS TAB */}
          {activeTab === 'uploads' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Upload Images</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Add your own images, logos, or photos
                </p>
              </div>

              {/* Upload Button */}
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900">Upload Image</p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, SVG up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Uploads ({uploadedImages.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {uploadedImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 cursor-pointer group"
                        onClick={() => {
                          addElement({
                            type: 'image',
                            src: img,
                            x: 200,
                            y: 150,
                            width: 200,
                            height: 200,
                            rotation: 0,
                            visible: true,
                            locked: false,
                          })
                        }}
                      >
                        <img
                          src={img}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GRAPHICS TAB */}
          {activeTab === 'graphics' && (
            <GraphicsSidebar onAddElement={handleAddGraphicElement} />
          )}

          {/* BACKGROUND TAB */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Background</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Choose a color or gradient for your card
                </p>
              </div>

              {/* Solid Colors */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Solid Colors</h3>
                <div className="grid grid-cols-6 gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackground(color)}
                      className={`aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                        background === color
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Gradients */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Gradients</h3>
                <div className="grid grid-cols-2 gap-3">
                  {backgroundGradients.map((gradient, index) => (
                    <button
                      key={index}
                      onClick={() => setBackground(gradient)}
                      className={`aspect-video rounded-lg border-2 transition-all hover:scale-105 ${
                        background === gradient
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ background: gradient }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Templates</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Choose a professional template to start
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 hover:bg-blue-100 hover:text-blue-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Results Count */}
              {(searchQuery || selectedCategory !== 'All') && (
                <div className="text-xs text-gray-500">
                  {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
                </div>
              )}

              {/* Template Cards */}
              <div className="space-y-3 max-h-[calc(100vh-450px)] overflow-y-auto pr-2">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleLoadTemplate(template.id)}
                    className="w-full p-3 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left group bg-white"
                  >
                    <div className="flex items-start gap-3">
                      {/* Template Thumbnail */}
                      <div className="w-20 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Layout className="w-6 h-6 text-white" />
                      </div>
                      
                      {/* Template Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                          {template.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                            {template.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            {template.elements?.length || 0} elements
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Use Template Button */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Click to apply</span>
                        <span className="text-blue-600 font-medium group-hover:text-blue-700">
                          Use Template →
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* No Results */}
              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <Layout className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">No templates found</p>
                  <p className="text-xs text-gray-500">
                    {searchQuery ? 'Try a different search term' : 'No templates in this category'}
                  </p>
                  {(searchQuery || selectedCategory !== 'All') && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('All')
                      }}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* COLOR TAB */}
          {activeTab === 'color' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Template Colors</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Change the color scheme of your design
                </p>
              </div>

              <div className="text-center py-12">
                <Palette className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Color schemes coming soon</p>
              </div>
            </div>
          )}

          {/* PRODUCT TAB */}
          {activeTab === 'product' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Product Options</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Customize your product specifications
                </p>
              </div>

              {/* Product Options Panel */}
              <ProductOptionsPanel />
            </div>
          )}

          {/* MORE TAB */}
          {activeTab === 'more' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">More Options</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Additional settings and tools
                </p>
              </div>

              {/* Product Options Panel */}
              <ProductOptionsPanel />

              <div className="space-y-2">
                <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Layers</p>
                      <p className="text-xs text-gray-500">Manage element layers</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Settings</p>
                      <p className="text-xs text-gray-500">Editor preferences</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
