"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DateStrip from "@/components/DateStrip";
import TimeFilterPills from "@/components/TimeFilterPills";
import SlotGrid from "@/components/SlotGrid";
import BookingModal from "@/components/BookingModal";
import FloatingBottomNav from "@/components/FloatingBottomNav";

import { useTurf } from "@/lib/turfStore";

export default function BookingPage() {
  const { config } = useTurf();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24 selection:bg-blue-600">
      <Navbar />

      {/* Header Banner */}
      <div className="border-b border-zinc-900 bg-zinc-950 py-6 px-4 text-center">
        <div className="mx-auto max-w-xl space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full">
            Real-Time Slot Availability
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white pt-2">
            Select Your Playing Slot
          </h1>
          <p className="text-xs text-zinc-400">
            {config.turfName} • {config.city}
          </p>
        </div>
      </div>

      {/* 1. DATE STRIP */}
      <DateStrip />

      {/* 2. TIME-OF-DAY FILTER PILLS */}
      <TimeFilterPills />

      {/* 3. SLOT GRID */}
      <SlotGrid />

      {/* Checkout Sheet Modal */}
      <BookingModal />

      {/* 4. BOTTOM FLOATING NAV BAR */}
      <FloatingBottomNav />


      <Footer />
    </div>
  );
}
