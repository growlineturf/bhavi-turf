"use client";

import React, { useState, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   TYPES
════════════════════════════════════════════════════════════════ */
type SlotStatus = "available" | "booked" | "pending" | "blocked";
type Sport = "Cricket" | "Football";
export type Period = "twilight" | "morning" | "noon" | "evening";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  price: number;
  sport: Sport;
}

interface Segment {
  slots: Slot[];
  effectiveStatus: "available" | "unavailable";
  isSelected: boolean;
}

interface BookingConfig {
  gpayNumber: string;
  advanceAmount: number;
  whatsappNumber: string;
  turfName: string;
}

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
════════════════════════════════════════════════════════════════ */
const PERIOD_HOURS: Record<Period, number[]> = {
  twilight: [5, 6, 7],
  morning:  [8, 9, 10, 11],
  noon:     [12, 13, 14, 15],
  evening:  [16, 17, 18, 19, 20, 21, 22],
};

const SPORTS: Sport[] = ["Cricket", "Football"];

const HATCH = `repeating-linear-gradient(-45deg,#161616,#161616 4px,#1f1f1f 4px,#1f1f1f 9px)`;

/* ═══════════════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════════════════ */
function toMins(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m; }
function fmt12h(h: number) { const p = h >= 12 ? "pm" : "am"; const hr = h > 12 ? h - 12 : h === 0 ? 12 : h; return `${hr}${p}`; }
function fmtFull(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${String(m).padStart(2,"0")} ${h >= 12 ? "PM" : "AM"}`;
}
function fmtDur(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h} hr${h > 1 ? "s" : ""}`;
}

/** Run-length encode row slots → segments (merge consecutive same-status same-selected) */
function buildSegments(rowSlots: Slot[], lo: number | null, hi: number | null): Segment[] {
  const segs: Segment[] = [];
  for (const slot of rowSlots) {
    const eff: "available" | "unavailable" = slot.status === "available" ? "available" : "unavailable";
    const m = toMins(slot.startTime);
    const sel = eff === "available" && lo !== null && hi !== null && m >= lo && m <= hi;
    const last = segs[segs.length - 1];
    if (last && last.effectiveStatus === eff && last.isSelected === sel) {
      last.slots.push(slot);
    } else {
      segs.push({ slots: [slot], effectiveStatus: eff, isSelected: sel });
    }
  }
  return segs;
}

