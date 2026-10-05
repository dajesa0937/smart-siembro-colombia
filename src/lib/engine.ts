import type { Crop, Finca, Fertility, Livestock, Pasture, Range, Regime, Texture } from './types';
import { CROPS } from '../data/crops';
import { PASTURES } from '../data/pastures';

export const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const MONTHS_LONG = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Índice relativo de lluvia mensual (0–1) por régimen. Aproximación; se refina con histórico cuando hay internet. */
export const RAIN_PROFILE: Record<Regime, number[]> = {
  bimodal: [0.3, 0.35, 0.65, 0.9, 0.9, 0.55, 0.4, 0.45, 0.75, 1.0, 0.95, 0.5],
  caribe: [0.05, 0.05, 0.1, 0.35, 0.8, 0.7, 0.6, 0.7, 0.85, 1.0, 0.8, 0.25],
  llanos: [0.05, 0.1, 0.25, 0.65, 1.0, 1.0, 0.95, 0.85, 0.7, 0.65, 0.4, 0.1],
  pacifico: [0.8, 0.75, 0.8, 0.9, 0.95, 0.9, 0.9, 0.95, 1.0, 1.0, 0.95, 0.85],
  amazonia: [0.8, 0.85, 1.0, 1.0, 0.95, 0.85, 0.7, 0.6, 0.7, 0.8, 0.9, 0.85]
};

export const REGIME_LABEL: Record<Regime, string> = {
  bimodal: 'Andina — dos épocas de lluvia (mar–may y sep–nov)',
  caribe: 'Caribe — una época de lluvia (may–nov)',
  llanos: 'Orinoquía — una época de lluvia (abr–nov)',
  pacifico: 'Pacífico — lluvias casi todo el año',
  amazonia: 'Amazonía — lluvias casi todo el año'
};

/** Temperatura media aproximada por altitud (gradiente ~0,6 °C/100 m). */
export const tempFromAlt = (alt: number) => Math.round((27.5 - 0.0059 * alt) * 10) / 10;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/** 1 dentro del rango óptimo, baja linealmente hasta 0 en el límite absoluto. */
export function rangeScore(v: number, opt: Range, abs: Range): number {
  if (v >= opt[0] && v <= opt[1]) return 1;
  if (v < opt[0]) return abs[0] >= opt[0] ? 0 : clamp((v - abs[0]) / (opt[0] - abs[0]));
  return abs[1] <= opt[1] ? 0 : clamp((abs[1] - v) / (abs[1] - opt[1]));
}

export type Verdict = 'muy-recomendado' | 'recomendado' | 'condicionado' | 'no-recomendado';

export interface CropEval {
  crop: Crop;
  score: number; // 0-100
  verdict: Verdict;
  reasons: string[]; // por qué NO / con qué condición
  positives: string[];
  expectedYield: number;
  revenue: number;
  cost: number;
  net: number;
  margin: number; // net / cost (año productivo)
  netAmortized: number; // utilidad anual descontando establecimiento y años sin producción (horizonte 10 años)
  marginAmortized: number;
  needsIrrigation: boolean;
}

export interface Overrides {
  texture?: Texture;
}

export const totalCost = (c: Crop) => Object.values(c.costs).reduce((a, b) => a + b, 0);
const fertFactor: Record<Fertility, number> = { baja: 0.8, media: 0.92, alta: 1 };

