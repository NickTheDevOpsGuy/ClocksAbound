import React from 'react';

type ZoneOpt = { zone: string; label: string };

export default function ZonePicker({
  filtered,
  selected,
  query,
  onQuery,
  onSelect,
  onAdd,
  onClearAll,
  hasFavorites = false,
}: {
  filtered: ZoneOpt[];
  selected: string;
  query: string;
  onQuery: (value: string) => void;
  onSelect: (value: string) => void;
  onAdd: (zone?: string) => void;
  onClearAll?: () => void;
  hasFavorites?: boolean;
}) {
  const hasMatches = filtered.length > 0;

  return (
    <div className='flex items-center gap-3'>
      {/* POD: search + select + actions */}
      <div className='flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 px-2 py-1'>
        {/* Search */}
        <input
          placeholder="Search timezones… (try 'BST' or 'Tokyo')"
          className='h-9 w-52 rounded-md border border-slate-800 bg-slate-950 px-3 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-slate-600 focus:outline-none'
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && hasMatches) {
              e.preventDefault();
              onAdd(filtered[0].zone);
            }
          }}
          aria-label='Search timezones'
        />

        {/* Clear (only when typing) */}
        {query && (
          <button
            type='button'
            onClick={() => onQuery('')}
            className='h-7 rounded-md border border-slate-700 px-2 text-[11px] text-slate-300 hover:bg-slate-800'
            title='Clear search'
            aria-label='Clear search'
          >
            Clear
          </button>
        )}

        {/* Select (filtered list) */}
        <select
          className='h-9 min-w-56 rounded-md border border-slate-800 bg-slate-950 px-2 text-slate-100 focus:ring-2 focus:ring-slate-600 focus:outline-none'
          value={selected}
          onChange={(e) => onSelect(e.target.value)}
          aria-label='Select timezone'
        >
          {filtered.map((o) => (
            <option key={o.zone} value={o.zone}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Match count */}
        <span className='text-[11px] text-slate-400/70'>
          {filtered.length} match{filtered.length === 1 ? '' : 'es'}
        </span>

        {/* Add */}
        <button
          type='button'
          onClick={() => onAdd(selected)}
          className='h-9 rounded-lg bg-slate-700 px-3 text-slate-100 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={!hasMatches}
          aria-disabled={!hasMatches}
          title={hasMatches ? 'Add selected timezone' : 'No matches to add'}
        >
          + Add zone
        </button>

        {/* Remove all (inside the pod) */}
        {hasFavorites && onClearAll && (
          <button
            type='button'
            onClick={onClearAll}
            className='h-9 rounded-lg border border-slate-700 px-3 text-xs text-slate-300 hover:bg-slate-800'
            title='Remove all favorites'
          >
            Remove all
          </button>
        )}
      </div>
    </div>
  );
}
