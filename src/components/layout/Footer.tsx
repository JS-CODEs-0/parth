import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, ShieldCheck, Zap, Scale, Heart, Info, Cpu } from 'lucide-react';
import { AiStatusIndicator } from '../ui/AiStatusIndicator';

export function Footer() {
  return (
    <footer className="border-t border-[#1b1c26] bg-[#07080b] text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white">ShopMate AI</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Autonomous e-commerce shopping agent powered by NVIDIA Nemotron 3 Ultra (550B). Unbiased hardware syntheses, INR price matrices, and zero sponsored rankings.
            </p>
            <div className="pt-1">
              <AiStatusIndicator />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-zinc-200 mb-3 text-xs uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=laptops" className="hover:text-cyan-400 transition-colors">
                  Laptops & Ultrabooks
                </Link>
              </li>
              <li>
                <Link href="/shop?category=smartphones" className="hover:text-cyan-400 transition-colors">
                  Flagship Smartphones
                </Link>
              </li>
              <li>
                <Link href="/shop?category=headphones" className="hover:text-cyan-400 transition-colors">
                  Noise Cancelling Headphones
                </Link>
              </li>
              <li>
                <Link href="/shop?category=monitors" className="hover:text-cyan-400 transition-colors">
                  4K & Gaming Monitors
                </Link>
              </li>
              <li>
                <Link href="/shop?category=accessories" className="hover:text-cyan-400 transition-colors">
                  Keyboards, Docks & Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Tools & Architecture */}
          <div>
            <h4 className="font-semibold text-zinc-200 mb-3 text-xs uppercase tracking-wider">
              AI Tools & Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/assistant" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI Shopping Assistant</span>
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-cyan-400" />
                  <span>4-Way Spec Comparison</span>
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Heart className="w-3 h-3 text-cyan-400" />
                  <span>Saved Wishlist</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-cyan-400" />
                  <span>About & Architecture</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Guarantees & Tech info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-zinc-200 mb-3 text-xs uppercase tracking-wider">
              Engineering Principles
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-zinc-400">
              <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>NVIDIA Nemotron 3 Ultra (550B MoE) reasoning engine.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>100% Grounded in deterministic catalog specifications.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-zinc-400">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Accurate Indian Rupee (INR) pricing and savings math.</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#181924] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 ShopMate AI. Premium Shopping Intelligence Platform.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-zinc-300">About</Link>
            <Link href="/assistant" className="hover:text-zinc-300">Nemotron Assistant</Link>
            <Link href="/shop" className="hover:text-zinc-300">Catalog</Link>
            <Link href="/compare" className="hover:text-zinc-300">Compare</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
