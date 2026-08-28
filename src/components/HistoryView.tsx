import { History as HistoryIcon, Play, Trash2, Clock } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryViewProps {
  history: HistoryItem[];
  onOpen: (url: string, count: number) => void;
  onClear: () => void;
  onRemove: (id: string) => void;
}

export function HistoryView({ history, onOpen, onClear, onRemove }: HistoryViewProps) {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-400">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <HistoryIcon size={40} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">No History Yet</h2>
        <p className="text-sm">Your multi-view sessions will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 pb-24 max-w-lg mx-auto overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">History</h2>
        <button 
          onClick={onClear}
          className="text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="p-5 bg-[#161e2d] rounded-2xl border border-white/5 shadow-xl hover:border-white/10 transition-all relative group overflow-hidden"
          >
            <div className="flex flex-col gap-3 pr-14 relative z-10">
              <div className="flex items-center gap-3 text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">
                <Clock size={12} className="text-blue-500" />
                {formatDate(item.timestamp)}
                <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-[9px] border border-blue-500/20">
                  {item.count} SCREENS
                </span>
              </div>
              <p className="text-sm font-bold text-gray-300 truncate leading-relaxed">
                {item.url}
              </p>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                onClick={() => onOpen(item.url, item.count)}
                className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40 active:scale-90 transition-all"
              >
                <Play size={20} fill="currentColor" />
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="w-10 h-10 text-gray-600 hover:text-red-500 flex items-center justify-center transition-colors hover:bg-red-500/5 rounded-xl"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="absolute -left-4 -bottom-4 opacity-[0.02] transform rotate-12">
               <HistoryIcon size={100} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
