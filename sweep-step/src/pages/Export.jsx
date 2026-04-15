import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { generateJSON, generatePlainText, downloadBlob } from '../utils/export';

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function Export() {
  const { store } = useAppStore();

  function handleExportJSON() {
    const content = generateJSON(store);
    downloadBlob(content, `sweep-step-export-${todayISO()}.json`, 'application/json');
  }

  function handleExportText() {
    const content = generatePlainText(store);
    downloadBlob(content, `sweep-step-export-${todayISO()}.txt`, 'text/plain');
  }

  return (
    <div className="min-h-dvh bg-cream p-4 pb-20">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/" className="text-ink/40 min-h-[44px] flex items-center px-2">&larr;</Link>
        <h1 className="font-display text-2xl text-ink">Export</h1>
      </div>

      <p className="text-ink/70 mb-8">
        Your inventory, your words. Take them with you.
      </p>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleExportJSON}
          className="w-full text-left border-2 border-violet p-4 rounded-lg min-h-[44px]"
        >
          <div className="font-display text-lg text-ink">Export as JSON</div>
          <div className="text-sm text-ink/60 mt-1">Full data. Re-importable in future versions.</div>
        </button>

        <button
          onClick={handleExportText}
          className="w-full text-left border-2 border-ochre p-4 rounded-lg min-h-[44px]"
        >
          <div className="font-display text-lg text-ink">Export as Plain Text</div>
          <div className="text-sm text-ink/60 mt-1">Readable. Printable. For sponsor work or records.</div>
        </button>
      </div>
    </div>
  );
}
