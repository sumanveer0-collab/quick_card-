'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Grid, List, Eye, Pencil, Star, Crown, Sparkles } from 'lucide-react'

// Template interface
interface Template {
  id: string
  name: string
  category: string
  image: string
  isPremium: boolean
  isFeatured: boolean
  description: string
  colors: string[]
}

// Import local templates
import { templates as localTemplates } from '@/lib/templates'
import api from '@/lib/api'
import toast from 'react-hot-toast'

// Sample templates data (fallback if API fails)
const SAMPLE_TEMPLATES: Template[] = [
  {
    id: 'temp_001',
    name: 'Modern Blue Professional',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop',
    isPremium: false,
    isFeatured: true,
    description: 'Clean and professional design perfect for corporate use',
    colors: ['#1e40af', '#ffffff', '#111111']
  },
  {
    id: 'temp_002',
    name: 'Creative Gradient',
    category: 'Creative',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=250&fit=crop',
    isPremium: true,
    isFeatured: true,
    description: 'Eye-catching gradient design for creative professionals',
    colors: ['#8b5cf6', '#ec4899', '#ffffff']
  },
  {
    id: 'temp_003',
    name: 'Minimal Black & White',
    category: 'Minimal',
    image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=250&fit=crop',
    isPremium: false,
    isFeatured: false,
    description: 'Elegant minimalist design with timeless appeal',
    colors: ['#000000', '#ffffff', '#666666']
  },
  {
    id: 'temp_004',
    name: 'Corporate Elite',
    category: 'Corporate',
    image: 'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=400&h=250&fit=crop',
    isPremium: true,
    isFeatured: false,
    description: 'Premium corporate design with gold accents',
    colors: ['#1e293b', '#f59e0b', '#ffffff']
  },
  {
    id: 'temp_005',
    name: 'Modern Tech',
    category: 'Modern',
    image: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=400&h=250&fit=crop',
    isPremium: false,
    isFeatured: true,
    description: 'Sleek modern design for tech professionals',
    colors: ['#0ea5e9', '#1e293b', '#ffffff']
  },
  {
    id: 'temp_006',
    name: 'QR Smart Card',
    category: 'QR Card',
    image: 'https://images.unsplash.com/photo-1557682233-43e671455dfa?w=400&h=250&fit=crop',
    isPremium: true,
    isFeatured: false,
    description: 'Smart business card with integrated QR code',
    colors: ['#10b981', '#ffffff', '#111111']
  },
  {
    id: 'temp_007',
    name: 'Real Estate Pro',
    category: 'Real Estate',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
    isPremium: false,
    isFeatured: false,
    description: 'Professional design for real estate agents',
    colors: ['#dc2626', '#ffffff', '#1e293b']
  },
  {
    id: 'temp_008',
    name: 'Medical Professional',
    category: 'Medical',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=250&fit=crop',
    isPremium: false,
    isFeatured: false,
    description: 'Clean medical professional card design',
    colors: ['#0891b2', '#ffffff', '#111111']
  },
  {
    id: 'temp_009',
    name: 'Photography Studio',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=250&fit=crop',
    isPremium: true,
    isFeatured: true,
    description: 'Artistic design for photographers',
    colors: ['#7c3aed', '#ffffff', '#1e293b']
  },
  {
    id: 'temp_010',
    name: 'Luxury Gold',
    category: 'Business',
    image: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400&h=250&fit=crop',
    isPremium: true,
    isFeatured: true,
    description: 'Luxurious design with gold elements',
    colors: ['#000000', '#fbbf24', '#ffffff']
  },
  {
    id: 'temp_011',
    name: 'Startup Vibes',
    category: 'Modern',
    image: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&h=250&fit=crop',
    isPremium: false,
    isFeatured: false,
    description: 'Fresh and energetic startup design',
    colors: ['#f97316', '#1e293b', '#ffffff']
  },
  {
    id: 'temp_012',
    name: 'Classic Elegance',
    category: 'Corporate',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&h=250&fit=crop',
    isPremium: false,
    isFeatured: false,
    description: 'Timeless elegant corporate design',
    colors: ['#1e40af', '#ffffff', '#64748b']
  }
]

const CATEGORIES = [
  'All',
  'Business',
  'Creative',
  'Corporate',
  'Minimal',
  'Modern',
  'QR Card',
  'Real Estate',
  'Medical',
  'Photography'
]

