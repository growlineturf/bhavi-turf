"use client";

import React from "react";
import Link from "next/link";
import { useTurf } from "@/lib/turfStore";
import { ChevronLeft, ChevronRight, Home, Ticket } from "lucide-react";

export default function FloatingBottomNav() {
  const { dates, selectedDate, setSelectedDate, slots, selectedSlot } = useTurf();

  const currentIndex = dates.findIndex((d) => d.dateStr === selectedDate);
  const prevDate = currentIndex > 0 ? dates[currentIndex - 1].dateStr : null;
  const nextDate = currentIndex < dates.length - 1 ? dates[currentIndex + 1].dateStr : null;

  const availableCount = slots.filter((s) => s.status === "AVAILABLE").length;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="mx-auto max-w-md pointer-events-auto">
        <div className="flex items-center justify-between rounded-full border border-zinc-800 bg-zinc-950/90 p-2 shadow-2xl backdrop-blur-xl">

          {/* Day Navigation Arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => prevDate && setSelectedDate(prevDate)}
              disabled={!prevDate}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 transition ${
                prevDate
                  ? "bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  : "bg-zinc-950 text-zinc-700 cursor-not-allowed"
              }`}
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => nextDate && setSelectedDate(nextDate)}
              disabled={!nextDate}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 transition ${
                nextDate
                  ? "bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800"
                  : "bg-zinc-950 text-zinc-700 cursor-not-allowed"
              }`}
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Home Icon */}
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            title="Home"
          >
            <Home className="h-4 w-4" />
          </Link>

          {/* Slot Counter Badge */}
          <div className="flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-950/40 px-3 py-1.5 text-[11px] font-extrabold text-blue-400">
            <Ticket className="h-3 w-3" />
            <span>{selectedSlot ? "1 Picked" : `${availableCount} Open`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