export function evaluateCrop(crop: Crop, f: Finca, ov: Overrides = {}): CropEval {
  const reasons: string[] = [];
  const positives: string[] = [];
  let blocked = false;
  const texture = ov.texture ?? f.texture;

  const sAlt = rangeScore(f.alt, crop.altOpt, crop.altAbs);
  if (f.alt < crop.altAbs[0] || f.alt > crop.altAbs[1]) {
    blocked = true;
    reasons.push(`Altitud (${f.alt} m) fuera del rango viable (${crop.altAbs[0]}–${crop.altAbs[1]} m): clima inadecuado.`);
  } else if (sAlt < 1) reasons.push(`Altitud en el límite del rango óptimo (${crop.altOpt[0]}–${crop.altOpt[1]} m): menor rendimiento esperado.`);
  else positives.push('Altitud ideal para el cultivo');

  let sRain = rangeScore(f.rain, crop.rainOpt, crop.rainAbs);
  let needsIrrigation = false;
  if (f.rain < crop.rainOpt[0]) {
    if (crop.irrigable && f.hasIrrigation) {
      sRain = Math.max(sRain, 0.85);
      positives.push('Déficit de lluvia compensado con su riego');
    } else if (crop.irrigable) {
      needsIrrigation = f.rain < crop.rainOpt[0] * 0.85;
      if (needsIrrigation) reasons.push(`Lluvia baja (${f.rain} mm/año; óptimo ${crop.rainOpt[0]}+): requiere riego.`);
    } else if (f.rain < crop.rainAbs[0]) {
      blocked = true;
      reasons.push(`Lluvia insuficiente (${f.rain} mm/año) y el cultivo no se maneja con riego.`);
    }
  } else if (f.rain > crop.rainOpt[1]) {
    if (f.rain > crop.rainAbs[1]) {
      blocked = true;
      reasons.push(`Exceso de lluvia (${f.rain} mm/año) para este cultivo.`);
    } else reasons.push('Lluvia por encima del óptimo: riesgo de enfermedades y encharcamiento.');
  } else positives.push('Lluvia adecuada');

  const sPh = rangeScore(f.ph, crop.phOpt, crop.phAbs);
  if (f.ph < crop.phAbs[0] || f.ph > crop.phAbs[1]) {
    blocked = true;
    reasons.push(`pH del suelo (${f.ph}) fuera del rango tolerado (${crop.phAbs[0]}–${crop.phAbs[1]}).`);
  } else if (f.ph < crop.phOpt[0]) reasons.push(`Suelo ácido para el cultivo (pH ${f.ph}): requiere encalado según análisis.`);
  else if (f.ph > crop.phOpt[1]) reasons.push(`Suelo alcalino para el cultivo (pH ${f.ph}): limita disponibilidad de nutrientes.`);
  else positives.push('pH adecuado');

  let sDrain = 1;
  if (!crop.drainage.includes(f.drainage)) {
    sDrain = 0.2;
    if (f.drainage === 'pobre') {
      blocked = true;
      reasons.push('Drenaje pobre: el cultivo se pudre con encharcamiento.');
    } else reasons.push('El drenaje del lote no es el ideal para este cultivo.');
  }

  let sTex = 1;
  if (!crop.textures.includes(texture)) {
    sTex = 0.5;
    reasons.push(`Textura ${texture} poco adecuada (mejor: ${crop.textures.join(' o ')}).`);
  } else positives.push(`Textura ${texture} adecuada`);

  let sSlope = 1;
  if (f.slope > crop.slopeMax) {
    sSlope = 0.3;
    reasons.push(`Pendiente alta (${f.slope}%): máximo recomendado ${crop.slopeMax}% (riesgo de erosión).`);
    if (f.slope > crop.slopeMax * 1.5) blocked = true;
  }

  if (f.alt > 3000) {
    blocked = true;
    reasons.push('Posible zona de páramo (>3.000 m): actividades agropecuarias restringidas por la Ley 1930 de 2018. Consulte a su corporación autónoma regional.');
  }

  const score = Math.round(100 * (sAlt * 0.3 + sRain * 0.2 + sPh * 0.15 + sDrain * 0.15 + sTex * 0.1 + sSlope * 0.1));
  let verdict: Verdict = 'no-recomendado';
  if (!blocked) verdict = score >= 82 ? 'muy-recomendado' : score >= 65 ? 'recomendado' : score >= 45 ? 'condicionado' : 'no-recomendado';
  if (!blocked && score < 45) reasons.unshift('Varias condiciones del lote no favorecen el cultivo.');

  const q = clamp((score - 40) / 60);
  const expectedYield = (crop.yieldT[0] + (crop.yieldT[1] - crop.yieldT[0]) * q) * fertFactor[f.fertility];
  const cost = totalCost(crop);
  const revenue = expectedYield * crop.priceCop;
  const net = revenue - cost;
  const margin = net / cost;
  const overhead = (crop.establishment + crop.yearsToProd * cost * 0.5) / 10;
  const netAmortized = net - overhead;
  const marginAmortized = netAmortized / (cost + crop.establishment / 10);
  if (!blocked && marginAmortized < 0.1) {
    reasons.push('Baja rentabilidad esperada con los precios de referencia (margen < 10% incluyendo la inversión inicial).');
    if (verdict === 'muy-recomendado' || verdict === 'recomendado') verdict = 'condicionado';
  }
  return { crop, score, verdict, reasons, positives, expectedYield, revenue, cost, net, margin, netAmortized, marginAmortized, needsIrrigation };
}

