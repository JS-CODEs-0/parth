'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '../../../lib/types';
import { formatINR, calculateDiscount } from '../../../lib/utils';
import { useShop } from '../../../context/ShopContext';
import { ProductCard } from '../../../components/product/ProductCard';
import { PageBackground } from '../../../components/ui/PageBackground';
import {
  Sparkles,
  Heart,
  Scale,
  Star,
  CheckCircle2,
  XCircle,
  BotMessageSquare,
  ShieldCheck,
  Truck,
  RotateCw,
  Cpu,
  Layers,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const router = useRouter();
  const { isInWishlist, toggleWishlist, isInCompare, addToCompare } = useShop();

  const [activeImage, setActiveImage] = useState(product.image);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const discount = calculateDiscount(product.price, product.originalPrice);

  const handleAskAi = () => {
    const prompt = `Give me a deep-dive analysis on the ${product.name}. Is it worth ${formatINR(product.price)}, and what are its key rivals?`;
    router.push(`/assistant?q=${encodeURIComponent(prompt)}`);
  };

  const formatSpecKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Relatable Photographic Atmosphere Background */}
      <PageBackground
        imageUrl="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=2000&q=80"
        alt="Engineering workstation environment"
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-200">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link href="/shop" className="hover:text-zinc-200">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <Link
          href={`/shop?category=${product.category}`}
          className="capitalize hover:text-zinc-200"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-300 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Gallery Col (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl bg-[#11121b]/90 backdrop-blur-xl border border-zinc-800 overflow-hidden shadow-2xl">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0d0e15]/90 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{product.badge}</span>
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img
                      ? 'border-white scale-95 shadow-md shadow-black/50'
                      : 'border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image thumbnail ${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Actions Col (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Category */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {product.brand}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400 capitalize">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-zinc-400">
                Based on <strong className="text-zinc-200">{product.reviewCount}</strong> verified buyer evaluations
              </span>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-[#11121b]/90 backdrop-blur-xl border border-zinc-800 flex items-baseline justify-between shadow-md">
              <div>
                <span className="text-xs text-zinc-400 block mb-1">Current Best Market Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-zinc-500 line-through">
                      {formatINR(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
              {discount > 0 && (
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Save {discount}%
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Key Feature Highlights */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Key Highlights
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
                {product.keyFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="space-y-3 pt-4 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  inWishlist
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-lg shadow-rose-950/30'
                    : 'bg-[#141520] text-zinc-200 border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>

              {/* Compare button */}
              <button
                onClick={() => addToCompare(product.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  inCompare
                    ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                    : 'bg-[#141520] text-zinc-200 border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>{inCompare ? 'Comparing (In List)' : 'Add to Compare'}</span>
              </button>
            </div>

            {/* Ask AI CTA */}
            <button
              onClick={handleAskAi}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm shadow-xl transition-all"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span>Ask ShopMate AI About This Product</span>
            </button>
          </div>

          {/* Confidence Assurances */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800 text-center text-[11px] text-zinc-400">
            <div className="p-2 rounded-lg bg-[#11121c]/80 border border-zinc-800 flex flex-col items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Free Delivery</span>
            </div>
            <div className="p-2 rounded-lg bg-[#11121c]/80 border border-zinc-800 flex flex-col items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>1 Year Warranty</span>
            </div>
            <div className="p-2 rounded-lg bg-[#11121c]/80 border border-zinc-800 flex flex-col items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>7-Day Return</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHOPMATE AI EXPLANATION BOX */}
      <div className="rounded-3xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-700/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 text-cyan-300 border border-zinc-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                ShopMate AI Synthesis & Verdict
              </h2>
              <p className="text-xs text-zinc-400">
                Synthesized from thermal benchmarks, customer feedback, and comparative testing.
              </p>
            </div>
          </div>

          {/* AI Score Badge */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#141520] border border-zinc-700">
            <span className="text-xs text-zinc-400 font-medium">Confidence Score</span>
            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300">
              {product.aiAnalysis.score}/100
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Verdict & Why Recommend */}
          <div className="p-5 rounded-2xl bg-[#141520] border border-zinc-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Why We Recommend It
            </span>
            <p className="text-sm font-semibold text-white">
              "{product.aiAnalysis.verdict}"
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              {product.aiAnalysis.whyRecommend}
            </p>
          </div>

          {/* Ideal User Profile */}
          <div className="p-5 rounded-2xl bg-[#141520] border border-zinc-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Ideal User Profile
            </span>
            <p className="text-sm font-semibold text-white">
              Who is this best for?
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              {product.aiAnalysis.idealFor}
            </p>
          </div>

          {/* Key Trade-off / Limitation */}
          <div className="p-5 rounded-2xl bg-[#141520] border border-zinc-800 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Key Trade-Off To Consider
            </span>
            <p className="text-sm font-semibold text-white">
              What to watch out for
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed pt-1">
              {product.aiAnalysis.keyTradeoff}
            </p>
          </div>
        </div>
      </div>

      {/* PROS & CONS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pros */}
        <div className="rounded-2xl bg-[#0f1018]/90 backdrop-blur-xl border border-emerald-500/20 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Advantages & Pros</h3>
          </div>
          <ul className="space-y-3">
            {product.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="rounded-2xl bg-[#0f1018]/90 backdrop-blur-xl border border-rose-500/20 p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <XCircle className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Disadvantages & Limitations</h3>
          </div>
          <ul className="space-y-3">
            {product.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* COMPLETE SPECIFICATIONS TABLE */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Detailed Technical Specifications
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Exact hardware parameters verified against manufacturer documentation.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0f1018]/90 backdrop-blur-xl border border-zinc-800 overflow-hidden shadow-xl">
          <div className="divide-y divide-zinc-800">
            {Object.entries(product.specs).map(([key, value], idx) => {
              if (!value) return null;
              return (
                <div
                  key={key}
                  className={`grid grid-cols-1 sm:grid-cols-3 p-4 text-xs sm:text-sm ${
                    idx % 2 === 0 ? 'bg-[#0f1018]/60' : 'bg-[#13141f]/60'
                  }`}
                >
                  <span className="font-semibold text-zinc-400">
                    {formatSpecKey(key)}
                  </span>
                  <span className="sm:col-span-2 text-zinc-200 font-medium">
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Alternative & Complementary Tech
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Other high-performing models in {product.category}.
              </p>
            </div>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs text-cyan-400 hover:underline"
            >
              View category
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
