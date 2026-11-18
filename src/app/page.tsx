'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { products, categories } from '../lib/data/products';
import { ProductCard } from '../components/product/ProductCard';
import { PageBackground } from '../components/ui/PageBackground';
import {
  Sparkles,
  ArrowRight,
  BotMessageSquare,
  Search,
  Scale,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  CheckCircle2,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const samplePrompts = [
    'Best laptop under ₹80,000 for coding',
    'Compare Sony WH-1000XM5 vs Bose QC Ultra',
    '4K monitor with 90W USB-C for MacBook',
    'Smartphone with best camera & battery',
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/assistant?q=${encodeURIComponent(searchQuery)}`);
  };

  const handlePromptClick = (prompt: string) => {
    router.push(`/assistant?q=${encodeURIComponent(prompt)}`);
  };

  // Featured products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);

  return (
    <div className="relative flex flex-col gap-20 pb-20">
      {/* Relatable Photographic Atmosphere Background */}
      <PageBackground
        imageUrl="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2000&q=80"
        alt="High-end workstation command center"
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 pb-12 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12131d]/90 backdrop-blur-md border border-zinc-700/60 text-zinc-300 text-xs font-semibold mb-6 shadow-xl">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>NVIDIA Nemotron 3 Ultra Architecture</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-400">INR Grounded Pricing</span>
          </div>

          {/* Main Title - Pure High-End Titanium White & Silver */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 leading-[1.12]">
            Shop smarter with an AI that knows{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400">
              what actually matters.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Zero sponsored hype. Unbiased hardware spec syntheses, actual trade-offs, and interactive 4-way comparisons tailored to your exact budget in Indian Rupees.
          </p>

          {/* Large AI Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-2xl bg-[#0f1017]/90 backdrop-blur-xl border border-zinc-700/80 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-2xl transition-all p-2"
            >
              <div className="pl-3 pr-2 text-cyan-400">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask anything... e.g. 'Best laptop under ₹80,000 for coding and battery life'"
                className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none px-2 py-2"
              />
              <button
                type="submit"
                className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs sm:text-sm font-bold transition-all shadow-md"
              >
                <span>Ask AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Suggested Prompts Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5">
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Try asking:</span>
              </span>
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-[#12131d]/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 transition-colors"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Key Value Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-zinc-800/80 text-left">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#11121b]/80 backdrop-blur-md border border-zinc-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">100% Unbiased</p>
                <p className="text-[11px] text-zinc-400">Zero sponsored rankings</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#11121b]/80 backdrop-blur-md border border-zinc-800">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">4-Way Compare</p>
                <p className="text-[11px] text-zinc-400">Side-by-side matrices</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#11121b]/80 backdrop-blur-md border border-zinc-800">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">Deep Specs</p>
                <p className="text-[11px] text-zinc-400">Thermals, watts, lumens</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#11121b]/80 backdrop-blur-md border border-zinc-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-200">INR Intelligence</p>
                <p className="text-[11px] text-zinc-400">Accurate Indian Rupee</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Explore The Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Curated Flagship Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View all products ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="group relative flex flex-col rounded-2xl bg-[#11121b]/85 backdrop-blur-md border border-zinc-800 hover:border-zinc-600 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-[#181a26]">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-zinc-100 group-hover:text-white transition-colors text-sm">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400">{cat.count} models</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:bg-white transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked by ShopMate AI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Top Rated & High-Impact Tech
            </h2>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            <span>Browse Full Store</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-800 p-8 md:p-14 relative overflow-hidden">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              The Architecture of Decision
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
              How ShopMate AI eliminates buyer’s remorse.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Most shopping engines rank items based on ad revenue. ShopMate AI strips out marketing gloss, translates spec sheets into practical everyday benefits, and highlights true limitations before you buy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#141520] border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                State Need & Budget
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Prompt in natural language. Mention your workflow (e.g., video editing, heavy coding, battery priority) and your INR limit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#141520] border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Deep Spec Synthesis
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The engine reviews real thermal ceilings, display color space, battery life under actual load, and build materials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#141520] border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                4-Way Matrix Compare
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Line up contenders side-by-side to pinpoint exactly where you gain or sacrifice features down to the port and gram.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col p-6 rounded-2xl bg-[#141520] border border-zinc-800">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-bold text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Confident Purchase
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Review balanced pros and cons, target audience suitability, and save top choices directly to your local wishlist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT ARCHITECTURE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-800 p-8 md:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Next-Gen Shopping Engineering</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Powered by NVIDIA Nemotron 3 Ultra (550B)
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                ShopMate AI combines deterministic catalog grounding with NVIDIA's premier 550B-parameter reasoning model. Instead of relying on sponsored ad rankings or hallucinated data, our architecture filters real manufacturer specifications and real INR prices before asking Nemotron to synthesize trade-offs, compute budget margins, and explain technical jargon.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Grounded in Catalog</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Sponsored Placements</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified Indian Rupee Pricing</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Learn more about our technology and principles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 p-5 rounded-2xl bg-[#141520] border border-zinc-800 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block pb-1 border-b border-zinc-800">
                System Specifications
              </span>
              <div className="flex justify-between text-xs py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">AI Model</span>
                <span className="font-mono text-cyan-300 font-semibold">nemotron-3-ultra-550b-a55b</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Base URL</span>
                <span className="font-mono text-zinc-300">integrate.api.nvidia.com</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Runtime</span>
                <span className="text-zinc-200">Next.js App Router (React 19)</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-zinc-800/80">
                <span className="text-zinc-400">Security</span>
                <span className="text-emerald-400 font-medium">Server-side isolated API keys</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-zinc-400">Catalog Size</span>
                <span className="text-zinc-200">24 Curated Flagships</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION / AI ASSISTANT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-3xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-800 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 text-xs font-semibold">
              <BotMessageSquare className="w-3.5 h-3.5" />
              <span>Available 24/7</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to find your ideal tech setup?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Open the ShopMate conversational assistant. Compare two devices, get suggestions under your exact budget, or inspect detailed trade-offs in real time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/assistant"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl transition-all"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span>Start AI Shopping Chat</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/compare"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#141520] hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-sm font-semibold transition-colors"
            >
              <Scale className="w-4 h-4" />
              <span>Open Comparison</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
