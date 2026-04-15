import { Link } from 'react-router-dom';
import { useAppStore } from '../hooks/useAppStore';
import { daysSince, getEarnedMilestones, formatDate } from '../utils/dates';
import MilestoneChip from '../components/MilestoneChip';

export default function Milestones() {
  const { store } = useAppStore();
  const sobrietyDate = store.user.sobrietyDate;
  const days = sobrietyDate ? daysSince(sobrietyDate) : 0;
  const earned = sobrietyDate ? getEarnedMilestones(days) : [];

  return (
    <div className="flex flex-col px-4 pt-4 pb-8 max-w-sm mx-auto">
      {/* Back link */}
      <Link
        to="/"
        className="text-ink/40 flex items-center gap-1 mb-6 min-h-[44px] self-start"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </Link>

      {/* Day count */}
      <div className="flex flex-col items-center mb-2">
        <span className="font-display text-5xl font-bold text-ink leading-none">
          {days}
        </span>
        <span className="font-body text-base text-ink/60 mt-1">days</span>
        {sobrietyDate && (
          <span className="font-body text-sm text-ink/40 mt-1">
            since {formatDate(sobrietyDate)}
          </span>
        )}
      </div>

      {/* Milestones list */}
      <div className="mt-8 flex flex-col gap-4">
        {earned.length > 0 ? (
          earned.map((m) => (
            <div key={m.days} className="flex items-center gap-3">
              <MilestoneChip label={m.label} />
              <span className="font-body text-sm text-ink/60">
                {m.days} days. You're here.
              </span>
            </div>
          ))
        ) : (
          <p className="font-body text-sm text-ink/50">
            First milestone: 24 hours. You're on your way.
          </p>
        )}
      </div>
    </div>
  );
}
