import { useState, FormEvent } from 'react';
import { Search, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeViewProps {
  onOpen: (url: string, count: number) => void;
}

export function HomeView({ onOpen }: HomeViewProps) {
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(5);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const counts = [2, 4, 6, 10, 20, 50, 100, 250, 500, 1000];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    onOpen(url, count);
  };

  return (
    <div className="min-h-screen bg-[#05080f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Search Engine Branding */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center z-10"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 border border-blue-400/20">
            <Search size={36} className="text-white" strokeWidth={3} />
          </div>
          <div className="text-left">
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
              ULTRA<span className="text-blue-500">SEARCH</span>
            </h1>
            <p className="text-gray-500 font-black tracking-[0.4em] text-[9px] uppercase mt-2">The Multi-Instance Browser</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-10 z-10">
        {/* Main Search Input */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-[#0d1117] border border-white/10 rounded-[2.5rem] flex items-center p-2 shadow-2xl">
            <div className="pl-6 text-gray-500">
              <Globe size={24} />
            </div>
            <input
              type="text"
              placeholder="Search Google or enter any URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent border-none text-white px-6 py-5 text-xl outline-none placeholder:text-gray-600 font-medium"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[2rem] font-black tracking-widest text-xs transition-all active:scale-95 shadow-xl shadow-blue-900/20 mr-1"
            >
              SEARCH ALL
            </button>
          </div>
        </div>

        {/* Instance Selection */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-white/10" />
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Choose Browser Count</span>
            <div className="h-px w-12 bg-white/10" />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {counts.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                className={`w-16 h-16 rounded-[1.5rem] font-black transition-all border flex flex-col items-center justify-center gap-1 ${
                  count === n 
                    ? 'bg-blue-600 text-white border-blue-400/30 shadow-xl shadow-blue-900/40 scale-110 z-20' 
                    : 'bg-[#0d1117] text-gray-500 border-white/5 hover:border-white/10'
                }`}
              >
                <span className="text-lg">{n}</span>
                <span className="text-[7px] uppercase tracking-tighter opacity-50">Tabs</span>
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Footer Features */}
      <div className="absolute bottom-12 flex gap-12 text-[10px] font-black text-gray-800 uppercase tracking-[0.4em]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          Proxy Unlocked
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          Multi-Session
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
          No Limits
        </div>
      </div>
    </div>
  );
}
