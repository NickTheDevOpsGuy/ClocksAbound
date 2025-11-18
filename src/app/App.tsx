// src/app/App.tsx
import { useEffect, useMemo, useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { SortableClock } from '@components/SortableClock';
import { useLocalStorage } from '@hooks/useLocalStorage';
import ClockComponent from '@components/Clock';
import ZonePicker from '@components/ZonePicker';
import allTimeZones from '@/lib/timezones';
import { useDebouncedValue } from '@hooks/useDebouncedValue';

type ZoneOpt = { zone: string; label: string; customLabel?: string };

// Local helpers
function readFromLS(key: string) {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
}

function displayLabel(z: ZoneOpt) {
  return z.customLabel?.trim() || z.label;
}

// ——— Component ————————————————————————————————————————————————
export default function App() {
  // — derived: static options (used by selected initializer) —
  const options: ZoneOpt[] = allTimeZones.map((z) => ({ zone: z, label: z }));

  // — state: query/selection —
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string>(
    () => options[0]?.zone ?? 'UTC'
  );

  // — derived: debounced query for filtering —
  const q = query.toLowerCase();
  const qDebounced = useDebouncedValue(q, 200);

  // — favorites (storage + one-time migration) —
  const [zones, setZones] = useLocalStorage<ZoneOpt[] | string[]>(
    'favorites',
    []
  );
  const [migrated, setMigrated] = useState(false);

  useEffect(() => {
    if (!migrated && Array.isArray(zones)) {
      // if any entries are plain strings, migrate them to ZoneOpt
      const hasStringEntries = zones.some((z) => typeof z === 'string');
      if (hasStringEntries) {
        const next = (zones as string[]).map(
          (z: string): ZoneOpt => ({ zone: z, label: z })
        );
        setZones(next);
        setMigrated(true);
        return;
      }
    }

    if (!migrated) {
      setMigrated(true);
    }
  }, [zones, migrated, setZones]);

  // After migration, treat as ZoneOpt[]
  const safeZones = useMemo<ZoneOpt[]>(() => {
    if (!Array.isArray(zones)) return [];
    // If someone somehow mixed types, filter to objects with a zone string
    return (zones as unknown[]).flatMap((z) => {
      if (
        typeof z === 'object' &&
        z !== null &&
        'zone' in z &&
        typeof (z as ZoneOpt).zone === 'string'
      ) {
        const zoneOpt = z as ZoneOpt;
        return [{ zone: zoneOpt.zone, label: zoneOpt.label, customLabel: zoneOpt.customLabel }];
      }
      if (typeof z === 'string') {
        // fallback: treat stray strings as raw zones
        return [{ zone: z, label: z } as ZoneOpt];
      }
      return [];
    });
  }, [zones]);

  // — state: UI prefs (persisted) —
  const [hour12, setHour12] = useState<boolean>(
    () => readFromLS('ca.hour12') === 'true'
  );
  useEffect(() => {
    localStorage.setItem('ca.hour12', String(hour12));
  }, [hour12]);

  const [showDate, setShowDate] = useState<boolean>(
    () => readFromLS('ca.showDate') === 'true'
  );
  useEffect(() => {
    localStorage.setItem('ca.showDate', String(showDate));
  }, [showDate]);

  // — environment —
  const myZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // — ui helpers / toasts —
  const [toast, setToast] = useState<{
    msg: string;
    kind: 'ok' | 'warn' | 'info' | null;
  }>({
    msg: '',
    kind: null,
  });

  function pushToast(msg: string, kind: 'ok' | 'warn' | 'info' = 'ok') {
    setToast({ msg, kind });
    setTimeout(() => setToast({ msg: '', kind: null }), 1200);
  }

  // — utils —
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

  // — derived: filtered list + keep selected valid —
  const filtered = useMemo(() => {
    const summer = new Date(Date.UTC(new Date().getFullYear(), 6, 1));
    return options.filter((o) => {
      const labelHit = o.label.toLowerCase().includes(qDebounced);
      const abbrNow = tzAbbrev(o.zone).toLowerCase();
      const abbrSummer = tzAbbrev(o.zone, summer).toLowerCase();
      const abbrHit =
        abbrNow.includes(qDebounced) || abbrSummer.includes(qDebounced);
      return labelHit || abbrHit;
    });
  }, [options, qDebounced]);

  useEffect(() => {
    if (!filtered.some((o) => o.zone === selected)) {
      if (filtered[0]?.zone) setSelected(filtered[0].zone);
    }
  }, [filtered, selected]);

  // — handlers: add / remove / reorder —
  function addZone(zoneKey?: string) {
    const key = zoneKey ?? selected;
    const picked = options.find((o) => o.zone === key);
    if (!picked) return;
    if (safeZones.some((z) => z.zone === picked.zone)) {
      pushToast('⚠️ Already in favorites', 'warn');
      return;
    }
    setZones([...safeZones, picked]);
    pushToast(`✅ Added ${picked.label}`, 'ok');
  }

  function removeZone(index: number) {
    const removed = safeZones[index];
    setZones(safeZones.filter((_, i) => i !== index));
    if (removed) pushToast(`🗑️ Removed ${removed.label}`, 'info');
  }

  const favs = useMemo(
    () => safeZones.filter((z) => z.zone !== myZone),
    [safeZones, myZone]
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    const ids = favs.map((f) => f.zone);
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(favs, oldIndex, newIndex);
    const mine = safeZones.filter((z) => z.zone === myZone);
    setZones([...mine, ...reordered]);
  }

  // — render —
  return (
    <main className="min-h-dvh bg-gradient-to-b from-slate-950 to-slate-900 p-6 text-slate-100">
      <header className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="bg-gradient-to-r from-sky-300 to-amber-300 bg-clip-text text-2xl font-bold text-transparent">
          🕰️ ClocksAbound
        </h1>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
            <button
              onClick={() => setHour12((h) => !h)}
              role="switch"
              aria-checked={hour12}
              aria-label="Toggle 12/24-hour format"
              className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-2 hover:bg-slate-700"
              title="Toggle 12/24h"
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

            <label className="ml-1 flex items-center gap-2 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={showDate}
                onChange={(e) => setShowDate(e.target.checked)}
                className="h-3 w-3 accent-slate-500"
              />
              Show date
            </label>
          </div>
        </div>
      </header>

      <section
        aria-label="clocks"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* --- My Timezone --- */}
        <div className="col-span-full rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-100">
              🏠 My Timezone
              <span className="text-sm font-normal text-slate-400">
                ({myZone})
              </span>
            </h2>
          </div>

          <ClockComponent
            zone={myZone}
            label="You"
            hour12={hour12}
            showDate={showDate}
          />
        </div>

        {/* Divider */}
        <div className="col-span-full my-1 h-px bg-slate-800/60" />

        {/* --- Favorites --- */}
        <div className="col-span-full mb-2 flex items-center justify-between gap-3">
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
          <div className="col-span-full rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400">
            No favorites yet — search a timezone and press{' '}
            <span className="text-slate-200">+ Add zone</span>.
          </div>
        )}

        {/* Favorite clocks */}
        {favs.length > 0 && (
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext items={favs.map((z) => z.zone)}>
              {favs.map((z, i) => (
                <SortableClock key={z.zone} id={z.zone}>
                  <div className="mb-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-transform duration-200 hover:scale-[1.01]">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-slate-300">
                        {displayLabel(z)}{' '}
                        <span className="text-xs text-slate-500">
                          ({tzAbbrev(z.zone)})
                        </span>
                      </span>
                      <div className="flex gap-1">
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
                                  ? {
                                      ...item,
                                      customLabel: label || undefined,
                                    }
                                  : item
                              )
                            );
                            pushToast(
                              label
                                ? `✏️ Renamed to "${label}"`
                                : '↩️ Name reset',
                              'info'
                            );
                          }}
                          className="rounded-full px-2 py-1 text-xs text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
                          aria-label={`Rename ${displayLabel(z)}`}
                          title={`Rename ${displayLabel(z)}`}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => removeZone(i)}
                          className="rounded-full px-2 py-1 text-xs text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
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