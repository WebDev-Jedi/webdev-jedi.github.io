'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-6 max-w-md bg-stone-900/40 border border-stone-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md" id="error-container">
        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center rounded-2xl mx-auto shadow-inner">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100 font-display tracking-tight uppercase">
            Щось пішло не так
          </h1>
          <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">
            An Error Occurred
          </p>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm mx-auto">
          Вибачте, виникла помилка під час обробки вашого запиту. Будь ласка, спробуйте ще раз.
        </p>
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-400/10"
            id="error-reset-btn"
          >
            <span>Спробувати знову</span>
          </button>
        </div>
      </div>
    </div>
  );
}
