'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '../../lib/data/products';
import { Product } from '../../lib/types';
import { formatINR } from '../../lib/utils';
import { useShop } from '../../context/ShopContext';
import { PageBackground } from '../../components/ui/PageBackground';
import {
  Scale,
  X,
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Search,
} from 'lucide-react';

export default function ComparePage() {
  const {
    compareList,
    compareProducts,
    removeFromCompare,
    clearCompare,
    addToCompare,
  } = useShop();

  const [selectorModalOpen, setSelectorModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  // Curated comparison quick starters
  const quickComparisons = [
    {
      title: 'Flagship Laptops: Apple M3 Pro vs Dell XPS OLED',
      ids: ['macbook-pro-14-m3', 'dell-xps-15-oled'],
    },
    {
      title: 'Top ANC Headphones: Sony XM5 vs Bose QC Ultra',
      ids: ['sony-wh-1000xm5', 'bose-quietcomfort-ultra'],
    },
    {
      title: 'Ultimate Smartphones: iPhone 16 Pro Max vs S24 Ultra',
      ids: ['iphone-16-pro-max', 'samsung-galaxy-s24-ultra'],
    },
    {
      title: 'Pro 4K Displays: LG UltraFine vs Dell UltraSharp',
      ids: ['lg-ultrafine-27-4k', 'dell-ultrasharp-32-4k-hub'],
    },
  ];

  const handleLoadPreset = (ids: string[]) => {
    clearCompare();
    ids.forEach((id) => addToCompare(id));
  };

  // Filter products for the "Add product" modal picker
  const availableToAdd = products.filter(
    (p) =>
      !compareList.includes(p.id) &&
      (p.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(modalSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(modalSearch.toLowerCase()))
  );

  // Specifications keys to compare across products
  const specFields = [
    { key: 'category', label: 'Category' },
    { key: 'processor', label: 'Processor / Chipset' },
    { key: 'ram', label: 'RAM / Memory' },
    { key: 'storage', label: 'Storage' },
    { key: 'display', label: 'Display' },
    { key: 'battery', label: 'Battery & Power' },
    { key: 'camera', label: 'Camera Sensor' },
    { key: 'audio', label: 'Audio / Driver' },
    { key: 'ports', label: 'Ports & I/O' },
    { key: 'weight', label: 'Weight' },
    { key: 'os', label: 'Operating System' },
    { key: 'warranty', label: 'Warranty & Support' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Relatable Analytics & Hardware Lab Background */}
      <PageBackground
        imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2200&q=80"
        alt="Side-by-side technical analytics dashboard"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <Scale className="w-3.5 h-3.5" />
              <span>Side-by-Side Matrix</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Compare Products
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Evaluate up to 4 models simultaneously across technical specs, real-world pros, cons, and AI syntheses.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length < 4 && (
              <button
                onClick={() => setSelectorModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-md shadow-black/40"
              >
                <Plus className="w-4 h-4" />
                <span>Add Model ({compareList.length}/4)</span>
              </button>
            )}

            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* WHEN LESS THAN 2 PRODUCTS ARE SELECTED: SHOW PRESETS */}
        {compareProducts.length === 0 ? (
          <div className="rounded-3xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 p-8 md:p-14 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <Scale className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Your Comparison Matrix is Empty
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Add devices to see side-by-side specification differences, price contrasts in INR, and unbiased AI evaluations.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectorModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-lg"
              >
                Pick Products to Compare
              </button>
            </div>

            {/* Preset Buttons */}
            <div className="pt-6 border-t border-white/10 text-left">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
                Or Try Popular Head-to-Head Matchups:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quickComparisons.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadPreset(item.ids)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-left transition-all text-xs group"
                  >
                    <span className="font-medium text-slate-200 group-hover:text-white">
                      {item.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* COMPARISON TABLE */
          <div className="space-y-8">
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[800px] rounded-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl">
                {/* Product Header Row */}
                <div
                  className={`grid divide-x divide-white/10 border-b border-white/10 bg-black/40`}
                  style={{
                    gridTemplateColumns: `200px repeat(${compareProducts.length}, minmax(220px, 1fr))`,
                  }}
                >
                  <div className="p-4 flex flex-col justify-between font-semibold text-xs text-slate-400 uppercase tracking-wider">
                    <span>Product Model</span>
                    <div className="text-[11px] font-normal normal-case text-slate-400">
                      Comparing {compareProducts.length} device{compareProducts.length > 1 ? 's' : ''}
                    </div>
                  </div>

                  {compareProducts.map((p) => (
                    <div key={p.id} className="p-5 flex flex-col justify-between relative group">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/10 transition-all"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-3">
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/30">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="240px"
                            className="object-cover"
                          />
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                            {p.brand}
                          </span>
                          <Link
                            href={`/product/${p.id}`}
                            className="font-bold text-slate-100 hover:text-cyan-300 transition-colors text-sm line-clamp-1 block"
                          >
                            {p.name}
                          </Link>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-extrabold text-white">
                            {formatINR(p.price)}
                          </span>
                          <span className="text-amber-400 font-semibold flex items-center gap-0.5 text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{p.rating}</span>
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/product/${p.id}`}
                        className="mt-4 w-full py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-300 hover:text-white border border-cyan-500/30 text-center font-medium text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span>View Full Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  ))}
                </div>

                {/* AI Verdict Summary Row */}
                <div
                  className="grid divide-x divide-white/10 border-b border-white/10 bg-cyan-950/20"
                  style={{
                    gridTemplateColumns: `200px repeat(${compareProducts.length}, minmax(220px, 1fr))`,
                  }}
                >
                  <div className="p-4 font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Verdict</span>
                  </div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="p-4 text-xs space-y-1.5">
                      <p className="font-semibold text-slate-100">
                        "{p.aiAnalysis.verdict}"
                      </p>
                      <p className="text-[11px] text-slate-300">
                        <strong className="text-cyan-300">Best for: </strong>
                        {p.aiAnalysis.idealFor}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Specifications Matrix Rows */}
                {specFields.map((field, rowIdx) => {
                  const hasAny = compareProducts.some((p) => {
                    if (field.key === 'category') return true;
                    return Boolean(p.specs[field.key]);
                  });
                  if (!hasAny) return null;

                  return (
                    <div
                      key={field.key}
                      className={`grid divide-x divide-white/10 border-b border-white/5 text-xs ${
                        rowIdx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-white/[0.03]'
                      }`}
                      style={{
                        gridTemplateColumns: `200px repeat(${compareProducts.length}, minmax(220px, 1fr))`,
                      }}
                    >
                      <div className="p-4 font-semibold text-slate-400">
                        {field.label}
                      </div>

                      {compareProducts.map((p) => {
                        const val =
                          field.key === 'category'
                            ? p.category.toUpperCase()
                            : p.specs[field.key] || '—';

                        return (
                          <div key={p.id} className="p-4 text-slate-200 font-medium">
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Advantages (Pros) Row */}
                <div
                  className="grid divide-x divide-white/10 border-b border-white/10 bg-black/20"
                  style={{
                    gridTemplateColumns: `200px repeat(${compareProducts.length}, minmax(220px, 1fr))`,
                  }}
                >
                  <div className="p-4 font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Advantages</span>
                  </div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="p-4">
                      <ul className="space-y-2 text-xs text-slate-300">
                        {p.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Disadvantages (Cons) Row */}
                <div
                  className="grid divide-x divide-white/10 bg-black/20"
                  style={{
                    gridTemplateColumns: `200px repeat(${compareProducts.length}, minmax(220px, 1fr))`,
                  }}
                >
                  <div className="p-4 font-bold text-xs uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span>Limitations</span>
                  </div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="p-4">
                      <ul className="space-y-2 text-xs text-slate-300">
                        {p.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-rose-400 font-bold">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SELECTOR MODAL TO ADD A MODEL */}
        {selectorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectorModalOpen(false)}
            />

            <div className="relative w-full max-w-2xl rounded-2xl bg-[#0f1118] border border-white/15 p-6 shadow-2xl flex flex-col max-h-[85vh] z-10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">
                    Select Product to Compare
                  </h3>
                </div>
                <button
                  onClick={() => setSelectorModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Search Bar */}
              <div className="relative my-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={modalSearch}
                  onChange={(e) => setModalSearch(e.target.value)}
                  placeholder="Search by name, brand, or category..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {availableToAdd.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">
                    No products available to add matching your search.
                  </p>
                ) : (
                  availableToAdd.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/40 shrink-0">
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                            {p.brand} • {p.category}
                          </span>
                          <h4 className="font-semibold text-slate-100 text-xs sm:text-sm line-clamp-1">
                            {p.name}
                          </h4>
                          <span className="text-xs font-bold text-slate-300">
                            {formatINR(p.price)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCompare(p.id);
                          if (compareList.length + 1 >= 4) {
                            setSelectorModalOpen(false);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-slate-950 text-xs font-semibold shrink-0 transition-colors"
                      >
                        Compare
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
