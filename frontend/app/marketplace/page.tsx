'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

// Template Categories with realistic mockup data
const TEMPLATE_CATEGORIES = [
  {
    id: 'standard',
    title: 'Standard Visiting Cards',
    description: 'Classic professional business cards',
    basePrice: 200,
    pricePerUnit: 2.00,
    minUnits: 100,
    image: '/mockups/standard-cards.jpg',
    bgColor: 'from-orange-50 to-orange-100',
    style: 'Clean white + orange corporate design'
  },
  {
    id: 'kraft',
    title: 'Kraft Visiting Cards',
    description: 'Eco-friendly textured paper',
    basePrice: 250,
    pricePerUnit: 2.50,
    minUnits: 100,
    image: '/mockups/kraft-cards.jpg',
    bgColor: 'from-amber-50 to-amber-100',
    style: 'Brown textured eco paper'
  },
  {
    id: 'rounded',
    title: 'Rounded Corner Visiting Cards',
    description: 'Modern smooth edges',
    basePrice: 220,
    pricePerUnit: 2.20,
    minUnits: 100,
    image: '/mockups/rounded-cards.jpg',
    bgColor: 'from-blue-50 to-blue-100',
    style: 'Smooth modern minimal UI'
  },
  {
    id: 'velvet',
    title: 'Velvet Touch Visiting Cards',
    description: 'Soft luxury matte finish',
    basePrice: 350,
    pricePerUnit: 3.50,
    minUnits: 100,
    image: '/mockups/velvet-cards.jpg',
    bgColor: 'from-purple-50 to-purple-100',
    style: 'Soft luxury matte finish',
    premium: true
  },
  {
    id: 'spotuv',
    title: 'Spot UV Visiting Cards',
    description: 'Glossy highlight effects',
    basePrice: 400,
    pricePerUnit: 4.00,
    minUnits: 100,
    image: '/mockups/spotuv-cards.jpg',
    bgColor: 'from-emerald-50 to-emerald-100',
    style: 'Glossy highlight on logo/text',
    premium: true
  },
  {
    id: 'matte',
    title: 'Matte Visiting Cards',
    description: 'Flat elegant minimal',
    basePrice: 280,
    pricePerUnit: 2.80,
    minUnits: 100,
    image: '/mockups/matte-cards.jpg',
    bgColor: 'from-slate-50 to-slate-100',
    style: 'Flat elegant minimal'
  },
  {
    id: 'diamond',
    title: 'Diamond Visiting Cards',
    description: 'Premium shiny texture',
    basePrice: 500,
    pricePerUnit: 5.00,
    minUnits: 100,
    image: '/mockups/diamond-cards.jpg',
    bgColor: 'from-pink-50 to-pink-100',
    style: 'Premium shiny texture',
    premium: true
  },
]

export default function MarketplacePage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [scrollPosition, setScrollPosition] = useState(0)

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleCardClick = (categoryId: string) => {
    router.push(`/customize?category=${categoryId}`)
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('template-scroll')
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Premium Business Cards
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Card
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional visiting cards with premium finishes. 
            Customize, preview, and order in minutes.
          </p>
        </motion.div>

        {/* Template Categories - Horizontal Scroll */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Scrollable Container */}
          <div
            id="template-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TEMPLATE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 group cursor-pointer"
                onClick={() => handleCardClick(category.id)}
              >
                {/* Card Container */}
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Premium Badge */}
                  {category.premium && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      PREMIUM
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(category.id)
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.has(category.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Card Preview Image */}
                  <div className={`relative h-64 bg-gradient-to-br ${category.bgColor} flex items-center justify-center p-8`}>
                    {/* Mockup Placeholder - Replace with actual images */}
                    <div className="relative w-full h-full">
                      {/* Stack of Cards Effect */}
                      <div className="absolute inset-0 bg-white rounded-lg shadow-xl transform rotate-3 opacity-30" />
                      <div className="absolute inset-0 bg-white rounded-lg shadow-xl transform rotate-1 opacity-50" />
                      
                      {/* Main Card */}
                      <div className="absolute inset-0 bg-white rounded-lg shadow-2xl flex items-center justify-center overflow-hidden">
                        <div className="text-center p-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-3" />
                          <div className="h-3 bg-gray-200 rounded w-32 mx-auto mb-2" />
                          <div className="h-2 bg-gray-100 rounded w-24 mx-auto mb-2" />
                          <div className="h-2 bg-gray-100 rounded w-28 mx-auto" />
                        </div>
                      </div>

                      {/* Wooden Surface Shadow */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/10 blur-xl rounded-full" />
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {category.description}
                    </p>

                    {/* Pricing */}
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">
                        From ₹{category.basePrice}.00
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{category.pricePerUnit.toFixed(2)} each / {category.minUnits} units
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                      Customize Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '🎨',
              title: 'Easy Customization',
              description: 'Drag & drop editor with live preview'
            },
            {
              icon: '📦',
              title: 'Fast Delivery',
              description: 'Get your cards in 3-5 business days'
            },
            {
              icon: '✨',
              title: 'Premium Quality',
              description: '300 DPI print-ready, professional finish'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center p-6 bg-white rounded-2xl shadow-sm"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
