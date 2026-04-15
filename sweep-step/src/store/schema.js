export const STORAGE_KEY = 'sweep-step';

export function getDefaultStore() {
  return {
    version: 1,
    user: {
      pronouns: null,
      higherPowerTerm: null,
      sobrietyDate: null,
      pinHash: null,
      onboardingComplete: false,
    },
    pim: {
      stage: 1,
      lastInteraction: null,
      dustLevel: 0,
    },
    inventories: {
      resentments: [],
      fears: [],
      sex: [],
      harms: [],
    },
  };
}

export function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultStore();
    return JSON.parse(raw);
  } catch {
    return getDefaultStore();
  }
}

export function saveStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
