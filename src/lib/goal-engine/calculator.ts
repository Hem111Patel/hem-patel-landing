import type { BodyComposition, MacroTargets, UserProfile } from '@/types';

const ACTIVITY_MULTIPLIERS: Record<UserProfile['activityLevel'], number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

/** Mifflin-St Jeor BMR */
function calculateBMR(profile: UserProfile): number {
  const { weightKg, heightCm, age, sex } = profile;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

function calculateTDEE(profile: UserProfile): number {
  return calculateBMR(profile) * ACTIVITY_MULTIPLIERS[profile.activityLevel];
}

/** Adjust calorie target based on goal and recent body composition trends */
export function calculateDailyTargets(
  profile: UserProfile,
  recentComposition?: BodyComposition[],
): MacroTargets {
  let tdee = calculateTDEE(profile);

  // Goal-based calorie adjustment
  switch (profile.goal) {
    case 'lose_fat':
      tdee -= 400; // ~0.4 kg/week deficit
      break;
    case 'gain_muscle':
      tdee += 250;
      break;
    default:
      break;
  }

  // Adjust based on Renpho body composition trends
  if (recentComposition && recentComposition.length >= 2) {
    const sorted = [...recentComposition].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const oldest = sorted[0];
    const latest = sorted[sorted.length - 1];
    const fatChange = latest.bodyFatPercent - oldest.bodyFatPercent;
    const muscleChange = latest.muscleMassKg - oldest.muscleMassKg;

    // Losing muscle while cutting — reduce deficit
    if (profile.goal === 'lose_fat' && muscleChange < -0.3) {
      tdee += 150;
    }
    // Fat loss stalled for 2+ weeks — small additional cut
    if (profile.goal === 'lose_fat' && Math.abs(fatChange) < 0.3 && sorted.length >= 3) {
      tdee -= 100;
    }
    // Gaining fat too fast while bulking
    if (profile.goal === 'gain_muscle' && fatChange > 1) {
      tdee -= 200;
    }
  }

  const calories = Math.round(tdee);

  // High-protein split optimized for recomposition (lose fat, keep muscle)
  const protein = Math.round(profile.weightKg * 2.2); // ~1g/lb
  const fat = Math.round((calories * 0.25) / 9);
  const proteinCals = protein * 4;
  const fatCals = fat * 9;
  const carbs = Math.round((calories - proteinCals - fatCals) / 4);

  return { calories, protein, carbs, fat };
}

export function calculateWaterTarget(weightKg: number): number {
  return Math.round(weightKg * 35); // ml per kg
}

export function getReadinessLabel(score: number): string {
  if (score >= 85) return 'Optimal';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  return 'Rest';
}

export function getReadinessColor(score: number): string {
  if (score >= 85) return 'var(--accent-green)';
  if (score >= 70) return 'var(--accent-teal)';
  if (score >= 55) return 'var(--accent-amber)';
  return 'var(--accent-red)';
}
