import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Volume2, VolumeX, Timer, RefreshCw, AlertCircle, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { ProxyInfo } from '../types';

interface GridViewProps {
  url: string;
  count: number;
  onBack: () => void;
}

// Sub-component to handle lazy mounting of iframes with Proxy info
function LazyIframe({ videoId, isMuted, index, proxy }: { videoId: string; isMuted: boolean; index: number; proxy?: ProxyInfo; key?: any }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative group border border-gray-800">
      {isIntersecting ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}&rel=0&modestbranding=1`}
          title={`Video ${index + 1}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Proxy & Info Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2">
        <div className="flex justify-between items-start">
          <span className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold tracking-tight">
            #{index + 1}
          </span>
          {proxy && (
            <div className="bg-blue-600/90 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center gap-1">
              <Globe size={8} className="text-white" />
              <span className="text-[7px] text-white font-bold uppercase truncate max-w-[60px]">
                {proxy.location}
              </span>
            </div>
          )}
        </div>
        
        {proxy && (
          <div className="bg-black/70 backdrop-blur-md p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between text-[6px] text-gray-300 font-medium">
              <div className="flex items-center gap-1">
                <ShieldCheck size={6} className="text-green-400" />
                <span>IP: {proxy.ip}</span>
              </div>
              <span>{proxy.latency}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function GridView({ url, count, onBack }: GridViewProps) {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [proxies, setProxies] = useState<ProxyInfo[]>([]);
  const videoId = getYouTubeId(url);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch proxy metadata from backend
  useEffect(() => {
    const fetchProxies = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const response = await fetch(`${backendUrl}/api/proxy-config?count=${Math.min(count, 100)}`);
        const data = await response.json();
        setProxies(data.proxies);
      } catch (err) {
        console.error('Failed to fetch proxy config:', err);
      }
    };
    fetchProxies();
  }, [count]);

  function getYouTubeId(url: string) {
    // Robust parser for: shorts, live, standard watch, youtu.be, embed
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-50">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Unsupported URL</h2>
        <p className="text-gray-500 mb-8 max-w-xs">We couldn't find a valid YouTube ID in that link. Try a standard video or shorts URL.</p>
        <button onClick={onBack} className="px-8 h-14 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">Go Back</button>
      </div>
    );
  }

  // Optimized grid columns for high counts
  const getGridCols = () => {
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    if (count <= 16) return 'grid-cols-4';
    if (count <= 36) return 'grid-cols-6';
    if (count <= 100) return 'grid-cols-8 md:grid-cols-10 lg:grid-cols-12';
    return 'grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20';
  };

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-4 sticky top-0 z-20 shadow-xl">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 text-white hover:bg-gray-800 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-white text-sm font-black tracking-tight leading-none">
              {count.toLocaleString()} VIEWS
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-bold mt-1 uppercase tracking-widest">
              <Timer size={12} className="text-blue-500" />
              <span>{seconds}s SESSION</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            title="Refresh All"
            className={`p-2.5 text-white bg-gray-800 hover:bg-gray-700 rounded-xl transition-all ${isRefreshing ? 'rotate-180 opacity-50' : ''}`}
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`h-11 flex items-center gap-2 px-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isMuted 
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Sound On'}</span>
          </button>
        </div>
      </header>

      {/* Virtualized/Lazy Grid Content */}
      <div className={`flex-1 overflow-y-auto p-1.5 grid ${getGridCols()} gap-1.5 content-start scroll-smooth`}>
        {!isRefreshing && Array.from({ length: count }).map((_, i) => (
          <LazyIframe 
            key={i} 
            videoId={videoId} 
            isMuted={isMuted} 
            index={i} 
            proxy={proxies[i % (proxies.length || 1)]}
          />
        ))}
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
