import { Offer, NewsArticle, CatalogItem } from './data';

export interface CustomPage {
  slug: string;
  title: string;
  content: string;
  structureType: 'text' | 'columns' | 'bento' | 'grid';
  isActive: boolean;
  metaDescription?: string;
  createdAt: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  imageUrl: string;
  targetUrl: string;
  active: boolean;
}

export interface SiteTexts {
  logoText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
  footerText: string;
  disclaimerText: string;
  
  // Navigation tabs names
  tabHome: string;
  tabDating: string;
  tabLivecams: string;
  tabGames: string;
  tabBlog: string;
  tabGallery: string;
  tabCatalog: string;
  tabAds: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface SiteConfig {
  offers: Offer[];
  newsArticles: NewsArticle[];
  catalogItems: CatalogItem[];
  adPlacements: AdPlacement[];
  customPages: CustomPage[];
  texts: SiteTexts;
  seo?: Record<string, SeoMetadata>;
}
