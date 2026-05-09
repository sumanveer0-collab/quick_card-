'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { CreditCard, Phone, Mail, ArrowRight, Loader2, Zap, Eye, EyeOff } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth.store'

type Mode = 'phone' | 'email'
type Step = 'input' | 'otp'

const DEMO_EMAIL = 'demo@quickcard.app'
const DEMO_PASSWORD = 'Demo@1234'
const DEMO_NAME = 'Demo User'

export default function LoginPage() {
  const router = useRouter()
  const { fetchProfile } = useAuthStore()
  const [mode, setMode] = useState<Mode>('email')
  const [step, setStep] = useState<Step>('input')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Phone OTP
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  // Email
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')

  // ── Demo auto-fill ──────────────────────────────────────────────────────
  const fillDemo = () => {
    setMode('email')
    setIsRegister(false)
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASSWORD)
    toast('Demo credentials filled! Click Login.', { icon: '⚡', duration: 3000 })
  }

  // ── OTP ─────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (phone.length !== 10) return toast.error('Enter a valid 10-digit number')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/send-otp', { phone })
      toast.success('OTP sent!')
      if (data.data?.otp) {
        toast(`Dev OTP: ${data.data.otp}`, { icon: '🔑', duration: 15000 })
        setOtp(data.data.otp) // auto-fill OTP in dev
      }
      setStep('otp')
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to send OTP'
      toast.error(msg)
      console.error('OTP error:', e.response?.data || e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/verify-otp', { phone, otp })
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      await fetchProfile()
      toast.success('Welcome to QuickCard!')
      router.push('/')
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Invalid OTP'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── Email Auth ───────────────────────────────────────────────────────────
  const handleEmailAuth = async () => {
    if (!email || !password) return toast.error('Enter email and password')
    if (isRegister && !name) return toast.error('Enter your name')
    setLoading(true)
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login'
      const payload = isRegister ? { name, email, password } : { email, password }
      const { data } = await api.post(endpoint, payload)
      localStorage.setItem('accessToken', data.data.accessToken)
      localStorage.setItem('refreshToken', data.data.refreshToken)
      await fetchProfile()
      toast.success(isRegister ? '🎉 Account created!' : '👋 Welcome back!')
      router.push('/')
    } catch (e: any) {
      // Show the real server error message
      const serverMsg = e.response?.data?.message
      const networkErr = e.code === 'ERR_NETWORK' || e.code === 'ECONNREFUSED'

      if (networkErr || !e.response) {
        toast.error('Backend not running. Start it with: node bootstrap.js', { duration: 8000 })
      } else if (Array.isArray(serverMsg)) {
        toast.error(serverMsg[0], { duration: 5000 })
      } else {
        toast.error(serverMsg || 'Authentication failed', { duration: 5000 })
      }
      console.error('Auth error:', e.response?.data || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-3xl mb-4 shadow-lg shadow-blue-200">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">QuickCard</h1>
          <p className="text-gray-500 text-sm mt-1">Your Business Card Mitra</p>
        </div>

        {/* ── Demo Banner ── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fillDemo}
          className="w-full mb-4 flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl px-5 py-3.5 shadow-lg shadow-blue-200"
        >
          <div className="text-left">
            <p className="font-bold text-sm">⚡ Try Demo Account</p>
            <p className="text-blue-200 text-xs mt-0.5">{DEMO_EMAIL} · {DEMO_PASSWORD}</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold">
            Auto Fill →
          </div>
        </motion.button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 p-8 border border-gray-100">
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            {(['phone', 'email'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setStep('input') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {m === 'phone' ? <Phone className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                {m === 'phone' ? 'Phone OTP' : 'Email'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── Phone OTP ── */}
            {mode === 'phone' ? (
              <motion.div key="phone" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                {step === 'input' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Mobile Number</label>
                      <div className="flex gap-2">
                        <span className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-500 font-medium whitespace-nowrap">+91</span>
                        <input
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="9876543210"
                          maxLength={10}
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                          onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500 text-center">
                      OTP sent to <span className="font-semibold text-gray-900">+91 {phone}</span>
                    </p>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Enter OTP</label>
                      <input
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-[0.5em] font-bold"
                        placeholder="••••••"
                        maxLength={6}
                        value={otp}
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                      />
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Login'}
                    </button>
                    <button onClick={() => setStep('input')} className="w-full text-sm text-gray-500 hover:text-gray-700">
                      ← Change number
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              /* ── Email ── */
              <motion.div key="email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full Name</label>
                    <input
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Rahul Sharma"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                  <input
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 pr-11 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleEmailAuth}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : isRegister ? 'Create Account' : 'Login'
                  }
                </button>

                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="w-full text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Access to Editor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-500">
                or skip login
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/customize')}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-4 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all shadow-sm"
          >
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span>Start Designing Business Card</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </motion.button>
          
          <p className="text-center text-xs text-gray-400 mt-3">
            No login required • Try the editor instantly
          </p>
        </motion.div>

        {/* Backend status hint */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Frontend: <span className="font-mono">localhost:3000</span> · API: <span className="font-mono">localhost:3001</span>
        </p>
      </motion.div>
    </div>
  )
}
