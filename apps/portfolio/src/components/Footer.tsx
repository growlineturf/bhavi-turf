"use client";

import React from "react";
import Link from "next/link";
import { useTurf } from "@/lib/turfStore";
import { Trophy, MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck } from "lucide-react";

export default function Footer() {
  const { config } = useTurf();

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 text-zinc-400 text-sm py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-white overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.logoUrl || "/logo.png"}
                  alt={config.turfName}
                  className="h-full w-full object-contain p-0.5"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img.src !== window.location.origin + "/logo.png") {
                      img.src = "/logo.png";
                    }
                  }}
                />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                {config.turfName}
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Premium indoor cricket turf with bowling machine in {config.city}. Experience top-quality pitch sessions with effortless instant online slot booking.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${config.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 hover:border-emerald-500/50 transition"
                title="WhatsApp Support"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
              <a
                href={`tel:${config.gpayNumber}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-blue-400 hover:border-blue-500/50 transition"
                title="Call Support"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${config.email || "bhaviturf@gmail.com"}`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 hover:border-amber-500/50 transition"
                title="Email Support"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition">Home Page</Link></li>
              <li><Link href="/book" className="hover:text-white transition font-medium text-blue-400">Book Slots Online</Link></li>
              <li><Link href="/rules" className="hover:text-white transition">Ground Guidelines</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition">Pitch Photo Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Location &amp; Contact</Link></li>
              <li><Link href="/terms" className="hover:text-white transition text-zinc-500">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Venue Details</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span>Main Road, {config.city}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <a href={`tel:${config.gpayNumber}`} className="hover:text-white transition">
                  +91 {config.gpayNumber}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <a href={`mailto:${config.email || "bhaviturf@gmail.com"}`} className="hover:text-white transition">
                  {config.email || "bhaviturf@gmail.com"}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Open {config.openingHours} — All Days</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Payments & Admin Link */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2">GPay & Advance Payment</h3>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                Verified Merchant Booking
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Advance required: <span className="text-emerald-400 font-bold">₹{config.advanceAmount}</span> via GPay. Instant WhatsApp confirmation.
              </p>
              <div className="pt-1">
                <span className="text-[10px] font-mono text-zinc-500 block">UPI ID: {config.upiId}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/admin" className="text-[11px] text-zinc-400 hover:text-white underline">
                Turf Manager Admin Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} {config.turfName} ({config.city}). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-white transition flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Terms &amp; Conditions
            </Link>
            <span className="text-zinc-700">|</span>
            <p className="text-[11px]">Powered by <span className="font-bold text-white tracking-wide">GROWLINE</span></p>
          </div>
        </div>
      </div>
    </footer>
  );
}
