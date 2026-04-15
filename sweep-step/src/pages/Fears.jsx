import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';

const BASE_FIELDS = [
  { key: 'fear', label: "What I'm afraid of", type: 'text', placeholder: 'The fear' },
  { key: 'why', label: 'Why I have this fear', type: 'textarea', placeholder: 'Where does this come from?' },
  { key: 'selfCause', label: 'What part of self caused the fear', type: 'textarea', placeholder: 'Self-reliance failed me how?' },
  { key: 'hpDirection', label: 'What would {{HP}} have me do instead', type: 'textarea', placeholder: 'A different direction' },
];

export function Fears() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);

  const entries = store.inventories.fears;
  const hpTerm = store.hpTerm;

  const FIELDS = BASE_FIELDS.map((f) => ({ ...f, label: insertHP(f.label, hpTerm) }));

  const handleSave = useCallback((entry) => {
    setStore((prev) => {
      const list = prev.inventories.fears;
      const existing = list.findIndex((e) => e.id === entry.id);
      const updated = existing >= 0
        ? list.map((e) => (e.id === entry.id ? entry : e))
        : [...list, entry];
      return { ...prev, inventories: { ...prev.inventories, fears: updated } };
    });
    recordAction();
    setEditing(null);
  }, [setStore, recordAction]);

  const handleDelete = useCallback((id) => {
    setStore((prev) => ({
      ...prev,
      inventories: {
        ...prev.inventories,
        fears: prev.inventories.fears.filter((e) => e.id !== id),
      },
    }));
    recordAction();
  }, [setStore, recordAction]);

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Fears</h1>
      </div>
      <GuidanceBox original={GUIDANCE.fears.original} modern={insertHP(GUIDANCE.fears.modern, hpTerm)} />
      <InventoryEntryForm fields={FIELDS} onSave={handleSave} editingEntry={editing} onCancelEdit={() => setEditing(null)} />
      <InventoryEntryList entries={entries} fields={FIELDS} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
