"use client";

import React from "react";
import { useTurf } from "@/lib/turfStore";
import { ArrowLeft, ArrowRight, Home, Sparkles } from "lucide-react";

export default function FloatingBottomNav() {
  const { dates, selectedDate, setSelectedDate } = useTurf();

  const idx = dates.findIndex((d) => d.dateStr === selectedDate);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-zinc-950/92 backdrop-blur-xl border-t border-zinc-900">
      {/* Prev */}
      <button
        onClick={() => idx > 0 && setSelectedDate(dates[idx - 1].dateStr)}
        disabled={idx <= 0}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-25 transition"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>

      {/* Center */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-xs font-bold text-white hover:bg-zinc-700 transition">
          <Sparkles className="h-3.5 w-3.5 text-blue-400" />
          Ask
        </button>
        <a
          href="/"
          className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
        >
          <Home className="h-4 w-4" />
        </a>
      </div>

      {/* Next */}
      <button
        onClick={() => idx < dates.length - 1 && setSelectedDate(dates[idx + 1].dateStr)}
        disabled={idx >= dates.length - 1}
        className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-25 transition"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
