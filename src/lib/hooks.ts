import { useCallback, useEffect, useState } from 'react';
import type { Finca } from './types';
import { cachedHistorical, cachedWeather, fetchHistorical, fetchWeather, type Historical, type Weather } from './climate';
import { useOnline } from './online';

export function useWeather(f: Finca) {
  const online = useOnline();
  const [w, setW] = useState<Weather | null>(() => cachedWeather(f.lat, f.lon));
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { setW(await fetchWeather(f.lat, f.lon)); } catch { /* se queda con el último dato en caché */ }
    setLoading(false);
  }, [f.lat, f.lon]);
  useEffect(() => { setW(cachedWeather(f.lat, f.lon)); if (online) void refresh(); }, [f.lat, f.lon, online, refresh]);
  return { w, loading, refresh };
}

export function useHistorical(f: Finca) {
  const online = useOnline();
  const [h, setH] = useState<Historical | null>(() => cachedHistorical(f.lat, f.lon));
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    setLoading(true);
    try { setH(await fetchHistorical(f.lat, f.lon)); } catch { /* sin conexión: usa referencia */ }
    setLoading(false);
  }, [f.lat, f.lon]);
  useEffect(() => { setH(cachedHistorical(f.lat, f.lon)); }, [f.lat, f.lon]);
  return { h, loading, refresh, online };
}
