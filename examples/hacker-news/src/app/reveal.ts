/**
 * Creates a vertical CSS reveal effect to reduce jarring effects from
 * progressive loading on the comments page. Fragments are returned untouched.
 */
export const reveal = (
  el: HTMLElement | DocumentFragment,
): HTMLElement | DocumentFragment => {
  if (!(el instanceof HTMLElement)) return el;

  requestAnimationFrame(() => {
    const height = el.offsetHeight;

    el.style.height = "0";
    el.style.transition = "0.5s";
    el.style.overflow = "hidden";

    requestAnimationFrame(() =>
      setTimeout(() => {
        el.style.height = `${height}px`;
      })
    );
  });

  return el;
};
