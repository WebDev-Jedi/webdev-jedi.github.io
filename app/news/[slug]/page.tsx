import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { 
  Calendar, 
  Eye, 
  TrendingUp, 
  ArrowLeft,
  ChevronLeft,
  BookOpen,
  Home
 } from 'lucide-react';
import { getSiteConfig } from '@/lib/get-config';
import CustomSidebar from '@/components/Sidebar';
import { replaceSeoTemplates, getFriendlyCategoryName, generateNewsArticleSchema } from '@/lib/seo-helpers';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getSiteConfig();
  const article = config.newsArticles.find(a => a.slug === slug || a.id === slug);
  
  if (!article) {
    return {
      title: 'Стаття не знайдена | Private Dating',
    };
  }

  const brand = config.texts?.logoText || 'Private Dating';
  const categoryFriendly = getFriendlyCategoryName(article.category || 'news');

  const seoConfig = config.seo?.news;

  // Compile the SEO variables
  const variables = {
    title: article.title,
    excerpt: article.excerpt,
    description: article.excerpt,
    category: article.category,
    category_name: categoryFriendly,
    brand: brand,
    slug: article.slug || article.id,
  };

  const defaultTitleTemplate = '[title] | [category_name] | [brand] ([year])';
  const defaultDescTemplate = '[excerpt] - Читайте більше цікавих новин дейтингу та вебкамер у нашому блозі на [brand].';
  const defaultKeywordsTemplate = 'adult dating news, blog, analysis, [category_name], [brand], [year]';

  const titleTemplate = seoConfig?.title || defaultTitleTemplate;
  const descTemplate = seoConfig?.description || defaultDescTemplate;
  const keywordsTemplate = seoConfig?.keywords || defaultKeywordsTemplate;

  const pageTitle = replaceSeoTemplates(titleTemplate, variables);
  const pageDesc = replaceSeoTemplates(descTemplate, variables);
  const pageKeywords = replaceSeoTemplates(keywordsTemplate, variables);

  return {
    title: pageTitle,
    description: pageDesc,
    keywords: pageKeywords,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      images: [{ url: article.imageUrl }],
      type: 'article',
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const config = getSiteConfig();
  const article = config.newsArticles.find(a => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-md bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-xl">
          <BookOpen className="w-12 h-12 text-rose-500 mx-auto" />
          <h1 className="text-xl font-bold text-stone-100 font-display">Стаття не знайдена</h1>
          <p className="text-xs text-stone-400">
            Вибачте, але запитувана стаття не існує або була перенесена.
          </p>
          <Link 
            href="/?tab=news"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>До списку новин</span>
          </Link>
        </div>
      </div>
    );
  }

  // Get recommendations (excluding current, sorting by same category first)
  const relatedArticles = config.newsArticles
    .filter(art => art.id !== article.id)
    .sort((a, b) => {
      const aMatch = a.category === article.category ? 1 : 0;
      const bMatch = b.category === article.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 2);

  const siteLogoText = config.texts?.logoText || 'PORTAL';

  // Dynamic origin retrieval for structured data url matching
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'https';
  const originUrl = `${proto}://${host}`;
  const brand = config.texts?.logoText || 'Private Dating';

  const schemaJson = generateNewsArticleSchema(article, brand, originUrl);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased">
      {/* Dynamic JSON-LD Structured Data for Article */}
      <script
        id="jsonld-news-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      {/* HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-md border-b border-stone-900/60 transition-all">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/?tab=home" className="flex items-center gap-2 group">
            <span className="text-xl sm:text-2xl font-black tracking-wider text-amber-400 font-display uppercase select-none transition-transform group-hover:scale-[1.02]">
              {siteLogoText}
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link 
              href="/?tab=home"
              className="px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            >
              {config.texts?.tabHome || "Головна"}
            </Link>
            <Link 
              href="/?tab=dating"
              className="px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            >
              {config.texts?.tabDating || "Знайомства"}
            </Link>
            <Link 
              href="/?tab=livecams"
              className="px-3 py-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors"
            >
              {config.texts?.tabLivecams || "Вебкамери"}
            </Link>
            <Link 
              href="/?tab=news"
              className="px-3 py-1.5 text-xs font-semibold text-amber-400 bg-stone-900 border border-amber-500/10 rounded-lg transition-colors"
            >
              {config.texts?.tabBlog || "Блог"}
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
                  <span>Головна</span>
                </Link>
                <span className="text-stone-700">/</span>
                <Link href="/?tab=news" className="hover:text-amber-400 transition-colors">
                  <span>{config.texts?.tabBlog || "Блог"}</span>
                </Link>
                {article.category && (
                  <>
                    <span className="text-stone-700">/</span>
                    <span className="text-stone-400">{article.category}</span>
                  </>
                )}
                <span className="text-stone-700">/</span>
                <span className="text-stone-300 truncate max-w-[150px] sm:max-w-xs" title={article.title}>
                  {article.title}
                </span>
              </nav>

              {/* Back Link */}
              <Link 
                href="/?tab=news"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest transition-all hover:-translate-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Повернутися до блогу</span>
              </Link>
            </div>

        {/* Article Container */}
        <article className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-6 md:p-10 space-y-6 shadow-xl">
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="bg-cyan-950 border border-cyan-500/30 text-cyan-400 py-1 px-2.5 rounded font-bold uppercase tracking-wider text-[10px]">
              {article.category}
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              {article.date}
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              {article.views.toLocaleString()} переглядів
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-stone-100 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Main Cover Image */}
          <div className="relative h-64 sm:h-80 md:h-[420px] w-full rounded-2xl overflow-hidden bg-stone-950 border border-stone-800 shadow-inner">
            <Image 
              src={article.imageUrl} 
              alt={article.title} 
              fill 
              priority
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Blockquote Excerpt */}
          <div className="border-l-4 border-amber-400 pl-4 py-2 bg-stone-950/20 rounded-r-xl">
            <p className="text-sm sm:text-base font-sans font-medium text-stone-300 italic leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Rich Content paragraphs */}
          <div className="text-stone-200 text-sm sm:text-base leading-relaxed space-y-5 font-sans">
            {article.content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          {/* Share Block */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-950/40 border border-stone-800/80 mt-8">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-stone-200 font-display">Поділитися публікацією</p>
              <p className="text-[11px] text-stone-500 font-sans">Розповсюдити ці тренди та аналітику у своїх мережах.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://adult-portal.com/news/${article.slug || article.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-bold font-mono border border-blue-500/20 transition-all cursor-pointer"
              >
                Facebook
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`https://adult-portal.com/news/${article.slug || article.id}`)}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-bold font-mono border border-sky-500/20 transition-all cursor-pointer"
              >
                Telegram
              </a>
            </div>
          </div>
        </article>

        {/* Related News Widget */}
        {relatedArticles.length > 0 && (
          <div className="pt-8 border-t border-stone-800/80 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-amber-400 font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Схожі матеріали
              </h3>
              <span className="text-[10px] text-stone-500 font-mono uppercase">Цікаве у блозі</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((art) => (
                <Link 
                  href={`/news/${art.slug || art.id}`}
                  key={art.id}
                  className="bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800 hover:border-stone-700 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300"
                >
                  <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                    <Image 
                      src={art.imageUrl} 
                      alt={art.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-800/30 px-2 py-0.5 rounded">
                        {art.category}
                      </span>
                      <h4 className="font-bold text-sm sm:text-base text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-tight">
                        {art.title}
                      </h4>
                    </div>
                    <span className="text-xs text-amber-400 font-bold group-hover:underline flex items-center gap-1 pt-2">
                      Читати далі
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
          </div>
          <CustomSidebar />
        </div>
      </main>

      {/* FOOTER & DISCLAIMER */}
      <footer className="border-t border-stone-900 bg-stone-950/80 py-12 mt-16 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <p className="max-w-3xl mx-auto leading-relaxed text-stone-400">
            {config.texts?.disclaimerText || "This portal’s contents are strictly meant for adult audiences (18+). All reviews, catalogs, outward hyperlinks, and media files are provided solely for promotional activities."}
          </p>
          <p className="font-mono text-stone-600">
            {config.texts?.footerText || `© ${new Date().getFullYear()} Private Dating Hub. All rights reserved.`}
          </p>
        </div>
      </footer>
    </div>
  );
}
