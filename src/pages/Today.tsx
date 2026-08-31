import { format } from 'date-fns';
import { CalorieRing } from '@/components/today/CalorieRing';
import { MacroBreakdown } from '@/components/today/MacroBreakdown';
import { RecoveryScore } from '@/components/today/RecoveryScore';
import { getTodaySummary } from '@/lib/mock-data';

export function TodayPage() {
  const summary = getTodaySummary();
  const today = format(new Date(), 'EEEE, MMM d');

  const waterPct = Math.round((summary.waterMl / summary.waterTargetMl) * 100);
  const workoutCalories = summary.workouts.reduce((s, w) => s + w.caloriesBurned, 0);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Today</h1>
        <div className="date">{today}</div>
      </header>

      <section className="section">
        <div className="card">
          <CalorieRing
            consumed={summary.macros.calories}
            target={summary.macroTargets.calories}
          />
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-title">Macros</div>
          <MacroBreakdown
            consumed={summary.macros}
            targets={summary.macroTargets}
          />
        </div>
      </section>

      {summary.readiness && (
        <section className="section">
          <div className="card">
            <div className="card-title">Recovery · Oura</div>
            <RecoveryScore readiness={summary.readiness} />
          </div>
        </section>
      )}

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{waterPct}%</div>
          <div className="stat-label">
            Water · {(summary.waterMl / 1000).toFixed(1)}L / {(summary.waterTargetMl / 1000).toFixed(1)}L
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{workoutCalories}</div>
          <div className="stat-label">
            Burned · {summary.workouts.length} workout{summary.workouts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
