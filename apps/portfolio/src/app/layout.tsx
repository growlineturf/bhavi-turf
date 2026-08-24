import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { TurfProvider } from "@/lib/turfStore";
import Providers from "./providers";
import "./globals.css";

const SITE_URL = "https://www.bhaviturf.in";
const SITE_NAME = "BHAVI TURF";
const DESCRIPTION =
  "Book premium indoor cricket turf slots online in Neyveli, Tamil Nadu. BHAVI TURF offers a professional cricket pitch with a bowling machine, instant GPay booking, and WhatsApp confirmation. Available daily from 6 AM to 11 PM.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "BHAVI TURF — Indoor Cricket Turf Booking in Neyveli",
    template: "%s | BHAVI TURF Neyveli",
  },
  description: DESCRIPTION,
  keywords: [
    "BHAVI TURF",
    "indoor cricket turf Neyveli",
    "cricket turf booking Neyveli",
    "box cricket Neyveli",
    "indoor turf Neyveli Tamil Nadu",
    "cricket pitch Neyveli",
    "bowling machine Neyveli",
    "turf booking online Neyveli",
    "cricket slot booking Neyveli",
    "Mannan Nagar turf",
    "bhaviturf.in",
    "indoor cricket turf Tamil Nadu",
    "cricket ground Neyveli",
    "5 over cricket Neyveli",
    "cricket turf GPay booking",
  ],

  /* ── Canonical & Robots ─────────────────────────────── */
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  /* ── Open Graph (Facebook / WhatsApp previews) ──────── */
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "BHAVI TURF — Indoor Cricket Turf Booking in Neyveli",
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "BHAVI TURF Indoor Cricket Turf — Neyveli, Tamil Nadu",
      },
    ],
  },

  /* ── Twitter / X Card ──────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "BHAVI TURF — Indoor Cricket Turf Booking in Neyveli",
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.jpg`],
  },

  /* ── PWA / Apple ────────────────────────────────────── */
  manifest: "/manifest.json",
  appleWebApp: {
    title: "BHAVI TURF",
    capable: true,
    statusBarStyle: "black-translucent",
  },

  /* ── Icons ──────────────────────────────────────────── */
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-192.png",
  },

  /* ── Author / Publisher ─────────────────────────────── */
  authors: [{ name: "BHAVI TURF", url: SITE_URL }],
  creator: "BHAVI TURF",
  publisher: "BHAVI TURF",
  category: "Sports & Recreation",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/* ── Server-side settings fetch — eliminates flash of default hero ── */
async function fetchInitialSettings() {
  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)
    const rows = await sql`SELECT * FROM settings WHERE id='singleton' LIMIT 1`
    return rows[0] ?? null
  } catch { return null }
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const initialSettings = await fetchInitialSettings()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "BHAVI TURF",
    "alternateName": "Bhavi Indoor Cricket Turf",
    "description": "Premium indoor cricket turf with professional bowling machine in Neyveli, Tamil Nadu. Book slots online instantly.",
    "url": "https://www.bhaviturf.in",
    "telephone": "+91-9876543210",
    "email": "support@bhaviturf.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Road, Mannan Nagar",
      "addressLocality": "Neyveli",
      "addressRegion": "Tamil Nadu",
      "postalCode": "607803",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "11.5556",
      "longitude": "79.4770"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
        "opens": "06:00",
        "closes": "23:00"
      }
    ],
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "GPay, UPI, Cash",
    "sport": "Cricket",
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Bowling Machine", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Indoor Pitch", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Online Booking", "value": true }
    ],
    "hasMap": "https://maps.google.com/?q=Mannan+Nagar+Neyveli+Tamil+Nadu",
    "sameAs": [
      "https://www.bhaviturf.in"
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* ── JSON-LD Structured Data ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* ── Dynamic consumer manifest (name editable via admin settings) ── */}
        <link rel="manifest" href="/api/manifest/consumer" />

        {/* ── Theme colour ── */}
        <meta name="theme-color" content="#09090b" />
        <meta name="apple-mobile-web-app-title" content="BHAVI" />

        {/* ── Geo tags for local SEO ── */}
        <meta name="geo.region" content="IN-TN" />
        <meta name="geo.placename" content="Neyveli, Tamil Nadu" />
        <meta name="geo.position" content="11.5556;79.4770" />
        <meta name="ICBM" content="11.5556, 79.4770" />

        {/* ── Language ── */}
        <meta httpEquiv="content-language" content="en-IN" />

        {/* ── iOS icons ── */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.png" />

        {/* ── Service Workers ── */}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              // Consumer SW for all non-admin pages
              if (!window.location.pathname.startsWith('/admin')) {
                navigator.serviceWorker.register('/sw-consumer.js', { scope: '/' })
                  .catch(function(e){ console.log('[SW-consumer] failed', e); });
              }
              // Admin SW for admin pages
              if (window.location.pathname.startsWith('/admin')) {
                navigator.serviceWorker.register('/sw.js', { scope: '/admin' })
                  .catch(function(e){ console.log('[SW-admin] failed', e); });
              }
            });
          }
        `}} />
      </head>
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <Providers>
          <TurfProvider initialSettings={initialSettings}>{children}</TurfProvider>
        </Providers>
      </body>
    </html>
  );
}
