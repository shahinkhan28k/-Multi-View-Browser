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
    <div className="flex flex-col h-full p-6 pb-24 max-w-lg mx-auto overflow-y-auto">
      <div className="flex flex-col gap-4 mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <Icon size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{content.title}</h2>
          <p className="text-sm text-gray-500">{content.description}</p>
        </div>
      </div>

      {type === 'Setting' ? (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-blue-600" size={20} />
              <h3 className="font-bold text-gray-800">Proxy Architecture</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Configure individual IP/Proxy mapping per view. This simulates different geographical locations for your streams.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm font-medium text-gray-700">Proxy Mode</span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">Smart Routing</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Activity size={14} className={backendStatus === 'Online' ? 'text-green-500' : 'text-gray-400'} />
                  <span className="text-sm font-medium text-gray-700">Backend API</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                  backendStatus === 'Online' ? 'text-green-600 bg-green-50' : 
                  backendStatus === 'Offline' ? 'text-red-600 bg-red-50' : 'text-gray-400 bg-gray-100'
                }`}>
                  {backendStatus}
                </span>
              </div>
            </div>
            <button className="w-full mt-4 h-12 bg-gray-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2">
              <Shield size={16} />
              Setup Advanced Proxies
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="text-purple-600" size={20} />
              <h3 className="font-bold text-gray-800">Performance</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hardware Acceleration</span>
                <div className="w-10 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lazy Loading Frames</span>
                <div className="w-10 h-6 bg-green-500 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {content.items.map((item, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-800">{item.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">
                  {('date' in item) ? item.date : item.category}
                </p>
              </div>
              <ExternalLink size={16} className="text-gray-300" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
