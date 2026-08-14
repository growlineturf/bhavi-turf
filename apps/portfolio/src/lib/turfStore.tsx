"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type TimeFilter = "twilight" | "morning" | "noon" | "evening";

export interface TurfSlot {
  id: string;
  date: string; // YYYY-MM-DD
  timeFilter: TimeFilter;
  blockStartHour: number; // e.g. 18 for 6pm
  hour: number; // e.g. 18
  minute: number; // 0, 15, 30, 45
  timeLabel: string; // e.g. "06:00 PM"
  status: "AVAILABLE" | "BOOKED" | "BLOCKED" | "PAST";
  price: number; // per hour prorated or per subslot
}

export interface TurfBooking {
  id: string;
  date: string;
  slotTime: string;
  durationMinutes: number;
  customerName: string;
  customerPhone: string;
  sport: "Cricket" | "Football" | "Other";
  totalAmount: number;
  advanceAmount: number;
  paymentStatus: "PENDING_VERIFICATION" | "CONFIRMED" | "CANCELLED";
  createdAt: string;
}

export interface TurfConfig {
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

const DEFAULT_CONFIG: TurfConfig = {
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

export interface DateOption {
  dateStr: string; // YYYY-MM-DD
  dayName: string; // e.g. Fri
  dayNum: string; // e.g. 14 Aug
  isToday: boolean;
}

function generateUpcomingDates(): DateOption[] {
  const dates: DateOption[] = [];
  const baseDate = new Date(2026, 7, 14); // 14 Aug 2026
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    dates.push({
      dateStr,
      dayName: dayNames[d.getDay()],
      dayNum: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      isToday: i === 0,
    });
  }
  return dates;
}

interface TurfContextType {
  config: TurfConfig;
  updateConfig: (newConfig: Partial<TurfConfig>) => void;
  dates: DateOption[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTimeFilter: TimeFilter;
  setSelectedTimeFilter: (filter: TimeFilter) => void;
  slots: TurfSlot[];
  selectedSlot: TurfSlot | null;
  setSelectedSlot: (slot: TurfSlot | null) => void;
  bookings: TurfBooking[];
  createBooking: (bookingData: Omit<TurfBooking, "id" | "createdAt" | "paymentStatus">) => TurfBooking;
  toggleSlotStatus: (slotId: string, status: "AVAILABLE" | "BOOKED" | "BLOCKED") => void;
  updateSlotPrice: (slotId: string, price: number) => void;
  isAdminAuthenticated: boolean;
  setIsAdminAuthenticated: (auth: boolean) => void;
}

const TurfContext = createContext<TurfContextType | undefined>(undefined);

export function TurfProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<TurfConfig>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("turf_config");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return DEFAULT_CONFIG;
  });

  const dates = generateUpcomingDates();
  const [selectedDate, setSelectedDate] = useState<string>(dates[0].dateStr);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<TimeFilter>("evening");
  const [selectedSlot, setSelectedSlot] = useState<TurfSlot | null>(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Initialize Bookings
  const [bookings, setBookings] = useState<TurfBooking[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("turf_bookings");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      {
        id: "BK-1001",
        date: "2026-08-14",
        slotTime: "07:00 PM - 08:00 PM",
        durationMinutes: 60,
        customerName: "Karthik R",
        customerPhone: "+91 98401 23456",
        sport: "Cricket",
        totalAmount: 1400,
        advanceAmount: 500,
        paymentStatus: "CONFIRMED",
        createdAt: "2026-08-14T10:30:00Z",
      },
    ];
  });

  // Dynamic Slot Store state
  const [slotsState, setSlotsState] = useState<Record<string, TurfSlot[]>>({});

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

  // Generate or retrieve slots for current date & filter
  const getSlotsForDate = (date: string): TurfSlot[] => {
    if (slotsState[date]) {
      return slotsState[date];
    }
    // Generate fresh slots for date
    const generated: TurfSlot[] = [];
    
    // Time filter blocks setup
    const timeBlocks: { filter: TimeFilter; startHour: number; endHour: number; rateKey: keyof TurfConfig["hourlyRates"] }[] = [
      { filter: "twilight", startHour: 5, endHour: 8, rateKey: "twilight" },
      { filter: "morning", startHour: 8, endHour: 12, rateKey: "morning" },
      { filter: "noon", startHour: 12, endHour: 16, rateKey: "noon" },
      { filter: "evening", startHour: 16, endHour: 24, rateKey: "evening" },
    ];

    const isToday = date === "2026-08-14";
    const currentHour = 17; // 5 PM current local time

    timeBlocks.forEach((tb) => {
      for (let h = tb.startHour; h < tb.endHour; h++) {
        for (let m of [0, 15, 30, 45]) {
          const slotHour = h;
          const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
          const ampm = h >= 12 ? "PM" : "AM";
          const formattedM = String(m).padStart(2, "0");
          const timeLabel = `${String(displayH).padStart(2, "0")}:${formattedM} ${ampm}`;

          let status: TurfSlot["status"] = "AVAILABLE";
          
          // Mark past slots as PAST
          if (isToday && (slotHour < currentHour || (slotHour === currentHour && m <= 30))) {
            status = "PAST";
          } else if (isToday && slotHour === 19) {
            // Preset mock booked slot for demo
            status = "BOOKED";
          }

          generated.push({
            id: `${date}_${tb.filter}_${h}_${m}`,
            date,
            timeFilter: tb.filter,
            blockStartHour: h < 8 ? 5 : h < 12 ? 8 : h < 16 ? 12 : h < 20 ? 16 : 20,
            hour: h,
            minute: m,
            timeLabel,
            status,
            price: Math.round(config.hourlyRates[tb.rateKey] / 4), // 15-min subslot price
          });
        }
      }
    });

    return generated;
  };

  const currentSlots = getSlotsForDate(selectedDate);

  const updateConfig = (newConfig: Partial<TurfConfig>) => {
    setConfig((prev: TurfConfig) => ({ ...prev, ...newConfig }));
  };

  const createBooking = (bookingData: Omit<TurfBooking, "id" | "createdAt" | "paymentStatus">): TurfBooking => {
    const newBooking: TurfBooking = {
      ...bookingData,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentStatus: "PENDING_VERIFICATION",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev: TurfBooking[]) => [newBooking, ...prev]);

    // Mark slot as booked
    if (selectedSlot) {
      toggleSlotStatus(selectedSlot.id, "BOOKED");
    }

    return newBooking;
  };

  const toggleSlotStatus = (slotId: string, status: "AVAILABLE" | "BOOKED" | "BLOCKED") => {
    setSlotsState((prev: Record<string, TurfSlot[]>) => {
      const dateSlots = prev[selectedDate] ? [...prev[selectedDate]] : getSlotsForDate(selectedDate);
      const updated = dateSlots.map((s) => (s.id === slotId ? { ...s, status } : s));
      return { ...prev, [selectedDate]: updated };
    });
  };

  const updateSlotPrice = (slotId: string, newPrice: number) => {
    setSlotsState((prev: Record<string, TurfSlot[]>) => {
      const dateSlots = prev[selectedDate] ? [...prev[selectedDate]] : getSlotsForDate(selectedDate);
      const updated = dateSlots.map((s) => (s.id === slotId ? { ...s, price: newPrice } : s));
      return { ...prev, [selectedDate]: updated };
    });
  };

  return (
    <TurfContext.Provider
      value={{
        config,
        updateConfig,
        dates,
        selectedDate,
        setSelectedDate,
        selectedTimeFilter,
        setSelectedTimeFilter,
        slots: currentSlots,
        selectedSlot,
        setSelectedSlot,
        bookings,
        createBooking,
        toggleSlotStatus,
        updateSlotPrice,
        isAdminAuthenticated,
        setIsAdminAuthenticated,
      }}
    >
      {children}
    </TurfContext.Provider>
  );
}

export function useTurf() {
  const context = useContext(TurfContext);
  if (!context) {
    throw new Error("useTurf must be used within a TurfProvider");
  }
  return context;
}
