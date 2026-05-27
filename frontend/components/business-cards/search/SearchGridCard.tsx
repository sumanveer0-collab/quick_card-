'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { BusinessCardCatalogItem } from '@/types/business-card-catalog.types';
// import BusinessCardMiniPreview from './BusinessCardMiniPreview';

interface SearchGridCardProps {
  item: BusinessCardCatalogItem;
  businessName?: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function SearchGridCard({
  item,
  businessName,
  isFavorite,
  onToggleFavorite,
}: SearchGridCardProps) {
  return (
    <Link
      href={`/business-cards/editor/${item.templateId}?design=${item.id}`}
      className="group block"
    >
      <article className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {item.isFree && (
          <span className="absolute top-2 left-2 z-20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-600 rounded">
            Free
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>

        <div className="aspect-[1.75] bg-gray-50 p-2">
          <div className="w-full h-full rounded shadow-sm overflow-hidden ring-1 ring-black/5 group-hover:ring-brand-500/30 transition-all">
            {/* <BusinessCardMiniPreview preview={item.preview} businessName={businessName} /> */}
          </div>
        </div>

        <p className="sr-only">{item.title}</p>
      </article>
    </Link>
  );
}
