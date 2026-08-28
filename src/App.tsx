/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewType, HistoryItem } from './types';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { HistoryView } from './components/HistoryView';
import { GridView } from './components/GridView';
import { PlaceholderView } from './components/PlaceholderView';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('Home');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentSession, setCurrentSession] = useState<{ url: string; count: number } | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('multiViewHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveHistory = (url: string, count: number) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      url,
      count,
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history.filter(item => item.url !== url)].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('multiViewHistory', JSON.stringify(updatedHistory));
  };

  const handleOpen = (url: string, count: number) => {
    setCurrentSession({ url, count });
    saveHistory(url, count);
    setActiveView('Grid');
  };

  const handleBackFromGrid = () => {
    setCurrentSession(null);
    setActiveView('Home');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('multiViewHistory');
  };

  const removeHistoryItem = (id: string) => {
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem('multiViewHistory', JSON.stringify(updated));
  };

  const renderView = () => {
    switch (activeView) {
      case 'Home':
        return <HomeView onOpen={handleOpen} />;
      case 'History':
        return (
          <HistoryView 
            history={history} 
            onOpen={handleOpen} 
            onClear={clearHistory}
            onRemove={removeHistoryItem}
          />
        );
      case 'Grid':
        return currentSession ? (
          <GridView 
            url={currentSession.url} 
            count={currentSession.count} 
            onBack={handleBackFromGrid} 
          />
        ) : <HomeView onOpen={handleOpen} />;
      case 'Blogs':
      case 'Game':
      case 'Setting':
        return <PlaceholderView type={activeView} />;
      default:
        return <HomeView onOpen={handleOpen} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden select-none">
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {activeView !== 'Grid' && (
        <BottomNav activeView={activeView} onViewChange={setActiveView} />
      )}
    </div>
  );
}

