'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CustomSidebar from '@/components/Sidebar';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Eye, 
  Share2, 
  Star, 
  Award, 
  LayoutTemplate, 
  Sidebar, 
  ExternalLink, 
  ShieldAlert, 
  Check, 
  Search, 
  TrendingUp, 
  Calendar, 
  MessageSquare, 
  Copy, 
  CheckCircle2, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  X, 
  Menu,
  Send,
  Heart,
  ChevronRight,
  ChevronDown,
  Flame,
  Tv,
  Gamepad2,
  Image as ImageIcon,
  DollarSign,
  HelpCircle,
  Mail,
  ArrowUp,
  Newspaper,
  Layers,
  AlertCircle
} from 'lucide-react';
import { 
  DATING_OFFERS, 
  NEWS_ARTICLES, 
  CATALOG_ITEMS, 
  AD_PRICING_OPTIONS, 
  Offer, 
  NewsArticle, 
  CatalogItem 
} from '@/lib/data';
import { SiteConfig } from '@/lib/config-types';
import { DEFAULT_SITE_CONFIG } from '@/lib/default-config';
import Modals from '@/components/Modals';
import { OfferCardSkeleton, NewsCardSkeleton, SkeletonImage } from '@/components/Skeletons';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const FAQ_ITEMS = [
  {
    id: 1,
    question: "How does the age verification system work on this portal?",
    answer: "All recommended external platforms and directory listings require users to verify they are 18 years of age or older. This portal does not collect personal identity documents directly; however, we strictly mandate that our partner networks employ robust age-gating procedures (such as credit card verification, ID uploads, or digital age analysis) in compliance with local regulations to ensure a safe environment."
  },
  {
    id: 2,
    question: "Is my privacy protected while using this portal?",
    answer: "Yes, absolutely. We respect your confidentiality. Our platform operates entirely as an informational directory and blog without tracking individual user identities. No personal profiling, tracking cookies for targeted advertisement, or browsing logs are stored on our servers. Your security is our highest priority."
  },
  {
    id: 3,
    question: "Are all the dating offers, live webcams, and adult games hand-verified?",
    answer: "Yes. Every advertising site, livecam hall, and adult roleplay game catalogued in our hub undergoes rigorous manual testing by our administration team. We evaluate them for service legitimacy, secure connections (SSL), transparent billing terms, and active support channels before they are approved for listing."
  },
  {
    id: 4,
    question: "How do I list my platform or advertise on this portal?",
    answer: "If you own an adult network, webcam platform, or virtual game and would like to submit a listing, please navigate to our 'Advertise' section or contact our support team directly via Telegram (@private_dating_ads). We offer flexible visual banner placement, customized categories, and prominent partner sites features."
  },
  {
    id: 5,
    question: "Are there any hidden fees for browsing the galleries or directory?",
    answer: "None at all. Our directory, photo galleries, video archives, and reviews are 100% free to access. We generate revenue purely through native advertisements and sponsored placements from our trusted partners. We will never ask you for payment details or membership registration on this hub."
  }
];

