'use client';

import { useEffect, useState } from 'react';
import { LoadingScreen } from '@/components/loading-screen';
import { EnhancedLanding } from '@/components/enhanced-landing';

export default function Page() {
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    // Show loading screen for 3 seconds, then landing page
    const timer = setTimeout(() => {
      setShowLanding(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return showLanding ? <EnhancedLanding /> : <LoadingScreen />;
}
