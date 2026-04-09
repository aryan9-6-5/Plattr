import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { forceUnlockScroll } from "@/utils/scrollLock";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable native browser history scroll jump completely.
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Force release any stuck body locks immediately upon route change
    forceUnlockScroll();
    
    // Attempt scroll immediately using primitives
    window.scrollTo(0, 0);
    
    // Multiple attempts during Suspense resolution and React Query payloads
    let attempts = 0;
    const interval = setInterval(() => {
      try {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch (e) {
        // ignore Safari behavior errors
      }
      
      attempts++;
      if (attempts > 10) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
