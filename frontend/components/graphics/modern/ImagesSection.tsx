'use client'
import React, { useMemo } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import GraphicCard from './GraphicCard'
import { generateId } from '@/lib/utils'

interface ImagesSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

const PROFESSIONAL_IMAGES = [
  {
    id: 'business-1',
    name: 'Business Meeting',
    category: 'business',
    src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    tags: ['business', 'meeting', 'professional', 'office']
  },
  {
    id: 'business-2',
    name: 'Handshake',
    category: 'business',
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop',
    tags: ['handshake', 'partnership', 'business', 'deal']
  },
  {
    id: 'business-3',
    name: 'Office Workspace',
    category: 'business',
    src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop',
    tags: ['office', 'workspace', 'desk', 'professional']
  },
  {
    id: 'tech-1',
    name: 'Technology',
    category: 'technology',
    src: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    tags: ['technology', 'computer', 'digital', 'tech']
  },
  {
    id: 'tech-2',
    name: 'Laptop Work',
    category: 'technology',
    src: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop',
    tags: ['laptop', 'work', 'technology', 'coding']
  },
  {
    id: 'abstract-1',
    name: 'Abstract Pattern',
    category: 'abstract',
    src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop',
    tags: ['abstract', 'pattern', 'design', 'colorful']
  },
  {
    id: 'abstract-2',
    name: 'Geometric Abstract',
    category: 'abstract',
    src: 'https://images.unsplash.com/photo-1557672199-6ba0c7a49e2f?w=400&h=300&fit=crop',
    tags: ['geometric', 'abstract', 'modern', 'design']
  },
  {
    id: 'nature-1',
    name: 'Nature Background',
    category: 'nature',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    tags: ['nature', 'forest', 'green', 'outdoor']
  },
]

export default function ImagesSection({ searchTerm, onAddElement }: ImagesSectionProps) {
  const filteredImages = useMemo(() => {
    if (!searchTerm) return PROFESSIONAL_IMAGES
    return PROFESSIONAL_IMAGES.filter(image =>
      image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm])

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

  if (filteredImages.length === 0) return null

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Images</h3>
          <p className="text-xs text-gray-500">{filteredImages.length} items</p>
        </div>
      </div>

      {/* Images Grid - 2 columns for larger preview */}
      <div className="grid grid-cols-2 gap-3">
        {filteredImages.map((image, index) => (
          <GraphicCard
            key={image.id}
            onClick={() => handleAddImage(image)}
            delay={index * 0.02}
            aspectRatio="landscape"
          >
            <img
              src={image.src}
              alt={image.name}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium truncate">{image.name}</p>
            </div>
          </GraphicCard>
        ))}
      </div>
    </section>
  )
}
