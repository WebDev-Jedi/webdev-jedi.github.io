import React, { useState } from 'react';
import Image from 'next/image';

export function SkeletonImage({ 
  src, 
  alt, 
  fill, 
  className, 
  referrerPolicy, 
  priority 
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
  priority?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-stone-950 overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-950/30 animate-pulse flex items-center justify-center z-10 pointer-events-none">
          {/* Pulsing loading circle indicator */}
          <div className="w-5 h-5 rounded-full border border-stone-700/50 bg-stone-900/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} transition-all duration-700 ease-out ${
          isLoaded 
            ? 'opacity-100 blur-none scale-100' 
            : 'opacity-50 blur-lg scale-105'
        }`}
        referrerPolicy={referrerPolicy}
        priority={priority}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export function OfferCardSkeleton() {
  return (
    <div className="bg-stone-900/50 border border-stone-800/80 rounded-2xl overflow-hidden shadow-md flex flex-col h-full animate-pulse">
      {/* Image area */}
      <div className="relative h-52 w-full bg-stone-800/80 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border border-stone-700/30 bg-stone-900/30 flex items-center justify-center">
          <div className="w-5 h-5 rounded-sm bg-stone-700/40" />
        </div>
        <div className="absolute top-3 left-3 w-14 h-5 bg-stone-700/60 rounded-lg" />
        <div className="absolute top-3 right-3 w-20 h-5 bg-stone-700/60 rounded-lg" />
      </div>
      
      {/* Content details */}
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-1/2 bg-stone-850 rounded-md" />
          <div className="h-5 w-16 bg-stone-850 rounded-md" />
        </div>

        {/* Tag row */}
        <div className="flex gap-1.5">
          <div className="h-4 w-12 bg-stone-850 rounded-md" />
          <div className="h-4 w-16 bg-stone-850 rounded-md" />
          <div className="h-4 w-14 bg-stone-850 rounded-md" />
        </div>

        {/* Description lines */}
        <div className="space-y-2 py-1">
          <div className="h-3.5 w-full bg-stone-850 rounded" />
          <div className="h-3.5 w-5/6 bg-stone-850 rounded" />
          <div className="h-3.5 w-4/5 bg-stone-850 rounded" />
        </div>

        {/* Activity progress bar area */}
        <div className="space-y-2 py-1">
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-stone-850 rounded" />
            <div className="h-3 w-8 bg-stone-850 rounded" />
          </div>
          <div className="h-1.5 w-full bg-stone-950 rounded-full overflow-hidden border border-stone-800/80">
            <div className="h-full bg-stone-850 w-3/4 rounded-full" />
          </div>
        </div>

        {/* Views count info */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800/60">
          <div className="h-4 w-24 bg-stone-850 rounded" />
          <div className="h-4 w-20 bg-stone-850 rounded" />
        </div>

        {/* Share buttons */}
        <div className="space-y-2 pt-1">
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-stone-850 rounded-md" />
            <div className="h-7 w-20 bg-stone-850 rounded-md" />
            <div className="h-7 w-20 bg-stone-850 rounded-md" />
          </div>
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-9 bg-stone-850 rounded-lg" />
          <div className="h-9 bg-stone-850 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function NewsCardSkeleton() {
  return (
    <div className="bg-stone-900/50 border border-stone-800 rounded-xl overflow-hidden shadow-md flex flex-col h-full animate-pulse">
      {/* Image Area */}
      <div className="relative h-48 bg-stone-800/80 flex items-center justify-center">
        <div className="w-8 h-8 rounded bg-stone-700/40" />
        <div className="absolute top-3 left-3 w-16 h-5 bg-stone-700/60 rounded" />
      </div>

      {/* Content Details */}
      <div className="p-5 flex flex-col flex-1 space-y-3">
        <div className="h-4 w-28 bg-stone-850 rounded" />
        
        <div className="space-y-2">
          <div className="h-5 w-full bg-stone-850 rounded" />
          <div className="h-5 w-4/5 bg-stone-850 rounded" />
        </div>

        <div className="space-y-1.5 py-1 flex-1">
          <div className="h-3.5 w-full bg-stone-850 rounded" />
          <div className="h-3.5 w-5/6 bg-stone-850 rounded" />
          <div className="h-3.5 w-4/5 bg-stone-850 rounded" />
        </div>

        <div className="h-4 w-28 bg-stone-850 rounded pt-2 border-t border-stone-800/60" />
      </div>
    </div>
  );
}
