'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<'carbon' | 'light'>('carbon');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const stored = localStorage.getItem('private_dating_theme') as 'carbon' | 'light' | null;
      const currentTheme = stored || 'carbon';
      setTheme(currentTheme);
      
      if (currentTheme === 'light') {
        document.documentElement.classList.add('theme-light');
      } else {
        document.documentElement.classList.remove('theme-light');
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'carbon' ? 'light' : 'carbon';
    setTheme(nextTheme);
    localStorage.setItem('private_dating_theme', nextTheme);
    
    if (nextTheme === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-[36px] sm:w-[110px] h-[38px] bg-stone-900 border border-stone-800 rounded-xl" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-amber-400 hover:bg-stone-850/80 transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-wider shadow-md"
      title={theme === 'carbon' ? 'Switch to Light Mode' : 'Switch to Carbon Dark'}
      id="theme-switcher-btn"
    >
      {theme === 'carbon' ? (
        <>
          <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Carbon</span>
        </>
      )}
    </button>
  );
}
