import { flushSync } from "react-dom";

export function go(navigate, to, options) {
  if (!document.startViewTransition) {
    navigate(to, options);
    return;
  }
  document.startViewTransition(() => {
    flushSync(() => navigate(to, options));
  });
}
