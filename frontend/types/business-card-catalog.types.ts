export type CardOrientation = 'horizontal' | 'vertical' | 'square';

export type CardLayoutStyle =
  | 'classic'
  | 'split-left'
  | 'split-right'
  | 'centered'
  | 'wave'
  | 'minimal'
  | 'dark-luxury'
  | 'gradient'
  | 'bold';

export interface CardPreviewStyle {
  background: string;
  accent: string;
  textColor: string;
  subtextColor: string;
  layout: CardLayoutStyle;
}

export interface BusinessCardCatalogItem {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  description: string;
  isFree: boolean;
  isPopular?: boolean;
  orientation: CardOrientation;
  preview: CardPreviewStyle;
  /** Maps to editable template in businessCardTemplates */
  templateId: string;
}

export interface CatalogFilters {
  businessName?: string;
  keywords?: string;
  category?: string;
  orientation?: CardOrientation | 'all';
  onlyFree?: boolean;
}