/* ═══════════════════════════════════════════════════════════════
   SEGMENT BLOCK — same visual as before, click per 30-min zone
════════════════════════════════════════════════════════════════ */
function SegmentBlock({
  segment,
  onSlotTap,
}: {
  segment: Segment;
  onSlotTap: (slot: Slot) => void;
}) {
  const n   = segment.slots.length;
  const avail = segment.effectiveStatus === "available";
  const sel   = segment.isSelected;

  return (
    <div className="relative" style={{ flex: n, minWidth: 0 }}>
      {/* ── Visual pill / hatch (unchanged design) ── */}
      <div
        className={[
          "mx-[2px] h-14 relative overflow-hidden",
          avail && !sel ? "rounded-full border border-blue-500/40 bg-blue-950/10" : "",
          avail &&  sel ? "rounded-full bg-blue-600"                              : "",
          !avail        ? "rounded-sm"                                            : "",
        ].join(" ")}
        style={!avail ? { backgroundImage: HATCH } : undefined}
      >
        {/* 30-min dividers inside available pill */}
        {avail && n > 1 && Array.from({ length: n - 1 }).map((_, i) => (
          <div key={i} className="absolute top-[18%] bottom-[18%] w-px"
            style={{ left: `${((i + 1) / n) * 100}%`, background: sel ? "rgba(255,255,255,0.18)" : "rgba(59,130,246,0.22)" }} />
        ))}

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {avail && !sel && <span className="text-[9px] font-semibold text-blue-400/60 select-none">{fmtDur(n * 30)}</span>}
          {avail &&  sel && <span className="text-[9px] font-bold  text-white/80 select-none">✓ {fmtDur(n * 30)}</span>}
          {!avail        && <span className="text-[9px] text-zinc-700 select-none">✕</span>}
        </div>
      </div>

      {/* ── Tap zones — one per 30-min slot (absolute overlay) ── */}
      <div className="absolute inset-0 flex">
        {segment.slots.map((slot) => (
          <div
            key={slot.id}
            className="flex-1 h-full"
            style={{ cursor: avail ? "pointer" : "not-allowed" }}
            onClick={() => avail && onSlotTap(slot)}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOOKING SHEET (bottom drawer) — unchanged
════════════════════════════════════════════════════════════════ */
/* ── Format date string "2026-08-15" → "15 Aug 2026" ── */
function fmtDate(d: string) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [y, m, day] = d.split("-").map(Number);
  return `${day} ${months[m - 1]} ${y}`;
}

function BookingSheet({
  selectedSlots, config, date, sport, onConfirm, onClose,
}: {
  selectedSlots: Slot[];
  config: BookingConfig;
  date: string;
  sport: Sport;
  onConfirm: (name: string, phone: string) => Promise<void>;
  onClose: () => void;
}) {
  const [step, setStep]         = useState<"info" | "form" | "done">("info");
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [loading, setLoad]      = useState(false);
  const [error, setError]       = useState("");
  const [copiedGpay, setCopiedGpay]   = useState(false);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedGpay(true); setTimeout(() => setCopiedGpay(false), 2000);
  };

  // Snapshot slot data on mount — survives when slots get marked booked after confirm
  const [snapshot] = useState(() => ({
    total:  selectedSlots.reduce((s, sl) => s + Number(sl.price), 0),
    durMin: selectedSlots.length * 30,
    start:  selectedSlots[0]?.startTime ?? "",
    end:    selectedSlots[selectedSlots.length - 1]?.endTime ?? "",
  }));
  const { total, durMin, start, end } = snapshot;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoad(true); setError("");
    try {
      await onConfirm(name, phone);
      setStep("done");
    }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Booking failed. Try again."); }
    finally { setLoad(false); }
  };

  /* Pre-filled WhatsApp message */
  const waText = encodeURIComponent(
    `Hi ${config.turfName}! 🎉\n\n` +
    `I've booked a slot and paid the advance.\n\n` +
    `📅 *Date:* ${fmtDate(date)}\n` +
    `⏰ *Time:* ${fmtFull(start)} – ${fmtFull(end)}\n` +
    `${sport === "Cricket" ? "🏏" : "⚽"} *Sport:* ${sport}\n` +
    `⏱ *Duration:* ${fmtDur(durMin)}\n` +
    `👤 *Name:* ${name}\n` +
    `📞 *Phone:* ${phone}\n\n` +
    `💰 *Advance Paid:* ₹${config.advanceAmount} via GPay to ${config.gpayNumber}\n\n` +
    `Please find my payment screenshot below 👇`
  );
  const waUrl = `https://wa.me/91${config.whatsappNumber.replace(/\D/g, "").slice(-10)}?text=${waText}`;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={step === "done" ? undefined : onClose} />
      <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl bg-[#0f0f0f] border-t border-zinc-800 shadow-2xl overflow-y-auto max-h-[92dvh]">
        <div className="max-w-lg mx-auto px-5 pt-4 pb-10 space-y-4">
          <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-2" />

          {/* ── STEP 1: Summary ── */}
          {step === "info" && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Selected Slot</p>
                  <p className="text-xl font-black text-white leading-tight">{fmtFull(start)} – {fmtFull(end)}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{fmtDur(durMin)} · {sport}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-black text-white">₹{total}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 rounded-2xl px-4 py-3 border border-zinc-800">
                <div>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Advance via GPay</p>
                  <p className="text-lg font-black text-emerald-400">₹{config.advanceAmount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest">GPay Number</p>
                  <p className="text-sm font-black text-white font-mono">{config.gpayNumber}</p>
                </div>
              </div>
              <button onClick={() => setStep("form")}
                className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold py-4 rounded-full text-sm transition">
                Continue to Book →
              </button>
            </>
          )}

          {/* ── STEP 2: Customer details form ── */}
          {step === "form" && (
            <form onSubmit={submit} className="space-y-3">
              <h3 className="text-sm font-black text-white">Your Details</h3>
              <input required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none" />
              <input required type="tel" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none" />
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-extrabold py-4 rounded-full text-sm transition">
                {loading ? "Reserving…" : "Confirm Booking"}
              </button>
              <button type="button" onClick={() => setStep("info")} className="w-full text-xs text-zinc-600 hover:text-zinc-400 py-1 transition">← Back</button>
            </form>
          )}

          {/* ── STEP 3: Confirmed — payment + WhatsApp ── */}
          {step === "done" && (
            <div className="space-y-3 pb-2">
              {/* Header */}
              <div className="text-center pt-1">
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/15 flex items-center justify-center text-3xl border border-emerald-500/30 mb-3">✅</div>
                <p className="font-black text-white text-xl">Booking Confirmed!</p>
                <p className="text-xs text-zinc-500 mt-1">Slot reserved · Pay advance below to lock it in</p>
              </div>



              {/* Booking details */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/70">
                {[
                  ["Date",     fmtDate(date)],
                  ["Time",     `${fmtFull(start)} – ${fmtFull(end)}`],
                  ["Sport",    `${sport === "Cricket" ? "🏏" : "⚽"} ${sport}`],
                  ["Duration", fmtDur(durMin)],
                  ["Name",     name],
                  ["Phone",    phone],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex items-center justify-between px-4 py-2">
                    <span className="text-[11px] text-zinc-500">{label}</span>
                    <span className="text-xs font-bold text-white text-right">{value}</span>
                  </div>
                ))}
              </div>

              {/* ⚡ Pay Advance box */}
              <div className="bg-amber-950/40 border border-amber-700/50 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-black text-amber-400">⚡ Pay Advance to Confirm Your Slot</p>

                {/* Advance amount + GPay number side by side */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Advance Amount</p>
                    <p className="text-3xl font-black text-white">₹{config.advanceAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">GPay / UPI</p>
                    <p className="text-base font-black text-white font-mono">{config.gpayNumber}</p>
                  </div>
                </div>

                {/* GPay number — large copy button */}
                <button
                  onClick={() => copyText(config.gpayNumber)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 border transition active:scale-95 ${
                    copiedGpay
                      ? "bg-emerald-600/20 border-emerald-600/50"
                      : "bg-zinc-900 border-zinc-700"
                  }`}
                >
                  <span className="font-mono font-black text-white text-lg tracking-widest">{config.gpayNumber}</span>
                  <span className={`text-sm font-bold px-3 py-1.5 rounded-lg transition ${copiedGpay ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"}`}>
                    {copiedGpay ? "✓ Copied!" : "📋 Copy"}
                  </span>
                </button>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Open GPay → <strong className="text-white">Pay ₹{config.advanceAmount}</strong> to the number above → Take screenshot → Send on WhatsApp ↓
                </p>
              </div>

              {/* WhatsApp — opens with ALL booking details pre-filled */}
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-emerald-600 active:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl text-sm"
              >
                <span className="text-xl">📱</span>
                <span>Open WhatsApp &amp; Send Screenshot</span>
              </a>
              <p className="text-center text-[10px] text-zinc-600">
                WhatsApp opens with booking details pre-filled — just attach your GPay screenshot and tap Send
              </p>

              <button onClick={onClose} className="w-full text-xs text-zinc-500 py-2">Close</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SLOT GRID
════════════════════════════════════════════════════════════════ */
interface SlotGridProps {
  date: string;
  period: Period;
  config?: BookingConfig;
}

export default function SlotGrid({ date, period, config }: SlotGridProps) {
  const [slots, setSlots]       = useState<Slot[]>([]);
  const [loading, setLoading]   = useState(false);
  const [sport, setSport]       = useState<Sport>("Cricket");
  const [selStart, setSelStart] = useState<string | null>(null);
  const [selEnd, setSelEnd]     = useState<string | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  const cfg: BookingConfig = config ?? {
    gpayNumber: "9876543210", advanceAmount: 500,
    whatsappNumber: "919876543210", turfName: "Turf Arena",
  };

  /* ── Fetch slots ─────────────────────────────────────────── */
  useEffect(() => {
    setLoading(true);
    clearSel();
    fetch(`/api/slots?date=${date}`)
      .then(r => r.json())
      .then((data: Slot[]) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  /* ── When sport changes, clear selection ─────────────────── */
  useEffect(() => { clearSel(); }, [sport]);

  /* ── Filtered by sport; prefer 30-min slot when duplicates ─ */
  const sportSlots = slots.filter(s => s.sport === sport);
  const byTime = React.useMemo(() => {
    const m = new Map<string, Slot>();
    for (const s of sportSlots) {
      const prev = m.get(s.startTime);
      if (!prev) { m.set(s.startTime, s); continue; }
      // Prefer shorter (30-min) slot over old hourly one
      const prevDur = toMins(prev.endTime) - toMins(prev.startTime);
      const curDur  = toMins(s.endTime)   - toMins(s.startTime);
      if (curDur < prevDur) m.set(s.startTime, s);
    }
    return m;
  }, [sportSlots]);

  /* ── Row slot builder ────────────────────────────────────── */
  const getRowSlots = useCallback((hours: number[]): Slot[] => {
    const out: Slot[] = [];
    for (const h of hours) {
      const hh = String(h).padStart(2, "0");
      const nxh = String(h + 1).padStart(2, "0");
      out.push(
        byTime.get(`${hh}:00`) ?? fakeSlot(`${hh}:00`, `${hh}:30`, sport),
        byTime.get(`${hh}:30`) ?? fakeSlot(`${hh}:30`, `${nxh}:00`, sport),
      );
    }
    return out;
  }, [byTime, sport]);

  /* ── Selection math ──────────────────────────────────────── */
  const selMinA = selStart ? toMins(selStart) : null;
  const selMinB = selEnd   ? toMins(selEnd)   : null;
  const lo = selMinA !== null && selMinB !== null ? Math.min(selMinA, selMinB) : null;
  const hi = selMinA !== null && selMinB !== null ? Math.max(selMinA, selMinB) : null;

  const selectedSlots = sportSlots.filter(s => {
    if (lo === null || hi === null) return false;
    const m = toMins(s.startTime);
    return m >= lo && m <= hi && s.status === "available";
  });
  const totalPrice = selectedSlots.reduce((s, sl) => s + Number(sl.price), 0);
  const durMins    = selectedSlots.length * 30;

  /* ── TAP HANDLER — tap to start, tap again to extend ─────── */
  const handleSlotTap = useCallback((slot: Slot) => {
    if (slot.status !== "available") return;

    // Nothing selected yet — start selection
    if (selStart === null) {
      setSelStart(slot.startTime);
      setSelEnd(slot.startTime);
      return;
    }

    // Tapping the SAME single slot — deselect
    if (slot.startTime === selStart && slot.startTime === selEnd) {
      clearSel();
      return;
    }

    // Extend range to this slot
    setSelEnd(slot.startTime);
  }, [selStart, selEnd]);


  /* ── Booking ── */
  const handleConfirm = async (name: string, phone: string): Promise<void> => {
    if (!selectedSlots.length) throw new Error("No slots selected.");

    // Skip the hold step — go directly to booking (fewer DB round trips = faster)
    let bookData: { success?: boolean; error?: string } | null = null;

    try {
      const bookRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slotIds: selectedSlots.map(s => s.id),
          customerName: name, customerPhone: phone,
          totalAmount: totalPrice, advanceAmount: cfg.advanceAmount, gpayNumber: cfg.gpayNumber,
        }),
      });
      bookData = await bookRes.json().catch(() => null);

      if (bookRes.ok && bookData?.success) {
        // Success path
        const bookedIds = new Set(selectedSlots.map(s => s.id));
        setSlots(prev => prev.map(s => bookedIds.has(s.id) ? { ...s, status: "booked" as SlotStatus } : s));
        return;
      }

      if (bookData?.error === "SLOT_UNAVAILABLE") {
        throw new Error("This slot is no longer available. Please choose another.");
      }
    } catch (err) {
      // Network timeout / fetch error — check if booking was actually created
      if (err instanceof Error && err.message.includes("no longer available")) throw err;
    }

    // Recovery: booking may have succeeded but response timed out — look up by phone
    try {
      const recovery = await fetch(`/api/bookings?phone=${encodeURIComponent(phone)}`);
      if (recovery.ok) {
        const found = await recovery.json();
        if (found?.status) {
          const bookedIds = new Set(selectedSlots.map(s => s.id));
          setSlots(prev => prev.map(s => bookedIds.has(s.id) ? { ...s, status: "booked" as SlotStatus } : s));
          return;
        }
      }
    } catch { /* ignore recovery failure */ }

    throw new Error("Booking failed. Please check your connection and try again.");
  };


  const clearSel = () => { setSelStart(null); setSelEnd(null); setShowSheet(false); };

  /* ── Row / period layout ─────────────────────────────────── */
  const allHours = PERIOD_HOURS[period] ?? [];
  const rows: number[][] = [];
  for (let i = 0; i < allHours.length; i += 4) rows.push(allHours.slice(i, i + 4));

  /* ── Loading ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-600">
        <div className="h-7 w-7 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span className="text-xs font-medium">Loading slots…</span>
      </div>
    );
  }

  /* ── Selection hint shown when first slot is picked ─────── */
  const showHint = selStart !== null && selStart === selEnd;

  return (
    <div className="select-none">
      {/* Sport toggle */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-1">
        {SPORTS.map(s => (
          <button key={s} onClick={() => setSport(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${sport === s ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
            {s === "Cricket" ? "🏏" : "⚽"} {s}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-zinc-600 hidden sm:block">Tap to select · Tap again to extend</span>
      </div>

      {/* Slot rows — normal page scroll, no touch capture */}
      <div className="px-2 pt-3 pb-32 space-y-6">
        {rows.map((rowHours, ri) => {
          const rowSlots = getRowSlots(rowHours);
          const segs = buildSegments(rowSlots, lo, hi);
          return (
            <div key={ri}>
              {/* Hour labels */}
              <div className="flex mb-1.5 px-1">
                {rowHours.map((h, hi2) => (
                  <React.Fragment key={h}>
                    {hi2 > 0 && <span className="flex-none self-center text-zinc-700 text-[8px] mx-0.5">•</span>}
                    <span className="text-center text-[11px] font-semibold text-zinc-400" style={{ flex: 2 }}>{fmt12h(h)}</span>
                  </React.Fragment>
                ))}
              </div>
              {/* Segments */}
              <div className="flex" style={{ height: 56 }}>
                {segs.map((seg, si) => (
                  <SegmentBlock key={si} segment={seg} onSlotTap={handleSlotTap} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-1">
          {[
            { cls: "border border-blue-500/40 rounded-full bg-blue-950/10", label: "Available" },
            { cls: "rounded-sm", label: "Booked", style: { backgroundImage: HATCH } as React.CSSProperties },
            { cls: "bg-blue-600 rounded-full", label: "Selected" },
          ].map(({ cls, label, style }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`h-3 w-6 ${cls}`} style={style} />
              <span className="text-[10px] text-zinc-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating pill — appears when any slot is selected */}
      {selStart !== null && !showSheet && (
        <div className="fixed bottom-[72px] inset-x-0 flex justify-center z-40 px-4 pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-full px-4 py-2 shadow-2xl text-xs animate-in slide-in-from-bottom-2 duration-200">
            {showHint ? (
              <>
                <span className="text-blue-400 font-bold">1 slot selected</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">Tap another to extend</span>
                <span className="text-zinc-600">·</span>
                <span className="font-black text-white">₹{totalPrice}</span>
              </>
            ) : (
              <>
                <span className="font-bold text-blue-400">{fmtDur(durMins)}</span>
                <span className="text-zinc-600">·</span>
                <span className="font-black text-white">₹{totalPrice}</span>
              </>
            )}
            <button onClick={() => setShowSheet(true)}
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-full text-[11px] transition ml-1">
              Book →
            </button>
            <button onClick={clearSel} className="text-zinc-600 hover:text-zinc-400 transition">✕</button>
          </div>
        </div>
      )}

      {/* Booking sheet */}
      {showSheet && (
        <BookingSheet
          selectedSlots={selectedSlots}
          config={cfg}
          date={date}
          sport={sport}
          onConfirm={handleConfirm}
          onClose={clearSel}
        />
      )}
    </div>
  );
}

/* ─── Placeholder for hours with no DB slot yet (shows as available) ─── */
function fakeSlot(start: string, end: string, sport: Sport): Slot {
  return { id: `__fake_${start}_${sport}`, startTime: start, endTime: end, status: "available", price: 0, sport };
}
