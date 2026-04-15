import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';

export default function Settings() {
  const { store, setStore } = useAppStore();
  const [sobrietyDate, setSobrietyDate] = useState(store.user.sobrietyDate ?? '');
  const [pronouns, setPronouns] = useState(store.user.pronouns ?? '');
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  function handleSave(e) {
    e.preventDefault();
    setStore((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        sobrietyDate: sobrietyDate || null,
        pronouns: pronouns || null,
      },
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col px-4 pt-4 pb-8 max-w-sm mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="text-ink/40 flex items-center gap-1 mb-6 min-h-[44px] self-start"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      <h1 className="font-display text-2xl text-ink mb-6">Settings</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Sobriety date */}
        <div className="flex flex-col gap-1">
          <label htmlFor="sobriety-date" className="font-body text-sm text-ink/70">
            Sobriety date
          </label>
          <input
            id="sobriety-date"
            type="date"
            max={today}
            value={sobrietyDate}
            onChange={(e) => setSobrietyDate(e.target.value)}
            className="font-body text-base text-ink bg-cream border border-ink/20 rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:border-ink/50"
          />
        </div>

        {/* Pronouns */}
        <div className="flex flex-col gap-1">
          <label htmlFor="pronouns" className="font-body text-sm text-ink/70">
            Pronouns
          </label>
          <input
            id="pronouns"
            type="text"
            value={pronouns}
            onChange={(e) => setPronouns(e.target.value)}
            placeholder="e.g. she/her, they/them"
            className="font-body text-base text-ink bg-cream border border-ink/20 rounded-lg px-3 py-2 min-h-[44px] focus:outline-none focus:border-ink/50"
          />
        </div>

        {/* Higher Power (read-only) */}
        <div className="flex flex-col gap-1">
          <label className="font-body text-sm text-ink/70">Higher Power</label>
          <p className="font-body text-base text-ink px-3 py-2 min-h-[44px] flex items-center border border-ink/10 rounded-lg bg-cream">
            {store.user.higherPowerTerm ?? '—'}
          </p>
          <p className="font-body text-xs text-ink/40">Set during onboarding</p>
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="font-display text-base bg-ink text-cream rounded-xl px-6 py-3 min-h-[44px] active:scale-95 transition-transform"
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </form>
    </div>
  );
}
