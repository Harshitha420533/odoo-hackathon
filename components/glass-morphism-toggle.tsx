'use client';

import { useGlassMorphism } from '@/lib/glass-morphism-context';
import { Sparkles, Square } from 'lucide-react';

export function GlassMorphismToggle() {
  const { mode, toggleMode } = useGlassMorphism();

  return (
    <button
      onClick={toggleMode}
      className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium ${
        mode === 'glass'
          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30'
          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
      }`}
      title={`Switch to ${mode === 'glass' ? 'Normal' : 'Glass Morphism'} view`}
    >
      {mode === 'glass' ? (
        <>
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Glass</span>
        </>
      ) : (
        <>
          <Square className="w-4 h-4" />
          <span className="hidden sm:inline">Normal</span>
        </>
      )}
    </button>
  );
}
