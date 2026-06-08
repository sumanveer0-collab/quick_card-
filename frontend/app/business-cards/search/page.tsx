'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchFilterBar, { SearchFilterValues } from '@/components/business-cards/search/SearchFilterBar';
import SearchGridCard from '@/components/business-cards/search/SearchGridCard';
import UploadLogoCard from '@/components/business-cards/search/UploadLogoCard';
import {
  businessCardCatalog,
  catalogCategories,
  filterCatalog,
  paginateCatalog,
} from '@/lib/business-cards/catalog';

const PER_PAGE = 25;

function BusinessCardSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilterValues>({
    businessName: '',
    keywords: '',
    orientation: 'all',
    onlyFree: false,
  });
  const [applied, setApplied] = useState<SearchFilterValues>(filters);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const q = searchParams.get('q') ?? searchParams.get('tags') ?? '';
    const biz = searchParams.get('business') ?? '';
    const cat = searchParams.get('category') ?? 'all';
    const p = parseInt(searchParams.get('page') || '1', 10);

    const initial: SearchFilterValues = {
      businessName: biz,
      keywords: q,
      orientation: (searchParams.get('orientation') as SearchFilterValues['orientation']) || 'all',
      onlyFree: searchParams.get('free') === '1',
    };
    setFilters(initial);
    setApplied(initial);
    setCategory(cat);
    setPage(Number.isNaN(p) ? 1 : p);
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      filterCatalog(businessCardCatalog, {
        businessName: applied.businessName,
        keywords: applied.keywords,
        category,
        orientation: applied.orientation,
        onlyFree: applied.onlyFree,
      }),
    [applied, category],
  );

  const pagination = useMemo(
    () => paginateCatalog(filtered, page, PER_PAGE),
    [filtered, page],
  );

  const syncUrl = useCallback(
    (nextFilters: SearchFilterValues, nextPage: number, nextCategory: string) => {
      const params = new URLSearchParams();
      if (nextFilters.keywords) params.set('q', nextFilters.keywords);
      if (nextFilters.businessName) params.set('business', nextFilters.businessName);
      if (nextCategory !== 'all') params.set('category', nextCategory);
      if (nextFilters.orientation !== 'all') params.set('orientation', nextFilters.orientation);
      if (nextFilters.onlyFree) params.set('free', '1');
      if (nextPage > 1) params.set('page', String(nextPage));
      const qs = params.toString();
      router.replace(`/business-cards/search${qs ? `?${qs}` : ''}`, { scroll: false });
    },
    [router],
  );

  const runSearch = () => {
    setApplied(filters);
    setPage(1);
    syncUrl(filters, 1, category);
  };

  const goToPage = (p: number) => {
    setPage(p);
    syncUrl(applied, p, category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const pageNumbers = useMemo(() => {
    const { totalPages } = pagination;
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (page > 3) pages.push('ellipsis');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  }, [pagination, page]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      {/* Hero — Design.com style dark header */}
      <header className="relative bg-[#1a1a1a] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1a1a] to-transparent" />

        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-14">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/business-cards" className="hover:text-white transition-colors">
              Business Cards
            </Link>
            <span>/</span>
            <span className="text-white">Business Card Templates</span>
          </nav>

          <div className="flex items-start gap-3 mb-4">
            <CreditCard className="w-10 h-10 text-brand-500 shrink-0 mt-1" />
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Business Card Templates
              </h1>
              <p className="text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed">
                Discover beautiful business cards instantly. Browse business card templates
                tailored for you and create a business card you love in seconds.{' '}
                <span className="text-brand-400 font-medium">Start for free!</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <SearchFilterBar
        values={filters}
        onChange={setFilters}
        onSearch={runSearch}
        resultCount={filtered.length}
      />

      {/* Category chips */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {catalogCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategory(cat.id);
                setPage(1);
                syncUrl(applied, 1, cat.id);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                category === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {page === 1 && (
            <div className="col-span-1">
              <UploadLogoCard />
            </div>
          )}

          {pagination.items.map((item) => (
            <SearchGridCard
              key={item.id}
              item={item}
              businessName={applied.businessName}
              isFavorite={favorites.has(item.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {pagination.items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200 mt-4">
            <p className="text-lg font-semibold text-gray-800">No designs found</p>
            <p className="text-gray-500 mt-2">Try different keywords or clear filters</p>
            <button
              type="button"
              onClick={() => {
                const cleared: SearchFilterValues = {
                  businessName: '',
                  keywords: '',
                  orientation: 'all',
                  onlyFree: false,
                };
                setFilters(cleared);
                setApplied(cleared);
                setCategory('all');
                setPage(1);
                syncUrl(cleared, 1, 'all');
              }}
              className="mt-4 text-brand-600 font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              {pagination.start} – {pagination.end} of {pagination.total.toLocaleString()}{' '}
              business card designs
            </p>
            <nav className="flex items-center gap-1" aria-label="Pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="p-2 rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {pageNumbers.map((n, i) =>
                n === 'ellipsis' ? (
                  <span key={`e-${i}`} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goToPage(n)}
                    className={`min-w-[40px] h-10 rounded-md text-sm font-medium border transition-colors ${
                      page === n
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => goToPage(page + 1)}
                className="p-2 rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:bg-gray-50"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* SEO footer blurb */}
      <section className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center text-gray-600 text-sm leading-relaxed">
          <p>
            First impressions count, and a sharp business card is still one of the best ways to
            stand out. QuickCard&apos;s business card templates make it easy to create a
            professional, custom design that reflects you and your brand — from clean and minimal
            to bold and creative, with styles suited for every industry.
          </p>
          <p className="mt-4">
            Pick a design, customize your name, title, contact details, and logo, then download or
            print. No design skills needed.
          </p>
        </div>
      </section>
    </div>
  );
}

function SearchPageFallback() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading templates…</div>
    </div>
  );
}

export default function BusinessCardSearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <BusinessCardSearchContent />
    </Suspense>
  );
}
