'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Eye, 
  Check, 
  MessageSquare, 
  Send, 
  VolumeX, 
  Volume2, 
  Play, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Calendar,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Offer, CatalogItem, NewsArticle, NEWS_ARTICLES } from '../lib/data';

interface ModalsProps {
  selectedOffer: Offer | null;
  setSelectedOffer: (offer: Offer | null) => void;
  reviews: { [offerId: string]: any[] };
  newComment: { author: string; rating: number; text: string };
  setNewComment: (comment: { author: string; rating: number; text: string }) => void;
  handleAddComment: (offerId: string) => void;
  
  activeVideo: CatalogItem | null;
  setActiveVideo: (video: CatalogItem | null) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  
  activePhoto: CatalogItem | null;
  setActivePhoto: (photo: CatalogItem | null) => void;
  catalogItems?: CatalogItem[];

  selectedNewsArticle: NewsArticle | null;
  setSelectedNewsArticle: (article: NewsArticle | null) => void;
}

export default function Modals({
  selectedOffer,
  setSelectedOffer,
  reviews,
  newComment,
  setNewComment,
  handleAddComment,
  activeVideo,
  setActiveVideo,
  isMuted,
  setIsMuted,
  isPlaying,
  setIsPlaying,
  activePhoto,
  setActivePhoto,
  catalogItems = [],
  selectedNewsArticle,
  setSelectedNewsArticle,
}: ModalsProps) {
  // Photos filtering and index finding
  const photos = React.useMemo(() => {
    return (catalogItems || []).filter((item) => item.type === 'photo');
  }, [catalogItems]);

  const currentIndex = React.useMemo(() => {
    if (!activePhoto) return -1;
    return photos.findIndex((p) => p.id === activePhoto.id);
  }, [activePhoto, photos]);

  const [zoomLevel, setZoomLevel] = React.useState<number>(1);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = React.useState(false);

  const [newsScrollProgress, setNewsScrollProgress] = React.useState<number>(0);

  // Reset progress when selectedNewsArticle changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setNewsScrollProgress(0);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedNewsArticle]);

  const selectPhoto = React.useCallback((photo: CatalogItem | null) => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setHasMoved(false);
    setActivePhoto(photo);
  }, [setActivePhoto]);

  const handlePrev = React.useCallback(() => {
    if (photos.length === 0 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    selectPhoto(photos[prevIndex]);
  }, [photos, currentIndex, selectPhoto]);

  const handleNext = React.useCallback(() => {
    if (photos.length === 0 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    selectPhoto(photos[nextIndex]);
  }, [photos, currentIndex, selectPhoto]);

  React.useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        selectPhoto(null);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhoto, handlePrev, handleNext, selectPhoto]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel === 1) return;
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    if (Math.abs(newX - panOffset.x) > 2 || Math.abs(newY - panOffset.y) > 2) {
      setHasMoved(true);
    }
    
    setPanOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel === 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    if (Math.abs(newX - panOffset.x) > 2 || Math.abs(newY - panOffset.y) > 2) {
      setHasMoved(true);
    }
    
    setPanOffset({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMoved) return;
    
    if (zoomLevel > 1) {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    } else {
      setZoomLevel(2);
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 3.5));
  };

  const zoomOut = () => {
    setZoomLevel(prev => {
      const nextZoom = Math.max(prev - 0.5, 1);
      if (nextZoom === 1) {
        setPanOffset({ x: 0, y: 0 });
      }
      return nextZoom;
    });
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <>
      {/* 1. OFFER DETAIL MODAL */}
      <AnimatePresence>
        {selectedOffer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-y-auto">
            {/* Click outside to close */}
            <div className="fixed inset-0 -z-10 cursor-default" onClick={() => setSelectedOffer(null)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="max-w-2xl w-full bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
              id="offer-detail-modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedOffer(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer z-20"
                id="close-offer-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                
                {/* Header info */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 shrink-0">
                    <Image 
                      src={selectedOffer.imageUrl} 
                      alt={selectedOffer.name} 
                      fill 
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black font-display text-amber-400 flex flex-wrap items-center gap-2">
                      <span>{selectedOffer.name}</span>
                      {selectedOffer.rating >= 4.8 && (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/25 font-bold uppercase tracking-wider text-[10px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          Verified Trusted
                        </span>
                      )}
                    </h2>
                    <div className="text-xs text-stone-400 font-mono flex flex-wrap items-center gap-2 mt-1">
                      <span>Category: {selectedOffer.category === 'dating' ? 'Dating & Romance' : selectedOffer.category === 'livecams' ? 'Live Cams' : 'Adult Games'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {selectedOffer.views.toLocaleString()} views
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banner image or graphic */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden bg-stone-950">
                  <Image 
                    src={selectedOffer.imageUrl} 
                    alt={selectedOffer.name} 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent" />
                </div>

                {/* Detailed description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider font-mono">Platform Overview</h4>
                  <p className="text-sm text-stone-200 leading-relaxed">
                    {selectedOffer.fullDesc}
                  </p>
                </div>

                {/* Checklist & Pros */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-950/40 p-4 rounded-xl border border-stone-800 space-y-2">
                    <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">Key Features</h5>
                    <ul className="space-y-1.5">
                      {selectedOffer.features.map((feat, i) => (
                        <li key={i} className="text-xs text-stone-300 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-stone-950/40 p-4 rounded-xl border border-stone-800 space-y-2">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">Why Join This Platform</h5>
                    <ul className="space-y-1.5">
                      {selectedOffer.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-stone-300 flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Registration CTA */}
                <div className="pt-2">
                  <a
                    href={selectedOffer.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-center rounded-xl transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 uppercase tracking-wider text-sm cursor-pointer"
                    id="modal-cta-registration-link"
                  >
                    Go To Registration
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[10px] text-stone-500 text-center mt-2">
                    🔒 Secure connection. Registration is free and confidential.
                  </p>
                </div>

                {/* USER REVIEWS SECTION */}
                <div className="space-y-4 border-t border-stone-800 pt-6">
                  <h4 className="text-sm font-bold text-stone-200 font-display flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    Reviews & Discussion ({reviews[selectedOffer.id]?.length || 0})
                  </h4>

                  {/* Comment input form */}
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3">
                    <h5 className="text-xs font-bold text-stone-300">Submit Anonymous Review</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        placeholder="Your Nickname"
                        value={newComment.author}
                        onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                        className="p-2 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 focus:outline-none focus:border-amber-400"
                        id="comment-author-input"
                      />
                      <select
                        value={newComment.rating}
                        onChange={(e) => setNewComment({ ...newComment, rating: parseInt(e.target.value) })}
                        className="p-2 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer animate-none"
                        id="comment-rating-input"
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                      </select>
                    </div>
                    <textarea 
                      placeholder="Share your experience regarding matchmaking rate, chat security, or streaming speeds..."
                      rows={2}
                      value={newComment.text}
                      onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                      className="w-full p-2 bg-stone-900 border border-stone-800 rounded text-xs text-stone-200 focus:outline-none focus:border-amber-400 resize-none"
                      id="comment-text-textarea"
                    />
                    <button
                      onClick={() => handleAddComment(selectedOffer.id)}
                      className="py-1.5 px-4 bg-cyan-400 hover:bg-cyan-300 text-stone-950 font-bold rounded text-xs transition-all flex items-center gap-1 cursor-pointer ml-auto"
                      id="submit-comment-btn"
                    >
                      Publish Review
                      <Send className="w-3 h-3" />
                    </button>
                  </div>

                  {/* List of comments */}
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {(!reviews[selectedOffer.id] || reviews[selectedOffer.id].length === 0) ? (
                      <p className="text-xs text-stone-500 text-center py-4">No reviews filed yet. Be the first to publish one!</p>
                    ) : (
                      reviews[selectedOffer.id].map((rev) => (
                        <div key={rev.id} className="bg-stone-950/60 p-3 rounded-lg border border-stone-800/60 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-stone-300">{rev.author}</span>
                            <span className="text-stone-500 text-[10px] font-mono">{rev.date}</span>
                          </div>
                          <div className="text-amber-400 text-[10px]">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          </div>
                          <p className="text-xs text-stone-400 leading-relaxed">{rev.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. VIDEO PLAYER LIGHTBOX */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-sm">
            <div className="fixed inset-0 -z-10" onClick={() => setActiveVideo(null)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              {/* Close and Controls Top */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-stone-950/70 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-800/40"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-full bg-stone-950/70 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-800/40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Element */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={activeVideo.mediaUrl}
                  autoPlay={isPlaying}
                  loop
                  muted={isMuted}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => setIsPlaying(!isPlaying)}
                />
                
                {/* Play/Pause state overlay indicator */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                    <Play className="w-16 h-16 text-amber-400 fill-amber-400" />
                  </div>
                )}
              </div>

              {/* Video metadata and specs */}
              <div className="p-6 space-y-2 bg-stone-900">
                <h3 className="text-lg font-bold text-stone-100 font-display">
                  {activeVideo.title}
                </h3>
                <div className="flex flex-wrap gap-2 items-center text-xs text-stone-400 font-mono">
                  <span className="text-amber-400 font-semibold">Duration: {activeVideo.duration}</span>
                  <span>•</span>
                  <span>👁️ {activeVideo.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>👍 {activeVideo.likes} Likes</span>
                </div>
                <div className="flex flex-wrap gap-1 pt-2">
                  {activeVideo.tags.map((t, i) => (
                    <span key={i} className="text-[10px] text-stone-400 bg-stone-800 px-2.5 py-0.5 rounded border border-stone-800/60 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PHOTO VIEW LIGHTBOX */}
      <AnimatePresence>
        {activePhoto && (
          <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-stone-950/98 backdrop-blur-md select-none p-4"
            onClick={() => selectPhoto(null)}
            id="lightbox-container"
          >
            {/* Top Bar with counter and close button */}
            <div className="w-full flex items-center justify-between max-w-5xl z-20" onClick={(e) => e.stopPropagation()}>
              <div className="bg-stone-900/80 border border-stone-800/80 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-amber-400">
                📷 {currentIndex !== -1 ? `${currentIndex + 1} OF ${photos.length}` : 'GALLERY'}
              </div>
              <div className="flex items-center gap-2">
                {/* Info Tip (Desktop) */}
                <span className="hidden md:inline-block text-[10px] font-mono text-stone-500 uppercase tracking-widest bg-stone-900/40 px-3 py-1.5 rounded-lg border border-stone-800/40">
                  💡 Drag to Pan • Arrow Keys Navigate
                </span>
                <button
                  onClick={() => selectPhoto(null)}
                  className="p-2 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  id="close-lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Viewport with Image & Nav Arrows */}
            <div 
              className="relative w-full flex-1 flex items-center justify-center overflow-hidden my-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              {photos.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-4 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Previous (Left Arrow)"
                  id="prev-photo-btn"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {photos.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 z-20 p-3 rounded-full bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-amber-400 transition-all cursor-pointer shadow-lg active:scale-95"
                  title="Next (Right Arrow)"
                  id="next-photo-btn"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Main Image Container */}
              <div 
                className="relative w-full h-full flex items-center justify-center cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="relative max-w-[90%] max-h-[80%] aspect-auto w-full h-full transition-transform duration-200 ease-out select-none"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
                  }}
                  onClick={handleImageClick}
                >
                  <Image
                    src={activePhoto.thumbnailUrl}
                    alt={activePhoto.title}
                    fill
                    className="object-contain pointer-events-none"
                    referrerPolicy="no-referrer"
                    priority
                  >
                  </Image>
                </div>
              </div>
            </div>

            {/* Bottom Panel with Details and Zoom Controls */}
            <div 
              className="w-full max-w-4xl bg-stone-900/90 border border-stone-800/80 rounded-2xl p-4 md:p-6 shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              onClick={(e) => e.stopPropagation()}
              id="lightbox-details-panel"
            >
              {/* Left Column: Title & Tags */}
              <div className="md:col-span-7 space-y-2 text-left">
                <h3 className="text-sm md:text-base font-bold text-stone-100 font-display line-clamp-1">
                  {activePhoto.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {activePhoto.tags.map((t, i) => (
                    <span key={i} className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/20">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Stats & Zoom Controls */}
              <div className="md:col-span-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t md:border-t-0 border-stone-800/60 pt-3 md:pt-0">
                <div className="flex items-center gap-4 text-xs text-stone-400 font-mono">
                  <span>👍 {activePhoto.likes} Likes</span>
                  <span>👁️ {activePhoto.views.toLocaleString('en-US')} Views</span>
                </div>

                {/* Zoom Controls Bar */}
                <div className="flex items-center gap-1.5 bg-stone-950/80 border border-stone-800/60 rounded-xl p-1 shrink-0">
                  <button
                    onClick={zoomOut}
                    disabled={zoomLevel === 1}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                    title="Zoom Out"
                    id="zoom-out-btn"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-stone-400 px-2 select-none min-w-[44px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    disabled={zoomLevel >= 3.5}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                    title="Zoom In"
                    id="zoom-in-btn"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  {zoomLevel > 1 && (
                    <button
                      onClick={resetZoom}
                      className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-stone-900 transition-colors cursor-pointer"
                      title="Reset Zoom"
                      id="reset-zoom-btn"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. NEWS ARTICLE VIEW MODAL */}
      <AnimatePresence>
        {selectedNewsArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md overflow-hidden">
            {/* Click outside to close */}
            <div className="fixed inset-0 -z-10 cursor-default" onClick={() => setSelectedNewsArticle(null)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="max-w-3xl w-full bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Reading progress bar */}
              <div className="w-full h-[4px] bg-stone-950/60 z-30 overflow-hidden shrink-0">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-150"
                  style={{ width: `${newsScrollProgress}%` }}
                />
              </div>

              {/* Close Button - fixed in the top right corner of the card, slightly offset */}
              <button
                onClick={() => setSelectedNewsArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-950/60 border border-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer z-30"
                id="close-news-modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable content viewport */}
              <div 
                onScroll={(e) => {
                  const target = e.currentTarget;
                  const totalHeight = target.scrollHeight - target.clientHeight;
                  if (totalHeight > 0) {
                    setNewsScrollProgress((target.scrollTop / totalHeight) * 100);
                  }
                }}
                className="flex-1 overflow-y-auto p-6 md:p-8 pt-8 custom-scrollbar space-y-6 text-left"
                id="news-article-modal"
              >
                
                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="bg-cyan-950 border border-cyan-500/30 text-cyan-400 py-1 px-2.5 rounded font-bold uppercase tracking-wider text-[10px]">
                    {selectedNewsArticle.category}
                  </span>
                  <span className="text-stone-500">•</span>
                  <span className="text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    {selectedNewsArticle.date}
                  </span>
                  <span className="text-stone-500">•</span>
                  <span className="text-stone-400 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-stone-500" />
                    {selectedNewsArticle.views.toLocaleString()} reads
                  </span>
                </div>

                {/* Main Heading */}
                <h2 className="text-2xl md:text-3xl font-black font-display text-stone-100 tracking-tight leading-tight">
                  {selectedNewsArticle.title}
                </h2>

                {/* Article Image */}
                <div className="relative h-56 md:h-72 w-full rounded-xl overflow-hidden bg-stone-950 border border-stone-800">
                  <Image 
                    src={selectedNewsArticle.imageUrl} 
                    alt={selectedNewsArticle.title} 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Excerpt */}
                <div className="border-l-4 border-amber-500 pl-4 py-1">
                  <p className="text-sm font-sans font-medium text-stone-300 italic leading-relaxed">
                    {selectedNewsArticle.excerpt}
                  </p>
                </div>

                {/* Content */}
                <div className="text-sm md:text-base text-stone-200 leading-relaxed space-y-4">
                  {selectedNewsArticle.content.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>

                {/* Social Share Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-950/40 border border-stone-800/80 mt-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-stone-200 font-display">Spread the word</p>
                    <p className="text-[11px] text-stone-500 font-sans">Share this adult industry insight with your network.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://adult-portal.com/news/${selectedNewsArticle.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-lg text-xs font-bold font-mono border border-blue-500/20 transition-all cursor-pointer"
                      title="Share on Facebook"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                      </svg>
                      Facebook
                    </a>
                    {/* Reddit */}
                    <a
                      href={`https://www.reddit.com/submit?url=${encodeURIComponent(`https://adult-portal.com/news/${selectedNewsArticle.id}`)}&title=${encodeURIComponent(selectedNewsArticle.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 hover:text-orange-300 rounded-lg text-xs font-bold font-mono border border-orange-500/20 transition-all cursor-pointer"
                      title="Share on Reddit"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.64-6.29-1.72l1.3-4.08 4.22.92c.04.83.72 1.49 1.56 1.49 1.1 0 1.99-.89 1.99-1.99s-.89-1.99-1.99-1.99c-.83 0-1.52.51-1.8 1.23l-4.72-1.03c-.22-.04-.44.08-.51.3l-1.52 4.77C5.37 7.42 3.1 8.06 1.42 9.08 1.1 8.35.37 7.84-.5 7.84c-1.65 0-3 1.35-3 3 0 .96.48 1.86 1.24 2.42-.07.38-.1.77-.1 1.17 0 3.86 4.43 7 9.86 7s9.86-3.14 9.86-7c0-.4-.03-.79-.1-1.17.76-.56 1.24-1.46 1.24-2.42zm-16.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm8.9 4.38c-.73.73-2.1 1.12-3.4 1.12s-2.67-.38-3.4-1.12c-.2-.2-.2-.51 0-.71.2-.2.51-.2.71 0 .53.53 1.62.83 2.69.83s2.16-.3 2.69-.83c.2-.2.51-.2.71 0 .2.2.2.51 0 .71zm-.4-2.88c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                      </svg>
                      Reddit
                    </a>
                    {/* Telegram */}
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(`https://adult-portal.com/news/${selectedNewsArticle.id}`)}&text=${encodeURIComponent(selectedNewsArticle.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 hover:text-sky-300 rounded-lg text-xs font-bold font-mono border border-sky-500/20 transition-all cursor-pointer"
                      title="Share on Telegram"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.53-1.35.52-.42-.01-1.23-.24-1.83-.43-.74-.24-1.33-.37-1.28-.79.03-.22.33-.45.91-.69 3.56-1.55 5.93-2.57 7.12-3.07 3.39-1.4 4.09-1.64 4.55-1.65.1 0 .33.02.48.15.12.1.16.24.18.35.02.13.02.26.01.39z" />
                      </svg>
                      Telegram
                    </a>
                  </div>
                </div>

                {/* Related News Section */}
                <div className="pt-8 border-t border-stone-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold uppercase tracking-widest text-amber-400 font-mono flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      Related News
                    </h4>
                    <span className="text-[10px] text-stone-500 font-mono uppercase">You might also like</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      const others = NEWS_ARTICLES.filter(art => art.id !== selectedNewsArticle.id);
                      const sorted = [...others].sort((a, b) => {
                        const aMatch = a.category === selectedNewsArticle.category ? 1 : 0;
                        const bMatch = b.category === selectedNewsArticle.category ? 1 : 0;
                        return bMatch - aMatch;
                      });
                      const suggestions = sorted.slice(0, 2);

                      return suggestions.map((art) => (
                        <div 
                          key={art.id}
                          onClick={() => {
                            // Smoothly switch to the related article in-modal
                            setSelectedNewsArticle(art);
                            // Scroll modal to top
                            const modal = document.getElementById('news-article-modal');
                            if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="bg-stone-950/60 hover:bg-stone-950 border border-stone-800/80 hover:border-stone-700/80 rounded-xl p-4 flex gap-3 cursor-pointer group transition-all"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-stone-800/40">
                            <Image 
                              src={art.imageUrl} 
                              alt={art.title} 
                              fill 
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between text-left">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[9px] font-mono">
                                <span className="text-cyan-400 font-bold uppercase">{art.category}</span>
                                <span className="text-stone-500">{art.date}</span>
                              </div>
                              <h5 className="text-xs font-bold text-stone-200 line-clamp-2 group-hover:text-amber-400 transition-colors">
                                {art.title}
                              </h5>
                            </div>
                            <span className="text-[10px] font-mono text-stone-500 flex items-center gap-0.5 mt-1 group-hover:text-stone-300 transition-colors">
                              Read <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
