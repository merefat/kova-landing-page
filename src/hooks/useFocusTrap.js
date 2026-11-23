import { useEffect, useRef } from 'react';

// Keeps Tab/Shift+Tab inside `containerRef` while active, moves focus in
// on mount, and returns it to the previously focused element on cleanup.
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), ' +
  '[tabindex]:not([tabindex="-1"]), summary, select, textarea';

export function useFocusTrap(containerRef, active) {
  const prevFocus = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    prevFocus.current = document.activeElement;
    const el = containerRef.current;
    if (el) {
      const first =
        el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE);
      (first || el).focus?.();
    }

    const onKey = (e) => {
      if (e.key !== 'Tab' || !containerRef.current) return;
      const items = [...containerRef.current.querySelectorAll(FOCUSABLE)]
        .filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prevFocus.current?.focus?.();
      prevFocus.current = null;
    };
  }, [active, containerRef]);
}
