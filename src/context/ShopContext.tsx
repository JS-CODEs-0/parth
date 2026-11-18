'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../lib/types';
import { products } from '../lib/data/products';

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}

interface ShopContextType {
  wishlist: string[];
  compareList: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  addToCompare: (productId: string) => boolean;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  compareProducts: Product[];
  wishlistProducts: Product[];
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (title: string, description?: string, type?: 'success' | 'info' | 'warning') => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'shopmate_wishlist_v1';
const COMPARE_STORAGE_KEY = 'shopmate_compare_v1';
const MAX_COMPARE_ITEMS = 4;

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedCompare = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (savedCompare) {
        setCompareList(JSON.parse(savedCompare));
      }
    } catch (e) {
      console.error('Error loading saved state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
    } catch (e) {
      console.error('Error saving compare list:', e);
    }
  }, [compareList, isLoaded]);

  const showToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    const title = product ? product.name : 'Product';

    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Wishlist', `${title} removed.`, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Saved to Wishlist', `${title} added to your wishlist.`, 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist Cleared', 'All saved items have been removed.', 'info');
  };

  const addToCompare = (productId: string): boolean => {
    const product = products.find((p) => p.id === productId);
    const title = product ? product.name : 'Product';

    if (compareList.includes(productId)) {
      setCompareList((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from Compare', `${title} removed from comparison.`, 'info');
      return false;
    }

    if (compareList.length >= MAX_COMPARE_ITEMS) {
      showToast(
        'Comparison Limit Reached',
        `You can compare up to ${MAX_COMPARE_ITEMS} products at a time. Remove one first.`,
        'warning'
      );
      return false;
    }

    setCompareList((prev) => [...prev, productId]);
    showToast('Added to Compare', `${title} added (${compareList.length + 1}/${MAX_COMPARE_ITEMS}).`, 'success');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    const title = product ? product.name : 'Product';
    setCompareList((prev) => prev.filter((id) => id !== productId));
    showToast('Removed from Compare', `${title} removed.`, 'info');
  };

  const isInCompare = (productId: string) => compareList.includes(productId);

  const clearCompare = () => {
    setCompareList([]);
    showToast('Comparison Cleared', 'All products removed from comparison.', 'info');
  };

  const compareProducts = compareList
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const wishlistProducts = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <ShopContext.Provider
      value={{
        wishlist,
        compareList,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareProducts,
        wishlistProducts,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
