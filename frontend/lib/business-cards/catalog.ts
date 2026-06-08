import { BusinessCardCatalogItem } from '@/types/business-card-catalog.types';
import { CARD_DESIGNS } from '@/components/business-cards/search/BusinessCardMiniPreview';

export interface CatalogEntry extends BusinessCardCatalogItem {
  designId: string; // matches CARD_DESIGNS[x].id
}

// ─── 25 Hardcoded visiting card designs ───────────────────────────────────────
const RAW_CATALOG: Array<{
  id: string;
  title: string;
  category: string;
  designId: string;
  isFree?: boolean;
  isPopular?: boolean;
  templateId: string;
  keywords: string[];
}> = [
  { id: 'bc-001', title: 'Corporate Blue Professional',   category: 'corporate',    designId: 'corp-blue',        isFree: true,  isPopular: true,  templateId: 'corporate-blue-001',       keywords: ['corporate', 'blue', 'professional', 'minimal'] },
  { id: 'bc-002', title: 'Luxury Black Gold',             category: 'luxury',       designId: 'luxury-gold',      isFree: false, isPopular: true,  templateId: 'luxury-black-gold-001',    keywords: ['luxury', 'black', 'gold', 'premium', 'elegant'] },
  { id: 'bc-003', title: 'Creative Gradient Purple',      category: 'creative',     designId: 'creative-purple',  isFree: true,  isPopular: true,  templateId: 'modern-gradient-001',      keywords: ['creative', 'gradient', 'purple', 'modern'] },
  { id: 'bc-004', title: 'Minimal White Elegant',         category: 'minimal',      designId: 'minimal-white',    isFree: true,  isPopular: true,  templateId: 'minimal-white-001',        keywords: ['minimal', 'white', 'elegant', 'clean', 'simple'] },
  { id: 'bc-005', title: 'Tech Dark Cyan',                category: 'tech',         designId: 'tech-dark',        isFree: false, isPopular: true,  templateId: 'tech-startup-001',         keywords: ['tech', 'dark', 'cyan', 'startup', 'modern'] },
  { id: 'bc-006', title: 'Real Estate Professional',      category: 'real-estate',  designId: 'real-estate',      isFree: true,  isPopular: false, templateId: 'real-estate-001',          keywords: ['real estate', 'green', 'professional', 'property'] },
  { id: 'bc-007', title: 'Medical Clean Blue',            category: 'medical',      designId: 'medical-blue',     isFree: true,  isPopular: false, templateId: 'medical-001',              keywords: ['medical', 'doctor', 'healthcare', 'blue', 'clean'] },
  { id: 'bc-008', title: 'Photography Studio Dark',       category: 'photography',  designId: 'photography',      isFree: false, isPopular: true,  templateId: 'photography-001',          keywords: ['photography', 'dark', 'studio', 'creative'] },
  { id: 'bc-009', title: 'Restaurant Warm Orange',        category: 'restaurant',   designId: 'restaurant',       isFree: true,  isPopular: true,  templateId: 'restaurant-001',           keywords: ['restaurant', 'food', 'warm', 'orange', 'chef'] },
  { id: 'bc-010', title: 'Corporate Navy Professional',   category: 'corporate',    designId: 'navy-split',       isFree: true,  isPopular: false, templateId: 'corporate-blue-001',       keywords: ['corporate', 'navy', 'professional', 'consultant'] },
  { id: 'bc-011', title: 'Rose Pink Beauty Salon',        category: 'creative',     designId: 'rose-elegant',     isFree: true,  isPopular: false, templateId: 'modern-gradient-001',      keywords: ['beauty', 'pink', 'salon', 'spa', 'elegant'] },
  { id: 'bc-012', title: 'Emerald Finance',               category: 'corporate',    designId: 'emerald',          isFree: false, isPopular: false, templateId: 'corporate-blue-001',       keywords: ['finance', 'green', 'investment', 'premium'] },
  { id: 'bc-013', title: 'Bold Agency Orange',            category: 'creative',     designId: 'orange-bold',      isFree: true,  isPopular: true,  templateId: 'creative-designer-001',    keywords: ['bold', 'orange', 'agency', 'creative', 'modern'] },
  { id: 'bc-014', title: 'Studio Noir Minimal',           category: 'minimal',      designId: 'ink-black',        isFree: false, isPopular: false, templateId: 'minimal-white-001',        keywords: ['minimal', 'black', 'dark', 'studio', 'elegant'] },
  { id: 'bc-015', title: 'Architect Sky Blue',            category: 'corporate',    designId: 'sky-architect',    isFree: true,  isPopular: false, templateId: 'corporate-blue-001',       keywords: ['architect', 'blue', 'professional', 'clean'] },
  { id: 'bc-016', title: 'Wave Digital Indigo',           category: 'tech',         designId: 'indigo-wave',      isFree: false, isPopular: true,  templateId: 'tech-startup-001',         keywords: ['digital', 'indigo', 'modern', 'tech', 'wave'] },
  { id: 'bc-017', title: 'Teal Consulting',               category: 'corporate',    designId: 'teal-consult',     isFree: true,  isPopular: false, templateId: 'corporate-blue-001',       keywords: ['teal', 'consulting', 'professional', 'clean'] },
  { id: 'bc-018', title: 'Spark Labs Startup Yellow',     category: 'tech',         designId: 'yellow-startup',   isFree: true,  isPopular: true,  templateId: 'tech-startup-001',         keywords: ['startup', 'yellow', 'bold', 'modern', 'creative'] },
  { id: 'bc-019', title: 'Red Law Firm',                  category: 'corporate',    designId: 'red-lawyer',       isFree: false, isPopular: false, templateId: 'corporate-blue-001',       keywords: ['law', 'lawyer', 'red', 'professional', 'corporate'] },
  { id: 'bc-020', title: 'Pastel Purple Fashion',         category: 'creative',     designId: 'pastel-minimal',   isFree: true,  isPopular: false, templateId: 'creative-designer-001',    keywords: ['fashion', 'purple', 'pastel', 'minimal', 'elegant'] },
  { id: 'bc-021', title: 'Classic Black Border',          category: 'minimal',      designId: 'classic-border',   isFree: true,  isPopular: false, templateId: 'minimal-white-001',        keywords: ['classic', 'black', 'minimal', 'accountant', 'clean'] },
  { id: 'bc-022', title: 'Sunset Events Gradient',        category: 'creative',     designId: 'sunset-gradient',  isFree: false, isPopular: true,  templateId: 'creative-designer-001',    keywords: ['events', 'gradient', 'orange', 'creative', 'warm'] },
  { id: 'bc-023', title: 'Steel Industries Gray',         category: 'corporate',    designId: 'steel-gray',       isFree: true,  isPopular: false, templateId: 'corporate-blue-001',       keywords: ['industrial', 'gray', 'corporate', 'operations'] },
  { id: 'bc-024', title: 'QR Code Modern',                category: 'tech',         designId: 'qr-modern',        isFree: false, isPopular: true,  templateId: 'qr-business-001',          keywords: ['qr', 'modern', 'digital', 'tech', 'connect'] },
  { id: 'bc-025', title: 'Heritage Crafts Vintage',       category: 'creative',     designId: 'vintage-brown',    isFree: true,  isPopular: false, templateId: 'creative-designer-001',    keywords: ['vintage', 'brown', 'heritage', 'crafts', 'artisan'] },
];

export const businessCardCatalog: CatalogEntry[] = RAW_CATALOG.map((item) => ({
  ...item,
  description: `${item.title} – ${item.category} visiting card design`,
  orientation: 'horizontal' as const,
  preview: {
    background: '#ffffff',
    accent: '#3b82f6',
    textColor: '#1f2937',
    subtextColor: '#6b7280',
    layout: 'classic' as const,
  },
}));

export const catalogCategories = [
  { id: 'all', label: 'All Templates' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'creative', label: 'Creative' },
  { id: 'tech', label: 'Tech' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'photography', label: 'Photography' },
  { id: 'medical', label: 'Medical' },
];

export const popularKeywords = [
  'minimal', 'modern', 'luxury', 'creative', 'professional', 'elegant',
  'corporate', 'restaurant', 'photography', 'real estate', 'beauty', 'tech',
];

export function filterCatalog(
  items: CatalogEntry[],
  filters: {
    businessName?: string;
    keywords?: string;
    category?: string;
    orientation?: string;
    onlyFree?: boolean;
  },
): CatalogEntry[] {
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

export function getCatalogItemDesign(item: CatalogEntry) {
  return CARD_DESIGNS.find((d) => d.id === item.designId);
}
