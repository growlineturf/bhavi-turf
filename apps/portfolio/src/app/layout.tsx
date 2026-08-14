import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";
import { TurfProvider } from "@/lib/turfStore";
import Providers from "./providers";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TURF ARENA — Premium Sports Turf Booking",
  description: "Book FIFA-standard artificial turf for Box Cricket & 5-a-Side Football in Tamil Nadu. Instant online slot reservation & GPay advance confirmation.",
  keywords: ["Turf Booking", "Box Cricket", "Football Turf", "Tamil Nadu Turf", "GPay Booking"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} dark`}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <Providers>
          <TurfProvider>{children}</TurfProvider>
        </Providers>
      </body>
    </html>
  );
}
