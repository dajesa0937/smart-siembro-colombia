import type { Place } from '../lib/types';

// Climatología APROXIMADA por municipio (altitud de cabecera, precipitación media anual).
// PENDIENTE: reemplazar por series oficiales IDEAM (ver docs/FUENTES.md).
const p = (id: string, name: string, dept: string, lat: number, lon: number, alt: number, rain: number, regime: Place['regime']): Place =>
  ({ id, name, dept, lat, lon, alt, rain, regime });

export const PLACES: Place[] = [
  // Antioquia
  p('medellin', 'Medellín', 'Antioquia', 6.2518, -75.5636, 1495, 1650, 'bimodal'),
  p('santa-rosa-osos', 'Santa Rosa de Osos', 'Antioquia', 6.6437, -75.4607, 2550, 1800, 'bimodal'),
  p('entrerrios', 'Entrerríos', 'Antioquia', 6.5667, -75.5167, 2400, 1900, 'bimodal'),
  p('yarumal', 'Yarumal', 'Antioquia', 6.9644, -75.4189, 2300, 2000, 'bimodal'),
  p('rionegro', 'Rionegro', 'Antioquia', 6.1534, -75.3737, 2125, 1900, 'bimodal'),
  p('sonson', 'Sonsón', 'Antioquia', 5.7111, -75.3089, 2475, 2200, 'bimodal'),
  p('jardin', 'Jardín', 'Antioquia', 5.5983, -75.8189, 1750, 2200, 'bimodal'),
  p('andes', 'Andes', 'Antioquia', 5.6567, -75.8783, 1350, 2400, 'bimodal'),
  p('santa-fe-antioquia', 'Santa Fe de Antioquia', 'Antioquia', 6.5567, -75.8281, 550, 1100, 'bimodal'),
  p('caucasia', 'Caucasia', 'Antioquia', 7.9847, -75.1983, 50, 2500, 'caribe'),
  p('apartado', 'Apartadó', 'Antioquia', 7.8833, -76.6333, 25, 2600, 'pacifico'),
  p('turbo', 'Turbo', 'Antioquia', 8.0933, -76.7283, 2, 2400, 'pacifico'),
  // Eje cafetero
  p('manizales', 'Manizales', 'Caldas', 5.0703, -75.5138, 2150, 1800, 'bimodal'),
  p('pereira', 'Pereira', 'Risaralda', 4.8133, -75.6961, 1411, 2700, 'bimodal'),
  p('armenia', 'Armenia', 'Quindío', 4.5339, -75.6811, 1483, 2000, 'bimodal'),
  // Centro y oriente andino
  p('bogota', 'Bogotá', 'Cundinamarca', 4.711, -74.0721, 2600, 900, 'bimodal'),
  p('zipaquira', 'Zipaquirá', 'Cundinamarca', 5.0225, -74.0043, 2650, 700, 'bimodal'),
  p('ubate', 'Ubaté', 'Cundinamarca', 5.3086, -73.8156, 2556, 700, 'bimodal'),
  p('tunja', 'Tunja', 'Boyacá', 5.5353, -73.3678, 2782, 650, 'bimodal'),
  p('duitama', 'Duitama', 'Boyacá', 5.8267, -73.0333, 2530, 800, 'bimodal'),
  p('ibague', 'Ibagué', 'Tolima', 4.4389, -75.2322, 1285, 1500, 'bimodal'),
  p('neiva', 'Neiva', 'Huila', 2.9273, -75.2819, 442, 1300, 'bimodal'),
  p('pitalito', 'Pitalito', 'Huila', 1.8536, -76.0506, 1318, 1500, 'bimodal'),
  p('bucaramanga', 'Bucaramanga', 'Santander', 7.1254, -73.1198, 959, 1100, 'bimodal'),
  p('cucuta', 'Cúcuta', 'Norte de Santander', 7.8939, -72.5078, 320, 800, 'bimodal'),
  // Suroccidente
  p('cali', 'Cali', 'Valle del Cauca', 3.4516, -76.5320, 1000, 1000, 'bimodal'),
  p('popayan', 'Popayán', 'Cauca', 2.4448, -76.6147, 1737, 1900, 'bimodal'),
  p('pasto', 'Pasto', 'Nariño', 1.2136, -77.2811, 2527, 900, 'bimodal'),
  // Caribe
  p('monteria', 'Montería', 'Córdoba', 8.7479, -75.8814, 18, 1300, 'caribe'),
  p('sincelejo', 'Sincelejo', 'Sucre', 9.3047, -75.3978, 213, 1100, 'caribe'),
  p('valledupar', 'Valledupar', 'Cesar', 10.4631, -73.2532, 169, 1000, 'caribe'),
  p('barranquilla', 'Barranquilla', 'Atlántico', 10.9685, -74.7813, 18, 800, 'caribe'),
  p('santa-marta', 'Santa Marta', 'Magdalena', 11.2408, -74.199, 5, 500, 'caribe'),
  p('cartagena', 'Cartagena', 'Bolívar', 10.391, -75.4794, 2, 1000, 'caribe'),
  p('riohacha', 'Riohacha', 'La Guajira', 11.5444, -72.9072, 5, 500, 'caribe'),
  // Orinoquía
  p('villavicencio', 'Villavicencio', 'Meta', 4.142, -73.6266, 467, 4000, 'llanos'),
  p('yopal', 'Yopal', 'Casanare', 5.3378, -72.3959, 350, 2200, 'llanos'),
  // Pacífico y Amazonía
  p('quibdo', 'Quibdó', 'Chocó', 5.6947, -76.6611, 43, 8000, 'pacifico'),
  p('tumaco', 'Tumaco', 'Nariño', 1.7986, -78.8156, 2, 2500, 'pacifico'),
  p('florencia', 'Florencia', 'Caquetá', 1.6144, -75.6062, 242, 3500, 'amazonia'),
  p('leticia', 'Leticia', 'Amazonas', -4.2153, -69.9406, 96, 3000, 'amazonia')
];

export const DEPARTMENTS = Array.from(new Set(PLACES.map((x) => x.dept))).sort((a, b) => a.localeCompare(b, 'es'));
export const getPlace = (id: string | null) => PLACES.find((x) => x.id === id) ?? null;

export function nearestPlace(lat: number, lon: number): Place {
  let best = PLACES[0];
  let bd = Infinity;
  for (const pl of PLACES) {
    const dx = (pl.lat - lat) * 111;
    const dy = (pl.lon - lon) * 111 * Math.cos((lat * Math.PI) / 180);
    const d = dx * dx + dy * dy;
    if (d < bd) {
      bd = d;
      best = pl;
    }
  }
  return best;
}
