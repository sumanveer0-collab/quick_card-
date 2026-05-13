'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Heart, Star, ShoppingCart, Sparkles, Crown,
  ArrowRight, Filter, Grid3x3, List, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import toast from 'react-hot-toast'

// Design categories
const CATEGORIES = [
  { id: 'shapes', label: 'Shop by Shapes', icon: '🔷' },
  { id: 'papers', label: 'Papers & Textures', icon: '📄' },
  { id: 'specialty', label: 'Specialty Cards', icon: '✨' },
  { id: 'creative', label: 'Creative Uses', icon: '🎨' },
]

// Shape types
const SHAPES = [
  { id: 'standard', name: 'Standard Rectangle', image: '/designs/shapes/standard.svg' },
  { id: 'rounded', name: 'Rounded Corner', image: '/designs/shapes/rounded.svg' },
  { id: 'square', name: 'Square', image: '/designs/shapes/square.svg' },
  { id: 'leaf', name: 'Leaf Shape', image: '/designs/shapes/leaf.svg' },
  { id: 'oval', name: 'Oval', image: '/designs/shapes/oval.svg' },
]

// Paper types
const PAPERS = [
  { id: 'glossy', name: 'Glossy Finish', description: 'Vibrant colors with shine', price: 299, image: '/designs/papers/glossy.svg' },
  { id: 'matte', name: 'Matte Finish', description: 'Elegant non-reflective surface', price: 299, image: '/designs/papers/matte.svg' },
  { id: 'non-tearable', name: 'Non-Tearable', description: 'Waterproof & durable', price: 499, image: '/designs/papers/non-tearable.svg' },
  { id: 'spot-uv', name: 'Spot UV', description: 'Glossy highlights on matte', price: 699, image: '/designs/papers/spot-uv.svg' },
  { id: 'foil', name: 'Foil Stamping', description: 'Metallic gold or silver accents', price: 899, image: '/designs/papers/foil.svg' },
  { id: 'textured', name: 'Textured Linen', description: 'Premium fabric texture', price: 599, image: '/designs/papers/textured.svg' },
]

// Specialty cards
const SPECIALTY = [
  { id: 'qr-code', name: 'QR Code Cards', description: 'Digital contact sharing', price: 399, image: '/designs/specialty/qr-code.svg', badge: 'Popular' },
  { id: 'nfc', name: 'NFC Smart Cards', description: 'Tap to share instantly', price: 1299, image: '/designs/specialty/nfc.svg', badge: 'Premium' },
  { id: 'transparent', name: 'Transparent Cards', description: 'Clear plastic with print', price: 999, image: '/designs/specialty/transparent.svg', badge: 'Unique' },
  { id: 'metal', name: 'Metal Cards', description: 'Stainless steel luxury', price: 2499, image: '/designs/specialty/metal.svg', badge: 'Luxury' },
]

// Creative uses
const CREATIVE = [
  { id: 'beauty-spa', name: 'Beauty & Spa', description: 'Elegant designs for salons', price: 299, image: '/designs/creative/beauty-spa.svg', rating: 4.8 },
  { id: 'fashion', name: 'Fashion & Boutique', description: 'Stylish fashion-forward cards', price: 299, image: '/designs/creative/fashion.svg', rating: 4.9 },
  { id: 'travel', name: 'Travel & Tourism', description: 'Adventure-themed designs', price: 299, image: '/designs/creative/travel.svg', rating: 4.7 },
  { id: 'food', name: 'Food & Catering', description: 'Appetizing restaurant cards', price: 299, image: '/designs/creative/food.svg', rating: 4.6 },
]

interface DesignCardProps {
  design: any
  onAddToCart: () => void
  onCustomize: () => void
}

function DesignCard({ design, onAddToCart, onCustomize }: DesignCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {!imageError ? (
          <Image
            src={design.image}
            alt={design.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center">
              <div className="text-4xl mb-2">{design.icon || '🎨'}</div>
              <p className="text-sm font-semibold text-gray-600">{design.name}</p>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {design.badge && (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-lg ${
              design.badge === 'Premium' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' :
              design.badge === 'Popular' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
              design.badge === 'Luxury' ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' :
              'bg-gradient-to-r from-green-500 to-teal-500 text-white'
            }`}>
              {design.badge}
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
            toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites', { icon: '❤️' })
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all shadow-lg"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCustomize}
              className="px-4 py-2 bg-white text-gray-900 rounded-xl text-sm font-semibold shadow-lg hover:bg-gray-50 transition-colors"
            >
              Customize
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAddToCart}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{design.name}</h3>
            {design.description && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{design.description}</p>
            )}
          </div>
          {design.price && (
            <div className="ml-2 flex-shrink-0">
              <p className="text-lg font-bold text-blue-600">₹{design.price}</p>
            </div>
          )}
        </div>

        {/* Rating */}
        {design.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(design.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">{design.rating}</span>
          </div>
        )}
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  )
}


export default function BusinessCardDesignsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('shapes')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popular')

  const handleCustomize = (designId: string) => {
    // Navigate to customize page with design context
    router.push(`/customize?designType=${designId}`)
  }

  const handleAddToCart = (design: any) => {
    // Add to cart logic
    toast.success(`${design.name} added to cart!`, { icon: '🛒' })
  }

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'shapes':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SHAPES.map((shape) => (
              <DesignCard
                key={shape.id}
                design={shape}
                onCustomize={() => handleCustomize(shape.id)}
                onAddToCart={() => handleAddToCart(shape)}
              />
            ))}
          </div>
        )

      case 'papers':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {PAPERS.map((paper) => (
              <DesignCard
                key={paper.id}
                design={paper}
                onCustomize={() => handleCustomize(paper.id)}
                onAddToCart={() => handleAddToCart(paper)}
              />
            ))}
          </div>
        )

      case 'specialty':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SPECIALTY.map((special) => (
              <DesignCard
                key={special.id}
                design={special}
                onCustomize={() => handleCustomize(special.id)}
                onAddToCart={() => handleAddToCart(special)}
              />
            ))}
          </div>
        )

      case 'creative':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CREATIVE.map((creative) => (
              <DesignCard
                key={creative.id}
                design={creative}
                onCustomize={() => handleCustomize(creative.id)}
                onAddToCart={() => handleAddToCart(creative)}
              />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Premium Business Card Designs
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Design Your Perfect
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Business Card
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Choose from premium shapes, papers, and specialty finishes. Customize and order in minutes.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search designs, papers, or specialty cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl text-base"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 mb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>

          {/* Filters and View Controls */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Designs Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {renderCategoryContent()}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />
          <div className="relative">
            <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-3xl font-bold mb-3">Need Custom Design Help?</h2>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Our design experts can create a unique business card tailored to your brand
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl inline-flex items-center gap-2">
              Get Custom Design
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
