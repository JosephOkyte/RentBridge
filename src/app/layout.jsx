import { ClerkProvider } from '@clerk/nextjs';
import ExtensionErrorGuard from '../components/ExtensionErrorGuard';
import './globals.css';

export const metadata = {
  title: 'RentBridge | Bridging the Gap Between Landlords and Tenants in Nigeria',
  description: 'Nigeria\'s verified direct rental marketplace connecting tenants directly with landlords, caretakers, and legal custodians. ₦0 viewing fees and 0% agency cuts across Lagos, Abuja, Port Harcourt, and Enugu.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  function shouldIgnore(msg, source) {
                    var str = ((msg || '') + ' ' + (source || '')).toLowerCase();
                    return str.indexOf('metamask') !== -1 ||
                           str.indexOf('inpage.js') !== -1 ||
                           str.indexOf('chrome-extension://') !== -1 ||
                           str.indexOf('moz-extension://') !== -1 ||
                           str.indexOf('ethereum') !== -1 ||
                           str.indexOf('ejbalbakoplchlghecdalmeeeajnimhm') !== -1;
                  }

                  window.addEventListener('unhandledrejection', function(event) {
                    var reason = event && event.reason;
                    var msg = reason ? (reason.message || reason.toString() || '') : '';
                    var stack = (reason && reason.stack) || '';
                    if (shouldIgnore(msg, stack)) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                    }
                  }, true);

                  window.addEventListener('error', function(event) {
                    var msg = event && event.message ? event.message : '';
                    var source = (event && event.filename) || '';
                    if (shouldIgnore(msg, source)) {
                      event.stopImmediatePropagation();
                      event.preventDefault();
                    }
                  }, true);
                })();
              `,
            }}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
        </head>
        <body className="min-h-screen bg-[#FBF9F5] text-[#151816] font-['Plus_Jakarta_Sans',sans-serif] antialiased" suppressHydrationWarning>
          <ExtensionErrorGuard />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
