import { useEffect, useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { SortableClock } from '@components/SortableClock';
import { useLocalStorage } from '@hooks/useLocalStorage';
import ClockComponent from '@components/Clock'; // ⬅️ same location, different local name
import ZonePicker from '@components/ZonePicker';
import allTimeZones from '@/lib/timezones';

type ZoneOpt = { zone: string; label: string; customLabel?: string };

// Local helpers
function lsGet(key: string) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

function displayLabel(z: ZoneOpt) {
  return z.customLabel?.trim() || z.label;
}

export default function App() {
  const options: ZoneOpt[] = allTimeZones.map((z) => ({ zone: z, label: z }));

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>(
    () => options[0]?.zone ?? 'UTC'
  );

  // Persist favorites (support legacy string[] -> migrate to ZoneOpt[])
  const [zones, setZones] = useLocalStorage<ZoneOpt[] | string[]>(
    'favorites',
    []
  );

  // One-time migration to objects
  useEffect(() => {
    if (Array.isArray(zones) && zones.some((z: any) => typeof z === 'string')) {
      const migrated = (zones as string[]).map((z) => ({ zone: z, label: z }));
      setZones(migrated as any);
    }
  }, [zones, setZones]);

  const safeZones: ZoneOpt[] = Array.isArray(zones)
    ? (zones as any[]).map((z: any) =>
        typeof z === 'string'
          ? ({ zone: z, label: z } as ZoneOpt)
          : (z as ZoneOpt)
      )
    : [];

  // 12h / 24h (persisted)
  const [hour12, setHour12] = useState<boolean>(() => {
    const raw = localStorage.getItem('ca.hour12');
    return raw ? raw === 'true' : false;
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

  function renameZone(index: number) {
  const current = safeZones[index];
  if (!current) return;
  const nextLabel = prompt('Rename clock label', current.customLabel ?? current.label);
  if (nextLabel === null) return; // cancelled
  const label = nextLabel.trim().slice(0, 40); // cap length a bit
  setZones(
    safeZones.map((z, i) =>
      i === index ? { ...z, customLabel: label || undefined } : z
    ) as any
  );
  pushToast(label ? `✏️ Renamed to "${label}"` : '↩️ Name reset', 'info');
}

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
    if (safeZones.some((z) => z.zone === picked.zone)) {
      pushToast('⚠️ Already in favorites', 'warn');
      return;
    }
    setZones([...safeZones, picked] as any);
    pushToast(`✅ Added ${picked.label}`, 'ok');
  }

  function removeZone(index: number) {
    const removed = safeZones[index];
    setZones(safeZones.filter((_, i) => i !== index) as any);
    if (removed) pushToast(`🗑️ Removed ${removed.label}`, 'info');
  }

  // Exclude "my zone" from favorites display
  const favs = safeZones.filter((z) => z.zone !== myZone);

  // Drag & drop reordering (persists via useLocalStorage)
  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const ids = favs.map((f) => f.zone);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(favs, oldIndex, newIndex);
    const mine = safeZones.filter((z) => z.zone === myZone);
    setZones([...mine, ...reordered] as any);
  }

return (
  <main className='min-h-dvh bg-gradient-to-b from-slate-950 to-slate-900 p-6 text-slate-100'>
    <header className='mb-6 flex flex-wrap items-center gap-3'>
      <h1 className='text-2xl font-bold bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-transparent'>
        🕰️ ClocksAbound
      </h1>

      <div className='ml-auto flex items-center gap-3'>
        <div className='flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2'>
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
      {/* --- My Timezone --- */}
      <div className='col-span-full rounded-xl bg-slate-900/60 p-4 border border-slate-800'>
        <div className='flex items-center justify-between mb-2'>
          <h2 className='flex items-center gap-2 text-xl font-semibold text-slate-100'>
            🏠 My Timezone
            <span className='text-slate-400 text-sm font-normal'>
              ({myZone})
            </span>
          </h2>
        </div>

        <ClockComponent
          zone={myZone}
          label='You'
          hour12={hour12}
          showDate={showDate}
        />
      </div>

      {/* Divider */}
      <div className='col-span-full my-1 h-px bg-slate-800/60' />

      {/* --- Favorites --- */}
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
            if (confirm('Remove all favorites?')) setZones([] as any);
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

      {/* Favorite clocks */}
      {favs.length > 0 && (
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={favs.map((z) => z.zone)}>
            {favs.map((z, i) => (
              <SortableClock key={z.zone} id={z.zone}>
                <div className='relative rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-transform duration-200 hover:scale-[1.01]'>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-sm text-slate-300'>
                      {displayLabel(z)}{' '}
                      <span className='text-slate-500 text-xs'>
                        ({tzAbbrev(z.zone)})
                      </span>
                    </span>
                    <div className='flex gap-1'>
                      <button
                        onClick={() => {
                          const next = prompt(
                            'Rename clock label',
                            z.customLabel ?? z.label
                          );
                          if (next === null) return;
                          const label = next.trim().slice(0, 40);
                          setZones(
                            safeZones.map((item, idx) =>
                              idx === i
                                ? { ...item, customLabel: label || undefined }
                                : item
                            ) as any
                          );
                          pushToast(
                            label
                              ? `✏️ Renamed to "${label}"`
                              : '↩️ Name reset',
                            'info'
                          );
                        }}
                        className='rounded-full px-2 py-1 text-xs text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400'
                        aria-label={`Rename ${displayLabel(z)}`}
                        title={`Rename ${displayLabel(z)}`}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => removeZone(i)}
                        className='rounded-full px-2 py-1 text-xs text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400'
                        aria-label={`Remove ${displayLabel(z)}`}
                        title={`Remove ${displayLabel(z)}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <ClockComponent
                    zone={z.zone}
                    label={displayLabel(z)}
                    hour12={hour12}
                    showDate={showDate}
                  />
                </div>
              </SortableClock>
            ))}
          </SortableContext>
        </DndContext>
      )}
    </section>

    {/* Toast */}
    {toast.kind && (
      <div
        className={`fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg px-3 py-2 text-sm text-white shadow-lg backdrop-blur ${
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
