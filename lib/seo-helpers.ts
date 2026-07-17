export interface SeoVariables {
  title?: string;
  name?: string;
  description?: string;
  excerpt?: string;
  category?: string;
  category_name?: string;
  brand?: string;
  site_name?: string;
  rating?: string | number;
  active?: string;
  slug?: string;
  year?: string;
  month?: string;
}

/**
 * Replaces SEO placeholders like [title], [name], [brand], [year], etc.
 * with their dynamic real-time values to maximize SERP performance.
 */
export function replaceSeoTemplates(template: string, variables: SeoVariables): string {
  if (!template) return '';
  let result = template;
  
  const currentYear = variables.year || String(new Date().getFullYear());
  const currentMonth = variables.month || String(new Date().getMonth() + 1);
  const brandName = variables.brand || variables.site_name || 'Private Dating';

  const replacements: Record<string, string> = {
    '[title]': variables.title || variables.name || '',
    '[name]': variables.name || variables.title || '',
    '[description]': variables.description || variables.excerpt || '',
    '[excerpt]': variables.excerpt || variables.description || '',
    '[category]': variables.category || '',
    '[category_name]': variables.category_name || '',
    '[brand]': brandName,
    '[site_name]': brandName,
    '[rating]': String(variables.rating || '4.8'),
    '[active]': variables.active || '',
    '[slug]': variables.slug || '',
    '[year]': currentYear,
    '[month]': currentMonth,
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.split(placeholder).join(value);
  }

  return result;
}

/**
 * Generates JSON-LD Structured Data for a NewsArticle (BlogPosting Schema)
 */
export function generateNewsArticleSchema(
  article: {
    id: string;
    slug?: string;
    title: string;
    excerpt: string;
    imageUrl: string;
    date: string;
    category?: string;
  },
  brand: string,
  originUrl?: string
) {
  const url = originUrl ? `${originUrl}/news/${article.slug || article.id}` : '';
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    ...(url ? { "mainEntityOfPage": { "@type": "WebPage", "@id": url } } : {}),
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.imageUrl],
    "datePublished": article.date,
    "dateModified": article.date,
    "category": getFriendlyCategoryName(article.category || 'news'),
    "author": {
      "@type": "Organization",
      "name": brand
    },
    "publisher": {
      "@type": "Organization",
      "name": brand,
      "logo": {
        "@type": "ImageObject",
        "url": article.imageUrl
      }
    }
  };
}

/**
 * Generates JSON-LD Structured Data for an Offer (Product / Review Schema)
 */
export function generateOfferSchema(
  offer: {
    id: string;
    slug?: string;
    name: string;
    category: string;
    shortDesc: string;
    imageUrl: string;
    rating: number;
    likes?: number;
  },
  brand: string,
  originUrl?: string
) {
  const categoryName = getFriendlyCategoryName(offer.category);
  const url = originUrl ? `${originUrl}/offers/${offer.slug || offer.id}` : '';

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "headline": `Огляд на ${offer.name} - ${categoryName}`,
    "image": offer.imageUrl,
    "datePublished": "2026-07-02T12:00:00Z",
    "reviewBody": offer.shortDesc,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": String(offer.rating),
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": brand
    },
    "publisher": {
      "@type": "Organization",
      "name": brand
    },
    "itemReviewed": {
      "@type": "Product",
      "name": offer.name,
      "image": [offer.imageUrl],
      "description": offer.shortDesc,
      ...(url ? { "url": url } : {}),
      "brand": {
        "@type": "Brand",
        "name": offer.name
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": String(offer.rating),
        "reviewCount": String((offer.likes || 120) + 5),
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  };
}

/**
 * Helper to get user-friendly category names in Ukrainian
 */
export function getFriendlyCategoryName(category?: string): string {
  if (!category) return '';
  const lower = category.toLowerCase();
  switch (lower) {
    case 'dating':
    case 'dating_sites':
      return 'Знайомства';
    case 'livecams':
    case 'webcams':
      return 'Вебкамери';
    case 'games':
      return 'Ігри';
    case 'news':
    case 'blog':
      return 'Блог';
    default:
      return category;
  }
}
