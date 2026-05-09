'use client'
import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Grid, Image, Shapes, Star, Palette, 
  Plus, ChevronRight, Filter, X 
} from 'lucide-react'
import { GraphicsLibraryProps, ShapeData, IconData } from '@/types/graphics.types'
import { ALL_SHAPES } from '@/lib/graphics/shapes'
import { ALL_ICONS } from '@/lib/graphics/icons'
import { generateId } from '@/lib/utils'

type GraphicsTab = 'shapes' | 'images' | 'icons' | 'illustrations'

const SAMPLE_IMAGES = [
  {
    id: 'business-1',
    name: 'Business Meeting',
    category: 'business',
    src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    tags: ['business', 'meeting', 'professional']
  },
  {
    id: 'business-2',
    name: 'Handshake',
    category: 'business',
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    tags: ['handshake', 'partnership', 'business']
  },
  {
    id: 'tech-1',
    name: 'Technology',
    category: 'technology',
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    tags: ['technology', 'computer', 'digital']
  },
  {
    id: 'abstract-1',
    name: 'Abstract Pattern',
    category: 'abstract',
    src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop',
    tags: ['abstract', 'pattern', 'design']
  }
]

export default function VistaprintGraphicsLibrary({ 
  onAddElement, 
  searchTerm = '', 
  selectedCategory = 'all' 
}: GraphicsLibraryProps) {
  const [activeTab, setActiveTab] = useState<GraphicsTab>('shapes')
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [selectedShapeCategory, setSelectedShapeCategory] = useState('all')
  const [selectedIconCategory, setSelectedIconCategory] = useState('all')

  // Filter shapes based on search and category
  const filteredShapes = useMemo(() => {
    return ALL_SHAPES.filter(shape => {
      const matchesSearch = shape.name.toLowerCase().includes(localSearchTerm.toLowerCase())
      const matchesCategory = selectedShapeCategory === 'all' || shape.category === selectedShapeCategory
      return matchesSearch && matchesCategory
    })
  }, [localSearchTerm, selectedShapeCategory])

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    return ALL_ICONS.filter(icon => {
      const matchesSearch = 
        icon.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        icon.keywords.some(keyword => keyword.toLowerCase().includes(localSearchTerm.toLowerCase()))
      const matchesCategory = selectedIconCategory === 'all' || icon.category === selectedIconCategory
      return matchesSearch && matchesCategory
    })
  }, [localSearchTerm, selectedIconCategory])

  // Filter images based on search
  const filteredImages = useMemo(() => {
    return SAMPLE_IMAGES.filter(image => {
      const matchesSearch = 
        image.name.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
        image.tags.some(tag => tag.toLowerCase().includes(localSearchTerm.toLowerCase()))
      return matchesSearch
    })
  }, [localSearchTerm])

  // Add shape to canvas
  const handleAddShape = (shape: ShapeData) => {
    onAddElement({
      id: generateId(),
      type: 'shape',
      shapeType: shape.type,
      category: shape.category,
      name: shape.name,
      svg: shape.svg,
      width: shape.defaultWidth,
      height: shape.defaultHeight,
      fill: '#3b82f6',
      stroke: 'none',
      strokeWidth: 0,
      opacity: 1,
      rotation: 0,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      visible: true,
      locked: false,
      zIndex: Date.now() // Use timestamp for unique z-index
    })
  }

  // Add icon to canvas
  const handleAddIcon = (icon: IconData) => {
    onAddElement({
      id: generateId(),
      type: 'icon',
      category: icon.category,
      name: icon.name,
      svg: icon.svg,
      width: 48,
      height: 48,
      fill: '#000000',
      stroke: 'none',
      strokeWidth: 0,
      opacity: 1,
      rotation: 0,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      visible: true,
      locked: false,
      zIndex: Date.now()
    })
  }

  // Add image to canvas
  const handleAddImage = (image: any) => {
    onAddElement({
      id: generateId(),
      type: 'image',
      category: image.category,
      name: image.name,
      src: image.src,
      width: 200,
      height: 150,
      opacity: 1,
      rotation: 0,
      x: Math.random() * 200 + 100,
      y: Math.random() * 200 + 100,
      visible: true,
      locked: false,
      zIndex: Date.now()
    })
  }

  const tabs = [
    { id: 'shapes' as GraphicsTab, label: 'Shapes', icon: Shapes, count: filteredShapes.length },
    { id: 'images' as GraphicsTab, label: 'Images', icon: Image, count: filteredImages.length },
    { id: 'icons' as GraphicsTab, label: 'Icons', icon: Star, count: filteredIcons.length },
    { id: 'illustrations' as GraphicsTab, label: 'Illustrations', icon: Palette, count: 0 }
  ]

  const shapeCategories = [
    { id: 'all', label: 'All Shapes' },
    { id: 'basic', label: 'Basic' },
    { id: 'arrows', label: 'Arrows' },
    { id: 'decorative', label: 'Decorative' },
    { id: 'business', label: 'Business' }
  ]

  const iconCategories = [
    { id: 'all', label: 'All Icons' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Social' },
    { id: 'business', label: 'Business' },
    { id: 'decorative', label: 'Decorative' }
  ]

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Grid className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Graphics</h2>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search for content"
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {localSearchTerm && (
            <button
              onClick={() => setLocalSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="text-xs text-gray-500">({tab.count})</span>
                )}
              </div>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeGraphicsTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Shapes Tab */}
          {activeTab === 'shapes' && (
            <motion.div
              key="shapes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Category</span>
                </div>
                <select
                  value={selectedShapeCategory}
                  onChange={(e) => setSelectedShapeCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {shapeCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shapes Grid */}
              <div className="grid grid-cols-3 gap-3">
                {filteredShapes.map((shape) => (
                  <motion.button
                    key={shape.id}
                    onClick={() => handleAddShape(shape)}
                    className="aspect-square p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div 
                      className="w-full h-full flex items-center justify-center text-gray-600 group-hover:text-blue-600"
                      dangerouslySetInnerHTML={{ __html: shape.svg }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-blue-600 text-white p-1 rounded-full">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {filteredShapes.length === 0 && (
                <div className="text-center py-8">
                  <Shapes className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No shapes found</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Icons Tab */}
          {activeTab === 'icons' && (
            <motion.div
              key="icons"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Category Filter */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Category</span>
                </div>
                <select
                  value={selectedIconCategory}
                  onChange={(e) => setSelectedIconCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {iconCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Icons Grid */}
              <div className="grid grid-cols-4 gap-3">
                {filteredIcons.map((icon) => (
                  <motion.button
                    key={icon.id}
                    onClick={() => handleAddIcon(icon)}
                    className="aspect-square p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={icon.name}
                  >
                    <div 
                      className="w-full h-full flex items-center justify-center text-gray-600 group-hover:text-blue-600"
                      dangerouslySetInnerHTML={{ __html: icon.svg }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-blue-600 text-white p-1 rounded-full">
                        <Plus className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {filteredIcons.length === 0 && (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No icons found</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Images Tab */}
          {activeTab === 'images' && (
            <motion.div
              key="images"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredImages.map((image) => (
                  <motion.button
                    key={image.id}
                    onClick={() => handleAddImage(image)}
                    className="aspect-video border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all group relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={image.src}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-white text-xs font-medium">{image.name}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              {filteredImages.length === 0 && (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No images found</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Illustrations Tab */}
          {activeTab === 'illustrations' && (
            <motion.div
              key="illustrations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-4"
            >
              <div className="text-center py-12">
                <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Illustrations Coming Soon</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Professional illustrations will be available in a future update.
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Request Illustrations
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}