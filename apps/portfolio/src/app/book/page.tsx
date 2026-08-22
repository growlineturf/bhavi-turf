"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SlotGrid from "@/components/SlotGrid";
import FiveOverBooking from "@/components/FiveOverBooking";
import InstallPWABanner from "@/components/InstallPWABanner";
import { useTurf } from "@/lib/turfStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
type Period = "twilight" | "morning" | "noon" | "evening";

const PERIODS: { key: Period; label: string; emoji: string }[] = [
  { key: "twilight", label: "Twilight", emoji: "🌙" },
  { key: "morning",  label: "Morning",  emoji: "🌅" },
  { key: "noon",     label: "Noon",     emoji: "☀️" },
  { key: "evening",  label: "Evening",  emoji: "🌆" },
];

/* ─── Generate next 7 dates ──────────────────────────────── */
function getDates() {
  const days  = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months= ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const base  = new Date();
  base.setHours(0,0,0,0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const y  = d.getFullYear();
    const mo = String(d.getMonth()+1).padStart(2,"0");
    const dd = String(d.getDate()).padStart(2,"0");
    return {
      dateStr: `${y}-${mo}-${dd}`,
      dayName: i === 0 ? "Today" : days[d.getDay()],
      dayNum:  `${d.getDate()} ${months[d.getMonth()]}`,
    };
  });
}

/* ════════════════════════════════════════════════════════════
   BOOK PAGE — all state local, no context needed for interaction
═══════════════════════════════════════════════════════════════ */
export default function BookingPage() {
  const { config } = useTurf();
  const [DATES] = useState(getDates);               // lazy init — client only, no hydration mismatch

  const [selectedDate, setSelectedDate] = useState(() => getDates()[0].dateStr);
  const [period, setPeriod]             = useState<Period>("evening");

  const dateIdx = DATES.findIndex(d => d.dateStr === selectedDate);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <Navbar />
      {/* Floating install prompt — shows automatically on Android & iOS */}
      <InstallPWABanner appName={config.pwaName || "BHAVI"} />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="border-b border-zinc-900 py-5 px-4 text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-950/60 border border-blue-500/30 px-3 py-1 rounded-full">
          Real-Time Slot Availability
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white pt-2">
          Select Your Playing Slot
        </h1>
        <p className="text-xs text-zinc-500 mt-1">{config.turfName} · {config.city}</p>
      </div>

      {/* ── DATE STRIP ─────────────────────────────────────── */}
      <div className="flex items-center border-b border-zinc-900 px-1 py-2">
        {/* Prev arrow */}
        <button
          onClick={() => dateIdx > 0 && setSelectedDate(DATES[dateIdx - 1].dateStr)}
          disabled={dateIdx <= 0}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-20 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Scrollable pills */}
        <div className="flex gap-2 overflow-x-auto flex-1 px-1" style={{ scrollbarWidth: "none" }}>
          {DATES.map(d => {
            const active = d.dateStr === selectedDate;
            return (
              <button
                key={d.dateStr}
                onClick={() => setSelectedDate(d.dateStr)}
                className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl px-4 py-2.5 min-w-[72px] min-h-[52px] transition-all ${
                  active ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? "text-blue-400" : "text-zinc-600"}`}>
                  {d.dayName}
                </span>
                <span className={`text-sm font-black leading-tight mt-0.5 ${active ? "text-white" : "text-zinc-400"}`}>
                  {d.dayNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={() => dateIdx < DATES.length - 1 && setSelectedDate(DATES[dateIdx + 1].dateStr)}
          disabled={dateIdx >= DATES.length - 1}
          className="flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-20 transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* ── 5-OVER QUICK BOOKING ─────────────────────────────── */}
      <FiveOverBooking
        date={selectedDate}
        config={{
          gpayNumber:     config.gpayNumber,
          advanceAmount:  config.advanceAmount,
          whatsappNumber: config.whatsappNumber,
          turfName:       config.turfName,
        }}
      />

      {/* ── TIME PERIOD FILTER ──────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 border-b border-zinc-900">
        {PERIODS.map(p => {
          const active = period === p.key;
          return (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[36px] ${
                active ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span>{p.emoji}</span>
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SLOT GRID ──────────────────────────────────────── */}
      <SlotGrid
        date={selectedDate}
        period={period}
        config={{
          gpayNumber:    config.gpayNumber,
          advanceAmount: config.advanceAmount,
          whatsappNumber: config.whatsappNumber,
          turfName:      config.turfName,
        }}
      />

      {/* Spacer for floating nav */}
      <div className="h-20" />
      <Footer />
    </div>
  );
}
