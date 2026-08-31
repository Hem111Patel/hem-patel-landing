import type { OuraReadiness, OuraSleep } from '@/types';

const OURA_BASE = 'https://api.ouraring.com/v2/usercollection';

function getToken(): string | null {
  return import.meta.env.VITE_OURA_ACCESS_TOKEN ?? null;
}

async function ouraFetch<T>(endpoint: string): Promise<T | null> {
  const token = getToken();
  if (!token) return null;

  const res = await fetch(`${OURA_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Oura API error: ${res.status}`);
  return res.json();
}

export async function fetchReadiness(date: string): Promise<OuraReadiness | null> {
  const data = await ouraFetch<{ data: OuraReadiness[] }>(
    `/daily_readiness?start_date=${date}&end_date=${date}`,
  );
  return data?.data?.[0] ?? null;
}

export async function fetchSleep(date: string): Promise<OuraSleep | null> {
  const data = await ouraFetch<{ data: OuraSleep[] }>(
    `/daily_sleep?start_date=${date}&end_date=${date}`,
  );
  return data?.data?.[0] ?? null;
}

export function isOuraConfigured(): boolean {
  return !!getToken();
}
