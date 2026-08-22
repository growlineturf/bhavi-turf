"use client";

import React, { useState } from "react";
import { Clock, Zap } from "lucide-react";

interface BookingConfig {
  gpayNumber: string;
  advanceAmount: number;
  whatsappNumber: string;
  turfName: string;
}

interface Props {
  date: string;
  config: BookingConfig;
}

const PRICE   = 100;
const SERVICE = "5 Over \u2013 30 Balls";

/* Simple time validator: accepts "6 PM", "6:30 PM", "18:00", "18:30" */
function isValidTime(t: string): boolean {
  return /^\d{1,2}(:\d{2})?\s*(AM|PM|am|pm)?$/.test(t.trim());
}

function fmtDate(d: string) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [y, m, day] = d.split("-").map(Number);
  return `${day} ${months[m - 1]} ${y}`;
}

/* ======================================================
   MAIN CARD
====================================================== */
export default function FiveOverBooking({ date, config }: Props) {
  const [time, setTime]           = useState("");
  const [timeErr, setTimeErr]     = useState("");
  const [showSheet, setShowSheet] = useState(false);

  const handleBook = () => {
    if (!time.trim()) { setTimeErr("Please enter a time \u2014 e.g. 6:30 PM"); return; }
    if (!isValidTime(time)) { setTimeErr("Invalid format. Example: 6:30 PM or 18:30"); return; }
    setTimeErr("");
    setShowSheet(true);
  };

  return (
    <>
      {/* \u2500\u2500 Card \u2500\u2500 */}
      <div className="border-b border-zinc-900 px-4 py-3 bg-amber-950/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400 mb-2">
            \u26a1 Quick Practice Session
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {/* Service badge */}
            <div className="flex items-center gap-2 bg-zinc-900 border border-amber-700/40 rounded-2xl px-4 py-2.5">
              <Zap className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="text-sm font-bold text-white">{SERVICE}</span>
              <span className="text-sm font-black text-amber-400 ml-1">\u20b9{PRICE}</span>
            </div>

            {/* Time input */}
            <div className="flex items-center gap-2 flex-1 min-w-[190px]">
              <Clock className="h-4 w-4 text-zinc-500 shrink-0" />
              <span className="text-xs font-bold text-zinc-400 shrink-0">Time:</span>
              <input
                value={time}
                onChange={e => { setTime(e.target.value); setTimeErr(""); }}
                placeholder="e.g. 6:30 PM"
                style={{ fontSize: "16px" }}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none transition"
              />
            </div>

            {/* Book button */}
            <button
              onClick={handleBook}
              className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-extrabold px-5 py-2.5 rounded-full text-xs transition shrink-0"
            >
              Book 5 Over \u2192
            </button>
          </div>

          {timeErr && (
            <p className="text-red-400 text-[11px] mt-1.5 pl-1">{timeErr}</p>
          )}
        </div>
      </div>

      {/* \u2500\u2500 Bottom sheet \u2500\u2500 */}
      {showSheet && (
        <FiveOverSheet
          date={date}
          time={time}
          config={config}
          onClose={() => setShowSheet(false)}
        />
      )}
    </>
  );
}

