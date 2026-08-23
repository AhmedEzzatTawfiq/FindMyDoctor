import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Smoothly scroll to top ONLY when navigating to a different page (pathname changes)
    if (prevPathname.current !== pathname) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
