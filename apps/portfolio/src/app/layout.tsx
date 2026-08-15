import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TurfProvider } from "@/lib/turfStore";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TURF ARENA — Premium Sports Turf Booking",
  description: "Book FIFA-standard artificial turf for Box Cricket & 5-a-Side Football in Tamil Nadu. Instant online slot reservation & GPay advance confirmation.",
  keywords: ["Turf Booking", "Box Cricket", "Football Turf", "Tamil Nadu Turf", "GPay Booking"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        {/* ── PWA core ── */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09090b" />

        {/* ── iOS / Safari PWA ── */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Turf Admin" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />

        {/* ── Viewport ── */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* ── Service Worker registration ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js')
                .then(function(r){ console.log('[SW] registered', r.scope); })
                .catch(function(e){ console.log('[SW] failed', e); });
            });
          }
        `}} />
      </head>
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <Providers>
          <TurfProvider>{children}</TurfProvider>
        </Providers>
      </body>
    </html>
  );
}

