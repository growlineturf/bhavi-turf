"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTurf } from "@/lib/turfStore";
import { Trophy, Menu, X, Calendar, Settings, ChevronRight } from "lucide-react";

export default function Navbar() {
  const { config } = useTurf();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Book Slots", href: "/book" },
    { name: "Rules", href: "/rules" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Logo mark: custom image or default icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
            {config.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.logoUrl}
                alt={config.turfName}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <Trophy className="h-5 w-5" />
            )}
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white block leading-none">
              {config.logoText || config.turfName}
            </span>
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest block mt-0.5">
              {config.city}
            </span>
          </div>
        </Link>


        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-3 py-1.5 backdrop-blur">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-zinc-800 text-white shadow"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
            title="Admin Dashboard"
          >
            <Settings className="h-4 w-4" />
          </Link>
          
          <Link
            href="/book"
            className="btn-pill flex items-center gap-2 bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 hover:shadow-blue-500/40 transition"
          >
            <Calendar className="h-4 w-4" />
            Book Now
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/book"
            className="btn-pill bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-600/20"
          >
            Book
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  pathname === link.href
                    ? "bg-blue-600/15 text-blue-400 border border-blue-500/30"
                    : "text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="h-4 w-4 text-zinc-600" />
              </Link>
            ))}
            
            <div className="pt-2 border-t border-zinc-900 flex justify-between items-center">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 py-2 px-2"
              >
                <Settings className="h-3.5 w-3.5" />
                Admin Settings
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
