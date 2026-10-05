/**
 * Clima en vivo e histórico (Open-Meteo: sin llave, gratuito para uso no comercial; revisar términos
 * si la app se comercializa). Todo se cachea en localStorage para uso offline.
 */
export interface Weather { temp: number; code: number; precip7d: number; fetchedAt: string }
const wKey = (lat: number, lon: number) => `ssc:w:${lat.toFixed(2)},${lon.toFixed(2)}`;
const hKey = (lat: number, lon: number) => `ssc:h:${lat.toFixed(2)},${lon.toFixed(2)}`;

const rd = <T,>(k: string): T | null => { try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : null; } catch { return null; } };
const wr = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

export const cachedWeather = (lat: number, lon: number) => rd<Weather>(wKey(lat, lon));

export async function fetchWeather(lat: number, lon: number): Promise<Weather> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=precipitation_sum&past_days=7&forecast_days=1&timezone=America%2FBogota`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('clima ' + r.status);
  const j = await r.json();
  const precip: number[] = j.daily?.precipitation_sum ?? [];
  const w: Weather = { temp: j.current.temperature_2m, code: j.current.weather_code, precip7d: Math.round(precip.slice(0, 7).reduce((a: number, b: number) => a + (b || 0), 0)), fetchedAt: new Date().toISOString() };
  wr(wKey(lat, lon), w);
  return w;
}

export function weatherLabel(code: number): { icon: string; text: string } {
  if (code === 0) return { icon: '☀️', text: 'Soleado' };
  if (code <= 3) return { icon: '⛅', text: 'Parcialmente nublado' };
  if (code <= 48) return { icon: '🌫️', text: 'Niebla' };
  if (code <= 57) return { icon: '🌦️', text: 'Llovizna' };
  if (code <= 67) return { icon: '🌧️', text: 'Lluvia' };
  if (code <= 77) return { icon: '❄️', text: 'Frío extremo' };
  if (code <= 82) return { icon: '🌧️', text: 'Aguaceros' };
  return { icon: '⛈️', text: 'Tormenta' };
}

/** Histórico 5 años: precipitación media mensual, normalizada 0–1 (índice) y en mm. */
export interface Historical { mm: number[]; index: number[]; years: number; fetchedAt: string }
export const cachedHistorical = (lat: number, lon: number) => rd<Historical>(hKey(lat, lon));

export async function fetchHistorical(lat: number, lon: number): Promise<Historical> {
  const end = new Date(); end.setDate(1); end.setDate(0); // último día del mes pasado
  const start = new Date(end); start.setFullYear(start.getFullYear() - 5); start.setDate(start.getDate() + 1);
  const f = (d: Date) => d.toISOString().slice(0, 10);
  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${f(start)}&end_date=${f(end)}&daily=precipitation_sum&timezone=America%2FBogota`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('histórico ' + r.status);
  const j = await r.json();
  const days: string[] = j.daily.time;
  const vals: number[] = j.daily.precipitation_sum;
  const sum = new Array(12).fill(0);
  const years = new Set<string>();
  days.forEach((d, i) => { sum[Number(d.slice(5, 7)) - 1] += vals[i] || 0; years.add(d.slice(0, 4)); });
  const yrs = Math.max(1, years.size - 1 + 1);
  const mm = sum.map((v) => Math.round(v / yrs));
  const max = Math.max(...mm, 1);
  const h: Historical = { mm, index: mm.map((v) => Math.round((v / max) * 100) / 100), years: yrs, fetchedAt: new Date().toISOString() };
  wr(hKey(lat, lon), h);
  return h;
}

export async function fetchElevation(lat: number, lon: number): Promise<number | null> {
  try {
    const r = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`);
    if (!r.ok) return null;
    const j = await r.json();
    return Math.round(j.elevation?.[0] ?? NaN) || null;
  } catch { return null; }
}
