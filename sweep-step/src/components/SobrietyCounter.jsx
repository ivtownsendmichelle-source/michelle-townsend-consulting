import { daysSince, getCurrentMilestone } from '../utils/dates';
import MilestoneChip from './MilestoneChip';

/**
 * SobrietyCounter
 * A tappable button displaying the days sober count and the current milestone chip (if any).
 *
 * Props:
 *   sobrietyDate {string} — YYYY-MM-DD date string
 *   onTap {function} — called when the button is tapped
 */
export default function SobrietyCounter({ sobrietyDate, onTap }) {
  if (!sobrietyDate) return null;

  const days = daysSince(sobrietyDate);
  const milestone = getCurrentMilestone(days);

  return (
    <button
      type="button"
      onClick={onTap}
      className="flex flex-col items-center gap-2 p-4 rounded-xl bg-cream border border-ink/10 min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
      aria-label={`${days} days sober${milestone ? `, ${milestone.label} milestone` : ''}`}
    >
      <span
        className="font-display text-5xl font-bold text-ink leading-none"
        aria-hidden="true"
      >
        {days}
      </span>
      <span className="font-body text-sm text-ink/70">
        {days === 1 ? 'day' : 'days'}
      </span>
      {milestone && <MilestoneChip label={milestone.label} />}
    </button>
  );
}
