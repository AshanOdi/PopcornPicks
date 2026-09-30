import { useEffect, type RefObject } from 'react';

const SPEED_PX_PER_SECOND = 30;
/** How long to wait after the user stops interacting before auto-scroll resumes */
const RESUME_AFTER_HOVER_MS = 600;
const RESUME_AFTER_TOUCH_MS = 3000;
/** Rest at each end before turning around */
const EDGE_PAUSE_MS = 2000;

/**
 * Slowly auto-scrolls a horizontal scroll container back and forth:
 * to the end, rest, back to the start, rest, repeat. Every item appears once (no duplicate copies).
 *
 * Unlike a CSS animation, this moves the real scroll position, so the user can still
 * swipe, use a trackpad or click arrows. Auto-scroll pauses during hover/touch and resumes after.
 * Does nothing when the content fits without scrolling.
 *
 * @param scrollerRef the element with `overflow-x: auto`
 * @param areaRef     the element whose hover/touch should pause scrolling (e.g. the row + its arrows)
 */
export function useAutoScroll(
  scrollerRef: RefObject<HTMLElement | null>,
  areaRef: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const scroller = scrollerRef.current;
    const area = areaRef.current;
    if (!scroller || !area || !enabled) return;
    // Respect the OS "reduce motion" setting: manual scrolling only
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let frame = 0;
    let lastTime = performance.now();
    // Track the position as a float: the browser rounds scrollLeft, which would stall tiny steps
    let position = scroller.scrollLeft;
    let direction = 1; // 1 = moving right, -1 = moving left
    let restUntil = 0; // timestamp until which we rest at an end

    function tick(now: number) {
      // The first frame's timestamp can be slightly before the effect started; never step backwards
      const seconds = Math.max(0, (now - lastTime) / 1000);
      lastTime = now;
      const maxScroll = scroller!.scrollWidth - scroller!.clientWidth;

      if (paused || maxScroll <= 0) {
        position = scroller!.scrollLeft; // follow manual scrolling
      } else if (now >= restUntil) {
        position += direction * SPEED_PX_PER_SECOND * seconds;

        // Reached the end we're moving toward: stop exactly there, rest, then turn around.
        // (Checking only that end means starting at 0 moving right doesn't count as "arrived".)
        if (direction === 1 && position >= maxScroll) {
          position = maxScroll;
          direction = -1;
          restUntil = now + EDGE_PAUSE_MS;
        } else if (direction === -1 && position <= 0) {
          position = 0;
          direction = 1;
          restUntil = now + EDGE_PAUSE_MS;
        }
        scroller!.scrollLeft = position;
      }
      frame = requestAnimationFrame(tick);
    }

    function pause() {
      paused = true;
      clearTimeout(resumeTimer);
    }

    function resumeAfter(ms: number) {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        position = scroller!.scrollLeft;
        paused = false;
      }, ms);
    }

    const onMouseLeave = () => resumeAfter(RESUME_AFTER_HOVER_MS);
    const onTouchEnd = () => resumeAfter(RESUME_AFTER_TOUCH_MS);

    area.addEventListener('mouseenter', pause);
    area.addEventListener('mouseleave', onMouseLeave);
    area.addEventListener('touchstart', pause, { passive: true });
    area.addEventListener('touchend', onTouchEnd);
    area.addEventListener('focusin', pause); // keyboard users
    area.addEventListener('focusout', onMouseLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(resumeTimer);
      area.removeEventListener('mouseenter', pause);
      area.removeEventListener('mouseleave', onMouseLeave);
      area.removeEventListener('touchstart', pause);
      area.removeEventListener('touchend', onTouchEnd);
      area.removeEventListener('focusin', pause);
      area.removeEventListener('focusout', onMouseLeave);
    };
  }, [scrollerRef, areaRef, enabled]);
}
