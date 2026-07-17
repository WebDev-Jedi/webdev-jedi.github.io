import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
      <div 
        className="space-y-6 max-w-md bg-stone-900/40 border border-stone-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-md"
        id="not-found-card"
      >
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center rounded-2xl mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-100 font-display tracking-tight leading-none uppercase">
            Сторінку не знайдено
          </h1>
          <p className="text-xs text-stone-500 font-mono tracking-widest uppercase">
            Error 404 • Page Not Found
          </p>
        </div>

        <p className="text-xs sm:text-sm text-stone-400 leading-relaxed max-w-sm mx-auto">
          Вибачте, але запитувана сторінка не існує, була перенесена або наразі недоступна. Будь ласка, поверніться на головну.
        </p>

        <div className="pt-2">
          <Link 
            href="/"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-amber-400/10"
            id="not-found-back-home"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Повернутися на головну</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
