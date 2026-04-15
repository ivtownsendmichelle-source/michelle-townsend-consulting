import { useState } from 'react';

function formatValue(field, entry) {
  const val = entry[field.key];
  if (val === undefined || val === null || val === '') return null;
  if (field.type === 'checkboxes') {
    const parts = Array.isArray(val) ? [...val] : [];
    const other = entry[`${field.key}_other`];
    if (other) parts.push(other);
    if (parts.length === 0) return null;
    return parts.join(', ');
  }
  return String(val);
}

function EntryCard({ entry, fields, index, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="border border-ink/15 rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <span className="font-display text-sm text-ink/50">#{index + 1}</span>
        <div className="flex gap-4">
          <button
            onClick={() => onEdit(entry)}
            className="text-violet text-sm underline min-h-[44px] px-1"
          >
            Edit
          </button>
          {confirming ? (
            <span className="flex gap-2 items-center">
              <button
                onClick={() => { onDelete(entry.id); setConfirming(false); }}
                className="text-oxblood text-sm underline min-h-[44px] px-1"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-ink/50 text-sm underline min-h-[44px] px-1"
              >
                Cancel
              </button>
            </span>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="text-oxblood text-sm underline min-h-[44px] px-1"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {fields.map(field => {
        const display = formatValue(field, entry);
        if (!display) return null;
        return (
          <div key={field.key}>
            <span className="text-xs text-ink/50 uppercase tracking-wide">{field.label}</span>
            <p className="text-sm text-ink leading-relaxed">{display}</p>
          </div>
        );
      })}
    </div>
  );
}

export function InventoryEntryList({ entries, fields, onEdit, onDelete }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg text-ink">
        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
      </h2>
      {entries.map((entry, i) => (
        <EntryCard
          key={entry.id}
          entry={entry}
          fields={fields}
          index={i}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
