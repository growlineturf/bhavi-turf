"use client";
import React from "react";
import { useTurf, TimeFilter } from "@/lib/turfStore";

const FILTERS: { key: TimeFilter; label: string; emoji: string; hours: string }[] = [
  { key: "twilight", label: "Twilight", emoji: "🌙", hours: "5–8am" },
  { key: "morning",  label: "Morning",  emoji: "🌅", hours: "8–12pm" },
  { key: "noon",     label: "Noon",     emoji: "☀️", hours: "12–4pm" },
  { key: "evening",  label: "Evening",  emoji: "🌆", hours: "4–11pm" },
];

export default function TimeFilterPills() {
  const { selectedTimeFilter, setSelectedTimeFilter } = useTurf();

  return (
    <div className="flex items-center justify-center gap-1.5 px-4 py-3 border-b border-zinc-900">
      {FILTERS.map((f) => {
        const isActive = selectedTimeFilter === f.key;
        return (
          <button
            key={f.key}
            onClick={() => setSelectedTimeFilter(f.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              isActive
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span>{f.emoji}</span>
            <span>{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}
