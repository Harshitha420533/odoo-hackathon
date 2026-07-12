'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type GlassMorphismMode = 'glass' | 'normal';

interface GlassMorphismContextType {
  mode: GlassMorphismMode;
  setMode: (mode: GlassMorphismMode) => void;
  toggleMode: () => void;
}

const GlassMorphismContext = createContext<GlassMorphismContextType | undefined>(undefined);

export function GlassMorphismProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<GlassMorphismMode>('glass');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('glassMorphismMode') as GlassMorphismMode | null;
    const initialMode = savedMode || 'glass';
    setModeState(initialMode);
    applyGlassMode(initialMode);
  }, []);

  const applyGlassMode = (newMode: GlassMorphismMode) => {
    const html = document.documentElement;
    if (newMode === 'glass') {
      html.classList.add('glass-morphism');
    } else {
      html.classList.remove('glass-morphism');
    }
    html.setAttribute('data-glass', newMode === 'glass' ? 'true' : 'false');
  };

  const setMode = (newMode: GlassMorphismMode) => {
    setModeState(newMode);
    localStorage.setItem('glassMorphismMode', newMode);
    applyGlassMode(newMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'glass' ? 'normal' : 'glass';
    setMode(newMode);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <GlassMorphismContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </GlassMorphismContext.Provider>
  );
}

export function useGlassMorphism() {
  const context = useContext(GlassMorphismContext);
  if (context === undefined) {
    return { mode: 'glass' as GlassMorphismMode, setMode: () => {}, toggleMode: () => {} };
  }
  return context;
}
