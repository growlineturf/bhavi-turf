"use client";
import React, { useRef } from "react";
import { useTurf } from "@/lib/turfStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DateStrip() {
  const { dates, selectedDate, setSelectedDate } = useTurf();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 120 : -120, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center gap-1 px-2 py-3 border-b border-zinc-900">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Scrollable date row */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth no-scrollbar flex-1"
        style={{ scrollbarWidth: "none" }}
      >
        {dates.map((d) => {
          const isSelected = d.dateStr === selectedDate;
          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl px-4 py-2.5 min-w-[72px] transition-all duration-200 ${
                isSelected
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
                  isSelected ? "text-blue-400" : "text-zinc-600"
                }`}
              >
                {d.isToday ? "Today" : d.dayName}
              </span>
              <span className={`text-sm font-black leading-none ${isSelected ? "text-white" : "text-zinc-400"}`}>
                {d.dayNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
