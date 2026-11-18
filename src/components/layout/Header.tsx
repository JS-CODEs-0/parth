'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop } from '../../context/ShopContext';
import { AiStatusIndicator } from '../ui/AiStatusIndicator';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Scale,
  Menu,
  X,
  Search,
  BotMessageSquare,
  ArrowRight,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const { wishlist, compareList } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    {
      label: 'AI Assistant',
      href: '/assistant',
      badge: 'Nemotron',
      isAi: true,
    },
    {
      label: 'Compare',
      href: '/compare',
      count: compareList.length,
    },
    {
      label: 'Wishlist',
      href: '/wishlist',
      count: wishlist.length,
    },
    {
      label: 'About',
      href: '/about',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1e202c] bg-[#090a0f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Sleek Monochrome Obsidian with Emerald Spark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg"
            aria-label="ShopMate AI Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-zinc-700/60 flex items-center justify-center shadow-lg shadow-black/40 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                ShopMate
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white bg-zinc-800/80 border border-zinc-700/60 shadow-sm'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  {link.isAi && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{link.label}</span>

                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {link.badge}
                    </span>
                  )}

                  {typeof link.count === 'number' && link.count > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full bg-zinc-200 text-zinc-950 px-1">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Real AI Status, Action Icons & Assistant CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Real AI System Status Indicator */}
            <AiStatusIndicator compact />

            <div className="h-4 w-px bg-zinc-800 mx-0.5" />

            <Link
              href="/shop"
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
              title="Search Catalog"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              href="/compare"
              className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
              title="Compare Products"
              aria-label={`Compare Products (${compareList.length} items)`}
            >
              <Scale className="w-4 h-4" />
              {compareList.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full bg-cyan-500 text-black flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>

            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors"
              title="Saved Wishlist"
              aria-label={`Saved Wishlist (${wishlist.length} items)`}
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full bg-rose-500 text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              href="/assistant"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-white hover:bg-zinc-200 text-zinc-950 shadow-md transition-all hover:scale-[1.02]"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span>Ask AI</span>
            </Link>
          </div>

          {/* Mobile menu toggle & quick icon */}
          <div className="flex lg:hidden items-center gap-2">
            <AiStatusIndicator compact />

            <Link
              href="/wishlist"
              className="relative p-2 text-zinc-400 hover:text-white"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold rounded-full bg-rose-500 text-white flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#1e202c] bg-[#0d0e14] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700'
                    : 'text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {link.isAi && <Sparkles className="w-4 h-4 text-cyan-400" />}
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {link.badge}
                    </span>
                  )}
                </div>

                {typeof link.count === 'number' && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-200">
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2">
            <Link
              href="/assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-sm shadow-md"
            >
              <BotMessageSquare className="w-4 h-4" />
              <span>Launch AI Shopping Agent</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
