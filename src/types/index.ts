export interface UserProfile {
  name: string;
  age: number;
  sex: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_fat' | 'maintain' | 'gain_muscle';
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MacroConsumed {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
  isQuickMeal?: boolean;
  servingLabel?: string;
}

export interface QuickMeal {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WaterLog {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface BodyComposition {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPercent: number;
  muscleMassKg: number;
  source: 'renpho' | 'manual';
}

export interface Workout {
  id: string;
  date: string;
  type: string;
  durationMin: number;
  caloriesBurned: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  source: 'polar' | 'manual';
}

export interface OuraReadiness {
  date: string;
  score: number;
  sleepScore: number;
  activityBalance: number;
  bodyTemperature: number;
  hrvBalance: number;
  recoveryIndex: number;
  restingHeartRate: number;
}

export interface OuraSleep {
  date: string;
  score: number;
  totalSleepMin: number;
  deepSleepMin: number;
  remSleepMin: number;
  efficiency: number;
}

export interface WeeklyInsight {
  id: string;
  weekStart: string;
  summary: string;
  suggestions: string[];
  correlations: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    detail: string;
  }[];
}

export interface DailySummary {
  date: string;
  macros: MacroConsumed;
  macroTargets: MacroTargets;
  waterMl: number;
  waterTargetMl: number;
  readiness: OuraReadiness | null;
  workouts: Workout[];
  foodEntries: FoodEntry[];
}
