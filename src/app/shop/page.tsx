'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '../../lib/data/products';
import { ProductCard } from '../../components/product/ProductCard';
import { PageBackground } from '../../components/ui/PageBackground';
import { Product, Category } from '../../lib/types';
import { formatINR } from '../../lib/utils';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Star,
  ChevronDown,
  X,
  Filter,
} from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'reviews'>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Extract all unique brands
  const brands = useMemo(() => {
    const brandSet = new Set(products.map((p) => p.brand));
    return ['all', ...Array.from(brandSet).sort()];
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      if (product.rating < minRating) {
        return false;
      }
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesDesc = product.shortDescription.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [search, selectedCategory, selectedBrand, priceRange, minRating, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange([0, 250000]);
    setMinRating(0);
    setSortBy('featured');
  };

  const isFiltered =
    search !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < 250000 ||
    minRating > 0;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Relatable Photographic Atmosphere Background */}
      <PageBackground
        imageUrl="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=2000&q=80"
        alt="Electronics and gadgets studio"
      />

      {/* Top Header & Search Bar */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Curated Catalog
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Explore verified flagship gadgets with comprehensive specs and unbiased AI analysis.
          </p>
        </div>

        {/* Search & Quick Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model, brand, processor, features..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0f1017]/90 backdrop-blur-xl border border-zinc-700/80 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs text-zinc-400 mr-2 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-[#0f1017]/90 backdrop-blur-xl border border-zinc-700/80 hover:border-zinc-500 text-zinc-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-cyan-500 cursor-pointer shadow-sm"
              >
                <option value="featured">Featured & AI Pick</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviewed</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0f1017]/90 border border-zinc-700 text-zinc-200 text-sm font-medium"
            >
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Filters</span>
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* DESKTOP SIDEBAR FILTERS */}
        <div className="hidden lg:block space-y-6">
          <div className="rounded-2xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-800 p-5 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-zinc-100 text-sm">Filters</h3>
              </div>
              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-cyan-400 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
                Category
              </label>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-zinc-800 text-white font-semibold border-l-2 border-cyan-400'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[11px] opacity-60">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-800 text-white font-semibold border-l-2 border-cyan-400'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-60">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
                Brand
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setSelectedBrand(brand)}
                    className={`text-xs px-2.5 py-1 rounded-md border transition-colors capitalize ${
                      selectedBrand === brand
                        ? 'bg-white text-zinc-950 border-white font-bold'
                        : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 hover:border-zinc-500'
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Presets */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
                Price (INR)
              </label>
              <div className="space-y-1.5">
                {[
                  { label: 'All Budgets', range: [0, 250000] },
                  { label: 'Under ₹25,000', range: [0, 25000] },
                  { label: '₹25,000 - ₹50,000', range: [25000, 50000] },
                  { label: '₹50,000 - ₹1,00,000', range: [50000, 100000] },
                  { label: '₹1,00,000 - ₹1,50,000', range: [100000, 150000] },
                  { label: 'Above ₹1,50,000', range: [150000, 250000] },
                ].map((item, idx) => {
                  const isActive =
                    priceRange[0] === item.range[0] && priceRange[1] === item.range[1];
                  return (
                    <button
                      key={idx}
                      onClick={() => setPriceRange(item.range as [number, number])}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-800 text-white font-semibold border-l-2 border-cyan-400'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-3">
                Minimum Rating
              </label>
              <div className="space-y-1">
                {[
                  { rating: 0, label: 'Any Rating' },
                  { rating: 4.5, label: '4.5 ★ & above' },
                  { rating: 4.7, label: '4.7 ★ & above' },
                  { rating: 4.8, label: '4.8 ★ & above' },
                ].map((item) => (
                  <button
                    key={item.rating}
                    onClick={() => setMinRating(item.rating)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      minRating === item.rating
                        ? 'bg-zinc-800 text-white font-semibold border-l-2 border-cyan-400'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.rating > 0 && (
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="lg:col-span-3">
          {/* Active Status bar */}
          <div className="flex items-center justify-between mb-5 text-xs text-zinc-400">
            <span>
              Showing <strong className="text-zinc-200">{filteredProducts.length}</strong> of{' '}
              {products.length} models
            </span>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-800 p-12 text-center max-w-md mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-1">
                No matching tech found
              </h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Try loosening your filters, broadening search keywords, or resetting the price range.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs transition-all hover:bg-zinc-200"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTERS MODAL DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />

          <div className="relative ml-auto w-full max-w-xs h-full bg-[#0d0e14] border-l border-zinc-800 p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold text-zinc-100">Filters</span>
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                      selectedCategory === 'all'
                        ? 'bg-zinc-800 text-white font-semibold'
                        : 'text-zinc-400'
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium ${
                        selectedCategory === c.id
                          ? 'bg-zinc-800 text-white font-semibold'
                          : 'text-zinc-400'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Brand
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`text-xs px-2.5 py-1 rounded-md border capitalize ${
                        selectedBrand === b
                          ? 'bg-white text-zinc-950 font-bold border-white'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-750'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800 mt-6 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-medium"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-white text-zinc-950 text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-zinc-800 rounded-xl" />
            <div className="h-4 w-96 bg-zinc-900 rounded-lg" />
          </div>
          <div className="h-12 w-full max-w-lg bg-zinc-900 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-zinc-900 border border-zinc-800" />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
