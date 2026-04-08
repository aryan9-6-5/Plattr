/**
 * useScrollLock — centralized body scroll lock manager.
 * Maintains a ref-count so multiple overlays don't fight each other.
 * The body scroll is only unlocked when ALL consumers have released.
 */

let lockCount = 0;
let savedScrollY = 0;

export const lockScroll = () => {
  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
  }
  lockCount++;
};

export const unlockScroll = () => {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  }
};

/** Force-unlock all (use on route change) */
export const forceUnlockScroll = () => {
  lockCount = 0;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
};
