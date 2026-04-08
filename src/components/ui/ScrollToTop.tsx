import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { forceUnlockScroll } from "@/utils/scrollLock";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Force release any stuck body locks immediately upon route change
    forceUnlockScroll();
    
    // Attempt scroll immediately
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
    
    // Double attempt slightly after layout paints (helps aggressively bypass Suspense lazy unmount caching)
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
      document.body.scrollTo?.({ top: 0, left: 0, behavior: "instant" });
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
