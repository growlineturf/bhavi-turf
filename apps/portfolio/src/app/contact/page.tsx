"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTurf } from "@/lib/turfStore";
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const { config } = useTurf();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-600">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Get In Touch</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">Contact & Venue Location</h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
            Reach out for ground reservations, tournament bookings, or general inquiries at {config.turfName}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Details & Quick Buttons */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
              <h2 className="text-xl font-bold text-white">Venue Details</h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Ground Address</span>
                    <span className="text-zinc-400 leading-relaxed">Main Turf Road, {config.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">Call & GPay Support</span>
                    <a href={`tel:${config.gpayNumber}`} className="text-blue-400 font-semibold hover:underline">
                      +91 {config.gpayNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600/20 text-emerald-400 shrink-0">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-sm">WhatsApp Confirmation</span>
                    <a
                      href={`https://wa.me/${config.whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 font-semibold hover:underline"
                    >
                      +91 {config.whatsappNumber}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`tel:${config.gpayNumber}`}
                  className="btn-pill flex items-center justify-center gap-2 flex-1 bg-blue-600 py-3 text-xs font-extrabold text-white shadow-lg hover:bg-blue-500 transition"
                >
                  <Phone className="h-4 w-4" /> Click to Call
                </a>

                <a
                  href={`https://wa.me/${config.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-pill flex items-center justify-center gap-2 flex-1 bg-emerald-600 py-3 text-xs font-extrabold text-white shadow-lg hover:bg-emerald-500 transition"
                >
                  <MessageSquare className="h-4 w-4" /> WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Google Maps Embed Container */}
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900 overflow-hidden h-64 shadow-xl">
              <iframe
                title="Ground Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.85217435133!2d80.2085!3d13.0645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAzJzUyLjIiTiA4MMKwMTInMzAuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-6">
            <h2 className="text-xl font-bold text-white">Send Direct Inquiry</h2>

            {submitted ? (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-6 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Message Sent!</h3>
                <p className="text-xs text-zinc-400">We will call or message you back shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Enter your mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-zinc-300 block mb-1">Inquiry Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ask about slots, tournament hosting, or pricing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-pill flex items-center justify-center gap-2 w-full bg-blue-600 py-3.5 text-xs font-extrabold text-white shadow-lg hover:bg-blue-500 transition"
                >
                  <Send className="h-4 w-4" /> Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
