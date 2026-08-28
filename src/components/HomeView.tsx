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
        <h1 className="text-2xl font-bold text-gray-900">Multi View Browser</h1>
        <p className="text-sm text-gray-500">View multiple YouTube streams simultaneously.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="relative group">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full h-14 pl-4 pr-24 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none text-gray-800 font-medium"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-2 bottom-2 px-4 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 text-sm font-semibold text-gray-600 active:scale-95 transition-transform"
          >
            <ClipboardPaste size={16} />
            Paste
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-700 px-1">Select Screen Count</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {counts.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCount(c)}
                className={`flex-shrink-0 min-w-[60px] h-10 rounded-xl font-bold text-sm border-2 transition-all ${
                  count === c
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
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
              className="w-full h-10 px-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full h-14 bg-blue-600 rounded-2xl text-white font-bold text-lg shadow-xl shadow-blue-200 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Play size={20} fill="currentColor" />
          Open Now
        </motion.button>
      </form>

      <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
        <h3 className="text-sm font-bold text-yellow-800 mb-1">Performance Tip</h3>
        <p className="text-xs text-yellow-700 leading-relaxed">
          Running 100+ screens uses significant memory. We've implemented lazy-loading, but sessions over 500 are recommended for high-end desktop browsers only.
        </p>
      </div>
    </div>
  );
}
