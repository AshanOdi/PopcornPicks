import { useEffect, useRef } from 'react';

/**
 * Calls `onLoadMore` when an invisible "sentinel" element at the bottom of a list
 * scrolls into view. Attach the returned ref to that element.
 *
 * @param enabled set to false while loading, on error, or when there are no more pages
 */
export function useInfiniteScroll(onLoadMore: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      // Start loading 400px before the user actually reaches the bottom
      { rootMargin: '400px' },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore, enabled]);

  return sentinelRef;
}
