import { MILESTONES, getYearMilestone } from '../data/milestones';

/**
 * Calculates the number of whole days between a YYYY-MM-DD date string and today.
 * @param {string} dateString - ISO date string in YYYY-MM-DD format
 * @returns {number} number of days since that date
 */
export function daysSince(dateString) {
  // Parse the start date as local midnight to avoid UTC timezone offset issues
  const [year, month, day] = dateString.split('-').map(Number);
  const startMs = Date.UTC(year, month - 1, day);

  const now = new Date();
  const todayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const diffMs = todayMs - startMs;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns the milestone object if `days` exactly matches a milestone, null otherwise.
 * Includes yearly milestones beyond year 1 (730, 1095, ...).
 * @param {number} days
 * @returns {{ days: number, label: string } | null}
 */
export function getCurrentMilestone(days) {
  // Check base milestones
  const base = MILESTONES.find(m => m.days === days);
  if (base) return base;

  // Check yearly milestones beyond year 1
  return getYearMilestone(days);
}

/**
 * Returns all milestones earned up to and including `days`.
 * Includes all base milestones with days <= count, plus yearly milestones after year 1.
 * @param {number} days
 * @returns {Array<{ days: number, label: string }>}
 */
export function getEarnedMilestones(days) {
  const earned = MILESTONES.filter(m => m.days <= days);

  // Add yearly milestones beyond year 1 (730, 1095, ...)
  if (days >= 730) {
    const maxYears = Math.floor(days / 365);
    for (let y = 2; y <= maxYears; y++) {
      const yearDays = y * 365;
      earned.push({
        days: yearDays,
        label: `${y} Years`,
      });
    }
  }

  // Sort by days ascending
  earned.sort((a, b) => a.days - b.days);

  return earned;
}

/**
 * Formats a YYYY-MM-DD date string as "Month Day, Year".
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
