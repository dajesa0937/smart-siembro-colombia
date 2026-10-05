import { useState } from 'react';
import { useStore } from '../lib/store';
import { Disclaimer, Tabs, Thumb, TopBar, verdictBadge } from '../components/ui';
import { rankCrops } from '../lib/engine';
import { go } from '../lib/router';
import { copM, pct } from '../lib/format';
import type { Texture } from '../lib/types';

export function Crops() {
  const { finca } = useStore();
  const [tab, setTab] = useState<'zona' | 'suelo'>('zona');
  const [tex, setTex] = useState<Texture>(finca.texture);
  const [all, setAll] = useState(false);
  const { viable, notRecommended } = rankCrops(finca, tab === 'suelo' ? { texture: tex } : {});
  const shown = all ? viable : viable.slice(0, 5);

  return (
    <>
      <TopBar title="Cultivos más rentables" backBtn={false} />
      <div className="page">
        <Tabs value={tab} onChange={setTab} items={[['zona', 'Por zona'], ['suelo', 'Por tipo de suelo']]} />
        {tab === 'suelo' && (
          <select value={tex} onChange={(e) => setTex(e.target.value as Texture)} style={{ marginBottom: 12 }}>
            <option value="arenoso">Suelo arenoso</option><option value="franco">Suelo franco</option><option value="arcilloso">Suelo arcilloso</option>
          </select>
        )}
        <h2>{all ? 'Todos los cultivos viables' : 'Top 5 cultivos más rentables'}</h2>
        <div className="mute small" style={{ marginBottom: 10 }}>En su región: {finca.alt} msnm · {finca.rain} mm/año. Ordenado por rentabilidad esperada (incluye inversión inicial de los cultivos permanentes) y aptitud.</div>
        {shown.map((e, i) => (
          <div key={e.crop.id} className="item" role="link" tabIndex={0} onClick={() => go('/cultivo/' + e.crop.id)} onKeyDown={(k) => k.key === 'Enter' && go('/cultivo/' + e.crop.id)}>
            <div className="badge" style={{ minWidth: 24, textAlign: 'center' }}>{i + 1}</div>
            <Thumb kind="cultivos" id={e.crop.id} icon={e.crop.icon} />
            <div className="grow">
              <b>{e.crop.name}</b>
              <div className="small mute">Rentabilidad: {pct(e.marginAmortized)} · Ingreso/ha: {copM(e.revenue)}</div>
              <div className="small mute">Utilidad/ha/año: {copM(e.netAmortized)} · Aptitud {e.score}/100</div>
            </div>
            <div style={{ textAlign: 'right' }}>{verdictBadge(e.verdict)}</div>
          </div>
        ))}
        {!viable.length && <div className="card">Ningún cultivo es viable con estos datos. Revise altitud, pH y drenaje en “Mi finca”.</div>}
        {viable.length > 5 && <button className="btn" onClick={() => setAll(!all)}>{all ? 'Ver solo el top 5' : 'Ver análisis completo'}</button>}
        <div className="tip" style={{ marginTop: 12 }}><div>✅</div><div><b>Recomendación</b>Use semillas certificadas y verifique mercado y precio antes de sembrar áreas grandes.</div></div>

        <h2 style={{ marginTop: 22 }}>🚫 No recomendados para su finca</h2>
        {notRecommended.map((e) => (
          <div key={e.crop.id} className="card alert rojo" onClick={() => go('/cultivo/' + e.crop.id)} style={{ cursor: 'pointer' }}>
            <b>{e.crop.icon} {e.crop.name}</b>
            <ul className="clean small">{e.reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        ))}
        {!notRecommended.length && <p className="mute small">Todos los cultivos del catálogo son viables (algunos con condiciones).</p>}
        <p className="mute small">Alternativa de ingreso: los precios son de referencia y cambian; actualícelos en la calculadora.</p>
        <Disclaimer />
      </div>
    </>
  );
}
