import { BookOpen, Gamepad2, Settings, Globe, Shield, Cpu, ExternalLink, Activity } from 'lucide-react';
import { ViewType } from '../types';
import { useState, useEffect } from 'react';

interface PlaceholderViewProps {
  type: ViewType;
}

export function PlaceholderView({ type }: PlaceholderViewProps) {
  const [backendStatus, setBackendStatus] = useState<'Checking...' | 'Online' | 'Offline'>('Checking...');

  useEffect(() => {
    if (type === 'Setting') {
      const checkStatus = async () => {
        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
          const res = await fetch(`${backendUrl}/api/health`);
          if (res.ok) setBackendStatus('Online');
          else setBackendStatus('Offline');
        } catch {
          setBackendStatus('Offline');
        }
      };
      checkStatus();
    }
  }, [type]);

  const content = {
    Blogs: {
      icon: BookOpen,
      title: 'Browser Insights',
      description: 'Latest updates on multi-stream performance and browser tips.',
      items: [
        { title: 'Optimizing for 100+ Screens', date: 'Oct 12, 2024' },
        { title: 'Managing Audio Overlap', date: 'Oct 08, 2024' },
        { title: 'The Future of Webview Containers', date: 'Sep 29, 2024' },
      ]
    },
    Setting: {
      icon: Settings,
      title: 'App Settings',
      description: 'Configure your multi-view experience and proxy settings.',
      items: []
    }
  }[type as 'Blogs' | 'Game' | 'Setting'];

  if (!content) return null;

  const Icon = content.icon;

  return (
    <div className="flex flex-col h-full p-6 pb-24 max-w-lg mx-auto overflow-y-auto bg-[#0a0f1a]">
      <div className="flex flex-col gap-6 mb-10">
        <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-500 shadow-inner">
          <Icon size={40} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">{content.title}</h2>
          <p className="text-sm text-gray-500 font-medium mt-2 leading-relaxed">{content.description}</p>
        </div>
      </div>

      {type === 'Setting' ? (
        <div className="flex flex-col gap-8">
          <div className="bg-[#161e2d] rounded-3xl border border-white/5 p-7 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                <Globe size={22} />
              </div>
              <h3 className="font-black text-white uppercase tracking-widest text-xs">Proxy Architecture</h3>
            </div>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium">
              Configure individual IP/Proxy mapping per view. This simulates different geographical locations for your streams.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs font-black text-gray-400 uppercase">Proxy Mode</span>
                <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20">Smart Routing</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Activity size={16} className={backendStatus === 'Online' ? 'text-green-500' : 'text-gray-600'} />
                  <span className="text-xs font-black text-gray-400 uppercase">Backend API</span>
                </div>
                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                  backendStatus === 'Online' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 
                  backendStatus === 'Offline' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-gray-500 bg-white/5 border-white/10'
                }`}>
                  {backendStatus}
                </span>
              </div>
            </div>
            <button className="w-full mt-6 h-14 bg-white text-[#0a0f1a] rounded-2xl text-sm font-black flex items-center justify-center gap-3 hover:bg-gray-200 transition-all shadow-xl shadow-black/20">
              <Shield size={20} />
              SETUP ADVANCED PROXIES
            </button>
          </div>

          <div className="bg-[#161e2d] rounded-3xl border border-white/5 p-7 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-500">
                <Cpu size={22} />
              </div>
              <h3 className="font-black text-white uppercase tracking-widest text-xs">Performance</h3>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase">Hardware Acceleration</span>
                <div className="w-12 h-7 bg-blue-600 rounded-full relative shadow-lg shadow-blue-900/20">
                  <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-400 uppercase">Lazy Loading Frames</span>
                <div className="w-12 h-7 bg-blue-600 rounded-full relative shadow-lg shadow-blue-900/20">
                  <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={i} className="p-5 bg-[#161e2d] rounded-2xl border border-white/5 shadow-xl flex items-center justify-between group hover:border-white/10 transition-all">
              <div>
                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{item.title}</h4>
                <p className="text-[9px] text-gray-500 mt-1 uppercase font-black tracking-widest">
                  {('date' in item) ? item.date : item.category}
                </p>
              </div>
              <ExternalLink size={18} className="text-gray-600 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
