'use client'
import { motion } from 'framer-motion'
import { Settings, Package, Palette, Ruler, FileText, ChevronRight } from 'lucide-react'
import { useProductStore, getProductDimensions, getMaterialInfo, getFinishInfo } from '@/store/product.store'

export default function ProductOptionsPanel() {
  const { 
    selections, 
    openOptionsModal, 
    calculateTotalPrice 
  } = useProductStore()

  const dimensions = getProductDimensions(selections.orientation)
  const materialInfo = getMaterialInfo(selections.material)
  const finishInfo = getFinishInfo(selections.finish)

  const quickOptions = [
    {
      icon: Ruler,
      label: 'Orientation',
      value: selections.orientation === 'horizontal' ? 'Landscape' : 'Portrait',
      detail: `${dimensions.width} × ${dimensions.height}`
    },
    {
      icon: FileText,
      label: 'Material',
      value: materialInfo?.name || 'Standard',
      detail: materialInfo?.weight || '300gsm'
    },
    {
      icon: Palette,
      label: 'Finish',
      value: finishInfo?.name || 'Matte',
      detail: finishInfo?.description || ''
    },
    {
      icon: Package,
      label: 'Quantity',
      value: `${selections.quantity} Cards`,
      detail: `₹${calculateTotalPrice()}`
    }
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Product Options</h3>
        <button
          onClick={openOptionsModal}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Open Full Options"
        >
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Quick Options */}
      <div className="space-y-3">
        {quickOptions.map((option, index) => {
          const Icon = option.icon
          return (
            <motion.div
              key={option.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{option.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{option.value}</span>
                  </div>
                  {option.detail && (
                    <p className="text-xs text-gray-500 mt-1">{option.detail}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Total Price */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total Price</span>
          <span className="text-xl font-bold text-blue-600">₹{calculateTotalPrice()}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Including all customizations</p>
      </div>

      {/* Customize Button */}
      <button
        onClick={openOptionsModal}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold py-3 px-4 rounded-lg transition-opacity flex items-center justify-center gap-2"
      >
        <Settings className="w-4 h-4" />
        Customize Options
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            const newOrientation = selections.orientation === 'vertical' ? 'horizontal' : 'vertical'
            useProductStore.getState().setSelection('orientation', newOrientation)
          }}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          Flip Card
        </button>
        <button
          onClick={() => {
            const quantities = ['50', '100', '250', '500', '1000']
            const currentIndex = quantities.indexOf(selections.quantity)
            const nextIndex = (currentIndex + 1) % quantities.length
            useProductStore.getState().setSelection('quantity', quantities[nextIndex])
          }}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
        >
          Change Qty
        </button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Print-ready • 300 DPI • Professional Quality</p>
      </div>
    </div>
  )
}