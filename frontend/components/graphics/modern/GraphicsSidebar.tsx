'use client'
import React, { useState } from 'react'
import { Search } from 'lucide-react'
import ShapesSection from './ShapesSection'
import IconsSection from './IconsSection'
import ImagesSection from './ImagesSection'
import IllustrationsSection from './IllustrationsSection'

interface GraphicsSidebarProps {
  onClose?: () => void
  onAddElement: (element: any) => void
}

export default function GraphicsSidebar({ onAddElement }: GraphicsSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="w-full h-full bg-white flex flex-col">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Graphics</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for content"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <div className="px-4 py-3 space-y-5">
          <ShapesSection searchTerm={searchTerm} onAddElement={onAddElement} />
          <ImagesSection searchTerm={searchTerm} onAddElement={onAddElement} />
          <IconsSection searchTerm={searchTerm} onAddElement={onAddElement} />
          <IllustrationsSection searchTerm={searchTerm} onAddElement={onAddElement} />
        </div>
      </div>

    </div>
  )
}
