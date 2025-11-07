import { useEffect, useState } from "react";

export default function Clock({
  zone,
  label,
  hour12 = false,
  showDate = false,
}: {
  zone: string;
  label?: string;
  hour12?: boolean;
  showDate?: boolean;
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // add a date string (locale-friendly)
  const dateStr = new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: zone,
  }).format(now);

  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: zone,
    hour12,
  }).format(now);

  const abbreviation =
    new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      timeZoneName: "short",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? "";

  // offsets
  const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const zoned = new Date(now.toLocaleString("en-US", { timeZone: zone }));
  const zoneOffsetMin = Math.round((zoned.getTime() - utc.getTime()) / 60000);
  const localOffsetMin = -now.getTimezoneOffset();
  const diffMin = zoneOffsetMin - localOffsetMin;

  const gmt =
    zoneOffsetMin >= 0
      ? `GMT+${(zoneOffsetMin / 60).toFixed(0)}`
      : `GMT${(zoneOffsetMin / 60).toFixed(0)}`;
  const rel =
    diffMin === 0
      ? "same as you"
      : `${Math.round(Math.abs(diffMin) / 60)}h ${
          diffMin > 0 ? "ahead" : "behind"
        }`;

  // local date vs zoned date
  const localDateStr = now.toLocaleDateString("en-CA"); // yyyy-mm-dd
  const zonedDateStr = new Date(
    now.toLocaleString("en-US", { timeZone: zone }),
  ).toLocaleDateString("en-CA");

  const dayDelta =
    (new Date(zonedDateStr).getTime() - new Date(localDateStr).getTime()) /
    (24 * 60 * 60 * 1000);
  const dayBadge = dayDelta === 1 ? "+1 day" : dayDelta === -1 ? "−1 day" : "";

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="pr-16 text-sm opacity-70">
        {label ?? zone} {abbreviation && `(${abbreviation})`}
      </div>

      <div
        className={`text-2xl font-semibold transition-colors ${
          hour12 ? "text-amber-300" : "text-sky-300"
        }`}
      >
        {time}
        {showDate && <div className="mt-1 text-xs opacity-70">{dateStr}</div>}
      </div>

      <div className="mt-1 text-xs opacity-70">
        {gmt} • {rel} {dayBadge && `• ${dayBadge}`}
      </div>
    </div>
  );
}
