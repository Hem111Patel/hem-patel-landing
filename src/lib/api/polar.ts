import type { Workout } from '@/types';

const POLAR_BASE = 'https://www.polaraccesslink.com/v3';

function getToken(): string | null {
  return import.meta.env.VITE_POLAR_ACCESS_TOKEN ?? null;
}

export async function fetchWorkouts(startDate: string, endDate: string): Promise<Workout[]> {
  const token = getToken();
  if (!token) return [];

  const res = await fetch(
    `${POLAR_BASE}/exercises?from=${startDate}&to=${endDate}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`Polar API error: ${res.status}`);

  const data = await res.json();
  return (data.exercises ?? []).map((ex: {
    id: unknown;
    start_time?: string;
    sport?: string;
    duration?: number;
    calories?: number;
    heart_rate?: { average?: number; maximum?: number };
  }) => ({
    id: String(ex.id),
    date: String(ex.start_time ?? '').split('T')[0],
    type: String(ex.sport ?? 'Workout'),
    durationMin: Math.round(Number(ex.duration) / 60),
    caloriesBurned: Number(ex.calories) || 0,
    avgHeartRate: ex.heart_rate?.average,
    maxHeartRate: ex.heart_rate?.maximum,
    source: 'polar' as const,
  }));
}

export function isPolarConfigured(): boolean {
  return !!getToken();
}
