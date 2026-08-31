import type { OuraReadiness } from '@/types';
import { getReadinessColor, getReadinessLabel } from '@/lib/goal-engine';

interface RecoveryScoreProps {
  readiness: OuraReadiness;
}

export function RecoveryScore({ readiness }: RecoveryScoreProps) {
  const { score, sleepScore, hrvBalance, restingHeartRate } = readiness;
  const color = getReadinessColor(score);
  const label = getReadinessLabel(score);
  const size = 100;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  const metrics = [
    { name: 'Sleep', value: sleepScore },
    { name: 'HRV Balance', value: hrvBalance },
    { name: 'Resting HR', value: `${restingHeartRate} bpm` },
  ];

  return (
    <div className="recovery-card">
      <div className="recovery-score-ring" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--bg-elevated)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="recovery-score-value">
          <div className="recovery-score-number" style={{ color }}>{score}</div>
          <div className="recovery-score-label" style={{ color }}>{label}</div>
        </div>
      </div>
      <div className="recovery-details">
        {metrics.map(({ name, value }) => (
          <div key={name} className="recovery-metric">
            <span className="recovery-metric-name">{name}</span>
            <span className="recovery-metric-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
