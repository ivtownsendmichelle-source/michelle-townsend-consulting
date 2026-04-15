import { useState, useEffect } from 'react';

function buildInitial(fields) {
  const init = {};
  for (const field of fields) {
    if (field.type === 'checkboxes') {
      init[field.key] = [];
      if (field.hasOther) init[`${field.key}_other`] = '';
    } else {
      init[field.key] = '';
    }
  }
  return init;
}

export function InventoryEntryForm({ fields, onSave, editingEntry, onCancelEdit }) {
  const [values, setValues] = useState(() => buildInitial(fields));

  useEffect(() => {
    if (editingEntry) {
      const populated = buildInitial(fields);
      for (const key of Object.keys(populated)) {
        if (editingEntry[key] !== undefined) populated[key] = editingEntry[key];
      }
      setValues(populated);
    } else {
      setValues(buildInitial(fields));
    }
  }, [editingEntry]);

  function handleChange(key, value) {
    setValues(prev => ({ ...prev, [key]: value }));
  }

  function handleCheckbox(key, option, checked) {
    setValues(prev => {
      const current = prev[key] || [];
      if (checked) return { ...prev, [key]: [...current, option] };
      return { ...prev, [key]: current.filter(v => v !== option) };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const now = new Date().toISOString();
    const entry = {
      ...values,
      id: editingEntry ? editingEntry.id : crypto.randomUUID(),
      createdAt: editingEntry ? editingEntry.createdAt : now,
      updatedAt: now,
    };
    onSave(entry);
    setValues(buildInitial(fields));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(field => (
        <div key={field.key}>
          <label className="block text-sm text-ink/70 mb-1" htmlFor={field.key}>
            {field.label}
          </label>

          {field.type === 'text' && (
            <input
              id={field.key}
              type="text"
              placeholder={field.placeholder || ''}
              value={values[field.key] || ''}
              onChange={e => handleChange(field.key, e.target.value)}
              className="w-full border-2 border-ink/15 rounded-lg p-3 text-lg bg-cream text-ink min-h-[44px]"
            />
          )}

          {field.type === 'textarea' && (
            <textarea
              id={field.key}
              placeholder={field.placeholder || ''}
              value={values[field.key] || ''}
              onChange={e => handleChange(field.key, e.target.value)}
              rows={3}
              className="w-full border-2 border-ink/15 rounded-lg p-3 text-lg bg-cream text-ink resize-none"
            />
          )}

          {field.type === 'select' && (
            <select
              id={field.key}
              value={values[field.key] || ''}
              onChange={e => handleChange(field.key, e.target.value)}
              className="w-full border-2 border-ink/15 rounded-lg p-3 text-lg bg-cream text-ink min-h-[44px]"
            >
              <option value="">Select…</option>
              {(field.options || []).map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}

          {field.type === 'checkboxes' && (
            <div className="space-y-2">
              {(field.options || []).map(opt => (
                <label key={opt} className="flex items-center gap-3 min-h-[44px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(values[field.key] || []).includes(opt)}
                    onChange={e => handleCheckbox(field.key, opt, e.target.checked)}
                    className="w-5 h-5 accent-violet"
                  />
                  <span className="text-sm text-ink">{opt}</span>
                </label>
              ))}
              {field.hasOther && (
                <input
                  type="text"
                  placeholder="Other…"
                  value={values[`${field.key}_other`] || ''}
                  onChange={e => handleChange(`${field.key}_other`, e.target.value)}
                  className="w-full border-2 border-ink/15 rounded-lg p-3 text-lg bg-cream text-ink min-h-[44px]"
                />
              )}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-ink text-cream rounded-lg p-3 text-base font-body min-h-[44px]"
        >
          {editingEntry ? 'Update Entry' : 'Add Entry'}
        </button>
        {editingEntry && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex-1 border-2 border-ink/20 rounded-lg p-3 text-base font-body text-ink min-h-[44px]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
