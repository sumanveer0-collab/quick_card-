'use client'
import React, { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface IllustrationsSectionProps {
  searchTerm: string
  onAddElement: (element: any) => void
}

const PROFESSIONAL_ILLUSTRATIONS = [
  {
    id: 'ill-star-burst', name: 'Star Burst', category: 'decorative',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 54,35 65,15 57,43 80,28 62,50 90,50 65,57 82,75 57,62 65,90 50,70 35,90 43,62 18,75 35,57 10,50 38,50 20,28 43,43 35,15 46,35" fill="#f59e0b"/></svg>`,
    tags: ['star', 'burst', 'decoration'], colors: ['#f59e0b']
  },
  {
    id: 'ill-star-six', name: 'Six Star', category: 'decorative',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 55,40 75,15 60,45 95,40 68,55 90,78 58,62 60,95 50,70 40,95 42,62 10,78 32,55 5,40 40,45 25,15 45,40" fill="#3b82f6"/></svg>`,
    tags: ['star', 'six', 'decoration'], colors: ['#3b82f6']
  },
  {
    id: 'ill-pinwheel', name: 'Pinwheel', category: 'decorative',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,50 C50,30 60,10 75,10 C65,25 60,40 65,50 Z" fill="#ef4444"/><path d="M50,50 C70,50 90,40 90,25 C75,35 60,40 50,35 Z" fill="#3b82f6"/><path d="M50,50 C50,70 40,90 25,90 C35,75 40,60 35,50 Z" fill="#10b981"/><path d="M50,50 C30,50 10,60 10,75 C25,65 40,60 50,65 Z" fill="#f59e0b"/><circle cx="50" cy="50" r="5" fill="#1f2937"/></svg>`,
    tags: ['pinwheel', 'spin', 'decoration'], colors: ['#ef4444']
  },
  {
    id: 'ill-growth-chart', name: 'Growth Chart', category: 'business',
    svg: `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="55" width="12" height="20" fill="#3b82f6" rx="2"/><rect x="28" y="42" width="12" height="33" fill="#60a5fa" rx="2"/><rect x="46" y="30" width="12" height="45" fill="#93c5fd" rx="2"/><rect x="64" y="18" width="12" height="57" fill="#bfdbfe" rx="2"/><polyline points="16,52 34,38 52,25 70,14" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
    tags: ['chart', 'growth', 'business'], colors: ['#3b82f6']
  },
  {
    id: 'ill-target', name: 'Target', category: 'business',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#fee2e2"/><circle cx="50" cy="50" r="32" fill="#fca5a5"/><circle cx="50" cy="50" r="18" fill="#ef4444"/><circle cx="50" cy="50" r="7" fill="#7f1d1d"/></svg>`,
    tags: ['target', 'goal', 'business'], colors: ['#ef4444']
  },
  {
    id: 'ill-bulb', name: 'Idea Bulb', category: 'creative',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="42" r="26" fill="#fcd34d"/><rect x="40" y="68" width="20" height="16" fill="#9ca3af" rx="3"/><rect x="37" y="84" width="26" height="7" fill="#6b7280" rx="2"/><line x1="50" y1="16" x2="50" y2="8" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/><line x1="28" y1="24" x2="22" y2="18" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/><line x1="72" y1="24" x2="78" y2="18" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/></svg>`,
    tags: ['idea', 'lightbulb', 'creative'], colors: ['#fcd34d']
  },
]

export default function IllustrationsSection({ searchTerm, onAddElement }: IllustrationsSectionProps) {
  const [showAll, setShowAll] = useState(false)

  const filteredIlls = useMemo(() => {
    if (!searchTerm) return PROFESSIONAL_ILLUSTRATIONS
    return PROFESSIONAL_ILLUSTRATIONS.filter(ill =>
      ill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ill.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ill.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [searchTerm])

  const visibleIlls = showAll ? filteredIlls : filteredIlls.slice(0, 6)

  const handleAdd = (ill: any) => {
    onAddElement({
      id: generateId(),
      type: 'illustration',
      category: ill.category,
      name: ill.name,
      svg: ill.svg,
      width: 120,
      height: 120,
      fill: ill.colors[0],
      opacity: 1,
      rotation: 0,
      x: 100 + Math.random() * 150,
      y: 100 + Math.random() * 100,
      visible: true,
      locked: false,
      zIndex: Date.now(),
    })
  }

  if (filteredIlls.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-gray-900">Illustrations</span>
          <span className="ml-1.5 text-[10px] text-gray-400">{filteredIlls.length} items</span>
        </div>
        {filteredIlls.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-700 font-medium"
          >
            {showAll ? 'Show less' : 'See all'} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {visibleIlls.map(ill => (
          <button
            key={ill.id}
            onClick={() => handleAdd(ill)}
            title={ill.name}
            className="aspect-square flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-150 p-2 group"
          >
            <div
              className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform"
              dangerouslySetInnerHTML={{ __html: ill.svg }}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
