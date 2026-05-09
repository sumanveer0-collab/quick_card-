import { create } from 'zustand'

export interface ProductSelection {
  orientation: 'vertical' | 'horizontal'
  material: 'standard' | 'premium' | 'plastic'
  finish: 'matte' | 'glossy' | 'uv'
  quantity: '50' | '100' | '250' | '500' | '1000'
}

export interface ProductPricing {
  basePrice: number
  materialUpgrade: Record<string, number>
  finishUpgrade: Record<string, number>
  quantityPricing: Record<string, number>
}

interface ProductStore {
  // State
  selections: ProductSelection
  pricing: ProductPricing
  isOptionsModalOpen: boolean
  
  // Actions
  setSelection: (category: keyof ProductSelection, value: string) => void
  setSelections: (selections: Partial<ProductSelection>) => void
  openOptionsModal: () => void
  closeOptionsModal: () => void
  calculateTotalPrice: () => number
  resetSelections: () => void
}

const defaultSelections: ProductSelection = {
  orientation: 'vertical',
  material: 'standard',
  finish: 'matte',
  quantity: '100'
}

const defaultPricing: ProductPricing = {
  basePrice: 0,
  materialUpgrade: {
    standard: 0,
    premium: 50,
    plastic: 150
  },
  finishUpgrade: {
    matte: 0,
    glossy: 25,
    uv: 75
  },
  quantityPricing: {
    '50': 299,
    '100': 499,
    '250': 899,
    '500': 1499,
    '1000': 2499
  }
}

export const useProductStore = create<ProductStore>((set, get) => ({
  // Initial state
  selections: defaultSelections,
  pricing: defaultPricing,
  isOptionsModalOpen: false,

  // Actions
  setSelection: (category, value) => {
    set((state) => ({
      selections: {
        ...state.selections,
        [category]: value
      }
    }))
  },

  setSelections: (newSelections) => {
    set((state) => ({
      selections: {
        ...state.selections,
        ...newSelections
      }
    }))
  },

  openOptionsModal: () => {
    set({ isOptionsModalOpen: true })
  },

  closeOptionsModal: () => {
    set({ isOptionsModalOpen: false })
  },

  calculateTotalPrice: () => {
    const { selections, pricing } = get()
    
    let total = pricing.basePrice
    total += pricing.materialUpgrade[selections.material] || 0
    total += pricing.finishUpgrade[selections.finish] || 0
    total += pricing.quantityPricing[selections.quantity] || 0
    
    return total
  },

  resetSelections: () => {
    set({ selections: defaultSelections })
  }
}))

// Product configuration helpers
export const getProductDimensions = (orientation: 'vertical' | 'horizontal') => {
  return orientation === 'horizontal' 
    ? { width: '5.2cm', height: '9cm', aspect: 'landscape' }
    : { width: '9cm', height: '5.2cm', aspect: 'portrait' }
}

export const getMaterialInfo = (material: string) => {
  const materials = {
    standard: { name: 'Standard Paper', weight: '300gsm', description: 'Premium quality paper' },
    premium: { name: 'Premium Cardstock', weight: '400gsm', description: 'Luxury thick cardstock' },
    plastic: { name: 'Plastic Cards', weight: 'PVC', description: 'Waterproof plastic material' }
  }
  return materials[material as keyof typeof materials]
}

export const getFinishInfo = (finish: string) => {
  const finishes = {
    matte: { name: 'Matte Finish', description: 'Non-reflective, elegant surface' },
    glossy: { name: 'Glossy Finish', description: 'Shiny surface with vibrant colors' },
    uv: { name: 'UV Coating', description: 'Extra protection with premium shine' }
  }
  return finishes[finish as keyof typeof finishes]
}