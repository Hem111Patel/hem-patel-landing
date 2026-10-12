import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FoodEntry, MacroConsumed, QuickMeal } from '@/types';
import { userProfile, mockBodyComposition } from '@/lib/mock-data';
import { calculateDailyTargets } from '@/lib/goal-engine';

const MEALS_KEY = 'hem-health:quick-meals';
const ENTRIES_KEY = 'hem-health:food-entries';

export const DEFAULT_QUICK_MEALS: QuickMeal[] = [
  { id: '1', name: 'Protein Shake', emoji: '🥤', calories: 220, protein: 40, carbs: 8, fat: 3 },
  { id: '2', name: 'Greek Yogurt Bowl', emoji: '🥣', calories: 310, protein: 28, carbs: 35, fat: 8 },
  { id: '3', name: 'Chicken & Rice', emoji: '🍗', calories: 520, protein: 45, carbs: 55, fat: 10 },
  { id: '4', name: 'Eggs & Toast', emoji: '🍳', calories: 380, protein: 22, carbs: 30, fat: 18 },
  { id: '5', name: 'Salmon Salad', emoji: '🥗', calories: 450, protein: 38, carbs: 20, fat: 26 },
  { id: '6', name: 'Overnight Oats', emoji: '🌾', calories: 340, protein: 15, carbs: 52, fat: 9 },
  { id: '7', name: 'Protein Bar', emoji: '🍫', calories: 210, protein: 20, carbs: 22, fat: 7 },
  { id: '8', name: 'Steak & Veg', emoji: '🥩', calories: 480, protein: 42, carbs: 18, fat: 24 },
];

function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Storage can throw (private mode, quota). State should still update in memory. */
function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore: the app keeps working for this session
  }
}

/** crypto.randomUUID only exists in secure contexts; plain http on a LAN is not one. */
function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isQuickMeal(value: unknown): value is QuickMeal {
  const m = value as Partial<QuickMeal> | null;
  return (
    !!m &&
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    typeof m.emoji === 'string' &&
    isFiniteNumber(m.calories) &&
    isFiniteNumber(m.protein) &&
    isFiniteNumber(m.carbs) &&
    isFiniteNumber(m.fat)
  );
}

function isFoodEntry(value: unknown): value is FoodEntry {
  const e = value as Partial<FoodEntry> | null;
  return (
    !!e &&
    typeof e.id === 'string' &&
    typeof e.name === 'string' &&
    typeof e.timestamp === 'string' &&
    !Number.isNaN(new Date(e.timestamp).getTime()) &&
    isFiniteNumber(e.calories) &&
    isFiniteNumber(e.protein) &&
    isFiniteNumber(e.carbs) &&
    isFiniteNumber(e.fat)
  );
}

/** Always returns exactly 8 slots, keeping any valid saved meal and defaulting the rest. */
function loadMeals(): QuickMeal[] {
  const saved = loadJson<unknown>(MEALS_KEY, []);
  const valid = Array.isArray(saved) ? saved.filter(isQuickMeal) : [];
  const byId = new Map(valid.map((m) => [m.id, m]));
  return DEFAULT_QUICK_MEALS.map((meal) => byId.get(meal.id) ?? meal);
}

function loadEntries(): FoodEntry[] {
  const saved = loadJson<unknown>(ENTRIES_KEY, []);
  return Array.isArray(saved) ? saved.filter(isFoodEntry) : [];
}

function cleanNumber(value: number): number {
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
}

function roundMacros(entry: Pick<FoodEntry, 'calories' | 'protein' | 'carbs' | 'fat'>) {
  return {
    calories: cleanNumber(entry.calories),
    protein: cleanNumber(entry.protein),
    carbs: cleanNumber(entry.carbs),
    fat: cleanNumber(entry.fat),
  };
}

function sumEntries(entries: FoodEntry[]): MacroConsumed {
  return entries.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

interface FoodStoreValue {
  meals: QuickMeal[];
  todayEntries: FoodEntry[];
  consumed: MacroConsumed;
  macroTargets: ReturnType<typeof calculateDailyTargets>;
  addEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'> & { timestamp?: string }) => void;
  deleteEntry: (id: string) => void;
  updateMeal: (id: string, patch: Partial<Omit<QuickMeal, 'id'>>) => void;
}

const FoodStoreContext = createContext<FoodStoreValue | null>(null);

export function FoodStoreProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<QuickMeal[]>(loadMeals);
  const [entries, setEntries] = useState<FoodEntry[]>(loadEntries);
  const [todayKey, setTodayKey] = useState(() => localDateKey());

  // A home-screen PWA is suspended and resumed, not reloaded. Re-check the date on resume
  // (and on a timer while open) so "today" rolls over at midnight.
  useEffect(() => {
    const refresh = () => setTodayKey(localDateKey());
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 60_000);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', refresh);
      window.clearInterval(timer);
    };
  }, []);

  const persistMeals = useCallback((next: QuickMeal[]) => {
    setMeals(next);
    saveJson(MEALS_KEY, next);
  }, []);

  const persistEntries = useCallback((next: FoodEntry[]) => {
    setEntries(next);
    saveJson(ENTRIES_KEY, next);
  }, []);

  const todayEntries = useMemo(
    () =>
      entries
        .filter((e) => localDateKey(new Date(e.timestamp)) === todayKey)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [entries, todayKey],
  );

  const consumed = useMemo(() => sumEntries(todayEntries), [todayEntries]);
  const macroTargets = useMemo(
    () => calculateDailyTargets(userProfile, mockBodyComposition),
    [],
  );

  const addEntry = useCallback(
    (entry: Omit<FoodEntry, 'id' | 'timestamp'> & { timestamp?: string }) => {
      const next: FoodEntry = {
        ...roundMacros(entry),
        name: entry.name,
        isQuickMeal: entry.isQuickMeal,
        servingLabel: entry.servingLabel,
        id: createId(),
        timestamp: entry.timestamp ?? new Date().toISOString(),
      };
      persistEntries([next, ...entries]);
    },
    [entries, persistEntries],
  );

  const deleteEntry = useCallback(
    (id: string) => {
      persistEntries(entries.filter((e) => e.id !== id));
    },
    [entries, persistEntries],
  );

  const updateMeal = useCallback(
    (id: string, patch: Partial<Omit<QuickMeal, 'id'>>) => {
      persistMeals(
        meals.map((meal) =>
          meal.id === id
            ? { ...meal, ...patch, ...roundMacros({ ...meal, ...patch }) }
            : meal,
        ),
      );
    },
    [meals, persistMeals],
  );

  const value = useMemo(
    () => ({
      meals,
      todayEntries,
      consumed,
      macroTargets,
      addEntry,
      deleteEntry,
      updateMeal,
    }),
    [meals, todayEntries, consumed, macroTargets, addEntry, deleteEntry, updateMeal],
  );

  return <FoodStoreContext.Provider value={value}>{children}</FoodStoreContext.Provider>;
}

export function useFoodStore() {
  const ctx = useContext(FoodStoreContext);
  if (!ctx) throw new Error('useFoodStore must be used within FoodStoreProvider');
  return ctx;
}
