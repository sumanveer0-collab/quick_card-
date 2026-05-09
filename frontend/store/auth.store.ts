import { create } from 'zustand'
import api from '@/lib/api'

interface User {
  _id: string
  name: string
  email?: string
  phone?: string
  plan: 'free' | 'pro'
  avatarUrl?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  logout: () => void
  fetchProfile: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null })
    window.location.href = '/login'
  },

  fetchProfile: async () => {
    set({ loading: true })
    try {
      const { data } = await api.get('/user/profile')
      set({ user: data.data })
    } catch {
      set({ user: null })
    } finally {
      set({ loading: false })
    }
  },
}))