export default function PrivateDatingApp() {
  // Navigation & Category states
  const [activeTab, setActiveTab] = useState<string>('home');
  const [galleryDropdownOpen, setGalleryDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState<boolean>(false);
  
  const [ageVerified, setAgeVerified] = useState<boolean>(false);
  const [showAgeGate, setShowAgeGate] = useState<boolean>(true);

  // Global site configuration state
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);

  // Offers state with dynamic views incrementing
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_SITE_CONFIG.offers);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('default');
  const offersGridRef = React.useRef<HTMLDivElement>(null);
  const [blogSearchQuery, setBlogSearchQuery] = useState<string>('');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('All');
  const [visibleNewsCount, setVisibleNewsCount] = useState<number>(4);
  const [isNewsLoadingMore, setIsNewsLoadingMore] = useState<boolean>(false);

  // Skeleton loading states for perceived performance
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isOffersGridLoading, setIsOffersGridLoading] = useState<boolean>(false);

  // Global viewport scroll progress state
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Media Catalog states
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(DEFAULT_SITE_CONFIG.catalogItems);
  const [activeVideo, setActiveVideo] = useState<CatalogItem | null>(null);
  const [activePhoto, setActivePhoto] = useState<CatalogItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Shares and Copy feedback states
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  // ADS Form submissions
  const [adsForm, setAdsForm] = useState({
    name: '',
    contact: '',
    format: 'native_card',
    budget: '',
    message: ''
  });
  const [adsSubmissions, setAdsSubmissions] = useState<any[]>([]);
  const [isSubmittingAds, setIsSubmittingAds] = useState<boolean>(false);
  const [adsSubmittedSuccess, setAdsSubmittedSuccess] = useState<boolean>(false);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // FAQ Modal states
  const [isFaqModalOpen, setIsFaqModalOpen] = useState<boolean>(false);
  const [faqForm, setFaqForm] = useState({
    name: '',
    email: '',
    category: 'General Safety',
    message: ''
  });
  const [isFaqSubmitting, setIsFaqSubmitting] = useState<boolean>(false);
  const [faqSubmitSuccess, setFaqSubmitSuccess] = useState<boolean>(false);
  const [faqErrors, setFaqErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // DMCA form states
  const [dmcaForm, setDmcaForm] = useState({
    name: '',
    email: '',
    targetUrl: '',
    description: ''
  });
  const [dmcaSubmissions, setDmcaSubmissions] = useState<any[]>([]);
  const [isSubmittingDmca, setIsSubmittingDmca] = useState<boolean>(false);
  const [dmcaSubmittedSuccess, setDmcaSubmittedSuccess] = useState<boolean>(false);

  // Feedback form states
  const [feedbackForm, setFeedbackForm] = useState({
    nickname: '',
    email: '',
    rating: 5,
    message: ''
  });
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<any[]>([
    {
      id: 1,
      nickname: 'Jack_99',
      rating: 5,
      message: 'Excellent directory! I checked several webcam websites listed here and they are indeed hand-verified and offer great deals. Clean UI and very fast.',
      date: '2026-06-25'
    },
    {
      id: 2,
      nickname: 'LunaVibe',
      rating: 4,
      message: 'Great reviews, very helpful! The dating site comparisons are accurate and saved me a lot of time testing out platforms. Would love to see more adult games.',
      date: '2026-06-27'
    }
  ]);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSubmittedSuccess, setFeedbackSubmittedSuccess] = useState<boolean>(false);

  // Newsletter states
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState<boolean>(false);
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);
  const [newsletterValidationError, setNewsletterValidationError] = useState<string>('');

  const handleDmcaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmcaForm.name || !dmcaForm.email || !dmcaForm.targetUrl || !dmcaForm.description) return;
    setIsSubmittingDmca(true);
    setTimeout(() => {
      setIsSubmittingDmca(false);
      setDmcaSubmittedSuccess(true);
      const newSubmission = {
        id: Date.now(),
        name: dmcaForm.name,
        email: dmcaForm.email,
        targetUrl: dmcaForm.targetUrl,
        description: dmcaForm.description,
        status: 'PENDING ADJUDICATION',
        date: new Date().toISOString().split('T')[0]
      };
      setDmcaSubmissions(prev => [newSubmission, ...prev]);
      setDmcaForm({ name: '', email: '', targetUrl: '', description: '' });
      setTimeout(() => setDmcaSubmittedSuccess(false), 5000);
    }, 1200);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.nickname || !feedbackForm.message) return;
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackSubmittedSuccess(true);
      const newSubmission = {
        id: Date.now(),
        nickname: feedbackForm.nickname,
        rating: feedbackForm.rating,
        message: feedbackForm.message,
        date: new Date().toISOString().split('T')[0]
      };
      setFeedbackSubmissions(prev => [newSubmission, ...prev]);
      setFeedbackForm({ nickname: '', email: '', rating: 5, message: '' });
      setTimeout(() => setFeedbackSubmittedSuccess(false), 5000);
    }, 1000);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    // Client-side email validation for instant user feedback
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterValidationError('Please enter a valid email address.');
      return;
    }
    
    setNewsletterValidationError('');
    setIsNewsletterSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      
      const data = await response.json().catch(() => null);
      
      if (!response.ok || !data || !data.success) {
        setNewsletterValidationError(
          data?.error || 'Server validation failed. Please check your email and try again.'
        );
      } else {
        setNewsletterSuccess(true);
        setNewsletterEmail('');
        // Auto-reset success message after 5 seconds
        setTimeout(() => setNewsletterSuccess(false), 5000);
      }
    } catch (err) {
      setNewsletterValidationError('Unable to connect to the server. Please check your connection and try again.');
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  const handleFaqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { name?: string; email?: string; message?: string } = {};
    
    if (!faqForm.name.trim()) {
      errors.name = 'Name is required.';
    } else if (faqForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!faqForm.email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(faqForm.email.trim())) {
      errors.email = 'Please enter a valid email address format.';
    }

    if (!faqForm.message.trim()) {
      errors.message = 'Please enter your question.';
    } else if (faqForm.message.trim().length < 10) {
      errors.message = 'Question must be at least 10 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setFaqErrors(errors);
      return;
    }

    setFaqErrors({});
    setIsFaqSubmitting(true);
    
    setTimeout(() => {
      setIsFaqSubmitting(false);
      setFaqSubmitSuccess(true);
      setFaqForm({
        name: '',
        email: '',
        category: 'General Safety',
        message: ''
      });
    }, 1200);
  };

  // Load from localStorage if available on mount
  React.useEffect(() => {
    const savedAge = localStorage.getItem('age_verified_private_dating');
    const savedAds = localStorage.getItem('ads_submissions_private_dating');
    
    setTimeout(() => {
      if (savedAge === 'true') {
        setAgeVerified(true);
        setShowAgeGate(false);
      }
      if (savedAds) {
        setAdsSubmissions(JSON.parse(savedAds));
      }
    }, 0);
  }, []);

  // Set active tab from query param if provided
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) {
        setTimeout(() => {
          setActiveTab(tabParam);
        }, 0);
      }
    }
  }, []);

  // Load dynamic site configuration from API on mount
  React.useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/config');
        const data = await res.json();
        if (data.success && data.config) {
          setSiteConfig(data.config);
          setOffers(data.config.offers);
          setCatalogItems(data.config.catalogItems);
        }
      } catch (err) {
        console.error('Failed to load dynamic site config:', err);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    fetchConfig();
  }, []);

  // Global viewport scroll progress handler
  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      // Show back to top button when scrolled past the hero section (approx 400px)
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate active offers grid loading on tab, query or sorting changes
  React.useEffect(() => {
    const startTimer = setTimeout(() => {
      setIsOffersGridLoading(true);
    }, 0);
    const timer = setTimeout(() => {
      setIsOffersGridLoading(false);
    }, 600);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [activeTab, searchQuery, sortBy]);

  // Automatically scroll to the offers grid when results are updated (tab, query or sorting changes)
  React.useEffect(() => {
    if (['dating', 'livecams', 'games'].includes(activeTab)) {
      // Avoid scrolling immediately if the user is actively typing in the search box
      const isTyping = typeof document !== 'undefined' && document.activeElement?.id === 'offers-search-input';
      if (!isTyping) {
        offersGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeTab, sortBy, searchQuery]);

  // Disable body scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Interactive Comments/Reviews for individual offers - fully translated
  const [reviews, setReviews] = useState<{ [offerId: string]: any[] }>({
    'amorhub': [
      { id: 1, author: 'Alex_99', rating: 5, text: 'Awesome service! Found a real match on the first day. The private video chat is super smooth.', date: '2026-06-25' },
      { id: 2, author: 'DatingKing', rating: 4, text: 'Great selection of verified profiles, almost zero fake accounts. Highly recommended.', date: '2026-06-23' }
    ],
    'camshow': [
      { id: 1, author: 'VipViewer', rating: 5, text: 'Stream quality is perfect, Lovense interactive toys reaction delay is non-existent. Best webcam experience!', date: '2026-06-26' }
    ]
  });
  const [newComment, setNewComment] = useState({ author: '', rating: 5, text: '' });

  const handleVerifyAge = (agree: boolean) => {
    if (agree) {
      setAgeVerified(true);
      setShowAgeGate(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('age_verified_private_dating', 'true');
      }
    } else {
      alert('You must be 18+ to view this website.');
    }
  };

  // Dynamic offer click handles
  const handleOpenOfferDetail = (offer: Offer) => {
    // Increment view count dynamically in state
    setOffers(prev => prev.map(o => {
      if (o.id === offer.id) {
        return { ...o, views: o.views + 1 };
      }
      return o;
    }));
    
    // Update local variable for selected modal
    setSelectedOffer({ ...offer, views: offer.views + 1 });
  };

  // Add Comment to Selected Offer
  const handleAddComment = (offerId: string) => {
    if (!newComment.author.trim() || !newComment.text.trim()) return;
    
    const commentObj = {
      id: Date.now(),
      author: newComment.author,
      rating: newComment.rating,
      text: newComment.text,
      date: new Date().toISOString().split('T')[0]
    };

    setReviews(prev => ({
      ...prev,
      [offerId]: [commentObj, ...(prev[offerId] || [])]
    }));

    // Reset comment inputs
    setNewComment({ author: '', rating: 5, text: '' });
  };

  // Share Offer trigger
  const handleShareOffer = (offer: Offer, platform: string) => {
    const offerUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#offer-${offer.id}`;
    let shareText = `Check out this adult offer: ${offer.name}! ${offer.shortDesc}`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(offerUrl);
      setShareSuccess(`Link to ${offer.name} copied to clipboard!`);
      setTimeout(() => setShareSuccess(null), 3000);
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(offerUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(offerUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  // Ads Proposal submit handler
  const handleAdsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adsForm.name.trim() || !adsForm.contact.trim() || !adsForm.budget.trim()) return;

    setIsSubmittingAds(true);

    setTimeout(() => {
      const newSubmission = {
        id: Date.now(),
        ...adsForm,
        date: new Date().toLocaleDateString('en-US'),
        status: 'Pending Review'
      };

      const updated = [newSubmission, ...adsSubmissions];
      setAdsSubmissions(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem('ads_submissions_private_dating', JSON.stringify(updated));
      }

      setIsSubmittingAds(false);
      setAdsSubmittedSuccess(true);
      setAdsForm({ name: '', contact: '', format: 'native_card', budget: '', message: '' });

      setTimeout(() => {
        setAdsSubmittedSuccess(false);
      }, 5000);
    }, 1200);
  };

  // Filter & Sort logic for offers
  const getFilteredOffers = (category: string) => {
    let list = offers;
    
    // Category filter
    if (category === 'dating') list = list.filter(o => o.category === 'dating');
    else if (category === 'livecams') list = list.filter(o => o.category === 'livecams');
    else if (category === 'games') list = list.filter(o => o.category === 'games');

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(o => 
          o.name.toLowerCase().includes(q) || 
          o.shortDesc.toLowerCase().includes(q) ||
          o.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort options
    if (sortBy === 'views') {
      return [...list].sort((a, b) => b.views - a.views);
    } else if (sortBy === 'rating') {
      return [...list].sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  // Human directory links for Catalog section
  const catalogLinks = {
    dating: [
      { 
        name: 'AmorHub', 
        desc: 'Curated premium adult matchmaking with real-time AI translation & location filters.', 
        rating: 4.9, 
        active: '4,120 active', 
        link: 'https://example.com/join-amorhub', 
        tag: 'VIP Partner',
        logoUrl: 'https://picsum.photos/seed/amorhub_logo/200/200'
      },
      { 
        name: 'SecretLove', 
        desc: 'Anonymous casual community focused on open interactions without complicated sign-ups.', 
        rating: 4.7, 
        active: '2,890 active', 
        link: 'https://example.com/join-secretlove', 
        tag: 'Sponsored Ad',
        logoUrl: 'https://picsum.photos/seed/secretlove_logo/200/200'
      },
      { 
        name: 'MatchPlay', 
        desc: 'Fabulous gamified matchmaking that dissolves awkwardness via quick trivia games.', 
        rating: 4.8, 
        active: '5,310 active', 
        link: 'https://example.com/join-matchplay', 
        tag: 'Featured',
        logoUrl: 'https://picsum.photos/seed/matchplay_logo/200/200'
      },
    ],
    cams: [
      { 
        name: 'CamShow TV', 
        desc: 'Leading HD interactive streaming featuring top models and interactive toy synchronizations.', 
        rating: 4.95, 
        active: '8,420 streaming', 
        link: 'https://example.com/join-camshow', 
        tag: 'VIP Partner',
        logoUrl: 'https://picsum.photos/seed/camshow_logo/200/200'
      },
      { 
        name: 'StripStream Premium', 
        desc: 'Private 1-on-1 virtual chambers focused on high interaction and premium custom requests.', 
        rating: 4.85, 
        active: '4,710 streaming', 
        link: 'https://example.com/join-stripstream', 
        tag: 'Sponsored Ad',
        logoUrl: 'https://picsum.photos/seed/stripstream_logo/200/200'
      },
    ],
    games: [
      { 
        name: 'SinCity RPG', 
        desc: 'Visual cyber-noir immersive multiplayer browser roleplaying game with beautiful graphics.', 
        rating: 4.75, 
        active: '6,200 online', 
        link: 'https://example.com/join-sincity', 
        tag: 'VIP Partner',
        logoUrl: 'https://picsum.photos/seed/sincity_logo/200/200'
      },
      { 
        name: 'HaremQuest Legends', 
        desc: 'Anime match-3 romantic puzzle adventure game containing high-quality collectible arts.', 
        rating: 4.9, 
        active: '9,450 online', 
        link: 'https://example.com/join-haremquest', 
        tag: 'Featured',
        logoUrl: 'https://picsum.photos/seed/haremquest_logo/200/200'
      },
    ]
  };

  // Resolve current activeTab metadata (with dynamic fallbacks)
  const getPageSeo = () => {
    // If it's a dynamic custom page
    if (activeTab.startsWith('custom-')) {
      const slug = activeTab.replace('custom-', '');
      const page = siteConfig.customPages?.find(p => p.slug === slug);
      if (page) {
        return {
          title: `${page.title} | ${siteConfig.texts?.logoText || 'Private Dating'}`,
          description: page.metaDescription || `${page.title} information and curated adult portal resources.`,
          keywords: `adult portal, ${page.title}, private matchmaking, secure dating`
        };
      }
    }

    // Standard pages
    const seoMap = siteConfig.seo || DEFAULT_SITE_CONFIG.seo || {};
    const defaultSeo = seoMap[activeTab] || {
      title: 'Private Dating | Premium Adult Dating & Livecams',
      description: 'Private Dating offers a curated portal of premium adult dating offers, live interactive cams, games, photo/video galleries, and latest dating news.',
      keywords: 'adult dating, hookup sites, mature dating, anonymous dating, verified profiles, local hookups'
    };
    return defaultSeo;
  };

  const currentSeo = getPageSeo();

  // Pre-filter news articles to avoid double calculation and improve load performance
  const filteredNewsArticles = siteConfig.newsArticles.filter(article => {
    const matchesCategory = blogCategoryFilter === 'All' || article.category.toLowerCase() === blogCategoryFilter.toLowerCase();
    const matchesSearch = article.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(blogSearchQuery.toLowerCase()) || 
                          article.content.toLowerCase().includes(blogSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const displayedNewsArticles = filteredNewsArticles.slice(0, visibleNewsCount);
  const hasMoreNews = visibleNewsCount < filteredNewsArticles.length;

  return (
    <div className="min-h-screen flex flex-col carbon-grid text-stone-100 relative selection:bg-amber-400 selection:text-stone-950">
      
      {/* Dynamic SEO Meta Tags Hoisted to Document Head */}
      <title>{currentSeo.title}</title>
      <meta name="description" content={currentSeo.description} />
      <meta name="keywords" content={currentSeo.keywords} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={currentSeo.title} />
      <meta property="og:description" content={currentSeo.description} />
      <meta property="og:site_name" content={siteConfig.texts?.logoText || "Private Dating Hub"} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={currentSeo.title} />
      <meta name="twitter:description" content={currentSeo.description} />

      {/* Slim Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-stone-950/20 z-[100] pointer-events-none">
        <motion.div 
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 origin-left"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 p-3 bg-stone-900/90 text-stone-200 hover:text-amber-400 rounded-full border border-stone-800 hover:border-amber-500/40 shadow-xl backdrop-blur-md transition-all flex items-center justify-center cursor-pointer group"
            title="Back to Top"
            id="back-to-top-btn"
          >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Glow ambient spots */}
      <div className="absolute top-0 left-[10%] w-[35%] h-[30%] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ADULT AGE GATE MODAL */}
      <AnimatePresence>
        {showAgeGate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
              id="age-gate-modal"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400" />
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-rose-500 mb-4 border border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-amber-400 font-display mb-2 tracking-tight uppercase">18+ AGE WARNING</h2>
                <p className="text-stone-300 text-sm leading-relaxed mb-6">
                  {siteConfig.texts.disclaimerText || "This portal contains adult-only material including reviews of dating platforms, live cam networks, and adult games. You must be at least 18 years old to access this site. Are you 18 or older?"}
                </p>
                <div className="flex gap-4 w-full">
                  <button
                    onClick={() => handleVerifyAge(true)}
                    className="flex-1 py-3 px-5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(245,158,11,0.2)] hover:shadow-[0_4px_25px_rgba(245,158,11,0.4)] transform hover:-translate-y-0.5 active:translate-y-0"
                    id="verify-age-yes"
                  >
                    Yes, I am 18+
                  </button>
                  <button
                    onClick={() => handleVerifyAge(false)}
                    className="flex-1 py-3 px-5 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl transition-all border border-stone-700"
                    id="verify-age-no"
                  >
                    No, Exit
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOAT NOTIFICATION SYSTEM */}
      <AnimatePresence>
        {shareSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 py-3.5 px-6 bg-stone-900 border-2 border-cyan-400 text-stone-100 rounded-full shadow-[0_10px_30px_rgba(34,211,238,0.3)] font-medium text-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{shareSuccess}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER & NAVIGATION */}
      <header className="sticky top-0 z-45 bg-stone-950/80 backdrop-blur-md border-b border-stone-900/60 transition-all">
        <div className="w-full px-3 sm:px-6 md:px-[50px] py-4 flex items-center justify-between gap-4">
          
          {/* Logo with display typography */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => {
              setActiveTab('home');
              setGalleryDropdownOpen(false);
              setMoreDropdownOpen(false);
              setIsMobileMenuOpen(false);
            }}
            id="site-logo-container"
          >
            <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-amber-400 font-display text-shadow-custom uppercase select-none transition-transform group-hover:scale-[1.02] flex items-center gap-1.5">
              {siteConfig.texts.logoText || "PORTAL"}
            </span>
          </div>

          {/* Desktop Nav Tabs including dropdown gallery & Catalog directory */}
          <nav className="hidden lg:flex items-center justify-center gap-1 md:gap-2">
            
            {/* Standard Tabs */}
            <button
              onClick={() => {
                setActiveTab('home');
                setMoreDropdownOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 relative ${
                activeTab === 'home' 
                  ? 'text-amber-400 bg-stone-900 shadow-[0_2px_10px_rgba(234,179,8,0.1)] border border-amber-500/20' 
                  : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
              }`}
            >
              {siteConfig.texts.tabHome || "Home"}
              {activeTab === 'home' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('dating');
                setMoreDropdownOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 relative ${
                activeTab === 'dating' 
                  ? 'text-amber-400 bg-stone-900 shadow-[0_2px_10px_rgba(234,179,8,0.1)] border border-amber-500/20' 
                  : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
              }`}
            >
              {siteConfig.texts.tabDating || "Dating"}
              {activeTab === 'dating' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('livecams');
                setMoreDropdownOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 relative ${
                activeTab === 'livecams' 
                  ? 'text-amber-400 bg-stone-900 shadow-[0_2px_10px_rgba(234,179,8,0.1)] border border-amber-500/20' 
                  : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
              }`}
            >
              {siteConfig.texts.tabLivecams || "Live Cams"}
              {activeTab === 'livecams' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('games');
                setMoreDropdownOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 relative ${
                activeTab === 'games' 
                  ? 'text-amber-400 bg-stone-900 shadow-[0_2px_10px_rgba(234,179,8,0.1)] border border-amber-500/20' 
                  : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
              }`}
            >
              {siteConfig.texts.tabGames || "Adult Games"}
              {activeTab === 'games' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('news');
                setMoreDropdownOpen(false);
                setGalleryDropdownOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 relative cursor-pointer ${
                activeTab === 'news' 
                  ? 'text-amber-400 bg-stone-900 shadow-[0_2px_10px_rgba(234,179,8,0.1)] border border-amber-500/20' 
                  : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
              }`}
            >
              {siteConfig.texts.tabBlog || "Blog"}
              {activeTab === 'news' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
              )}
            </button>

            {/* Gallery Dropdown Tab */}
            <div className="relative">
              <button
                onClick={() => {
                  setGalleryDropdownOpen(!galleryDropdownOpen);
                  setMoreDropdownOpen(false);
                }}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  ['gallery-photos', 'gallery-videos'].includes(activeTab)
                    ? 'text-amber-400 bg-stone-900 border border-amber-500/20' 
                    : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
                }`}
                id="gallery-dropdown-trigger"
              >
                <span>Gallery</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: galleryDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                {['gallery-photos', 'gallery-videos'].includes(activeTab) && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
                )}
              </button>

              <AnimatePresence>
                {galleryDropdownOpen && (
                  <>
                    {/* Click-away backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setGalleryDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full left-0 mt-1.5 w-48 bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setActiveTab('gallery-photos');
                          setGalleryDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${activeTab === 'gallery-photos' ? 'text-amber-400 bg-stone-950' : 'text-stone-300 hover:text-amber-400 hover:bg-stone-800'}`}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Photos Gallery
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('gallery-videos');
                          setGalleryDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 border-t border-stone-800/60 cursor-pointer ${activeTab === 'gallery-videos' ? 'text-cyan-400 bg-stone-950' : 'text-stone-300 hover:text-cyan-400 hover:bg-stone-800'}`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        Videos Gallery
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Catalog & Ads on ultra-wide screens */}
            <button
              onClick={() => {
                setActiveTab('catalog');
                setMoreDropdownOpen(false);
                setGalleryDropdownOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hidden xl:block px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 relative cursor-pointer ${
                activeTab === 'catalog' 
                  ? 'text-amber-400 bg-stone-900 shadow-[0_2px_10px_rgba(234,179,8,0.1)] border border-amber-500/20' 
                  : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
              }`}
            >
              Websites
              {activeTab === 'catalog' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('ads');
                setMoreDropdownOpen(false);
                setGalleryDropdownOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`hidden 2xl:block px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 relative cursor-pointer ${
                activeTab === 'ads' 
                  ? 'text-amber-400 bg-stone-900 shadow-[0_2px_10px_rgba(234,179,8,0.1)] border border-amber-500/20' 
                  : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
              }`}
            >
              Advertise
              {activeTab === 'ads' && (
                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
              )}
            </button>

            {/* MORE DROPDOWN TAB */}
            <div className="relative 2xl:hidden">
              <button
                onClick={() => {
                  setMoreDropdownOpen(!moreDropdownOpen);
                  setGalleryDropdownOpen(false);
                }}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  ['catalog', 'ads'].includes(activeTab)
                    ? 'text-amber-400 bg-stone-900 border border-amber-500/20' 
                    : 'text-stone-400 hover:text-cyan-400 hover:bg-stone-900/40'
                }`}
                id="more-dropdown-trigger"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: moreDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                {['catalog', 'ads'].includes(activeTab) && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-400 to-cyan-400" />
                )}
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <>
                    {/* Click-away backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setMoreDropdownOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full right-0 mt-1.5 w-48 bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1.5 z-50 overflow-hidden"
                    >
                      <button
                        onClick={() => {
                          setActiveTab('catalog');
                          setMoreDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer xl:hidden ${activeTab === 'catalog' ? 'text-amber-400 bg-stone-950 font-black' : 'text-stone-300 hover:text-amber-400 hover:bg-stone-800'}`}
                      >
                        <LayoutTemplate className="w-3.5 h-3.5" />
                        {siteConfig.texts.tabCatalog || "Websites"}
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('ads');
                          setMoreDropdownOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 border-t border-stone-800/60 cursor-pointer 2xl:hidden ${activeTab === 'ads' ? 'text-amber-400 bg-stone-950 font-black' : 'text-stone-300 hover:text-cyan-400 hover:bg-stone-800'}`}
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        {siteConfig.texts.tabAds || "Advertise"}
                      </button>
                      {siteConfig.customPages?.filter(p => p.isActive).map(p => (
                        <button
                          key={p.slug}
                          onClick={() => {
                            setActiveTab(`custom-${p.slug}`);
                            setMoreDropdownOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 border-t border-stone-800/60 cursor-pointer ${activeTab === `custom-${p.slug}` ? 'text-amber-400 bg-stone-950 font-black' : 'text-stone-300 hover:text-cyan-400 hover:bg-stone-800'}`}
                        >
                          <Layers className="w-3.5 h-3.5 text-amber-500" />
                          {p.title}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-stone-300 hover:text-amber-400 hover:bg-stone-800 transition-all cursor-pointer flex items-center justify-center"
              id="mobile-menu-hamburger"
            >
              {isMobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 lg:hidden border-b border-stone-900 bg-stone-950/95 backdrop-blur-lg overflow-hidden shadow-2xl z-50"
              id="mobile-menu-drawer"
            >
              <div className="px-6 py-4 flex flex-col gap-2">
                {[
                  { id: 'home', label: siteConfig.texts.tabHome || 'Home', icon: Flame },
                  { id: 'dating', label: siteConfig.texts.tabDating || 'Dating', icon: Heart },
                  { id: 'livecams', label: siteConfig.texts.tabLivecams || 'Live Cams', icon: Tv },
                  { id: 'games', label: siteConfig.texts.tabGames || 'Adult Games', icon: Gamepad2 },
                  { id: 'news', label: siteConfig.texts.tabBlog || 'Blog / News', icon: Newspaper },
                  { id: 'gallery-photos', label: 'Photos Gallery', icon: ImageIcon },
                  { id: 'gallery-videos', label: 'Videos Gallery', icon: Play },
                  { id: 'catalog', label: siteConfig.texts.tabCatalog || 'Partner Sites', icon: LayoutTemplate },
                  { id: 'ads', label: siteConfig.texts.tabAds || 'Advertise', icon: DollarSign },
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        isActive 
                          ? 'bg-stone-900 text-amber-400 border border-amber-500/20' 
                          : 'text-stone-300 hover:text-cyan-400 hover:bg-stone-900/40'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}

                {/* Mobile Dynamic Custom Pages */}
                {siteConfig.customPages?.filter(p => p.isActive).map((p) => {
                  const isActive = activeTab === `custom-${p.slug}`;
                  return (
                    <button
                      key={p.slug}
                      onClick={() => {
                        setActiveTab(`custom-${p.slug}`);
                        setIsMobileMenuOpen(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        isActive 
                          ? 'bg-stone-900 text-amber-400 border border-amber-500/20' 
                          : 'text-stone-300 hover:text-cyan-400 hover:bg-stone-900/40'
                      }`}
                    >
                      <Layers className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                      <span>{p.title}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 w-full px-3 sm:px-6 md:px-[50px] py-6 md:py-16 relative z-10" id="main-content-layout">
        
        <div className="flex flex-col lg:flex-row gap-10 items-start w-full" id="main-split-container">
          {/* LEFT CONTENT AREA */}
          <div className="flex-1 min-w-0 w-full space-y-16" id="left-main-content">
            
            {/* VIEW: HOME PAGE */}
            {activeTab === 'home' && (
          <div className="space-y-16">
            
            {/* HERO SECTION - WIDE AND CENTERED */}
            <div className="relative rounded-3xl border border-stone-800/60 bg-gradient-to-b from-stone-900/40 to-stone-950/50 overflow-hidden shadow-2xl py-10 px-6 sm:py-12 sm:px-10 flex flex-col items-center justify-center text-center group" id="hero-centered-section">
              
              {/* Ambient background glow */}
              <div className="absolute inset-0 bg-radial-gradient from-rose-500/5 via-transparent to-transparent pointer-events-none opacity-80" />

              {/* Centered Content Column - Stretched */}
              <div className="w-full space-y-6 z-10 relative flex flex-col items-center justify-center" id="hero-info-column">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-3"
                >
                  <p className="text-amber-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase font-bold">
                    ★ 100% Hand-Verified Directories • Premium Matches ★
                  </p>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-[1.15] text-stone-100 uppercase">
                    {siteConfig.texts.heroTitle ? (
                      siteConfig.texts.heroTitle.includes('Adult Dating') ? (
                        <>
                          <span className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.65)]">Adult Dating</span><br />
                          {siteConfig.texts.heroTitle.replace('Adult Dating', '').trim()}
                        </>
                      ) : siteConfig.texts.heroTitle
                    ) : (
                      <>
                        <span className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.65)]">Adult Dating</span><br />
                        Discover Premium Platforms
                      </>
                    )}
                  </h1>
                  
                  <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light max-w-2xl mx-auto">
                    {siteConfig.texts.heroSubtitle || "Access handpicked, highly secure, and anonymous adult entertainment networks. Instant matchmaking with verified real profiles and zero hassle."}
                  </p>
                </motion.div>

                {/* Hero CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-wrap gap-4 justify-center pt-2"
                >
                  <button
                    onClick={() => setActiveTab('dating')}
                    className="px-6 sm:px-8 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-xl transition-all duration-300 shadow-[0_4px_25px_rgba(245,158,11,0.35)] hover:shadow-[0_4px_35px_rgba(245,158,11,0.55)] transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <Flame className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-stone-950" />
                    {siteConfig.texts.heroCtaText || "Browse Dating Offers"}
                  </button>
                  <button
                    onClick={() => setActiveTab('ads')}
                    className="px-5 sm:px-6 py-3 bg-stone-950/80 hover:bg-stone-900 text-cyan-400 hover:text-cyan-300 font-bold rounded-xl transition-all duration-300 border border-cyan-400/30 flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.12)] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] cursor-pointer text-xs sm:text-sm"
                  >
                    Get Advertised Here
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* Micro metrics - 5 Columns */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-6 border-t border-stone-800/80 w-full max-w-3xl mx-auto">
                  <div className="space-y-0.5">
                    <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-display">15+</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase tracking-wider font-bold">Verified Sites</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-display">120K+</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase tracking-wider font-bold">Monthly Matches</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xl sm:text-2xl font-extrabold text-rose-500 font-display">8.5K+</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase tracking-wider font-bold">Active Members</div>
                  </div>
                  <div className="space-y-0.5 col-span-1 sm:col-span-1">
                    <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-display">24/7</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase tracking-wider font-bold">Support Desk</div>
                  </div>
                  <div className="space-y-0.5 col-span-2 sm:col-span-1">
                    <div className="text-xl sm:text-2xl font-extrabold text-violet-400 font-display">99.4%</div>
                    <div className="text-[9px] text-stone-500 font-mono uppercase tracking-wider font-bold">Privacy Rate</div>
                  </div>
                </div>
              </div>

            </div>

            {/* QUICK SECTIONS LINK BANNER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: 'Dating & Hookups', 
                  desc: 'Top-tier adult dating platforms featuring verified profiles for genuine encounters.', 
                  tab: 'dating', 
                  icon: Heart, 
                  color: 'text-rose-500', 
                  bg: 'hover:border-rose-500/40' 
                },
                { 
                  title: 'Top Live Webcams', 
                  desc: 'Premium adult shows hosted by elite models, fully synced with interactive Lovense toys.', 
                  tab: 'livecams', 
                  icon: Tv, 
                  color: 'text-cyan-400', 
                  bg: 'hover:border-cyan-500/40' 
                },
                { 
                  title: 'Adult Virtual Games', 
                  desc: 'High-quality 3D roleplaying, fantasy puzzles, and spicy dating simulators.', 
                  tab: 'games', 
                  icon: Gamepad2, 
                  color: 'text-amber-400', 
                  bg: 'hover:border-amber-500/40' 
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6 }}
                  onClick={() => {
                    setActiveTab(item.tab);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`bg-stone-900/60 border border-stone-800 rounded-2xl p-6 cursor-pointer transition-all ${item.bg} group relative overflow-hidden shadow-lg`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-stone-800/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/5 transition-all" />
                  <div className={`p-3 rounded-xl bg-stone-950 inline-block mb-4 border border-stone-800`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors mb-2 font-display flex items-center gap-1.5">
                    {item.title}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* HOT RECOMMENDATIONS ROW */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-display tracking-tight text-amber-400 flex items-center gap-2 uppercase">
                    <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
                    Hot Recommendations
                  </h2>
                  <p className="text-xs md:text-sm text-stone-400">Curated weekly highlights featuring the highest conversion rates and verified databases.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('dating')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  View All Offers
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid of 3 Hot Offers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isInitialLoading ? (
                  [...Array(3)].map((_, i) => <OfferCardSkeleton key={i} />)
                ) : (
                  offers.slice(0, 3).map((offer) => (
                    <div 
                      key={offer.id}
                      className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-amber-400/40 shadow-md group flex flex-col h-full"
                    >
                      <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
                        <SkeletonImage 
                          src={offer.imageUrl} 
                          alt={offer.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
                        
                        {/* Floating rating and online indicators */}
                        <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-bold text-amber-400 border border-amber-400/20 flex items-center gap-1 shadow-sm font-mono">
                          ⭐ {offer.rating}
                        </span>
                        <span className="absolute top-3 right-3 bg-emerald-500/80 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-bold text-white flex items-center gap-1 shadow-sm animate-pulse font-mono">
                          🟢 {offer.activeUsers.toLocaleString('en-US')} online
                        </span>
                      </div>

                    <div className="p-5 flex flex-col flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-stone-100 font-display group-hover:text-amber-300 transition-colors flex flex-wrap items-center gap-1.5">
                          <span>{offer.name}</span>
                          {offer.rating >= 4.8 && (
                            <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-400 text-[8px] px-1.5 py-0.5 rounded-full border border-amber-500/20 font-extrabold uppercase tracking-wider whitespace-nowrap">
                              <CheckCircle2 className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              Verified Trusted
                            </span>
                          )}
                        </h3>
                        <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
                          {offer.category === 'dating' ? 'Dating' : offer.category === 'livecams' ? 'Webcam' : 'Adult Games'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 flex-1">
                        {offer.shortDesc}
                      </p>

                      {/* Animated Popularity/Activity Progress Bar */}
                      {(() => {
                        const popularity = offer.id === 'amorhub' ? 94 : offer.id === 'secretlove' ? 85 : offer.id === 'matchplay' ? 91 : Math.min(98, Math.max(65, Math.round((offer.rating / 5) * 100)));
                        return (
                          <div className="space-y-1.5 py-1">
                            <div className="flex items-center justify-between text-[11px] font-mono">
                              <span className="text-stone-400 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                <span className="uppercase tracking-wider text-[9px] font-bold text-stone-500">Activity Level</span>
                              </span>
                              <span className="text-amber-400 font-bold font-mono">{popularity}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800/80 relative">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${popularity}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
                              />
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-800/60 font-mono">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          {offer.views.toLocaleString('en-US')} views
                        </span>
                      </div>

                      {/* Card Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1.5">
                        <Link
                          href={`/offers/${offer.slug || offer.id}`}
                          className="py-2 text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-all text-center border border-stone-700/50 hover:text-white cursor-pointer flex items-center justify-center"
                        >
                          Review Detail
                        </Link>
                        <Link
                          href={`/offers/${offer.slug || offer.id}`}
                          className="py-2 text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-all text-center shadow-[0_2px_8px_rgba(245,158,11,0.15)] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Enter Site
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>

            {/* MANDATORY THREE INTERMEDIATE HOME SECTIONS (DATING, CAMS, GAMES) */}
            <div className="space-y-16 pt-4">
              
              {/* SECTION 1: DATING SECTION (3-4 cards) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-3 gap-2">
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold font-display tracking-tight text-rose-500 flex items-center gap-1.5 uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500 shrink-0" />
                    Dating Platforms
                  </h3>
                  <button 
                    onClick={() => {
                      setActiveTab('dating');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>View All</span><span className="hidden xs:inline">&nbsp;Offers</span> ➔
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isInitialLoading ? (
                    [...Array(3)].map((_, i) => <OfferCardSkeleton key={i} />)
                  ) : (
                    offers.filter(o => o.category === 'dating').slice(0, 3).map((offer) => (
                      <div 
                        key={offer.id}
                        className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group flex flex-col h-full hover:border-rose-500/30 transition-all duration-300"
                      >
                        <div className="relative h-40 bg-stone-950">
                          <SkeletonImage src={offer.imageUrl} alt={offer.name} fill className="object-cover transition-transform group-hover:scale-102" referrerPolicy="no-referrer" />
                          <span className="absolute top-3 left-3 bg-stone-950/80 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono">⭐ {offer.rating}</span>
                        </div>
                        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                          <div>
                            <h4 className="text-base font-bold text-stone-100 font-display group-hover:text-rose-400 transition-colors flex flex-wrap items-center gap-1.5">
                              <span>{offer.name}</span>
                              {offer.rating >= 4.8 && (
                                <span className="inline-flex items-center gap-0.5 bg-rose-500/10 text-rose-400 text-[8px] px-1.5 py-0.5 rounded-full border border-rose-500/20 font-extrabold uppercase tracking-wider whitespace-nowrap">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                                  Verified Trusted
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-stone-400 mt-1 line-clamp-2">{offer.shortDesc}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/offers/${offer.slug || offer.id}`} className="flex-1 py-1.5 text-[11px] font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-all cursor-pointer text-center flex items-center justify-center">Details</Link>
                            <Link href={`/offers/${offer.slug || offer.id}`} className="flex-1 py-1.5 text-[11px] font-extrabold bg-rose-500 hover:bg-rose-400 text-white rounded transition-all cursor-pointer flex items-center justify-center gap-1 text-center">Join ➔</Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 2: CAMS SECTION (2-3 cards) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-3 gap-2">
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold font-display tracking-tight text-cyan-400 flex items-center gap-1.5 uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                    <Tv className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
                    Live Webcams
                  </h3>
                  <button 
                    onClick={() => {
                      setActiveTab('livecams');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>View All</span><span className="hidden xs:inline">&nbsp;Offers</span> ➔
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isInitialLoading ? (
                    [...Array(3)].map((_, i) => <OfferCardSkeleton key={i} />)
                  ) : (
                    offers.filter(o => o.category === 'livecams').slice(0, 3).map((offer) => (
                      <div 
                        key={offer.id}
                        className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group flex flex-col h-full hover:border-cyan-500/30 transition-all duration-300"
                      >
                        <div className="relative h-40 bg-stone-950">
                          <SkeletonImage src={offer.imageUrl} alt={offer.name} fill className="object-cover transition-transform group-hover:scale-102" referrerPolicy="no-referrer" />
                          <span className="absolute top-3 left-3 bg-stone-950/80 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono">⭐ {offer.rating}</span>
                          <span className="absolute top-3 right-3 bg-emerald-500/80 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded animate-pulse">LIVE</span>
                        </div>
                        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                          <div>
                            <h4 className="text-base font-bold text-stone-100 font-display group-hover:text-cyan-400 transition-colors flex flex-wrap items-center gap-1.5">
                              <span>{offer.name}</span>
                              {offer.rating >= 4.8 && (
                                <span className="inline-flex items-center gap-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] px-1.5 py-0.5 rounded-full border border-cyan-500/20 font-extrabold uppercase tracking-wider whitespace-nowrap">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                                  Verified Trusted
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-stone-400 mt-1 line-clamp-2">{offer.shortDesc}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/offers/${offer.slug || offer.id}`} className="flex-1 py-1.5 text-[11px] font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-all cursor-pointer text-center flex items-center justify-center">Details</Link>
                            <Link href={`/offers/${offer.slug || offer.id}`} className="flex-1 py-1.5 text-[11px] font-extrabold bg-cyan-400 hover:bg-cyan-300 text-stone-950 rounded transition-all cursor-pointer flex items-center justify-center gap-1 text-center">Watch ➔</Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION 3: GAMES SECTION (2-3 cards) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-3 gap-2">
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold font-display tracking-tight text-amber-400 flex items-center gap-1.5 uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                    <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                    Adult Games
                  </h3>
                  <button 
                    onClick={() => {
                      setActiveTab('games');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[10px] sm:text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer shrink-0 whitespace-nowrap"
                  >
                    <span>View All</span><span className="hidden xs:inline">&nbsp;Offers</span> ➔
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isInitialLoading ? (
                    [...Array(3)].map((_, i) => <OfferCardSkeleton key={i} />)
                  ) : (
                    offers.filter(o => o.category === 'games').slice(0, 3).map((offer) => (
                      <div 
                        key={offer.id}
                        className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group flex flex-col h-full hover:border-amber-500/30 transition-all duration-300"
                      >
                        <div className="relative h-40 bg-stone-950">
                          <SkeletonImage src={offer.imageUrl} alt={offer.name} fill className="object-cover transition-transform group-hover:scale-102" referrerPolicy="no-referrer" />
                          <span className="absolute top-3 left-3 bg-stone-950/80 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono">⭐ {offer.rating}</span>
                        </div>
                        <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                          <div>
                            <h4 className="text-base font-bold text-stone-100 font-display group-hover:text-amber-400 transition-colors flex flex-wrap items-center gap-1.5">
                              <span>{offer.name}</span>
                              {offer.rating >= 4.8 && (
                                <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-400 text-[8px] px-1.5 py-0.5 rounded-full border border-amber-500/20 font-extrabold uppercase tracking-wider whitespace-nowrap">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                                  Verified Trusted
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-stone-400 mt-1 line-clamp-2">{offer.shortDesc}</p>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/offers/${offer.slug || offer.id}`} className="flex-1 py-1.5 text-[11px] font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded transition-all cursor-pointer text-center flex items-center justify-center">Details</Link>
                            <Link href={`/offers/${offer.slug || offer.id}`} className="flex-1 py-1.5 text-[11px] font-extrabold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded transition-all cursor-pointer flex items-center justify-center gap-1 text-center">Play ➔</Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* PORTAL NEWS SECTION OVERVIEW */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold font-display tracking-tight text-cyan-400 flex items-center gap-2 uppercase">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    Latest Industry News
                  </h2>
                  <p className="text-xs md:text-sm text-stone-400 font-sans">Market analytics, professional guides, and safety protocols for modern encounters.</p>
                </div>
              </div>

              {/* Grid of News */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isInitialLoading ? (
                  [...Array(3)].map((_, i) => <NewsCardSkeleton key={i} />)
                ) : (
                  siteConfig.newsArticles.slice(0, 3).map((article) => (
                    <div 
                      key={article.id}
                      className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-md flex flex-col h-full"
                    >
                      <div className="relative h-48 bg-stone-950">
                        <SkeletonImage 
                          src={article.imageUrl} 
                          alt={article.title}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 bg-cyan-950/95 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold font-mono py-1 px-2.5 rounded">
                          {article.category}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-1 space-y-3">
                        <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{article.date}</span>
                        </div>

                        <h3 className="text-base font-bold text-stone-100 font-display line-clamp-2 hover:text-cyan-300 transition-colors">
                          <Link href={`/news/${article.slug || article.id}`}>
                            {article.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-stone-400 leading-relaxed line-clamp-3 flex-1">
                          {article.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-stone-800/60 mt-auto">
                          <Link
                            href={`/news/${article.slug || article.id}`}
                            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono hover:underline cursor-pointer"
                          >
                            Read Full Article
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <div className="flex items-center gap-1.5" id={`share-news-${article.id}`}>
                            <span className="text-[10px] text-stone-500 font-mono">Share:</span>
                            {/* Facebook */}
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://adult-portal.com/news/${article.id}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-blue-400 transition-colors p-1 bg-stone-950 hover:bg-stone-950/80 rounded border border-stone-800/80 hover:border-blue-500/20"
                              title="Share on Facebook"
                            >
                              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                              </svg>
                            </a>
                            {/* Reddit */}
                            <a
                              href={`https://www.reddit.com/submit?url=${encodeURIComponent(`https://adult-portal.com/news/${article.id}`)}&title=${encodeURIComponent(article.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-orange-400 transition-colors p-1 bg-stone-950 hover:bg-stone-950/80 rounded border border-stone-800/80 hover:border-orange-500/20"
                              title="Share on Reddit"
                            >
                              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.3-4.08 4.22.92c.04.83.72 1.49 1.56 1.49 1.1 0 1.99-.89 1.99-1.99s-.89-1.99-1.99-1.99c-.83 0-1.52.51-1.8 1.23l-4.72-1.03c-.22-.04-.44.08-.51.3l-1.52 4.77C5.37 7.42 3.1 8.06 1.42 9.08 1.1 8.35.37 7.84-.5 7.84c-1.65 0-3 1.35-3 3 0 .96.48 1.86 1.24 2.42-.07.38-.1.77-.1 1.17 0 3.86 4.43 7 9.86 7s9.86-3.14 9.86-7c0-.4-.03-.79-.1-1.17.76-.56 1.24-1.46 1.24-2.42zm-16.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8.9 4.38c-.73.73-2.1 1.12-3.4 1.12s-2.67-.38-3.4-1.12c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0 .53.53 1.62.83 2.69.83s2.16-.3 2.69-.83c.2-.2.51-.2.71 0 .2.2.2.51 0 .71zm-.4-2.88c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                              </svg>
                            </a>
                            {/* Telegram */}
                            <a
                              href={`https://t.me/share/url?url=${encodeURIComponent(`https://adult-portal.com/news/${article.id}`)}&text=${encodeURIComponent(article.title)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-sky-400 transition-colors p-1 bg-stone-950 hover:bg-stone-950/80 rounded border border-stone-800/80 hover:border-sky-500/20"
                              title="Share on Telegram"
                            >
                              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.35.52-.42-.01-1.23-.24-1.83-.43-.74-.24-1.33-.37-1.28-.79.03-.22.33-.45.91-.69 3.56-1.55 5.93-2.57 7.12-3.07 3.39-1.4 4.09-1.64 4.55-1.65.1 0 .33.02.48.15.12.1.16.24.18.35.02.13.02.26.01.39z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* FAQ SECTION */}
            <div className="space-y-6 pt-10 border-t border-stone-900" id="faq-section">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800/80 pb-3">
                <div className="space-y-1">
                  <h2 className="text-xl md:text-2xl font-bold font-display tracking-tight text-amber-400 flex items-center gap-2 uppercase">
                    <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                    Frequently Asked Questions
                  </h2>
                  <p className="text-xs md:text-sm text-stone-400 font-sans">
                    Essential insights into age gating, safe navigation, and premium listings.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFaqSubmitSuccess(false);
                    setIsFaqModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-[0_2px_10px_rgba(245,158,11,0.2)] flex items-center gap-1.5 self-start sm:self-center cursor-pointer uppercase tracking-wider shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ask a Question
                </button>
              </div>

              <div className="space-y-4 max-w-4xl">
                {FAQ_ITEMS.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id}
                      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                        isOpen 
                          ? 'bg-stone-900/90 border-amber-500/30 shadow-[0_4px_20px_rgba(245,158,11,0.05)]' 
                          : 'bg-stone-900 border-stone-800'
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className={`w-full flex items-center justify-between p-5 text-left font-display font-semibold transition-colors focus:outline-none cursor-pointer ${
                          isOpen ? 'text-amber-400' : 'text-stone-100 hover:text-amber-400'
                        }`}
                      >
                        <span className="text-sm md:text-base pr-4">{faq.question}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className={`shrink-0 ${isOpen ? 'text-amber-400' : 'text-stone-400'}`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
                            className="overflow-hidden"
                          >
                            <motion.div
                              initial={{ y: -8, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -8, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="p-5 pt-0 border-t border-stone-800/40 text-xs md:text-sm text-stone-400 leading-relaxed font-sans"
                            >
                              {faq.answer}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* VIEW: OFFERS CATEGORIES (Dating, Livecams, Adult Games) */}
        {(activeTab === 'dating' || activeTab === 'livecams' || activeTab === 'games') && (
          <div ref={offersGridRef} className="space-y-8 scroll-mt-20">
            
            {/* Header Banner for Category */}
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 overflow-hidden shadow-lg">
              <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-gradient-to-br from-cyan-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-3xl space-y-2 relative z-10">
                <span className="text-xs md:text-sm font-extrabold text-amber-400 uppercase tracking-widest font-mono">
                  {activeTab === 'dating' ? '18+ MATCHMAKING' : activeTab === 'livecams' ? 'ELITE STREAMS' : 'ADVENTURE RPG'}
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase tracking-tight">
                  {activeTab === 'dating' ? 'Dating Offers' : activeTab === 'livecams' ? 'Livecam Shows' : 'Adult Games'}
                </h1>
                <p className="text-stone-400 text-sm md:text-base leading-relaxed">
                  {activeTab === 'dating' && 'Comprehensive reviews of the most secure international adult dating apps. Swipe, match, and start talking securely.'}
                  {activeTab === 'livecams' && 'Interactive webcam halls and direct broadcasts hosted by professional models. Pair interactive accessories to feel real-time reactions.'}
                  {activeTab === 'games' && 'Entertaining roleplaying worlds, interactive romantic puzzle titles, and anime quests with beautiful collections.'}
                </p>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
              
              {/* Search input */}
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="Search by keyword, name, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      offersGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-all"
                  id="offers-search-input"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                <span className="text-xs text-stone-500 font-mono uppercase tracking-wider font-bold">Sort By:</span>
                <div className="flex bg-stone-950 rounded-lg p-1 border border-stone-800">
                  <button
                    onClick={() => setSortBy('default')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${sortBy === 'default' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200'}`}
                  >
                    Recommended
                  </button>
                  <button
                    onClick={() => setSortBy('views')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${sortBy === 'views' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200'}`}
                  >
                    Views
                  </button>
                  <button
                    onClick={() => setSortBy('rating')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${sortBy === 'rating' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200'}`}
                  >
                    Rating
                  </button>
                </div>
              </div>

            </div>

            {/* Offer Cards Grid - REQUIRED WITH PHOTO, NAME, SHORT DESC, VIEWS, SHARE BUTTONS AND FULL DESCRIPTION */}
            {isOffersGridLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="offers-grid-container-skeleton">
                {[...Array(6)].map((_, i) => <OfferCardSkeleton key={i} />)}
              </div>
            ) : getFilteredOffers(activeTab).length === 0 ? (
              <div className="text-center py-16 bg-stone-900/40 border border-stone-800/80 rounded-xl space-y-3">
                <p className="text-stone-400 text-lg">No offers match your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSortBy('default'); }}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-bold rounded-lg text-amber-400 transition-all border border-stone-700 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="offers-grid-container">
                {getFilteredOffers(activeTab).map((offer) => (
                  <motion.div
                    key={offer.id}
                    layout
                    whileHover={{ y: -6 }}
                    className="bg-stone-900 border border-stone-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col h-full group transition-all duration-300 hover:border-cyan-400/50"
                  >
                    {/* Offer Image section with rating badge */}
                    <div className="relative h-52 w-full bg-stone-950 overflow-hidden">
                      <SkeletonImage 
                        src={offer.imageUrl} 
                        alt={offer.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />
                      
                      {/* Floating details */}
                      <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-xs font-bold text-amber-400 border border-amber-400/20 flex items-center gap-1 shadow-md font-mono">
                        ⭐ {offer.rating}
                      </div>

                      <div className="absolute top-3 right-3 bg-emerald-500/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md animate-pulse font-mono">
                        🟢 {offer.activeUsers.toLocaleString('en-US')} online
                      </div>
                    </div>

                    {/* Offer content details */}
                    <div className="p-6 flex flex-col flex-1 space-y-4">
                      
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-stone-100 font-display group-hover:text-amber-300 transition-colors flex flex-wrap items-center gap-1.5">
                          <span>{offer.name}</span>
                          {offer.rating >= 4.8 && (
                            <span className="inline-flex items-center gap-0.5 bg-amber-500/10 text-amber-400 text-[8px] px-1.5 py-0.5 rounded-full border border-amber-500/20 font-extrabold uppercase tracking-wider whitespace-nowrap">
                              <CheckCircle2 className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                              Verified Trusted
                            </span>
                          )}
                        </h3>
                        <span className="text-[10px] tracking-wider uppercase font-mono text-cyan-400 bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-800/20">
                          {offer.category === 'dating' ? 'Dating' : offer.category === 'livecams' ? 'Livecam' : 'Adult Game'}
                        </span>
                      </div>

                      {/* Tag row */}
                      <div className="flex flex-wrap gap-1">
                        {offer.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] text-stone-400 font-medium bg-stone-800/50 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Short description */}
                      <p className="text-xs text-stone-300 leading-relaxed line-clamp-3 flex-1">
                        {offer.shortDesc}
                      </p>

                      {/* Views Count info */}
                      <div className="flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-stone-800/60 font-mono">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-stone-500" />
                          <span>{offer.views.toLocaleString('en-US')} views</span>
                        </span>
                        <span>Rating: {offer.rating} / 5</span>
                      </div>

                      {/* Share and Action buttons */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-500 font-mono uppercase shrink-0 font-bold">Share:</span>
                          <div className="flex gap-1.5 flex-1">
                            <button
                              onClick={() => handleShareOffer(offer, 'copy')}
                              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-cyan-400 hover:text-cyan-300 transition-all text-xs flex items-center justify-center flex-1 gap-1 cursor-pointer"
                              title="Copy Link"
                            >
                              <Copy className="w-3 h-3" />
                              <span className="text-[10px]">Copy</span>
                            </button>
                            <button
                              onClick={() => handleShareOffer(offer, 'telegram')}
                              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-sky-400 hover:text-sky-300 transition-all text-xs flex items-center justify-center flex-1 gap-1 cursor-pointer"
                              title="Telegram"
                            >
                              <Send className="w-3 h-3" />
                              <span className="text-[10px]">Telegram</span>
                            </button>
                            <button
                              onClick={() => handleShareOffer(offer, 'twitter')}
                              className="p-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-300 transition-all text-xs flex items-center justify-center flex-1 gap-1 cursor-pointer"
                              title="Twitter / X"
                            >
                              <Share2 className="w-3 h-3" />
                              <span className="text-[10px]">Twitter</span>
                            </button>
                          </div>
                        </div>

                        {/* Full Description / CTA triggers */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Link
                            href={`/offers/${offer.slug || offer.id}`}
                            className="py-2.5 text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-100 rounded-lg transition-all text-center border border-stone-700 hover:border-amber-400/30 cursor-pointer flex items-center justify-center"
                            id={`offer-detail-btn-${offer.id}`}
                          >
                            Full Review
                          </Link>
                          <Link
                            href={`/offers/${offer.slug || offer.id}`}
                            className="py-2.5 text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg transition-all text-center shadow-[0_2px_10px_rgba(234,179,8,0.2)] hover:shadow-[0_4px_15px_rgba(234,179,8,0.3)] flex items-center justify-center gap-1 cursor-pointer"
                            id={`offer-cta-btn-${offer.id}`}
                          >
                            Join Now
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* VIEW: PHOTOS GALLERY (Now part of Gallery Dropdown) */}
        {activeTab === 'gallery-photos' && (
          <div className="space-y-8">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 overflow-hidden relative shadow-md">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest font-bold">Exclusive Media Releases</span>
              <h1 className="text-3xl md:text-5xl font-black font-display text-amber-400 mb-2 uppercase">Models Photo Gallery</h1>
              <p className="text-stone-400 text-sm md:text-base max-w-3xl">
                A highly curated look into official promotional sets, professional concept arts, and photoshoots from elite partner networks.
              </p>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogItems.filter(item => item.type === 'photo').map((item) => (
                <div 
                  key={item.id}
                  className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group shadow-md cursor-pointer hover:border-cyan-400/40 transition-all duration-300"
                  onClick={() => setActivePhoto(item)}
                >
                  <div className="relative h-80 bg-stone-950 overflow-hidden">
                    <Image 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent opacity-80" />
                    
                    {/* Overlay info */}
                    <div className="absolute bottom-4 left-4 right-4 space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((t, i) => (
                          <span key={i} className="text-[9px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/30">
                            #{t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-sm font-bold text-stone-100 line-clamp-2 group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-stone-400 font-mono">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {item.views.toLocaleString('en-US')}
                        </span>
                        <span>⭐ {item.likes} Likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: VIDEOS GALLERY (Now part of Gallery Dropdown) */}
        {activeTab === 'gallery-videos' && (
          <div className="space-y-8">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 overflow-hidden relative shadow-md">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest font-bold font-mono">Promotional Trailers</span>
              <h1 className="text-3xl md:text-5xl font-black font-display text-cyan-400 mb-2 uppercase">Videos Showcase</h1>
              <p className="text-stone-400 text-sm md:text-base max-w-3xl">
                Official high-definition preview clips, gameplay guides, streaming features, and adult game teasers.
              </p>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {catalogItems.filter(item => item.type === 'video').map((item) => (
                <div 
                  key={item.id}
                  className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden group shadow-md cursor-pointer hover:border-amber-400/40 transition-all duration-300 flex flex-col"
                  onClick={() => {
                    setActiveVideo(item);
                    setIsPlaying(true);
                  }}
                >
                  <div className="relative h-52 bg-stone-950 overflow-hidden flex items-center justify-center">
                    <Image 
                      src={item.thumbnailUrl} 
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-950/40" />
                    
                    {/* Simulated Play button */}
                    <div className="absolute w-14 h-14 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform z-10">
                      <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
                    </div>

                    <span className="absolute bottom-3 right-3 bg-stone-950/80 px-2 py-1 rounded text-[10px] font-bold font-mono text-stone-300">
                      {item.duration}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col space-y-3 justify-between">
                    <h3 className="text-sm font-bold text-stone-100 font-display line-clamp-2 group-hover:text-amber-400 transition-colors">
                      {item.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t, i) => (
                        <span key={i} className="text-[9px] font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-500 font-mono pt-2 border-t border-stone-800/60">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views.toLocaleString('en-US')}
                      </span>
                      <span>👍 {item.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: CATALOGUE SECTION (NEW REQUIREMENT: DIRECTORY OF SPONSORS AND ADMIN SITES SORTED BY CATEGORY) */}
        {activeTab === 'catalog' && (
          <div className="space-y-12">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 overflow-hidden relative shadow-md">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest font-bold">Verified Outbound Directory</span>
              <h1 className="text-3xl md:text-5xl font-black font-display text-cyan-400 mb-2 uppercase">Partner Sites</h1>
              <p className="text-stone-400 text-sm md:text-base max-w-3xl">
                A premium directory of partner sites that purchased advertisements or were hand-added by our administrators, organized systematically by category.
              </p>
            </div>

            {/* Category 1: Dating Portals */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-rose-500 border-b border-stone-800 pb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" />
                Dating & Matchmaking Sites
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {catalogLinks.dating.map((site, index) => (
                  <div 
                    key={index} 
                    className="bg-stone-900 border border-stone-800/80 hover:border-rose-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl transition-all group duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-900/20">
                          {site.tag}
                        </span>
                        <span className="text-xs text-amber-400 font-mono flex items-center gap-1 font-bold">
                          ⭐ {site.rating}
                        </span>
                      </div>

                      {/* Logo and Name row */}
                      <div className="flex items-center gap-3.5 pt-1">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-950 border border-stone-800/60 flex-shrink-0 shadow-inner group-hover:border-rose-500/20 transition-all duration-300">
                          <Image 
                            src={site.logoUrl} 
                            alt={`${site.name} logo`} 
                            width={48}
                            height={48}
                            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-stone-100 font-display group-hover:text-rose-400 transition-colors duration-300">{site.name}</h3>
                          <span className="text-[10px] text-stone-500 font-mono font-semibold">{site.active}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed pt-1">{site.desc}</p>
                    </div>

                    <div className="flex items-center justify-end text-xs pt-3 border-t border-stone-800/60 font-mono">
                      <a 
                        href={site.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
                      >
                        Visit Site
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: Live Cam Channels */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-cyan-400 border-b border-stone-800 pb-2 flex items-center gap-2">
                <Tv className="w-5 h-5 text-cyan-400" />
                Live Webcam & Streaming Portals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogLinks.cams.map((site, index) => (
                  <div 
                    key={index} 
                    className="bg-stone-900 border border-stone-800/80 hover:border-cyan-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl transition-all group duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-900/20">
                          {site.tag}
                        </span>
                        <span className="text-xs text-amber-400 font-mono flex items-center gap-1 font-bold">
                          ⭐ {site.rating}
                        </span>
                      </div>

                      {/* Logo and Name row */}
                      <div className="flex items-center gap-3.5 pt-1">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-950 border border-stone-800/60 flex-shrink-0 shadow-inner group-hover:border-cyan-500/20 transition-all duration-300">
                          <Image 
                            src={site.logoUrl} 
                            alt={`${site.name} logo`} 
                            width={48}
                            height={48}
                            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-stone-100 font-display group-hover:text-cyan-400 transition-colors duration-300">{site.name}</h3>
                          <span className="text-[10px] text-cyan-400 font-mono font-semibold">{site.active}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed pt-1">{site.desc}</p>
                    </div>

                    <div className="flex items-center justify-end text-xs pt-3 border-t border-stone-800/60 font-mono">
                      <a 
                        href={site.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
                      >
                        Launch Cams
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: Adult Games */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-amber-400 border-b border-stone-800 pb-2 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                Virtual Adult & Roleplay Games
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogLinks.games.map((site, index) => (
                  <div 
                    key={index} 
                    className="bg-stone-900 border border-stone-800/80 hover:border-amber-500/30 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl transition-all group duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-900/20">
                          {site.tag}
                        </span>
                        <span className="text-xs text-amber-400 font-mono flex items-center gap-1 font-bold">
                          ⭐ {site.rating}
                        </span>
                      </div>

                      {/* Logo and Name row */}
                      <div className="flex items-center gap-3.5 pt-1">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-950 border border-stone-800/60 flex-shrink-0 shadow-inner group-hover:border-amber-500/20 transition-all duration-300">
                          <Image 
                            src={site.logoUrl} 
                            alt={`${site.name} logo`} 
                            width={48}
                            height={48}
                            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-stone-100 font-display group-hover:text-amber-400 transition-colors duration-300">{site.name}</h3>
                          <span className="text-[10px] text-stone-500 font-mono font-semibold">{site.active}</span>
                        </div>
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed pt-1">{site.desc}</p>
                    </div>

                    <div className="flex items-center justify-end text-xs pt-3 border-t border-stone-800/60 font-mono">
                      <a 
                        href={site.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
                      >
                        Play Now
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* VIEW: ADS (ADVERTISING PARTNERSHIP OFFERS) */}
        {activeTab === 'ads' && (
          <div className="space-y-12">
            
            {/* Banner Section */}
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full font-bold">
                  For Affiliates & Advertisers
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  Advertise on <span className="text-cyan-400">Private Dating</span>
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Our portal is one of the premier highly visited niche media platforms detailing dating reviews, webcam feeds, and virtual worlds. We offer highly responsive placements, direct quality traffic flows, and optimal custom options.
                </p>
                
                {/* Stats cards inside Banner */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800/60">
                    <div className="text-xl font-black text-amber-400 font-display">100K+</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider font-mono font-bold">Unique Hosts</div>
                  </div>
                  <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800/60">
                    <div className="text-xl font-black text-cyan-400 font-display">3.5%</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider font-mono font-bold">Average CTR</div>
                  </div>
                  <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800/60">
                    <div className="text-xl font-black text-rose-500 font-display">80%</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider font-mono font-bold">Tier-1 & 2 Traffic</div>
                  </div>
                  <div className="bg-stone-950/80 p-4 rounded-xl border border-stone-800/60">
                    <div className="text-xl font-black text-emerald-400 font-display">92%</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider font-mono font-bold">Re-order Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout pricing options Grid */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-display text-amber-400 uppercase tracking-tight flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                Available Placements & Plans
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {AD_PRICING_OPTIONS.map((opt) => {
                  return (
                    <div 
                      key={opt.id}
                      className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-400/40 transition-all duration-300 shadow-md"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="p-2 rounded bg-stone-950 border border-stone-800 text-cyan-400">
                            {opt.id === 'banner_header' ? <LayoutTemplate className="w-5 h-5" /> : 
                             opt.id === 'native_card' ? <Award className="w-5 h-5" /> :
                             opt.id === 'banner_sidebar' ? <Sidebar className="w-5 h-5" /> : 
                             <ExternalLink className="w-5 h-5" />}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-800/20 font-bold">
                            CTR {opt.ctr}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-stone-100 font-display">{opt.name}</h3>
                        <p className="text-xs text-stone-400 leading-relaxed">{opt.description}</p>
                      </div>

                      <div className="pt-3 border-t border-stone-800/60 flex items-center justify-between font-mono">
                        <span className="text-xs text-stone-500 font-bold">Rate:</span>
                        <span className="text-sm font-black text-amber-400">{opt.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application request Form & My Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Submission Form Column */}
              <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 to-amber-400" />
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-stone-100 font-display">SUBMIT PLACEMENT APPLICATION</h3>
                  <p className="text-xs text-stone-400">
                    Fill out the inquiry form below. Our advertiser relations team will review your pitch and reach out within 2 hours.
                  </p>
                </div>

                <form onSubmit={handleAdsSubmit} className="space-y-4" id="ads-submission-form">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Your Name / Company *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Alex (CPA Network)"
                        value={adsForm.name}
                        onChange={(e) => setAdsForm({ ...adsForm, name: e.target.value })}
                        className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-cyan-400 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Contact Details (Telegram / Email) *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. @alex_manager or partner@mail.com"
                        value={adsForm.contact}
                        onChange={(e) => setAdsForm({ ...adsForm, contact: e.target.value })}
                        className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Desired Placement *</label>
                      <select
                        value={adsForm.format}
                        onChange={(e) => setAdsForm({ ...adsForm, format: e.target.value })}
                        className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 focus:outline-none focus:border-cyan-400 transition-all cursor-pointer"
                      >
                        <option value="banner_header">Top Header Banner (728x90)</option>
                        <option value="native_card">Native VIP Card (Top Offer)</option>
                        <option value="banner_sidebar">Sidebar Banner (300x250)</option>
                        <option value="popup_under">Pop-Under Redirect</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Target Budget ($ / month) *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 500$"
                        value={adsForm.budget}
                        onChange={(e) => setAdsForm({ ...adsForm, budget: e.target.value })}
                        className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-cyan-400 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Comment / Pitch details</label>
                    <textarea 
                      rows={3}
                      placeholder="Describe your platform, CPA model rules, or custom banner design assets..."
                      value={adsForm.message}
                      onChange={(e) => setAdsForm({ ...adsForm, message: e.target.value })}
                      className="w-full p-3 bg-stone-950 border border-stone-800 rounded-lg text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-cyan-400 transition-all resize-none"
                    />
                  </div>

                  {adsSubmittedSuccess && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      <div>
                        <strong>Inquiry Submitted!</strong> Thank you for partnering. Our team is reviewing your details now.
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingAds}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold rounded-xl transition-all shadow-[0_4px_15px_rgba(245,158,11,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-sm uppercase tracking-wider"
                  >
                    {isSubmittingAds ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        Sending Pitch...
                      </>
                    ) : (
                      <>
                        Send Request
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Submissions Log Column */}
              <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6 shadow-xl">
                <h3 className="text-lg font-bold text-stone-100 font-display border-b border-stone-800 pb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                  YOUR ACTIVE PLACEMENTS
                </h3>

                {adsSubmissions.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-xs leading-relaxed space-y-2">
                    <p>No advertising tickets filed in this session.</p>
                    <p className="text-[10px]">Use the left-hand editor form to submit a live campaign ticket.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adsSubmissions.map((sub) => (
                      <div 
                        key={sub.id} 
                        className="bg-stone-950 p-4 rounded-lg border border-stone-800/80 space-y-2 text-xs relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 bg-stone-800 px-2 py-0.5 text-[8px] text-stone-400 rounded-bl font-mono">
                          ID {sub.id.toString().slice(-6)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400">
                            {sub.format === 'banner_header' ? 'Top Banner' : 
                             sub.format === 'native_card' ? 'Native VIP' : 
                             sub.format === 'banner_sidebar' ? 'Sidebar Banner' : 'Pop-Under'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 font-mono text-[9px]">
                            {sub.status}
                          </span>
                        </div>
                        <div className="text-stone-400">
                          <strong>Contact:</strong> {sub.contact}
                        </div>
                        <div className="text-stone-400">
                          <strong>Budget:</strong> {sub.budget}
                        </div>
                        <div className="text-stone-500 font-mono text-[10px] text-right pt-1 border-t border-stone-900">
                          Filed: {sub.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* VIEW: TERMS OF SERVICE */}
        {activeTab === 'terms' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
                  Legal Documents
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  Terms of <span className="text-cyan-400">Service</span>
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Last updated: June 2026. Please read these terms carefully before exploring or interacting with our adult networking portal.
                </p>
              </div>
            </div>

            <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 md:p-8 space-y-6 text-stone-300 text-sm leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-amber-400 font-mono">01.</span> Age Restriction (18+)
                </h3>
                <p>
                  You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to access or use Private Dating Hub. By browsing this portal, you warrant and represent that you are of legal age and that your viewing of adult-oriented materials does not violate local statutes.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">02.</span> Promotional Directory Only
                </h3>
                <p>
                  This website serves as an aggregate and directory of third-party adult webcam platforms, adult dating networks, and romantic roleplay games. We do not operate, host, or directly control any of the linked external platforms. All descriptions, rankings, and ratings are for subjective promotional and review-based activities.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-amber-400 font-mono">03.</span> Disclaimer of Liability
                </h3>
                <p>
                  Private Dating Hub bears no responsibility for any activities, financial transactions, communications, or legal disputes that arise once you leave this platform and navigate to external third-party sites. Users are urged to conduct their own due diligence before executing memberships or purchases on external websites.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">04.</span> Intellectual Property & DMCA
                </h3>
                <p>
                  We respect intellectual property rights. All brand names, trade icons, logos, and promotional graphics of third-party services are property of their respective owners. If you are a copyright holder and believe any of our index pages infringe upon your content, please submit an official request through our Abuse / DMCA Report form.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PRIVACY GUIDELINES */}
        {activeTab === 'privacy' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">
                  Privacy Safeguards
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  Privacy <span className="text-amber-400">Guidelines</span>
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Learn about our offline-first privacy framework, cookies declaration, and external safety procedures.
                </p>
              </div>
            </div>

            <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 md:p-8 space-y-6 text-stone-300 text-sm leading-relaxed">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">01.</span> Zero-Registration Framework
                </h3>
                <p>
                  At Private Dating Hub, we value your anonymity. We never ask users to register personal accounts, fill in profile surveys, or log credentials to view our ratings or galleries. Your interaction here is entirely unmonitored and decoupled from your personal identity.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-amber-400 font-mono">02.</span> Newsletter and Subscription Data
                </h3>
                <p>
                  If you voluntarily choose to subscribe to our newsletter, we require you to provide a valid email address. This email is stored strictly in encrypted environments and is only utilized to dispatch weekly briefings. We never share, trade, or sell our subscriber directory to third-party brokers. You can opt-out instantly at any time.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-cyan-400 font-mono">03.</span> Cookies and Local State
                </h3>
                <p>
                  We utilize standard client-side `localStorage` to save simple preferences such as your age gate confirmation and visual parameters. We do not run invasive tracking codes or behavioral tracking scripts. Any cookie files deployed belong to Google or Cloudflare to handle DDoS protection and security filters.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-stone-800">
                <h3 className="text-lg font-bold text-stone-100 uppercase font-display flex items-center gap-2">
                  <span className="text-amber-400 font-mono">04.</span> External Portal Links
                </h3>
                <p>
                  Our ratings, catalogs, and summaries contain redirect hyperlinks pointing to external websites. When you click on these placements, please remember that they operate under independent privacy regulations. We strongly suggest reading the terms and confidentiality clauses of those specific domains before sharing sensitive content.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: 18+ VERIFICATION FAQ */}
        {activeTab === 'faq-18' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full">
                  Verification FAQ
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  18+ Verification <span className="text-cyan-400">FAQ</span>
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Everything you need to know about age gate policies, safe browsing, and account validation rules.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  q: "Why is an age warning gate triggered upon entry?",
                  a: "Because our database lists reviews, media, and catalogs containing adult content, webcam sites, and romantic games. Consistent with general regulations and Google SafeSearch rules, we are required to screen out under-18 visitors before any page loads."
                },
                {
                  q: "How do external adult platforms verify visitor age?",
                  a: "External platforms use multiple verification protocols. These include age-restricted merchant processing filters (credit card verification), localized age checking services (such as ID checks required in certain states/countries), or phone number SMS confirmations. Every listed portal has its own verification standard."
                },
                {
                  q: "Does Private Dating Hub collect or inspect my personal documents?",
                  a: "Absolutely not. We do not host actual profiles, user rooms, or billing databases on this platform. We are purely an informational and advertising guide. We will never prompt you to upload an ID, passport, or provide real billing info."
                },
                {
                  q: "What should I do if I discover a suspicious account or inappropriate content on a partner site?",
                  a: "Please navigate directly to that partner platform's helpdesk or abuse team to file an instant flag. Additionally, you can submit an alert on our Abuse / DMCA page so our editors can review their partner status and terminate listings if necessary."
                },
                {
                  q: "Are the models featured in the video/photo galleries of legal age?",
                  a: "Yes. All webcam broadcasts, game characters, and gallery media featured or promoted are strictly hosted by verified adult models who are at least 18 years of age. All partner sites comply with US federal law 18 U.S.C. § 2257 and similar global standardizations."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">
                  <h3 className="text-sm font-bold text-stone-100 uppercase font-mono tracking-tight flex items-start gap-3">
                    <span className="text-amber-400 font-black">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <div className="mt-3.5 pl-6 text-xs text-stone-400 leading-relaxed border-l-2 border-stone-800">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: RESPONSIBLE DATING */}
        {activeTab === 'responsible' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">
                  Safety Protocol
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  Responsible <span className="text-amber-400">Dating</span>
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Core values and rules to secure your digital and real-life romantic explorations.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-stone-100 font-display uppercase">Secure Financial Limits</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Never wire, transfer, or share credit credentials with people you meet online. Real and secure adult platforms always utilize centralized billing gates rather than direct member-to-member money orders. Be cautious of individual requests for financial help.
                </p>
              </div>

              <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-stone-100 font-display uppercase">Anonymity and Credentials</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Keep your personal social media accounts, residential address, place of employment, and sensitive passwords strictly private. Create secondary, isolated email accounts specifically for adult dating memberships.
                </p>
              </div>

              <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-stone-100 font-display uppercase">Verify Partner Status</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Ensure the sites you check are verified. We list platforms with robust verification indicators so you avoid automated bot chats and pre-recorded streams. Look for verified model badges.
                </p>
              </div>

              <div className="bg-stone-900/40 border border-stone-800/80 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="text-base font-bold text-stone-100 font-display uppercase">Consent and Respect</h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Always act with consent, decency, and respect in chats or interactive webcam rooms. Any forms of harassment, non-consensual sharing of media, or predatory behavioral patterns are unacceptable and lead to account blocks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: ABUSE / DMCA REPORT */}
        {activeTab === 'dmca' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-full">
                  Trust & Safety
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  Abuse / <span className="text-rose-500">DMCA</span> Report
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  File a copyright infringement report or notify our legal team about illicit, fraudulent, or non-consensual content on partner links.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Block */}
              <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
                <h2 className="text-xl font-bold font-display text-stone-100 uppercase flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  Submit Report Form
                </h2>

                <form onSubmit={handleDmcaSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-stone-400 font-mono font-bold uppercase">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={dmcaForm.name}
                        onChange={(e) => setDmcaForm({ ...dmcaForm, name: e.target.value })}
                        disabled={isSubmittingDmca}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-rose-500 focus:outline-none rounded-lg text-xs text-stone-200 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-stone-400 font-mono font-bold uppercase">Contact Email</label>
                      <input
                        type="email"
                        required
                        value={dmcaForm.email}
                        onChange={(e) => setDmcaForm({ ...dmcaForm, email: e.target.value })}
                        disabled={isSubmittingDmca}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-rose-500 focus:outline-none rounded-lg text-xs text-stone-200 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase">Target Infringing URL / Link</label>
                    <input
                      type="url"
                      required
                      value={dmcaForm.targetUrl}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, targetUrl: e.target.value })}
                      disabled={isSubmittingDmca}
                      placeholder="https://adult-portal.com/infringing-link-here"
                      className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-rose-500 focus:outline-none rounded-lg text-xs text-stone-200 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase">Description of Violation</label>
                    <textarea
                      required
                      rows={5}
                      value={dmcaForm.description}
                      onChange={(e) => setDmcaForm({ ...dmcaForm, description: e.target.value })}
                      disabled={isSubmittingDmca}
                      placeholder="Please specify copyright details, non-consensual content information, or predatory behavior witnessed..."
                      className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-rose-500 focus:outline-none rounded-lg text-xs text-stone-200 transition-colors resize-none"
                    />
                  </div>

                  {dmcaSubmittedSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 shrink-0" />
                      <div>
                        <strong>Report Lodged!</strong> Our safety specialists have initiated a priority review under ticketing.
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingDmca}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-stone-100 font-bold rounded-lg transition-colors cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isSubmittingDmca ? 'Registering Ticket...' : 'File Legal Ticket'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Status Tracker */}
              <div className="lg:col-span-5 bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6 shadow-xl">
                <h3 className="text-sm font-bold text-stone-100 font-mono border-b border-stone-800 pb-3 uppercase">
                  Active Tickets ({dmcaSubmissions.length})
                </h3>

                {dmcaSubmissions.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-xs leading-relaxed space-y-2">
                    <p>No safety files registered in this session.</p>
                    <p className="text-[10px]">Use the left-hand form to file a report. Submissions persist locally for privacy.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                    {dmcaSubmissions.map((sub) => (
                      <div key={sub.id} className="bg-stone-950 p-4 rounded-lg border border-stone-800 text-xs space-y-2 relative">
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[8px] font-mono font-bold rounded">
                          {sub.status}
                        </div>
                        <div className="text-stone-200 font-bold max-w-[150px] truncate">{sub.name}</div>
                        <div className="text-stone-400 truncate"><strong>URL:</strong> {sub.targetUrl}</div>
                        <div className="text-stone-500 text-[10px] pt-1.5 border-t border-stone-900 text-right">
                          Filed: {sub.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: SUBMIT FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">
                  User Voice
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  User <span className="text-cyan-400">Feedback</span>
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Help us build a cleaner, faster, and more robust hub. We actively refine listings based on your reports and ratings.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Block */}
              <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-xl p-6 md:p-8 space-y-6 shadow-xl">
                <h2 className="text-xl font-bold font-display text-stone-100 uppercase flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                  Leave Your Thoughts
                </h2>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase">Nickname</label>
                    <input
                      type="text"
                      required
                      value={feedbackForm.nickname}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, nickname: e.target.value })}
                      disabled={isSubmittingFeedback}
                      placeholder="VibeExplorer"
                      className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-cyan-400 focus:outline-none rounded-lg text-xs text-stone-200 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                          disabled={isSubmittingFeedback}
                          className="p-1 focus:outline-none cursor-pointer"
                        >
                          <Star 
                            className={`w-6 h-6 transition-all ${
                              star <= feedbackForm.rating 
                                ? 'fill-amber-400 text-amber-400 scale-110' 
                                : 'text-stone-600 hover:text-stone-500'
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono text-stone-400 font-bold ml-2">({feedbackForm.rating}/5 stars)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-stone-400 font-mono font-bold uppercase">Your Review / Message</label>
                    <textarea
                      required
                      rows={4}
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                      disabled={isSubmittingFeedback}
                      placeholder="Write your feedback, requests for additional features, or thoughts here..."
                      className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-cyan-400 focus:outline-none rounded-lg text-xs text-stone-200 transition-colors resize-none"
                    />
                  </div>

                  {feedbackSubmittedSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 shrink-0" />
                      <div>
                        <strong>Feedback Filed!</strong> Thank you for your review. Your rating is registered in live stats.
                      </div>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-stone-100 font-bold rounded-lg transition-colors cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isSubmittingFeedback ? 'Submitting Thoughts...' : 'Post Review'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Real Feedback List */}
              <div className="lg:col-span-6 bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6 shadow-xl">
                <h3 className="text-sm font-bold text-stone-100 font-mono border-b border-stone-800 pb-3 uppercase">
                  Recent Reviews ({feedbackSubmissions.length})
                </h3>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {feedbackSubmissions.map((sub) => (
                    <div key={sub.id} className="bg-stone-950 p-4 rounded-lg border border-stone-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-200 font-mono">{sub.nickname}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < sub.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-800'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-stone-400 leading-relaxed italic">&ldquo;{sub.message}&rdquo;</p>
                      <div className="text-stone-600 text-[10px] text-right font-mono">
                        Posted: {sub.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: NEWS / BLOG CATEGORY */}
        {activeTab === 'news' && (
          <div className="space-y-8 animate-fadeIn" id="news-blog-view">
            <div className="relative bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-10 overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="max-w-3xl space-y-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-400/10 px-3 py-1 rounded-full">
                  Industry Insights
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-display text-stone-100 uppercase">
                  Portal <span className="text-amber-400">Blog & News</span>
                </h1>
                <p className="text-stone-300 text-sm md:text-base leading-relaxed">
                  Stay updated with safety tips, modern matching algorithms analysis, and exclusive industry reports curated by experts.
                </p>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Category buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {['All', 'Technology', 'Advice', 'Analysis'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setBlogCategoryFilter(cat);
                      setVisibleNewsCount(4);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                      blogCategoryFilter === cat
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-black shadow-lg shadow-amber-400/10'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search inputs */}
              <div className="relative w-full md:w-72">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={blogSearchQuery}
                  onChange={(e) => {
                    setBlogSearchQuery(e.target.value);
                    setVisibleNewsCount(4);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-cyan-400 focus:outline-none rounded-xl text-xs text-stone-200 transition-colors"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-500" />
                {blogSearchQuery && (
                  <button
                    onClick={() => {
                      setBlogSearchQuery('');
                      setVisibleNewsCount(4);
                    }}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* News List / Grid */}
            {filteredNewsArticles.length === 0 ? (
              <div className="bg-stone-900/40 border border-stone-800/80 rounded-2xl p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mx-auto text-stone-500">
                  <Search className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-stone-200 font-bold">No articles match your search</h3>
                  <p className="text-stone-500 text-xs">Try selecting another category or typing different keywords.</p>
                </div>
                <button
                  onClick={() => {
                    setBlogCategoryFilter('All');
                    setBlogSearchQuery('');
                    setVisibleNewsCount(4);
                  }}
                  className="px-4 py-2 bg-stone-950 hover:bg-stone-900 border border-stone-800 text-xs text-cyan-400 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedNewsArticles.map((article) => (
                  <div 
                    key={article.id}
                    className="bg-stone-900 border border-stone-800/80 rounded-2xl overflow-hidden shadow-md flex flex-col h-full hover:border-cyan-500/20 transition-all duration-300"
                  >
                    <div className="relative h-56 bg-stone-950">
                      <SkeletonImage 
                        src={article.imageUrl} 
                        alt={article.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-4 left-4 bg-cyan-950/95 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold font-mono py-1 px-2.5 rounded">
                        {article.category}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1 space-y-4">
                      <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{article.views.toLocaleString()} reads</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold text-stone-100 font-display line-clamp-2 hover:text-cyan-300 transition-colors">
                        <Link href={`/news/${article.slug || article.id}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-3 flex-1">
                        {article.excerpt}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-800/60 mt-auto">
                        <Link
                          href={`/news/${article.slug || article.id}`}
                          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono hover:underline cursor-pointer"
                        >
                          Read Full Article
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        <div className="flex items-center gap-1.5" id={`share-blog-${article.id}`}>
                          <span className="text-[10px] text-stone-500 font-mono">Share:</span>
                          <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://adult-portal.com/news/${article.id}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-blue-400 transition-colors p-1 bg-stone-950 hover:bg-stone-950/80 rounded border border-stone-800/80 hover:border-blue-500/20"
                            title="Share on Facebook"
                          >
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                            </svg>
                          </a>
                          <a
                            href={`https://www.reddit.com/submit?url=${encodeURIComponent(`https://adult-portal.com/news/${article.id}`)}&title=${encodeURIComponent(article.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-orange-400 transition-colors p-1 bg-stone-950 hover:bg-stone-950/80 rounded border border-stone-800/80 hover:border-orange-500/20"
                            title="Share on Reddit"
                          >
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.3-4.08 4.22.92c.04.83.72 1.49 1.56 1.49 1.1 0 1.99-.89 1.99-1.99s-.89-1.99-1.99-1.99c-.83 0-1.52.51-1.8 1.23l-4.72-1.03c-.22-.04-.44.08-.51.3l-1.52 4.77C5.37 7.42 3.1 8.06 1.42 9.08 1.1 8.35.37 7.84-.5 7.84c-1.65 0-3 1.35-3 3 0 .96.48 1.86 1.24 2.42-.07.38-.1.77-.1 1.17 0 3.86 4.43 7 9.86 7s9.86-3.14 9.86-7c0-.4-.03-.79-.1-1.17.76-.56 1.24-1.46 1.24-2.42zm-16.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8.9 4.38c-.73.73-2.1 1.12-3.4 1.12s-2.67-.38-3.4-1.12c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0 .53.53 1.62.83 2.69.83s2.16-.3 2.69-.83c.2-.2.51-.2.71 0 .2.2.2.51 0 .71zm-.4-2.88c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                            </svg>
                          </a>
                          <a
                            href={`https://t.me/share/url?url=${encodeURIComponent(`https://adult-portal.com/news/${article.id}`)}&text=${encodeURIComponent(article.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-sky-400 transition-colors p-1 bg-stone-950 hover:bg-stone-950/80 rounded border border-stone-800/80 hover:border-sky-500/20"
                            title="Share on Telegram"
                          >
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.35.52-.42-.01-1.23-.24-1.83-.43-.74-.24-1.33-.37-1.28-.79.03-.22.33-.45.91-.69 3.56-1.55 5.93-2.57 7.12-3.07 3.39-1.4 4.09-1.64 4.55-1.65.1 0 .33.02.48.15.12.1.16.24.18.35.02.13.02.26.01.39z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button with Custom Loading State & Progress */}
              {hasMoreNews && (
                <div className="flex flex-col items-center justify-center pt-8 border-t border-stone-850">
                  <button
                    onClick={() => {
                      setIsNewsLoadingMore(true);
                      setTimeout(() => {
                        setVisibleNewsCount(prev => prev + 4);
                        setIsNewsLoadingMore(false);
                      }, 600);
                    }}
                    disabled={isNewsLoadingMore}
                    className="px-6 py-3 bg-stone-900 hover:bg-stone-850 disabled:bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl text-xs font-bold text-stone-200 hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg shadow-black/10 disabled:opacity-60"
                  >
                    {isNewsLoadingMore ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading Articles...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Articles</span>
                        <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-stone-500 font-mono mt-3">
                    Showing {displayedNewsArticles.length} of {filteredNewsArticles.length} articles
                  </p>
                </div>
              )}
            </div>
          )}
          </div>
        )}

        {/* VIEW: DYNAMIC CUSTOM PAGE */}
        {activeTab.startsWith('custom-') && (
          (() => {
            const pageSlug = activeTab.replace('custom-', '');
            const page = siteConfig.customPages?.find(p => p.slug === pageSlug && p.isActive);
            if (!page) {
              return (
                <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center mx-auto text-stone-500">
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 className="text-stone-200 font-bold">Сторінку не знайдено</h3>
                  <p className="text-stone-500 text-xs">Ця сторінка була видалена або ще не опублікована адміністратором.</p>
                  <button onClick={() => setActiveTab('home')} className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition-colors cursor-pointer">
                    Повернутися на головну
                  </button>
                </div>
              );
            }

            // Render Markdown content or clean text paragraphs split by \n\n
            const renderContent = (content: string) => {
              return content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-black font-display text-amber-400 uppercase tracking-tight mt-6 mb-3 border-b border-stone-800 pb-2">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-bold font-display text-cyan-400 uppercase tracking-tight mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <ul key={index} className="list-disc pl-5 space-y-1.5 my-3 text-stone-300 text-sm">
                      {paragraph.split('\n').map((li, i) => <li key={i}>{li.replace('- ', '')}</li>)}
                    </ul>
                  );
                }
                return <p key={index} className="text-stone-300 text-sm leading-relaxed mb-4">{paragraph}</p>;
              });
            };

            return (
              <div className="space-y-8 animate-fadeIn" id={`custom-page-${page.slug}`}>
                <div className="border-b border-stone-800 pb-4 space-y-2">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    Custom Portal Page
                  </span>
                  <h1 className="text-3xl md:text-4xl font-black font-display text-stone-100 uppercase tracking-tight">{page.title}</h1>
                  <p className="text-xs text-stone-500 font-mono">Опубліковано: {page.createdAt}</p>
                </div>

                {/* STRUCTURE: Simple text centered */}
                {page.structureType === 'text' && (
                  <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 md:p-10 max-w-3xl mx-auto space-y-4">
                    {renderContent(page.content)}
                  </div>
                )}

                {/* STRUCTURE: Two columns */}
                {page.structureType === 'columns' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-stone-900 border border-stone-800/80 rounded-2xl p-6 md:p-8 space-y-4">
                      {renderContent(page.content)}
                    </div>
                    <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-400/10 px-2 py-0.5 rounded">Action Panel</span>
                        <h4 className="font-bold text-sm text-stone-200">Бажаєте підключитися?</h4>
                        <p className="text-xs text-stone-400 leading-relaxed font-sans">Всі пропозиції в нашому каталозі пройшли перевірку на безпеку та анонімність.</p>
                      </div>
                      <button onClick={() => setActiveTab('dating')} className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black uppercase rounded-lg transition-colors cursor-pointer">
                        Дивитись Оффери ➔
                      </button>
                    </div>
                  </div>
                )}

                {/* STRUCTURE: Bento Grid */}
                {page.structureType === 'bento' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="sm:col-span-2 bg-stone-900 border border-stone-800/80 rounded-2xl p-6 md:p-8 space-y-4">
                      {renderContent(page.content)}
                    </div>
                    <div className="bg-gradient-to-tr from-rose-950/20 to-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center space-y-4">
                      <Flame className="w-10 h-10 text-rose-500 animate-bounce" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm uppercase text-stone-100">Гарячі Новинки</h4>
                        <p className="text-xs text-stone-400 leading-relaxed font-sans">Свіжі оновлення від лідерів ринку знайомств.</p>
                      </div>
                      <button onClick={() => setActiveTab('dating')} className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-stone-100 text-xs font-bold rounded-lg transition-colors cursor-pointer">
                        Дивитись
                      </button>
                    </div>
                    <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 flex items-center gap-4">
                      <div className="text-2xl font-black text-amber-400">18+</div>
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-stone-300">Повна конфіденційність</h5>
                        <p className="text-[10px] text-stone-500">Ніхто не дізнається про ваші уподобання.</p>
                      </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 flex items-center gap-4">
                      <div className="text-2xl font-black text-cyan-400">SSL</div>
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-stone-300">Захищене з’єднання</h5>
                        <p className="text-[10px] text-stone-500 font-mono">Сучасні стандарти шифрування.</p>
                      </div>
                    </div>
                    <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 flex items-center gap-4">
                      <div className="text-2xl font-black text-emerald-400">Live</div>
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-stone-300 font-sans">Миттєве підключення</h5>
                        <p className="text-[10px] text-stone-500 font-sans">Без довгих очікувань.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STRUCTURE: Grid of cards */}
                {page.structureType === 'grid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 md:p-8 space-y-4 sm:col-span-2">
                      {renderContent(page.content)}
                    </div>
                    <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-2xl space-y-2">
                      <h4 className="font-bold text-sm text-stone-200">Безпечний серфінг</h4>
                      <p className="text-xs text-stone-400 leading-relaxed font-sans">Використовуйте VPN за потреби для максимальної анонімності при реєстраціях на сторонніх сайтах.</p>
                    </div>
                    <div className="bg-stone-900/60 border border-stone-800 p-6 rounded-2xl space-y-2">
                      <h4 className="font-bold text-sm text-stone-200 font-sans">Підтримка користувачів</h4>
                      <p className="text-xs text-stone-400 leading-relaxed font-sans">Якщо у вас виникли питання щодо партнерських пропозицій, пишіть на нашу електронну пошту.</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}

          </div>

          {/* RIGHT STICKY SIDEBAR */}
          <CustomSidebar setActiveTab={setActiveTab} />
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-stone-950 border-t border-stone-900 mt-16 py-12 text-stone-500 text-sm" id="site-footer">
        <div className="w-full px-4 sm:px-8 md:px-[50px] space-y-10">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-start">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-3 text-center lg:text-left flex flex-col items-center lg:items-start" id="footer-brand-col">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest font-mono">About Hub</h4>
              <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
                Premium directory of hand-verified adult networks, live webcam halls, and immersive roleplay games.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3 text-center lg:text-left flex flex-col items-center lg:items-start" id="footer-links-quick">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest font-mono">Quick Links</h4>
              <ul className="space-y-2 text-xs flex flex-col items-center lg:items-start">
                <li>
                  <button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Home Page
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('dating'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Adult Dating
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('livecams'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Live Webcam Halls
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('games'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Adult Roleplay Games
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Galleries & Media */}
            <div className="space-y-3 text-center lg:text-left flex flex-col items-center lg:items-start" id="footer-links-media">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest font-mono">Galleries & Media</h4>
              <ul className="space-y-2 text-xs flex flex-col items-center lg:items-start">
                <li>
                  <button onClick={() => { setActiveTab('gallery-photos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Photos Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('gallery-videos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Videos Gallery
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Partner Sites
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('ads'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-stone-400 hover:text-amber-400 transition-colors hover:underline cursor-pointer text-center lg:text-left">
                    Submit Listing
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Safety & Legal */}
            <div className="space-y-3 text-center lg:text-left flex flex-col items-center lg:items-start" id="footer-links-support">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest font-mono">Safety & Legal</h4>
              <ul className="space-y-2 text-xs flex flex-col items-center lg:items-start">
                <li>
                  <button 
                    onClick={() => { setActiveTab('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-stone-400 hover:text-cyan-400 transition-colors hover:underline cursor-pointer text-center lg:text-left bg-transparent border-none p-0 outline-none align-baseline font-sans text-xs"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-stone-400 hover:text-cyan-400 transition-colors hover:underline cursor-pointer text-center lg:text-left bg-transparent border-none p-0 outline-none align-baseline font-sans text-xs"
                  >
                    Privacy Guidelines
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('faq-18'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-stone-400 hover:text-cyan-400 transition-colors hover:underline cursor-pointer text-center lg:text-left bg-transparent border-none p-0 outline-none align-baseline font-sans text-xs"
                  >
                    18+ Verification FAQ
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('responsible'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-stone-400 hover:text-cyan-400 transition-colors hover:underline cursor-pointer text-center lg:text-left bg-transparent border-none p-0 outline-none align-baseline font-sans text-xs"
                  >
                    Responsible Dating
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Contact Support */}
            <div className="space-y-3 text-center lg:text-left flex flex-col items-center lg:items-start" id="footer-contact-col">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-widest font-mono">Contact Support</h4>
              <ul className="space-y-2 text-xs flex flex-col items-center lg:items-start">
                <li>
                  <p className="text-xs text-stone-400 leading-normal text-center lg:text-left">
                    Telegram: <span className="text-amber-400 font-mono font-bold hover:underline cursor-pointer">@private_dating_ads</span>
                  </p>
                </li>
                <li>
                  <p className="text-xs text-stone-400 leading-normal text-center lg:text-left">
                    Support: <span className="text-cyan-400 font-mono font-bold hover:underline cursor-pointer">ads@privatedating.com</span>
                  </p>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('dmca'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-stone-400 hover:text-cyan-400 transition-colors hover:underline cursor-pointer text-center lg:text-left bg-transparent border-none p-0 outline-none align-baseline font-sans text-xs"
                  >
                    Abuse / DMCA Report
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => { setActiveTab('feedback'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-stone-400 hover:text-cyan-400 transition-colors hover:underline cursor-pointer text-center lg:text-left bg-transparent border-none p-0 outline-none align-baseline font-sans text-xs"
                  >
                    Submit Feedback
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* NEWSLETTER SUBSCRIPTION BLOCK */}
          <div className="border-t border-stone-900/80 pt-10" id="footer-newsletter-section">
            <div className="bg-gradient-to-r from-stone-900/50 via-stone-900/80 to-stone-900/50 border border-stone-800/60 rounded-2xl p-6 md:p-8 max-w-4xl mx-auto shadow-xl relative overflow-hidden" id="newsletter-subscription-box">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-cyan-400/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                    <Mail className="w-3 h-3 text-amber-400" />
                    Weekly Insights
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-display tracking-tight text-stone-100 uppercase">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed max-w-md">
                    Receive hand-verified dating network launches, webcam discounts, and adult game updates delivered straight to your inbox. No spam, unsubscribe anytime.
                  </p>
                </div>

                <div className="md:col-span-5 w-full">
                  <AnimatePresence mode="wait">
                    {newsletterSuccess ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center space-y-2"
                        id="newsletter-success-alert"
                      >
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-100 uppercase">Successfully Subscribed!</h4>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            Thank you for joining. Check your inbox soon for your first briefing!
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleNewsletterSubmit}
                        className="space-y-2.5"
                        id="newsletter-form"
                      >
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                          <input
                            type="email"
                            required
                            placeholder="Enter your email address"
                            value={newsletterEmail}
                            onChange={(e) => {
                              setNewsletterEmail(e.target.value);
                              if (newsletterValidationError) setNewsletterValidationError('');
                            }}
                            disabled={isNewsletterSubmitting}
                            className={`w-full pl-10 pr-4 py-3 bg-stone-950 border rounded-xl text-xs text-stone-200 focus:outline-none focus:ring-1 disabled:opacity-50 ${
                              newsletterValidationError
                                ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-stone-800 focus:border-amber-400 focus:ring-amber-400/20'
                            }`}
                          />
                        </div>
                        {newsletterValidationError && (
                          <p className="text-[10px] text-red-400 font-mono text-left px-1 mt-0.5">
                            {newsletterValidationError}
                          </p>
                        )}
                        <button
                          type="submit"
                          disabled={isNewsletterSubmitting}
                          className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-black rounded-xl transition-all duration-200 shadow-[0_4px_12px_rgba(245,158,11,0.15)] flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
                        >
                          {isNewsletterSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-stone-950" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Joining...
                            </>
                          ) : (
                            <>
                              Subscribe Now
                              <ChevronRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom segment with Disclaimer and Copyright */}
          <div className="pt-8 border-t border-stone-900 space-y-4 text-center max-w-4xl mx-auto" id="footer-bottom-segment">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono font-bold">Disclaimer</h4>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                {siteConfig.texts.disclaimerText || "This portal’s contents are strictly meant for adult audiences (18+). All reviews, catalogs, outward hyperlinks, and media files are provided solely for informational and promotional activities. We bear no liability for services or actions on external platforms. Please interact responsibly."}
              </p>
            </div>
            <p className="text-[11px] text-stone-600 font-mono pt-1" suppressHydrationWarning>
              {siteConfig.texts.footerText || `© ${new Date().getFullYear()} Private Dating Hub. All rights reserved.`}
            </p>
          </div>

        </div>
      </footer>

      {/* ================= MODALS & OVERLAYS ================= */}
      <Modals
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
        reviews={reviews}
        newComment={newComment}
        setNewComment={setNewComment}
        handleAddComment={handleAddComment}
        activeVideo={activeVideo}
        setActiveVideo={setActiveVideo}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        activePhoto={activePhoto}
        setActivePhoto={setActivePhoto}
        catalogItems={catalogItems}
        selectedNewsArticle={selectedNewsArticle}
        setSelectedNewsArticle={setSelectedNewsArticle}
      />

      {/* ================= FAQ ASK A QUESTION MODAL ================= */}
      <AnimatePresence>
        {isFaqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto animate-none">
            {/* Click outside to close */}
            <div className="fixed inset-0 -z-10 cursor-default" onClick={() => setIsFaqModalOpen(false)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="max-w-md w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
              id="faq-ask-question-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer z-20"
                id="close-faq-modal"
              >
                <X className="w-4 h-4" />
              </button>

              {faqSubmitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold font-display text-stone-100">Question Sent Successfully!</h3>
                    <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
                      Our portal administrators have received your inquiry. We will respond directly to your provided email address within 24 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsFaqModalOpen(false)}
                    className="mt-4 px-5 py-2 bg-stone-950 border border-stone-800 text-stone-300 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Direct Administrator Inquiry</span>
                    <h2 className="text-xl md:text-2xl font-black font-display text-stone-100 uppercase flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                      Ask a Question
                    </h2>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Submit your question or feedback. Our support team will review your inquiry and reach out via email.
                    </p>
                  </div>

                  <form onSubmit={handleFaqSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">Your Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. John Doe / Anonymous"
                        value={faqForm.name}
                        onChange={(e) => {
                          setFaqForm({ ...faqForm, name: e.target.value });
                          if (faqErrors.name) setFaqErrors(prev => ({ ...prev, name: undefined }));
                        }}
                        disabled={isFaqSubmitting}
                        className={`w-full p-3 bg-stone-950 border rounded-xl text-xs text-stone-200 focus:outline-none focus:ring-1 disabled:opacity-50 ${
                          faqErrors.name
                            ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-stone-800/80 focus:border-amber-400 focus:ring-amber-400/20'
                        }`}
                      />
                      {faqErrors.name && (
                        <p className="text-[10px] text-red-400 font-mono text-left px-1 mt-0.5">
                          {faqErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">Email Address</label>
                      <input 
                        type="email" 
                        required
                        placeholder="name@example.com"
                        value={faqForm.email}
                        onChange={(e) => {
                          setFaqForm({ ...faqForm, email: e.target.value });
                          if (faqErrors.email) setFaqErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        disabled={isFaqSubmitting}
                        className={`w-full p-3 bg-stone-950 border rounded-xl text-xs text-stone-200 focus:outline-none focus:ring-1 disabled:opacity-50 ${
                          faqErrors.email
                            ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-stone-800/80 focus:border-amber-400 focus:ring-amber-400/20'
                        }`}
                      />
                      {faqErrors.email && (
                        <p className="text-[10px] text-red-400 font-mono text-left px-1 mt-0.5">
                          {faqErrors.email}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">Inquiry Category</label>
                      <select
                        value={faqForm.category}
                        onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                        disabled={isFaqSubmitting}
                        className="w-full p-3 bg-stone-950 border border-stone-800/80 rounded-xl text-xs text-stone-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 cursor-pointer disabled:opacity-50 animate-none"
                      >
                        <option value="General Safety">🛡️ Age Verification & Safety</option>
                        <option value="Platform Navigation">🧭 Site Portal Navigation</option>
                        <option value="Advertising Listings">📈 Submitting Banner Ads</option>
                        <option value="Technical Support">🔧 Technical/Bug Issues</option>
                        <option value="Other">💬 General Inquiry</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider block">Your Question</label>
                      <textarea 
                        required
                        placeholder="Describe your inquiry in detail..."
                        rows={4}
                        value={faqForm.message}
                        onChange={(e) => {
                          setFaqForm({ ...faqForm, message: e.target.value });
                          if (faqErrors.message) setFaqErrors(prev => ({ ...prev, message: undefined }));
                        }}
                        disabled={isFaqSubmitting}
                        className={`w-full p-3 bg-stone-950 border rounded-xl text-xs text-stone-200 focus:outline-none focus:ring-1 resize-none disabled:opacity-50 ${
                          faqErrors.message
                            ? 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-stone-800/80 focus:border-amber-400 focus:ring-amber-400/20'
                        }`}
                      />
                      {faqErrors.message && (
                        <p className="text-[10px] text-red-400 font-mono text-left px-1 mt-0.5">
                          {faqErrors.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isFaqSubmitting}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black rounded-xl transition-all shadow-[0_4px_15px_rgba(245,158,11,0.2)] flex items-center justify-center gap-1.5 uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isFaqSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-stone-950" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Dispatching Email...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
