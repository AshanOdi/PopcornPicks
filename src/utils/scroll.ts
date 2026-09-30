/** Scrolls a horizontal row by ~80% of its visible width, so the next set of items slides in. */
export function scrollRow(el: HTMLElement | null, direction: 'left' | 'right') {
  if (!el) return;
  const amount = el.clientWidth * 0.8;
  el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
}
