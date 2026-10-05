import { useEffect, useState } from 'react';

/** Router mínimo por hash (#/ruta/param): funciona offline y en cualquier hosting estático. */
const read = () => (window.location.hash.replace(/^#/, '') || '/').split('?')[0];

export function useRoute(): string[] {
  const [path, setPath] = useState(read);
  useEffect(() => {
    const h = () => { setPath(read()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  return path.split('/').filter(Boolean);
}

export const go = (to: string) => { window.location.hash = to; };
export const back = () => { if (window.history.length > 1) window.history.back(); else go('/'); };
