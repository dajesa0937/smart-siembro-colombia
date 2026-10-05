import { useState, type ReactNode } from 'react';
import { back, go } from '../lib/router';
import { useOnline } from '../lib/online';
import { MONTHS, evaluateCrop, type MonthStatus } from '../lib/engine';
import type { Crop, Finca } from '../lib/types';
import { PHOTOS } from '../data/photos';

export function NetBadge() {
  const on = useOnline();
  return <span className={'netbadge' + (on ? '' : ' off')}>{on ? '● En línea' : '○ Sin conexión'}</span>;
}

export function TopBar({ title, backBtn = true, right }: { title: string; backBtn?: boolean; right?: ReactNode }) {
  return (
    <div className="topbar">
      {backBtn && <button className="iconbtn" aria-label="Volver" onClick={back}>←</button>}
      <h1>{title}</h1>
      {right}
      <NetBadge />
    </div>
  );
}

const NAV = [
  { to: '/', icon: '🏠', label: 'Inicio' },
  { to: '/cultivos', icon: '🌱', label: 'Cultivos' },
  { to: '/ganaderia', icon: '🐄', label: 'Ganadería' },
  { to: '/finanzas', icon: '💰', label: 'Finanzas' },
  { to: '/mas', icon: '⋯', label: 'Más' }
];
export function BottomNav({ path }: { path: string }) {
  const active = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));
  return (
    <nav className="nav" aria-label="Principal">
      {NAV.map((n) => (
        <a key={n.to} href={'#' + n.to} className={active(n.to) ? 'on' : ''}><span>{n.icon}</span>{n.label}</a>
      ))}
    </nav>
  );
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: [T, string][] }) {
  return (
    <div className="tabs" role="tablist">
      {items.map(([k, l]) => (
        <button key={k} role="tab" aria-selected={value === k} className={'tab' + (value === k ? ' on' : '')} onClick={() => onChange(k)}>{l}</button>
      ))}
    </div>
  );
}

export function Item({ icon, title, sub, right, to }: { icon: ReactNode; title: ReactNode; sub?: ReactNode; right?: ReactNode; to?: string }) {
  return (
    <div className="item" role={to ? 'link' : undefined} tabIndex={to ? 0 : undefined} onClick={() => to && go(to)} onKeyDown={(e) => e.key === 'Enter' && to && go(to)}>
      <div className="ico">{icon}</div>
      <div className="grow"><b>{title}</b>{sub && <div className="mute small">{sub}</div>}</div>
      {right}{to && !right && <span className="chev">›</span>}
    </div>
  );
}

/** Foto real si existe offline; si no, ilustración (emoji) como respaldo. */
export function Thumb({ kind, id, icon, size = 'md' }: { kind: keyof typeof PHOTOS; id: string; icon: string; size?: 'md' | 'lg' }) {
  const [bad, setBad] = useState(false);
  const has = PHOTOS[kind].includes(id) && !bad;
  return (
    <div className={'ico' + (size === 'lg' ? ' lg' : '')} style={has ? { padding: 0, overflow: 'hidden' } : undefined}>
      {has ? <img src={`/img/${kind}/${id}.jpg`} alt="" loading="lazy" onError={() => setBad(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', padding: 0, border: 0 }} /> : icon}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="f">{label}</label>{children}</div>;
}

export function Tip({ icon = '💡', title, children }: { icon?: string; title: string; children: ReactNode }) {
  return <div className="tip"><div>{icon}</div><div><b>{title}</b>{children}</div></div>;
}

export function CalendarStrip({ cal, nowMonth }: { cal: MonthStatus[]; nowMonth?: number }) {
  return (
    <>
      <div className="cal" role="img" aria-label="Calendario de siembra por mes">
        {MONTHS.map((m) => <div key={m}>{m}</div>)}
        {cal.map((s, i) => <i key={i} className={'i-' + s + (i === nowMonth ? ' now' : '')} title={MONTHS[i] + ': ' + s} />)}
      </div>
      <div className="legend"><span className="l-ideal">Siembra ideal</span><span className="l-posible">Siembra posible</span><span className="l-no">No recomendado</span></div>
    </>
  );
}

export function Donut({ parts: all }: { parts: { label: string; value: number }[] }) {
  const parts = all.filter((p) => p.value > 0);
  const colors = ['#2e5fbf', '#3cb371', '#32a8c4', '#f0a030', '#8e9aa6'];
  const total = parts.reduce((a, b) => a + b.value, 0) || 1;
  let acc = 0;
  const stops = parts.map((p, i) => { const a = (acc / total) * 100; acc += p.value; return `${colors[i % colors.length]} ${a}% ${(acc / total) * 100}%`; }).join(',');
  return (
    <div className="donutwrap">
      <div className="donut" style={{ background: `conic-gradient(${stops})` }} role="img" aria-label="Distribución de costos" />
      <div className="dleg">{parts.map((p, i) => <div key={p.label}><i style={{ background: colors[i % colors.length] }} />{p.label}<b>{Math.round((p.value / total) * 100)}%</b></div>)}</div>
    </div>
  );
}

export const verdictBadge = (v: string) => {
  switch (v) {
    case 'muy-recomendado': return <span className="badge">Muy recomendado</span>;
    case 'recomendado': return <span className="badge">Recomendado</span>;
    case 'condicionado': return <span className="badge amber">Con condiciones</span>;
    default: return <span className="badge red">No sembrar</span>;
  }
};

export const Disclaimer = () => (
  <p className="disclaimer">Información orientativa basada en referencias técnicas (FAO, Agrosavia, IDEAM, IGAC, universidades). No reemplaza la asesoría de un ingeniero agrónomo, el análisis de suelo ni la etiqueta de los productos registrados ante el ICA.</p>
);

/** Aviso en cualquier pantalla donde se elige un cultivo: no sembrar / con condiciones / baja rentabilidad. */
export function CropWarning({ crop, finca }: { crop: Crop; finca: Finca }) {
  const e = evaluateCrop(crop, finca);
  if (e.verdict === 'no-recomendado') {
    return (
      <div className="card alert rojo" role="alert">
        <b>⛔ No se recomienda sembrar {crop.name.toLowerCase()} en su finca</b>
        <ul className="clean small">{e.reasons.slice(0, 4).map((r, i) => <li key={i}>{r}</li>)}</ul>
        <a className="link" href={'#/cultivos'}>Ver cultivos que sí le convienen</a>
      </div>
    );
  }
  if (e.verdict === 'condicionado') {
    return <div className="card alert" role="alert"><b>⚠ {crop.name}: siembre solo con precauciones</b><ul className="clean small">{e.reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}</ul></div>;
  }
  return null;
}