export function rankCrops(f: Finca, ov: Overrides = {}, group?: Crop['group'][]) {
  const all = CROPS.filter((c) => !group || group.includes(c.group)).map((c) => evaluateCrop(c, f, ov));
  const viable = all.filter((e) => e.verdict !== 'no-recomendado').sort((a, b) => b.marginAmortized * (0.5 + b.score / 200) - a.marginAmortized * (0.5 + a.score / 200));
  const notRecommended = all.filter((e) => e.verdict === 'no-recomendado').sort((a, b) => b.score - a.score);
  return { viable, notRecommended };
}

// ---------- Calendario de siembra ----------
export type MonthStatus = 'ideal' | 'posible' | 'no';

export function rainIndex(f: Finca, historical?: number[] | null): number[] {
  return historical && historical.length === 12 ? historical : RAIN_PROFILE[f.regime];
}

export function sowingCalendar(crop: Crop, f: Finca, historical?: number[] | null): MonthStatus[] {
  const idx = rainIndex(f, historical);
  return MONTHS.map((_, m) => {
    const avg = (idx[m] + idx[(m + 1) % 12]) / 2;
    let st: MonthStatus = avg >= 0.7 ? 'ideal' : avg >= 0.45 ? 'posible' : 'no';
    if (f.hasIrrigation && crop.irrigable && st === 'no') st = 'posible';
    if (crop.frostSensitive && f.alt >= 2600 && [11, 0, 1].includes(m)) st = 'no';
    return st;
  });
}

export function sowingWindows(cal: MonthStatus[]): string[] {
  const out: string[] = [];
  const idealIdx = cal.map((s, i) => (s === 'ideal' ? i : -1)).filter((i) => i >= 0);
  if (!idealIdx.length) return out;
  // agrupar meses ideales contiguos (circular)
  const groups: number[][] = [];
  for (const i of idealIdx) {
    const last = groups[groups.length - 1];
    if (last && last[last.length - 1] === i - 1) last.push(i);
    else groups.push([i]);
  }
  if (groups.length > 1 && groups[0][0] === 0 && groups[groups.length - 1].slice(-1)[0] === 11) {
    groups[0] = groups.pop()!.concat(groups[0]);
  }
  for (const g of groups) out.push(g.length === 1 ? MONTHS_LONG[g[0]] : `${MONTHS_LONG[g[0]]} a ${MONTHS_LONG[g[g.length - 1]]}`);
  return out;
}

// ---------- Agua y riego ----------
export interface WaterPlan {
  needMm: number;
  rainEffMm: number;
  deficitMm: number;
  deficitM3Ha: number;
  deficitLHa: number;
  frequencyDays: Range;
  systems: { name: string; eff: number; grossM3Ha: number; savingVsGravity: number }[];
}

export function waterPlan(crop: Crop, f: Finca, startMonth: number): WaterPlan {
  const idx = RAIN_PROFILE[f.regime];
  const months = Math.max(1, Math.round(((crop.cycleDays[0] + crop.cycleDays[1]) / 2) / 30.4));
  const total = idx.reduce((a, b) => a + b, 0);
  let share = 0;
  for (let i = 0; i < Math.min(months, 12); i++) share += idx[(startMonth + i) % 12];
  const rainCycle = (f.rain * share) / total;
  const rainEff = rainCycle * 0.75;
  const deficit = Math.max(0, crop.waterMm - rainEff);
  const freq: Record<Texture, Range> = { arenoso: [3, 5], franco: [6, 8], arcilloso: [8, 12] };
  const mk = (name: string, eff: number) => ({ name, eff, grossM3Ha: (deficit * 10) / eff, savingVsGravity: 0 });
  const systems = [mk('Goteo', 0.9), mk('Aspersión', 0.75), mk('Gravedad / surcos', 0.55)];
  const grav = systems[2].grossM3Ha;
  systems.forEach((s) => (s.savingVsGravity = grav > 0 ? Math.round((1 - s.grossM3Ha / grav) * 100) : 0));
  return { needMm: crop.waterMm, rainEffMm: Math.round(rainEff), deficitMm: Math.round(deficit), deficitM3Ha: Math.round(deficit * 10), deficitLHa: Math.round(deficit * 10_000), frequencyDays: freq[f.texture], systems };
}

