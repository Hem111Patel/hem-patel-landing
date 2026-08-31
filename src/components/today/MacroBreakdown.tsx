import type { MacroConsumed, MacroTargets } from '@/types';

interface MacroBreakdownProps {
  consumed: MacroConsumed;
  targets: MacroTargets;
}

const MACROS = [
  { key: 'protein' as const, label: 'Protein', color: 'var(--protein)', unit: 'g' },
  { key: 'carbs' as const, label: 'Carbs', color: 'var(--carbs)', unit: 'g' },
  { key: 'fat' as const, label: 'Fat', color: 'var(--fat)', unit: 'g' },
];

export function MacroBreakdown({ consumed, targets }: MacroBreakdownProps) {
  return (
    <div className="macro-grid">
      {MACROS.map(({ key, label, color, unit }) => {
        const eaten = consumed[key];
        const target = targets[key];
        const pct = Math.min((eaten / target) * 100, 100);

        return (
          <div key={key} className="macro-row">
            <div className="macro-header">
              <span className="macro-name">
                <span className="macro-dot" style={{ background: color }} />
                {label}
              </span>
              <span className="macro-values">
                <strong>{eaten}{unit}</strong> / {target}{unit}
              </span>
            </div>
            <div className="macro-bar-track">
              <div
                className="macro-bar-fill"
                style={{ width: `${pct}%`, background: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
