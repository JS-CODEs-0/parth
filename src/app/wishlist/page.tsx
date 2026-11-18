'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '../../context/ShopContext';
import { formatINR } from '../../lib/utils';
import { PageBackground } from '../../components/ui/PageBackground';
import {
  Heart,
  Trash2,
  Scale,
  ArrowUpRight,
  ShoppingBag,
  Star,
} from 'lucide-react';

export default function WishlistPage() {
  const {
    wishlist,
    wishlistProducts,
    toggleWishlist,
    clearWishlist,
    addToCompare,
    isInCompare,
  } = useShop();

  return (
    <div className="relative min-h-screen">
      {/* Relatable Creator Workspace Background */}
      <PageBackground
        imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2200&q=80"
        alt="Premium workstation desk setup with high-end tech accessories"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>Saved Models</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              My Wishlist ({wishlist.length})
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Your saved gadgets stored securely in local browser storage.
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Wishlist</span>
            </button>
          )}
        </div>

        {/* Wishlist Items Grid or Empty State */}
        {wishlistProducts.length === 0 ? (
          <div className="rounded-3xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 p-10 md:p-16 text-center max-w-lg mx-auto space-y-5 my-8 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Explore our curated selection of flagship laptops, smartphones, headphones, monitors, and gear, and tap the heart icon to save items.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-slate-950 text-xs sm:text-sm font-semibold transition-all shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Browse Catalog</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProducts.map((p) => {
              const inComp = isInCompare(p.id);

              return (
                <div
                  key={p.id}
                  className="group flex flex-col justify-between rounded-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20"
                >
                  <div className="space-y-3">
                    {/* Media */}
                    <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/40">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      {p.badge && (
                        <span className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded bg-black/80 text-cyan-300 border border-cyan-500/40">
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {/* Brand & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-medium uppercase tracking-wider">{p.brand}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-semibold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{p.rating}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/product/${p.id}`}
                      className="font-semibold text-slate-100 hover:text-cyan-300 transition-colors text-sm line-clamp-1 block"
                    >
                      {p.name}
                    </Link>

                    {/* Price */}
                    <div>
                      <span className="text-base font-bold text-white">
                        {formatINR(p.price)}
                      </span>
                    </div>

                    {/* Short snippet */}
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {p.shortDescription}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center gap-2">
                    <Link
                      href={`/product/${p.id}`}
                      className="flex-1 py-2 rounded-xl bg-white/[0.05] hover:bg-white text-slate-200 hover:text-slate-950 border border-white/10 text-center font-semibold text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <span>View Product</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => addToCompare(p.id)}
                      className={`p-2 rounded-xl border transition-colors ${
                        inComp
                          ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white border-white/10'
                      }`}
                      title={inComp ? 'In compare matrix' : 'Add to compare'}
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
