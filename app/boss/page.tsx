'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  LogOut, 
  Layout, 
  Settings, 
  FileText, 
  Image as ImageIcon, 
  DollarSign, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  Sparkles, 
  Check, 
  ChevronRight, 
  X, 
  Users, 
  AlertCircle, 
  Eye,
  Heart,
  Tv,
  Gamepad2,
  Newspaper,
  LayoutTemplate,
  Globe,
  Laptop,
  Smartphone
} from 'lucide-react';
import { SiteConfig, CustomPage, AdPlacement, SiteTexts } from '@/lib/config-types';
import { Offer, NewsArticle, CatalogItem } from '@/lib/data';
import dynamic from 'next/dynamic';

const AnalyticsChart = dynamic(() => import('@/components/AnalyticsChart'), {
  ssr: false,
});

function slugify(text: string): string {
  const cyrillicToLatin: { [key: string]: string } = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'є': 'ye', 'ж': 'zh', 'з': 'z',
    'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya',
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Є': 'Ye', 'Ж': 'Zh', 'З': 'Z',
    'И': 'Y', 'І': 'I', 'Ї': 'Yi', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N', 'О': 'O',
    'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U', 'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch',
    'Ш': 'Sh', 'Щ': 'Shch', 'Ь': '', 'Ю': 'Yu', 'Я': 'Ya'
  };

  let transliterated = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    transliterated += cyrillicToLatin[char] !== undefined ? cyrillicToLatin[char] : char;
  }

  return transliterated
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function BossAdminPanel() {
  const [authToken, setAuthToken] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token') || '';
    }
    return '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('admin_token');
    }
    return false;
  });
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string>('');
  
  // Site configuration state
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [seoTheme, setSeoTheme] = useState<'light' | 'dark'>('light');
  const [seoDevice, setSeoDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Gemini SEO Suggestion generator states
  const [seoGenType, setSeoGenType] = useState<'offer' | 'article' | 'custom'>('offer');
  const [seoGenSelectedId, setSeoGenSelectedId] = useState<string>('');
  const [seoGenCustomName, setSeoGenCustomName] = useState<string>('');
  const [seoGenTone, setSeoGenTone] = useState<string>('Клікбейт / High-CTR');
  const [seoPreset, setSeoPreset] = useState<'Standard' | 'Aggressive' | 'Informative'>('Standard');
  const [seoGenerating, setSeoGenerating] = useState<boolean>(false);
  const [seoSuggestions, setSeoSuggestions] = useState<{
    suggestions: Array<{ title: string; description: string; explanation: string }>;
    suggestedKeywords: string[];
  } | null>(null);
  const [seoGenError, setSeoGenError] = useState<string | null>(null);

  // Editing States
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
  const [editingPage, setEditingPage] = useState<Partial<CustomPage> | null>(null);
  const [editingAd, setEditingAd] = useState<Partial<AdPlacement> | null>(null);

  // Forms search and filters inside admin
  const [offersFilter, setOffersFilter] = useState<string>('all');
  const [offersSearch, setOffersSearch] = useState<string>('');

  // Load configuration and check cookie session
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/config');
        const data = await res.json();
        if (data.success) {
          setConfig(data.config);
        }
      } catch (err) {
        console.error('Error fetching config:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        setAuthToken(data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || 'Невірні дані авторизації');
      }
    } catch (err) {
      setLoginError('Помилка сервера при спробі входу');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    // Clear cookie too via a mock trigger or just state
    document.cookie = "admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setAuthToken('');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const generateSeoWithGemini = async () => {
    if (!config) return;
    setSeoGenerating(true);
    setSeoGenError(null);
    try {
      let itemName = '';
      if (seoGenType === 'offer') {
        const targetId = seoGenSelectedId || (config.offers && config.offers.length > 0 ? config.offers[0].id : '');
        const found = config.offers?.find(o => o.id === targetId);
        itemName = found ? found.name : '';
      } else if (seoGenType === 'article') {
        const targetId = seoGenSelectedId || (config.newsArticles && config.newsArticles.length > 0 ? config.newsArticles[0].id : '');
        const found = config.newsArticles?.find(a => a.id === targetId);
        itemName = found ? found.title : '';
      } else {
        itemName = seoGenCustomName;
      }

      if (!itemName || !itemName.trim()) {
        setSeoGenError('Будь ласка, введіть назву або оберіть об\'єкт зі списку.');
        setSeoGenerating(false);
        return;
      }

      const res = await fetch('/api/gemini/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itemName,
          itemType: seoGenType === 'offer' ? 'Offer' : seoGenType === 'article' ? 'News Article' : 'Custom Page',
          tone: seoGenTone,
          preset: seoPreset,
          categoryLanguage: 'uk'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Не вдалося згенерувати SEO шаблони');
      }

      setSeoSuggestions(data);
    } catch (err: any) {
      console.error(err);
      setSeoGenError(err.message || 'Помилка при зв’язку з ШІ-моделлю.');
    } finally {
      setSeoGenerating(false);
    }
  };

  const handleSaveConfig = async (updatedConfig: SiteConfig) => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(updatedConfig)
      });
      const data = await res.json();
      if (data.success) {
        setConfig(updatedConfig);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || 'Помилка збереження налаштувань');
      }
    } catch (err) {
      setSaveError('Помилка з’єднання із сервером');
    } finally {
      setIsSaving(false);
    }
  };

  // OFFER MANAGERS
  const saveOfferForm = () => {
    if (!config || !editingOffer) return;
    if (!editingOffer.id || !editingOffer.name || !editingOffer.category) {
      alert('Будь ласка, заповніть обов’язкові поля (ID, Назва, Категорія)');
      return;
    }

    let updatedOffers = [...config.offers];
    const index = updatedOffers.findIndex(o => o.id === editingOffer.id);

    const fullOffer: Offer = {
      id: editingOffer.id,
      name: editingOffer.name,
      category: editingOffer.category as 'dating' | 'livecams' | 'games',
      slug: editingOffer.slug || slugify(editingOffer.name || ''),
      shortDesc: editingOffer.shortDesc || '',
      fullDesc: editingOffer.fullDesc || '',
      imageUrl: editingOffer.imageUrl || 'https://picsum.photos/seed/default/600/400',
      views: editingOffer.views || 100,
      likes: editingOffer.likes || 10,
      rating: editingOffer.rating || 4.5,
      ctaUrl: editingOffer.ctaUrl || '#',
      tags: editingOffer.tags || [],
      features: editingOffer.features || [],
      pros: editingOffer.pros || [],
      activeUsers: editingOffer.activeUsers || 1000
    };

    if (index >= 0) {
      updatedOffers[index] = fullOffer;
    } else {
      updatedOffers.unshift(fullOffer);
    }

    const updatedConfig = { ...config, offers: updatedOffers };
    handleSaveConfig(updatedConfig);
    setEditingOffer(null);
  };

  const deleteOffer = (offerId: string) => {
    if (!config) return;
    if (confirm(`Ви дійсно бажаєте видалити пропозицію з ID: ${offerId}?`)) {
      const updatedConfig = {
        ...config,
        offers: config.offers.filter(o => o.id !== offerId)
      };
      handleSaveConfig(updatedConfig);
    }
  };

  // ARTICLE MANAGERS
  const saveArticleForm = () => {
    if (!config || !editingArticle) return;
    if (!editingArticle.id || !editingArticle.title) {
      alert('Будь ласка, вкажіть ID та заголовок запису блогу');
      return;
    }

    let updatedArticles = [...config.newsArticles];
    const index = updatedArticles.findIndex(a => a.id === editingArticle.id);

    const fullArticle: NewsArticle = {
      id: editingArticle.id,
      title: editingArticle.title,
      slug: editingArticle.slug || slugify(editingArticle.title || ''),
      excerpt: editingArticle.excerpt || '',
      content: editingArticle.content || '',
      date: editingArticle.date || new Date().toISOString().split('T')[0],
      imageUrl: editingArticle.imageUrl || 'https://picsum.photos/seed/defaultnews/800/500',
      views: editingArticle.views || 50,
      category: editingArticle.category || 'Technology'
    };

    if (index >= 0) {
      updatedArticles[index] = fullArticle;
    } else {
      updatedArticles.unshift(fullArticle);
    }

    const updatedConfig = { ...config, newsArticles: updatedArticles };
    handleSaveConfig(updatedConfig);
    setEditingArticle(null);
  };

  const deleteArticle = (articleId: string) => {
    if (!config) return;
    if (confirm(`Видалити статтю блогу: ${articleId}?`)) {
      const updatedConfig = {
        ...config,
        newsArticles: config.newsArticles.filter(a => a.id !== articleId)
      };
      handleSaveConfig(updatedConfig);
    }
  };

  // CUSTOM PAGE MANAGERS
  const savePageForm = () => {
    if (!config || !editingPage) return;
    if (!editingPage.slug || !editingPage.title) {
      alert('Будь ласка, заповніть унікальний Slug та назву сторінки');
      return;
    }

    let updatedPages = [...config.customPages];
    const index = updatedPages.findIndex(p => p.slug === editingPage.slug);

    const fullPage: CustomPage = {
      slug: editingPage.slug,
      title: editingPage.title,
      content: editingPage.content || '',
      structureType: editingPage.structureType || 'text',
      isActive: editingPage.isActive !== undefined ? editingPage.isActive : true,
      metaDescription: editingPage.metaDescription || '',
      createdAt: editingPage.createdAt || new Date().toISOString().split('T')[0]
    };

    if (index >= 0) {
      updatedPages[index] = fullPage;
    } else {
      updatedPages.push(fullPage);
    }

    const updatedConfig = { ...config, customPages: updatedPages };
    handleSaveConfig(updatedConfig);
    setEditingPage(null);
  };

  const deletePage = (slug: string) => {
    if (!config) return;
    if (confirm(`Видалити сторінку: /${slug}?`)) {
      const updatedConfig = {
        ...config,
        customPages: config.customPages.filter(p => p.slug !== slug)
      };
      handleSaveConfig(updatedConfig);
    }
  };

  // AD MANAGERS
  const saveAdForm = () => {
    if (!config || !editingAd) return;
    if (!editingAd.id) return;

    let updatedAds = [...config.adPlacements];
    const index = updatedAds.findIndex(a => a.id === editingAd.id);

    const fullAd: AdPlacement = {
      id: editingAd.id,
      name: editingAd.name || 'Ad Slot',
      imageUrl: editingAd.imageUrl || '',
      targetUrl: editingAd.targetUrl || '',
      active: editingAd.active !== undefined ? editingAd.active : true
    };

    if (index >= 0) {
      updatedAds[index] = fullAd;
    } else {
      updatedAds.push(fullAd);
    }

    const updatedConfig = { ...config, adPlacements: updatedAds };
    handleSaveConfig(updatedConfig);
    setEditingAd(null);
  };

  // TEXTS MANAGER
  const handleTextChange = (key: keyof SiteTexts, value: string) => {
    if (!config) return;
    const updatedConfig = {
      ...config,
      texts: {
        ...config.texts,
        [key]: value
      }
    };
    setConfig(updatedConfig); // Instant UI sync, user can hit "Save texts"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center space-y-4 text-stone-200" id="admin-loading-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs font-mono tracking-widest uppercase">Завантаження панелі керування...</p>
      </div>
    );
  }

  // --- 1. RENDER LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden" id="admin-login-screen">
        {/* Ambient glowing circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full bg-stone-900/90 border border-stone-800/80 rounded-2xl p-8 shadow-2xl relative">
          <div className="text-center space-y-3 mb-8">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
              Secure Access
            </span>
            <h1 className="text-2xl md:text-3xl font-black font-display text-stone-100 tracking-tight uppercase">
              PORTAL <span className="text-cyan-400">BOSS</span>
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              Введіть облікові дані адміністратора. Дані заповнюються в змінних оточення <code className="text-stone-300 font-mono">ADMIN_USERNAME</code> та <code className="text-stone-300 font-mono">ADMIN_PASSWORD</code> на хостингу.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">Користувач (Username)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-sm text-stone-100 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">Пароль (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-sm text-stone-100 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/15 cursor-pointer"
            >
              Авторизуватися
            </button>
          </form>

          {/* Quick instructions for deployment defaults */}
          <div className="mt-8 pt-6 border-t border-stone-800/50 text-center">
            <p className="text-[10px] text-stone-500 font-mono leading-relaxed">
              * Локальний запуск / Прев’ю дефолти:<br />
              Користувач: <span className="text-amber-400/80">admin</span> | Пароль: <span className="text-amber-400/80">password123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. RENDER ADMIN LAYOUT ---
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row" id="admin-workspace">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-stone-900 border-r border-stone-800 flex flex-col shrink-0">
        {/* Title area */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-lg font-black font-display tracking-wider text-stone-100">
              PORTAL <span className="text-amber-400">BOSS</span>
            </h1>
          </div>
          <span className="text-[9px] font-mono text-stone-500 border border-stone-800 px-1.5 py-0.5 rounded">v1.1</span>
        </div>

        {/* User context */}
        <div className="px-6 py-4 border-b border-stone-800/50 bg-stone-950/40 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[10px] font-mono text-stone-500">Авторизовано як</p>
            <p className="text-xs font-bold text-stone-300">Administrator</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'dashboard' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}
          >
            <Layout className="w-4 h-4" />
            <span>Панель огляду</span>
          </button>

          <button
            onClick={() => setActiveSubTab('texts')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'texts' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}
          >
            <Settings className="w-4 h-4" />
            <span>Тексти та Кнопки</span>
          </button>

          <button
            onClick={() => setActiveSubTab('offers')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'offers' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}
          >
            <Heart className="w-4 h-4" />
            <span>Оффери (Категорії)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('blog')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'blog' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Записи Блогу</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pages')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'pages' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}
          >
            <Layers className="w-4 h-4" />
            <span>Конструктор Сторінок</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ads')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'ads' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Рекламні Місця</span>
          </button>

          <button
            onClick={() => setActiveSubTab('seo')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'seo' ? 'bg-amber-400 text-stone-950' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'}`}
          >
            <Settings className="w-4 h-4" />
            <span>SEO та Мета-теги</span>
          </button>
        </nav>

        {/* Global Save feedback footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/20 text-center">
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:underline font-mono"
          >
            Переглянути сайт
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </aside>

      {/* MAIN WORK AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
        {/* TOP STATUS HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-stone-800">
          <div>
            <h2 className="text-xl md:text-2xl font-black font-display text-stone-100 uppercase tracking-tight">
              {activeSubTab === 'dashboard' && 'Панель огляду та Статистика'}
              {activeSubTab === 'texts' && 'Редактор загальної інформації, кнопок та меню'}
              {activeSubTab === 'offers' && 'Управління партнерськими офферами'}
              {activeSubTab === 'blog' && 'Керування дописами блогу'}
              {activeSubTab === 'pages' && 'Конструктор довільних сторінок'}
              {activeSubTab === 'ads' && 'Розміщення та керування рекламою'}
              {activeSubTab === 'seo' && 'Налаштування SEO та Мета-тегів для категорій'}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Всі збережені зміни записуються в конфіг-файл та одразу оновлюють вигляд для користувачів.
            </p>
          </div>

          {/* Quick status message */}
          {saveSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs py-2 px-4 rounded-xl flex items-center gap-2 font-semibold">
              <Check className="w-4 h-4" />
              <span>Зміни збережено в config.json!</span>
            </div>
          )}
          {saveError && (
            <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs py-2 px-4 rounded-xl flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>{saveError}</span>
            </div>
          )}
        </div>

        {/* --- TAB CONTENT 1: DASHBOARD --- */}
        {activeSubTab === 'dashboard' && config && (
          <div className="space-y-8 animate-fadeIn" id="admin-dashboard-tab">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Всього Офферів</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-stone-100">{config.offers.length}</span>
                  <span className="text-xs text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded font-mono">Dating / Cams / Games</span>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Записів у Блозі</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-stone-100">{config.newsArticles.length}</span>
                  <span className="text-xs text-cyan-400 font-bold bg-cyan-400/10 px-2 py-0.5 rounded font-mono">Статті та інсайти</span>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Активних сторінок</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-stone-100">{config.customPages.filter(p => p.isActive).length}</span>
                  <span className="text-xs text-purple-400 font-bold bg-purple-400/10 px-2 py-0.5 rounded font-mono">Конструктор</span>
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800/80 rounded-2xl p-6 space-y-2">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Рекламних слотів</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-stone-100">{config.adPlacements.length}</span>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded font-mono">{config.adPlacements.filter(a => a.active).length} Активно</span>
                </div>
              </div>
            </div>

            {/* Recharts Analytics Section */}
            <AnalyticsChart offers={config.offers} />

            {/* Quick site status summary card */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
              <div className="max-w-2xl space-y-4">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase tracking-wider">
                  Швидкий Огляд Системи
                </span>
                <h3 className="text-xl md:text-2xl font-black text-stone-100 uppercase font-display">Портал працює в штатному режимі</h3>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
                  Будь-яке слово, заголовок, опис, посилання на кнопку, зображення чи фоновий банер на сайті піддаються зміні. Виберіть потрібний розділ в лівому меню, щоб додати новий матеріал чи налаштувати рекламне місце. Дані зберігаються безпосередньо у <code className="text-amber-400 font-mono">config.json</code> у кореневому проекті.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setActiveSubTab('texts')}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Редагувати інтерфейс
                  </button>
                  <button
                    onClick={() => setActiveSubTab('pages')}
                    className="px-4 py-2 bg-stone-900 border border-stone-800 hover:bg-stone-800 text-stone-200 text-xs font-black uppercase rounded-lg transition-colors cursor-pointer"
                  >
                    Створити нову сторінку
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 2: TEXTS & MENU LABELS --- */}
        {activeSubTab === 'texts' && config && (
          <div className="space-y-8 animate-fadeIn" id="admin-texts-tab">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-stone-100 font-display flex items-center gap-2 border-b border-stone-800 pb-4">
                <Settings className="w-5 h-5 text-amber-400" />
                Логотип та Головний Геро-Блок (Текст & Кнопки)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Текст логотипу</label>
                  <input
                    type="text"
                    value={config.texts.logoText}
                    onChange={(e) => handleTextChange('logoText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Текст кнопки СТА (Hero CTA)</label>
                  <input
                    type="text"
                    value={config.texts.heroCtaText}
                    onChange={(e) => handleTextChange('heroCtaText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Головний заголовок сторінки (Hero Title)</label>
                  <input
                    type="text"
                    value={config.texts.heroTitle}
                    onChange={(e) => handleTextChange('heroTitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Підзаголовок сторінки (Hero Subtitle)</label>
                  <textarea
                    rows={2}
                    value={config.texts.heroSubtitle}
                    onChange={(e) => handleTextChange('heroSubtitle', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-stone-100 font-display flex items-center gap-2 border-b border-stone-800 pb-4">
                <LayoutTemplate className="w-5 h-5 text-cyan-400" />
                Назви вкладок навігаційного меню
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Головна</label>
                  <input
                    type="text"
                    value={config.texts.tabHome}
                    onChange={(e) => handleTextChange('tabHome', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Знайомства</label>
                  <input
                    type="text"
                    value={config.texts.tabDating}
                    onChange={(e) => handleTextChange('tabDating', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Камери</label>
                  <input
                    type="text"
                    value={config.texts.tabLivecams}
                    onChange={(e) => handleTextChange('tabLivecams', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Ігри</label>
                  <input
                    type="text"
                    value={config.texts.tabGames}
                    onChange={(e) => handleTextChange('tabGames', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Блог / Новини</label>
                  <input
                    type="text"
                    value={config.texts.tabBlog}
                    onChange={(e) => handleTextChange('tabBlog', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Галерея</label>
                  <input
                    type="text"
                    value={config.texts.tabGallery}
                    onChange={(e) => handleTextChange('tabGallery', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Каталог</label>
                  <input
                    type="text"
                    value={config.texts.tabCatalog}
                    onChange={(e) => handleTextChange('tabCatalog', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вкладка Реклама</label>
                  <input
                    type="text"
                    value={config.texts.tabAds}
                    onChange={(e) => handleTextChange('tabAds', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>
              </div>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-stone-100 font-display flex items-center gap-2 border-b border-stone-800 pb-4">
                <FileText className="w-5 h-5 text-purple-400" />
                Футер та Дисклеймер (18+)
              </h3>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Копірайт текст футера</label>
                  <input
                    type="text"
                    value={config.texts.footerText}
                    onChange={(e) => handleTextChange('footerText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Попереджувальний дисклеймер (Age Warning Label)</label>
                  <textarea
                    rows={3}
                    value={config.texts.disclaimerText}
                    onChange={(e) => handleTextChange('disclaimerText', e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-950 border border-stone-800 focus:border-amber-400 focus:outline-none rounded-xl text-xs text-stone-200 leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* General Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSaveConfig(config)}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Зберегти всі тексти</span>
              </button>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 3: OFFERS MANAGER --- */}
        {activeSubTab === 'offers' && config && (
          <div className="space-y-8 animate-fadeIn" id="admin-offers-tab">
            {/* Filter and Create head */}
            <div className="bg-stone-900/60 border border-stone-800/80 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => setOffersFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${offersFilter === 'all' ? 'bg-amber-400 text-stone-950 border-amber-400' : 'bg-stone-950 text-stone-400 border-stone-800'}`}
                >
                  Всі ({config.offers.length})
                </button>
                <button
                  onClick={() => setOffersFilter('dating')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${offersFilter === 'dating' ? 'bg-amber-400 text-stone-950 border-amber-400' : 'bg-stone-950 text-stone-400 border-stone-800'}`}
                >
                  Dating ({config.offers.filter(o => o.category === 'dating').length})
                </button>
                <button
                  onClick={() => setOffersFilter('livecams')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${offersFilter === 'livecams' ? 'bg-amber-400 text-stone-950 border-amber-400' : 'bg-stone-950 text-stone-400 border-stone-800'}`}
                >
                  Live Cams ({config.offers.filter(o => o.category === 'livecams').length})
                </button>
                <button
                  onClick={() => setOffersFilter('games')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${offersFilter === 'games' ? 'bg-amber-400 text-stone-950 border-amber-400' : 'bg-stone-950 text-stone-400 border-stone-800'}`}
                >
                  Games ({config.offers.filter(o => o.category === 'games').length})
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Пошук офферів за назвою..."
                  value={offersSearch}
                  onChange={(e) => setOffersSearch(e.target.value)}
                  className="px-4 py-1.5 bg-stone-950 border border-stone-800 focus:outline-none rounded-lg text-xs text-stone-200 w-full md:w-56"
                />
                <button
                  onClick={() => setEditingOffer({
                    id: 'offer-' + Math.random().toString(36).substring(2, 9),
                    name: '',
                    category: 'dating',
                    shortDesc: '',
                    fullDesc: '',
                    imageUrl: 'https://picsum.photos/600/400',
                    ctaUrl: '',
                    rating: 4.8,
                    likes: 120,
                    views: 1200,
                    tags: [],
                    features: [],
                    pros: [],
                    activeUsers: 3000
                  })}
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-stone-950 text-xs font-black rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Додати Оффер</span>
                </button>
              </div>
            </div>

            {/* List of Offers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.offers
                .filter(offer => offersFilter === 'all' || offer.category === offersFilter)
                .filter(offer => offer.name.toLowerCase().includes(offersSearch.toLowerCase()))
                .map(offer => (
                  <div key={offer.id} className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                    <div className="p-5 space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                            {offer.category}
                          </span>
                          <h4 className="text-base font-black text-stone-100 font-display mt-1.5">{offer.name}</h4>
                          <span className="text-[10px] text-stone-500 font-mono">ID: {offer.id}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-amber-400">★ {offer.rating}</span>
                          <p className="text-[10px] text-stone-500 font-mono mt-0.5">{offer.activeUsers} Users</p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-3">{offer.shortDesc}</p>

                      <div className="flex flex-wrap gap-1">
                        {offer.tags.map((tag, i) => (
                          <span key={i} className="text-[9px] text-stone-400 bg-stone-950 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-stone-950/60 p-4 border-t border-stone-800 flex items-center justify-between gap-2">
                      <a href={offer.ctaUrl} target="_blank" className="text-[10px] text-stone-500 font-mono hover:underline truncate">
                        {offer.ctaUrl}
                      </a>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setEditingOffer(offer)}
                          className="p-1.5 hover:bg-stone-800 rounded text-amber-400 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="p-1.5 hover:bg-stone-800 rounded text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* EDIT OFFER MODAL */}
            {editingOffer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
                <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                  <button onClick={() => setEditingOffer(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-black text-stone-100 uppercase tracking-tight font-display border-b border-stone-800 pb-3">
                    {config.offers.some(o => o.id === editingOffer.id) ? 'Редагувати Оффер' : 'Створити новий Оффер'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Унікальний ID оффера (без пробілів)</label>
                      <input
                        type="text"
                        disabled={config.offers.some(o => o.id === editingOffer.id)}
                        value={editingOffer.id || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, id: e.target.value.replace(/\s+/g, '') })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="my_awesome_site"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Назва Оффера</label>
                      <input
                        type="text"
                        value={editingOffer.name || ''}
                        onChange={(e) => {
                          const newName = e.target.value;
                          setEditingOffer(prev => {
                            if (!prev) return null;
                            const isNew = !config?.offers.some(o => o.id === prev.id);
                            const updated = { ...prev, name: newName };
                            if (isNew && (!prev.slug || prev.slug === slugify(prev.name || ''))) {
                              updated.slug = slugify(newName);
                            }
                            return updated;
                          });
                        }}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="AmorHub"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">SEO URL Slug (Генерується з Назви)</label>
                      <input
                        type="text"
                        value={editingOffer.slug || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, slug: slugify(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 font-mono"
                        placeholder="amorhub"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Категорія</label>
                      <select
                        value={editingOffer.category || 'dating'}
                        onChange={(e) => setEditingOffer({ ...editingOffer, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none"
                      >
                        <option value="dating">Dating</option>
                        <option value="livecams">Live Cams</option>
                        <option value="games">Adult Games</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Посилання кнопки переходу (CTA URL)</label>
                      <input
                        type="text"
                        value={editingOffer.ctaUrl || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, ctaUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="https://example.com/join-our-link"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Зображення оффера (URL)</label>
                      <input
                        type="text"
                        value={editingOffer.imageUrl || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 font-mono"
                        placeholder="https://picsum.photos/seed/dating1/600/400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Рейтинг (від 1 до 5)</label>
                      <input
                        type="number"
                        step="0.05"
                        min="1"
                        max="5"
                        value={editingOffer.rating || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, rating: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Активні користувачі</label>
                      <input
                        type="number"
                        value={editingOffer.activeUsers || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, activeUsers: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Теги (через кому)</label>
                      <input
                        type="text"
                        value={editingOffer.tags?.join(', ') || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Video Chat, Anonymity, Verified"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Короткий опис</label>
                      <input
                        type="text"
                        value={editingOffer.shortDesc || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, shortDesc: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Популярний сайт знайомств з розумним алгоритмом підбору..."
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Повний детальний опис</label>
                      <textarea
                        rows={3}
                        value={editingOffer.fullDesc || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, fullDesc: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Розгорнутий опис для детальної вкладки..."
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Список переваг (Плюси, один на рядок)</label>
                      <textarea
                        rows={3}
                        value={editingOffer.pros?.join('\n') || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, pros: e.target.value.split('\n').filter(Boolean) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Велика база користувачів&#10;Швидка реєстрація&#10;Цілодобова підтримка"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Функціональні особливості (Features, одна на рядок)</label>
                      <textarea
                        rows={3}
                        value={editingOffer.features?.join('\n') || ''}
                        onChange={(e) => setEditingOffer({ ...editingOffer, features: e.target.value.split('\n').filter(Boolean) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Миттєвий перекладач чату&#10;Анонімність та захист даних&#10;Безпечні платежі"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                    <button
                      onClick={() => setEditingOffer(null)}
                      className="px-4 py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-400 rounded-lg transition-colors cursor-pointer"
                    >
                      Скасувати
                    </button>
                    <button
                      onClick={saveOfferForm}
                      className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black uppercase rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Зберегти оффер</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 4: BLOG / NEWS MANAGER --- */}
        {activeSubTab === 'blog' && config && (
          <div className="space-y-8 animate-fadeIn" id="admin-blog-tab">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-stone-100 font-display uppercase tracking-tight">Всі дописи блогу</h3>
              <button
                onClick={() => setEditingArticle({
                  id: 'news-' + Math.random().toString(36).substring(2, 9),
                  title: '',
                  excerpt: '',
                  content: '',
                  category: 'Advice',
                  imageUrl: 'https://picsum.photos/seed/news/800/500',
                  date: new Date().toISOString().split('T')[0],
                  views: 120
                })}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Написати допис</span>
              </button>
            </div>

            {/* List of articles */}
            <div className="space-y-4">
              {config.newsArticles.map((article) => (
                <div key={article.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        {article.category}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">{article.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-stone-200">{article.title}</h4>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setEditingArticle(article)}
                      className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-amber-400 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Редагувати</span>
                    </button>
                    <button
                      onClick={() => deleteArticle(article.id)}
                      className="p-1.5 hover:bg-stone-800 rounded text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* EDIT ARTICLE MODAL */}
            {editingArticle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
                <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                  <button onClick={() => setEditingArticle(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-black text-stone-100 uppercase tracking-tight font-display border-b border-stone-800 pb-3">
                    {config.newsArticles.some(a => a.id === editingArticle.id) ? 'Редагувати запис блогу' : 'Новий запис у блог'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">ID запису (без пробілів)</label>
                      <input
                        type="text"
                        disabled={config.newsArticles.some(a => a.id === editingArticle.id)}
                        value={editingArticle.id || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, id: e.target.value.replace(/\s+/g, '') })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="trend_2026"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Категорія блогу</label>
                      <input
                        type="text"
                        value={editingArticle.category || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Technology / Advice / Analysis"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Заголовок статті</label>
                      <input
                        type="text"
                        value={editingArticle.title || ''}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setEditingArticle(prev => {
                            if (!prev) return null;
                            const isNew = !config?.newsArticles.some(a => a.id === prev.id);
                            const updated = { ...prev, title: newTitle };
                            if (isNew && (!prev.slug || prev.slug === slugify(prev.title || ''))) {
                              updated.slug = slugify(newTitle);
                            }
                            return updated;
                          });
                        }}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="AI у сфері знайомств..."
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">SEO URL Slug (Генерується із Заголовка)</label>
                      <input
                        type="text"
                        value={editingArticle.slug || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, slug: slugify(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 font-mono"
                        placeholder="ai-u-sferi-znajomstv"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Зображення обкладинки (URL)</label>
                      <input
                        type="text"
                        value={editingArticle.imageUrl || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 font-mono"
                        placeholder="https://picsum.photos/seed/news-ai/800/500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Дата публікації</label>
                      <input
                        type="date"
                        value={editingArticle.date || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Короткий уривок (Excerpt)</label>
                      <input
                        type="text"
                        value={editingArticle.excerpt || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Короткий заманливий вступний текст на дві фрази..."
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Повний вміст статті (Content)</label>
                      <textarea
                        rows={8}
                        value={editingArticle.content || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 leading-relaxed font-sans"
                        placeholder="Введіть повний зміст новини. Окремі абзаци розділяйте порожнім рядком."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                    <button
                      onClick={() => setEditingArticle(null)}
                      className="px-4 py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-400 rounded-lg transition-colors cursor-pointer"
                    >
                      Скасувати
                    </button>
                    <button
                      onClick={saveArticleForm}
                      className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black uppercase rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Зберегти публікацію</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 5: PAGES CREATOR --- */}
        {activeSubTab === 'pages' && config && (
          <div className="space-y-8 animate-fadeIn" id="admin-pages-tab">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-stone-100 font-display uppercase tracking-tight">Додаткові довільні сторінки</h3>
              <button
                onClick={() => setEditingPage({
                  slug: 'page-' + Math.random().toString(36).substring(2, 6),
                  title: '',
                  content: '## Заголовок секції\n\nОсновний текст...',
                  structureType: 'text',
                  isActive: true,
                  metaDescription: '',
                  createdAt: new Date().toISOString().split('T')[0]
                })}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Створити сторінку</span>
              </button>
            </div>

            {/* Pages directory list */}
            <div className="space-y-4">
              {config.customPages.map((page) => (
                <div key={page.slug} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-stone-200">{page.title}</h4>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${page.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-stone-950 text-stone-500'}`}>
                        {page.isActive ? 'ACTIVE' : 'DRAFT'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
                      <span>Адреса: <code className="text-cyan-400 font-semibold">/{page.slug}</code></span>
                      <span className="text-stone-600">|</span>
                      <span>Структура: <span className="text-amber-400 font-semibold">{page.structureType}</span></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingPage(page)}
                      className="px-3 py-1.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-amber-400 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Редагувати</span>
                    </button>
                    <button
                      onClick={() => deletePage(page.slug)}
                      className="p-1.5 hover:bg-stone-800 rounded text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* EDIT PAGE MODAL */}
            {editingPage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
                <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                  <button onClick={() => setEditingPage(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-100 p-1">
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-black text-stone-100 uppercase tracking-tight font-display border-b border-stone-800 pb-3">
                    {config.customPages.some(p => p.slug === editingPage.slug) ? 'Редагувати сторінку' : 'Створити нову сторінку'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Адресний шлях сторінки (URL Slug, без /)</label>
                      <input
                        type="text"
                        disabled={config.customPages.some(p => p.slug === editingPage.slug)}
                        value={editingPage.slug || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="vip-club"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Назва сторінки (Title)</label>
                      <input
                        type="text"
                        value={editingPage.title || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="VIP Клуб та Привілеї"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Структура / Шаблон сторінки</label>
                      <select
                        value={editingPage.structureType || 'text'}
                        onChange={(e) => setEditingPage({ ...editingPage, structureType: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none"
                      >
                        <option value="text">Центрований текст (Простий)</option>
                        <option value="columns">Дві Колонки (Двосторонній)</option>
                        <option value="bento">Bento Спеціальна Сітка</option>
                        <option value="grid">Сітка карток (Grid Layout)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Опис метатегу (SEO Description)</label>
                      <input
                        type="text"
                        value={editingPage.metaDescription || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200"
                        placeholder="Короткий опис сторінки для пошуковиків..."
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="page-active-cb"
                        checked={editingPage.isActive !== undefined ? editingPage.isActive : true}
                        onChange={(e) => setEditingPage({ ...editingPage, isActive: e.target.checked })}
                        className="w-4 h-4 rounded border-stone-800 bg-stone-950 accent-amber-400"
                      />
                      <label htmlFor="page-active-cb" className="text-xs font-bold text-stone-300 uppercase cursor-pointer select-none">
                        Опубліковано (Доступно на сайті)
                      </label>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Вміст сторінки (Content, підтримує Markdown)</label>
                      <textarea
                        rows={10}
                        value={editingPage.content || ''}
                        onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 leading-relaxed font-mono"
                        placeholder="## Секція 1&#10;Використовуйте стандартний синтаксис маркдаун для красивого відображення."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-stone-800">
                    <button
                      onClick={() => setEditingPage(null)}
                      className="px-4 py-2 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-400 rounded-lg transition-colors cursor-pointer"
                    >
                      Скасувати
                    </button>
                    <button
                      onClick={savePageForm}
                      className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-stone-950 text-xs font-black uppercase rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Зберегти сторінку</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 6: AD PLACEMENTS --- */}
        {activeSubTab === 'ads' && config && (
          <div className="space-y-8 animate-fadeIn" id="admin-ads-tab">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-stone-100 font-display flex items-center gap-2 border-b border-stone-800 pb-4">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Визначення місць під рекламу та банери
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {config.adPlacements.map((ad) => (
                  <div key={ad.id} className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-stone-100">{ad.name}</h4>
                        <span className="text-[10px] font-mono text-stone-500">ID: {ad.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${ad.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-stone-900 text-stone-500'}`}>
                          {ad.active ? 'АКТИВНИЙ' : 'ВИМКНЕНО'}
                        </span>
                        <input
                          type="checkbox"
                          checked={ad.active}
                          onChange={(e) => {
                            const updatedAds = config.adPlacements.map(a => a.id === ad.id ? { ...a, active: e.target.checked } : a);
                            setConfig({ ...config, adPlacements: updatedAds });
                          }}
                          className="w-4 h-4 rounded border-stone-800 bg-stone-950 accent-amber-400 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Зображення банера (URL)</span>
                        <input
                          type="text"
                          value={ad.imageUrl}
                          onChange={(e) => {
                            const updatedAds = config.adPlacements.map(a => a.id === ad.id ? { ...a, imageUrl: e.target.value } : a);
                            setConfig({ ...config, adPlacements: updatedAds });
                          }}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Посилання переходу (Target URL)</span>
                        <input
                          type="text"
                          value={ad.targetUrl}
                          onChange={(e) => {
                            const updatedAds = config.adPlacements.map(a => a.id === ad.id ? { ...a, targetUrl: e.target.value } : a);
                            setConfig({ ...config, adPlacements: updatedAds });
                          }}
                          className="w-full px-3 py-1.5 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 font-mono focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {ad.imageUrl && ad.active && (
                      <div className="pt-2">
                        <p className="text-[9px] text-stone-500 font-mono mb-1">Попередній перегляд банера:</p>
                        <div className="relative border border-stone-800 rounded overflow-hidden bg-stone-900 flex justify-center items-center p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={ad.imageUrl} 
                            alt="preview" 
                            className="max-h-16 object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-800">
                <button
                  onClick={() => handleSaveConfig(config)}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Зберегти рекламні банери</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 7: SEO SETTINGS --- */}
        {activeSubTab === 'seo' && config && (
          <div className="space-y-8 animate-fadeIn" id="admin-seo-tab">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg font-bold text-stone-100 font-display flex items-center gap-2 border-b border-stone-800 pb-4">
                <Settings className="w-5 h-5 text-amber-400" />
                Налаштування SEO (Мета-теги & Пошукова оптимізація)
              </h3>

              <p className="text-xs text-stone-400 leading-relaxed max-w-3xl">
                Тут ви можете налаштувати унікальні мета-теги для кожної категорії або сторінки нашого порталу. 
                Це дозволяє пошуковим системам (Google, Bing) краще індексувати ваш сайт та показувати привабливий опис у результатах пошуку.
              </p>

              {(() => {
                const seoCategories = [
                  { id: 'home', label: 'Головна сторінка' },
                  { id: 'dating', label: 'Оффери знайомств (Dating)' },
                  { id: 'livecams', label: 'Веб-камери (Live Cams)' },
                  { id: 'games', label: 'Дорослі ігри (Adult Games)' },
                  { id: 'news', label: 'Блог / Новини' },
                  { id: 'gallery-photos', label: 'Фотогалерея' },
                  { id: 'gallery-videos', label: 'Відеогалерея' },
                  { id: 'catalog', label: 'Каталог сайтів' },
                  { id: 'ads', label: 'Реклама' }
                ];

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Categories List */}
                    <div className="space-y-2 border-r border-stone-800/60 pr-0 md:pr-4">
                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold">Оберіть сторінку:</span>
                      <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-2 md:gap-1.5 pb-3 md:pb-0">
                        {seoCategories.map((cat) => {
                          const isCurrent = (config as any)._activeSeoTab === cat.id || cat.id === 'home' && !(config as any)._activeSeoTab;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setConfig({
                                  ...config,
                                  _activeSeoTab: cat.id
                                } as any);
                              }}
                              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap md:whitespace-normal cursor-pointer ${
                                isCurrent 
                                  ? 'bg-amber-400 text-stone-950 font-black shadow-md shadow-amber-500/10' 
                                  : 'text-stone-300 hover:bg-stone-800/50 hover:text-stone-100'
                              }`}
                            >
                              {cat.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* SEO Fields Editor */}
                    <div className="md:col-span-2 space-y-6">
                      {(() => {
                        const activeSeoTab = (config as any)._activeSeoTab || 'home';
                        const currentCat = seoCategories.find(c => c.id === activeSeoTab) || seoCategories[0];
                        const seoData = config.seo?.[activeSeoTab] || { title: '', description: '', keywords: '' };

                        return (
                          <div className="space-y-5 bg-stone-950/40 border border-stone-800/80 p-6 rounded-2xl animate-fadeIn" key={activeSeoTab}>
                            <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                              <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wider">{currentCat.label}</h4>
                              <span className="text-[10px] font-mono text-stone-500">ID: {activeSeoTab}</span>
                            </div>

                            <div className="space-y-4">
                              {/* Title Tag */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider flex justify-between">
                                  <span>Заголовок сторінки (Title Tag)</span>
                                  <span className="text-stone-500 font-mono text-[9px]">{seoData.title?.length || 0}/60 симв.</span>
                                </label>
                                <input
                                  type="text"
                                  value={seoData.title || ''}
                                  onChange={(e) => {
                                    const currentSeo = config.seo || {};
                                    setConfig({
                                      ...config,
                                      seo: {
                                        ...currentSeo,
                                        [activeSeoTab]: {
                                          ...seoData,
                                          title: e.target.value
                                        }
                                      }
                                    });
                                  }}
                                  placeholder="Введіть оптимізований title..."
                                  className="w-full px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-sans"
                                />
                                <span className="text-[10px] text-stone-500 block">Відображається в заголовку вкладки браузера та як синій заголовок у Google.</span>
                              </div>

                              {/* Meta Description */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider flex justify-between">
                                  <span>Опис сторінки (Meta Description)</span>
                                  <span className="text-stone-500 font-mono text-[9px]">{seoData.description?.length || 0}/160 симв.</span>
                                </label>
                                <textarea
                                  value={seoData.description || ''}
                                  onChange={(e) => {
                                    const currentSeo = config.seo || {};
                                    setConfig({
                                      ...config,
                                      seo: {
                                        ...currentSeo,
                                        [activeSeoTab]: {
                                          ...seoData,
                                          description: e.target.value
                                        }
                                      }
                                    });
                                  }}
                                  rows={3}
                                  placeholder="Введіть короткий опис сторінки для пошукових результатів..."
                                  className="w-full px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-sans resize-none"
                                />
                                <span className="text-[10px] text-stone-500 block">Короткий привабливий текст для пошукового сниппету в Google. Рекомендовано 120-160 символів.</span>
                              </div>

                              {/* Keywords */}
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">Ключові слова (Meta Keywords)</label>
                                <textarea
                                  value={seoData.keywords || ''}
                                  onChange={(e) => {
                                    const currentSeo = config.seo || {};
                                    setConfig({
                                      ...config,
                                      seo: {
                                        ...currentSeo,
                                        [activeSeoTab]: {
                                          ...seoData,
                                          keywords: e.target.value
                                        }
                                      }
                                    });
                                  }}
                                  rows={2}
                                  placeholder="adult dating, live cams, adult games, ..."
                                  className="w-full px-4 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                                />
                                <span className="text-[10px] text-stone-500 block">Розділяйте ключові слова комами (наприклад: adult dating, webcams, games).</span>
                              </div>

                              {/* 🤖 ШІ-ГЕНЕРАТОР SEO ВІД GEMINI */}
                              <div className="bg-stone-900/60 border border-amber-500/20 p-5 rounded-2xl space-y-4 mt-6">
                                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                    <h4 className="font-bold text-xs text-stone-100 uppercase tracking-wider">
                                      ШІ-Помічник Gemini (Генерація High-CTR SEO)
                                    </h4>
                                  </div>
                                  <span className="text-[9px] bg-amber-400/10 text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-400/20 uppercase font-bold">
                                    Gemini 3.5 Flash
                                  </span>
                                </div>

                                <p className="text-[11px] text-stone-400 leading-relaxed">
                                  Згенеруйте клікабельні, оптимізовані пошукові заголовки та описи з високим показником клікабельності (CTR) на основі вашого контенту.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {/* Type of item */}
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Джерело назви</label>
                                    <select
                                      value={seoGenType}
                                      onChange={(e) => setSeoGenType(e.target.value as any)}
                                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-400"
                                    >
                                      <option value="offer">Оффер (Dating/Cams/Games)</option>
                                      <option value="article">Новина / Стаття блогу</option>
                                      <option value="custom">Ввести власну назву</option>
                                    </select>
                                  </div>

                                  {/* Item Selection or Input */}
                                  <div className="space-y-1 sm:col-span-2">
                                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">
                                      {seoGenType === 'offer' && 'Оберіть оффер'}
                                      {seoGenType === 'article' && 'Оберіть статтю'}
                                      {seoGenType === 'custom' && 'Введіть назву / тему'}
                                    </label>

                                    {seoGenType === 'offer' && (
                                      <select
                                        value={seoGenSelectedId}
                                        onChange={(e) => setSeoGenSelectedId(e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-400"
                                      >
                                        <option value="">-- Оберіть оффер зі списку --</option>
                                        {config.offers?.map(o => (
                                          <option key={o.id} value={o.id}>{o.name}</option>
                                        ))}
                                      </select>
                                    )}

                                    {seoGenType === 'article' && (
                                      <select
                                        value={seoGenSelectedId}
                                        onChange={(e) => setSeoGenSelectedId(e.target.value)}
                                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-400"
                                      >
                                        <option value="">-- Оберіть статтю зі списку --</option>
                                        {config.newsArticles?.map(a => (
                                          <option key={a.id} value={a.id}>{a.title}</option>
                                        ))}
                                      </select>
                                    )}

                                    {seoGenType === 'custom' && (
                                      <input
                                        type="text"
                                        value={seoGenCustomName}
                                        onChange={(e) => setSeoGenCustomName(e.target.value)}
                                        placeholder="Наприклад: Знайомства для дорослих у Києві без реєстрації..."
                                        className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-200 focus:outline-none focus:border-amber-400 placeholder:text-stone-600"
                                      />
                                    )}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  {/* SEO Preset Template */}
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Пресет шаблону SEO</label>
                                    <select
                                      value={seoPreset}
                                      onChange={(e) => {
                                        const nextPreset = e.target.value as any;
                                        setSeoPreset(nextPreset);
                                        if (nextPreset === 'Aggressive') {
                                          setSeoGenTone('Клікбейт / High-CTR (найбільш привабливий)');
                                        } else if (nextPreset === 'Informative') {
                                          setSeoGenTone('Професійний / Описовий (безпечний)');
                                        } else {
                                          setSeoGenTone('Провокаційний / Сексуальний (для дорослих)');
                                        }
                                      }}
                                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-400"
                                    >
                                      <option value="Standard">Standard (Стандартний)</option>
                                      <option value="Aggressive">Aggressive (Агресивний / Клікбейт)</option>
                                      <option value="Informative">Informative (Інформативний / Описовий)</option>
                                    </select>
                                  </div>

                                  {/* Copy strategy / tone */}
                                  <div className="space-y-1">
                                    <label className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block">Стратегія та тон копірайтингу</label>
                                    <select
                                      value={seoGenTone}
                                      onChange={(e) => setSeoGenTone(e.target.value)}
                                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-lg text-xs text-stone-300 focus:outline-none focus:border-amber-400"
                                    >
                                      <option value="Клікбейт / High-CTR (найбільш привабливий)">Клікбейт / High-CTR (найбільш привабливий)</option>
                                      <option value="Провокаційний / Сексуальний (для дорослих)">Провокаційний / Сексуальний (для дорослих)</option>
                                      <option value="Професійний / Описовий (безпечний)">Професійний / Описовий (безпечний)</option>
                                      <option value="Спеціальна акція / Бонуси та призи">Спеціальна акція / Бонуси та призи</option>
                                    </select>
                                  </div>

                                  {/* Action button */}
                                  <div className="flex items-end">
                                    <button
                                      type="button"
                                      disabled={seoGenerating}
                                      onClick={generateSeoWithGemini}
                                      className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold py-2 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/5 disabled:opacity-50"
                                    >
                                      <Sparkles className={`w-3.5 h-3.5 ${seoGenerating ? 'animate-spin' : ''}`} />
                                      {seoGenerating ? 'Звернення до ШІ...' : 'Згенерувати варіанти'}
                                    </button>
                                  </div>
                                </div>

                                {seoGenError && (
                                  <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-[11px] text-red-400">
                                    {seoGenError}
                                  </div>
                                )}

                                {seoSuggestions && (
                                  <div className="border-t border-stone-800 pt-4 space-y-4 animate-fadeIn">
                                    <h5 className="font-bold text-xs text-amber-400 uppercase tracking-widest">
                                      ✨ Згенеровані ШІ-варіанти:
                                    </h5>

                                    <div className="space-y-3">
                                      {seoSuggestions.suggestions.map((sug: any, idx: number) => (
                                        <div 
                                          key={idx} 
                                          className="p-4 bg-stone-950/70 border border-stone-800 hover:border-amber-500/30 rounded-xl space-y-2.5 transition-all text-xs"
                                        >
                                          <div className="flex justify-between items-center border-b border-stone-900 pb-2">
                                            <span className="font-mono text-[10px] text-stone-400 font-bold">Варіант #{idx + 1}</span>
                                            <span className="text-[10px] text-emerald-400 font-medium">CTR Оцінка: Висока</span>
                                          </div>

                                          <div className="space-y-1">
                                            <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">SEO Title (Заголовок):</div>
                                            <div className="text-stone-200 font-semibold bg-stone-900/50 p-2 rounded border border-stone-800/40 flex justify-between items-center gap-2">
                                              <span>{sug.title}</span>
                                              <span className="text-[9px] text-stone-500 font-mono shrink-0">{sug.title.length}/60</span>
                                            </div>
                                          </div>

                                          <div className="space-y-1">
                                            <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">Meta Description (Опис):</div>
                                            <div className="text-stone-300 bg-stone-900/50 p-2 rounded border border-stone-800/40 space-y-1 leading-relaxed">
                                              <p>{sug.description}</p>
                                              <div className="text-[9px] text-stone-500 font-mono text-right">{sug.description.length}/160</div>
                                            </div>
                                          </div>

                                          <div className="text-[10px] bg-amber-400/5 p-2 rounded border border-amber-400/10 text-stone-400 leading-relaxed">
                                            <strong className="text-amber-400">ШІ коментар:</strong> {sug.explanation}
                                          </div>

                                          <div className="flex flex-wrap gap-2 pt-1">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const currentSeo = config.seo || {};
                                                setConfig({
                                                  ...config,
                                                  seo: {
                                                    ...currentSeo,
                                                    [activeSeoTab]: {
                                                      ...seoData,
                                                      title: sug.title
                                                    }
                                                  }
                                                });
                                              }}
                                              className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                                            >
                                              Застосувати Title
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const currentSeo = config.seo || {};
                                                setConfig({
                                                  ...config,
                                                  seo: {
                                                    ...currentSeo,
                                                    [activeSeoTab]: {
                                                      ...seoData,
                                                      description: sug.description
                                                    }
                                                  }
                                                });
                                              }}
                                              className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                                            >
                                              Застосувати Description
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const currentSeo = config.seo || {};
                                                setConfig({
                                                  ...config,
                                                  seo: {
                                                    ...currentSeo,
                                                    [activeSeoTab]: {
                                                      ...seoData,
                                                      title: sug.title,
                                                      description: sug.description
                                                    }
                                                  }
                                                });
                                              }}
                                              className="bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 px-3 py-1.5 rounded-md text-[10px] font-black cursor-pointer border border-amber-400/20 transition-colors"
                                            >
                                              Застосувати все разом
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {seoSuggestions.suggestedKeywords && seoSuggestions.suggestedKeywords.length > 0 && (
                                      <div className="p-4 bg-stone-950/40 border border-stone-800 rounded-xl space-y-2 text-xs">
                                        <div className="text-[10px] font-mono text-stone-500 uppercase font-bold">Рекомендовані ключові слова:</div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {seoSuggestions.suggestedKeywords.map((kw: string, i: number) => (
                                            <span 
                                              key={i} 
                                              className="bg-stone-900 border border-stone-800 px-2 py-1 rounded-md font-mono text-[10px] text-stone-300"
                                            >
                                              {kw}
                                            </span>
                                          ))}
                                        </div>
                                        <div className="pt-2">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const currentSeo = config.seo || {};
                                              const newKws = seoSuggestions.suggestedKeywords.join(', ');
                                              setConfig({
                                                ...config,
                                                seo: {
                                                  ...currentSeo,
                                                  [activeSeoTab]: {
                                                    ...seoData,
                                                    keywords: seoData.keywords 
                                                      ? `${seoData.keywords}, ${newKws}`
                                                      : newKws
                                                  }
                                                }
                                              });
                                            }}
                                            className="bg-stone-900 hover:bg-stone-850 text-stone-200 px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                                          >
                                            Додати ключові слова до списку
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* SEO Preview Card */}
                              <div className="border-t border-stone-800/80 pt-6 mt-6 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div>
                                    <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                                      <Eye className="w-4 h-4 text-amber-400" />
                                      Інтерактивний попередній перегляд Google SERP
                                    </h4>
                                    <p className="text-[10px] text-stone-500">
                                      Візуальна симуляція результату в пошуковій системі.
                                    </p>
                                  </div>
                                  
                                  {/* Controls */}
                                  <div className="flex items-center gap-2">
                                    {/* Device Toggle */}
                                    <div className="bg-stone-900 border border-stone-800 p-0.5 rounded-lg flex">
                                      <button
                                        type="button"
                                        onClick={() => setSeoDevice('desktop')}
                                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                          seoDevice === 'desktop' 
                                            ? 'bg-amber-400 text-stone-950' 
                                            : 'text-stone-400 hover:text-stone-200'
                                        }`}
                                        title="Десктопний вигляд"
                                      >
                                        <Laptop className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSeoDevice('mobile')}
                                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                          seoDevice === 'mobile' 
                                            ? 'bg-amber-400 text-stone-950' 
                                            : 'text-stone-400 hover:text-stone-200'
                                        }`}
                                        title="Мобільний вигляд"
                                      >
                                        <Smartphone className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {/* Theme Toggle */}
                                    <div className="bg-stone-900 border border-stone-800 p-0.5 rounded-lg flex text-[10px] font-bold font-mono">
                                      <button
                                        type="button"
                                        onClick={() => setSeoTheme('light')}
                                        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                                          seoTheme === 'light' 
                                            ? 'bg-stone-800 text-stone-200 border border-stone-700/50' 
                                            : 'text-stone-500 hover:text-stone-300'
                                        }`}
                                      >
                                        Light
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSeoTheme('dark')}
                                        className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                                          seoTheme === 'dark' 
                                            ? 'bg-stone-800 text-stone-200 border border-stone-700/50' 
                                            : 'text-stone-500 hover:text-stone-300'
                                        }`}
                                      >
                                        Dark
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Length Health Indicators */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {/* Title Health */}
                                  {(() => {
                                    const titleLen = seoData.title?.length || 0;
                                    let color = 'bg-stone-700';
                                    let text = 'Порожній заголовок';
                                    let textColor = 'text-stone-400';
                                    if (titleLen > 0 && titleLen < 40) {
                                      color = 'bg-amber-500';
                                      text = 'Занадто короткий заголовок';
                                      textColor = 'text-amber-400';
                                    } else if (titleLen >= 40 && titleLen <= 60) {
                                      color = 'bg-emerald-500';
                                      text = 'Ідеальна довжина заголовку';
                                      textColor = 'text-emerald-400';
                                    } else if (titleLen > 60) {
                                      color = 'bg-rose-500';
                                      text = 'Занадто довгий заголовок (обріжеться)';
                                      textColor = 'text-rose-400';
                                    }
                                    const percentage = Math.min((titleLen / 60) * 100, 100);

                                    return (
                                      <div className="bg-stone-900/60 border border-stone-800/60 p-3 rounded-xl space-y-2">
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="font-bold text-stone-400 uppercase">Довжина Title:</span>
                                          <span className={`font-mono font-bold ${textColor}`}>{titleLen} / 60 симв.</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                                          <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${percentage}%` }} />
                                        </div>
                                        <p className="text-[9px] text-stone-500 font-sans">{text}</p>
                                      </div>
                                    );
                                  })()}

                                  {/* Description Health */}
                                  {(() => {
                                    const descLen = seoData.description?.length || 0;
                                    let color = 'bg-stone-700';
                                    let text = 'Порожній опис';
                                    let textColor = 'text-stone-400';
                                    if (descLen > 0 && descLen < 110) {
                                      color = 'bg-amber-500';
                                      text = 'Занадто короткий опис';
                                      textColor = 'text-amber-400';
                                    } else if (descLen >= 110 && descLen <= 160) {
                                      color = 'bg-emerald-500';
                                      text = 'Ідеальна довжина опису';
                                      textColor = 'text-emerald-400';
                                    } else if (descLen > 160) {
                                      color = 'bg-rose-500';
                                      text = 'Занадто довгий опис (обріжеться)';
                                      textColor = 'text-rose-400';
                                    }
                                    const percentage = Math.min((descLen / 160) * 100, 100);

                                    return (
                                      <div className="bg-stone-900/60 border border-stone-800/60 p-3 rounded-xl space-y-2">
                                        <div className="flex justify-between items-center text-[10px]">
                                          <span className="font-bold text-stone-400 uppercase">Довжина Description:</span>
                                          <span className={`font-mono font-bold ${textColor}`}>{descLen} / 160 симв.</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                                          <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${percentage}%` }} />
                                        </div>
                                        <p className="text-[9px] text-stone-500 font-sans">{text}</p>
                                      </div>
                                    );
                                  })()}
                                </div>

                                {/* Actual Google Result Snippet Card */}
                                {(() => {
                                  const truncate = (str: string, max: number) => {
                                    if (!str) return '';
                                    return str.length > max ? str.substring(0, max - 3) + '...' : str;
                                  };

                                  const displayTitle = seoData.title || 'Введіть заголовок сторінки...';
                                  const displayDesc = seoData.description || 'Введіть опис сторінки, щоб побачити як він виглядатиме в пошуку Google...';

                                  const isLight = seoTheme === 'light';
                                  const isMobile = seoDevice === 'mobile';

                                  const bgColor = isLight ? 'bg-white' : 'bg-[#202124]';
                                  const borderColor = isLight ? 'border-[#dadce0]' : 'border-[#303134]';
                                  const siteNameColor = isLight ? 'text-[#202124]' : 'text-[#e8eaed]';
                                  const urlColor = isLight ? 'text-[#4d5156]' : 'text-[#bdc1c6]';
                                  const titleColor = isLight ? 'text-[#1a0dab]' : 'text-[#8ab4f8]';
                                  const snippetColor = isLight ? 'text-[#4d5156]' : 'text-[#bdc1c6]';

                                  const siteLogoText = config.texts?.logoText || 'Private Dating';
                                  const slugPath = activeSeoTab === 'home' ? '' : ` › ${activeSeoTab}`;

                                  if (isMobile) {
                                    return (
                                      <div className={`${bgColor} border ${borderColor} rounded-2xl p-4 transition-all duration-300 shadow-sm max-w-[390px] mx-auto text-left font-sans`}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isLight ? 'bg-[#f1f3f4]' : 'bg-[#303134]'}`}>
                                            <Globe className={`w-3.5 h-3.5 ${isLight ? 'text-stone-600' : 'text-stone-300'}`} />
                                          </div>
                                          <div className="flex flex-col leading-tight">
                                            <span className={`text-[12px] font-bold ${siteNameColor}`}>{siteLogoText}</span>
                                            <span className={`text-[10px] ${urlColor} truncate`}>https://privatedatinghub.com{slugPath}</span>
                                          </div>
                                        </div>
                                        <h4 className={`text-[18px] font-medium leading-tight ${titleColor} cursor-pointer hover:underline`}>
                                          {truncate(displayTitle, 65)}
                                        </h4>
                                        <p className={`text-[12px] leading-relaxed mt-1 ${snippetColor}`}>
                                          {truncate(displayDesc, 155)}
                                        </p>
                                      </div>
                                    );
                                  }

                                  return (
                                    <div className={`${bgColor} border ${borderColor} rounded-2xl p-5 md:p-6 transition-all duration-300 shadow-sm text-left font-sans`}>
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center ${isLight ? 'bg-[#f1f3f4]' : 'bg-[#303134]'}`}>
                                          <Globe className={`w-3 h-3 ${isLight ? 'text-stone-600' : 'text-stone-300'}`} />
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[12px] leading-tight">
                                          <span className={`font-medium ${siteNameColor}`}>{siteLogoText}</span>
                                          <span className={`${urlColor}`}>https://privatedatinghub.com{slugPath}</span>
                                        </div>
                                      </div>
                                      <h4 className={`text-[20px] font-medium leading-tight ${titleColor} cursor-pointer hover:underline`}>
                                        {truncate(displayTitle, 65)}
                                      </h4>
                                      <p className={`text-[13px] leading-relaxed mt-1 ${snippetColor} max-w-[600px]`}>
                                        {truncate(displayDesc, 158)}
                                      </p>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                );
              })()}

              <div className="flex justify-end pt-4 border-t border-stone-800">
                <button
                  onClick={() => {
                    const savePayload = { ...config };
                    delete (savePayload as any)._activeSeoTab;
                    handleSaveConfig(savePayload);
                  }}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 disabled:bg-stone-800 text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Зберегти налаштування SEO</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
