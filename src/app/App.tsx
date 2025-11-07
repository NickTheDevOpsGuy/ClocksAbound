import Clock from '@components/Clock';
import ZonePicker from '@components/ZonePicker';
import { allTimeZones } from '@lib/timezones';
import { useEffect, useState } from 'react';

type ZoneOpt = { zone: string; label: string };

export default function App() {
  const options: ZoneOpt[] = allTimeZones.map((z) => ({ zone: z, label: z }));

  const [query, setQuery] = useState('');
  const [zones, setZones] = useState<ZoneOpt[]>([]);
  const [selected, setSelected] = useState<string>(
    () => options[0]?.zone ?? 'UTC'
  );

  // 12h / 24h (persisted)
  const [hour12, setHour12] = useState<boolean>(() => {
    const raw = localStorage.getItem('ca.hour12');
    return raw ? raw === 'true' : false; // default 24h
  });
  useEffect(() => {
    localStorage.setItem('ca.hour12', String(hour12));
  }, [hour12]);

  // Show date (persisted)
  const [showDate, setShowDate] = useState<boolean>(() => {
    const raw = localStorage.getItem('ca.showDate');
    return raw ? raw === 'true' : false;
  });
  useEffect(() => {
    localStorage.setItem('ca.showDate', String(showDate));
  }, [showDate]);

  const myZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Toast
  const [toast, setToast] = useState<{
    msg: string;
    kind: 'ok' | 'warn' | 'info' | null;
  }>({ msg: '', kind: null });

  function pushToast(msg: string, kind: 'ok' | 'warn' | 'info' = 'ok') {
    setToast({ msg, kind });
    setTimeout(() => setToast({ msg: '', kind: null }), 1200);
  }

  // Filter by label or abbreviation
  const q = query.toLowerCase();
  const summer = new Date(Date.UTC(new Date().getFullYear(), 6, 1));
  const filtered = options.filter((o: ZoneOpt) => {
    const labelHit = o.label.toLowerCase().includes(q);
    const abbrNow = tzAbbrev(o.zone).toLowerCase();
    const abbrSummer = tzAbbrev(o.zone, summer).toLowerCase();
    const abbrHit = abbrNow.includes(q) || abbrSummer.includes(q);
    return labelHit || abbrHit;
  });

  useEffect(() => {
    if (!filtered.some((o) => o.zone === selected)) {
      if (filtered[0]?.zone) setSelected(filtered[0].zone);
    }
  }, [q, filtered, selected]);

  function tzAbbrev(zone: string, date = new Date()) {
    return (
      new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        timeZoneName: 'short',
      })
        .formatToParts(date)
        .find((p) => p.type === 'timeZoneName')?.value ?? ''
    );
  }

  // Add / Remove
  function addZone(zoneKey?: string) {
    const key = zoneKey ?? selected;
    const picked = options.find((o) => o.zone === key);
    if (!picked) return;
    if (zones.some((z) => z.zone === picked.zone)) {
      pushToast('⚠️ Already in favorites', 'warn');
      return;
    }
    setZones((prev) => [...prev, picked]);
    pushToast(`✅ Added ${picked.label}`, 'ok');
  }

  function removeZone(index: number) {
    const removed = zones[index];
    setZones((prev) => prev.filter((_, i) => i !== index));
    if (removed) pushToast(`🗑️ Removed ${removed.label}`, 'info');
  }

  const favs = zones.filter((z) => z.zone !== myZone);

  return (
    <main className='min-h-dvh bg-slate-950 p-6 text-slate-100'>
      {/* Top bar: title + global toggles (in a pill) */}
      <header className='mb-6 flex flex-wrap items-center gap-3'>
        <h1 className='text-2xl font-bold'>🕰️ ClocksAbound</h1>

        <div className='ml-auto flex items-center gap-3'>
          {/* Toggles pill */}
          <div className='flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2'>
            {/* 12/24h toggle */}
            <button
              onClick={() => setHour12((h) => !h)}
              role='switch'
              aria-checked={hour12}
              aria-label='Toggle 12/24-hour format'
              className='inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 hover:bg-slate-700'
              title='Toggle 12/24h'
            >
              <span
                className={`text-xs transition-colors ${
                  hour12 ? 'text-amber-400' : 'text-sky-400'
                }`}
              >
                {hour12 ? '12h' : '24h'}
              </span>
              <span
                className={`h-5 w-9 rounded-full transition ${
                  hour12 ? 'bg-slate-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block h-4 w-4 translate-x-1 rounded-full bg-white transition ${
                    hour12 ? 'translate-x-4' : ''
                  }`}
                />
              </span>
            </button>

            {/* Show date toggle */}
            <label className='ml-1 flex items-center gap-2 text-xs text-slate-300'>
              <input
                type='checkbox'
                checked={showDate}
                onChange={(e) => setShowDate(e.target.checked)}
                className='h-3 w-3 accent-slate-500'
              />
              Show date
            </label>
          </div>
        </div>
      </header>

      <section
        aria-label='clocks'
        className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
      >
        {/* My Timezone */}
        <h2 className='col-span-full mb-2 flex items-center gap-2 text-xl font-bold text-slate-50'>
          🕰️ My Timezone:
          <span className='font-medium text-slate-300'>{myZone}</span>
          <button
            onClick={() => navigator.clipboard.writeText(myZone)}
            className='rounded-md border border-slate-700 px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-800'
            title='Copy timezone ID'
          >
            Copy
          </button>
        </h2>

        <Clock zone={myZone} label='You' hour12={hour12} showDate={showDate} />

        {/* Divider */}
        <div className='col-span-full my-1 h-px bg-slate-800/60' />

        {/* Favorites header row: picker + remove-all live here */}
        <div className='col-span-full mb-2 flex items-center justify-between gap-3'>
          <h2
            className={`flex items-center gap-2 text-2xl font-bold tracking-tight ${
              favs.length === 0
                ? 'text-slate-500'
                : 'text-yellow-300 drop-shadow-[0_0_6px_rgba(255,255,200,0.25)]'
            }`}
          >
            ⭐ Favorites
          </h2>

          <ZonePicker
            filtered={filtered}
            selected={selected}
            query={query}
            onQuery={setQuery}
            onSelect={setSelected}
            onAdd={addZone}
            onClearAll={() => {
              if (confirm('Remove all favorites?')) setZones([]);
            }}
            hasFavorites={favs.length > 0}
          />
        </div>

        {/* Empty state */}
        {favs.length === 0 && (
          <div className='col-span-full rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400'>
            No favorites yet — search a timezone and press{' '}
            <span className='text-slate-200'>+ Add zone</span>.
          </div>
        )}

        {/* Favorites list */}
        {favs.map((z, i) => (
          <div key={`${z.zone}-${i}`} className='ca-animate-in relative'>
            <Clock
              zone={z.zone}
              label={z.label}
              hour12={hour12}
              showDate={showDate}
            />
            <button
              onClick={() => removeZone(i)}
              className='absolute -top-2 -right-2 rounded-full bg-slate-800/80 px-2 py-1 text-xs hover:bg-slate-700 focus:ring-2 focus:ring-slate-400 focus:outline-none'
              aria-label={`Remove ${z.label}`}
              title={`Remove ${z.label}`}
            >
              ✕
            </button>
          </div>
        ))}
      </section>

      {/* Toast */}
      {toast.kind && (
        <div
          className={`fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-3 py-2 text-sm text-white shadow-lg ${
            toast.kind === 'ok'
              ? 'bg-emerald-600/90'
              : toast.kind === 'warn'
                ? 'bg-amber-600/90'
                : 'bg-slate-700/90'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </main>
  );
}
