"use client";

import React from "react";
import { useTurf, TimeFilter } from "@/lib/turfStore";

export default function TimeFilterPills() {
  const { selectedTimeFilter, setSelectedTimeFilter } = useTurf();

  const options: { id: TimeFilter; label: string; icon: string; time: string }[] = [
    { id: "twilight", label: "Twilight", icon: "🌆", time: "5-8 AM" },
    { id: "morning", label: "Morning", icon: "🌅", time: "8-12 PM" },
    { id: "noon", label: "Noon", icon: "☀️", time: "12-4 PM" },
    { id: "evening", label: "Evening", icon: "🌙", time: "4-12 AM" },
  ];

  return (
    <div className="w-full bg-zinc-950 py-3 border-b border-zinc-800/60">
      <div className="mx-auto max-w-xl px-4">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {options.map((opt) => {
            const isSelected = selectedTimeFilter === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedTimeFilter(opt.id)}
                className={`btn-pill flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                  isSelected
                    ? "bg-zinc-800 text-white shadow border border-zinc-700/80"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span className="text-sm">{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
