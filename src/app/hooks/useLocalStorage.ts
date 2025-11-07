import { useEffect, useState } from "react";

type ZoneOpt = { zone: string; label: string };

// 1) state init (lazy) — inside App()
const [zones, setZones] = useState<ZoneOpt[]>(() => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("ca.zones");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

// 2) persist on change — still inside App()
useEffect(() => {
  try {
    window.localStorage.setItem("ca.zones", JSON.stringify(zones));
  } catch {
    /* ignore write errors */
  }
}, [zones]);
