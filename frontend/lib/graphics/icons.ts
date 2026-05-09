import { IconData } from '@/types/graphics.types'

export const BUSINESS_ICONS: IconData[] = [
  {
    id: 'phone',
    name: 'Phone',
    category: 'contact',
    keywords: ['phone', 'call', 'contact', 'telephone'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'email',
    name: 'Email',
    category: 'contact',
    keywords: ['email', 'mail', 'contact', 'message'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="currentColor"/>
      <polyline points="22,6 12,13 2,6" stroke="white" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    id: 'location',
    name: 'Location',
    category: 'contact',
    keywords: ['location', 'address', 'map', 'pin'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="currentColor"/>
      <circle cx="12" cy="10" r="3" fill="white"/>
    </svg>`
  },
  {
    id: 'website',
    name: 'Website',
    category: 'contact',
    keywords: ['website', 'web', 'url', 'link'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
      <line x1="2" y1="12" x2="22" y2="12" stroke="white" stroke-width="2"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" stroke-width="2" fill="none"/>
    </svg>`
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'social',
    keywords: ['linkedin', 'social', 'professional', 'network'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="currentColor"/>
      <rect x="2" y="9" width="4" height="12" fill="currentColor"/>
      <circle cx="4" cy="4" r="2" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'twitter',
    name: 'Twitter',
    category: 'social',
    keywords: ['twitter', 'social', 'tweet', 'x'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'social',
    keywords: ['facebook', 'social', 'fb'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'social',
    keywords: ['instagram', 'social', 'photo', 'ig'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="currentColor"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="white" stroke-width="2" fill="none"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="white" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'star',
    name: 'Star',
    category: 'rating',
    keywords: ['star', 'rating', 'favorite', 'quality'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'award',
    name: 'Award',
    category: 'business',
    keywords: ['award', 'achievement', 'certificate', 'medal'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="7" fill="currentColor"/>
      <polyline points="8.21,13.89 7,23 12,20 17,23 15.79,13.88" stroke="currentColor" stroke-width="2" fill="none"/>
    </svg>`
  }
]

export const DECORATIVE_ICONS: IconData[] = [
  {
    id: 'sparkles',
    name: 'Sparkles',
    category: 'decorative',
    keywords: ['sparkles', 'magic', 'decoration', 'stars'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'crown',
    name: 'Crown',
    category: 'decorative',
    keywords: ['crown', 'royal', 'premium', 'luxury'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 20h20l-2-12-4 4-4-8-4 8-4-4z" fill="currentColor"/>
      <circle cx="12" cy="6" r="2" fill="currentColor"/>
    </svg>`
  },
  {
    id: 'diamond-icon',
    name: 'Diamond',
    category: 'decorative',
    keywords: ['diamond', 'gem', 'luxury', 'premium'],
    svg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="6,3 18,3 21,9 12,22 3,9" fill="currentColor"/>
      <polyline points="6,3 12,9 18,3" stroke="white" stroke-width="1" fill="none"/>
      <polyline points="3,9 12,9 21,9" stroke="white" stroke-width="1" fill="none"/>
    </svg>`
  }
]

export const ALL_ICONS = [...BUSINESS_ICONS, ...DECORATIVE_ICONS]