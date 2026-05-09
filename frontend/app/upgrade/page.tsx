'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Check, Zap, ArrowLeft, Loader2, CreditCard, Smartphone } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import api from '@/lib/api'

const FEATURES_FREE = ['3 cards', '6 templates', 'Share link', 'QR code', 'Watermark on card']
const FEATURES_PRO = ['Unlimited cards', '20+ premium templates', 'No watermark', '5 print-ready exports/month', 'AI card generator (30/day)', 'Priority support']

declare global { interface Window { Razorpay: any } }

export default function UpgradePage() {
  const router = useRouter()
  const [loading, setLoading] = useState<'razorpay' | 'phonepe' | null>(null)

  const payWithRazorpay = async () => {
    setLoading('razorpay')
    try {
      const { data } = await api.post('/payment/create-order', { gateway: 'razorpay' })
      const { orderId, amount, keyId } = data.data

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)

      script.onload = () => {
        const rzp = new window.Razorpay({
          key: keyId,
          amount,
          currency: 'INR',
          name: 'QuickCard',
          description: 'Pro Plan – ₹99/month',
          order_id: orderId,
          handler: async (response: any) => {
            try {
              await api.post('/payment/verify', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
              toast.success('🎉 Welcome to Pro!')
              router.push('/')
            } catch { toast.error('Payment verification failed') }
          },
          prefill: { name: 'QuickCard User' },
          theme: { color: '#2563eb' },
        })
        rzp.open()
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(null)
    }
  }

  const payWithPhonePe = async () => {
    setLoading('phonepe')
    try {
      const { data } = await api.post('/payment/create-order', { gateway: 'phonepe' })
      if (data.data.paymentUrl && data.data.paymentUrl !== '#dev-mode') {
        window.location.href = data.data.paymentUrl
      } else {
        toast('PhonePe in dev mode — no redirect', { icon: '⚠️' })
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/" className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Upgrade to Pro</h1>
            <p className="text-gray-500">Unlock all features for just ₹99/month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Free Plan */}
          <div className="bg-white rounded-3xl p-8 border border-gray-200">
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-1">FREE</p>
              <p className="text-4xl font-bold text-gray-900">₹0</p>
              <p className="text-gray-400 text-sm">Forever free</p>
            </div>
            <ul className="space-y-3">
              {FEATURES_FREE.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-gray-400 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro Plan */}
          <motion.div
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-brand-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-yellow-300" />
                <p className="text-sm font-medium text-blue-200">PRO</p>
              </div>
              <p className="text-4xl font-bold">₹99</p>
              <p className="text-blue-200 text-sm">per month</p>
            </div>
            <ul className="space-y-3 mb-8">
              {FEATURES_PRO.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-blue-100">
                  <Check className="w-4 h-4 text-yellow-300 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>

            {/* Payment Buttons */}
            <div className="space-y-3">
              <button onClick={payWithRazorpay} disabled={!!loading} className="w-full bg-white text-brand-600 font-bold py-3 rounded-2xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                {loading === 'razorpay' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Pay with Razorpay
              </button>
              <button onClick={payWithPhonePe} disabled={!!loading} className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                {loading === 'phonepe' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                Pay with PhonePe
              </button>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-xs text-gray-400">Secure payment · Cancel anytime · Instant activation</p>
      </div>
    </div>
  )
}
