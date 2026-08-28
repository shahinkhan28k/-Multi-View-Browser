import { useState, FormEvent } from 'react';
import { ClipboardPaste, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  onOpen: (url: string, count: number) => void;
}

export function HomeView({ onOpen }: HomeViewProps) {
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(5);
  const counts = [5, 10, 50, 100, 250, 500, 1000];

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
    <div className="flex flex-col gap-8 p-6 pb-24 max-w-lg mx-auto h-full overflow-y-auto">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-black text-white tracking-tight">Multi View Browser</h1>
        <p className="text-sm text-gray-400 font-medium leading-relaxed">
          Watch multiple YouTube streams simultaneously with optimized performance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-14 pl-4 pr-24 rounded-2xl border-2 border-white/5 bg-white/5 focus:bg-white/10 focus:border-blue-500 transition-all outline-none text-white font-medium placeholder:text-gray-600"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-2 bottom-2 px-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 text-sm font-bold text-white active:scale-95 transition-all backdrop-blur-md"
          >
            <ClipboardPaste size={16} />
            Paste
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Select Screen Count</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {counts.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCount(c)}
                className={`flex-shrink-0 min-w-[65px] h-11 rounded-xl font-black text-sm border-2 transition-all ${
                  count === c
                    ? 'border-blue-600 bg-blue-600/20 text-blue-400'
                    : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(Math.min(1000, Math.max(1, Number(e.target.value))))}
              placeholder="Custom count (max 1000)"
              className="w-full h-12 px-4 rounded-xl border-2 border-white/5 bg-white/5 text-white text-sm font-bold focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full h-15 bg-blue-600 rounded-2xl text-white font-black text-lg shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 hover:bg-blue-500 transition-all"
        >
          <Play size={22} fill="currentColor" />
          START SESSION
        </motion.button>
      </form>

      <div className="mt-4 p-5 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
        <h3 className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-1">Performance Tip</h3>
        <p className="text-xs text-yellow-500/80 leading-relaxed font-medium">
          Running 100+ screens uses significant memory. We've implemented lazy-loading, but sessions over 500 are recommended for high-end devices only.
        </p>
      </div>
    </div>
  );
}
