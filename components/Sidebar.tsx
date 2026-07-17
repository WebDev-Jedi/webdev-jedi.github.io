'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  setActiveTab?: (tab: string) => void;
}

export default function Sidebar({ setActiveTab }: SidebarProps) {
  const handleNavigation = (tab: string, e: React.MouseEvent) => {
    if (setActiveTab) {
      e.preventDefault();
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-24 self-start space-y-6 block" id="right-sticky-sidebar">
      
      {/* 320px PREMIUM AD BANNER */}
      <div className="w-[320px] mx-auto rounded-2xl border border-rose-500/30 bg-gradient-to-b from-stone-900/90 via-stone-950/95 to-rose-950/20 p-4.5 shadow-2xl relative overflow-hidden group/banner transition-all duration-500 hover:border-rose-500/60" id="premium-ad-banner">
        {/* Animated glow border */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-amber-500/10 opacity-30 group-hover/banner:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Banner content */}
        <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between">
            <span className="bg-rose-500/10 text-rose-500 text-[9px] font-mono font-bold tracking-widest px-2 py-0.5 rounded-full border border-rose-500/20 uppercase">
              ★ Premium Spot
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] text-stone-400 font-mono">1.2K Online</span>
            </span>
          </div>

          {/* Main Offer Visual Panel */}
          <div className="space-y-3 text-center py-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 text-stone-950 font-display font-black text-xl shadow-lg shadow-rose-500/20 tracking-tighter uppercase transform group-hover/banner:scale-105 transition-transform duration-300">
              VIP
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-stone-100 uppercase font-display">
                Passion<span className="text-rose-500">Match</span>
              </h3>
              <p className="text-[11px] text-stone-400 font-light leading-relaxed max-w-[220px] mx-auto">
                Claim your exclusive complimentary gold member pass today.
              </p>
            </div>
          </div>

          {/* Highlight badges */}
          <div className="grid grid-cols-2 gap-1.5 text-center text-[9px] font-mono font-bold">
            <div className="bg-stone-950/80 border border-stone-800/80 p-1.5 rounded-lg">
              <span className="text-amber-400 block text-xs">9.9/10</span>
              <span className="text-stone-500 text-[8px] uppercase font-semibold">Rating</span>
            </div>
            <div className="bg-stone-950/80 border border-stone-800/80 p-1.5 rounded-lg">
              <span className="text-cyan-400 block text-xs">Instant</span>
              <span className="text-stone-500 text-[8px] uppercase font-semibold">Matches</span>
            </div>
          </div>

          {/* Promo Box */}
          <div className="bg-gradient-to-r from-stone-950 to-stone-900 border border-stone-800/80 p-2.5 rounded-xl text-center space-y-0.5">
            <div className="text-[8px] text-stone-400 uppercase font-mono font-bold">Limited Offer</div>
            <div className="text-xs font-extrabold text-amber-400 tracking-wider">30% COINS BONUS</div>
          </div>

          {/* Call To Action */}
          {setActiveTab ? (
            <button 
              onClick={(e) => handleNavigation('dating', e)}
              className="w-full bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 hover:from-rose-400 hover:via-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-black py-2.5 px-4 rounded-xl transition-all duration-300 text-center uppercase tracking-wider shadow-lg shadow-rose-500/10 hover:shadow-rose-500/30 transform hover:-translate-y-0.5 cursor-pointer border-0"
            >
              CLAIM BONUS NOW
            </button>
          ) : (
            <Link 
              href="/?tab=dating"
              className="w-full bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-500 hover:from-rose-400 hover:via-amber-400 hover:to-yellow-400 text-stone-950 text-xs font-black py-2.5 px-4 rounded-xl transition-all duration-300 text-center uppercase tracking-wider shadow-lg shadow-rose-500/10 hover:shadow-rose-500/30 transform hover:-translate-y-0.5 cursor-pointer border-0 flex items-center justify-center"
            >
              CLAIM BONUS NOW
            </Link>
          )}

        </div>
      </div>

      {/* LIVE PLATFORM STATUS */}
      <div className="w-[320px] mx-auto rounded-2xl border border-stone-800/80 bg-stone-900/30 p-5 space-y-4" id="sidebar-live-status">
        <div className="flex items-center justify-between border-b border-stone-800/60 pb-3">
          <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">
            Live Hub Monitor
          </h4>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-emerald-400 font-mono uppercase font-bold">Active</span>
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Total Verified Platforms</span>
            <span className="text-cyan-400 font-mono font-bold">15 Active</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Direct Livecam Rooms</span>
            <span className="text-amber-400 font-mono font-bold">2,482 Online</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Dating Matches Today</span>
            <span className="text-rose-500 font-mono font-bold">12,948 Successful</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Secure VPN Tunneling</span>
            <span className="text-emerald-400 font-mono font-bold">99.9% Encrypted</span>
          </div>
        </div>
      </div>

      {/* QUICK FEATURED LINKS */}
      <div className="w-[320px] mx-auto rounded-2xl border border-stone-800/80 bg-stone-900/30 p-5 space-y-4" id="sidebar-featured-links">
        <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider font-mono border-b border-stone-800/60 pb-3">
          ⭐ Highly Recommended
        </h4>

        <div className="space-y-3">
          <div className="group/item flex items-center justify-between p-2 rounded-xl bg-stone-950/40 hover:bg-stone-900/50 border border-stone-800/40 hover:border-amber-500/30 transition-all duration-300">
            <div>
              <div className="text-xs font-bold text-stone-200 group-hover/item:text-amber-400 transition-colors">PassionMatch</div>
              <div className="text-[9px] text-stone-500 uppercase font-mono">Dating Network</div>
            </div>
            {setActiveTab ? (
              <button 
                onClick={(e) => handleNavigation('dating', e)}
                className="text-[10px] text-amber-400 bg-amber-400/5 border border-amber-400/10 hover:bg-amber-400 hover:text-stone-950 px-2.5 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer"
              >
                Visit
              </button>
            ) : (
              <Link 
                href="/?tab=dating"
                className="text-[10px] text-amber-400 bg-amber-400/5 border border-amber-400/10 hover:bg-amber-400 hover:text-stone-950 px-2.5 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                Visit
              </Link>
            )}
          </div>

          <div className="group/item flex items-center justify-between p-2 rounded-xl bg-stone-950/40 hover:bg-stone-900/50 border border-stone-800/40 hover:border-cyan-500/30 transition-all duration-300">
            <div>
              <div className="text-xs font-bold text-stone-200 group-hover/item:text-cyan-400 transition-colors">LiveJasmin</div>
              <div className="text-[9px] text-stone-500 uppercase font-mono">Premium Cams</div>
            </div>
            {setActiveTab ? (
              <button 
                onClick={(e) => handleNavigation('livecams', e)}
                className="text-[10px] text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 hover:bg-cyan-400 hover:text-stone-950 px-2.5 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer"
              >
                Visit
              </button>
            ) : (
              <Link 
                href="/?tab=livecams"
                className="text-[10px] text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 hover:bg-cyan-400 hover:text-stone-950 px-2.5 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                Visit
              </Link>
            )}
          </div>

          <div className="group/item flex items-center justify-between p-2 rounded-xl bg-stone-950/40 hover:bg-stone-900/50 border border-stone-800/40 hover:border-rose-500/30 transition-all duration-300">
            <div>
              <div className="text-xs font-bold text-stone-200 group-hover/item:text-rose-500 transition-colors">Nutaku Games</div>
              <div className="text-[9px] text-stone-500 uppercase font-mono">Adult Roleplay</div>
            </div>
            {setActiveTab ? (
              <button 
                onClick={(e) => handleNavigation('games', e)}
                className="text-[10px] text-rose-500 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500 hover:text-stone-950 px-2.5 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer"
              >
                Visit
              </button>
            ) : (
              <Link 
                href="/?tab=games"
                className="text-[10px] text-rose-500 bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500 hover:text-stone-950 px-2.5 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer flex items-center justify-center"
              >
                Visit
              </Link>
            )}
          </div>
        </div>
      </div>

    </aside>
  );
}
