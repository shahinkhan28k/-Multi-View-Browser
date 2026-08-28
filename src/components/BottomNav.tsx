import { Home, History, BookOpen, User, Settings } from 'lucide-react';
import { ViewType } from '../types';

interface BottomNavProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: 'Home', icon: Home, label: 'Home' },
    { id: 'History', icon: History, label: 'History' },
    { id: 'Blogs', icon: BookOpen, label: 'Blogs' },
    { id: 'Developer', icon: User, label: 'Developer' },
    { id: 'Setting', icon: Settings, label: 'Setting' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 pb-safe shadow-lg z-50">
      {navItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id as ViewType)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === id ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <Icon size={20} strokeWidth={activeView === id ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
