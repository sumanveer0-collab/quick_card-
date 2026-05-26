'use client';

import { CardPreviewStyle } from '@/types/business-card-catalog.types';

interface BusinessCardMiniPreviewProps {
  preview: CardPreviewStyle;
  businessName?: string;
  className?: string;
}

export default function BusinessCardMiniPreview({
  preview,
  businessName,
  className = '',
}: BusinessCardMiniPreviewProps) {
  const name = businessName?.trim() || 'Alex Morgan';
  const title = 'Chief Executive Officer';
  const contact = 'hello@company.com · +1 555 0100';

  const { layout, background, accent, textColor, subtextColor } = preview;

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background }}
    >
      {layout === 'split-left' && (
        <div className="absolute left-0 top-0 bottom-0 w-[28%]" style={{ background: accent }} />
      )}
      {layout === 'split-right' && (
        <div className="absolute right-0 top-0 bottom-0 w-[28%]" style={{ background: accent }} />
      )}
      {layout === 'wave' && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[45%] opacity-30"
          style={{ background: accent, borderRadius: '100% 100% 0 0 / 60% 60% 0 0' }}
        />
      )}
      {layout === 'gradient' && (
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 80% 20%, ${accent}, transparent 55%)` }} />
      )}
      {layout === 'bold' && (
        <div className="absolute top-2 left-2 right-2 h-1 rounded-full" style={{ background: accent }} />
      )}
      {layout === 'dark-luxury' && (
        <div className="absolute bottom-3 left-3 right-3 h-px opacity-60" style={{ background: accent }} />
      )}

      <div
        className={`relative z-10 h-full flex flex-col justify-center px-3 py-2 ${
          layout === 'split-left' ? 'pl-[32%]' : layout === 'split-right' ? 'pr-[32%]' : ''
        } ${layout === 'centered' ? 'items-center text-center' : ''}`}
      >
        {(layout === 'classic' || layout === 'minimal') && (
          <div className="w-5 h-5 rounded mb-1 opacity-90" style={{ background: accent }} />
        )}
        <p
          className="text-[9px] font-bold leading-tight truncate w-full"
          style={{ color: textColor }}
        >
          {name}
        </p>
        <p className="text-[6px] mt-0.5 truncate w-full" style={{ color: subtextColor }}>
          {title}
        </p>
        <p className="text-[5px] mt-1 opacity-80 truncate w-full" style={{ color: subtextColor }}>
          {contact}
        </p>
      </div>
    </div>
  );
}
