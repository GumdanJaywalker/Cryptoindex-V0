import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/lib/providers/query-provider'
import { PrivyProvider } from '@/components/providers/PrivyProvider'
import { MobileNav, MobileHeader, MobileStatusBar } from '@/components/mobile/mobile-nav'
import { PWAProvider } from '@/lib/pwa/pwa-provider'
import { ToastProvider } from '@/components/notifications/toast-system'
import { PWAInstallPrompt, NetworkStatus } from '@/components/pwa/install-prompt'
import StickyFooter from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

export const metadata: Metadata = {
  title: 'HyperIndex - Crypto Index Trading & Launcher',
  description: 'Create and trade crypto indexes with leverage on Hyper Network. Launch custom indexes, participate in governance, and trade with professional-grade tools.',
  generator: 'HyperIndex',
  applicationName: 'HyperIndex',
  referrer: 'origin-when-cross-origin',
  keywords: ['crypto', 'cryptocurrency', 'index trading', 'index launcher', 'defi', 'leverage', 'trading platform', 'hyper network', 'governance', 'index creation'],
  authors: [{ name: 'HyperIndex Team' }],
  creator: 'HyperIndex',
  publisher: 'HyperIndex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hyperindex.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hyperindex.app',
    title: 'HyperIndex - Crypto Index Trading & Launcher',
    description: 'Create and trade crypto indexes with leverage on Hyper Network. Launch custom indexes, participate in governance, and trade with professional-grade tools.',
    siteName: 'HyperIndex',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'HyperIndex Trading Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HyperIndex - Crypto Index Trading & Launcher',
    description: 'Create and trade crypto indexes with leverage on Hyper Network. Launch custom indexes, participate in governance, and trade with professional-grade tools.',
    images: ['/twitter-image.png'],
    creator: '@hyperindex',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'HyperIndex',
    'application-name': 'HyperIndex',
    'msapplication-TileColor': '#8BD6FF',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#8BD6FF',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Suppress Cross-Origin-Opener-Policy errors from Coinbase Wallet SDK
              const originalError = console.error;
              console.error = (...args) => {
                if (args[0] && args[0].toString().includes('Cross-Origin-Opener-Policy')) {
                  return; // Suppress this specific error
                }
                originalError.apply(console, args);
              };
            `
          }}
        />
      </head>
      <body className="bg-[#101A1D]">
        <QueryProvider>
          <PrivyProvider>
            <PWAProvider>
              <ToastProvider>
              <a href="#main-content" className="skip-link">Skip to content</a>
              {/* Network Status Indicator */}
              <NetworkStatus />

              {/* Desktop Header - hidden on mobile (lg:block) */}
              <div className="hidden lg:block">
                <Header />
              </div>

              {/* Mobile Header - only visible on mobile */}
              <div className="lg:hidden">
                <MobileHeader />
              </div>

              {/* Mobile Status Bar - only visible on mobile */}
              <div className="lg:hidden">
                <MobileStatusBar />
              </div>

              {/* Main Content with proper spacing */}
              <main id="main-content" className="pb-16 md:pb-9 bg-[#101A1D]">
                {children}
              </main>

              {/* Mobile Navigation - only visible on mobile */}
              <div className="lg:hidden">
                <MobileNav />
              </div>

              {/* PWA Install Prompt */}
              <PWAInstallPrompt />

              {/* Sticky Footer (desktop and up) */}
              <StickyFooter />
              </ToastProvider>
            </PWAProvider>
          </PrivyProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
