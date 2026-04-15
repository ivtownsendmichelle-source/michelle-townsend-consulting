import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { STORAGE_KEY, getDefaultStore, loadStore, saveStore } from '../../src/store/schema';

describe('getDefaultStore', () => {
  it('returns version 1', () => {
    expect(getDefaultStore().version).toBe(1);
  });

  it('returns empty user with null fields and onboardingComplete: false', () => {
    const { user } = getDefaultStore();
    expect(user.pronouns).toBeNull();
    expect(user.higherPowerTerm).toBeNull();
    expect(user.sobrietyDate).toBeNull();
    expect(user.pinHash).toBeNull();
    expect(user.onboardingComplete).toBe(false);
  });

  it('returns default pim state (stage 1, null lastInteraction, dustLevel 0)', () => {
    const { pim } = getDefaultStore();
    expect(pim.stage).toBe(1);
    expect(pim.lastInteraction).toBeNull();
    expect(pim.dustLevel).toBe(0);
  });

  it('returns empty inventories arrays', () => {
    const { inventories } = getDefaultStore();
    expect(inventories.resentments).toEqual([]);
    expect(inventories.fears).toEqual([]);
    expect(inventories.sex).toEqual([]);
    expect(inventories.harms).toEqual([]);
  });
});

describe('loadStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns default when localStorage empty', () => {
    const store = loadStore();
    expect(store).toEqual(getDefaultStore());
  });

  it('returns parsed store from localStorage', () => {
    const customStore = { ...getDefaultStore(), version: 1, user: { ...getDefaultStore().user, onboardingComplete: true } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customStore));
    const store = loadStore();
    expect(store.user.onboardingComplete).toBe(true);
  });

  it('returns default on corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not-valid-json{{');
    const store = loadStore();
    expect(store).toEqual(getDefaultStore());
  });
});

describe('saveStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('persists store to localStorage', () => {
    const store = { ...getDefaultStore(), user: { ...getDefaultStore().user, onboardingComplete: true } };
    saveStore(store);
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw);
    expect(parsed.user.onboardingComplete).toBe(true);
  });
});
