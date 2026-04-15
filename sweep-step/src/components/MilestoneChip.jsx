/**
 * MilestoneChip
 * A styled span displaying a milestone label in the ochre color scheme.
 */
export default function MilestoneChip({ label }) {
  if (!label) return null;

  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-sm font-body font-semibold"
      style={{
        backgroundColor: '#D4A52A',
        color: '#1A1A1A',
      }}
    >
      {label}
    </span>
  );
}
