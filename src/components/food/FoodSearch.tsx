import { useEffect, useRef, useState, type FormEvent } from 'react';
import { searchFoods, type FoodSearchResult } from '@/lib/api/open-food-facts';

interface FoodSearchProps {
  onLog: (result: FoodSearchResult, grams: number) => void;
}

export function FoodSearch({ onLog }: FoodSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<FoodSearchResult | null>(null);
  const [grams, setGrams] = useState('100');
  const controllerRef = useRef<AbortController | null>(null);

  // Cancel any in-flight request when the component unmounts.
  useEffect(() => () => controllerRef.current?.abort(), []);

  // Open Food Facts rate-limits search and asks clients not to search-as-you-type,
  // so we only query on submit.
  async function runSearch(event: FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const foods = await searchFoods(trimmed, controller.signal);
      if (controller.signal.aborted) return;
      setResults(foods);
      setSearched(trimmed);
    } catch (err) {
      if (controller.signal.aborted || (err instanceof DOMException && err.name === 'AbortError')) {
        return;
      }
      setError('Could not search foods. Check your connection and try again.');
      setResults([]);
      setSearched(null);
    } finally {
      if (controllerRef.current === controller) setLoading(false);
    }
  }

  function clearSearch() {
    controllerRef.current?.abort();
    setQuery('');
    setResults([]);
    setSearched(null);
    setError(null);
    setLoading(false);
  }

  function confirmLog() {
    if (!picked) return;
    const amount = Math.max(Number(grams) || 0, 1);
    onLog(picked, amount);
    setPicked(null);
    setGrams('100');
    clearSearch();
  }

  const preview = picked
    ? {
        calories: Math.round((picked.caloriesPer100g * Number(grams || 0)) / 100),
        protein: Math.round((picked.proteinPer100g * Number(grams || 0)) / 100),
        carbs: Math.round((picked.carbsPer100g * Number(grams || 0)) / 100),
        fat: Math.round((picked.fatPer100g * Number(grams || 0)) / 100),
      }
    : null;

  return (
    <div>
      <form className="search-form" onSubmit={runSearch}>
        <label className="search-field">
          <span className="sr-only">Search foods</span>
          <input
            type="search"
            placeholder="Search Open Food Facts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="search"
          />
        </label>
        <button
          type="submit"
          className="btn-primary search-submit"
          disabled={loading || query.trim().length < 2}
        >
          {loading ? '…' : 'Search'}
        </button>
      </form>

      {loading && <p className="search-status">Searching…</p>}
      {error && <p className="search-status error">{error}</p>}
      {!loading && !error && searched !== null && results.length === 0 && (
        <p className="search-status">No foods found for “{searched}”.</p>
      )}
      {(results.length > 0 || searched !== null) && !loading && (
        <button type="button" className="search-clear" onClick={clearSearch}>
          Clear results
        </button>
      )}

      <ul className="search-results">
        {results.map((food) => (
          <li key={food.id}>
            <button type="button" className="search-result" onClick={() => setPicked(food)}>
              <span className="search-result-name">{food.name}</span>
              <span className="search-result-macros">
                {Math.round(food.caloriesPer100g)} cal · P {Math.round(food.proteinPer100g)} · C{' '}
                {Math.round(food.carbsPer100g)} · F {Math.round(food.fatPer100g)} / 100g
              </span>
            </button>
          </li>
        ))}
      </ul>

      {picked && preview && (
        <div className="modal-overlay" onClick={() => setPicked(null)} role="presentation">
          <div
            className="modal-sheet"
            role="dialog"
            aria-labelledby="serving-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="serving-title">{picked.name}</h2>
            <p className="modal-sub">Nutrition is per 100g. Set your serving size.</p>
            <label className="field">
              <span>Serving (grams)</span>
              <input
                inputMode="numeric"
                value={grams}
                onChange={(e) => setGrams(e.target.value)}
                autoFocus
              />
            </label>
            <p className="serving-preview">
              {preview.calories} cal · P {preview.protein}g · C {preview.carbs}g · F {preview.fat}g
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-ghost" onClick={() => setPicked(null)}>
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={confirmLog}>
                Log food
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
