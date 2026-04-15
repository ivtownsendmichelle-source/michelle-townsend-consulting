import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { usePim } from '../hooks/usePim';
import { GuidanceBox } from '../components/GuidanceBox';
import { InventoryEntryForm } from '../components/InventoryEntryForm';
import { InventoryEntryList } from '../components/InventoryEntryList';
import { GUIDANCE, insertHP } from '../data/guidance';

const FIELDS = [
  { key: 'whom', label: 'Whom did I harm', type: 'text', placeholder: 'Person' },
  { key: 'whatIDid', label: 'What did I do', type: 'textarea', placeholder: 'What happened' },
  { key: 'aroused', label: 'Did I unjustifiably arouse jealousy, suspicion, bitterness', type: 'textarea', placeholder: 'Be honest' },
  { key: 'myFault', label: 'Where was I at fault', type: 'textarea', placeholder: 'My part' },
  { key: 'shouldHaveDone', label: 'What should I have done instead', type: 'textarea', placeholder: 'The better path' },
];

export function SexInventory() {
  const { store, setStore } = useAppStore();
  const { recordAction } = usePim();
  const [editing, setEditing] = useState(null);

  const entries = store.inventories.sex;
  const hpTerm = store.hpTerm;

  const handleSave = useCallback((entry) => {
    setStore((prev) => {
      const list = prev.inventories.sex;
      const existing = list.findIndex((e) => e.id === entry.id);
      const updated = existing >= 0
        ? list.map((e) => (e.id === entry.id ? entry : e))
        : [...list, entry];
      return { ...prev, inventories: { ...prev.inventories, sex: updated } };
    });
    recordAction();
    setEditing(null);
  }, [setStore, recordAction]);

  const handleDelete = useCallback((id) => {
    setStore((prev) => ({
      ...prev,
      inventories: {
        ...prev.inventories,
        sex: prev.inventories.sex.filter((e) => e.id !== id),
      },
    }));
    recordAction();
  }, [setStore, recordAction]);

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Sex Inventory</h1>
      </div>
      <GuidanceBox original={GUIDANCE.sex.original} modern={insertHP(GUIDANCE.sex.modern, hpTerm)} />
      <InventoryEntryForm fields={FIELDS} onSave={handleSave} editingEntry={editing} onCancelEdit={() => setEditing(null)} />
      <InventoryEntryList entries={entries} fields={FIELDS} onEdit={setEditing} onDelete={handleDelete} />
    </div>
  );
}
