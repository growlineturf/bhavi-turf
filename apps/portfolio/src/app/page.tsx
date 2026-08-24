"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InstallPWABanner from "@/components/InstallPWABanner";

import { useTurf } from "@/lib/turfStore";
import {
  Zap,
  Shield,
  Smile,
  CalendarCheck,
  Trophy,
  ArrowRight,
  Star,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { config } = useTurf();

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />
      {/* Floating install prompt — shows automatically on Android & iOS */}
      <InstallPWABanner appName={config.pwaName || "BHAVI"} />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden min-h-[100svh] sm:min-h-[85vh] flex items-center justify-center">
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 filter brightness-[0.4]"
          style={config.heroBannerUrl ? { backgroundImage: `url('${config.heroBannerUrl}')` } : {}}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 py-24 sm:py-20 text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/50 px-4 py-1.5 text-xs font-extrabold text-blue-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span>Indoor Cricket Turf • {config.city}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] px-2">
            {config.heroTitle}
          </h1>

          <p className="text-sm sm:text-lg text-zinc-300 max-w-2xl mx-auto font-medium leading-relaxed px-2">
            {config.heroTagline}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 px-4 sm:px-0">
            <Link
              href="/book"
              className="btn-pill flex items-center justify-center gap-2.5 w-full sm:w-auto bg-blue-600 px-8 py-4 text-sm font-extrabold text-white shadow-2xl shadow-blue-600/40 hover:bg-blue-500 hover:scale-105 transition"
            >
              Book Now
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/gallery"
              className="btn-pill flex items-center justify-center gap-2 w-full sm:w-auto border border-zinc-700 bg-zinc-900/80 px-8 py-4 text-sm font-extrabold text-zinc-200 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition"
            >
              Explore Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* "Why Choose Us" Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Unrivaled Pitch Quality</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Why Choose {config.turfName}?</h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Purpose-built indoor cricket turf with bowling machine — perfect for practice & matches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "Bowling Machine",
              desc: "Adjustable speed bowling machine for batting practice at all skill levels.",
            },
            {
              icon: Shield,
              title: "Premium Indoor Pitch",
              desc: "High-quality artificial turf surface designed for indoor cricket play.",
            },
            {
              icon: Smile,
              title: "Friendly Environment",
              desc: "Covered indoor arena, clean facilities & comfortable playing space.",
            },
            {
              icon: CalendarCheck,
              title: "Online Slot Booking",
              desc: "Instant GPay booking & WhatsApp receipt confirmation in 30 seconds.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4 hover:border-zinc-700 transition hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* "Our Premium Facility" Gallery */}
      <section className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Facility Tour</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">Our Indoor Turf Facility</h2>
          </div>
          <Link
            href="/gallery"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All Photos →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Indoor Cricket Turf",
              sub: "Premium artificial pitch surface",
              img: "https://content3.jdmagicbox.com/v2/comp/neyveli/s1/9999p4142.4142.231228031543.d3s1/catalogue/bhavi-indoor-turf-cricket-neyveli-sports-clubs-6rqslabxm8.jpg",
            },
            {
              title: "Bowling Machine Zone",
              sub: "Practice with adjustable speed machine",
              img: "https://content3.jdmagicbox.com/v2/comp/neyveli/s1/9999p4142.4142.231228031543.d3s1/catalogue/bhavi-indoor-turf-cricket-neyveli-sports-clubs-mfwsuoqrxn.jpg",
            },
            {
              title: "Full Ground View",
              sub: "Spacious indoor arena — Mannan Nagar, Neyveli",
              img: "https://content3.jdmagicbox.com/v2/comp/neyveli/s1/9999p4142.4142.231228031543.d3s1/catalogue/bhavi-indoor-turf-cricket-neyveli-sports-clubs-kjs44i24ne.jpg",
            },
          ].map((g, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 h-64 shadow-xl"
            >
              <img
                src={g.img}
                alt={g.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-[0.7] group-hover:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-sm font-bold text-white block">{g.title}</span>
                <span className="text-[10px] text-zinc-400 font-medium">{g.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "Host Your Tournament" CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/60 via-zinc-900 to-indigo-950/60 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/30 border border-blue-400/40 px-4 py-1 text-xs font-bold text-blue-300">
            <Trophy className="h-4 w-4" /> Tournament & League Organizer
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto">
            Host Your Next Indoor Cricket Tournament
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto">
            Corporate leagues, weekend knockout trophies, and birthday matches — all indoors with our bowling machine and premium pitch. Reserve full-day ground access today.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${config.whatsappNumber}?text=Hi!%20I%20want%20to%20inquire%20about%20hosting%20a%20tournament%20at%20${encodeURIComponent(config.turfName)}.`}
              target="_blank"
              rel="noreferrer"
              className="btn-pill inline-flex items-center gap-2.5 bg-blue-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition"
            >
              Inquire Tournament Booking (WhatsApp) →
            </a>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="mx-auto max-w-7xl px-4 py-12 border-y border-zinc-900">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Happy Players", value: "10,000+" },
            { label: "Matches / Week", value: "120+" },
            { label: "Booking Availability", value: "24/7" },
            { label: "User Rating", value: "4.9 ★" },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Player Feedback</span>
          <h2 className="text-3xl font-black text-white">What Players Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Vijay Anand",
              sport: "Box Cricket Captain",
              text: "Best indoor turf in Tamil Nadu! The bowling machine is top-notch and the pitch quality is excellent. Booking slot takes less than 1 minute via GPay.",
              rating: 5,
            },
            {
              name: "Dinesh Kumar",
              sport: "Indoor Turf Player",
              text: "The indoor turf with the bowling machine is a game changer! Perfect for practice sessions. The machine speed settings are great for all skill levels. Absolutely love it!",
              rating: 5,
            },
            {
              name: "Sowmya N",
              sport: "Corporate League Organizer",
              text: "Hosted our 8-team weekend tournament. Management and WhatsApp support were super responsive and helpful.",
              rating: 5,
            },
          ].map((t, i) => (
            <div key={i} className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
              <div className="flex gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, r) => (
                  <Star key={r} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">"{t.text}"</p>
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-xs font-bold text-white">{t.name}</span>
                <span className="text-[10px] font-semibold text-blue-400">{t.sport}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Guidelines Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Ground Guidelines</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Important Rules</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "⏰",
              title: "Arrive 15 Mins Early",
              desc: "Please arrive 15 minutes prior to your booked slot to complete warmup and player check-in.",
            },
            {
              emoji: "⏳",
              title: "Respect Slot Timings",
              desc: "Slot start and end times are strictly enforced to ensure smooth gameplay for all teams.",
            },
            {
              emoji: "🛡️",
              title: "Safety & Fair Play",
              desc: "Maintain sportsmanship. Follow pitch referee guidelines and keep the dugout clean.",
            },
          ].map((rule, i) => (
            <div key={i} className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3 text-center">
              <div className="text-3xl">{rule.emoji}</div>
              <h3 className="text-base font-bold text-white">{rule.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{rule.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

    </div>
  );
}
