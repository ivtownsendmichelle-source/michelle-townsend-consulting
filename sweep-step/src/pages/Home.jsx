import { Link } from 'react-router-dom';
import { Pim } from '../components/Pim';
import { usePim } from '../hooks/usePim';

const TILES = [
  { label: 'Resentments', path: '/resentments', color: 'border-oxblood/30 text-oxblood' },
  { label: 'Fears', path: '/fears', color: 'border-violet/30 text-violet' },
  { label: 'Sex Inventory', path: '/sex-inventory', color: 'border-acid/40 text-ink' },
  { label: 'Harms', path: '/harms', color: 'border-ochre/30 text-ochre' },
];

export default function Home() {
  const { stage, dustLevel, tapMessage, recordAction } = usePim();

  return (
    <div className="flex flex-col items-center px-4 pb-6">
      {/* Pim section */}
      <div className="py-8">
        <Pim
          stage={stage}
          dustLevel={dustLevel}
          tapMessage={tapMessage}
          onTap={recordAction}
        />
      </div>

      {/* Inventory tiles */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {TILES.map((tile) => (
          <Link
            key={tile.path}
            to={tile.path}
            className={`border-2 ${tile.color} rounded-xl p-5 text-center font-display text-lg min-h-[80px] flex items-center justify-center`}
          >
            {tile.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
