import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';

const FIELDS = [
  { key: 'resentfulAt', label: "I'm resentful at...", type: 'text', placeholder: 'Person, institution, or principle' },
  { key: 'cause', label: 'The cause', type: 'textarea', placeholder: 'What happened?' },
  {
    key: 'affects',
    label: 'Affects my...',
    type: 'checkboxes',
    options: ['Self-esteem', 'Pride', 'Ambitions', 'Personal relations', 'Sex relations', 'Pocketbook', 'Security'],
    hasOther: true,
  },
  {
    key: 'myPart',
    label: 'My part (where was I...)',
    type: 'checkboxes',
    options: ['Selfish', 'Dishonest', 'Self-seeking', 'Frightened'],
    hasOther: true,
  },
];

export function Resentments() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);

  const entries = store.inventories.resentments;
  const hpTerm = store.hpTerm;

  const handleSave = useCallback((entry) => {
    setStore((prev) => {
      const list = prev.inventories.resentments;
      const existing = list.findIndex((e) => e.id === entry.id);
      const updated = existing >= 0
        ? list.map((e) => (e.id === entry.id ? entry : e))
        : [...list, entry];
      return { ...prev, inventories: { ...prev.inventories, resentments: updated } };
    });
    recordAction();
    setEditing(null);
  }, [setStore, recordAction]);

  const handleDelete = useCallback((id) => {
    setStore((prev) => ({
      ...prev,
      inventories: {
        ...prev.inventories,
        resentments: prev.inventories.resentments.filter((e) => e.id !== id),
      },
    }));
    recordAction();
  }, [setStore, recordAction]);

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Resentments</h1>
      </div>
      <GuidanceBox original={GUIDANCE.resentments.original} modern={insertHP(GUIDANCE.resentments.modern, hpTerm)} />
      <InventoryEntryForm fields={FIELDS} onSave={handleSave} editingEntry={editing} onCancelEdit={() => setEditing(null)} />
      <InventoryEntryList entries={entries} fields={FIELDS} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
