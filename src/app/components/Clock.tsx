import { useEffect, useState } from "react";

function Clock({ zone }: { zone: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZone: zone, hour12: false
  }).format(now);
  return <div><strong>{zone}</strong><div>{time}</div></div>;
}