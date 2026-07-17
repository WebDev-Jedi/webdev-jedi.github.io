export interface Offer {
  id: string;
  slug?: string;
  name: string;
  category: 'dating' | 'livecams' | 'games';
  shortDesc: string;
  fullDesc: string;
  imageUrl: string;
  views: number;
  likes: number;
  rating: number;
  ctaUrl: string;
  tags: string[];
  features: string[];
  pros: string[];
  activeUsers: number;
}

export interface NewsArticle {
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  imageUrl: string;
  views: number;
  category: string;
}

export interface CatalogItem {
  id: string;
  title: string;
  type: 'video' | 'photo';
  thumbnailUrl: string;
  mediaUrl?: string;
  duration?: string;
  likes: number;
  views: number;
  tags: string[];
}

export const DATING_OFFERS: Offer[] = [
  {
    id: 'amorhub',
    name: 'AmorHub',
    category: 'dating',
    shortDesc: 'A popular international dating platform with a smart matching algorithm based on interests and AI.',
    fullDesc: 'AmorHub is a leader in modern adult dating. Thanks to its innovative AI, the system automatically matches partners with high compatibility in your city. The platform offers instant private video chats, verified profiles with zero bots, and absolute confidentiality of your personal data. Start chatting right now and discover new horizons of pleasure.',
    imageUrl: 'https://picsum.photos/seed/dating1/600/400',
    views: 12450,
    likes: 850,
    rating: 4.9,
    ctaUrl: 'https://example.com/join-amorhub',
    tags: ['Video Chat', 'AI Matching', 'Quick Meetups', '18+'],
    features: [
      'Verified profiles (no bots)',
      'Instant chat translation in 40+ languages',
      'Private vanishing messages feature',
      'Local search by geolocation'
    ],
    pros: [
      'High chance of finding a partner within 15 minutes',
      'Elegant and intuitive user interface',
      'Free starting balance for new users'
    ],
    activeUsers: 3420
  },
  {
    id: 'secretlove',
    name: 'SecretLove',
    category: 'dating',
    shortDesc: 'An anonymous space for adult encounters, open relationships, and realizing your boldest fantasies without strings attached.',
    fullDesc: 'SecretLove is the perfect choice for those who value freedom and anonymity. No complicated surveys or social commitments. Open-minded people gather here searching for vivid emotions, quick dates, or free communication. A convenient filter system allows finding partners based on specific preferences and fetishes. Create your secret profile in 10 seconds!',
    imageUrl: 'https://picsum.photos/seed/dating2/600/400',
    views: 9310,
    likes: 620,
    rating: 4.7,
    ctaUrl: 'https://example.com/join-secretlove',
    tags: ['Anonymity', 'No Strings Attached', 'Open Relationships'],
    features: [
      'Fully anonymous registration with no email required',
      'Ability to hide photos for selected users',
      'Direct audio calls within the application',
      'Powerful filter for intimate preferences'
    ],
    pros: [
      'Maximum privacy protection',
      'Active community active 24/7',
      'Easy interface for fast swiping'
    ],
    activeUsers: 2150
  },
  {
    id: 'matchplay',
    name: 'MatchPlay',
    category: 'dating',
    shortDesc: 'A gamified dating platform where connections start with interactive games, quizzes, and exciting challenges.',
    fullDesc: 'Tired of boring "Hey, how are you?" intros? MatchPlay completely reboots the concept of online dating! Here, you play interactive mini-games, answer spicy quizzes together with potential partners, and break the ice in a gaming format. It is the best way to start an easy conversation and smoothly transition to a real meeting.',
    imageUrl: 'https://picsum.photos/seed/dating3/600/400',
    views: 7420,
    likes: 490,
    rating: 4.8,
    ctaUrl: 'https://example.com/join-matchplay',
    tags: ['Games', 'Quizzes', 'Casual Chat', 'Youth-focused'],
    features: [
      'Over 15 interactive icebreaker games',
      'Group chats based on interests and fandoms',
      'Video rooms with joint cinema viewing capability',
      'Weekly rankings of the most popular players'
    ],
    pros: [
      'No awkward pauses in conversation',
      'Fun and friendly atmosphere without pressure',
      'High conversion rate from game to date'
    ],
    activeUsers: 4890
  },
  {
    id: 'camshow',
    name: 'CamShow TV',
    category: 'livecams',
    shortDesc: 'An elite platform featuring private broadcasts from professional top models worldwide in ultra HD quality.',
    fullDesc: 'CamShow TV opens the door to a world of luxurious, interactive live shows. Chat with sensuous models in the public lounge or invite them to a private room for personalized request fulfillment. Ultra-low latency streaming technology delivers a true sense of physical presence, while Lovense interactive sex toys let you control the model’s pleasure directly from your device.',
    imageUrl: 'https://picsum.photos/seed/cams1/600/400',
    views: 18450,
    likes: 1220,
    rating: 4.95,
    ctaUrl: 'https://example.com/join-camshow',
    tags: ['HD Quality', 'Lovense Enabled', 'Private Shows', 'Top Models'],
    features: [
      '4K Ultra HD video stream with ultra-low delay',
      'Sync with interactive toys (Teledildonics)',
      'Daily theme shows and contests',
      'Wide choice of categories and model tags'
    ],
    pros: [
      'Huge model base online 24/7',
      'Generous bonuses on the first token top-up',
      'Free preview available in the public hall'
    ],
    activeUsers: 8120
  },
  {
    id: 'stripstream',
    name: 'StripStream Premium',
    category: 'livecams',
    shortDesc: 'A professional webcam show platform focusing on interaction and real-time custom request fulfillment.',
    fullDesc: 'StripStream Premium offers a whole new level of interactivity. Each model is ready to fulfill your fantasies and wishes in high definition. A convenient tipping system, virtual gifts, and exclusive private cabinets make this the top platform for those seeking a highly personalized approach and maximum responsiveness.',
    imageUrl: 'https://picsum.photos/seed/cams2/600/400',
    views: 14120,
    likes: 910,
    rating: 4.85,
    ctaUrl: 'https://example.com/join-stripstream',
    tags: ['Interactive', 'Custom Requests', 'VIP Cabins'],
    features: [
      'Exclusive VIP rooms with high confidentiality',
      'Two-way video calling (model can see you)',
      'Professional studio sound and light setups',
      'Flexible private rule customization options'
    ],
    pros: [
      'Highly responsive models who love conversing',
      'Fast, anonymous cryptocurrency payments',
      '24/7 client support'
    ],
    activeUsers: 5310
  },
  {
    id: 'sincity',
    name: 'SinCity RPG',
    category: 'games',
    shortDesc: 'An engaging online visual role-playing game set in a noir cyberpunk metropolis with elements of seduction.',
    fullDesc: 'Welcome to the city of sins, SinCity! In this multiplayer browser RPG, you build your own character, level up their charisma, style, and reputation, and immerse yourself in the city’s nightlife. Meet real players, forge alliances, go on virtual dates, run nightclubs, and win the hearts of the city’s most gorgeous residents.',
    imageUrl: 'https://picsum.photos/seed/games1/600/400',
    views: 8930,
    likes: 710,
    rating: 4.75,
    ctaUrl: 'https://example.com/join-sincity',
    tags: ['Cyberpunk', 'Role-playing', 'Character Growth', 'Multiplayer'],
    features: [
      'Hundreds of unique story quests and intimate subplots',
      'Full wardrobe and apartment customization',
      'Clans, businesses, intrigues, and cooperative events',
      'Integrated internal messenger for flirting'
    ],
    pros: [
      'No download required - play directly in your browser',
      'Deep storyline with mature humor and spicy scenes',
      'Active community on Discord and Telegram'
    ],
    activeUsers: 6240
  },
  {
    id: 'haremquest',
    name: 'HaremQuest Legends',
    category: 'games',
    shortDesc: 'An anime match-3 puzzle game with dating elements, a rich fantasy plot, and beautiful collectible character cards.',
    fullDesc: 'Become a legendary hero in a fantasy world where your primary power is your charisma! Beat exciting match-3 levels to unlock conversations, gifts, and the affection of charming warrior girls, sorceresses, and elves. Build an elite collection of high-quality anime cards, unlock exclusive artwork, and construct your dream castle.',
    imageUrl: 'https://picsum.photos/seed/games2/600/400',
    views: 11020,
    likes: 980,
    rating: 4.9,
    ctaUrl: 'https://example.com/join-haremquest',
    tags: ['Anime', 'Match-3', 'Puzzle', 'Collectible Cards'],
    features: [
      'Vivid 2D Live animation of characters',
      'Over 500 levels of diverse difficulty',
      'Fully voiced characters by professional voice actresses',
      'Regular seasonal events with rare rewards'
    ],
    pros: [
      'Incredibly beautiful art style and illustrations',
      'Splendid balance between puzzle-solving and romantic plot',
      'Highly optimized for mobile phones and tablets'
    ],
    activeUsers: 9400
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news1',
    title: 'Dating Trends 2026: How Artificial Intelligence is Transforming Online Matches',
    excerpt: 'Modern AI algorithms now do not just recommend profiles, but help write your icebreakers and analyze psychological compatibility.',
    content: 'The online dating industry is witnessing an unprecedented technological boom. In 2026, leading platforms fully integrated neural networks. Now, AI acts as your personal wingman. It analyzes your communication style, uncovers latent interests, and suggests ideal scenarios for first dates. In addition, AI actively fights fraud, automatically flagging fake profiles and detecting suspicious behavior in seconds. Users report that smart matchmaking has slashed search times for real meetings by up to 40%.',
    date: '2026-06-25',
    imageUrl: 'https://picsum.photos/seed/news-ai/800/500',
    views: 3120,
    category: 'Technology'
  },
  {
    id: 'news2',
    title: 'Online Safety: 5 Golden Rules for a First Date with a Stranger',
    excerpt: 'How to protect yourself and your personal security when organizing a real-life meetup after meeting on a dating site.',
    content: 'Meeting someone new is always thrilling, but safety should remain your number one priority. Security experts recommend five essential rules: 1. Always meet in crowded public places (cafes, malls, busy parks). 2. Inform a close friend or relative of where you are going and share your live location. 3. Arrive and return home independently; never let a stranger pick you up from your house on a first date. 4. Guard your personal belongings and drinks - never leave them unattended. 5. Trust your gut: if something feels off or makes you uncomfortable, feel free to politely end the date and leave.',
    date: '2026-06-21',
    imageUrl: 'https://picsum.photos/seed/news-safety/800/500',
    views: 4560,
    category: 'Advice'
  },
  {
    id: 'news3',
    title: 'Niche Dating: Why Specialized Sites are Outperforming Global Giants',
    excerpt: 'Why users are increasingly choosing dating platforms tailored to specific interests, professions, or lifestyles.',
    content: 'The era of massive dating apps with millions of random swipes is coming to an end. Modern users value their time and want to see like-minded individuals in their feeds. As a result, we observe a huge influx of users to niche platforms: vegetarian dating, travel lovers, gamers, professionals, or alternative lifestyles. Specialized services offer a much higher concentration of target audiences, lowering disappointment rates and helping people connect with matching core values rapidly.',
    date: '2026-06-18',
    imageUrl: 'https://picsum.photos/seed/news-niche/800/500',
    views: 2890,
    category: 'Analysis'
  }
];

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: 'vid1',
    title: 'Exclusive interview with CamShow TV top model: Secrets to flirting and success',
    type: 'video',
    thumbnailUrl: 'https://picsum.photos/seed/catvid1/400/300',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '02:15',
    likes: 345,
    views: 12500,
    tags: ['Interview', 'Lifehacks', 'Models']
  },
  {
    id: 'vid2',
    title: 'Character customization guide in SinCity RPG: How to rule the metropolis',
    type: 'video',
    thumbnailUrl: 'https://picsum.photos/seed/catvid2/400/300',
    mediaUrl: 'https://www.w3schools.com/html/movie.mp4',
    duration: '01:04',
    likes: 198,
    views: 7800,
    tags: ['Games', 'Guides', 'Gameplay']
  },
  {
    id: 'photo1',
    title: 'Summer looks from the seasons best models - "Sun & Passion" Photoshoot',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/catphoto1/600/800',
    likes: 567,
    views: 18900,
    tags: ['Photoshoot', 'Models', 'Trends']
  },
  {
    id: 'photo2',
    title: 'HaremQuest Legends Anime Art Gallery - Special Release',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/catphoto2/600/800',
    likes: 712,
    views: 21500,
    tags: ['Art', 'Anime', 'Collectible']
  },
  {
    id: 'photo3',
    title: 'Secrets to studio lighting for webcam streaming: Behind the scenes of StripStream',
    type: 'photo',
    thumbnailUrl: 'https://picsum.photos/seed/catphoto3/600/800',
    likes: 289,
    views: 9400,
    tags: ['Exclusive', 'Behind The Scenes', 'StripStream']
  },
  {
    id: 'vid3',
    title: 'Top 5 features of Lovense interactive toys on CamShow',
    type: 'video',
    thumbnailUrl: 'https://picsum.photos/seed/catvid3/400/300',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '01:45',
    likes: 412,
    views: 14200,
    tags: ['Reviews', 'Lovense', 'Technology']
  }
];

