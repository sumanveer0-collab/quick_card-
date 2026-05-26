import { BusinessCardCatalogItem, CardLayoutStyle, CardPreviewStyle } from '@/types/business-card-catalog.types';
import { businessCardTemplates } from './templates';

const BASE_TEMPLATE_IDS = businessCardTemplates.map((t) => t.id);

const INDUSTRIES = [
  'corporate', 'minimal', 'luxury', 'creative', 'modern', 'tech',
  'real-estate', 'restaurant', 'photography', 'medical', 'qr',
];

const TITLE_PREFIXES = [
  'Sophisticated', 'Elegant', 'Modern', 'Bold', 'Vibrant', 'Luxury',
  'Professional', 'Creative', 'Minimal', 'Premium', 'Classic', 'Contemporary',
  'Regal', 'Whimsical', 'Digital', 'Organic', 'Floral', 'Urban', 'Vintage',
  'Precision', 'Golden', 'Tropical', 'Memphis', 'Shield', 'Crimson',
];

const TITLE_SUFFIXES = [
  'Realty Solutions', 'Brand Identity', 'Health Solutions', 'Spa Retreat',
  'Cafe Delight', 'Barbershop', 'Investment Hub', 'Wellness Haven',
  'Artistry Studio', 'Construction Experts', 'Dental Care', 'Fashion Studio',
  'Fitness Training', 'Music Essentials', 'Retail Shop', 'Security Group',
  'Camping Badge', 'Tree Farm', 'Hotel Elegance', 'Plumbing Solutions',
  'Pizzeria Delight', 'Finance Solutions', 'Gamer Streamer', 'Culinary Tools',
];

const KEYWORD_POOL = [
  'professional', 'modern', 'minimal', 'luxury', 'creative', 'elegant',
  'corporate', 'simple', 'unique', 'premium', 'colorful', 'cool', '3d',
  'bakery', 'barber', 'beauty', 'construction', 'lawyer', 'photography',
  'real estate', 'restaurant', 'cleaning', 'electrician', 'landscaping',
];

const LAYOUTS: CardLayoutStyle[] = [
  'classic', 'split-left', 'split-right', 'centered', 'wave', 'minimal', 'dark-luxury', 'gradient', 'bold',
];

const PREVIEW_PALETTES: CardPreviewStyle[] = [
  { background: '#ffffff', accent: '#1e40af', textColor: '#0f172a', subtextColor: '#64748b', layout: 'split-left' },
  { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', accent: '#d4af37', textColor: '#fafafa', subtextColor: '#a8a29e', layout: 'dark-luxury' },
  { background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)', accent: '#ffffff', textColor: '#ffffff', subtextColor: 'rgba(255,255,255,0.8)', layout: 'gradient' },
  { background: '#fef3c7', accent: '#b45309', textColor: '#78350f', subtextColor: '#92400e', layout: 'classic' },
  { background: '#ecfdf5', accent: '#059669', textColor: '#064e3b', subtextColor: '#047857', layout: 'minimal' },
  { background: '#1e1b4b', accent: '#22d3ee', textColor: '#e0f2fe', subtextColor: '#67e8f9', layout: 'bold' },
  { background: 'linear-gradient(160deg, #fce7f3 0%, #fdf2f8 100%)', accent: '#db2777', textColor: '#831843', subtextColor: '#9d174d', layout: 'wave' },
  { background: '#f8fafc', accent: '#475569', textColor: '#0f172a', subtextColor: '#64748b', layout: 'centered' },
  { background: 'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)', accent: '#fbbf24', textColor: '#ffffff', subtextColor: '#ccfbf1', layout: 'split-right' },
  { background: '#18181b', accent: '#f43f5e', textColor: '#fafafa', subtextColor: '#a1a1aa', layout: 'dark-luxury' },
  { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', accent: '#ffffff', textColor: '#ffffff', subtextColor: 'rgba(255,255,255,0.75)', layout: 'gradient' },
  { background: '#fff7ed', accent: '#ea580c', textColor: '#7c2d12', subtextColor: '#c2410c', layout: 'classic' },
];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildCatalog(): BusinessCardCatalogItem[] {
  const items: BusinessCardCatalogItem[] = [];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const prefix = TITLE_PREFIXES[i % TITLE_PREFIXES.length];
    const suffix = TITLE_SUFFIXES[Math.floor(i / TITLE_PREFIXES.length) % TITLE_SUFFIXES.length];
    const title = `${prefix} ${suffix}`;
    const category = INDUSTRIES[i % INDUSTRIES.length];
    const templateId = BASE_TEMPLATE_IDS[i % BASE_TEMPLATE_IDS.length];
    const preview = PREVIEW_PALETTES[i % PREVIEW_PALETTES.length];
    const layout = LAYOUTS[i % LAYOUTS.length];

    const kw = new Set<string>([category, preview.layout]);
    KEYWORD_POOL.filter((_, idx) => (i + idx) % 5 === 0).forEach((k) => kw.add(k));
    if (i % 4 === 0) kw.add('free');

    items.push({
      id: `bc-design-${String(i + 1).padStart(3, '0')}`,
      title,
      category,
      keywords: Array.from(kw),
      description: `${title} – ${category} business card template`,
      isFree: i % 5 === 0 || i % 7 === 0,
      isPopular: i < 12 || i % 11 === 0,
      orientation: i % 9 === 0 ? 'square' : i % 7 === 0 ? 'vertical' : 'horizontal',
      preview: { ...preview, layout },
      templateId,
    });
  }

  return items;
}

export const businessCardCatalog: BusinessCardCatalogItem[] = buildCatalog();

export const catalogCategories = [
  { id: 'all', label: 'All Templates' },
  ...Array.from(new Set(businessCardCatalog.map((d) => d.category))).map((c) => ({
    id: c,
    label: c.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  })),
];

export const popularKeywords = [
  'minimal', 'modern', 'luxury', 'creative', 'professional', 'elegant',
  'corporate', 'restaurant', 'photography', 'real estate', 'beauty', 'tech',
];

export function filterCatalog(
  items: BusinessCardCatalogItem[],
  filters: {
    businessName?: string;
    keywords?: string;
    category?: string;
    orientation?: string;
    onlyFree?: boolean;
  },
): BusinessCardCatalogItem[] {
  const q = (filters.keywords || '').toLowerCase().trim();
  const biz = (filters.businessName || '').toLowerCase().trim();

  return items.filter((item) => {
    if (filters.onlyFree && !item.isFree) return false;
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.orientation && filters.orientation !== 'all' && item.orientation !== filters.orientation) return false;

    if (biz) {
      const hay = `${item.title} ${item.category} ${item.keywords.join(' ')}`.toLowerCase();
      if (!hay.includes(biz)) return false;
    }

    if (q) {
      const terms = q.split(/\s+/).filter(Boolean);
      const hay = `${item.title} ${item.category} ${item.description} ${item.keywords.join(' ')}`.toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return false;
    }

    return true;
  });
}

export function paginateCatalog<T>(items: T[], page: number, perPage: number) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    totalPages,
    total,
    start: total === 0 ? 0 : start + 1,
    end: Math.min(start + perPage, total),
  };
}

export function getCatalogItemSlug(item: BusinessCardCatalogItem): string {
  return slugify(item.title);
}
