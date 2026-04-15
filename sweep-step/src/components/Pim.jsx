/**
 * Pim
 * The dust-creature companion. Four SVG stages, breathing animation, tap messages,
 * and ambient dust particles (via PimDust).
 *
 * Props:
 *   stage     {number} 1–4
 *   dustLevel {number} 0–3
 *   onTap     {function} callback when Pim is tapped
 *   tapMessage {string} message to display for 3s after tap
 */
import { useState } from 'react';
import { PimDust } from './PimDust';

/* ─────────────────────────────────────────────
   Shared breathing style injected once
───────────────────────────────────────────── */
const breatheStyle = `
  .animate-pim-breathe {
    animation: pimBreathe 4s ease-in-out infinite;
    transform-origin: center 80%;
  }
  @keyframes pimBreathe {
    0%, 100% { transform: scaleY(1) scaleX(1); }
    50% { transform: scaleY(1.03) scaleX(0.98); }
  }
  .animate-fade-in {
    animation: pimFadeIn 0.4s ease-out both;
  }
  @keyframes pimFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

/* ─────────────────────────────────────────────
   Stage 1: Pile of dust — inert, organic, quiet
───────────────────────────────────────────── */
function PimStage1() {
  return (
    <svg
      viewBox="0 0 80 60"
      className="w-24 h-20 animate-pim-breathe"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base pile — muted earth tones, overlapping blobs */}
      <ellipse cx="40" cy="50" rx="32" ry="11" fill="#8B7E6A" opacity="0.9" />
      <ellipse cx="36" cy="46" rx="24" ry="13" fill="#9B8E7A" />
      <ellipse cx="44" cy="44" rx="20" ry="12" fill="#A89B87" />
      <ellipse cx="38" cy="41" rx="16" ry="10" fill="#9B8E7A" />
      <ellipse cx="42" cy="40" rx="13" ry="9"  fill="#A89B87" />
      {/* Lumps and imperfections */}
      <circle cx="27" cy="48" r="7"  fill="#8B7E6A" />
      <circle cx="53" cy="47" r="6"  fill="#9B8E7A" />
      <circle cx="36" cy="37" r="5"  fill="#A89B87" />
      <circle cx="46" cy="36" r="4"  fill="#9B8E7A" />
      <circle cx="32" cy="42" r="4"  fill="#A89B87" opacity="0.8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Stage 2: Dust with two small eyes — watching
───────────────────────────────────────────── */
function PimStage2() {
  return (
    <svg
      viewBox="0 0 80 64"
      className="w-24 h-20 animate-pim-breathe"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pile — slightly taller than stage 1 */}
      <ellipse cx="40" cy="52" rx="32" ry="11" fill="#8B7E6A" opacity="0.9" />
      <ellipse cx="36" cy="48" rx="24" ry="14" fill="#9B8E7A" />
      <ellipse cx="44" cy="46" rx="20" ry="13" fill="#A89B87" />
      <ellipse cx="38" cy="42" rx="17" ry="11" fill="#9B8E7A" />
      <ellipse cx="42" cy="40" rx="14" ry="10" fill="#A89B87" />
      <circle  cx="27" cy="50" r="7"  fill="#8B7E6A" />
      <circle  cx="53" cy="49" r="6"  fill="#9B8E7A" />
      <circle  cx="36" cy="37" r="5"  fill="#A89B87" />
      <circle  cx="46" cy="36" r="4"  fill="#9B8E7A" />
      {/* Eyes */}
      <circle cx="36" cy="39" r="2.5" fill="#1A1A1A" />
      <circle cx="44" cy="38" r="2.5" fill="#1A1A1A" />
      {/* Eye highlights */}
      <circle cx="37" cy="38.2" r="0.9" fill="#F5F1E8" />
      <circle cx="45" cy="37.2" r="0.9" fill="#F5F1E8" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Stage 3: Dust bunny with a broom bristle
───────────────────────────────────────────── */
function PimStage3() {
  return (
    <svg
      viewBox="0 0 88 70"
      className="w-28 h-24 animate-pim-breathe"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base — fluffier, more overlapping blobs */}
      <ellipse cx="42" cy="58" rx="33" ry="11"  fill="#8B7E6A" opacity="0.9" />
      <ellipse cx="38" cy="53" rx="26" ry="15"  fill="#9B8E7A" />
      <ellipse cx="46" cy="50" rx="22" ry="14"  fill="#A89B87" />
      <ellipse cx="40" cy="45" rx="19" ry="12"  fill="#9B8E7A" />
      <ellipse cx="44" cy="42" rx="16" ry="11"  fill="#A89B87" />
      <ellipse cx="41" cy="39" rx="12" ry="9"   fill="#9B8E7A" />
      {/* Fuzzy edge circles */}
      <circle cx="25" cy="54" r="8"  fill="#8B7E6A" />
      <circle cx="57" cy="52" r="7"  fill="#9B8E7A" />
      <circle cx="30" cy="43" r="5"  fill="#A89B87" opacity="0.85" />
      <circle cx="52" cy="41" r="4"  fill="#A89B87" opacity="0.85" />
      <circle cx="36" cy="35" r="5"  fill="#9B8E7A" opacity="0.8" />
      <circle cx="47" cy="34" r="4"  fill="#A89B87" opacity="0.8" />
      {/* Bigger eyes */}
      <circle cx="37" cy="41" r="3.2" fill="#1A1A1A" />
      <circle cx="46" cy="40" r="3.2" fill="#1A1A1A" />
      {/* Eye highlights */}
      <circle cx="38.3" cy="40" r="1.1" fill="#F5F1E8" />
      <circle cx="47.3" cy="39" r="1.1" fill="#F5F1E8" />
      {/* Broom bristle — ochre, upper right, slightly rotated */}
      <g transform="translate(54, 22) rotate(18)">
        {/* Bristle handle */}
        <rect x="-1" y="0" width="2.5" height="18" rx="1" fill="#D4A52A" />
        {/* Bristle split lines at top */}
        <line x1="0.5" y1="0" x2="-3"  y2="-5" stroke="#D4A52A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0.5" y1="0" x2="3.5" y2="-5" stroke="#D4A52A" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Stage 4: Small fuzzy creature holding a tiny broom
───────────────────────────────────────────── */
function PimStage4() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-36 h-36 animate-pim-breathe"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rounded body */}
      <ellipse cx="48" cy="68" rx="28" ry="24"  fill="#9B8E7A" />
      <ellipse cx="48" cy="62" rx="22" ry="22"  fill="#A89B87" />
      <ellipse cx="48" cy="58" rx="18" ry="19"  fill="#B3A693" />
      {/* Head */}
      <ellipse cx="48" cy="44" rx="16" ry="14"  fill="#A89B87" />
      <ellipse cx="48" cy="42" rx="14" ry="13"  fill="#B3A693" />
      {/* Fuzzy texture circles — body */}
      <circle cx="28" cy="72" r="8"  fill="#8B7E6A" />
      <circle cx="68" cy="70" r="7"  fill="#9B8E7A" />
      <circle cx="30" cy="60" r="5"  fill="#A89B87" opacity="0.75" />
      <circle cx="65" cy="58" r="5"  fill="#A89B87" opacity="0.75" />
      <circle cx="35" cy="82" r="6"  fill="#8B7E6A" opacity="0.7" />
      <circle cx="60" cy="81" r="5"  fill="#9B8E7A" opacity="0.7" />
      {/* Fuzzy head edges */}
      <circle cx="36" cy="38" r="5"  fill="#9B8E7A" opacity="0.8" />
      <circle cx="60" cy="37" r="4"  fill="#A89B87" opacity="0.8" />
      <circle cx="42" cy="30" r="4"  fill="#9B8E7A" opacity="0.75" />
      <circle cx="54" cy="30" r="3.5" fill="#A89B87" opacity="0.75" />
      {/* Eyes — friendly, bigger */}
      <circle cx="42" cy="41" r="4"   fill="#1A1A1A" />
      <circle cx="54" cy="41" r="4"   fill="#1A1A1A" />
      {/* Eye highlights */}
      <circle cx="43.8" cy="39.5" r="1.5" fill="#F5F1E8" />
      <circle cx="55.8" cy="39.5" r="1.5" fill="#F5F1E8" />
      {/* Tiny curved smile */}
      <path
        d="M 43 48 Q 48 52 53 48"
        fill="none"
        stroke="#1A1A1A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Arm stub — left side, reaching toward broom */}
      <ellipse
        cx="71"
        cy="62"
        rx="7"
        ry="4"
        fill="#9B8E7A"
        transform="rotate(-30 71 62)"
      />
      {/* Broom — held to the right */}
      <g transform="translate(76, 48) rotate(12)">
        {/* Handle */}
        <rect x="-1.2" y="0" width="2.5" height="28" rx="1.2" fill="#8B7E6A" />
        {/* Broom head */}
        <rect x="-7" y="26" width="14" height="6" rx="1.5" fill="#D4A52A" />
        {/* Bristle lines */}
        <line x1="-5"  y1="29" x2="-5"  y2="34" stroke="#B8891F" strokeWidth="1" strokeLinecap="round" />
        <line x1="-2"  y1="29" x2="-2"  y2="34" stroke="#B8891F" strokeWidth="1" strokeLinecap="round" />
        <line x1="1"   y1="29" x2="1"   y2="34" stroke="#B8891F" strokeWidth="1" strokeLinecap="round" />
        <line x1="4"   y1="29" x2="4"   y2="34" stroke="#B8891F" strokeWidth="1" strokeLinecap="round" />
        {/* Top split */}
        <line x1="0" y1="0" x2="-4" y2="-6" stroke="#D4A52A" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="0" x2="4"  y2="-6" stroke="#D4A52A" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Main Pim component
───────────────────────────────────────────── */
const STAGE_COMPONENTS = [null, PimStage1, PimStage2, PimStage3, PimStage4];

export function Pim({ stage = 1, dustLevel = 0, onTap, tapMessage }) {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');

  // Cap at 4 for Layer 1
  const clampedStage = Math.min(Math.max(stage, 1), 4);
  const StageComponent = STAGE_COMPONENTS[clampedStage];

  function handleTap() {
    if (tapMessage) {
      setCurrentMessage(tapMessage);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
    onTap?.();
  }

  return (
    <div className="relative flex flex-col items-center">
      <style>{breatheStyle}</style>
      <button
        onClick={handleTap}
        className="relative p-4 focus:outline-none cursor-pointer"
        aria-label="Tap Pim"
      >
        <PimDust level={dustLevel} />
        {StageComponent && <StageComponent />}
      </button>
      {showMessage && (
        <p className="text-ink/60 text-sm font-body mt-2 animate-fade-in">
          {currentMessage}
        </p>
      )}
    </div>
  );
}
