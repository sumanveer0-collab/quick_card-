'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { BusinessCardCatalogItem } from '@/types/business-card-catalog.types';
import BusinessCardMiniPreview, { CARD_DESIGNS } from './BusinessCardMiniPreview';

interface SearchGridCardProps {
  item: BusinessCardCatalogItem & { designId?: string };
  businessName?: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function SearchGridCard({
  item,
  isFavorite,
  onToggleFavorite,
}: SearchGridCardProps) {
  const designId = (item as any).designId as string | undefined;
  const design = CARD_DESIGNS.find((d) => d.id === designId);

  // Build the editor URL — pass BOTH templateId and designId so the
  // customize page can resolve the exact design the user clicked.
  const editorUrl = designId
    ? `/customize?templateId=${item.templateId}&designId=${designId}`
    : `/customize?templateId=${item.templateId}`;

  return (
    <Link href={editorUrl} className="group block">
      <article className="relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden hover:border-blue-400 cursor-pointer">
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
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Card preview — exact same SVG the user clicks */}
        <div className="aspect-[1.75] bg-gray-50 overflow-hidden">
          {design ? (
            <BusinessCardMiniPreview design={design} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400 font-medium">{item.title}</span>
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none" />

        {/* Title */}
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-gray-700 truncate group-hover:text-blue-600 transition-colors">
            {item.title}
          </p>
          <p className="text-[10px] text-gray-400 capitalize mt-0.5">{item.category}</p>
        </div>
      </article>
    </Link>
  );
}
