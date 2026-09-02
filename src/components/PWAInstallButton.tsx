import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) return null;

  return (
    <div className="relative">
      <AnimatePresence>
        {isInstallable && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={install}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-black shadow-lg shadow-blue-900/40 active:scale-95 transition-all"
          >
            <Download size={14} />
            INSTALL APP
          </motion.button>
        )}

        {isIOS && !isInstallable && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white border border-white/10 rounded-full text-xs font-black shadow-lg active:scale-95 transition-all"
          >
            <Info size={14} />
            ADD TO HOME
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setShowIOSGuide(false)} 
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#161e2d] rounded-3xl p-8 shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-black text-white mb-4">Install on iOS</h3>
              <div className="space-y-4 text-sm text-gray-400 font-medium">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <p>Tap the <span className="text-white font-bold">Share</span> button in Safari's bottom toolbar.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <p>Scroll down and select <span className="text-white font-bold">"Add to Home Screen"</span>.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black transition-colors"
              >
                GOT IT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
