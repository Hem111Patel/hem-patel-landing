import { format } from 'date-fns';
import type { FoodEntry } from '@/types';

interface FoodLogProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

export function FoodLog({ entries, onDelete }: FoodLogProps) {
  if (entries.length === 0) {
    return (
      <p className="empty-log">Nothing logged yet. Tap a meal or search to add food.</p>
    );
  }

  return (
    <ul className="food-log">
      {entries.map((entry) => (
        <li key={entry.id} className="food-log-item">
          <div className="food-log-main">
            <div className="food-log-name">{entry.name}</div>
            <div className="food-log-meta">
              {format(new Date(entry.timestamp), 'h:mm a')}
              {entry.servingLabel ? ` · ${entry.servingLabel}` : ''}
              {entry.isQuickMeal ? ' · Quick meal' : ''}
            </div>
            <div className="food-log-macros">
              {entry.calories} cal · P {entry.protein} · C {entry.carbs} · F {entry.fat}
            </div>
          </div>
          <button
            type="button"
            className="food-log-delete"
            onClick={() => onDelete(entry.id)}
            aria-label={`Delete ${entry.name}`}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
