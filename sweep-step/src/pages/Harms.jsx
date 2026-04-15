import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';

const FIELDS = [
  { key: 'person', label: 'Person or entity harmed', type: 'text', placeholder: 'Who' },
  { key: 'whatIDid', label: 'What I did', type: 'textarea', placeholder: 'What happened' },
  { key: 'howAffected', label: 'How it affected them', type: 'textarea', placeholder: 'The impact' },
  {
    key: 'amendsType',
    label: 'What I owe (amends type)',
    type: 'select',
    options: ['Direct', 'Indirect', 'Living'],
  },
];

export function Harms() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);

  const entries = store.inventories.harms;
  const hpTerm = store.hpTerm;

  const handleSave = useCallback((entry) => {
    setStore((prev) => {
      const list = prev.inventories.harms;
      const existing = list.findIndex((e) => e.id === entry.id);
      const updated = existing >= 0
        ? list.map((e) => (e.id === entry.id ? entry : e))
        : [...list, entry];
      return { ...prev, inventories: { ...prev.inventories, harms: updated } };
    });
    recordAction();
    setEditing(null);
  }, [setStore, recordAction]);

  const handleDelete = useCallback((id) => {
    setStore((prev) => ({
      ...prev,
      inventories: {
        ...prev.inventories,
        harms: prev.inventories.harms.filter((e) => e.id !== id),
      },
    }));
    recordAction();
  }, [setStore, recordAction]);

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Harms</h1>
      </div>
      <GuidanceBox original={GUIDANCE.harms.original} modern={insertHP(GUIDANCE.harms.modern, hpTerm)} />
      <InventoryEntryForm fields={FIELDS} onSave={handleSave} editingEntry={editing} onCancelEdit={() => setEditing(null)} />
      <InventoryEntryList entries={entries} fields={FIELDS} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
