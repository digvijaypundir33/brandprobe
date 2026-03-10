'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShowcaseCard from '@/components/ShowcaseCard';
import { SHOWCASE_CATEGORIES, type ShowcaseCategory, type ShowcaseEntry } from '@/types/report';

type SortOption = 'rank' | 'score' | 'newest' | 'views';

export default function ShowcasePage() {
  const [entries, setEntries] = useState<ShowcaseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState<ShowcaseCategory | ''>('');
  const [sortBy, setSortBy] = useState<SortOption>('rank');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Pagination
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const fetchEntries = useCallback(
    async (reset = false) => {
      setIsLoading(true);
      setError(null);

      const currentOffset = reset ? 0 : offset;
      if (reset) {
        setOffset(0);
      }

      try {
        const params = new URLSearchParams({
          sortBy,
          limit: limit.toString(),
          offset: currentOffset.toString(),
        });

        if (category) params.set('category', category);
        if (search) params.set('search', search);

        const res = await fetch(`/api/showcase?${params}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.error || 'Failed to load showcase');
          return;
        }

        if (reset) {
          setEntries(data.entries);
        } else {
          setEntries((prev) => [...prev, ...data.entries]);
        }
        setHasMore(data.pagination.hasMore);
      } catch (err) {
        setError('Failed to load showcase. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [category, sortBy, search, offset]
  );

  // Initial load and filter changes
  useEffect(() => {
    fetchEntries(true);
  }, [category, sortBy, search]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  // Load more
  const loadMore = () => {
    setOffset((prev) => prev + limit);
  };

  // Load more when offset changes (except on initial/reset)
  useEffect(() => {
    if (offset > 0) {
      fetchEntries(false);
    }
  }, [offset]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 overflow-hidden">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="heading-1 text-gray-900 mb-3 sm:mb-4">Startup Showcase</h1>
          <p className="text-responsive-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Browse startups with their BrandProbe scores and analysis. Discover great products, showcase your work, and learn from other founders.
          </p>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 border border-green-200 rounded-full">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-green-700">Free for all users during launch</span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by name or URL..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>

            {/* Category Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ShowcaseCategory | '')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">All Categories</option>
              {SHOWCASE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="rank">Best Match</option>
              <option value="score">Highest Score</option>
              <option value="newest">Newest</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>

          {/* Active Filters */}
          {(category || search) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Active filters:</span>
              {category && (
                <button
                  onClick={() => setCategory('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {category}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {search && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSearchInput('');
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  &quot;{search}&quot;
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => {
                  setCategory('');
                  setSearch('');
                  setSearchInput('');
                }}
                className="text-sm text-gray-500 hover:text-gray-700 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {/* Grid */}
        {entries.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {entries.map((entry) => (
              <ShowcaseCard key={entry.reportId} entry={entry} />
            ))}
          </div>
        ) : isLoading ? null : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sites found</h3>
            <p className="text-gray-500 mb-6">
              {search || category
                ? 'Try adjusting your filters or search terms.'
                : 'Be the first to showcase your site!'}
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Analyze Your Site
            </Link>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="flex items-center gap-2 text-gray-500">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </div>
          </div>
        )}

        {/* Load More */}
        {!isLoading && hasMore && entries.length > 0 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Load More
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block p-8 bg-white rounded-2xl border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Want to showcase your site?</h3>
            <p className="text-gray-600 mb-4">
              Get a free analysis and join the showcase to reach more founders.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-colors"
              style={{ backgroundColor: 'var(--brand-primary)' }}
            >
              Analyze Your Site Free
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
