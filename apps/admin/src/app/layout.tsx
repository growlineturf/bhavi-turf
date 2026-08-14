import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turf Arena — Admin",
  description: "Private admin panel for Turf Arena. Not for public access.",
  robots: "noindex, nofollow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0a0a0a', color: '#f9fafb' }}>
        {children}
      </body>
    </html>
  );
}
