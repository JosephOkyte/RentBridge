'use client';

import { useEffect } from 'react';

/**
 * ExtensionErrorGuard prevents third-party browser extensions (e.g., MetaMask,
 * wallet injects, focus-visible polyfills) and non-fatal Clerk lazy-chunk timeouts
 * from triggering Next.js dev overlay popups.
 */
export default function ExtensionErrorGuard() {
  useEffect(() => {
    // Intercept console.error to prevent transient Clerk UI chunk timeouts from triggering Next.js dev overlay
    if (typeof console !== 'undefined' && console.error) {
      const origConsoleError = console.error;
      console.error = function(...args) {
        const argsStr = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
        if (
          argsStr.includes('[Clerk UI]') || 
          argsStr.includes('Component renderer did not mount') ||
          argsStr.includes('MetaMask')
        ) {
          if (console.warn) console.warn('[Safe Filtered]:', ...args);
          return;
        }
        origConsoleError.apply(console, args);
      };
    }

    const handleUnhandledRejection = (event) => {
      const msg = event?.reason?.message || '';
      const stack = event?.reason?.stack || '';
      
      if (
        msg.includes('MetaMask') ||
        msg.includes('Component renderer did not mount') ||
        msg.includes('[Clerk UI]') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://') ||
        stack.includes('inpage.js')
      ) {
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
        filename.includes('clerk') ||
        msg.includes('MetaMask') ||
        msg.includes('Component renderer did not mount')
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
