"use client";

import React from "react";
import { useTurf } from "@/lib/turfStore";
import { Calendar } from "lucide-react";

export default function DateStrip() {
  const { dates, selectedDate, setSelectedDate } = useTurf();

  return (
    <div className="w-full bg-zinc-950 py-3 border-b border-zinc-800/80">
      <div className="mx-auto max-w-xl px-4">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
          {dates.map((item) => {
            const isSelected = selectedDate === item.dateStr;
            return (
              <button
                key={item.dateStr}
                onClick={() => setSelectedDate(item.dateStr)}
                className={`flex shrink-0 flex-col items-center justify-center rounded-2xl px-5 py-2.5 transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? "bg-zinc-800 border border-zinc-700 text-white shadow-md shadow-black/40"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
                }`}
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  {item.dayName}
                </span>
                <span className={`text-sm font-extrabold mt-0.5 ${isSelected ? "text-white" : "text-zinc-300"}`}>
                  {item.dayNum}
                </span>
                {item.isToday && (
                  <span className="mt-1 h-1 w-1 rounded-full bg-blue-500"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
