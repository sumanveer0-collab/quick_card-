'use client'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Upload, Palette, Layers, Settings, Layout
} from 'lucide-react'
import { useEditorStore } from '@/store/editor.store'
import { useState, useMemo } from 'react'
import { templates } from '@/lib/templates'
import { applyCatalogDesignToEditor, resolveDesignIdFromKey } from '@/lib/templates/catalog-templates'
import ProductOptionsPanel from './ProductOptionsPanel'
import { GraphicsSidebar } from '../graphics/modern'
import DynamicTextFieldsPanel from './DynamicTextFieldsPanel'
import ColorPanel from './ColorPanel'
import BackgroundColorPanel from './BackgroundColorPanel'
import TemplatesPanel from './TemplatesPanel'
import toast from 'react-hot-toast'

type TabType = 'text' | 'uploads' | 'graphics' | 'background' | 'templates' | 'color'

interface CustomizeSidebarProps {
  activeTab: TabType
}

export default function CustomizeSidebar({ activeTab }: CustomizeSidebarProps) {
  const { addElement, setBackground } = useEditorStore()
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

  const handleLoadTemplate = async (templateId: string) => {
    const store = useEditorStore.getState()

    const designId = resolveDesignIdFromKey(templateId)
    if (designId) {
      const resolved = applyCatalogDesignToEditor(designId, {
        reset: () => store.reset(),
        setBackground,
        setTemplateHtml: store.setTemplateHtml,
        addElement,
      })
      if (resolved) {
        toast.success(`"${resolved.name}" loaded!`)
        return
      }
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
      const res = await fetch(`${apiUrl}/templates/${templateId}`)
      const json = await res.json()
      const tmpl = json.data || json

      if (tmpl && tmpl.frontHTML) {
        store.reset()
        setBackground(tmpl.layoutConfig?.background || '#ffffff')
        store.setTemplateHtml(tmpl.frontHTML, tmpl.frontCSS || '')
        toast.success(`"${tmpl.name}" loaded!`)
        return
      }
    } catch {}

    const template = templates.find((t) => t.id === templateId)
    if (!template) return
    store.reset()
    setBackground(template.background)
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
            <BackgroundColorPanel />
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <TemplatesPanel onLoad={handleLoadTemplate} />
          )}

          {/* COLOR TAB */}
          {activeTab === 'color' && (
            <ColorPanel />
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  )
}
