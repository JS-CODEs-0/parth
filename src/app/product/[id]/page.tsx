import React from 'react';
import { notFound } from 'next/navigation';
import { products } from '../../../lib/data/products';
import { ProductDetailsClient } from './ProductDetailsClient';

export function generateStaticParams() {
  return products.map((p) => ({
    id: p.id,
  }));
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // Related products from same category or brand
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailsClient product={product} relatedProducts={relatedProducts} />;
}
