import { useState, useEffect, useRef } from 'react';
import { verifyPin } from '../store/pin';

const MAX_ATTEMPTS = 10;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_SECONDS = 60;

export default function PinGate({ store, onWipe, children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [lockedOut, setLockedOut] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startLockout() {
    setLockedOut(true);
    setLockoutRemaining(LOCKOUT_SECONDS);
    setError('');
    timerRef.current = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setLockedOut(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleUnlock() {
    if (lockedOut) return;

    if (verifyPin(pin, store.user.pinHash)) {
      setUnlocked(true);
      setError('');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setPin('');

    if (newAttempts >= MAX_ATTEMPTS) {
      setShowWipeConfirm(true);
      setError('');
      return;
    }

    if (newAttempts >= LOCKOUT_THRESHOLD) {
      startLockout();
      return;
    }

    const remaining = MAX_ATTEMPTS - newAttempts;
    setError(`Incorrect PIN. ${remaining} attempts remaining.`);
  }

  function handleWipe() {
    onWipe();
  }

  function handleTryAgain() {
    setAttempts(0);
    setShowWipeConfirm(false);
    setError('');
    setPin('');
  }

  if (unlocked) {
    return <>{children}</>;
  }

  if (showWipeConfirm) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: '#F5F1E8', color: '#1A1A1A' }}
      >
        <h1 className="font-display text-3xl mb-6" style={{ color: '#7A1F2B' }}>
          Sweep Step
        </h1>
        <p className="font-body text-center mb-8">
          Too many failed attempts. All data will be erased if you continue.
        </p>
        <button
          onClick={handleWipe}
          style={{
            backgroundColor: '#7A1F2B',
            color: '#F5F1E8',
            minHeight: '44px',
            padding: '12px 24px',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '1rem',
            cursor: 'pointer',
            border: 'none',
            width: '100%',
            maxWidth: '320px',
            marginBottom: '12px',
          }}
        >
          Erase Everything
        </button>
        <button
          onClick={handleTryAgain}
          style={{
            backgroundColor: 'transparent',
            color: '#1A1A1A',
            minHeight: '44px',
            padding: '12px 24px',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '1rem',
            cursor: 'pointer',
            border: '1px solid #1A1A1A',
            width: '100%',
            maxWidth: '320px',
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: '#F5F1E8', color: '#1A1A1A' }}
    >
      <h1 className="font-display text-3xl mb-8" style={{ color: '#1A1A1A' }}>
        Sweep Step
      </h1>

      <div style={{ width: '100%', maxWidth: '320px' }}>
        <label
          htmlFor="pin-input"
          style={{ display: 'block', marginBottom: '8px', fontFamily: 'inherit' }}
        >
          Enter your PIN
        </label>
        <input
          id="pin-input"
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          minLength={4}
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          disabled={lockedOut}
          aria-label="PIN"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1.25rem',
            borderRadius: '8px',
            border: '1px solid #1A1A1A',
            backgroundColor: '#fff',
            marginBottom: '12px',
            boxSizing: 'border-box',
            letterSpacing: '0.25em',
          }}
        />

        {error && (
          <p
            role="alert"
            style={{ color: '#7A1F2B', marginBottom: '12px', fontFamily: 'inherit', fontSize: '0.9rem' }}
          >
            {error}
          </p>
        )}

        {lockedOut && (
          <p
            role="alert"
            style={{ color: '#7A1F2B', marginBottom: '12px', fontFamily: 'inherit', fontSize: '0.9rem' }}
          >
            Locked out. Try again in {lockoutRemaining}s.
          </p>
        )}

        <button
          onClick={handleUnlock}
          disabled={lockedOut || pin.length < 4}
          style={{
            backgroundColor: '#6B2FBF',
            color: '#F5F1E8',
            minHeight: '44px',
            padding: '12px 24px',
            borderRadius: '8px',
            fontFamily: 'inherit',
            fontSize: '1rem',
            cursor: lockedOut ? 'not-allowed' : 'pointer',
            border: 'none',
            width: '100%',
            opacity: lockedOut || pin.length < 4 ? 0.6 : 1,
          }}
        >
          Unlock
        </button>
      </div>
    </div>
  );
}
