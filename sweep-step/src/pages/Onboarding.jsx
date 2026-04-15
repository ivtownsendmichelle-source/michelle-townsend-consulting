import { useState } from 'react';
import { hashPin } from '../store/pin';

const HP_OPTIONS = [
  'Higher Power',
  'God',
  'G.O.D. (Group Of Drunks)',
  'The Universe',
  'Nature',
  'The Group',
];

const TODAY = new Date().toISOString().split('T')[0];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);

  // Step 1
  const [pronouns, setPronouns] = useState('');

  // Step 2
  const [hpChoice, setHpChoice] = useState('Higher Power');
  const [customHP, setCustomHP] = useState('');

  // Step 3
  const [sobrietyDate, setSobrietyDate] = useState('');

  // Step 4
  const [pin, setPin] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinAcknowledged, setPinAcknowledged] = useState(false);
  const [pinError, setPinError] = useState('');

  const advance = () => setStep((s) => s + 1);

  const validatePin = () => {
    if (!/^\d{4,6}$/.test(pin)) {
      setPinError('PIN must be 4 to 6 digits.');
      return false;
    }
    if (pin !== pinConfirm) {
      setPinError('PINs do not match.');
      return false;
    }
    if (!pinAcknowledged) {
      setPinError('You must check the acknowledgement box.');
      return false;
    }
    setPinError('');
    return true;
  };

  const handlePinContinue = () => {
    if (validatePin()) advance();
  };

  const handleComplete = () => {
    let higherPowerTerm;
    if (hpChoice === 'skip') {
      higherPowerTerm = null;
    } else if (hpChoice === 'custom') {
      higherPowerTerm = customHP.trim() || null;
    } else {
      higherPowerTerm = hpChoice;
    }

    onComplete({
      pronouns: pronouns.trim(),
      higherPowerTerm,
      sobrietyDate,
      pinHash: hashPin(pin),
    });
  };

  const screenClass =
    'min-h-dvh bg-cream flex flex-col items-center justify-center p-6 gap-6 w-full max-w-md mx-auto';

  const btnClass =
    'bg-ink text-cream rounded-lg px-8 py-3 font-body text-lg min-h-[44px] w-full disabled:opacity-40 disabled:cursor-not-allowed';

  const inputClass =
    'border-2 border-ink/20 rounded-lg p-3 bg-cream focus:border-violet focus:outline-none w-full font-body text-base';

  const radioLabelClass =
    'flex items-center gap-3 min-h-[44px] cursor-pointer font-body text-base';

  const radioClass = 'w-5 h-5 accent-violet flex-shrink-0';

  // ── Step 0: Welcome ──────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className={screenClass}>
        <h1 className="font-display text-4xl text-ink text-center leading-tight">
          Sweep Step
        </h1>
        <p className="font-body text-lg text-ink/80 text-center leading-relaxed">
          This is Sweep Step. It's yours. Nothing here leaves your phone.
        </p>
        <button className={btnClass} onClick={advance}>
          Continue
        </button>
      </div>
    );
  }

  // ── Step 1: Pronouns ─────────────────────────────────────────────────────
  if (step === 1) {
    return (
      <div className={screenClass}>
        <h2 className="font-display text-2xl text-ink text-center">Pronouns</h2>
        <p className="font-body text-base text-ink/70 text-center">
          Optional. Used in some messages.
        </p>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. they/them, she/her"
          value={pronouns}
          onChange={(e) => setPronouns(e.target.value)}
          autoComplete="off"
        />
        <button className={btnClass} onClick={advance}>
          Continue
        </button>
      </div>
    );
  }

  // ── Step 2: Higher Power Language ────────────────────────────────────────
  if (step === 2) {
    return (
      <div className={screenClass}>
        <h2 className="font-display text-2xl text-ink text-center">
          Higher Power Language
        </h2>
        <p className="font-body text-base text-ink/70 text-center">
          This word replaces "God" throughout the worksheets.
        </p>
        <div className="flex flex-col gap-1 w-full">
          {HP_OPTIONS.map((option) => (
            <label key={option} className={radioLabelClass}>
              <input
                type="radio"
                name="hp"
                className={radioClass}
                value={option}
                checked={hpChoice === option}
                onChange={() => setHpChoice(option)}
              />
              {option}
            </label>
          ))}

          <label className={radioLabelClass}>
            <input
              type="radio"
              name="hp"
              className={radioClass}
              value="custom"
              checked={hpChoice === 'custom'}
              onChange={() => setHpChoice('custom')}
            />
            My own word
          </label>
          {hpChoice === 'custom' && (
            <input
              type="text"
              className={`${inputClass} mt-1 ml-8`}
              placeholder="Your word or phrase"
              value={customHP}
              onChange={(e) => setCustomHP(e.target.value)}
              autoFocus
            />
          )}

          <label className={radioLabelClass}>
            <input
              type="radio"
              name="hp"
              className={radioClass}
              value="skip"
              checked={hpChoice === 'skip'}
              onChange={() => setHpChoice('skip')}
            />
            Skip
          </label>
        </div>
        <button className={btnClass} onClick={advance}>
          Continue
        </button>
      </div>
    );
  }

  // ── Step 3: Sobriety Date ────────────────────────────────────────────────
  if (step === 3) {
    return (
      <div className={screenClass}>
        <h2 className="font-display text-2xl text-ink text-center">
          Sobriety Date
        </h2>
        <p className="font-body text-base text-ink/70 text-center">
          When did your current journey begin?
        </p>
        <input
          type="date"
          className={inputClass}
          max={TODAY}
          aria-label="Sobriety date"
          value={sobrietyDate}
          onChange={(e) => setSobrietyDate(e.target.value)}
        />
        <button
          className={btnClass}
          onClick={advance}
          disabled={!sobrietyDate}
        >
          Continue
        </button>
      </div>
    );
  }

  // ── Step 4: PIN Setup ────────────────────────────────────────────────────
  if (step === 4) {
    return (
      <div className={screenClass}>
        <h2 className="font-display text-2xl text-ink text-center">
          Set Your PIN
        </h2>

        <div className="w-full rounded-lg border-2 border-oxblood bg-oxblood/10 p-4">
          <p className="font-body text-sm text-oxblood leading-relaxed">
            There is no recovery for this PIN. If you forget it, your data is
            gone. We cannot reset it. This is the cost of true privacy. Write it
            down somewhere safe.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="pin"
              className="font-body text-sm text-ink/70"
            >
              Choose a PIN (4–6 digits)
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              className={inputClass}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="pin-confirm"
              className="font-body text-sm text-ink/70"
            >
              Confirm PIN
            </label>
            <input
              id="pin-confirm"
              type="password"
              inputMode="numeric"
              maxLength={6}
              className={inputClass}
              value={pinConfirm}
              onChange={(e) =>
                setPinConfirm(e.target.value.replace(/\D/g, ''))
              }
              autoComplete="new-password"
            />
          </div>

          <label className="flex items-start gap-3 min-h-[44px] cursor-pointer font-body text-sm text-ink/80 leading-relaxed">
            <input
              type="checkbox"
              className="w-5 h-5 accent-violet flex-shrink-0 mt-0.5"
              checked={pinAcknowledged}
              onChange={(e) => setPinAcknowledged(e.target.checked)}
            />
            I understand there is no way to recover my PIN
          </label>

          {pinError && (
            <p className="font-body text-sm text-oxblood" role="alert">
              {pinError}
            </p>
          )}
        </div>

        <button className={btnClass} onClick={handlePinContinue}>
          Continue
        </button>
      </div>
    );
  }

  // ── Step 5: Meet Pim ─────────────────────────────────────────────────────
  if (step === 5) {
    return (
      <div className={screenClass}>
        <h2 className="font-display text-2xl text-ink text-center">
          Meet Pim
        </h2>

        {/* Placeholder circle — will be replaced with real Pim art */}
        <div
          className="w-36 h-36 rounded-full bg-ink/10 flex items-center justify-center"
          aria-label="Pim placeholder"
        >
          <div className="w-20 h-20 rounded-full bg-ink/20" />
        </div>

        <p className="font-body text-lg text-ink/80 text-center leading-relaxed max-w-xs">
          This is Pim. Pim is dust right now. So were you, once. As you do the
          work, Pim becomes more. Pim never dies. Pim never judges. Pim just
          waits.
        </p>

        <button className={btnClass} onClick={handleComplete}>
          Let's begin
        </button>
      </div>
    );
  }

  return null;
}
