"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

/* ─── Types ───────────────────────────────────────────────── */
export type TimeFilter = "twilight" | "morning" | "noon" | "evening";

export interface GalleryImage {
  url: string;
  title: string;
  tag: string;
}

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
  email: string;
  // New branding fields
  logoUrl: string;
  logoText: string;
  openingHours: string;
  googleMapsUrl: string;
  instagramUrl: string;
  primaryColor: string;
  sportsOffered: string;
  galleryImages: GalleryImage[];
  pwaName: string;
}

export interface DateOption {
  dateStr: string;
  dayName: string;
  dayNum: string;
  isToday: boolean;
}

const BASE = "https://content3.jdmagicbox.com/v2/comp/neyveli/s1/9999p4142.4142.231228031543.d3s1/catalogue";

/* ─── Defaults ────────────────────────────────────────────── */
const DEFAULT_CONFIG: TurfConfig = {
  turfName: "BHAVI TURF",
  city: "Mannan Nagar, Neyveli",
  heroTitle: "Welcome to BHAVI TURF",
  heroTagline: "Premium Indoor Cricket Turf with Bowling Machine",
  heroBannerUrl: "",
  gpayNumber: "9876543210",
  upiId: "9876543210@gpay",
  advanceAmount: 500,
  whatsappNumber: "919876543210",
  email: "bhaviturf@gmail.com",
  logoUrl: "/logo.png",
  logoText: "BHAVI TURF",
  openingHours: "6 AM – 11 PM",
  googleMapsUrl: "",
  instagramUrl: "",
  primaryColor: "#3b82f6",
  sportsOffered: "Cricket",
  galleryImages: [
    { url: `${BASE}/bhavi-indoor-turf-cricket-neyveli-sports-clubs-6rqslabxm8.jpg`, title: "BHAVI Indoor Turf — Main View", tag: "Indoor Turf" },
    { url: `${BASE}/bhavi-indoor-turf-cricket-neyveli-sports-clubs-mfwsuoqrxn.jpg`, title: "Bowling Machine Practice Zone",  tag: "Bowling Machine" },
    { url: `${BASE}/bhavi-indoor-turf-cricket-neyveli-sports-clubs-msz9rggy2g.jpg`, title: "Cricket Pitch Close-Up",          tag: "Pitch" },
    { url: `${BASE}/bhavi-indoor-turf-cricket-neyveli-sports-clubs-cb038bja55.jpg`, title: "Net & Arena Setup",               tag: "Arena" },
    { url: `${BASE}/bhavi-indoor-turf-cricket-neyveli-sports-clubs-kjs44i24ne.jpg`, title: "Full Ground Overview",            tag: "Ground" },
  ],
  pwaName: "BHAVI",
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

/* ── Build config from raw DB row ─────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildConfig(s: any, prev: TurfConfig): TurfConfig {
  if (!s) return prev
  return {
    ...prev,
    turfName:      s.turfName !== undefined && s.turfName !== '' ? s.turfName : prev.turfName,
    city:          s.city !== undefined && s.city !== '' ? s.city : prev.city,
    gpayNumber:    s.gpayNumber !== undefined ? s.gpayNumber : prev.gpayNumber,
    upiId:         s.gpayNumber ? `${s.gpayNumber}@gpay` : prev.upiId,
    advanceAmount: s.advanceAmount != null ? Number(s.advanceAmount) : prev.advanceAmount,
    whatsappNumber: s.whatsappNumber
      ? `91${s.whatsappNumber.replace(/\D/g, "").slice(-10)}`
      : prev.whatsappNumber,
    email:         s.email !== undefined && s.email !== '' ? s.email : prev.email,
    heroTitle:     s.heroTitle !== undefined ? s.heroTitle : prev.heroTitle,
    heroTagline:   s.heroTagline !== undefined ? s.heroTagline : prev.heroTagline,
    heroBannerUrl: s.heroBannerUrl !== undefined ? s.heroBannerUrl : prev.heroBannerUrl,
    logoUrl:       s.logoUrl || "/logo.png",
    logoText:      s.logoText !== undefined ? s.logoText : prev.logoText,
    openingHours:  s.openingHours || prev.openingHours,
    googleMapsUrl: s.googleMapsUrl !== undefined ? s.googleMapsUrl : prev.googleMapsUrl,
    instagramUrl:  s.instagramUrl !== undefined ? s.instagramUrl : prev.instagramUrl,
    primaryColor:  s.primaryColor || prev.primaryColor,
    sportsOffered: s.sportsOffered || prev.sportsOffered,
    galleryImages: (() => {
      try {
        const parsed = typeof s.galleryImages === 'string'
          ? JSON.parse(s.galleryImages)
          : s.galleryImages;
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : prev.galleryImages;
      } catch { return prev.galleryImages; }
    })(),
    pwaName: s.pwaName || prev.pwaName,
  }
}

export function TurfProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialSettings?: any
}) {
  const dates = generateDates()
  // Start with real settings from server — zero flash
  const [config, setConfig] = useState<TurfConfig>(() => buildConfig(initialSettings, DEFAULT_CONFIG))
  const [selectedDate, setSelectedDate] = useState(dates[0].dateStr)
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>("evening")

  // Re-fetch on tab visibility or settingsUpdated event (for live admin updates)
  useEffect(() => {
    const load = () =>
      fetch("/api/settings")
        .then((r) => r.json())
        .then((s) => {
          if (!s) return
          setConfig((prev) => buildConfig(s, prev))
        })
        .catch(() => {})

    const handleVisibility = () => {
      if (document.visibilityState === "visible") load()
    }
    const handleSettingsUpdated = () => { load() }

    document.addEventListener("visibilitychange", handleVisibility)
    window.addEventListener("settingsUpdated", handleSettingsUpdated)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility)
      window.removeEventListener("settingsUpdated", handleSettingsUpdated)
    }
  }, [])

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