export default function QuickCardTemplateGallery() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>(SAMPLE_TEMPLATES)
  const [loading, setLoading] = useState(true)

  // Load templates from API or use local templates
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      try {
        // Try to load from API first
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
        const res = await fetch(`${apiUrl}/templates?limit=50`)
        
        if (res.ok) {
          const json = await res.json()
          const apiTemplates = Array.isArray(json.data) ? json.data : []
          
          // Convert API templates to gallery format
          const convertedTemplates: Template[] = apiTemplates.map((t: any) => ({
            id: t._id || t.id,
            name: t.name,
            category: t.category || 'Business',
            image: t.previewImage || t.thumbnail || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop',
            isPremium: t.isPremium || false,
            isFeatured: false, // Can be set based on API data
            description: t.description || 'Professional business card template',
            colors: extractColors(t.layoutConfig)
          }))
          
          if (convertedTemplates.length > 0) {
            setTemplates(convertedTemplates)
          } else {
            // Fallback to local templates
            const localConverted = localTemplates.map(t => ({
              id: t.id,
              name: t.name,
              category: t.category,
              image: t.thumbnail || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop',
              isPremium: false,
              isFeatured: t.category === 'Creative',
              description: t.description,
              colors: [t.background, '#ffffff', '#000000']
            }))
            setTemplates([...SAMPLE_TEMPLATES, ...localConverted])
          }
        } else {
          // API failed, use local templates
          const localConverted = localTemplates.map(t => ({
            id: t.id,
            name: t.name,
            category: t.category,
            image: t.thumbnail || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop',
            isPremium: false,
            isFeatured: t.category === 'Creative',
            description: t.description,
            colors: [t.background, '#ffffff', '#000000']
          }))
          setTemplates([...SAMPLE_TEMPLATES, ...localConverted])
        }
      } catch (error) {
        console.error('Failed to load templates:', error)
        // Use local templates as fallback
        const localConverted = localTemplates.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category,
          image: t.thumbnail || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=250&fit=crop',
          isPremium: false,
          isFeatured: t.category === 'Creative',
          description: t.description,
          colors: [t.background, '#ffffff', '#000000']
        }))
        setTemplates([...SAMPLE_TEMPLATES, ...localConverted])
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  // Helper function to extract colors from layoutConfig
  const extractColors = (layoutConfig: any): string[] => {
    if (!layoutConfig) return ['#1e40af', '#ffffff', '#111111']
    const colors = []
    if (layoutConfig.background) colors.push(layoutConfig.background)
    if (layoutConfig.primaryColor) colors.push(layoutConfig.primaryColor)
    if (layoutConfig.accent) colors.push(layoutConfig.accent)
    return colors.length > 0 ? colors : ['#1e40af', '#ffffff', '#111111']
  }

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredTemplates = filteredTemplates.filter(t => t.isFeatured)
  const regularTemplates = filteredTemplates.filter(t => !t.isFeatured)

  const handleCustomize = (templateId: string) => {
    // Check if it's a local template or API template
    const localTemplate = localTemplates.find(t => t.id === templateId)
    
    if (localTemplate) {
      // For local templates, navigate with template ID
      router.push(`/customize?templateId=${templateId}`)
      toast.success(`Loading "${localTemplate.name}"...`)
    } else {
      // For API templates, navigate with template ID
      router.push(`/customize?templateId=${templateId}`)
      toast.success('Loading template...')
    }
  }

  const handlePreview = (templateId: string) => {
    // Open preview modal or navigate to preview page
    toast.info('Preview feature coming soon!')
    console.log('Preview template:', templateId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-500" />
                Template Gallery
              </h1>
              <p className="text-slate-400 text-sm lg:text-base">
                Choose from {SAMPLE_TEMPLATES.length}+ professional business card templates
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/customize')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Create Blank
              </button>
              
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search templates by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Templates */}
        {!loading && featuredTemplates.length > 0 && selectedCategory === 'All' && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-2xl font-bold text-white">Featured Templates</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  isHovered={hoveredTemplate === template.id}
                  onHover={setHoveredTemplate}
                  onCustomize={handleCustomize}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          {selectedCategory !== 'All' && (
            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedCategory} Templates ({regularTemplates.length})
            </h2>
          )}
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[16/10] bg-slate-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                    <div className="h-8 bg-slate-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-slate-400 text-lg mb-4">No templates found</div>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                }}
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {(selectedCategory === 'All' ? regularTemplates : filteredTemplates).map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  isHovered={hoveredTemplate === template.id}
                  onHover={setHoveredTemplate}
                  onCustomize={handleCustomize}
                  onPreview={handlePreview}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Template Card Component
interface TemplateCardProps {
  template: Template
  index: number
  isHovered: boolean
  onHover: (id: string | null) => void
  onCustomize: (id: string) => void
  onPreview: (id: string) => void
  viewMode?: 'grid' | 'list'
}

function TemplateCard({
  template,
  index,
  isHovered,
  onHover,
  onCustomize,
  onPreview,
  viewMode = 'grid'
}: TemplateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseEnter={() => onHover(template.id)}
      onMouseLeave={() => onHover(null)}
      className={`group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 ${
        isHovered ? 'shadow-2xl shadow-blue-500/10 scale-[1.02]' : 'shadow-xl'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
        <img
          src={template.image}
          alt={template.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => onPreview(template.id)}
              className="bg-white/90 hover:bg-white text-slate-900 px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              Preview
            </motion.button>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
              transition={{ delay: 0.15 }}
              onClick={() => onCustomize(template.id)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Pencil className="w-4 h-4" />
              Customize
            </motion.button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {template.isFeatured && (
            <span className="bg-yellow-500/90 text-yellow-950 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-yellow-950" />
              Featured
            </span>
          )}
          {template.isPremium && (
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
              <Crown className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {template.name}
            </h3>
            <span className="inline-block text-xs bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
              {template.category}
            </span>
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-4">
          {template.description}
        </p>

        {/* Color Palette */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-500">Colors:</span>
          <div className="flex gap-1.5">
            {template.colors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-slate-700"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onPreview(template.id)}
            className="flex-1 border border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 text-slate-300 hover:text-white transition-all py-2.5 rounded-xl font-medium"
          >
            Preview
          </button>
          <button
            onClick={() => onCustomize(template.id)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl font-medium shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            Customize
          </button>
        </div>
      </div>
    </motion.div>
  )
}
