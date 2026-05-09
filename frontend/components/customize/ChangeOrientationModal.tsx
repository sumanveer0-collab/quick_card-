'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useProductStore } from '@/store/product.store'
import { useEditorStore } from '@/store/editor.store'

interface ChangeOrientationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangeOrientationModal({ isOpen, onClose }: ChangeOrientationModalProps) {
  const { selections, setSelection, calculateTotalPrice } = useProductStore()
  const { elements } = useEditorStore()
  const [selectedOrientation, setSelectedOrientation] = useState(selections.orientation)

  const handleConfirm = () => {
    setSelection('orientation', selectedOrientation)
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
              <h2 className="text-xl font-bold text-gray-900">Change orientation</h2>
              <p className="text-sm text-gray-500 mt-1">The design adjusts to your selected options.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex">
            {/* Preview Panel */}
            <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
              <div className="relative">
                {/* Business Card Preview */}
                <div
                  className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl transition-all duration-500 ${
                    selectedOrientation === 'horizontal' 
                      ? 'w-80 h-48' // Landscape
                      : 'w-64 h-96' // Portrait
                  }`}
                >
                  {/* Card Content */}
                  <div className="w-full h-full p-6 flex flex-col justify-center items-center text-center text-white relative overflow-hidden">
                    {/* Decorative border */}
                    <div className="absolute inset-4 border border-yellow-600 rounded opacity-30"></div>
                    
                    {/* Content based on orientation */}
                    {selectedOrientation === 'horizontal' ? (
                      // Horizontal Layout
                      <div className="space-y-3">
                        <h1 className="text-lg font-bold text-yellow-400 tracking-wider">FULL NAME</h1>
                        <p className="text-sm text-gray-300">Job Title</p>
                        
                        {/* Decorative line */}
                        <div className="flex items-center justify-center my-3">
                          <div className="h-px bg-yellow-600 flex-1 max-w-16"></div>
                          <div className="mx-3 text-yellow-400 text-xs">◆◇◆</div>
                          <div className="h-px bg-yellow-600 flex-1 max-w-16"></div>
                        </div>
                        
                        <h2 className="text-base font-semibold text-yellow-400 tracking-wide">COMPANY NAME</h2>
                        <div className="text-xs text-gray-300 space-y-1">
                          <p>Phone / Other</p>
                          <div className="flex justify-center gap-4">
                            <span>Address Line 1</span>
                            <span>Email / Other</span>
                          </div>
                          <div className="flex justify-center gap-4">
                            <span>Address Line 2</span>
                            <span>Web / Other</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Vertical Layout
                      <div className="space-y-4">
                        <h1 className="text-xl font-bold text-yellow-400 tracking-wider">FULL NAME</h1>
                        <p className="text-sm text-gray-300">Job Title</p>
                        
                        {/* Decorative line */}
                        <div className="flex items-center justify-center my-4">
                          <div className="h-px bg-yellow-600 flex-1 max-w-20"></div>
                          <div className="mx-3 text-yellow-400">◆◇◆</div>
                          <div className="h-px bg-yellow-600 flex-1 max-w-20"></div>
                        </div>
                        
                        <h2 className="text-lg font-semibold text-yellow-400 tracking-wide">COMPANY NAME</h2>
                        <div className="text-xs text-gray-300 space-y-2">
                          <p>Phone / Other</p>
                          <p>Address Line 1</p>
                          <p>Address Line 2</p>
                          <div className="border-t border-gray-600 pt-2 mt-3">
                            <p>Email / Other</p>
                            <p>Web / Other</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Front/Back Tabs */}
                <div className="flex justify-center mt-6 gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg">
                    Front
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                    Back
                  </button>
                </div>
              </div>
            </div>

            {/* Options Panel */}
            <div className="w-80 bg-white p-6 border-l border-gray-200">
              <div className="space-y-6">
                {/* Product Orientation */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Product Orientation</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedOrientation('vertical')}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedOrientation === 'vertical'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="w-8 h-12 bg-gray-300 rounded mx-auto mb-2"></div>
                      <span className="text-sm font-medium">Vertical</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedOrientation('horizontal')}
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        selectedOrientation === 'horizontal'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="w-12 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                      <span className="text-sm font-medium">Horizontal</span>
                    </button>
                  </div>
                </div>

                {/* Spacer */}
                <div className="flex-1"></div>

                {/* Price and Confirm */}
                <div className="space-y-4">
                  {/* Price */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {selections.quantity} for ₹{calculateTotalPrice()}.00
                    </p>
                  </div>

                  {/* Confirm Button */}
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Confirm selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}