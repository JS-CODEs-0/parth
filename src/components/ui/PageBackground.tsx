import React from 'react';
import Image from 'next/image';

interface PageBackgroundProps {
  imageUrl?: string;
  src?: string;
  alt?: string;
  overlayClassName?: string;
  opacity?: string;
}

export function PageBackground({
  imageUrl,
  src,
  alt = 'Background atmosphere',
  overlayClassName = 'from-[#090a0f]/92 via-[#0b0c13]/88 to-[#090a0f]/98',
  opacity = 'opacity-35',
}: PageBackgroundProps) {
  const effectiveUrl = imageUrl || src || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2200&q=80';

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Real photographic atmosphere image */}
      <Image
        src={effectiveUrl}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className={`object-cover object-center scale-105 ${opacity} filter brightness-75 contrast-125`}
      />

      {/* Multi-stage dark vignette & gradient overlay to preserve readability */}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayClassName}`} />

      {/* Subtle tech ambient grid */}
      <div className="absolute inset-0 tech-grid opacity-60" />

      {/* Soft spotlight in top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none" />
    </div>
  );
}
