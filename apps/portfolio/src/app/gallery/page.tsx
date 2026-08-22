"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTurf } from "@/lib/turfStore";
import Link from "next/link";
import { Calendar } from "lucide-react";

export default function GalleryPage() {
  const { config } = useTurf();
  const photos = config.galleryImages;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-600">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Facility Showcase</span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">{config.turfName} Gallery</h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Take a look at our premium indoor cricket turf, bowling machine practice zone, and full arena setup in {config.city}.
          </p>
        </div>

        {photos.length === 0 ? (
          <p className="text-center text-zinc-600 py-20">No gallery images yet. Add some from the admin settings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((item, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 h-72 shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 filter brightness-[0.75] group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white px-3 py-1 rounded-full shadow">
                    {item.tag}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center pt-8">
          <Link
            href="/book"
            className="btn-pill inline-flex items-center gap-2 bg-blue-600 px-8 py-3.5 text-xs font-extrabold text-white shadow-xl hover:bg-blue-500 transition"
          >
            <Calendar className="h-4 w-4" />
            Book Slot Now →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
