import { useEffect } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trap Tab focus within `ref.current`.
 * - Moves focus to the first focusable element on mount (unless something inside already has focus, e.g. an autoFocus input).
 * - Cycles Tab between first and last focusable inside the ref.
 * - Restores focus to the previously-focused element on unmount.
 *
 * Pair with `role="dialog"` + `aria-modal="true"` on the same element for screen-reader behaviour.
 */
export function useFocusTrap(ref, active = true) {
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const previouslyFocused = document.activeElement;
    const getFocusables = () =>
      Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR));

    const focusables = getFocusables();
    if (focusables.length > 0 && !root.contains(document.activeElement)) {
      focusables[0].focus();
    }

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = getFocusables();
      if (items.length === 0) return;
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

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [active, ref]);
}
