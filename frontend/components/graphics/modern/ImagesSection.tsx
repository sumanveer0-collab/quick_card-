'use client'
import React, { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface ImagesSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

const PROFESSIONAL_IMAGES = [
  { id: 'business-1', name: 'Business Meeting', category: 'business', src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', tags: ['business', 'meeting', 'professional'] },
  { id: 'business-2', name: 'Handshake', category: 'business', src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop', tags: ['handshake', 'partnership', 'business'] },
  { id: 'business-3', name: 'Office Workspace', category: 'business', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', tags: ['office', 'workspace', 'desk'] },
  { id: 'tech-1', name: 'Technology', category: 'technology', src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', tags: ['technology', 'digital'] },
  { id: 'tech-2', name: 'Laptop Work', category: 'technology', src: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop', tags: ['laptop', 'work'] },
  { id: 'abstract-1', name: 'Abstract Pattern', category: 'abstract', src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop', tags: ['abstract', 'pattern'] },
  { id: 'abstract-2', name: 'Geometric Abstract', category: 'abstract', src: 'https://images.unsplash.com/photo-1557672199-6ba0c7a49e2f?w=400&h=300&fit=crop', tags: ['geometric', 'abstract'] },
  { id: 'nature-1', name: 'Nature Background', category: 'nature', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', tags: ['nature', 'forest'] },
]

export default function ImagesSection({ searchTerm, onAddElement }: ImagesSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const filteredImages = useMemo(() => {
    if (!searchTerm) return PROFESSIONAL_IMAGES
    return PROFESSIONAL_IMAGES.filter(img =>
      img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm])

  const visibleImages = showAll ? filteredImages : filteredImages.slice(0, 6)

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
      x: 100 + Math.random() * 150,
      y: 100 + Math.random() * 100,
      visible: true,
      locked: false,
      zIndex: Date.now(),
    })
  }

  if (filteredImages.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-gray-900">Images</span>
          <span className="ml-1.5 text-[10px] text-gray-400">{filteredImages.length} items</span>
        </div>
        {filteredImages.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show less' : 'See all'} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 3-column image grid */}
      <div className="grid grid-cols-3 gap-2">
        {visibleImages.map(image => (
          <button
            key={image.id}
            onClick={() => handleAddImage(image)}
            title={image.name}
            className="aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-150 group"
          >
            <img
              src={image.src}
              alt={image.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
