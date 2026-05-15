'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';

/**
 * AnalyticsProvider — thin client wrapper that activates all passive tracking.
 * 
 * Since layout.tsx is a Server Component, we can't call hooks directly there.
 * This component is inserted inside the provider tree in layout.tsx.
 * It renders nothing — purely a side-effect container.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useAnalytics();
  const { isAuthenticated } = useAuth();
  
  // Track global session time locally and send on-exit/hide
  const activeSeconds = useRef(0);
  const lastSyncTime = useRef(Date.now());

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // 1. Tick locally every 5 seconds to accurately measure active time
    const tickInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        activeSeconds.current += 5;
      }
    }, 5000);

    // 2. Sync function: sends data to server using keepalive
    const syncTime = () => {
      const totalSeconds = activeSeconds.current;
      if (totalSeconds >= 60) {
        const minutes = Math.floor(totalSeconds / 60);
        
        // Remove the minutes we are about to sync
        activeSeconds.current -= (minutes * 60);

        // keepalive fetch ensures the request fires even if the page unloads
        const token = localStorage.getItem('token');
        const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY;
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/progress/track-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(apiKey ? { 'X-App-Key': apiKey } : {}),
          },
          body: JSON.stringify({ minutes }),
          keepalive: true
        }).catch(() => {});
      }
    };

    // 3. Fallback: Also sync every 5 minutes just in case the user never closes the tab
    const syncInterval = setInterval(syncTime, 5 * 60 * 1000);

    // 4. On-Exit: Sync immediately when the tab is hidden or closed
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        syncTime();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(tickInterval);
      clearInterval(syncInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Try a final sync on unmount
      syncTime();
    };
  }, [isAuthenticated]);

  return <>{children}</>;
}
