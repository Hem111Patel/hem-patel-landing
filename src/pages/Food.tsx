import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { FoodLog } from '@/components/food/FoodLog';
import { FoodSearch } from '@/components/food/FoodSearch';
import { QuickMeals } from '@/components/food/QuickMeals';
import { MacroBreakdown } from '@/components/today/MacroBreakdown';
import { useFoodStore } from '@/lib/food-store';
import type { FoodSearchResult } from '@/lib/api/open-food-facts';
import type { QuickMeal } from '@/types';

export function FoodPage() {
  const { meals, todayEntries, consumed, macroTargets, addEntry, deleteEntry, updateMeal } =
    useFoodStore();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  function flash(message: string) {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  }

  function logMeal(meal: QuickMeal) {
    addEntry({
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      isQuickMeal: true,
    });
    flash(`Logged ${meal.name}`);
  }

  function logSearch(food: FoodSearchResult, grams: number) {
    const factor = grams / 100;
    addEntry({
      name: food.name,
      calories: food.caloriesPer100g * factor,
      protein: food.proteinPer100g * factor,
      carbs: food.carbsPer100g * factor,
      fat: food.fatPer100g * factor,
      servingLabel: `${grams}g`,
    });
    flash(`Logged ${food.name}`);
  }

  const remaining = Math.max(macroTargets.calories - consumed.calories, 0);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Food</h1>
        <div className="date">{format(new Date(), 'EEEE, MMM d')}</div>
      </header>

      <section className="section">
        <div className="card food-totals">
          <div className="food-totals-row">
            <div>
              <div className="stat-value">{consumed.calories}</div>
              <div className="stat-label">eaten</div>
            </div>
            <div>
              <div className="stat-value">{remaining}</div>
              <div className="stat-label">remaining</div>
            </div>
            <div>
              <div className="stat-value">{macroTargets.calories}</div>
              <div className="stat-label">target</div>
            </div>
          </div>
          <MacroBreakdown consumed={consumed} targets={macroTargets} />
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-title">Quick meals</div>
          <p className="section-hint">Tap to log. Edit to customize name, calories, and macros.</p>
          <QuickMeals meals={meals} onLog={logMeal} onUpdate={updateMeal} />
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-title">Search foods</div>
          <FoodSearch onLog={logSearch} />
        </div>
      </section>

      <section className="section">
        <div className="card">
          <div className="card-title">Today’s log</div>
          <FoodLog entries={todayEntries} onDelete={deleteEntry} />
        </div>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
