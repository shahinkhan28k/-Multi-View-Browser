import { useState, FormEvent } from 'react';
import { ClipboardPaste, Play, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  onOpen: (url: string, count: number) => void;
}

export function HomeView({ onOpen }: HomeViewProps) {
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const counts = [2, 4, 6, 10, 20, 50, 100, 250, 500, 1000];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (err) {
      console.error('Failed to read clipboard', err);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onOpen(url, count);
  };

  return (
    <div className="flex flex-col gap-10 p-6 pb-24 max-w-lg mx-auto h-full overflow-y-auto scrollbar-hide bg-[#0a0f1a]">
      {/* Brand Header */}
      <div className="flex flex-col gap-4 text-center mt-4">
        <div className="w-20 h-20 bg-blue-600/10 rounded-[2.5rem] flex items-center justify-center mx-auto border border-blue-500/20 shadow-2xl shadow-blue-500/10">
          <Play size={32} className="text-blue-500 ml-1" fill="currentColor" />
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter">Multi View</h1>
          <p className="text-sm text-gray-500 font-bold tracking-widest uppercase opacity-60">Professional Video Grid</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* URL Input Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1">Video URL</label>
          <div className="relative group">
            <input
              type="text"
              placeholder="Paste YouTube Link Here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full h-16 pl-6 pr-24 rounded-3xl border-2 border-white/5 bg-white/5 focus:bg-white/10 focus:border-blue-500 transition-all outline-none text-white font-bold placeholder:text-gray-600 shadow-inner"
            />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 top-3 bottom-3 px-5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all border border-white/5"
            >
              <ClipboardPaste size={14} />
              Paste
            </button>
          </div>
        </div>

        {/* Screen Count Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3 relative">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1">Screen Count</label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-16 px-6 bg-white/5 rounded-3xl border-2 border-white/5 text-white flex items-center justify-between font-black transition-all hover:bg-white/10"
            >
              {count}
              <ChevronDown size={18} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-[#161e2d] border-2 border-white/10 rounded-3xl shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-hide py-2">
                {counts.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCount(c);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full h-12 px-6 text-left font-black transition-colors ${
                      count === c ? 'text-blue-500 bg-blue-500/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {c} Screens
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] ml-1">Custom</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
              className="w-full h-16 px-6 rounded-3xl border-2 border-white/5 bg-white/5 text-white font-black focus:border-blue-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full h-20 bg-blue-600 rounded-[2.5rem] text-white font-black text-xl tracking-tighter shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-4 hover:bg-blue-500 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Play size={24} fill="currentColor" />
            LOAD STREAMS
          </motion.button>
        </div>
      </form>

      <div className="mt-auto p-6 bg-blue-500/5 rounded-[2rem] border border-blue-500/10 text-center">
        <p className="text-[10px] text-blue-400 font-black tracking-[0.3em] uppercase">Professional Grade Utility</p>
        <p className="mt-3 text-xs text-gray-500 font-medium leading-relaxed">
          Optimized for Android WebViews and Mobile browsers. Isolated media contexts for maximum performance.
        </p>
      </div>
    </div>
  );
}
