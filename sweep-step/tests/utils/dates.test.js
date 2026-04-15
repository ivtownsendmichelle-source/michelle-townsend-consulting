import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { daysSince, getCurrentMilestone, getEarnedMilestones, formatDate } from '../../src/utils/dates';

describe('daysSince', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns 0 for today', () => {
    vi.setSystemTime(new Date('2026-04-14'));
    expect(daysSince('2026-04-14')).toBe(0);
  });

  it('returns correct days for a past date', () => {
    vi.setSystemTime(new Date('2026-04-14'));
    expect(daysSince('2026-03-15')).toBe(30);
  });

  it('returns correct days for 1 year ago', () => {
    vi.setSystemTime(new Date('2026-04-14'));
    expect(daysSince('2025-04-14')).toBe(365);
  });

  it('returns correct days for 2 years ago', () => {
    vi.setSystemTime(new Date('2027-04-14'));
    expect(daysSince('2025-04-14')).toBe(730);
  });
});

describe('getCurrentMilestone', () => {
  it('returns the 24 Hours milestone for day 1', () => {
    const milestone = getCurrentMilestone(1);
    expect(milestone).not.toBeNull();
    expect(milestone.days).toBe(1);
    expect(milestone.label).toBe('24 Hours');
  });

  it('returns the 30 Days milestone for day 30', () => {
    const milestone = getCurrentMilestone(30);
    expect(milestone).not.toBeNull();
    expect(milestone.days).toBe(30);
    expect(milestone.label).toBe('30 Days');
  });

  it('returns the 1 Year milestone for day 365', () => {
    const milestone = getCurrentMilestone(365);
    expect(milestone).not.toBeNull();
    expect(milestone.days).toBe(365);
    expect(milestone.label).toBe('1 Year');
  });

  it('returns a 2 Year milestone for day 730', () => {
    const milestone = getCurrentMilestone(730);
    expect(milestone).not.toBeNull();
    expect(milestone.days).toBe(730);
    expect(milestone.label).toBe('2 Years');
  });

  it('returns null for day 0', () => {
    expect(getCurrentMilestone(0)).toBeNull();
  });

  it('returns null for day 2', () => {
    expect(getCurrentMilestone(2)).toBeNull();
  });

  it('returns null for a non-milestone day like 45', () => {
    expect(getCurrentMilestone(45)).toBeNull();
  });
});

describe('getEarnedMilestones', () => {
  it('returns empty array for 0 days', () => {
    expect(getEarnedMilestones(0)).toHaveLength(0);
  });

  it('returns only the 24 Hours milestone for day 1', () => {
    const earned = getEarnedMilestones(1);
    expect(earned).toHaveLength(1);
    expect(earned[0].label).toBe('24 Hours');
  });

  it('returns all milestones up to 90 days for day 90', () => {
    const earned = getEarnedMilestones(90);
    expect(earned).toHaveLength(4); // 1, 30, 60, 90
    expect(earned.map(m => m.days)).toEqual([1, 30, 60, 90]);
  });

  it('returns all 7 base milestones for day 365', () => {
    const earned = getEarnedMilestones(365);
    expect(earned).toHaveLength(7); // 1, 30, 60, 90, 183, 274, 365
    expect(earned[earned.length - 1].label).toBe('1 Year');
  });

  it('includes yearly milestones beyond year 1 for day 730', () => {
    const earned = getEarnedMilestones(730);
    const labels = earned.map(m => m.label);
    expect(labels).toContain('1 Year');
    expect(labels).toContain('2 Years');
  });

  it('returns milestones sorted by days ascending', () => {
    const earned = getEarnedMilestones(365);
    for (let i = 1; i < earned.length; i++) {
      expect(earned[i].days).toBeGreaterThan(earned[i - 1].days);
    }
  });
});

describe('formatDate', () => {
  it('formats a date string as Month Day, Year', () => {
    expect(formatDate('2025-04-14')).toBe('April 14, 2025');
  });

  it('formats January 1 correctly', () => {
    expect(formatDate('2025-01-01')).toBe('January 1, 2025');
  });

  it('formats December 31 correctly', () => {
    expect(formatDate('2025-12-31')).toBe('December 31, 2025');
  });
});
