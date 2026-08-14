"use client";

import React from "react";
import { useTurf, TurfSlot } from "@/lib/turfStore";
import { Sparkles, Clock, AlertCircle } from "lucide-react";

export default function SlotGrid() {
  const { slots, selectedTimeFilter, selectedSlot, setSelectedSlot, config } = useTurf();

  // Filter slots belonging to the current time block
  const filteredSlots = slots.filter((s) => s.timeFilter === selectedTimeFilter);

  // Group slots into 4-hour blocks
  const groupHours = Array.from(new Set(filteredSlots.map((s) => s.hour)));
  groupHours.sort((a, b) => a - b);

  // Chunk into 4-hour blocks for continuous pill container rows
  const rows: number[][] = [];
  for (let i = 0; i < groupHours.length; i += 4) {
    rows.push(groupHours.slice(i, i + 4));
  }

  const formatHourLabel = (h: number) => {
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 ? "pm" : "am";
    return `${displayH} ${ampm}`;
  };

  return (
    <div className="w-full bg-zinc-950 py-6 px-4">
      <div className="mx-auto max-w-xl space-y-8">
        {/* Dynamic rate banner for selected time filter */}
        <div className="flex items-center justify-between rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span className="font-medium capitalize">{selectedTimeFilter} Rate:</span>
          </div>
          <span className="font-extrabold text-blue-400">
            ₹{config.hourlyRates[selectedTimeFilter]} / hr
          </span>
        </div>

        {rows.length === 0 ? (
          <div className="py-12 text-center text-zinc-500 text-xs">
            No slots available for this time block.
          </div>
        ) : (
          rows.map((rowHours, rowIndex) => (
            <div key={rowIndex} className="space-y-3">
              {/* Hour Labels Row above container with dot separators */}
              <div className="flex items-center justify-between px-3 text-xs font-semibold text-zinc-400">
                {rowHours.map((h, idx) => (
                  <React.Fragment key={h}>
                    <span className="capitalize">{formatHourLabel(h)}</span>
                    {idx < rowHours.length - 1 && (
                      <span className="h-1 w-1 rounded-full bg-zinc-700"></span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* ONE continuous pill-shaped container split into 4 equal segments */}
              <div className="grid grid-cols-4 rounded-full border border-zinc-800 bg-zinc-900/90 p-1 shadow-lg overflow-hidden relative">
                {rowHours.map((h, idx) => {
                  const hourSubSlots = filteredSlots.filter((s) => s.hour === h);
                  
                  return (
                    <div
                      key={h}
                      className={`relative flex items-center justify-center p-1 ${
                        idx < rowHours.length - 1 ? "border-r border-zinc-800" : ""
                      }`}
                    >
                      {/* 4 sub-slots per hour (15-min granularity) */}
                      <div className="grid grid-cols-4 gap-0.5 w-full h-11 items-center">
                        {hourSubSlots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;
                          const isBookedOrPast = slot.status === "BOOKED" || slot.status === "PAST" || slot.status === "BLOCKED";

                          if (isBookedOrPast) {
                            return (
                              <button
                                key={slot.id}
                                disabled
                                className="h-full w-full rounded-md bg-hazard-stripes opacity-40 cursor-not-allowed transition"
                                title={`Unavailable - ${slot.timeLabel}`}
                              />
                            );
                          }

                          if (isSelected) {
                            return (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(null)}
                                className="h-full w-full rounded-md bg-blue-600 shadow-md shadow-blue-600/40 text-white font-bold text-[10px] flex items-center justify-center animate-in zoom-in-95 duration-100"
                                title={`Selected: ${slot.timeLabel} - ₹${slot.price}`}
                              >
                                {slot.minute === 0 ? "00" : slot.minute}
                              </button>
                            );
                          }

                          return (
                            <button
                              key={slot.id}
                              onClick={() => setSelectedSlot(slot)}
                              className="h-full w-full rounded-md border-2 border-blue-500/80 bg-blue-950/20 hover:bg-blue-600/30 hover:border-blue-400 text-blue-300 font-semibold text-[10px] flex items-center justify-center transition active:scale-95"
                              title={`Available: ${slot.timeLabel} - ₹${slot.price}`}
                            >
                              {slot.minute === 0 ? "00" : slot.minute}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Helper legend */}
              <div className="flex items-center justify-between text-[10px] text-zinc-500 px-2 pt-0.5">
                <span>Sub-slots: :00, :15, :30, :45</span>
                <span>Click slot to pick</span>
              </div>
            </div>
          ))
        )}

        {/* Status Legend */}
        <div className="flex items-center justify-center gap-6 pt-4 border-t border-zinc-900 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-md border-2 border-blue-500 bg-blue-950/20"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-md bg-blue-600"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rounded-md bg-hazard-stripes opacity-50"></div>
            <span>Booked / Past</span>
          </div>
        </div>
      </div>
    </div>
  );
}
