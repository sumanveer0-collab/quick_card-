'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Package, Palette, Ruler, FileText } from 'lucide-react'

interface ProductOption {
  id: string
  name: string
  description?: string
  price?: number
  image?: string
}

interface ProductCategory {
  id: string
  name: string
  icon: any
  options: ProductOption[]
}

interface ProductOptionsModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selections: Record<string, string>) => void
  productType?: 'business-card' | 'flyer' | 'poster' | 'brochure'
}

export default function ProductOptionsModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  productType = 'business-card' 
}: ProductOptionsModalProps) {
  const [selections, setSelections] = useState<Record<string, string>>({
    orientation: 'vertical',
    material: 'standard',
    finish: 'matte',
    quantity: '100'
  })

  const productCategories: ProductCategory[] = [
    {
      id: 'orientation',
      name: 'Product Orientation',
      icon: Ruler,
      options: [
        { id: 'vertical', name: 'Vertical', description: '9cm × 5.2cm (Portrait)' },
        { id: 'horizontal', name: 'Horizontal', description: '5.2cm × 9cm (Landscape)' }
      ]
    },
    {
      id: 'material',
      name: 'Material Type',
      icon: FileText,
      options: [
        { id: 'standard', name: 'Standard Paper', description: '300gsm Premium', price: 0 },
        { id: 'premium', name: 'Premium Cardstock', description: '400gsm Luxury', price: 50 },
        { id: 'plastic', name: 'Plastic Cards', description: 'Waterproof PVC', price: 150 }
      ]
    },
    {
      id: 'finish',
      name: 'Finish Options',
      icon: Palette,
      options: [
        { id: 'matte', name: 'Matte Finish', description: 'Non-reflective surface', price: 0 },
        { id: 'glossy', name: 'Glossy Finish', description: 'Shiny, vibrant colors', price: 25 },
        { id: 'uv', name: 'UV Coating', description: 'Extra protection & shine', price: 75 }
      ]
    },
    {
      id: 'quantity',
      name: 'Quantity',
      icon: Package,
      options: [
        { id: '50', name: '50 Cards', price: 299 },
        { id: '100', name: '100 Cards', price: 499 },
        { id: '250', name: '250 Cards', price: 899 },
        { id: '500', name: '500 Cards', price: 1499 },
        { id: '1000', name: '1000 Cards', price: 2499 }
      ]
    }
  ]

  const handleOptionSelect = (categoryId: string, optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: optionId
    }))
  }

  const calculateTotalPrice = () => {
    let total = 0
    productCategories.forEach(category => {
      const selectedOption = category.options.find(opt => opt.id === selections[category.id])
      if (selectedOption?.price) {
        total += selectedOption.price
      }
    })
    return total
  }

  const handleConfirm = () => {
    onConfirm(selections)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Product Options</h2>
              <p className="text-gray-600 mt-1">Customize your design for printing</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex">
            {/* Options Panel */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-8">
                {productCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <div key={category.id}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.options.map((option) => {
                          const isSelected = selections[category.id] === option.id
                          return (
                            <motion.button
                              key={option.id}
                              onClick={() => handleOptionSelect(category.id, option.id)}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">{option.name}</span>
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-blue-600" />
                                    )}
                                  </div>
                                  {option.description && (
                                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                  )}
                                </div>
                                {option.price !== undefined && (
                                  <div className="text-right">
                                    <span className="text-lg font-bold text-gray-900">
                                      ₹{option.price}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Preview & Summary Panel */}
            <div className="w-80 bg-gray-50 p-6 border-l border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              {/* Preview */}
              <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
                <div className="text-center">
                  <div className={`mx-auto mb-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg ${
                    selections.orientation === 'horizontal' ? 'w-24 h-16' : 'w-16 h-24'
                  }`}>
                    <div className="w-full h-full flex items-center justify-center text-white text-xs font-medium">
                      Preview
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selections.orientation === 'horizontal' ? '5.2cm × 9cm' : '9cm × 5.2cm'}
                  </p>
                </div>
              </div>

              {/* Selected Options */}
              <div className="space-y-3 mb-6">
                {productCategories.map((category) => {
                  const selectedOption = category.options.find(opt => opt.id === selections[category.id])
                  if (!selectedOption) return null
                  
                  return (
                    <div key={category.id} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category.name}:</span>
                      <span className="text-sm font-medium text-gray-900">{selectedOption.name}</span>
                    </div>
                  )
                })}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                {productCategories.map((category) => {
                  const selectedOption = category.options.find(opt => opt.id === selections[category.id])
                  if (!selectedOption?.price) return null
                  
                  return (
                    <div key={category.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{selectedOption.name}</span>
                      <span className="text-gray-900">₹{selectedOption.price}</span>
                    </div>
                  )
                })}
                
                <div className="border-t border-gray-200 pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">₹{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={handleConfirm}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Confirm Selection
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}