/* ======================================================
   BOOKING SHEET
====================================================== */
function FiveOverSheet({
  date, time, config, onClose,
}: {
  date: string;
  time: string;
  config: BookingConfig;
  onClose: () => void;
}) {
  const [step, setStep]         = useState<"info" | "form" | "done">("info");
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [copied, setCopied]     = useState(false);

  const copyText = (t: string) => {
    navigator.clipboard.writeText(t).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/bookings/fiveover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date, time,
          customerName: name,
          customerPhone: phone,
          bookingType: "5_over",
          serviceName: SERVICE,
          price: PRICE,
          gpayNumber: config.gpayNumber,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Booking failed. Please try again.");
      }
      setStep("done");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Booking failed. Try again.");
    } finally { setLoading(false); }
  };

  const waText = encodeURIComponent(
    `Hi ${config.turfName}! \ud83c\udfd0\n\n` +
    `I've booked *${SERVICE}*.\n\n` +
    `\ud83d\udcc5 *Date:* ${fmtDate(date)}\n` +
    `\u23f0 *Time:* ${time}\n` +
    `\ud83d\udc64 *Name:* ${name}\n` +
    `\ud83d\udcde *Phone:* ${phone}\n\n` +
    `\ud83d\udcb0 *Paid:* \u20b9${PRICE} via GPay to ${config.gpayNumber}\n\n`
  );
  const waUrl = `https://wa.me/91${config.whatsappNumber.replace(/\D/g,"").slice(-10)}?text=${waText}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={step === "done" ? undefined : onClose}
      />

      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-[#0f0f0f] border-t border-zinc-800 shadow-2xl overflow-y-auto overflow-x-hidden"
        style={{ maxHeight: "92dvh", paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
      >
        <div className="w-full max-w-lg mx-auto px-4 pt-4 space-y-4">
          <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-2" />

          {/* \u2500\u2500 STEP 1: Info \u2500\u2500 */}
          {step === "info" && (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Service</p>
                  <p className="text-lg font-black text-white leading-tight">{SERVICE}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">\u23f0 {time} \u00b7 {fmtDate(date)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-black text-white">\u20b9{PRICE}</p>
                </div>
              </div>

              <button
                onClick={() => copyText(config.gpayNumber)}
                className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 border transition active:scale-95 ${
                  copied ? "bg-emerald-600/20 border-emerald-600/50" : "bg-zinc-900 border-zinc-800"
                }`}
              >
                <div className="text-left min-w-0">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Pay via GPay</p>
                  <p className="text-lg font-black text-emerald-400">\u20b9{PRICE}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    {copied ? "\u2713 Copied!" : "Tap to Copy"}
                  </p>
                  <p className={`text-sm font-black font-mono ${copied ? "text-emerald-400" : "text-white"}`}>
                    {config.gpayNumber}
                  </p>
                </div>
              </button>

              <button
                onClick={() => setStep("form")}
                className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-black font-extrabold py-4 rounded-full text-sm transition"
              >
                Continue to Book \u2192
              </button>
            </>
          )}

          {/* \u2500\u2500 STEP 2: Form \u2500\u2500 */}
          {step === "form" && (
            <form onSubmit={submit} className="space-y-3 pb-6">
              <h3 className="text-sm font-black text-white">Your Details</h3>
              <input
                required placeholder="Full Name" value={name}
                onChange={e => setName(e.target.value)}
                style={{ fontSize: "16px" }}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
              <input
                required type="tel" inputMode="numeric" placeholder="Phone Number" value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ fontSize: "16px" }}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3.5 text-white placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
              />
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button
                type="submit" disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-extrabold py-4 rounded-full text-sm transition"
              >
                {loading ? "Booking\u2026" : "Confirm Booking"}
              </button>
              <button type="button" onClick={() => setStep("info")}
                className="w-full text-xs text-zinc-600 hover:text-zinc-400 py-1 transition">
                \u2190 Back
              </button>
            </form>
          )}

          {/* \u2500\u2500 STEP 3: Done \u2500\u2500 */}
          {step === "done" && (
            <div className="space-y-3 pb-4">
              <div className="text-center pt-1">
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center text-3xl border border-emerald-500/30 mb-3">\u2705</div>
                <p className="font-black text-white text-xl">Booking Confirmed!</p>
                <p className="text-xs text-zinc-500 mt-1">Pay \u20b9{PRICE} via GPay to lock your session</p>
              </div>

              {/* Details table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {([
                  ["Service", SERVICE],
                  ["Date",    fmtDate(date)],
                  ["Time",    time],
                  ["Name",    name],
                  ["Phone",   phone],
                  ["Amount",  `\u20b9${PRICE}`],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between px-4 py-2.5 border-b border-zinc-800/70 last:border-0 gap-3">
                    <span className="text-[11px] text-zinc-500 shrink-0 pt-0.5 w-16">{label}</span>
                    <span className="text-xs font-bold text-white text-right min-w-0 break-words leading-snug flex-1">{value}</span>
                  </div>
                ))}
              </div>

              {/* Pay box */}
              <div className="bg-amber-950/40 border border-amber-700/50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-black text-amber-400">\u26a1 Pay \u20b9{PRICE} to Confirm</p>
                <div className="flex items-end justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">AMOUNT</p>
                    <p className="text-3xl font-black text-white">\u20b9{PRICE}</p>
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">GPAY / UPI</p>
                    <p className="text-sm font-black text-white font-mono break-all">{config.gpayNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyText(config.gpayNumber)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 border transition active:scale-95 ${
                    copied ? "bg-emerald-600/20 border-emerald-600/50" : "bg-zinc-900 border-zinc-700"
                  }`}
                >
                  <span className="text-sm font-black text-white font-mono min-w-0 mr-2 truncate">{config.gpayNumber}</span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 transition ${copied ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"}`}>
                    {copied ? "\u2713 Copied!" : "Copy"}
                  </span>
                </button>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Open GPay \u2192 <strong className="text-white">Pay \u20b9{PRICE}</strong> to the number above \u2192 Confirm on WhatsApp \u2193
                </p>
              </div>

              <a href={waUrl} target="_blank" rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 rounded-full text-sm transition">
                \ud83d\udcf2 Confirm on WhatsApp
              </a>

              <button onClick={onClose}
                className="w-full text-xs text-zinc-600 hover:text-zinc-400 py-2 transition">
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
