import { Link, useLocation } from 'react-router-dom';
import SobrietyCounter from './SobrietyCounter';

export default function Layout({ sobrietyDate, children }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-dvh bg-cream font-body flex flex-col">
      {/* Top bar */}
      <header className="flex justify-center items-center px-4 pt-4 pb-2">
        {sobrietyDate ? (
          <Link to="/milestones" aria-label="View milestones">
            <SobrietyCounter sobrietyDate={sobrietyDate} />
          </Link>
        ) : null}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Bottom bar — only on home route */}
      {isHome && (
        <nav className="flex justify-around items-center px-4 py-2 border-t border-ink/10">
          <Link
            to="/settings"
            className="text-ink/40 flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Settings"
          >
            {/* Gear icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>

          <Link
            to="/export"
            className="text-ink/40 flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="Export"
          >
            {/* Download icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </Link>
        </nav>
      )}
    </div>
  );
}