export const AD_PRICING_OPTIONS = [
  {
    id: 'banner_header',
    name: 'Top Header Banner (728x90)',
    description: 'Prominent banner placed at the very top of all pages. Ensures highest visibility and maximal CTR.',
    price: '$450 / mo',
    period: 'month',
    icon: 'LayoutTemplate',
    ctr: '1.8% - 2.5%'
  },
  {
    id: 'native_card',
    name: 'Native VIP Card (Top Offer)',
    description: 'Place your dating offer at the absolute top position of our directory list, designated with a "RECOMMENDED" badge.',
    price: '$600 / mo',
    period: 'month',
    icon: 'Award',
    ctr: '2.4% - 3.8%'
  },
  {
    id: 'banner_sidebar',
    name: 'Sidebar Banner (300x250)',
    description: 'A sleek ad block located in the sidebar. Remains visible while users read news articles or browse offer lists.',
    price: '$250 / mo',
    period: 'month',
    icon: 'Sidebar',
    ctr: '0.9% - 1.4%'
  },
  {
    id: 'popup_under',
    name: 'Pop-Under Redirect',
    description: 'Directs users to your link in a new background tab upon their first click on our portal (fully compliant ad traffic).',
    price: '$15 / CPM',
    period: 'per 1000 views',
    icon: 'ExternalLink',
    ctr: '100% Clicks'
  }
];
