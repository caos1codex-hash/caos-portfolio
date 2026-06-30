// Shared scroll utility that works with Lenis smooth scroll
// Falls back to native scroll when Lenis is not available

export function scrollTo(target: string | HTMLElement | number, options?: { offset?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenis = (window as any).__lenis as {
    scrollTo: (target: string | HTMLElement | number, options?: Record<string, unknown>) => void;
  } | undefined;

  if (lenis) {
    lenis.scrollTo(target, { offset: options?.offset ?? 0, duration: 1.2 });
  } else {
    // Fallback: native scroll
    if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

export function scrollToTop() {
  scrollTo(0);
}