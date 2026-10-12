const BASE_URL = 'https://world.openfoodfacts.org';

export interface OFFProduct {
  code: string;
  product_name: string;
  nutriments: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
  serving_size?: string;
}

export interface FoodSearchResult {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export async function searchFoods(
  query: string,
  signal?: AbortSignal,
): Promise<FoodSearchResult[]> {
  const res = await fetch(
    `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`,
    { signal },
  );
  if (!res.ok) throw new Error('Failed to search foods');
  const data = await res.json();

  return (data.products ?? [])
    .filter((p: OFFProduct) => p.product_name && p.nutriments?.['energy-kcal_100g'])
    .map((p: OFFProduct) => ({
      id: p.code,
      name: p.product_name,
      caloriesPer100g: p.nutriments['energy-kcal_100g'] ?? 0,
      proteinPer100g: p.nutriments.proteins_100g ?? 0,
      carbsPer100g: p.nutriments.carbohydrates_100g ?? 0,
      fatPer100g: p.nutriments.fat_100g ?? 0,
    }));
}

export async function getProduct(barcode: string): Promise<FoodSearchResult | null> {
  const res = await fetch(`${BASE_URL}/api/v2/product/${barcode}.json`);
  if (!res.ok) return null;
  const data = await res.json();
  const p = data.product as OFFProduct | undefined;
  if (!p?.product_name) return null;

  return {
    id: p.code,
    name: p.product_name,
    caloriesPer100g: p.nutriments?.['energy-kcal_100g'] ?? 0,
    proteinPer100g: p.nutriments?.proteins_100g ?? 0,
    carbsPer100g: p.nutriments?.carbohydrates_100g ?? 0,
    fatPer100g: p.nutriments?.fat_100g ?? 0,
  };
}
