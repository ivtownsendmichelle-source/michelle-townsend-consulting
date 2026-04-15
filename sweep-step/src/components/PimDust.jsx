/**
 * PimDust
 * Ambient dust particles that appear around Pim based on neglect level (0–3).
 * Level 0: no particles. Level 1–3: level * 4 floating particles.
 */
export function PimDust({ level }) {
  if (level === 0) return null;

  const particleCount = level * 4;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const size = 2 + Math.random() * 3;
        const left = 10 + Math.random() * 80;
        const bottom = Math.random() * 30;
        const delay = Math.random() * 4;
        const duration = 3 + Math.random() * 3;
        return (
          <div
            key={i}
            className="absolute rounded-full bg-ink/15"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: `${bottom}%`,
              animation: `pimDustFloat ${duration}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes pimDustFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-8px) scale(1.1); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
