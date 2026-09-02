import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { ArrowLeft, Volume2, VolumeX, Timer, RefreshCw, AlertCircle, Globe, ShieldCheck, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProxyInfo } from '../types';

const LOCATIONS = [
  { name: 'NEW YORK, US', flag: '🇺🇸' },
  { name: 'LONDON, UK', flag: '🇬🇧' },
  { name: 'TOKYO, JP', flag: '🇯🇵' },
  { name: 'FRANKFURT, DE', flag: '🇩🇪' },
  { name: 'SINGAPORE, SG', flag: '🇸🇬' },
  { name: 'SYDNEY, AU', flag: '🇦🇺' },
  { name: 'PARIS, FR', flag: '🇫🇷' },
  { name: 'MUMBAI, IN', flag: '🇮🇳' }
];

function getYouTubeId(url: string) {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

const getBrowserUrl = (input: string, sessionKey: string) => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const trimmedInput = input.trim();

  // URL detection
  if (trimmedInput.includes('.') && !trimmedInput.includes(' ')) {
    const url = trimmedInput.startsWith('http') ? trimmedInput : `https://${trimmedInput}`;
    
    // Google Search is better handled with igu=1 directly
    if (url.includes('google.com') && !url.includes('search')) {
      return `https://www.google.com/search?q=google&igu=1`;
    }

    // Default to Proxy Engine to bypass X-Frame-Options for ALL sites
    return `${origin}/api/browse?url=${encodeURIComponent(url)}&session=${sessionKey}`;
  }

  // Default: Google Search with iframe support (igu=1)
  return `https://www.google.com/search?q=${encodeURIComponent(trimmedInput)}&igu=1&session=${sessionKey}`;
};

interface GridViewProps {
  url: string;
  count: number;
  onBack: () => void;
}

// Sub-component to handle lazy mounting of iframes with Browser UI
function LazyIframe({ initialUrl, index }: { videoId: string | null; initialUrl: string; isMuted: boolean; index: number; proxy?: ProxyInfo; key?: any }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [sessionKey, setSessionKey] = useState(() => Math.random().toString(36).substring(7));
  const [location, setLocation] = useState(() => LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [inputValue, setInputValue] = useState(initialUrl);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUrl(inputValue);
    setSessionKey(Math.random().toString(36).substring(7));
  };

  const refreshSession = () => {
    setSessionKey(Math.random().toString(36).substring(7));
    setLocation(LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  return (
    <div ref={containerRef} className="aspect-video bg-[#0d1117] rounded-2xl overflow-hidden relative group border border-white/5 shadow-2xl flex flex-col">
      {/* Mini Browser Toolbar */}
      <div className="h-8 bg-[#161b22] border-b border-white/5 flex items-center px-2 gap-2 z-10 pointer-events-auto">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
          <div className="w-2 h-2 rounded-full bg-green-500/50" />
        </div>
        
        <form onSubmit={handleSearch} className="flex-1 flex items-center bg-black/40 rounded-md px-2 h-5 border border-white/5">
          <Globe size={8} className="text-white/30 mr-1.5" />
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 bg-transparent text-[8px] text-white/70 outline-none font-mono"
            placeholder="Search or enter URL..."
          />
        </form>

        <button onClick={refreshSession} className="text-white/30 hover:text-white transition-colors">
          <RefreshCw size={10} />
        </button>
      </div>

      <div className="flex-1 relative">
        {isIntersecting ? (
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            src={getBrowserUrl(currentUrl, sessionKey)}
            title={`Browser ${index + 1}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0d1117]">
            <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
        
        {/* Premium Overlay UI */}
        <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between pt-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white/50 font-black border border-white/10">
                #{index + 1}
              </span>
              <motion.div 
                key={sessionKey}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-blue-600/80 backdrop-blur-md px-2 py-1 rounded-md border border-blue-400/30 flex items-center gap-1.5 shadow-lg"
              >
                <Globe size={10} className="text-white animate-pulse" />
                <span className="text-[9px] text-white font-black uppercase tracking-tight">
                  {location.name}
                </span>
              </motion.div>
            </div>
          </div>
          
          {/* Fake Browser Progress Bar (Bottom) */}
          <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GridView({ url, count, onBack }: GridViewProps) {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const videoId = getYouTubeId(url);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Optimized grid columns for mobile first (2 columns) and scaling up for larger screens
  const getGridCols = () => {
    if (count <= 1) return 'grid-cols-1';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-[#0a0f1a] border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-20 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-white/80 hover:text-white hover:bg-white/5 rounded-2xl transition-all active:scale-90">
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <span className="text-white text-lg font-black tracking-tighter leading-none uppercase italic">
              {count} Browsers
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-blue-500 font-black mt-1 uppercase tracking-[0.2em]">
              <Timer size={12} className="text-blue-500" />
              <span>{seconds}s Active</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            title="Refresh All"
            className={`p-3 text-white/80 bg-white/5 hover:bg-white/10 hover:text-white rounded-[1.2rem] border border-white/5 transition-all active:scale-90 ${isRefreshing ? 'rotate-180 opacity-50' : ''}`}
          >
            <RefreshCw size={22} />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 flex items-center justify-center rounded-[1.2rem] transition-all border shadow-2xl active:scale-90 ${
              isMuted 
                ? 'bg-white/5 text-white/40 border-white/5' 
                : 'bg-blue-600 text-white border-blue-400/30 shadow-blue-500/20'
            }`}
          >
            {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
          </button>
        </div>
      </header>

      {/* Virtualized/Lazy Grid Content */}
      <div className={`flex-1 overflow-y-auto p-2 grid ${getGridCols()} gap-2 content-start scroll-smooth relative bg-[#05080f]`}>
        {!isRefreshing && Array.from({ length: count }).map((_, i) => (
          <LazyIframe 
            key={`${i}-${isRefreshing}`} 
            videoId={videoId} 
            initialUrl={url}
            isMuted={isMuted} 
            index={i} 
          />
        ))}

        <AnimatePresence>
          {showOverlay && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
            >
              <div className="bg-[#161e2d] p-10 rounded-[3rem] border border-white/10 shadow-2xl text-center max-w-xs">
                <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-600/40">
                  <Play size={32} className="text-white ml-1" fill="currentColor" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">Ready to Load?</h3>
                <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">
                  Tap below to initialize independent audio contexts for all screens.
                </p>
                <button
                  onClick={() => {
                    setShowOverlay(false);
                    setIsMuted(false);
                  }}
                  className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-black tracking-[0.2em] text-xs shadow-2xl shadow-blue-900/40 active:scale-95 transition-all border border-blue-400/20"
                >
                  START ALL STREAMS
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Performance Indicator */}
      {count > 100 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gray-900/90 border border-gray-700 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Lazy Rendering Active • Only Visible Frames Loaded
        </div>
      )}
    </div>
  );
}
