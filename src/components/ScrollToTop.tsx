import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Scrolls to the top whenever the page (path or query, e.g. /discover?list=top_rated) changes,
 * like a normal website does. A single-page app keeps the old scroll position otherwise.
 *
 * Back/Forward ("POP" navigation) is left alone, so the browser can return you to where you were.
 */
function ScrollToTop() {
  const { pathname, search } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType !== 'POP') window.scrollTo({ top: 0 });
  }, [pathname, search, navigationType]);

  return null;
}

export default ScrollToTop;
