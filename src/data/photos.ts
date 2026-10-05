/**
 * Fotos reales disponibles offline. Para agregar una foto: copie el archivo JPG a public/img/<tipo>/<id>.jpg
 * (tipo = cultivos | pastos | plagas) y agregue el id aquí. El service worker la precachea al compilar.
 * Use solo fotos propias o con licencia abierta (Wikimedia Commons CC, Agrosavia/ICA con permiso) y anote
 * la atribución en docs/FUENTES.md.
 */
export const PHOTOS: { cultivos: string[]; pastos: string[]; plagas: string[] } = {
  cultivos: [],
  pastos: [],
  plagas: []
};
export const HERO_IMG = '/img/hero-ganaderia.jpg';
export const WELCOME_IMG = '/img/hero-maiz.jpg';
