export const MILESTONES = [
  { days: 1, label: '24 Hours' },
  { days: 30, label: '30 Days' },
  { days: 60, label: '60 Days' },
  { days: 90, label: '90 Days' },
  { days: 183, label: '6 Months' },
  { days: 274, label: '9 Months' },
  { days: 365, label: '1 Year' },
];

export function getYearMilestone(days) {
  if (days < 365) return null;
  const years = Math.floor(days / 365);
  if (days === years * 365) {
    return { days: years * 365, label: `${years} Year${years > 1 ? 's' : ''}` };
  }
  return null;
}
