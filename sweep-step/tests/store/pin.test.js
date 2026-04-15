import { describe, it, expect } from 'vitest';
import { hashPin, verifyPin } from '../../src/store/pin';

describe('hashPin', () => {
  it('returns a string different from the input', () => {
    const result = hashPin('1234');
    expect(typeof result).toBe('string');
    expect(result).not.toBe('1234');
  });

  it('produces the same hash for the same input', () => {
    expect(hashPin('5678')).toBe(hashPin('5678'));
    expect(hashPin('123456')).toBe(hashPin('123456'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hashPin('1234')).not.toBe(hashPin('1235'));
    expect(hashPin('0000')).not.toBe(hashPin('9999'));
  });
});

describe('verifyPin', () => {
  it('returns true when PIN matches stored hash', () => {
    const stored = hashPin('4321');
    expect(verifyPin('4321', stored)).toBe(true);
  });

  it('returns false when PIN does not match stored hash', () => {
    const stored = hashPin('4321');
    expect(verifyPin('1234', stored)).toBe(false);
    expect(verifyPin('', stored)).toBe(false);
  });
});
