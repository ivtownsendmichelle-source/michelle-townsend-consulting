import { useState } from 'react';

export function GuidanceBox({ original, modern }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-6">
      <div className="bg-ochre/10 border border-ochre/30 rounded-lg p-4 text-sm text-ink/80 leading-relaxed whitespace-pre-line">
        {original}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-violet text-sm mt-2 underline min-h-[44px] px-1"
      >
        {expanded ? 'Show less' : 'Learn more'}
      </button>
      {expanded && (
        <div className="bg-violet/5 border border-violet/20 rounded-lg p-4 mt-2 text-sm text-ink/80 leading-relaxed whitespace-pre-line">
          {modern}
        </div>
      )}
    </div>
  );
}
