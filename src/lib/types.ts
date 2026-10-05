export type Regime = 'bimodal' | 'caribe' | 'llanos' | 'pacifico' | 'amazonia';
export type Texture = 'arenoso' | 'franco' | 'arcilloso';
export type Drainage = 'bueno' | 'moderado' | 'pobre';
export type Fertility = 'baja' | 'media' | 'alta';
export type Livestock = 'leche' | 'carne' | 'doble' | 'ovino' | 'caprino';
export type Range = [number, number];

export interface Place {
  id: string;
  name: string;
  dept: string;
  lat: number;
  lon: number;
  alt: number; // msnm
  rain: number; // mm/año (climatología aproximada)
  regime: Regime;
}

export interface Finca {
  name: string;
  placeId: string | null;
  lat: number;
  lon: number;
  alt: number;
  rain: number;
  regime: Regime;
  areaHa: number;
  texture: Texture;
  drainage: Drainage;
  ph: number;
  fertility: Fertility;
  slope: number; // %
  hasIrrigation: boolean;
  livestock: Livestock;
  heads: number;
}

export interface Variety {
  name: string;
  traits: string[];
  cycle: string;
  tag: string;
}

export interface Crop {
  id: string;
  name: string;
  sci: string;
  icon: string;
  group: 'anual' | 'perenne' | 'forraje';
  altOpt: Range;
  altAbs: Range;
  rainOpt: Range;
  rainAbs: Range;
  phOpt: Range;
  phAbs: Range;
  textures: Texture[];
  drainage: Drainage[];
  slopeMax: number;
  frostSensitive: boolean;
  irrigable: boolean; // el déficit de lluvia se corrige con riego
  cycleDays: Range;
  yearsToProd: number;
  yieldT: Range; // t/ha por ciclo (anuales) o por año (perennes)
  yieldUnit: string;
  priceCop: number; // COP por tonelada, referencia editable
  priceVolatility: 'baja' | 'media' | 'alta';
  costs: { semillas: number; fertilizantes: number; agua: number; manoObra: number; otros: number }; // COP/ha/ciclo-año
  establishment: number; // COP/ha inversión inicial (perennes)
  waterMm: number; // demanda hídrica por ciclo/año (ETc aprox.)
  density: string;
  seedType: string;
  varieties: Variety[];
  fert: { N: Range; P2O5: Range; K2O: Range; organicT: Range; note: string };
  steps: string[];
  pests: string[];
  noChem: string[];
  tip: string;
}

export interface Pasture {
  id: string;
  name: string;
  sci: string;
  icon: string;
  kind: 'gramínea' | 'forraje conservado';
  altOpt: Range;
  altAbs: Range;
  rainMin: number;
  fertility: Fertility; // exigencia mínima
  acidTolerance: 'baja' | 'media' | 'alta';
  waterlogTolerance: 'baja' | 'media' | 'alta';
  frost: boolean; // tolera frío
  drainageOk: Drainage[];
  proteinPct: Range;
  dmTHaYear: Range; // t MS/ha/año
  restDays: Range; // descanso entre pastoreos
  grazeHeightCm: string;
  seedKgHa: string;
  pvc?: number; // puntos de valor cultural
  species: Livestock[];
  traits: string[];
  management: string[];
  source: string;
}

export interface Pest {
  id: string;
  name: string;
  sci: string;
  type: 'insecto' | 'hongo' | 'bacteria' | 'maleza' | 'ácaro' | 'deficiencia';
  crops: string;
  symptoms: string;
  cultural: string[];
  biological: string[];
  chemicalNote: string;
  threshold: string;
  icon: string;
}
