export const cop = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');
export const copM = (n: number) => (Math.abs(n) >= 1_000_000 ? '$' + (n / 1_000_000).toLocaleString('es-CO', { maximumFractionDigits: 1 }) + ' M' : cop(n));
export const num = (n: number, d = 1) => n.toLocaleString('es-CO', { maximumFractionDigits: d });
export const pct = (n: number) => Math.round(n * 100) + '%';
export const fdate = (iso: string | null) => (iso ? new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' }) : 'Nunca');
