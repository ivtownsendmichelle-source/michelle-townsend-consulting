import { describe, it, expect } from 'vitest';
import { calcPimStage } from '../../src/utils/pimStage';

function makeInventories({ resentments = [], fears = [], sex = [], harms = [] } = {}) {
  return { resentments, fears, sex, harms };
}

describe('calcPimStage', () => {
  it('returns stage 1 with no entries', () => {
    const inventories = makeInventories();
    expect(calcPimStage(inventories)).toBe(1);
  });

  it('returns stage 2 with a single entry in any section', () => {
    expect(calcPimStage(makeInventories({ resentments: ['a'] }))).toBe(2);
    expect(calcPimStage(makeInventories({ fears: ['a'] }))).toBe(2);
    expect(calcPimStage(makeInventories({ sex: ['a'] }))).toBe(2);
    expect(calcPimStage(makeInventories({ harms: ['a'] }))).toBe(2);
  });

  it('returns stage 3 with 10 total entries', () => {
    const inventories = makeInventories({
      resentments: ['a', 'b', 'c'],
      fears: ['a', 'b', 'c'],
      sex: ['a', 'b'],
      harms: ['a', 'b'],
    });
    expect(calcPimStage(inventories)).toBe(3);
  });

  it('returns stage 3 when one section has 3+ entries even with fewer than 10 total', () => {
    const inventories = makeInventories({
      resentments: ['a', 'b', 'c'],
    });
    expect(calcPimStage(inventories)).toBe(3);
  });

  it('returns stage 4 when all sections have entries AND 25+ total', () => {
    const inventories = makeInventories({
      resentments: Array.from({ length: 7 }, (_, i) => `r${i}`),
      fears: Array.from({ length: 6 }, (_, i) => `f${i}`),
      sex: Array.from({ length: 6 }, (_, i) => `s${i}`),
      harms: Array.from({ length: 6 }, (_, i) => `h${i}`),
    });
    // total = 25, all sections filled
    expect(calcPimStage(inventories)).toBe(4);
  });

  it('returns stage 3 (not 4) when 25+ entries but not all sections filled', () => {
    const inventories = makeInventories({
      resentments: Array.from({ length: 25 }, (_, i) => `r${i}`),
    });
    expect(calcPimStage(inventories)).toBe(3);
  });

  it('caps at stage 4 even with many more entries', () => {
    const inventories = makeInventories({
      resentments: Array.from({ length: 50 }, (_, i) => `r${i}`),
      fears: Array.from({ length: 50 }, (_, i) => `f${i}`),
      sex: Array.from({ length: 50 }, (_, i) => `s${i}`),
      harms: Array.from({ length: 50 }, (_, i) => `h${i}`),
    });
    expect(calcPimStage(inventories)).toBe(4);
  });
});
