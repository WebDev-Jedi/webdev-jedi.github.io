'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Check, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  ChevronLeft, 
  Eye, 
  CheckCircle2,
  Home
} from 'lucide-react';
import { Offer } from '@/lib/data';
import { SiteTexts } from '@/lib/config-types';
import CustomSidebar from '@/components/Sidebar';
import ThemeSwitcher from '@/components/ThemeSwitcher';

interface OfferClientProps {
  offer: Offer;
  logoText: string;
  tabHomeText?: string;
  tabDatingText?: string;
  tabLivecamsText?: string;
  tabGamesText?: string;
  tabBlogText?: string;
  disclaimerText?: string;
  footerText?: string;
}

export default function OfferClient({
  offer,
  logoText,
  tabHomeText = "Home",
  tabDatingText = "Dating",
  tabLivecamsText = "Live Cams",
  tabGamesText = "Adult Games",
  tabBlogText = "Blog",
  disclaimerText,
  footerText
}: OfferClientProps) {
  // Try loading reviews from localStorage
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [newComment, setNewComment] = useState({ author: '', rating: 5, text: '' });
  const [viewsCount, setViewsCount] = useState(offer.views);

  useEffect(() => {
    // Increment local view count simulation
    const viewTimer = setTimeout(() => {
      setViewsCount(prev => prev + 1);
    }, 500);

    if (typeof window !== 'undefined') {
      const savedReviews = localStorage.getItem(`offer_reviews_${offer.id}`);
      setTimeout(() => {
        if (savedReviews) {
          setReviewsList(JSON.parse(savedReviews));
        } else {
          // Fallback to static default comments matching page.tsx
          const defaultReviews: { [key: string]: any[] } = {
            'amorhub': [
              { id: 1, author: 'Alex_99', rating: 5, text: 'Awesome service! Found a real match on the first day. The private video chat is super smooth.', date: '2026-06-25' },
              { id: 2, author: 'DatingKing', rating: 4, text: 'Great selection of verified profiles, almost zero fake accounts. Highly recommended.', date: '2026-06-23' }
            ],
            'camshow': [
              { id: 1, author: 'VipViewer', rating: 5, text: 'Stream quality is perfect, Lovense interactive toys reaction delay is non-existent. Best webcam experience!', date: '2026-06-26' }
            ]
          };
          setReviewsList(defaultReviews[offer.id] || []);
        }
      }, 0);
    }
    return () => clearTimeout(viewTimer);
  }, [offer.id]);

  const handleAddComment = () => {
    if (!newComment.author.trim() || !newComment.text.trim()) {
      alert('Будь ласка, заповніть ваше ім’я та текст відгуку.');
      return;
    }

    const commentObj = {
      id: Date.now(),
      author: newComment.author,
      rating: newComment.rating,
      text: newComment.text,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedReviews = [commentObj, ...reviewsList];
    setReviewsList(updatedReviews);
    localStorage.setItem(`offer_reviews_${offer.id}`, JSON.stringify(updatedReviews));

    // Reset comment inputs
    setNewComment({ author: '', rating: 5, text: '' });
  };

  // Map category to standard tabs
  const getCategoryTab = (category: string) => {
    if (category === 'livecams') return 'livecams';
    if (category === 'games') return 'games';
    return 'dating';
  };

  const activeCategoryTab = getCategoryTab(offer.category);

  const getCategoryLabel = (category: string) => {
    if (category === 'livecams') return tabLivecamsText;
    if (category === 'games') return tabGamesText;
    return tabDatingText;
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased">
      {/* HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-900/60 transition-all">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href={`/?tab=home`} className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl font-black tracking-wider text-amber-400 font-display uppercase select-none transition-transform group-hover:scale-[1.02]">
              {logoText}
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link 
              href="/?tab=home"
              className="px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            >
              {tabHomeText}
            </Link>
            <Link 
              href="/?tab=dating"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeCategoryTab === 'dating' 
                  ? 'text-amber-400 bg-stone-900 border border-amber-500/10' 
                  : 'text-stone-400 hover:text-amber-400'
              }`}
            >
              {tabDatingText}
            </Link>
            <Link 
              href="/?tab=livecams"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeCategoryTab === 'livecams' 
                  ? 'text-amber-400 bg-stone-900 border border-amber-500/10' 
                  : 'text-stone-400 hover:text-amber-400'
              }`}
            >
              {tabLivecamsText}
            </Link>
            <Link 
              href="/?tab=games"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeCategoryTab === 'games' 
                  ? 'text-amber-400 bg-stone-900 border border-amber-500/10' 
                  : 'text-stone-400 hover:text-amber-400'
              }`}
            >
              {tabGamesText}
            </Link>
            <Link 
              href="/?tab=news"
              className="px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            >
              {tabBlogText}
            </Link>
          </nav>

          <div className="flex items-center">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* MAIN BODY CONTAINER */}
      <main className="w-full px-4 sm:px-8 md:px-[50px] py-8 max-w-7xl mx-auto flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0 space-y-8">
            <div className="space-y-3">
              {/* Breadcrumb Navigation */}
              <nav className="flex flex-wrap items-center gap-2 text-xs text-stone-500 font-mono pb-1 border-b border-stone-900/40">
                <Link href="/?tab=home" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" />
                  <span>{tabHomeText}</span>
                </Link>
                <span className="text-stone-700">/</span>
                <Link href={`/?tab=${activeCategoryTab}`} className="hover:text-amber-400 transition-colors">
                  <span>{getCategoryLabel(offer.category)}</span>
                </Link>
                <span className="text-stone-700">/</span>
                <span className="text-stone-300 truncate max-w-[150px] sm:max-w-xs" title={offer.name}>
                  {offer.name}
                </span>
              </nav>

              {/* Back Link */}
              <Link 
                href={`/?tab=${activeCategoryTab}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest transition-all hover:-translate-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Повернутися до каталогу</span>
              </Link>
            </div>

        {/* Dynamic Offer Details Block */}
        <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 md:p-10 space-y-8 shadow-xl">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between border-b border-stone-800/60 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shrink-0 shadow-lg">
                <Image 
                  src={offer.imageUrl} 
                  alt={offer.name} 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black font-display text-amber-400 flex flex-wrap items-center gap-2 leading-none">
                  <span>{offer.name}</span>
                  {offer.rating >= 4.8 && (
                    <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 text-[9px] px-2.5 py-1 rounded-full border border-amber-500/25 font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      Verified Partner
                    </span>
                  )}
                </h1>
                <div className="text-xs text-stone-400 font-mono flex flex-wrap items-center gap-2 pt-1">
                  <span>Категорія: {offer.category === 'dating' ? 'Знайомства (Dating)' : offer.category === 'livecams' ? 'Вебкамери (Live Cams)' : 'Дорослі ігри (Adult Games)'}</span>
                  <span className="text-stone-700">•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    {viewsCount.toLocaleString()} переглядів
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-stone-950/60 border border-stone-800 rounded-xl px-4 py-2 font-mono text-center">
              <span className="text-[10px] text-stone-500 uppercase block leading-tight font-bold">Оцінка платформи</span>
              <span className="text-xl font-black text-amber-400">{offer.rating.toFixed(2)} <span className="text-stone-500 text-xs">/ 5.0</span></span>
            </div>
          </div>

          {/* Large Promo Banner */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
            <Image 
              src={offer.imageUrl} 
              alt={offer.name} 
              fill 
              priority
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent" />
            
            {/* Active Users Indicator */}
            {offer.activeUsers && (
              <div className="absolute bottom-4 left-4 bg-stone-950/80 backdrop-blur-md border border-emerald-500/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold text-stone-200">
                  {offer.activeUsers.toLocaleString()} активних користувачів зараз
                </span>
              </div>
            )}
          </div>

          {/* Overview Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">Огляд платформи</h3>
            <p className="text-stone-200 leading-relaxed font-sans text-sm sm:text-base">
              {offer.fullDesc}
            </p>
          </div>

          {/* Key characteristics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Key features */}
            <div className="bg-stone-950/40 p-5 rounded-2xl border border-stone-800/80 space-y-3">
              <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-stone-800 pb-2">
                Особливості сервісу
              </h4>
              <ul className="space-y-2">
                {offer.features.map((feat, i) => (
                  <li key={i} className="text-xs text-stone-300 flex items-start gap-2 leading-relaxed">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pros */}
            <div className="bg-stone-950/40 p-5 rounded-2xl border border-stone-800/80 space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-2 border-b border-stone-800 pb-2">
                Чому варто зареєструватися
              </h4>
              <ul className="space-y-2">
                {offer.pros.map((pro, i) => (
                  <li key={i} className="text-xs text-stone-300 flex items-start gap-2 leading-relaxed">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Box */}
          <div className="pt-4 border-t border-stone-800/60 text-center space-y-3">
            <a
              href={offer.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto px-10 py-4 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-center rounded-xl transition-all shadow-[0_4px_25px_rgba(245,158,11,0.25)] hover:shadow-[0_4px_30px_rgba(245,158,11,0.35)] items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer hover:scale-[1.01]"
              id="cta-registration-link"
            >
              <span>Зареєструватися безкоштовно</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <p className="text-[10px] text-stone-500">
              🔒 Безпечне шифроване з’єднання. Реєстрація є конфіденційною та надійною.
            </p>
          </div>

          {/* INTERACTIVE COMMENTS / REVIEWS SECTION */}
          <div className="space-y-6 border-t border-stone-800/80 pt-8">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-400 font-mono flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              Відгуки та обговорення платформи ({reviewsList.length})
            </h3>

            {/* Comment input form */}
            <div className="bg-stone-950/80 p-5 rounded-2xl border border-stone-800/80 space-y-4">
              <h4 className="text-xs font-bold text-stone-300">Написати анонімний відгук</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Ваш нікнейм:</label>
                  <input 
                    type="text" 
                    placeholder="Приклад: Roman_Kyiv"
                    value={newComment.author}
                    onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400 font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Ваша оцінка:</label>
                  <select
                    value={newComment.rating}
                    onChange={(e) => setNewComment({ ...newComment, rating: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                    <option value="3">⭐⭐⭐ (3/5)</option>
                    <option value="2">⭐⭐ (2/5)</option>
                    <option value="1">⭐ (1/5)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">Текст відгуку:</label>
                <textarea 
                  placeholder="Опишіть ваш досвід використання: швидкість завантаження, якість трансляцій, наявність ботів, анонімність, робота підтримки..."
                  rows={3}
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  className="w-full p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400 resize-none font-sans"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleAddComment}
                  className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Опублікувати відгук</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List of comments */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {reviewsList.length === 0 ? (
                <p className="text-xs text-stone-500 text-center py-6 font-sans">Відгуків про цей сервіс поки що немає. Залиште свій першим!</p>
              ) : (
                reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-stone-950/40 p-4 rounded-xl border border-stone-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-stone-200">{rev.author}</span>
                      <span className="text-stone-500 text-[10px] font-mono">{rev.date}</span>
                    </div>
                    <div className="text-amber-400 text-[10px] tracking-wider leading-none">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans">{rev.text}</p>
                  </div>
                ))
              )}
            </div>

          </div>

        </div>
          </div>
          <CustomSidebar />
        </div>

      </main>

      {/* FOOTER & DISCLAIMER */}
      <footer className="border-t border-stone-900 bg-stone-950/80 py-12 mt-16 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <p className="max-w-3xl mx-auto leading-relaxed text-stone-400">
            {disclaimerText || "This portal’s contents are strictly meant for adult audiences (18+). All reviews, catalogs, outward hyperlinks, and media files are provided solely for promotional activities."}
          </p>
          <p className="font-mono text-stone-600">
            {footerText || `© ${new Date().getFullYear()} Private Dating Hub. All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  );
}