// ---------- Fertilización ----------
export interface FertPlan {
  N: number;
  P2O5: number;
  K2O: number;
  organicT: number;
  urea: number;
  dap: number;
  kcl: number;
  limeNote: string | null;
}

export function fertPlan(crop: Crop, f: Finca): FertPlan {
  const pos: Record<Fertility, number> = { baja: 1, media: 0.6, alta: 0.25 };
  const pick = (r: Range) => Math.round(r[0] + (r[1] - r[0]) * pos[f.fertility]);
  const N = pick(crop.fert.N);
  const P2O5 = pick(crop.fert.P2O5);
  const K2O = pick(crop.fert.K2O);
  const organicT = Math.round((crop.fert.organicT[0] + (crop.fert.organicT[1] - crop.fert.organicT[0]) * pos[f.fertility]) * 10) / 10;
  const dap = Math.round(P2O5 / 0.46);
  const nFromDap = dap * 0.18;
  return {
    N, P2O5, K2O, organicT,
    urea: Math.max(0, Math.round((N - nFromDap) / 0.46)),
    dap,
    kcl: Math.round(K2O / 0.6),
    limeNote: f.ph < crop.phOpt[0] ? `pH ${f.ph} por debajo del óptimo (${crop.phOpt[0]}–${crop.phOpt[1]}): aplique cal/enmienda según análisis de suelo (aluminio intercambiable) 2–3 meses antes de sembrar.` : null
  };
}

// ---------- Finanzas ----------
export interface CalcInput { cropId: string; areaHa: number; yieldTHa: number; priceCopT: number; costScale: number }
export interface CalcResult {
  production: number;
  revenue: number;
  cost: number;
  net: number;
  margin: number;
  breakdown: { label: string; value: number }[];
}
export function calculate(crop: Crop, i: CalcInput): CalcResult {
  const labels: Record<string, string> = { semillas: 'Semillas', fertilizantes: 'Fertilizantes y abonos', agua: 'Agua y riego', manoObra: 'Mano de obra', otros: 'Otros' };
  const breakdown = Object.entries(crop.costs).map(([k, v]) => ({ label: labels[k], value: Math.round(v * i.areaHa * i.costScale) }));
  const cost = breakdown.reduce((a, b) => a + b.value, 0);
  const production = i.areaHa * i.yieldTHa;
  const revenue = production * i.priceCopT;
  const net = revenue - cost;
  return { production, revenue, cost, net, margin: cost ? net / cost : 0, breakdown };
}

// ---------- Pastos y ganadería ----------
export interface PastureEval {
  pasture: Pasture;
  score: number;
  ok: boolean;
  reasons: string[];
  positives: string[];
  carryingUgHa: number;
  animals: number;
}

const fertRank: Record<Fertility, number> = { baja: 0, media: 1, alta: 2 };
const UG_DM_DAY = 11.25; // kg MS/día por unidad gran ganado (450 kg × 2,5%)

