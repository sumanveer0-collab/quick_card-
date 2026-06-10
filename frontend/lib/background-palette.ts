export const BACKGROUND_SWATCHES = [
  '#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280',
  '#374151', '#1F2937', '#111827', '#000000', '#FEF2F2', '#FEE2E2',
  '#FECACA', '#FCA5A5', '#EF4444', '#DC2626', '#FFEDD5', '#FED7AA',
  '#FDBA74', '#FB923C', '#F97316', '#EA580C', '#FEF9C3', '#FEF08A',
  '#FDE047', '#FACC15', '#EAB308', '#CA8A04', '#DCFCE7', '#BBF7D0',
  '#86EFAC', '#4ADE80', '#22C55E', '#16A34A', '#CCFBF1', '#99F6E4',
  '#5EEAD4', '#2DD4BF', '#14B8A6', '#0D9488', '#DBEAFE', '#BFDBFE',
  '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#EDE9FE', '#DDD6FE',
  '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#FCE7F3', '#FBCFE8',
  '#F9A8D4', '#F472B6', '#EC4899', '#DB2777',
]

export const BACKGROUND_GRADIENTS = [
  { name: 'Blue Ocean', value: 'linear-gradient(135deg, #0369a1 0%, #0891b2 100%)' },
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' },
  { name: 'Emerald', value: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' },
  { name: 'Royal', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Rose', value: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)' },
  { name: 'Midnight', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  { name: 'Gold', value: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
  { name: 'Teal', value: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)' },
  { name: 'Indigo', value: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { name: 'Coral', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
]

const RECENT_KEY = 'qc_recent_bg_colors'
const MAX_RECENT = 8

export function isGradientBackground(value: string) {
  return value.includes('gradient')
}

export function toPickerHex(value: string): string {
  if (isGradientBackground(value)) return '#FFFFFF'
  if (/^#[0-9a-fA-F]{6}$/.test(value)) return value.toUpperCase()
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const h = value.slice(1)
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toUpperCase()
  }
  return '#FFFFFF'
}

export function readRecentBackgroundColors(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list.filter(c => typeof c === 'string').slice(0, MAX_RECENT) : []
  } catch {
    return []
  }
}

export function pushRecentBackgroundColor(color: string) {
  if (typeof window === 'undefined' || isGradientBackground(color)) return
  if (!/^#[0-9a-fA-F]{6}$/i.test(color)) return
  const normalized = color.toUpperCase()
  const next = [normalized, ...readRecentBackgroundColors().filter(c => c !== normalized)].slice(0, MAX_RECENT)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}
