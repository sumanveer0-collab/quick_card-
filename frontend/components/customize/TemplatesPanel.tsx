'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Search, X, Check, Crown, Loader2 } from 'lucide-react'
import { replacePlaceholders } from '@/lib/template-engine'

const ALL_CAT = 'All'

interface ApiTemplate {
  _id: string
  name: string
  category: string
  isPremium: boolean
  layoutConfig: Record<string, any>
  frontHTML?: string
  frontCSS?: string
  backHTML?: string
  backCSS?: string
}

// ── Mini iframe thumbnail ────────────────────────────────────────────────────
function buildDoc(tmpl: ApiTemplate): string {
  const layout = tmpl.layoutConfig || {}
  const bg = layout.background || '#ffffff'
  const font = layout.fontFamily || 'Inter'
  const primary = layout.primaryColor || '#1f2937'
  const accent = layout.accent || '#3b82f6'

  const html = tmpl.frontHTML || ''
  const css = tmpl.frontCSS || ''

  const filled = html ? replacePlaceholders(html, {
    name: 'Full Name', businessName: 'LOGO TEXT HERE',
    phone: '999-999-9999', email: 'hello@example.com',
    website: 'www.example.com', address: '123 Main St',
    tagline: 'Slogan Here', logoUrl: '', qrCodeUrl: '',
  }) : ''

  return `<!DOCTYPE html><html><head>
<meta charset="UTF-8"/>
<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;font-family:'${font}',sans-serif;overflow:hidden;background:${bg};}
:root{--bg:${bg};--primary:${primary};--accent:${accent};}
${css}
</style></head><body>${filled || `<div style="width:100%;height:100%;background:${bg};display:flex;align-items:center;justify-content:center;"><span style="color:${primary};font-size:11px;font-weight:700;opacity:0.5;">${tmpl.name}</span></div>`}</body></html>`
}

function TemplateThumbnail({ tmpl, selected, onClick }: { tmpl: ApiTemplate; selected: boolean; onClick: () => void }) {
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const doc = el.contentDocument
    if (doc) { doc.open(); doc.write(buildDoc(tmpl)); doc.close() }
  }, [tmpl._id])

  return (
    <button
      onClick={onClick}
      className={`group relative w-full rounded-lg overflow-hidden border-2 transition-all duration-150 ${
        selected
          ? 'border-blue-500 shadow-lg shadow-blue-100'
          : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
      }`}
      style={{ aspectRatio: '1.75' }}
      title={tmpl.name}
    >
      {/* iframe preview */}
      <div className="absolute inset-0 pointer-events-none">
        <iframe
          ref={ref}
          title={tmpl.name}
          sandbox="allow-same-origin"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-10">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}

      {/* PRO badge */}
      {tmpl.isPremium && (
        <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded z-10">
          <Crown className="w-2 h-2" /> PRO
        </div>
      )}

      {/* Hover overlay with name */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-150 flex items-end z-10">
        <div className="w-full px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-[10px] font-semibold truncate">{tmpl.name}</p>
        </div>
      </div>
    </button>
  )
}

// ── Panel ────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10

