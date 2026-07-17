import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getSiteConfig } from '@/lib/get-config';
import OfferClient from './OfferClient';
import { replaceSeoTemplates, getFriendlyCategoryName, generateOfferSchema } from '@/lib/seo-helpers';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = getSiteConfig();
  const offer = config.offers.find(o => o.slug === slug || o.id === slug);
  
  if (!offer) {
    return {
      title: 'Пропозиція не знайдена | Private Dating',
    };
  }

  const brand = config.texts?.logoText || 'Private Dating';
  const categoryFriendly = getFriendlyCategoryName(offer.category || 'dating');

  const seoConfig = config.seo?.[offer.category];

  // Compile the SEO variables
  const variables = {
    name: offer.name,
    title: offer.name,
    description: offer.shortDesc,
    excerpt: offer.shortDesc,
    category: offer.category,
    category_name: categoryFriendly,
    brand: brand,
    rating: offer.rating,
    active: offer.activeUsers ? `${offer.activeUsers.toLocaleString()} active` : '',
    slug: offer.slug || offer.id,
  };

  const defaultTitleTemplate = '[name] - [category_name] | [brand] (Рецензія [year])';
  const defaultDescTemplate = 'Шукаєте [name]? Читайте наш детальний огляд про [category_name] на [brand]. [description] Рейтинг: [rating] ★, [active].';
  const defaultKeywordsTemplate = '[name], adult dating, webcams, games, hookup, [category_name], [brand], [year]';

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
      images: [{ url: offer.imageUrl }],
    },
  };
}

export default async function OfferDetailsPage({ params }: Props) {
  const { slug } = await params;
  const config = getSiteConfig();
  const offer = config.offers.find(o => o.slug === slug || o.id === slug);

  if (!offer) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-4 max-w-md bg-stone-900 border border-stone-800 p-8 rounded-2xl shadow-xl">
          <h1 className="text-xl font-bold text-stone-100 font-display">Пропозиція не знайдена</h1>
          <p className="text-xs text-stone-400">
            Вибачте, але запитуваний сервіс не існує або був перенесений.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            <span>На головну</span>
          </Link>
        </div>
      </div>
    );
  }

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'https';
  const originUrl = `${proto}://${host}`;
  const brand = config.texts?.logoText || 'Private Dating';

  const schemaJson = generateOfferSchema(offer, brand, originUrl);

  return (
    <>
      {/* Dynamic JSON-LD Structured Data for Offer */}
      <script
        id="jsonld-offer"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />
      <OfferClient 
        offer={offer}
        logoText={config.texts?.logoText || 'PORTAL'}
        tabHomeText={config.texts?.tabHome}
        tabDatingText={config.texts?.tabDating}
        tabLivecamsText={config.texts?.tabLivecams}
        tabGamesText={config.texts?.tabGames}
        tabBlogText={config.texts?.tabBlog}
        disclaimerText={config.texts?.disclaimerText}
        footerText={config.texts?.footerText}
      />
    </>
  );
}
