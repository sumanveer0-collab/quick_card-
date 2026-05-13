import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TemplateData {
  _id: string
  name: string
  category: string
  thumbnailUrl?: string
  previewImage: string
  isPremium: boolean
  isFeatured?: boolean
  layoutConfig: {
    background?: string
    primaryColor?: string
    secondaryColor?: string
    fontFamily?: string
    accent?: string
    [key: string]: any
  }
  frontHTML?: string
  backHTML?: string
  frontCSS?: string
  backCSS?: string
  description?: string
  colorPalette?: string[]
  // Canvas data for direct loading
  frontCanvasJson?: any
  backCanvasJson?: any
  // Metadata
  tags?: string[]
  colors?: string[]
  fonts?: string[]
}

interface TemplateState {
  // Selected template
  selectedTemplate: TemplateData | null
  
  // Template loading state
  isLoadingTemplate: boolean
  templateLoadError: string | null
  
  // Actions
  setSelectedTemplate: (template: TemplateData | null) => void
  clearSelectedTemplate: () => void
  setLoadingState: (loading: boolean, error?: string | null) => void
  
  // Template data management
  getTemplateById: (id: string) => Promise<TemplateData | null>
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      selectedTemplate: null,
      isLoadingTemplate: false,
      templateLoadError: null,

      setSelectedTemplate: (template) => {
        set({ 
          selectedTemplate: template,
          templateLoadError: null 
        })
      },

      clearSelectedTemplate: () => {
        set({ 
          selectedTemplate: null,
          templateLoadError: null 
        })
      },

      setLoadingState: (loading, error = null) => {
        set({ 
          isLoadingTemplate: loading,
          templateLoadError: error 
        })
      },

      getTemplateById: async (id: string) => {
        try {
          set({ isLoadingTemplate: true, templateLoadError: null })
          
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'
          const response = await fetch(`${apiUrl}/templates/${id}`)
          
          if (!response.ok) {
            throw new Error(`Failed to fetch template: ${response.statusText}`)
          }
          
          const data = await response.json()
          const template = data.data || data
          
          set({ 
            selectedTemplate: template,
            isLoadingTemplate: false 
          })
          
          return template
        } catch (error: any) {
          set({ 
            isLoadingTemplate: false,
            templateLoadError: error.message 
          })
          return null
        }
      },
    }),
    {
      name: 'quickcard-template-storage',
      partialize: (state) => ({ 
        selectedTemplate: state.selectedTemplate 
      }),
    }
  )
)
