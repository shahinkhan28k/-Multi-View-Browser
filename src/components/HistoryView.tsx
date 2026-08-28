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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Session History</h2>
        <button 
          onClick={onClear}
          className="text-red-500 text-sm font-semibold flex items-center gap-1 px-3 py-1 bg-red-50 rounded-lg"
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <div className="flex flex-col gap-2 pr-12">
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <Clock size={10} />
                {formatDate(item.timestamp)}
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  {item.count} Screens
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate leading-relaxed">
                {item.url}
              </p>
            </div>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
              <button
                onClick={() => onOpen(item.url, item.count)}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 active:scale-95 transition-transform"
              >
                <Play size={18} fill="currentColor" />
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="w-8 h-8 text-gray-300 hover:text-red-500 flex items-center justify-center transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