export function evaluatePasture(p: Pasture, f: Finca, livestock: Livestock, areaHa: number): PastureEval {
  const reasons: string[] = [];
  const positives: string[] = [];
  let ok = true;
  const sAlt = rangeScore(f.alt, p.altOpt, p.altAbs);
  if (f.alt < p.altAbs[0] || f.alt > p.altAbs[1]) {
    ok = false;
    reasons.push(`Altitud ${f.alt} m fuera de adaptación (${p.altAbs[0]}–${p.altAbs[1]} m).`);
  } else if (sAlt < 1) reasons.push('Altitud en el límite de adaptación.');
  else positives.push('Altitud ideal');
  if (f.rain < p.rainMin) {
    reasons.push(`Lluvia (${f.rain} mm) por debajo del mínimo (${p.rainMin} mm): requiere riego o banco de forraje en verano.`);
  } else positives.push('Lluvia suficiente');
  if (fertRank[f.fertility] < fertRank[p.fertility]) {
    reasons.push(`Exige fertilidad ${p.fertility}; su suelo es ${f.fertility}: necesita enmienda y fertilización.`);
  } else positives.push('Fertilidad suficiente');
  if (!p.drainageOk.includes(f.drainage)) {
    ok = f.drainage === 'pobre' ? false : ok;
    reasons.push(`Drenaje ${f.drainage} no es el ideal para este pasto.`);
  }
  if (f.ph < 5 && p.acidTolerance === 'baja') reasons.push(`Suelo ácido (pH ${f.ph}) y el pasto es poco tolerante: encale.`);
  if (!p.species.includes(livestock)) reasons.push('No es la mejor opción para este tipo de ganado.');
  else positives.push('Adecuado para su tipo de ganado');
  const score = Math.round(100 * (sAlt * 0.4 + (f.rain >= p.rainMin ? 0.2 : 0.08) + (fertRank[f.fertility] >= fertRank[p.fertility] ? 0.15 : 0.05) + (p.drainageOk.includes(f.drainage) ? 0.1 : 0.02) + (p.species.includes(livestock) ? 0.15 : 0.04)));
  const dm = (p.dmTHaYear[0] + p.dmTHaYear[1]) / 2;
  const q = fertRank[f.fertility] >= fertRank[p.fertility] ? 1 : 0.75;
  const carrying = Math.round(((dm * 1000 * 0.5 * q) / (UG_DM_DAY * 365)) * 10) / 10;
  return { pasture: p, score, ok, reasons, positives, carryingUgHa: carrying, animals: Math.floor(carrying * areaHa) };
}

export function rankPastures(f: Finca, livestock: Livestock, areaHa: number) {
  const all = PASTURES.map((p) => evaluatePasture(p, f, livestock, areaHa));
  return {
    viable: all.filter((e) => e.ok).sort((a, b) => b.score - a.score),
    rejected: all.filter((e) => !e.ok)
  };
}

export const LIVESTOCK_LABEL: Record<Livestock, string> = {
  leche: 'Bovino de leche', carne: 'Bovino de carne', doble: 'Doble propósito', ovino: 'Ovinos', caprino: 'Caprinos'
};

// ---------- Alertas ----------
export interface Alert { level: 'rojo' | 'amarillo' | 'verde'; title: string; text: string }

export function fincaAlerts(f: Finca, now = new Date()): Alert[] {
  const out: Alert[] = [];
  const m = now.getMonth();
  const idx = RAIN_PROFILE[f.regime];
  if (f.alt > 3000) out.push({ level: 'rojo', title: 'Posible zona de páramo', text: 'Por encima de 3.000 m las actividades agropecuarias pueden estar restringidas (Ley 1930 de 2018). Verifique con su corporación autónoma regional.' });
  if (f.alt >= 2600 && [11, 0, 1].includes(m)) out.push({ level: 'amarillo', title: 'Riesgo de heladas', text: 'Diciembre a febrero: noches despejadas y frías. Proteja cultivos sensibles y evite siembras nuevas.' });
  if (idx[m] < 0.35 && idx[(m + 1) % 12] < 0.45) out.push({ level: 'amarillo', title: 'Época seca', text: 'Planee el riego y reserve forraje (ensilaje, heno o banco de proteína).' });
  if (idx[m] >= 0.9) out.push({ level: 'amarillo', title: 'Lluvias intensas', text: 'Evite fertilizar y aplicar agroquímicos con lluvia inminente; revise drenajes y evite el pisoteo en potreros saturados.' });
  if (f.slope > 40) out.push({ level: 'amarillo', title: 'Pendiente muy alta', text: 'Priorice cultivos permanentes, coberturas y siembra en curvas de nivel para evitar erosión.' });
  if (f.drainage === 'pobre') out.push({ level: 'amarillo', title: 'Drenaje pobre', text: 'Evite aguacate, yuca, fríjol y maíz. Considere arroz, pasto humidícola o drenar el lote.' });
  if (!out.length) out.push({ level: 'verde', title: 'Sin alertas climáticas', text: 'Condiciones normales para este mes. Revise el calendario de siembra.' });
  return out;
}

export const defaultFinca = (): Finca => ({
  name: 'Mi finca', placeId: null, lat: 6.2518, lon: -75.5636, alt: 1500, rain: 1650, regime: 'bimodal', areaHa: 2.5,
  texture: 'franco', drainage: 'bueno', ph: 5.8, fertility: 'media', slope: 15, hasIrrigation: false, livestock: 'leche', heads: 10
});
