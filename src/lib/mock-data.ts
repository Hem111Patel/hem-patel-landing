import type {
  BodyComposition,
  DailySummary,
  FoodEntry,
  OuraReadiness,
  QuickMeal,
  UserProfile,
  Workout,
} from '@/types';
import { calculateDailyTargets, calculateWaterTarget } from '@/lib/goal-engine';

export const userProfile: UserProfile = {
  name: 'Hem',
  age: 28,
  sex: 'male',
  heightCm: 178,
  weightKg: 82.5,
  activityLevel: 'moderate',
  goal: 'lose_fat',
};

export const quickMeals: QuickMeal[] = [
  { id: '1', name: 'Protein Shake', emoji: '🥤', calories: 220, protein: 40, carbs: 8, fat: 3 },
  { id: '2', name: 'Greek Yogurt Bowl', emoji: '🥣', calories: 310, protein: 28, carbs: 35, fat: 8 },
  { id: '3', name: 'Chicken & Rice', emoji: '🍗', calories: 520, protein: 45, carbs: 55, fat: 10 },
  { id: '4', name: 'Eggs & Toast', emoji: '🍳', calories: 380, protein: 22, carbs: 30, fat: 18 },
  { id: '5', name: 'Salmon Salad', emoji: '🥗', calories: 450, protein: 38, carbs: 20, fat: 26 },
  { id: '6', name: 'Overnight Oats', emoji: '🌾', calories: 340, protein: 15, carbs: 52, fat: 9 },
];

const today = new Date().toISOString().split('T')[0];

export const mockFoodEntries: FoodEntry[] = [
  { id: 'f1', name: 'Eggs & Toast', calories: 380, protein: 22, carbs: 30, fat: 18, timestamp: `${today}T08:15:00`, isQuickMeal: true },
  { id: 'f2', name: 'Protein Shake', calories: 220, protein: 40, carbs: 8, fat: 3, timestamp: `${today}T12:30:00`, isQuickMeal: true },
  { id: 'f3', name: 'Chicken & Rice', calories: 520, protein: 45, carbs: 55, fat: 10, timestamp: `${today}T19:00:00`, isQuickMeal: true },
  { id: 'f4', name: 'Almonds (30g)', calories: 175, protein: 6, carbs: 6, fat: 15, timestamp: `${today}T15:45:00` },
];

export const mockOuraReadiness: OuraReadiness = {
  date: today,
  score: 78,
  sleepScore: 82,
  activityBalance: 75,
  bodyTemperature: 0.1,
  hrvBalance: 80,
  recoveryIndex: 72,
  restingHeartRate: 58,
};

export const mockWorkouts: Workout[] = [
  {
    id: 'w1',
    date: today,
    type: 'Strength Training',
    durationMin: 52,
    caloriesBurned: 380,
    avgHeartRate: 128,
    maxHeartRate: 165,
    source: 'polar',
  },
];

export const mockBodyComposition: BodyComposition[] = [
  { id: 'b1', date: '2026-07-01', weightKg: 84.2, bodyFatPercent: 22.1, muscleMassKg: 38.5, source: 'renpho' },
  { id: 'b2', date: '2026-07-15', weightKg: 83.6, bodyFatPercent: 21.4, muscleMassKg: 38.6, source: 'renpho' },
  { id: 'b3', date: '2026-08-01', weightKg: 83.1, bodyFatPercent: 20.8, muscleMassKg: 38.7, source: 'renpho' },
  { id: 'b4', date: '2026-08-15', weightKg: 82.8, bodyFatPercent: 20.2, muscleMassKg: 38.8, source: 'renpho' },
  { id: 'b5', date: '2026-08-30', weightKg: 82.5, bodyFatPercent: 19.6, muscleMassKg: 38.9, source: 'renpho' },
];

export function getTodaySummary(): DailySummary {
  const macroTargets = calculateDailyTargets(userProfile, mockBodyComposition);
  const macros = mockFoodEntries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  return {
    date: today,
    macros,
    macroTargets,
    waterMl: 1750,
    waterTargetMl: calculateWaterTarget(userProfile.weightKg),
    readiness: mockOuraReadiness,
    workouts: mockWorkouts,
    foodEntries: mockFoodEntries,
  };
}
