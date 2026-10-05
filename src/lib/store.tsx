import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Finca } from './types';
import { defaultFinca, type CalcInput, type CalcResult } from './engine';

const KEY = 'ssc:v1';

export interface HistoryItem { id: string; date: string; cropId: string; input: CalcInput; result: CalcResult }
interface Persisted { finca: Finca; configured: boolean; history: HistoryItem[]; lastSync: string | null; priceOverrides: Record<string, number> }

const initial = (): Persisted => ({ finca: defaultFinca(), configured: false, history: [], lastSync: null, priceOverrides: {} });

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial(), ...JSON.parse(raw) };
  } catch { /* almacenamiento no disponible */ }
  return initial();
}

interface Ctx extends Persisted {
  setFinca: (f: Partial<Finca>) => void;
  finishSetup: () => void;
  addHistory: (h: Omit<HistoryItem, 'id' | 'date'>) => void;
  clearHistory: () => void;
  markSynced: () => void;
  reset: () => void;
}
const C = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Persisted>(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* sin almacenamiento */ }
  }, [s]);
  const setFinca = useCallback((f: Partial<Finca>) => setS((p) => ({ ...p, finca: { ...p.finca, ...f } })), []);
  const value = useMemo<Ctx>(() => ({
    ...s,
    setFinca,
    finishSetup: () => setS((p) => ({ ...p, configured: true })),
    addHistory: (h) => setS((p) => ({ ...p, history: [{ ...h, id: String(Date.now()), date: new Date().toISOString() }, ...p.history].slice(0, 30) })),
    clearHistory: () => setS((p) => ({ ...p, history: [] })),
    markSynced: () => setS((p) => ({ ...p, lastSync: new Date().toISOString() })),
    reset: () => setS(initial())
  }), [s, setFinca]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useStore() {
  const v = useContext(C);
  if (!v) throw new Error('StoreProvider ausente');
  return v;
}
