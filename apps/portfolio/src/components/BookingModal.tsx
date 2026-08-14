"use client";

import React, { useState } from "react";
import { useTurf, TurfSlot } from "@/lib/turfStore";
import { X, Copy, Check, Send, Phone, ShieldCheck, Sparkles, CreditCard } from "lucide-react";

export default function BookingModal() {
  const { selectedSlot, setSelectedSlot, config, createBooking } = useTurf();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [sport, setSport] = useState<"Cricket" | "Football" | "Other">("Cricket");
  const [duration, setDuration] = useState<number>(60); // default 60 mins (1 hr)
  const [copied, setCopied] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState("");

  if (!selectedSlot) return null;

  // Calculate calculated total price based on duration
  const hourlyRate = config.hourlyRates[selectedSlot.timeFilter] || 1200;
  const totalPrice = Math.round((hourlyRate * duration) / 60);
  const advanceAmount = Math.min(config.advanceAmount, totalPrice);

  const handleCopyGpay = () => {
    navigator.clipboard.writeText(config.gpayNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim() || !customerName.trim()) return;

    const booking = createBooking({
      date: selectedSlot.date,
      slotTime: `${selectedSlot.timeLabel} (${duration} mins)`,
      durationMinutes: duration,
      customerName,
      customerPhone,
      sport,
      totalAmount: totalPrice,
      advanceAmount,
    });

    setCreatedBookingId(booking.id);
    setBookingConfirmed(true);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi ${config.turfName}! I want to confirm my booking:\n\n` +
    `🎟️ Booking ID: ${createdBookingId || "PENDING"}\n` +
    `📅 Date: ${selectedSlot.date}\n` +
    `⏰ Time: ${selectedSlot.timeLabel}\n` +
    `⚽ Sport: ${sport}\n` +
    `👤 Name: ${customerName}\n` +
    `📞 Phone: ${customerPhone}\n` +
    `💰 Total: ₹${totalPrice}\n` +
    `💳 Advance Paid: ₹${advanceAmount} via GPay (${config.gpayNumber})\n\n` +
    `Here is my payment screenshot for instant verification!`
  );

  const whatsappUrl = `https://wa.me/${config.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest block">Slot Checkout</span>
            <h2 className="text-lg font-black text-white">{config.turfName}</h2>
          </div>
          <button
            onClick={() => {
              setSelectedSlot(null);
              setBookingConfirmed(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!bookingConfirmed ? (
          <form onSubmit={handleConfirm} className="space-y-5">
            {/* Slot Summary Pill */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Selected Date & Start Time</span>
                <span className="font-bold text-white">{selectedSlot.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-blue-400">{selectedSlot.timeLabel}</span>
                <div className="flex items-center gap-1.5 text-xs text-zinc-300">
                  <span className="font-semibold">Duration:</span>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="rounded-lg bg-zinc-800 border border-zinc-700 text-white px-2 py-1 text-xs font-bold"
                  >
                    <option value={30}>30 mins</option>
                    <option value={60}>60 mins (1 hr)</option>
                    <option value={90}>90 mins (1.5 hrs)</option>
                    <option value={120}>120 mins (2 hrs)</option>
                  </select>
                </div>
              </div>
              <div className="border-t border-zinc-800/80 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Slot Price:</span>
                <span className="text-lg font-black text-white">₹{totalPrice}</span>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Player Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-400 block mb-1">Phone Number (GPay/WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 98401 23456"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Sport Type</label>
                <div className="flex gap-2">
                  {(["Cricket", "Football", "Other"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSport(s)}
                      className={`btn-pill flex-1 py-1.5 text-xs font-bold border transition ${
                        sport === s
                          ? "bg-blue-600 border-blue-500 text-white"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {s === "Cricket" ? "🏏 Cricket" : s === "Football" ? "⚽ Football" : "🎯 Other"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Guidance Box */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-4 w-4" /> Advance Payment Required
                </span>
                <span className="text-base font-black">₹{advanceAmount}</span>
              </div>
              <p className="text-zinc-300 leading-normal text-[11px]">
                Pay <strong className="text-white">₹{advanceAmount} advance</strong> on GPay number{" "}
                <strong className="text-blue-400 font-mono">{config.gpayNumber}</strong> and submit to confirm slot.
              </p>
            </div>

            <button
              type="submit"
              className="btn-pill w-full bg-blue-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition"
            >
              Proceed to GPay & WhatsApp Confirmation →
            </button>
          </form>
        ) : (
          /* Step 2: GPay & WhatsApp Confirmation Screen */
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2 py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-white">Booking Slot Reserved!</h3>
              <p className="text-xs text-zinc-400">
                Booking Reference ID: <span className="font-mono text-blue-400 font-bold">{createdBookingId}</span>
              </p>
            </div>

            {/* GPay Number Box with 1-Tap Copy */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Google Pay (GPay) Number</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full">
                  UPI Direct
                </span>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5">
                <span className="font-mono text-base font-black text-white tracking-wider">
                  {config.gpayNumber}
                </span>
                <button
                  onClick={handleCopyGpay}
                  className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Number"}
                </button>
              </div>
              <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Advance Required: <strong className="text-emerald-400">₹{advanceAmount}</strong></span>
                <span className="text-zinc-500">UPI: {config.upiId}</span>
              </div>
            </div>

            {/* Step-by-step instruction */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2 text-xs">
              <span className="font-bold text-white block">Next Step: Send Screenshot</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Send the ₹{advanceAmount} payment screenshot to WhatsApp number{" "}
                <strong className="text-emerald-400">{config.whatsappNumber}</strong> to complete verification.
              </p>
            </div>

            {/* WhatsApp 1-Tap Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-pill flex items-center justify-center gap-2.5 w-full bg-emerald-600 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500 transition"
            >
              <Send className="h-4 w-4" />
              📱 Send Screenshot on WhatsApp
            </a>

            <button
              onClick={() => {
                setSelectedSlot(null);
                setBookingConfirmed(false);
              }}
              className="w-full text-center text-xs font-semibold text-zinc-500 hover:text-zinc-300 py-1"
            >
              Close & Return to Slots
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
