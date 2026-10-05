import type { Pasture } from '../lib/types';

const CAT = 'Catálogo semillas pasto clima cálido SOESP/Durespo (precipitación mínima, altitud, valor cultural). Validar con Agrosavia/Fedegán.';
const GEN = 'Referencia técnica general (Agrosavia, Fedegán, universidades). Validar localmente.';

export const PASTURES: Pasture[] = [
  {
    id: 'brachiaria-brizantha-marandu', name: 'Brachiaria brizantha cv. Marandú', sci: 'Urochloa brizantha', icon: '🌱', kind: 'gramínea',
    altOpt: [0, 1400], altAbs: [0, 1800], rainMin: 800, fertility: 'media', acidTolerance: 'alta', waterlogTolerance: 'baja', frost: false,
    drainageOk: ['bueno', 'moderado'], proteinPct: [8, 10], dmTHaYear: [14, 18], restDays: [28, 35], grazeHeightCm: 'Entrada 25–30 cm',
    seedKgHa: '5 kg/ha con VC 75% (375 puntos de VC)', pvc: 375, species: ['carne', 'doble', 'leche', 'ovino'],
    traits: ['Tolerante a salivazo (mión)', 'Buena producción en suelos ácidos', 'No tolera encharcamiento'],
    management: ['Preparar suelo y corregir fertilidad según análisis.', 'Sembrar al inicio de lluvias a 0,5–2 cm de profundidad.', 'Compactar con rodillo para asegurar contacto semilla-suelo.', 'Primer pastoreo cuando alcance 90–120 días.'], source: CAT
  },
  {
    id: 'brachiaria-decumbens', name: 'Brachiaria decumbens cv. Basilisk', sci: 'Urochloa decumbens', icon: '🌱', kind: 'gramínea',
    altOpt: [0, 1600], altAbs: [0, 2000], rainMin: 800, fertility: 'baja', acidTolerance: 'alta', waterlogTolerance: 'media', frost: false,
    drainageOk: ['bueno', 'moderado'], proteinPct: [7, 8], dmTHaYear: [12, 18], restDays: [28, 35], grazeHeightCm: 'Entrada 20–25 cm',
    seedKgHa: '6 kg/ha con VC 75% (280 puntos de VC)', pvc: 280, species: ['carne', 'doble', 'ovino', 'caprino'],
    traits: ['Rústica en suelos pobres y ácidos', 'Susceptible a salivazo', 'Cobertura rápida'],
    management: ['Sembrar con suelo bien preparado.', 'Vigilar salivazo (mión) en época de lluvias.', 'Rotar potreros y evitar sobrepastoreo.'], source: CAT
  },
  {
    id: 'brachiaria-humidicola', name: 'Brachiaria humidicola', sci: 'Urochloa humidicola', icon: '🌱', kind: 'gramínea',
    altOpt: [0, 1000], altAbs: [0, 1200], rainMin: 700, fertility: 'baja', acidTolerance: 'alta', waterlogTolerance: 'alta', frost: false,
    drainageOk: ['bueno', 'moderado', 'pobre'], proteinPct: [5, 6], dmTHaYear: [10, 12], restDays: [30, 40], grazeHeightCm: 'Entrada 15–25 cm',
    seedKgHa: '6 kg/ha con VC 75% (280 puntos de VC)', pvc: 280, species: ['carne', 'doble'],
    traits: ['Tolera suelos encharcables y poca fertilidad', 'Menor calidad nutritiva', 'Buena cobertura'],
    management: ['Útil en suelos mal drenados donde otras brachiarias fallan.', 'Complementar con leguminosas para mejorar proteína.'], source: CAT
  },
  {
    id: 'xaraes', name: 'Brachiaria brizantha cv. Xaraés', sci: 'Urochloa brizantha', icon: '🌱', kind: 'gramínea',
    altOpt: [0, 1300], altAbs: [0, 1600], rainMin: 800, fertility: 'media', acidTolerance: 'media', waterlogTolerance: 'media', frost: false,
    drainageOk: ['bueno', 'moderado'], proteinPct: [10, 12], dmTHaYear: [16, 19], restDays: [28, 35], grazeHeightCm: 'Entrada 30 cm',
    seedKgHa: '5 kg/ha con VC 75% (375 puntos de VC)', pvc: 375, species: ['carne', 'doble', 'leche'],
    traits: ['Alta producción de forraje', 'Mayor palatabilidad', 'Tolerancia a salivazo'], management: ['Pastoreo rotacional con descansos de 28–35 días.', 'Fertilizar tras cada 2–3 pastoreos.'], source: CAT
  },
  {
    id: 'mombaza', name: 'Panicum maximum cv. Mombaça', sci: 'Megathyrsus maximus', icon: '🌿', kind: 'gramínea',
    altOpt: [0, 1300], altAbs: [0, 1600], rainMin: 800, fertility: 'alta', acidTolerance: 'baja', waterlogTolerance: 'baja', frost: false,
    drainageOk: ['bueno'], proteinPct: [12, 14], dmTHaYear: [22, 25], restDays: [28, 32], grazeHeightCm: 'Entrada 90–100 cm, salida 30–40 cm',
    seedKgHa: '3,5 kg/ha con VC 75% (250 puntos de VC)', pvc: 250, species: ['leche', 'carne', 'doble'],
    traits: ['Altísima producción', 'Exigente en fertilidad y drenaje', 'Ideal para intensivo con riego/fertilización'],
    management: ['Solo en suelos fértiles y bien drenados.', 'Fertilización de mantenimiento (N) después de cada pastoreo.', 'Manejo estricto de altura para no perder el macollamiento.'], source: CAT
  },
  {
    id: 'tanzania', name: 'Panicum maximum cv. Tanzânia', sci: 'Megathyrsus maximus', icon: '🌿', kind: 'gramínea',
    altOpt: [0, 1300], altAbs: [0, 1600], rainMin: 800, fertility: 'alta', acidTolerance: 'baja', waterlogTolerance: 'baja', frost: false,
    drainageOk: ['bueno'], proteinPct: [12, 14], dmTHaYear: [20, 24], restDays: [28, 32], grazeHeightCm: 'Entrada 70–80 cm',
    seedKgHa: '3,5 kg/ha con VC 75% (250 puntos de VC)', pvc: 250, species: ['leche', 'carne', 'doble', 'ovino'],
    traits: ['Buena calidad', 'Tolera menos altura que Mombaça', 'Exigente en suelo'], management: ['Mismo manejo intensivo de Mombaça, con alturas de entrada menores.'], source: CAT
  },
  {
    id: 'pasto-elefante', name: 'Pasto elefante / King grass', sci: 'Cenchrus purpureus', icon: '🌾', kind: 'gramínea',
    altOpt: [0, 1800], altAbs: [0, 2200], rainMin: 1000, fertility: 'alta', acidTolerance: 'baja', waterlogTolerance: 'baja', frost: false,
    drainageOk: ['bueno'], proteinPct: [8, 12], dmTHaYear: [20, 40], restDays: [45, 60], grazeHeightCm: 'Corte a 1,5–2 m',
    seedKgHa: 'Se siembra con cañas o estolones (3–4 t/ha de material vegetativo)', species: ['leche', 'carne', 'doble', 'caprino'],
    traits: ['Pasto de corte de alto rendimiento', 'Alta calidad si se corta joven', 'Ideal para banco de forraje'],
    management: ['Sembrar con cañas en surcos a 80–100 cm.', 'Cortar entre 45–60 días.', 'Fertilizar y abonar con estiércol compostado.'], source: GEN
  },
  {
    id: 'estrella', name: 'Pasto estrella', sci: 'Cynodon nlemfuensis', icon: '⭐', kind: 'gramínea',
    altOpt: [0, 1700], altAbs: [0, 2000], rainMin: 900, fertility: 'alta', acidTolerance: 'baja', waterlogTolerance: 'media', frost: false,
    drainageOk: ['bueno', 'moderado'], proteinPct: [10, 14], dmTHaYear: [15, 25], restDays: [28, 35], grazeHeightCm: 'Entrada 30–40 cm',
    seedKgHa: 'Estolones (1–2 t/ha) por esquejes', species: ['leche', 'doble', 'carne'],
    traits: ['Buena tolerancia al pisoteo', 'Responde a fertilización', 'Cobertura densa'], management: ['Siembra vegetativa.', 'Fertilizar tras el pastoreo.', 'Rotar con descanso suficiente.'], source: GEN
  },
  {
    id: 'kikuyo', name: 'Kikuyo', sci: 'Cenchrus clandestinus', icon: '🍀', kind: 'gramínea',
    altOpt: [1800, 2800], altAbs: [1500, 3200], rainMin: 700, fertility: 'media', acidTolerance: 'media', waterlogTolerance: 'media', frost: true,
    drainageOk: ['bueno', 'moderado'], proteinPct: [12, 18], dmTHaYear: [12, 20], restDays: [30, 45], grazeHeightCm: 'Entrada 20–25 cm',
    seedKgHa: 'Estolones o semilla (según disponibilidad)', species: ['leche', 'doble', 'carne', 'ovino'],
    traits: ['Base de la ganadería lechera de trópico alto', 'Tolera frío y pisoteo', 'Muy competitivo contra malezas'],
    management: ['Manejo en franjas con cerca eléctrica.', 'Fertilizar con N después del pastoreo; complementar con ensilaje de maíz en verano.', 'Evitar subir la dosis de N sin analizar el suelo.'], source: GEN
  },
  {
    id: 'ryegrass', name: 'Ryegrass perenne / híbrido', sci: 'Lolium spp.', icon: '🌾', kind: 'gramínea',
    altOpt: [2000, 2800], altAbs: [1800, 3000], rainMin: 900, fertility: 'alta', acidTolerance: 'baja', waterlogTolerance: 'baja', frost: true,
    drainageOk: ['bueno'], proteinPct: [16, 22], dmTHaYear: [14, 20], restDays: [24, 30], grazeHeightCm: 'Entrada 20–25 cm',
    seedKgHa: '25–30 kg/ha en resiembra o mezcla', species: ['leche', 'doble'],
    traits: ['Altísima calidad (leche)', 'Exigente en suelo y manejo', 'Se asocia con trébol blanco'],
    management: ['Sembrar en suelo bien preparado y en la época lluviosa.', 'Mezclar con trébol blanco para aportar N.', 'Manejar con cerca eléctrica y descansos exactos.'], source: GEN
  }
];

export const getPasture = (id: string) => PASTURES.find((p) => p.id === id);
