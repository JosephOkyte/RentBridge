'use client';

import { useEffect } from 'react';

/**
 * ExtensionErrorGuard prevents third-party browser extensions (e.g., MetaMask,
 * wallet injects, or focus-visible polyfills) from triggering Next.js dev overlay popups.
 */
export default function ExtensionErrorGuard() {
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      const msg = event?.reason?.message || '';
      const stack = event?.reason?.stack || '';
      
      if (
        msg.includes('MetaMask') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        msg.includes('inpage.js')
      ) {
        // Prevent extension errors from surfacing in Next.js development overlay
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleError = (event) => {
      const filename = event?.filename || '';
      const msg = event?.message || '';

      if (
        filename.includes('chrome-extension://') ||
        filename.includes('moz-extension://') ||
        msg.includes('MetaMask')
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}

