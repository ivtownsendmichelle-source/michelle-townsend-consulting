import { describe, it, expect } from 'vitest';
import { generateJSON, generatePlainText } from '../../src/utils/export';
import { getDefaultStore } from '../../src/store/schema';

describe('generateJSON', () => {
  it('returns valid JSON with version and inventories', () => {
    const store = getDefaultStore();
    const json = generateJSON(store);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.inventories).toBeDefined();
    expect(parsed.inventories.resentments).toBeInstanceOf(Array);
    expect(parsed.inventories.fears).toBeInstanceOf(Array);
    expect(parsed.inventories.sex).toBeInstanceOf(Array);
    expect(parsed.inventories.harms).toBeInstanceOf(Array);
  });
});

describe('generatePlainText', () => {
  it('includes section headers', () => {
    const store = getDefaultStore();
    const text = generatePlainText(store);
    expect(text).toContain('=== RESENTMENTS ===');
    expect(text).toContain('=== FEARS ===');
    expect(text).toContain('=== SEX INVENTORY ===');
    expect(text).toContain('=== HARMS ===');
  });

  it('shows (none) for empty sections', () => {
    const store = getDefaultStore();
    const text = generatePlainText(store);
    // All sections empty → 4 occurrences of (none)
    const matches = text.match(/\(none\)/g);
    expect(matches).not.toBeNull();
    expect(matches.length).toBe(4);
  });

  it('includes numbered entries when entries exist', () => {
    const store = getDefaultStore();
    store.inventories.resentments = [
      {
        id: '1',
        resentfulAt: 'My boss',
        cause: 'Was unfair',
        affects: ['Self-esteem', 'Pride'],
        affects_other: '',
        myPart: ['Selfish'],
        myPart_other: '',
      },
    ];
    store.inventories.fears = [
      {
        id: '2',
        fear: 'Failure',
        why: 'Never enough',
        selfCause: 'Perfectionism',
        hpDirection: 'Trust the process',
      },
    ];
    const text = generatePlainText(store);
    expect(text).toContain('1. Resentful at: My boss');
    expect(text).toContain('Cause: Was unfair');
    expect(text).toContain('1. Fear: Failure');
    expect(text).toContain('Why: Never enough');
  });
});
