'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-stone-950 text-stone-100 font-sans antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="space-y-6 max-w-md bg-stone-900/40 border border-stone-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md" id="global-error-container">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center rounded-2xl mx-auto shadow-inner">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-stone-100 font-display tracking-tight uppercase">
                Критична помилка
              </h1>
              <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">
                Critical System Error
              </p>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm mx-auto">
              Виникла критична системна помилка. Будь ласка, спробуйте перезавантажити сторінку.
            </p>
            <div className="pt-2">
              <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-400/10"
                id="global-error-reset-btn"
              >
                <span>Оновити сторінку</span>
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
