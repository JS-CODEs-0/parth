'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../lib/types';
import { formatINR, calculateDiscount } from '../../lib/utils';
import { useShop } from '../../context/ShopContext';
import { Heart, Scale, Star, ArrowUpRight, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist, isInCompare, addToCompare } = useShop();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const discount = calculateDiscount(product.price, product.originalPrice);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#101118]/85 backdrop-blur-md border border-[#202230] hover:border-zinc-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 overflow-hidden">
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] w-full bg-[#151620] overflow-hidden">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101118] via-transparent to-transparent opacity-65" />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#0d0e15]/90 backdrop-blur-md text-cyan-300 border border-cyan-500/30 shadow-md">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{product.badge}</span>
            </span>
          )}
          {discount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Action Buttons: Wishlist & Compare */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              inWishlist
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-lg shadow-rose-950/40'
                : 'bg-[#0f1017]/80 text-zinc-300 border-[#262838] hover:text-white hover:bg-[#1a1c28]'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => addToCompare(product.id)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              inCompare
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-950/40'
                : 'bg-[#0f1017]/80 text-zinc-300 border-[#262838] hover:text-white hover:bg-[#1a1c28]'
            }`}
            title={inCompare ? 'In comparison' : 'Add to compare (max 4)'}
            aria-label={inCompare ? `Remove ${product.name} from comparison` : `Add ${product.name} to comparison`}
          >
            <Scale className={`w-4 h-4 ${inCompare ? 'text-cyan-300 font-bold' : ''}`} />
          </button>
        </div>

        {/* Quick Category Tag */}
        <div className="absolute bottom-2 left-3 z-10">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded bg-[#0d0e14]/80 backdrop-blur-sm border border-[#212330]">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-5">
        {/* Brand and Rating Row */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
          <span className="font-semibold text-zinc-400 tracking-wider uppercase text-[11px]">{product.brand}</span>
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{product.rating}</span>
            <span className="text-zinc-500 text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/product/${product.id}`}
          className="font-semibold text-zinc-100 hover:text-cyan-300 transition-colors line-clamp-1 text-base tracking-tight mb-2"
        >
          {product.name}
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {product.shortDescription}
        </p>

        {/* Key Spec Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
          {product.specs.processor && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#161722] text-zinc-300 border border-[#242636] truncate max-w-[150px]">
              {product.specs.processor.split('(')[0]}
            </span>
          )}
          {product.specs.display && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#161722] text-zinc-300 border border-[#242636] truncate max-w-[140px]">
              {product.specs.display.split(',')[0]}
            </span>
          )}
          {product.specs.battery && (
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#161722] text-zinc-300 border border-[#242636] truncate max-w-[130px]">
              {product.specs.battery.split(',')[0]}
            </span>
          )}
        </div>

        {/* Price & View CTA */}
        <div className="pt-3 border-t border-[#1d1f2b] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Free insured delivery</div>
          </div>

          <Link
            href={`/product/${product.id}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#181924] text-zinc-200 hover:bg-white hover:text-black border border-[#27293a] hover:border-white transition-all duration-200 shadow-sm"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
