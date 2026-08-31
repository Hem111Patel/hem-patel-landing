interface CalorieRingProps {
  consumed: number;
  target: number;
  size?: number;
}

export function CalorieRing({ consumed, target, size = 200 }: CalorieRingProps) {
  const remaining = Math.max(target - consumed, 0);
  const progress = Math.min(consumed / target, 1);
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const overBudget = consumed > target;

  return (
    <div className="calorie-ring-container">
      <div className="calorie-ring-wrapper" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="calorie-ring-svg">
          <circle
            className="calorie-ring-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="calorie-ring-progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ stroke: overBudget ? 'var(--accent-red)' : 'var(--calorie-ring)' }}
          />
        </svg>
        <div className="calorie-ring-center">
          <div className="calorie-remaining">{overBudget ? 0 : remaining}</div>
          <div className="calorie-label">{overBudget ? 'over budget' : 'cal remaining'}</div>
        </div>
      </div>
      <div className="calorie-sub">
        {consumed.toLocaleString()} / {target.toLocaleString()} cal eaten
      </div>
    </div>
  );
}
