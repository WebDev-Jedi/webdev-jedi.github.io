import { SiteConfig } from './config-types';
import { DATING_OFFERS, NEWS_ARTICLES, CATALOG_ITEMS } from './data';

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  offers: DATING_OFFERS,
  newsArticles: NEWS_ARTICLES,
  catalogItems: CATALOG_ITEMS,
  adPlacements: [
    {
      id: 'sidebar_top',
      name: 'Sidebar Top (300x250)',
      imageUrl: 'https://picsum.photos/seed/adsidebar/300/250',
      targetUrl: 'https://example.com/ad-target-sidebar',
      active: true
    },
    {
      id: 'header_banner',
      name: 'Header Banner (728x90)',
      imageUrl: 'https://picsum.photos/seed/adheader/728/90',
      targetUrl: 'https://example.com/ad-target-header',
      active: true
    },
    {
      id: 'footer_banner',
      name: 'Footer Banner (728x90)',
      imageUrl: 'https://picsum.photos/seed/adfooter/728/90',
      targetUrl: 'https://example.com/ad-target-footer',
      active: false
    }
  ],
  customPages: [
    {
      slug: 'vip-club',
      title: 'VIP Club',
      content: '## Welcome to the VIP Lounge\n\nEnjoy premium, ads-free content access, early sneak peeks, and direct chats with models. Build your profile today to stand out.\n\n### Membership Benefits\n- No external ads or popups\n- Custom verified VIP profile badge\n- Interactive priority feedback\n- Instant support response time within 5 minutes',
      structureType: 'columns',
      isActive: true,
      metaDescription: 'Special VIP area with premium bonuses and features.',
      createdAt: '2026-06-28'
    },
    {
      slug: 'about-us',
      title: 'About Us',
      content: '## Elite Adult Dating Portal\n\nWe are a premium directory and aggregate portal for the highest-rated adult services, safe dating apps, interactive live cam directories, and adult browser games.\n\nOur platform manually reviews every partner offer to ensure zero bots, maximum safety, and maximum user satisfaction. Play safe, love safe.',
      structureType: 'text',
      isActive: true,
      metaDescription: 'Learn more about our portal, safety checks, and high reviews standards.',
      createdAt: '2026-06-20'
    }
  ],
  texts: {
    logoText: 'Private Dating',
    heroTitle: 'EXCLUSIVE ADULT DATING & DIRECTORY',
    heroSubtitle: 'Safe matchmaking, elite cams, spicy puzzle browser RPG games, and expert-reviewed portals.',
    heroCtaText: 'DISCOVER TOP OFFERS',
    footerText: '© 2026 Private Dating Hub. All rights reserved. 18+ Only.',
    disclaimerText: 'This website is strictly intended for individuals aged 18 and older. All offers listed here undergo careful manual verification. Please read individual service terms and respect safe dating rules.',
    tabHome: 'Home',
    tabDating: 'Dating',
    tabLivecams: 'Live Cams',
    tabGames: 'Adult Games',
    tabBlog: 'Blog',
    tabGallery: 'Gallery',
    tabCatalog: 'Catalog',
    tabAds: 'Advertise'
  },
  seo: {
    home: {
      title: 'Private Dating | Premium Adult Dating & Livecams',
      description: 'Access handpicked, highly secure, and anonymous adult entertainment networks. Instant matchmaking with verified real profiles and zero hassle.',
      keywords: 'adult dating, hookup sites, mature dating, anonymous dating, verified profiles, local hookups'
    },
    dating: {
      title: 'Secure Adult Dating Offers & Premium Matches | Private Dating',
      description: 'Explore our handpicked selection of top-rated, anonymous, and secure local and international adult dating networks. Find your perfect match today.',
      keywords: 'adult dating offers, local matchmaking, secure dating apps, online hookup, casual encounters, premium dating'
    },
    livecams: {
      title: 'Exclusive Live Cam Streams & Interactive Shows | Private Dating',
      description: 'Connect with stunning hosts in real-time. Experience HD quality, interactive streaming channels, and private webcam sessions with zero delay.',
      keywords: 'live cams, webcam shows, adult streams, interactive cam sites, live sex chat, HD video chat'
    },
    games: {
      title: 'Top Adult RPG Games & Interactive Virtual Dating | Private Dating',
      description: 'Immerse yourself in high-quality virtual 3D adult games and romantic RPG simulations. Play online securely with high-end graphics and deep storylines.',
      keywords: 'adult games, adult RPG, interactive dating games, 3D sex games, virtual adult worlds, anime dating sims'
    },
    news: {
      title: 'Latest Adult Dating News, Tips & Safety Guides | Private Dating',
      description: 'Stay informed with the latest trends in digital matchmaking, online security tips, privacy protection strategies, and industry news.',
      keywords: 'dating blog, online safety, privacy guides, matchmaking news, dating app reviews, relationship tips'
    },
    'gallery-photos': {
      title: 'Stunning Adult Photo Galleries & Verified Models | Private Dating',
      description: 'Browse curated collections of high-resolution professional photography and stunning model portfolios. Verified real profiles only.',
      keywords: 'adult photo gallery, model portfolios, verified hot photos, sexy models, professional photo shoot'
    },
    'gallery-videos': {
      title: 'Premium Short Video Previews & Interactive Clips | Private Dating',
      description: 'Watch high-definition adult video clips, immersive short previews, and exclusive webcam highlight reels from our premier network.',
      keywords: 'adult videos, webcam clips, private video previews, video highlights, interactive short clips'
    },
    catalog: {
      title: 'Verified Adult Directory & Trusted Partner Sites | Private Dating',
      description: 'Discover our official catalog of reviewed, verified, and secure web services, adult platforms, and private membership networks.',
      keywords: 'adult directory, partner sites, trusted adult networks, safe adult services, reviewed platforms'
    },
    ads: {
      title: 'Advertise With Us | Premium Adult Traffic Placement | Private Dating',
      description: 'Promote your adult brand, dating app, or livecam network to a highly targeted global audience. Premium banner spots and listings available.',
      keywords: 'adult advertising, promote dating app, webcam traffic, banner ad placement, sponsor directory'
    }
  }
};
