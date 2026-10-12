import { useState } from 'react';
import type { QuickMeal } from '@/types';

interface MealEditorProps {
  meal: QuickMeal;
  onSave: (patch: Partial<Omit<QuickMeal, 'id'>>) => void;
  onClose: () => void;
}

export function MealEditor({ meal, onSave, onClose }: MealEditorProps) {
  const [name, setName] = useState(meal.name);
  const [calories, setCalories] = useState(String(meal.calories));
  const [protein, setProtein] = useState(String(meal.protein));
  const [carbs, setCarbs] = useState(String(meal.carbs));
  const [fat, setFat] = useState(String(meal.fat));

  function handleSave() {
    const nextName = name.trim();
    if (!nextName) return;
    onSave({
      name: nextName,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-sheet"
        role="dialog"
        aria-labelledby="meal-editor-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="meal-editor-title">Edit meal</h2>
        <p className="modal-sub">{meal.emoji} Customize this quick-tap button</p>

        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </label>

        <div className="field-grid">
          <label className="field">
            <span>Calories</span>
            <input inputMode="numeric" value={calories} onChange={(e) => setCalories(e.target.value)} />
          </label>
          <label className="field">
            <span>Protein (g)</span>
            <input inputMode="numeric" value={protein} onChange={(e) => setProtein(e.target.value)} />
          </label>
          <label className="field">
            <span>Carbs (g)</span>
            <input inputMode="numeric" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
          </label>
          <label className="field">
            <span>Fat (g)</span>
            <input inputMode="numeric" value={fat} onChange={(e) => setFat(e.target.value)} />
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