export default function TemplatesPanel({ onLoad }: { onLoad: (id: string) => void }) {
  const [apiTemplates, setApiTemplates] = useState<ApiTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [applying, setApplying] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [viewMode, setViewMode] = useState<'all' | 'categories'>('all')

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
    fetch(`${apiUrl}/templates?limit=100`)
      .then(r => {
        if (!r.ok) throw new Error('API error')
        return r.json()
      })
      .then(json => {
        const raw = json.data
        const list: ApiTemplate[] = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : []
        if (list.length > 0) setApiTemplates(list)
      })
      .catch(() => {
        // API down — stay with empty list, show message
      })
      .finally(() => setLoading(false))
  }, [])

  // Build category list dynamically from loaded templates
  const categories = useMemo(() => {
    const cats = Array.from(new Set(apiTemplates.map(t => t.category).filter(Boolean)))
    cats.sort()
    return [ALL_CAT, ...cats]
  }, [apiTemplates])

  const filtered = useMemo(() => {
    let list = apiTemplates
    if (activeCategory !== ALL_CAT) list = list.filter(t => t.category === activeCategory)
    if (search.trim()) list = list.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    )
    return list
  }, [apiTemplates, activeCategory, search])

  // Reset visible count when filter/search changes
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [activeCategory, search])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleApply = async (tmpl: ApiTemplate) => {
    setSelectedId(tmpl._id)
    setApplying(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
      const res = await fetch(`${apiUrl}/templates/${tmpl._id}`)
      const json = await res.json()
      const full = json.data || json
      // store full template in sessionStorage then call parent
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('qc_selected_template_full', JSON.stringify(full))
      }
      onLoad(tmpl._id)
    } catch {
      onLoad(tmpl._id)
    } finally {
      setApplying(false)
    }
  }

  return (
    <div className="flex flex-col h-full -mx-6 -mt-6">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Templates</h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* ALL / CATEGORIES tabs */}
        <div className="flex border-b border-gray-200 mb-3">
          <button
            onClick={() => { setViewMode('all'); setActiveCategory(ALL_CAT) }}
            className={`flex-1 py-2 text-[11px] font-bold transition-colors border-b-2 ${
              viewMode === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setViewMode('categories')}
            className={`flex-1 py-2 text-[11px] font-bold transition-colors border-b-2 ${
              viewMode === 'categories'
                ? 'border-red-500 text-red-500'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            CATEGORIES
          </button>
        </div>

        {/* Category filter pills — removed, use CATEGORIES tab instead */}
      </div>

      {/* Grid / Categories view */}
      <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: 'thin' }}>

        {/* ── CATEGORIES view — dark button grid like BrandCrowd ── */}
        {viewMode === 'categories' && (
          <div>
            <p className="text-[10px] text-gray-400 mb-3">Select a category to browse</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.slice(1).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setViewMode('all') }}
                  className={`py-3 px-3 rounded-lg text-[11px] font-bold capitalize text-left transition-all ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
              {/* "All Templates" button */}
              <button
                onClick={() => { setActiveCategory(ALL_CAT); setViewMode('all') }}
                className="py-3 px-3 rounded-lg text-[11px] font-bold text-left bg-blue-700 text-white hover:bg-blue-600 transition-all col-span-2"
              >
                ✦ All Templates ({apiTemplates.length})
              </button>
            </div>
          </div>
        )}

        {/* ── ALL view — template thumbnails ── */}
        {viewMode === 'all' && (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 px-4">
                {apiTemplates.length === 0 ? (
                  <>
                    <div className="text-3xl mb-3">🔌</div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Server not connected</p>
                    <p className="text-[11px] text-gray-400">Start the backend to load templates</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-gray-400">No templates in "{activeCategory}"</p>
                    <button onClick={() => setActiveCategory(ALL_CAT)}
                      className="mt-2 text-[11px] text-blue-500 hover:text-blue-700 font-medium">
                      Show all templates
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {visible.map(tmpl => (
                  <div key={tmpl._id} className="space-y-1">
                    <TemplateThumbnail
                      tmpl={tmpl}
                      selected={selectedId === tmpl._id}
                      onClick={() => handleApply(tmpl)}
                    />
                    <div className="flex items-center justify-between px-0.5">
                      <span className="text-[10px] text-gray-500 truncate capitalize">{tmpl.category}</span>
                      <button
                        onClick={() => handleApply(tmpl)}
                        disabled={applying && selectedId === tmpl._id}
                        className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold"
                      >
                        {applying && selectedId === tmpl._id ? 'Applying...' : 'Use Template →'}
                      </button>
                    </div>
                  </div>
                ))}

                {hasMore && (
                  <button
                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                    className="w-full py-2.5 mt-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    LOAD MORE TEMPLATES
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
