"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTurf } from "@/lib/turfStore";
import Link from "next/link";
import { Shield, Clock, AlertTriangle, CheckCircle, CreditCard, ChevronRight } from "lucide-react";

export default function RulesPage() {
  const { config } = useTurf();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-600">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 py-12 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Fair Play & Safety</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Ground Rules & Policies</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Please review our venue guidelines before stepping onto the pitch at {config.turfName}.
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              icon: Clock,
              title: "1. Arrival & Slot Duration",
              items: [
                "Players must arrive at least 15 minutes before the scheduled slot start time.",
                "Slot timings are strictly enforced. Extra time must be requested and booked subject to availability.",
                "Warm-ups must be conducted inside designated warmup zones outside active play.",
              ],
            },
            {
              icon: CreditCard,
              title: "2. GPay Advance & Cancellation Policy",
              items: [
                `Advance payment of ₹${config.advanceAmount} via GPay (${config.gpayNumber}) is required to hold your slot.`,
                "Cancellations made 6+ hours before the slot are eligible for free re-scheduling.",
                "No-shows or cancellations under 2 hours will forfeit the advance payment.",
              ],
            },
            {
              icon: AlertTriangle,
              title: "3. Venue Safety & Code of Conduct",
              items: [
                "Smoking, alcohol, and chewing gum are strictly prohibited inside the pitch enclosure.",
                "Unsportsmanlike conduct or aggressive physical disputes will result in immediate venue ban.",
                "Keep the dugout clean. Dispose of water bottles in designated recycling bins.",
              ],
            },
          ].map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-bold text-white">{section.title}</h2>
                </div>

                <ul className="space-y-2.5 pl-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/book"
            className="btn-pill inline-flex items-center gap-2 bg-blue-600 px-8 py-3.5 text-xs font-extrabold text-white shadow-xl hover:bg-blue-500 transition"
          >
            I Understand, Let's Book →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
