'use client';

import { ChevronDown, Search } from 'lucide-react';
import { popularKeywords } from '@/lib/business-cards/catalog';

export interface SearchFilterValues {
  businessName: string;
  keywords: string;
  orientation: 'all' | 'horizontal' | 'vertical' | 'square';
  onlyFree: boolean;
}

interface SearchFilterBarProps {
  values: SearchFilterValues;
  onChange: (values: SearchFilterValues) => void;
  onSearch: () => void;
  resultCount: number;
}

export default function SearchFilterBar({
  values,
  onChange,
  onSearch,
  resultCount,
}: SearchFilterBarProps) {
  const set = (patch: Partial<SearchFilterValues>) => onChange({ ...values, ...patch });

  return (
    <div className="bg-[#f0f0f0] border-y border-gray-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
          className="flex flex-col lg:flex-row lg:items-end gap-4"
        >
          <div className="flex-1 grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Business name
              </label>
              <input
                type="text"
                placeholder="Enter your business name"
                value={values.businessName}
                onChange={(e) => set({ businessName: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Keywords
              </label>
              <input
                type="text"
                placeholder="Search by keyword"
                value={values.keywords}
                onChange={(e) => set({ keywords: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-md transition-colors"
            >
              <Search className="w-4 h-4" />
              Search
            </button>

            <details className="relative group">
              <summary className="list-none cursor-pointer inline-flex items-center gap-1 px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Orientation
                <ChevronDown className="w-4 h-4" />
              </summary>
              <div className="absolute right-0 mt-1 z-30 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px]">
                {(['all', 'horizontal', 'vertical', 'square'] as const).map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => set({ orientation: o })}
                    className={`block w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-50 ${
                      values.orientation === o ? 'text-brand-600 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    {o === 'all' ? 'All' : o}
                  </button>
                ))}
              </div>
            </details>

            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={values.onlyFree}
                onChange={(e) => set({ onlyFree: e.target.checked })}
                className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              Free only
            </label>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500">Popular:</span>
          {popularKeywords.slice(0, 8).map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                set({ keywords: kw });
                onSearch();
              }}
              className="text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              {kw}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-500">
            {resultCount.toLocaleString()} designs
          </span>
        </div>
      </div>
    </div>
  );
}
