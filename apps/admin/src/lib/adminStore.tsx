"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AdminConfig {
  turfName: string;
  city: string;
  heroTitle: string;
  heroTagline: string;
  heroBannerUrl: string;
  masterCode: string;
  neonDbUrl: string;
  gpayNumber: string;
  upiId: string;
  advanceAmount: number;
  whatsappNumber: string;
  hourlyRates: {
    twilight: number;
    morning: number;
    noon: number;
    evening: number;
  };
}

export interface AdminBooking {
  id: string;
  date: string;
  slotTime: string;
  durationMinutes: number;
  customerName: string;
  customerPhone: string;
  sport: string;
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: "PENDING_VERIFICATION" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

const DEFAULT_CONFIG: AdminConfig = {
  turfName: "TURF ARENA",
  city: "Chennai, Tamil Nadu",
  heroTitle: "Welcome to TURF ARENA",
  heroTagline: "Premium Turf Booking Experience",
  heroBannerUrl: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1600&q=80",
  masterCode: "TURF2026",
  neonDbUrl: "",
  gpayNumber: "9876543210",
  upiId: "9876543210@gpay",
  advanceAmount: 500,
  whatsappNumber: "919876543210",
  hourlyRates: {
    twilight: 800,
    morning: 1000,
    noon: 900,
    evening: 1400,
  },
};

const DEMO_BOOKINGS: AdminBooking[] = [
  {
    id: "BK-1001",
    date: "2026-08-14",
    slotTime: "07:00 PM - 08:00 PM",
    durationMinutes: 60,
    customerName: "Karthik R",
    customerPhone: "9840123456",
    sport: "Cricket",
    totalAmount: 1400,
    advanceAmount: 500,
    paymentStatus: "PENDING_VERIFICATION",
    createdAt: "2026-08-14T10:30:00Z",
  },
  {
    id: "BK-1002",
    date: "2026-08-14",
    slotTime: "09:00 AM - 10:00 AM",
    durationMinutes: 60,
    customerName: "Dinesh M",
    customerPhone: "9003456789",
    sport: "Football",
    totalAmount: 1000,
    advanceAmount: 500,
    paymentStatus: "CONFIRMED",
    createdAt: "2026-08-14T08:00:00Z",
  },
  {
    id: "BK-1003",
    date: "2026-08-15",
    slotTime: "06:00 PM - 07:00 PM",
    durationMinutes: 60,
    customerName: "Arjun S",
    customerPhone: "8754321098",
    sport: "Cricket",
    totalAmount: 1400,
    advanceAmount: 500,
    paymentStatus: "PENDING_VERIFICATION",
    createdAt: "2026-08-14T14:20:00Z",
  },
];

interface AdminContextType {
  config: AdminConfig;
  updateConfig: (c: Partial<AdminConfig>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  bookings: AdminBooking[];
  confirmBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [config, setConfig] = useState<AdminConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const s = localStorage.getItem("turf_config");
        if (s) return JSON.parse(s);
      } catch {}
    }
    return DEFAULT_CONFIG;
  });

  const [bookings, setBookings] = useState<AdminBooking[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const s = localStorage.getItem("turf_bookings");
        if (s) return JSON.parse(s);
      } catch {}
    }
    return DEMO_BOOKINGS;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("turf_config", JSON.stringify(config));
    }
  }, [config]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("turf_bookings", JSON.stringify(bookings));
    }
  }, [bookings]);

  const updateConfig = (c: Partial<AdminConfig>) =>
    setConfig((prev: AdminConfig) => ({ ...prev, ...c }));

  const confirmBooking = (id: string) =>
    setBookings((prev: AdminBooking[]) =>
      prev.map((b) => b.id === id ? { ...b, paymentStatus: "CONFIRMED" } : b)
    );

  const cancelBooking = (id: string) =>
    setBookings((prev: AdminBooking[]) =>
      prev.map((b) => b.id === id ? { ...b, paymentStatus: "CANCELLED" } : b)
    );

  return (
    <AdminContext.Provider value={{ config, updateConfig, isAuthenticated, setIsAuthenticated, bookings, confirmBooking, cancelBooking }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
