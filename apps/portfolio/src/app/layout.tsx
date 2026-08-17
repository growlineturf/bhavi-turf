import type { Metadata } from "next";
import type { ReactNode } from "react";
import { TurfProvider } from "@/lib/turfStore";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "TURF ARENA — Premium Sports Turf Booking",
  description: "Book FIFA-standard artificial turf for Box Cricket & 5-a-Side Football in Tamil Nadu. Instant online slot reservation & GPay advance confirmation.",
  keywords: ["Turf Booking", "Box Cricket", "Football Turf", "Tamil Nadu Turf", "GPay Booking"],
  manifest: "/manifest.json",
  appleWebApp: {
    title: "Turf Arena",
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* ── Theme colour (not covered by metadata API) ── */}
        <meta name="theme-color" content="#09090b" />

        {/* ── iOS icons ── */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />

        {/* ── Service Worker — only register for /admin paths ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator && window.location.pathname.startsWith('/admin')) {
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
