import { useState } from 'react';
import type { QuickMeal } from '@/types';
import { MealEditor } from './MealEditor';

interface QuickMealsProps {
  meals: QuickMeal[];
  onLog: (meal: QuickMeal) => void;
  onUpdate: (id: string, patch: Partial<Omit<QuickMeal, 'id'>>) => void;
}

export function QuickMeals({ meals, onLog, onUpdate }: QuickMealsProps) {
  const [editing, setEditing] = useState<QuickMeal | null>(null);

  return (
    <>
      <div className="quick-meal-grid">
        {meals.map((meal) => (
          <div key={meal.id} className="quick-meal">
            <button
              type="button"
              className="quick-meal-main"
              onClick={() => onLog(meal)}
              aria-label={`Log ${meal.name}, ${meal.calories} calories`}
            >
              <span className="quick-meal-emoji">{meal.emoji}</span>
              <span className="quick-meal-name">{meal.name}</span>
              <span className="quick-meal-cals">{meal.calories} cal</span>
              <span className="quick-meal-macros">
                P {meal.protein} · C {meal.carbs} · F {meal.fat}
              </span>
            </button>
            <button
              type="button"
              className="quick-meal-edit"
              onClick={() => setEditing(meal)}
              aria-label={`Edit ${meal.name}`}
            >
              Edit
            </button>
          </div>
        ))}
      </div>
      {editing && (
        <MealEditor
          meal={editing}
          onSave={(patch) => onUpdate(editing.id, patch)}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}
