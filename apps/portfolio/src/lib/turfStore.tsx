"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

/* ─── Types ───────────────────────────────────────────────── */
export type TimeFilter = "twilight" | "morning" | "noon" | "evening";

export interface TurfConfig {
  turfName: string;
  city: string;
  heroTitle: string;
  heroTagline: string;
  heroBannerUrl: string;
  gpayNumber: string;
  upiId: string;
  advanceAmount: number;
  whatsappNumber: string;
  // New branding fields
  logoUrl: string;
  logoText: string;
  openingHours: string;
  googleMapsUrl: string;
  instagramUrl: string;
  primaryColor: string;
  sportsOffered: string;
}

export interface DateOption {
  dateStr: string;
  dayName: string;
  dayNum: string;
  isToday: boolean;
}

/* ─── Defaults ────────────────────────────────────────────── */
const DEFAULT_CONFIG: TurfConfig = {
  turfName: "TURF ARENA",
  city: "Chennai, Tamil Nadu",
  heroTitle: "Welcome to TURF ARENA",
  heroTagline: "Premium Turf Booking Experience",
  heroBannerUrl:
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1600&q=80",
  gpayNumber: "9876543210",
  upiId: "9876543210@gpay",
  advanceAmount: 500,
  whatsappNumber: "919876543210",
  logoUrl: "",
  logoText: "",
  openingHours: "5 AM – 11 PM",
  googleMapsUrl: "",
  instagramUrl: "",
  primaryColor: "#3b82f6",
  sportsOffered: "Cricket, Football",
};

const DAY_NAMES  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON_NAMES  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function generateDates(): DateOption[] {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return {
      dateStr: `${y}-${m}-${dd}`,
      dayName: DAY_NAMES[d.getDay()],
      dayNum: `${d.getDate()} ${MON_NAMES[d.getMonth()]}`,
      isToday: i === 0,
    };
  });
}

/* ─── Context ─────────────────────────────────────────────── */
interface TurfContextType {
  config: TurfConfig;
  dates: DateOption[];
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  selectedTimeFilter: TimeFilter;
  setSelectedTimeFilter: (f: TimeFilter) => void;
}

const TurfContext = createContext<TurfContextType | undefined>(undefined);

export function TurfProvider({ children }: { children: React.ReactNode }) {
  const dates = generateDates();
  const [config, setConfig] = useState<TurfConfig>(DEFAULT_CONFIG);
  const [selectedDate, setSelectedDate] = useState(dates[0].dateStr);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>("evening");

  // Load site settings on mount; re-fetch whenever the tab becomes visible
  // (visibilitychange instead of a fixed interval — avoids polling Neon while backgrounded)
  useEffect(() => {
    const load = () =>
      fetch("/api/settings")
        .then((r) => r.json())
        .then((s) => {
          if (!s) return;
          setConfig((prev) => ({
            ...prev,
            turfName:      s.turfName      ?? prev.turfName,
            city:          s.city          ?? prev.city,
            gpayNumber:    s.gpayNumber    ?? prev.gpayNumber,
            advanceAmount: s.advanceAmount != null ? Number(s.advanceAmount) : prev.advanceAmount,
            whatsappNumber: s.whatsappNumber
              ? `91${s.whatsappNumber.replace(/\D/g, "").slice(-10)}`
              : prev.whatsappNumber,
            heroTitle:     s.heroTitle     ?? prev.heroTitle,
            heroTagline:   s.heroTagline   ?? prev.heroTagline,
            heroBannerUrl: s.heroBannerUrl || prev.heroBannerUrl,
            logoUrl:       s.logoUrl       ?? prev.logoUrl,
            logoText:      s.logoText      ?? prev.logoText,
            openingHours:  s.openingHours  ?? prev.openingHours,
            googleMapsUrl: s.googleMapsUrl ?? prev.googleMapsUrl,
            instagramUrl:  s.instagramUrl  ?? prev.instagramUrl,
            primaryColor:  s.primaryColor  ?? prev.primaryColor,
            sportsOffered: s.sportsOffered ?? prev.sportsOffered,
          }));
        })
        .catch(() => {});

    load(); // immediate on mount

    const handleVisibility = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);


  return (
    <TurfContext.Provider
      value={{ config, dates, selectedDate, setSelectedDate, selectedTimeFilter, setSelectedTimeFilter }}
    >
      {children}
    </TurfContext.Provider>
  );
}

export function useTurf() {
  const ctx = useContext(TurfContext);
  if (!ctx) throw new Error("useTurf must be used within TurfProvider");
  return ctx;
}
