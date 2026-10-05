import type { Crop } from '../lib/types';

/**
 * VALORES ORIENTATIVOS (v0.1). Rangos agroecológicos, rendimientos, costos y precios en COP
 * son una primera referencia basada en literatura técnica general (Agrosavia, FAO, FNC, Fedepapa,
 * Fedegán, Fenalce y fichas universitarias). Deben validarse con un ingeniero agrónomo y
 * actualizarse con precios SIPSA-DANE antes de usar como asesoría. Ver docs/FUENTES.md.
 */
export const CROPS: Crop[] = [
  {
    id: 'maiz', name: 'Maíz (grano)', sci: 'Zea mays', icon: '🌽', group: 'anual',
    altOpt: [0, 1800], altAbs: [0, 2600], rainOpt: [800, 1800], rainAbs: [500, 3000], phOpt: [5.5, 7], phAbs: [4.8, 8],
    textures: ['franco', 'arenoso', 'arcilloso'], drainage: ['bueno', 'moderado'], slopeMax: 25, frostSensitive: true, irrigable: true,
    cycleDays: [110, 150], yearsToProd: 0, yieldT: [3.5, 6.5], yieldUnit: 't grano/ha/ciclo', priceCop: 1_400_000, priceVolatility: 'media',
    costs: { semillas: 900_000, fertilizantes: 2_000_000, agua: 200_000, manoObra: 1_800_000, otros: 1_100_000 }, establishment: 0, waterMm: 550,
    density: '60.000–70.000 plantas/ha (0,8 m entre surcos × 0,2 m entre plantas)', seedType: 'Híbrido o variedad mejorada certificada ICA',
    varieties: [
      { name: 'Híbrido tropical certificado (ICA)', traits: ['Alta producción (6–8 t/ha con buen manejo)', 'Tolerancia a sequía corta'], cycle: '110–125 días', tag: 'Alta rentabilidad' },
      { name: 'Variedad mejorada de polinización libre', traits: ['Semilla más barata', 'Se puede guardar con selección'], cycle: '115–135 días', tag: 'Bajo costo' },
      { name: 'Criollo mejorado (local)', traits: ['Resiste condiciones locales', 'Menor rendimiento'], cycle: '120–150 días', tag: 'Rentable (bajo costo)' }
    ],
    fert: { N: [100, 150], P2O5: [40, 60], K2O: [40, 60], organicT: [2, 4], note: 'Fraccionar el nitrógeno: 1/3 a la siembra y 2/3 a los 25–35 días.' },
    steps: ['Elegir lote con buen drenaje y tomar muestra de suelo.', 'Preparar suelo (labranza mínima en ladera) y corregir acidez si el análisis lo pide.', 'Sembrar al inicio de lluvias, 2–3 semillas por sitio y ralear a 1.', 'Controlar malezas en los primeros 30 días (periodo crítico).', 'Fertilizar fraccionado y aporcar.', 'Monitorear cogollero desde V3 y cosechar cuando el grano esté en madurez fisiológica (~35% humedad) o seco.'],
    pests: ['cogollero'], noChem: ['No aplicar herbicidas ni insecticidas con lluvia inminente (lavado y contaminación de aguas).', 'No fertilizar con nitrógeno en suelo encharcado o muy seco.', 'No aplicar insecticida si el nivel de daño de cogollero está por debajo del umbral: use enemigos naturales y Bacillus thuringiensis.'],
    tip: 'Siembre cuando las lluvias estén establecidas; evite que la floración coincida con un periodo seco.'
  },
  {
    id: 'maiz-forrajero', name: 'Maíz forrajero (ensilaje)', sci: 'Zea mays', icon: '🌾', group: 'forraje',
    altOpt: [1500, 2500], altAbs: [0, 2800], rainOpt: [900, 1800], rainAbs: [600, 2500], phOpt: [5.5, 6.8], phAbs: [5, 7.8],
    textures: ['franco', 'arenoso'], drainage: ['bueno', 'moderado'], slopeMax: 30, frostSensitive: true, irrigable: true,
    cycleDays: [120, 180], yearsToProd: 0, yieldT: [35, 60], yieldUnit: 't forraje verde/ha/ciclo', priceCop: 190_000, priceVolatility: 'baja',
    costs: { semillas: 1_000_000, fertilizantes: 2_400_000, agua: 200_000, manoObra: 2_200_000, otros: 1_800_000 }, establishment: 0, waterMm: 500,
    density: '70.000–85.000 plantas/ha', seedType: 'Híbrido forrajero de alta digestibilidad',
    varieties: [
      { name: 'Híbrido forrajero de altura certificado', traits: ['Alto volumen de biomasa', 'Buena proporción de mazorca'], cycle: '150–180 días', tag: 'Alta producción' },
      { name: 'Híbrido de doble propósito', traits: ['Grano o ensilaje', 'Flexible según precio'], cycle: '125–150 días', tag: 'Flexible' }
    ],
    fert: { N: [120, 180], P2O5: [50, 70], K2O: [50, 80], organicT: [4, 8], note: 'La gallinaza o el estiércol compostado reducen el costo de N; analizar suelo cada 2 años.' },
    steps: ['Seleccionar lote cercano al sitio de ensilaje.', 'Preparar el suelo y aplicar abono orgánico.', 'Sembrar al inicio de lluvias, en surcos.', 'Cosechar a punto de grano lechoso-pastoso (32–35% de materia seca).', 'Picar a 1–2 cm, compactar bien y sellar al vacío (bolsa o silo) en menos de 24 h.'],
    pests: ['cogollero'], noChem: ['No ensilar con exceso de humedad (>70%): aparecen pudriciones.', 'Respetar el periodo de carencia de cualquier plaguicida antes de picar el forraje.'],
    tip: 'El valor del forraje es el ahorro frente a concentrado y la reserva para verano: calcúlelo con su costo de alimentación.'
  },
  {
    id: 'frijol', name: 'Fríjol', sci: 'Phaseolus vulgaris', icon: '🫘', group: 'anual',
    altOpt: [1000, 2000], altAbs: [300, 2400], rainOpt: [700, 1500], rainAbs: [400, 2500], phOpt: [6, 7], phAbs: [5, 7.8],
    textures: ['franco', 'arenoso'], drainage: ['bueno'], slopeMax: 30, frostSensitive: true, irrigable: true,
    cycleDays: [75, 120], yearsToProd: 0, yieldT: [1.2, 2.2], yieldUnit: 't grano seco/ha/ciclo', priceCop: 6_500_000, priceVolatility: 'alta',
    costs: { semillas: 900_000, fertilizantes: 1_200_000, agua: 300_000, manoObra: 3_200_000, otros: 900_000 }, establishment: 0, waterMm: 350,
    density: 'Arbustivo: 200.000–250.000 plantas/ha · Voluble: 40.000–60.000 con tutor', seedType: 'Semilla certificada de variedad adaptada a su piso térmico',
    varieties: [
      { name: 'Arbustivo certificado (Agrosavia/ICA)', traits: ['Ciclo corto', 'Menor mano de obra'], cycle: '75–95 días', tag: 'Ciclo corto' },
      { name: 'Voluble (tipo cargamanto)', traits: ['Alto precio', 'Requiere tutores'], cycle: '110–140 días', tag: 'Alto precio' }
    ],
    fert: { N: [20, 40], P2O5: [50, 80], K2O: [40, 60], organicT: [2, 4], note: 'Es leguminosa: fije nitrógeno; inocule semilla con Rhizobium si es posible.' },
    steps: ['Evitar lotes donde hubo fríjol hace menos de 2 años (enfermedades del suelo).', 'Preparar suelo bien drenado.', 'Sembrar semilla certificada al inicio de lluvias.', 'Tutorar si es voluble.', 'Cosechar cuando 90% de las vainas estén secas.'],
    pests: ['antracnosis-frijol'], noChem: ['No aplicar fungicidas por calendario: solo cuando haya síntomas y clima húmedo.', 'No sembrar en suelos encharcables (pudriciones radiculares).'],
    tip: 'Precio muy variable: contrate comercialización antes de sembrar áreas grandes.'
  },
  {
    id: 'papa', name: 'Papa', sci: 'Solanum tuberosum', icon: '🥔', group: 'anual',
    altOpt: [2200, 3000], altAbs: [1800, 3200], rainOpt: [800, 1600], rainAbs: [600, 2000], phOpt: [5, 6], phAbs: [4.5, 6.8],
    textures: ['franco', 'arenoso'], drainage: ['bueno'], slopeMax: 30, frostSensitive: true, irrigable: true,
    cycleDays: [120, 180], yearsToProd: 0, yieldT: [18, 30], yieldUnit: 't tubérculo/ha/ciclo', priceCop: 1_300_000, priceVolatility: 'alta',
    costs: { semillas: 5_000_000, fertilizantes: 5_000_000, agua: 300_000, manoObra: 3_200_000, otros: 4_500_000 }, establishment: 0, waterMm: 450,
    density: '35.000–45.000 plantas/ha (1 m entre surcos × 0,3 m)', seedType: 'Semilla certificada ICA (tubérculo-semilla sano)',
    varieties: [
      { name: 'Pastusa suprema', traits: ['Alta producción', 'Buen mercado fresco'], cycle: '150–180 días', tag: 'Alta producción' },
      { name: 'Diacol Capiro (R-12)', traits: ['Industria/fritura', 'Tolerancia parcial a tizón'], cycle: '150–170 días', tag: 'Industria' },
      { name: 'Criolla (Yema de huevo)', traits: ['Ciclo corto', 'Alto valor por kilo'], cycle: '110–130 días', tag: 'Ciclo corto' }
    ],
    fert: { N: [120, 180], P2O5: [150, 250], K2O: [100, 180], organicT: [4, 8], note: 'La papa responde fuerte a fósforo. Prohibido cultivar en páramo (Ley 1930/2018).' },
    steps: ['Verificar que el lote esté por debajo del límite de páramo y rotar con pasto o leguminosa.', 'Usar semilla certificada y desinfectar si es necesario.', 'Surcar a favor de curvas de nivel.', 'Aporcar a los 30–45 días.', 'Monitorear tizón tardío semanalmente en época lluviosa.', 'Cosechar con la piel firme (cáscara curada).'],
    pests: ['tizon-tardio', 'polilla-guatemalteca'], noChem: ['No aplicar fungicida de contacto con lluvia en las siguientes horas.', 'No sembrar papa después de papa en el mismo lote (rote con pasto, haba o leguminosa).', 'No cultivar en zona de páramo ni cerca de nacimientos de agua.'],
    tip: 'Rotación con pasto mejora suelo y reduce plagas de suelo; calcule el costo de semilla antes de ampliar área.'
  },
  {
    id: 'cafe', name: 'Café', sci: 'Coffea arabica', icon: '☕', group: 'perenne',
    altOpt: [1200, 1800], altAbs: [900, 2100], rainOpt: [1800, 2800], rainAbs: [1200, 4000], phOpt: [5, 6], phAbs: [4.5, 6.5],
    textures: ['franco'], drainage: ['bueno', 'moderado'], slopeMax: 60, frostSensitive: true, irrigable: false,
    cycleDays: [365, 365], yearsToProd: 2, yieldT: [1.2, 2.4], yieldUnit: 't pergamino seco/ha/año', priceCop: 14_000_000, priceVolatility: 'alta',
    costs: { semillas: 0, fertilizantes: 4_500_000, agua: 0, manoObra: 8_000_000, otros: 2_500_000 }, establishment: 18_000_000, waterMm: 1200,
    density: '5.000–7.000 plantas/ha (1,5 × 1 m)', seedType: 'Variedad resistente a roya certificada (Cenicafé)',
    varieties: [
      { name: 'Cenicafé 1 / Castillo', traits: ['Resistente a roya', 'Alta producción'], cycle: 'Primera cosecha a los 2 años', tag: 'Resistente a roya' },
      { name: 'Tabi', traits: ['Calidad de taza', 'Porte alto'], cycle: 'Primera cosecha a los 2–2,5 años', tag: 'Calidad taza' }
    ],
    fert: { N: [150, 250], P2O5: [30, 60], K2O: [100, 200], organicT: [2, 5], note: 'Fertilizar según análisis de suelo y estado del cultivo, aprovechando lluvias.' },
    steps: ['Establecer almácigo con semilla certificada.', 'Trazar a curvas de nivel y sembrar con sombrío transitorio.', 'Renovar por zoca o siembra cada 5–7 años.', 'Cosechar solo frutos maduros y beneficiar el mismo día.', 'Manejo integrado de broca y roya.'],
    pests: ['broca', 'roya'], noChem: ['No aplicar fungicidas cúpricos en floración abundante sin asesoría técnica.', 'Evite insecticidas de amplio espectro: dañan los enemigos naturales de la broca.', 'Nunca arroje aguas mieles a las fuentes de agua.'],
    tip: 'La renovación oportuna y la variedad resistente a roya suelen pesar más que subir la dosis de fertilizante.'
  },
  {
    id: 'platano', name: 'Plátano', sci: 'Musa AAB', icon: '🍌', group: 'perenne',
    altOpt: [0, 1500], altAbs: [0, 1900], rainOpt: [1500, 3500], rainAbs: [1000, 8500], phOpt: [5.5, 7], phAbs: [4.8, 7.8],
    textures: ['franco', 'arcilloso'], drainage: ['bueno', 'moderado'], slopeMax: 35, frostSensitive: true, irrigable: true,
    cycleDays: [365, 365], yearsToProd: 1, yieldT: [12, 22], yieldUnit: 't racimo/ha/año', priceCop: 1_000_000, priceVolatility: 'media',
    costs: { semillas: 0, fertilizantes: 2_800_000, agua: 300_000, manoObra: 4_300_000, otros: 1_600_000 }, establishment: 6_500_000, waterMm: 1400,
    density: '1.600–2.000 plantas/ha (2,5 × 2 m)', seedType: 'Cormos o hijuelos sanos, desinfectados',
    varieties: [
      { name: 'Dominico Hartón', traits: ['Mercado nacional', 'Buen precio'], cycle: '10–12 meses', tag: 'Mercado local' },
      { name: 'Hartón gigante', traits: ['Racimos grandes', 'Exigente en manejo'], cycle: '11–13 meses', tag: 'Alto rendimiento' }
    ],
    fert: { N: [150, 250], P2O5: [30, 60], K2O: [250, 400], organicT: [3, 6], note: 'Es exigente en potasio. El compost/pulpa de café ayuda a bajar el costo.' },
    steps: ['Seleccionar semilla (hijuelo) sana y desinfectarla.', 'Hoyar y sembrar con materia orgánica.', 'Deshije: dejar madre, hija y nieta.', 'Controlar sigatoka con deshoje sanitario.', 'Embolsar racimos y cosechar a tiempo.'],
    pests: ['sigatoka'], noChem: ['No dejar hojas enfermas en el suelo: haga deshoje sanitario antes de aplicar fungicida.', 'Evite herbicidas cerca de quebradas.'],
    tip: 'Rotar el deshoje y el drenaje bien hecho evitan la mayoría de los problemas.'
  },
  {
    id: 'aguacate', name: 'Aguacate Hass', sci: 'Persea americana', icon: '🥑', group: 'perenne',
    altOpt: [1800, 2400], altAbs: [1500, 2700], rainOpt: [1000, 1800], rainAbs: [800, 2500], phOpt: [5.5, 6.5], phAbs: [5, 7],
    textures: ['franco', 'arenoso'], drainage: ['bueno'], slopeMax: 40, frostSensitive: true, irrigable: true,
    cycleDays: [365, 365], yearsToProd: 3, yieldT: [9, 16], yieldUnit: 't fruta/ha/año (adulto)', priceCop: 3_500_000, priceVolatility: 'alta',
    costs: { semillas: 0, fertilizantes: 5_500_000, agua: 1_500_000, manoObra: 9_000_000, otros: 8_000_000 }, establishment: 28_000_000, waterMm: 900,
    density: '100–200 árboles/ha (8 × 8 m o 7 × 7 m)', seedType: 'Plantas injertadas certificadas ICA, patrón tolerante a Phytophthora',
    varieties: [
      { name: 'Hass (injerto certificado)', traits: ['Exportación', 'Alta demanda'], cycle: 'Producción desde año 3–4', tag: 'Exportación' }
    ],
    fert: { N: [100, 200], P2O5: [40, 80], K2O: [100, 200], organicT: [4, 8], note: 'Sin drenaje se pierde el árbol por pudrición radicular: es la regla de oro.' },
    steps: ['Verificar drenaje profundo (no sembrar en suelos encharcables).', 'Hoyos amplios con enmienda y siembra en camellón en lotes húmedos.', 'Mantener cobertura y riego de apoyo en verano.', 'Poda de formación y sanitaria.', 'Cosechar por índice de madurez (materia seca).'],
    pests: [], noChem: ['No usar fungicidas como sustituto de un drenaje deficiente.', 'No aplicar plaguicidas con abejas activas en floración.'],
    tip: 'Es una inversión a 3–4 años: valide acceso a mercado y agua antes de sembrar.'
  },
  {
    id: 'cacao', name: 'Cacao', sci: 'Theobroma cacao', icon: '🍫', group: 'perenne',
    altOpt: [0, 800], altAbs: [0, 1200], rainOpt: [1500, 3500], rainAbs: [1200, 7000], phOpt: [5.5, 7], phAbs: [4.8, 7.5],
    textures: ['franco', 'arcilloso'], drainage: ['bueno', 'moderado'], slopeMax: 30, frostSensitive: true, irrigable: true,
    cycleDays: [365, 365], yearsToProd: 3, yieldT: [0.6, 1.3], yieldUnit: 't grano seco/ha/año', priceCop: 12_000_000, priceVolatility: 'alta',
    costs: { semillas: 0, fertilizantes: 1_500_000, agua: 0, manoObra: 3_200_000, otros: 1_300_000 }, establishment: 9_000_000, waterMm: 1300,
    density: '1.100 plantas/ha (3 × 3 m) bajo sombrío', seedType: 'Clones certificados (ICS, CCN-51, TSH)',
    varieties: [
      { name: 'Clones recomendados por Fedecacao/Agrosavia', traits: ['Tolerancia a moniliasis', 'Calidad aromática'], cycle: 'Producción desde año 3', tag: 'Certificado' }
    ],
    fert: { N: [60, 120], P2O5: [20, 40], K2O: [60, 120], organicT: [2, 4], note: 'La poda y el sombrío bien manejados valen más que subir la dosis.' },
    steps: ['Establecer sombrío temporal y permanente.', 'Sembrar clones en hoyos con materia orgánica.', 'Podas de formación y mantenimiento.', 'Remover frutos enfermos semanalmente (moniliasis).', 'Fermentar y secar el grano con buenas prácticas.'],
    pests: ['monilia'], noChem: ['La remoción semanal de frutos enfermos reemplaza gran parte de las aplicaciones de fungicida.', 'No aplicar plaguicidas en horas de polinización (mañana).'],
    tip: 'La calidad (fermentación y secado) define el sobreprecio.'
  },
  {
    id: 'cana-panelera', name: 'Caña panelera', sci: 'Saccharum officinarum', icon: '🎋', group: 'perenne',
    altOpt: [800, 1600], altAbs: [0, 2000], rainOpt: [1200, 2200], rainAbs: [800, 3000], phOpt: [5.5, 7.5], phAbs: [4.8, 8.2],
    textures: ['franco', 'arcilloso'], drainage: ['bueno', 'moderado'], slopeMax: 40, frostSensitive: true, irrigable: true,
    cycleDays: [365, 540], yearsToProd: 1, yieldT: [5, 9], yieldUnit: 't panela/ha/año', priceCop: 3_500_000, priceVolatility: 'media',
    costs: { semillas: 0, fertilizantes: 2_800_000, agua: 200_000, manoObra: 7_500_000, otros: 3_500_000 }, establishment: 5_500_000, waterMm: 1300,
    density: '8.000–12.000 sitios/ha', seedType: 'Semilla vegetativa (tallo) sana de variedad adaptada (Cenicaña/Agrosavia)',
    varieties: [{ name: 'Variedad panelera recomendada por Agrosavia', traits: ['Alto contenido de sacarosa', 'Resistente a enfermedades locales'], cycle: '12–18 meses', tag: 'Certificada' }],
    fert: { N: [80, 140], P2O5: [30, 60], K2O: [60, 120], organicT: [3, 6], note: 'Aproveche la cachaza y el bagazo compostado en lugar de comprarlos.' },
    steps: ['Seleccionar semilla sana y sembrar en surcos.', 'Abonar a los 2–3 meses.', 'Cosecha por corte parejo y molienda oportuna.', 'Cumplir buenas prácticas en el trapiche.'],
    pests: [], noChem: ['No aplicar herbicida en cercanía de fuentes de agua.', 'Evitar quemas: degradan suelo y generan sanciones.'],
    tip: 'El trapiche y el acceso al mercado de panela determinan la rentabilidad.'
  },
  {
    id: 'yuca', name: 'Yuca', sci: 'Manihot esculenta', icon: '🌿', group: 'anual',
    altOpt: [0, 1500], altAbs: [0, 1900], rainOpt: [800, 1800], rainAbs: [500, 3000], phOpt: [5, 7], phAbs: [4.5, 8],
    textures: ['arenoso', 'franco'], drainage: ['bueno'], slopeMax: 30, frostSensitive: true, irrigable: true,
    cycleDays: [270, 360], yearsToProd: 0, yieldT: [15, 28], yieldUnit: 't raíz/ha/ciclo', priceCop: 800_000, priceVolatility: 'media',
    costs: { semillas: 800_000, fertilizantes: 1_500_000, agua: 0, manoObra: 4_300_000, otros: 2_400_000 }, establishment: 0, waterMm: 600,
    density: '10.000 plantas/ha (1 × 1 m)', seedType: 'Estacas de 20 cm de plantas sanas de 8–12 meses',
    varieties: [{ name: 'Variedad mejorada (CIAT/Agrosavia)', traits: ['Alto contenido de almidón', 'Tolerante a sequía'], cycle: '9–12 meses', tag: 'Tolerante a sequía' }],
    fert: { N: [40, 80], P2O5: [20, 40], K2O: [80, 140], organicT: [2, 4], note: 'Responde bien a potasio; no tolera encharcamiento.' },
    steps: ['Preparar suelo suelto y bien drenado.', 'Sembrar estacas de 20 cm en posición inclinada.', 'Controlar malezas los primeros 3 meses.', 'Cosechar y vender rápido: tiene poca vida poscosecha.'],
    pests: [], noChem: ['No sembrar en suelos que acumulan agua: se pudre la raíz.'], tip: 'Planifique la venta antes de cosechar: la raíz se daña en pocos días.'
  },
  {
    id: 'arroz', name: 'Arroz', sci: 'Oryza sativa', icon: '🍚', group: 'anual',
    altOpt: [0, 800], altAbs: [0, 1100], rainOpt: [1500, 3000], rainAbs: [800, 6000], phOpt: [5, 7], phAbs: [4.5, 8],
    textures: ['arcilloso', 'franco'], drainage: ['moderado', 'pobre'], slopeMax: 8, frostSensitive: true, irrigable: true,
    cycleDays: [110, 140], yearsToProd: 0, yieldT: [5, 7.5], yieldUnit: 't paddy seco/ha/ciclo', priceCop: 1_600_000, priceVolatility: 'media',
    costs: { semillas: 900_000, fertilizantes: 2_000_000, agua: 800_000, manoObra: 2_000_000, otros: 2_800_000 }, establishment: 0, waterMm: 1000,
    density: '120–160 kg de semilla/ha (siembra directa)', seedType: 'Semilla certificada Fedearroz/ICA',
    varieties: [{ name: 'Variedad certificada Fedearroz', traits: ['Alto rendimiento', 'Tolerante a Pyricularia'], cycle: '110–130 días', tag: 'Certificada' }],
    fert: { N: [100, 160], P2O5: [30, 50], K2O: [40, 80], organicT: [0, 2], note: 'Fraccionar nitrógeno en 3 aplicaciones y manejar lámina de agua.' },
    steps: ['Nivelar el lote y planificar el riego/drenaje.', 'Sembrar semilla certificada.', 'Mantener lámina de agua adecuada.', 'Cosecha cuando el grano alcance 20–24% de humedad.'],
    pests: [], noChem: ['No aplicar agroquímicos con la lámina de agua desbordando hacia canales abiertos.'], tip: 'Margen bajo y alta inversión: ideal solo con distrito de riego y buena escala.'
  },
  {
    id: 'maracuya', name: 'Maracuyá', sci: 'Passiflora edulis', icon: '🍈', group: 'perenne',
    altOpt: [200, 1000], altAbs: [0, 1400], rainOpt: [1200, 2200], rainAbs: [800, 3000], phOpt: [5.5, 7], phAbs: [5, 7.8],
    textures: ['franco', 'arenoso'], drainage: ['bueno'], slopeMax: 25, frostSensitive: true, irrigable: true,
    cycleDays: [365, 365], yearsToProd: 1, yieldT: [15, 25], yieldUnit: 't fruta/ha/año', priceCop: 1_800_000, priceVolatility: 'alta',
    costs: { semillas: 0, fertilizantes: 3_500_000, agua: 1_500_000, manoObra: 10_000_000, otros: 7_000_000 }, establishment: 12_000_000, waterMm: 1000,
    density: '1.000–1.200 plantas/ha con espaldera', seedType: 'Semilla certificada de variedad adaptada',
    varieties: [{ name: 'Maracuyá amarillo certificado', traits: ['Fruto para jugo', 'Alta demanda agroindustrial'], cycle: 'Primera cosecha a los 8–10 meses', tag: 'Agroindustria' }],
    fert: { N: [120, 200], P2O5: [40, 80], K2O: [120, 200], organicT: [3, 6], note: 'Cultivo de ciclo productivo corto (2–3 años): renueve a tiempo.' },
    steps: ['Construir espaldera.', 'Sembrar plántulas sanas.', 'Podas de formación y control sanitario.', 'Cosechar fruta caída o madura de la planta.'],
    pests: [], noChem: ['No aplicar insecticidas durante la floración (polinización por abejas/abejorros).'], tip: 'Altísima mano de obra: calcule el jornal real antes de decidir.'
  },
  {
    id: 'tomate-arbol', name: 'Tomate de árbol', sci: 'Solanum betaceum', icon: '🍅', group: 'perenne',
    altOpt: [1800, 2400], altAbs: [1500, 2800], rainOpt: [1000, 1800], rainAbs: [800, 2500], phOpt: [5.5, 6.5], phAbs: [5, 7],
    textures: ['franco'], drainage: ['bueno'], slopeMax: 35, frostSensitive: true, irrigable: true,
    cycleDays: [365, 365], yearsToProd: 1, yieldT: [25, 40], yieldUnit: 't fruta/ha/año', priceCop: 1_500_000, priceVolatility: 'alta',
    costs: { semillas: 0, fertilizantes: 5_000_000, agua: 800_000, manoObra: 12_000_000, otros: 11_000_000 }, establishment: 15_000_000, waterMm: 900,
    density: '1.600–2.200 plantas/ha', seedType: 'Plántulas certificadas libres de nematodos',
    varieties: [{ name: 'Tomate de árbol certificado', traits: ['Mercado fresco y pulpa'], cycle: 'Primera cosecha a los 10–12 meses', tag: 'Mercado fresco' }],
    fert: { N: [150, 250], P2O5: [60, 100], K2O: [150, 250], organicT: [4, 8], note: 'Evite lotes con historial de nematodos o marchitez.' },
    steps: ['Seleccionar lote sin historial de nematodos.', 'Sembrar plántulas con materia orgánica.', 'Podas y entutorado.', 'Monitorear antracnosis y mosca de la fruta.'],
    pests: [], noChem: ['No aplicar plaguicidas de alta toxicidad: la fruta se consume fresca (respete periodos de carencia).'], tip: 'Ciclo corto de vida del cultivo: planee la renovación a los 3–4 años.'
  },
  {
    id: 'mora', name: 'Mora de Castilla', sci: 'Rubus glaucus', icon: '🫐', group: 'perenne',
    altOpt: [1800, 2400], altAbs: [1200, 3000], rainOpt: [1000, 2000], rainAbs: [800, 2800], phOpt: [5.5, 6.5], phAbs: [5, 7],
    textures: ['franco'], drainage: ['bueno'], slopeMax: 40, frostSensitive: false, irrigable: true,
    cycleDays: [365, 365], yearsToProd: 1, yieldT: [8, 12], yieldUnit: 't fruta/ha/año', priceCop: 4_000_000, priceVolatility: 'media',
    costs: { semillas: 0, fertilizantes: 3_500_000, agua: 800_000, manoObra: 13_000_000, otros: 7_000_000 }, establishment: 11_000_000, waterMm: 900,
    density: '2.000–3.300 plantas/ha', seedType: 'Material vegetal certificado (estaca o acodo sano)',
    varieties: [{ name: 'Mora de Castilla (con espinas o sin espinas)', traits: ['Producción continua', 'Alta demanda'], cycle: 'Primera cosecha a los 8–10 meses', tag: 'Producción continua' }],
    fert: { N: [100, 180], P2O5: [40, 80], K2O: [100, 180], organicT: [4, 8], note: 'Cosecha todo el año: aproveche el flujo de caja continuo.' },
    steps: ['Instalar espalderas y sembrar.', 'Podar para mantener la producción.', 'Cosechar frecuentemente y refrigerar rápido.'],
    pests: [], noChem: ['Respete siempre el periodo de carencia: se cosecha cada semana.'], tip: 'La cosecha frecuente exige mano de obra constante y un buen manejo de la cadena de frío.'
  }
];

export const getCrop = (id: string) => CROPS.find((c) => c.id === id);
