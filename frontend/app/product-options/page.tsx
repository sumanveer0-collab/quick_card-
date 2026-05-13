'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, ArrowRight, Check, Package, Sparkles,
  CreditCard, Layers, Droplets, Box
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useProductStore } from '@/store/product.store'
import { useEditorStore } from '@/store/editor.store'
import toast from 'react-hot-toast'

export default function ProductOptionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const designId = searchParams.get('designId')
  
  const { selections, setSelection, calculateTotalPrice } = useProductStore()
  const { elements, background } = useEditorStore()
  
  const [isProcessing, setIsProcessing] = useState(false)

  // Product options
  const orientations = [
    { value: 'horizontal', label: 'Horizontal', size: '9cm × 5.2cm' },
    { value: 'vertical', label: 'Vertical', size: '5.2cm × 9cm' },
  ]

  const materials = [
    { 
      value: 'standard', 
      label: 'Standard Paper', 
      weight: '300gsm',
      description: 'Premium quality paper',
      price: 0 
    },
    { 
      value: 'premium', 
      label: 'Premium Cardstock', 
      weight: '400gsm',
      description: 'Luxury thick cardstock',
      price: 50 
    },
    { 
      value: 'plastic', 
      label: 'Plastic Cards', 
      weight: 'PVC',
      description: 'Waterproof plastic material',
      price: 150 
    },
  ]

  const finishes = [
    { 
      value: 'matte', 
      label: 'Matte Finish', 
      description: 'Non-reflective, elegant surface',
      price: 0 
    },
    { 
      value: 'glossy', 
      label: 'Glossy Finish', 
      description: 'Shiny surface with vibrant colors',
      price: 25 
    },
    { 
      value: 'uv', 
      label: 'UV Coating', 
      description: 'Extra protection with premium shine',
      price: 75 
    },
  ]

  const quantities = [
    { value: '50', label: '50 Cards', price: 299 },
    { value: '100', label: '100 Cards', price: 499, popular: true },
    { value: '250', label: '250 Cards', price: 899 },
    { value: '500', label: '500 Cards', price: 1499 },
    { value: '1000', label: '1000 Cards', price: 2499 },
  ]

  const cornerStyles = [
    { value: 'square', label: 'Square Corners' },
    { value: 'rounded', label: 'Rounded Corners' },
  ]

  const handleBack = () => {
    if (designId) {
      router.push(`/customize?designId=${designId}`)
    } else {
      router.push('/customize')
    }
  }

  const handleContinue = async () => {
    setIsProcessing(true)
    
    try {
      // Save product selections
      toast.success('Product options saved!')
      
      // Navigate to checkout
      setTimeout(() => {
        router.push('/checkout')
      }, 500)
    } catch (error) {
      console.error('Failed to save options:', error)
      toast.error('Failed to save options')
    } finally {
      setIsProcessing(false)
    }
  }

  const totalPrice = calculateTotalPrice()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {['Choose Template', 'Customize', 'Preview', 'Product Options', 'Checkout'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index === 3 
                      ? 'bg-blue-600 text-white' 
                      : index < 3 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index < 3 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`text-xs mt-1 ${
                    index === 3 ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
                {index < 4 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    index < 3 ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Product Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Options</h1>
              <p className="text-gray-600">Customize your business card specifications</p>
            </div>

            {/* Orientation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Card Orientation</h3>
                  <p className="text-sm text-gray-500">Choose your card layout</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {orientations.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelection('orientation', option.value)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selections.orientation === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500">{option.size}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Paper Material</h3>
                  <p className="text-sm text-gray-500">Select card material type</p>
                </div>
              </div>
              <div className="space-y-3">
                {materials.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelection('material', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selections.material === option.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.weight} • {option.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {option.price === 0 ? 'Included' : `+₹${option.price}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Finish */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Finish Type</h3>
                  <p className="text-sm text-gray-500">Choose surface finish</p>
                </div>
              </div>
              <div className="space-y-3">
                {finishes.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelection('finish', option.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selections.finish === option.value
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-500">{option.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {option.price === 0 ? 'Included' : `+₹${option.price}`}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Box className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Quantity</h3>
                  <p className="text-sm text-gray-500">How many cards do you need?</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {quantities.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelection('quantity', option.value)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selections.quantity === option.value
                        ? 'border-orange-600 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.popular && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="text-center">
                      <p className="font-bold text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500 mt-1">₹{option.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Orientation</span>
                    <span className="font-medium text-gray-900">
                      {orientations.find(o => o.value === selections.orientation)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Material</span>
                    <span className="font-medium text-gray-900">
                      {materials.find(m => m.value === selections.material)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Finish</span>
                    <span className="font-medium text-gray-900">
                      {finishes.find(f => f.value === selections.finish)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium text-gray-900">
                      {selections.quantity} cards
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">₹{totalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleContinue}
                    disabled={isProcessing}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-xl transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Continue to Checkout'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={handleBack}
                    className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Editor
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-3">What's Included</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Premium quality printing at 300 DPI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Professional bleed and trim marks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Fast delivery within 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>100% satisfaction guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
