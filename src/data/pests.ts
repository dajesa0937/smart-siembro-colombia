import type { Pest } from '../lib/types';

/**
 * Información de manejo orientativa. NO se incluyen dosis numéricas de plaguicidas: la dosis y el producto
 * deben corresponder a un registro vigente del ICA y a la recomendación de un ingeniero agrónomo.
 */
export const PESTS: Pest[] = [
  {
    id: 'cogollero', name: 'Gusano cogollero', sci: 'Spodoptera frugiperda', type: 'insecto', icon: '🐛', crops: 'Maíz, sorgo, pastos',
    symptoms: 'Hojas raspadas y perforadas en el cogollo, excrementos aserrinados en el cartucho.',
    cultural: ['Siembra uniforme y oportuna en la zona', 'Eliminación de malezas hospederas', 'Rotación con leguminosas'],
    biological: ['Bacillus thuringiensis (Bt)', 'Liberación de Trichogramma', 'Conservar tijeretas y avispas predadoras'],
    chemicalNote: 'Intervenir solo al alcanzar el umbral (aprox. 20% de plantas con daño reciente en etapas tempranas). Use productos con registro ICA y rote modos de acción.',
    threshold: 'Muestreo semanal desde la emergencia.'
  },
  {
    id: 'tizon-tardio', name: 'Gota o tizón tardío', sci: 'Phytophthora infestans', type: 'hongo', icon: '🍂', crops: 'Papa, tomate',
    symptoms: 'Manchas acuosas oscuras en hojas, con moho blanco en el envés en clima húmedo; pudrición de tubérculos.',
    cultural: ['Semilla certificada', 'Variedades con tolerancia', 'Evitar siembras muy densas y manejar drenaje', 'Rotación con pastos'],
    biological: ['Monitoreo del clima y pronósticos de humedad', 'Uso de bioinsumos con Trichoderma como complemento'],
    chemicalNote: 'Aplicar según monitoreo y riesgo climático, alternando ingredientes activos de distinto grupo para evitar resistencia. Respetar periodo de carencia.',
    threshold: 'Alto riesgo con lluvias frecuentes y noches frías y húmedas.'
  },
  {
    id: 'polilla-guatemalteca', name: 'Polilla guatemalteca', sci: 'Tecia solanivora', type: 'insecto', icon: '🦋', crops: 'Papa',
    symptoms: 'Galerías en tubérculos y presencia de larvas en el almacenamiento.',
    cultural: ['Aporque alto', 'Cosecha oportuna', 'Almacenamiento limpio', 'Rotación y destrucción de residuos'],
    biological: ['Trampas de feromonas', 'Hongos entomopatógenos (Beauveria) bajo asesoría'],
    chemicalNote: 'Priorizar manejo cultural y trampas. Evite aplicaciones preventivas sin monitoreo.', threshold: 'Monitorear con trampas desde el inicio.'
  },
  {
    id: 'broca', name: 'Broca del café', sci: 'Hypothenemus hampei', type: 'insecto', icon: '🪲', crops: 'Café',
    symptoms: 'Perforación circular en el fruto cerca de la corona; granos dañados.',
    cultural: ['Recolección oportuna y completa (Re-Re)', 'Evitar frutos maduros en el suelo', 'Beneficio húmedo con buenas prácticas'],
    biological: ['Hongo Beauveria bassiana', 'Parasitoides como Cephalonomia'],
    chemicalNote: 'El control cultural (Re-Re) sustituye casi toda la aplicación química. Consultar siempre con el extensionista de la FNC.',
    threshold: 'Aproximadamente 2% de frutos brocados al monitoreo.'
  },
  {
    id: 'roya', name: 'Roya del cafeto', sci: 'Hemileia vastatrix', type: 'hongo', icon: '🍃', crops: 'Café',
    symptoms: 'Manchas amarillas en el haz de la hoja y polvo anaranjado en el envés; caída de hojas.',
    cultural: ['Variedades resistentes (Castillo, Cenicafé 1)', 'Renovación oportuna', 'Fertilización balanceada', 'Sombra regulada'],
    biological: ['Selección de variedades resistentes'], chemicalNote: 'Aplicar fungicida solo en variedades susceptibles y según incidencia; respetar dosis de etiqueta y registro ICA.', threshold: 'Más del 5% de incidencia.'
  },
  {
    id: 'sigatoka', name: 'Sigatoka negra', sci: 'Pseudocercospora fijiensis', type: 'hongo', icon: '🍌', crops: 'Plátano, banano',
    symptoms: 'Rayas y manchas negras en las hojas, secamiento prematuro.',
    cultural: ['Deshoje sanitario', 'Drenaje', 'Densidad adecuada', 'Variedades más tolerantes'], biological: ['Manejo de hojarasca con microorganismos'],
    chemicalNote: 'Se recomienda control integrado y asesoría técnica para aplicaciones. Respete dosis y registro ICA.', threshold: 'Monitoreo semanal del estado de hojas.'
  },
  {
    id: 'monilia', name: 'Moniliasis del cacao', sci: 'Moniliophthora roreri', type: 'hongo', icon: '🍫', crops: 'Cacao',
    symptoms: 'Manchas y deformaciones en el fruto, cubierto con polvo blanco-cremoso.',
    cultural: ['Remoción semanal de frutos enfermos', 'Podas y sombra regulada', 'Clones tolerantes'], biological: ['Hongos antagonistas (Trichoderma) bajo asesoría'],
    chemicalNote: 'El control cultural es el eje del manejo; uso de fungicidas solo como complemento y con registro ICA.', threshold: 'Evalúe semanalmente.'
  },
  {
    id: 'antracnosis-frijol', name: 'Antracnosis del fríjol', sci: 'Colletotrichum lindemuthianum', type: 'hongo', icon: '🫘', crops: 'Fríjol',
    symptoms: 'Manchas hundidas oscuras en vainas y venas de las hojas.',
    cultural: ['Semilla certificada', 'Rotación', 'Evitar labores con follaje mojado'], biological: ['Uso de variedades resistentes'],
    chemicalNote: 'Aplicación foliar solo con síntomas y clima favorable, con productos registrados.', threshold: 'Aparece con alta humedad y temperaturas frescas.'
  },
  {
    id: 'mion', name: 'Salivazo o mión de los pastos', sci: 'Aeneolamia spp.', type: 'insecto', icon: '🫧', crops: 'Pastos (Brachiaria, estrella)',
    symptoms: 'Espuma blanca en la base de los tallos; hojas amarillas y quemadas.',
    cultural: ['Usar pastos tolerantes (B. brizantha Marandú o Xaraés)', 'Pastoreo oportuno para exponer las ninfas', 'Manejo del rastrojo'],
    biological: ['Hongo Metarhizium anisopliae'], chemicalNote: 'Aplicar solo con alta densidad de adultos tras las primeras lluvias, con asesoría técnica.', threshold: 'Más de 20 ninfas por m².'
  },
  {
    id: 'def-n', name: 'Deficiencia de nitrógeno (N)', sci: '—', type: 'deficiencia', icon: '🟡', crops: 'Cualquiera',
    symptoms: 'Amarillamiento uniforme de las hojas más viejas, crecimiento lento.',
    cultural: ['Abonos orgánicos y compost', 'Leguminosas en rotación', 'Fraccionar la urea'], biological: ['Bioinsumos fijadores de nitrógeno'], chemicalNote: 'Corrija con análisis foliar/suelo.', threshold: 'Confirmar con análisis.'
  },
  {
    id: 'def-p', name: 'Deficiencia de fósforo (P)', sci: '—', type: 'deficiencia', icon: '🟣', crops: 'Cualquiera',
    symptoms: 'Tonos morados o rojizos en hojas viejas y desarrollo radicular pobre.',
    cultural: ['Enmienda del pH', 'Materia orgánica', 'Aplicar fósforo cerca de la raíz'], biological: ['Micorrizas'], chemicalNote: 'Corrija con análisis de suelo.', threshold: 'Común en suelos ácidos andinos.'
  },
  {
    id: 'def-k', name: 'Deficiencia de potasio (K)', sci: '—', type: 'deficiencia', icon: '🟠', crops: 'Cualquiera',
    symptoms: 'Bordes quemados de hojas viejas y frutos pequeños.',
    cultural: ['Cenizas y compost', 'Fertilización balanceada'], biological: [], chemicalNote: 'Corrija con análisis.', threshold: 'Muy importante en plátano y papa.'
  }
];

export const getPest = (id: string) => PESTS.find((p) => p.id === id);
