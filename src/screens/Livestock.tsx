import { useState } from 'react';
import { useStore } from '../lib/store';
import { Disclaimer, Item, Tabs, Thumb, TopBar } from '../components/ui';
import { LIVESTOCK_LABEL, rankPastures } from '../lib/engine';
import { getPasture } from '../data/pastures';
import { getPest } from '../data/pests';
import { go } from '../lib/router';
import { num } from '../lib/format';
import type { Livestock as L } from '../lib/types';

export function Livestock() {
  const { finca, setFinca } = useStore();
  const [tab, setTab] = useState<'pasto' | 'ganado'>('pasto');
  const [area, setArea] = useState(finca.areaHa);
  const { viable, rejected } = rankPastures(finca, finca.livestock, area);
  const best = viable[0];
  const supplyUgDay = best ? best.carryingUgHa * area : 0;
  const balance = best ? best.animals - finca.heads : 0;

  return (
    <>
      <TopBar title="Pastoreo y ganadería" backBtn={false} />
      <div className="page">
        <Tabs value={tab} onChange={setTab} items={[['pasto', 'Pasto'], ['ganado', 'Ganado']]} />
        <div className="grid2" style={{ marginBottom: 12 }}>
          <select value={finca.livestock} onChange={(e) => setFinca({ livestock: e.target.value as L })} aria-label="Tipo de ganado">{Object.entries(LIVESTOCK_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <input type="number" min="0.1" step="0.5" value={area} onChange={(e) => setArea(Number(e.target.value) || 0)} aria-label="Área en hectáreas" placeholder="Área (ha)" />
        </div>
        {tab === 'pasto' && (
          <>
            <h2>Pasto recomendado</h2>
            {best ? (
              <div className="card" onClick={() => go('/pasto/' + best.pasture.id)} style={{ cursor: 'pointer' }}>
                <div className="row"><Thumb kind="pastos" id={best.pasture.id} icon={best.pasture.icon} size="lg" />
                  <div className="grow"><b>{best.pasture.name}</b><div className="small mute"><i>{best.pasture.sci}</i></div>
                    <ul className="clean small"><li>{num(best.pasture.dmTHaYear[0], 0)}–{num(best.pasture.dmTHaYear[1], 0)} t MS/ha/año · proteína {best.pasture.proteinPct[0]}–{best.pasture.proteinPct[1]}%</li>{best.pasture.traits.slice(0, 2).map((t) => <li key={t}>{t}</li>)}</ul></div></div>
              </div>
            ) : <div className="card alert rojo">No hay un pasto del catálogo que se ajuste a esta altitud/drenaje. Consulte a la UMATA.</div>}
            {best && (
              <>
                <h3>Manejo y rotación</h3>
                <Item icon="🔄" title="Rotación de pastoreo" sub={`cada ${best.pasture.restDays[0]}–${best.pasture.restDays[1]} días de descanso`} />
                <Item icon="📏" title="Altura de pastoreo" sub={best.pasture.grazeHeightCm} />
                <Item icon="🧮" title="Capacidad de carga estimada" sub={`≈ ${best.carryingUgHa} UGG/ha (uso 50% del forraje) · ${best.animals} animales de 450 kg en ${num(area)} ha`} />
                <div className="tip"><div>🐄</div><div><b>Consejo ganadero</b>Mantenga el pasto limpio y con sombra natural; mejora el bienestar animal y la producción de leche/carne.</div></div>
              </>
            )}
            <h3>Otras opciones adaptadas</h3>
            {viable.slice(1, 8).map((e) => <Item key={e.pasture.id} icon={e.pasture.icon} title={e.pasture.name} sub={`${e.pasture.dmTHaYear[0]}–${e.pasture.dmTHaYear[1]} t MS/ha/año · aptitud ${e.score}/100${e.reasons.length ? ' · ' + e.reasons[0] : ''}`} to={'/pasto/' + e.pasture.id} />)}
            {rejected.length > 0 && <>
              <h3>🚫 No adecuados para su zona</h3>
              {rejected.map((e) => <div key={e.pasture.id} className="card alert rojo"><b>{e.pasture.name}</b><div className="small">{e.reasons[0]}</div></div>)}
            </>}
          </>
        )}
        {tab === 'ganado' && (
          <>
            <div className="card">
              <h2>Balance forraje – animales</h2>
              <div className="grid2">
                <div className="kpi"><small>Animales que sostiene el potrero</small><b>{best ? best.animals : 0}</b></div>
                <div className="kpi"><small>Animales que tiene</small><b>{finca.heads}</b></div>
              </div>
              <label className="f">Animales actuales (450 kg equivalentes)</label>
              <input type="number" min="0" value={finca.heads} onChange={(e) => setFinca({ heads: Number(e.target.value) || 0 })} />
              {best && <div className={'card alert ' + (balance >= 0 ? 'verde' : 'rojo')} style={{ marginTop: 10 }}>
                {balance >= 0 ? <b>Carga adecuada: hay margen para {balance} animales más.</b> : <><b>Sobrecarga de {-balance} animales.</b><span className="small">Riesgo de sobrepastoreo y degradación. Aumente el área, suplemente con ensilaje/banco de proteína o reduzca carga.</span></>}
                <span className="small">Demanda: {num(finca.heads * 11.25)} kg MS/día · Oferta aprovechable: {num(supplyUgDay * 11.25)} kg MS/día</span>
              </div>}
            </div>
            <div className="card"><h2>Reserva para verano</h2><p className="small">En época seca la producción de pasto cae. Prepare ensilaje de maíz forrajero, heno o banco de proteína (matarratón, botón de oro, leguminosas) con anticipación.</p><button className="btn ghost small" onClick={() => go('/cultivo/maiz-forrajero')}>Ver maíz forrajero</button></div>
            <h3>Plagas y problemas frecuentes</h3>
            {(['mion'] as const).map((pid) => { const p = getPest(pid)!; return <Item key={pid} icon={p.icon} title={p.name} sub={p.sci} to={'/plaga/' + pid} />; })}
          </>
        )}
        <Disclaimer />
      </div>
    </>
  );
}

export function PastureDetail({ id }: { id: string }) {
  const { finca } = useStore();
  const p = getPasture(id);
  if (!p) return <><TopBar title="Pasto" /><div className="page">No encontrado.</div></>;
  const ev = rankPastures(finca, finca.livestock, finca.areaHa);
  const e = [...ev.viable, ...ev.rejected].find((x) => x.pasture.id === id)!;
  return (
    <>
      <TopBar title={p.name.split(' cv.')[0]} />
      <div className="page">
        <div className="row" style={{ marginBottom: 12 }}><Thumb kind="pastos" id={p.id} icon={p.icon} size="lg" /><div><b>{p.name}</b><div className="mute small"><i>{p.sci}</i></div></div></div>
        {e.reasons.length > 0 && <div className={'card alert' + (e.ok ? '' : ' rojo')}><b>{e.ok ? 'A tener en cuenta en su finca' : 'No recomendado en su finca'}</b><ul className="clean small">{e.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul></div>}
        <div className="card"><h2>Ficha técnica</h2><ul className="clean small">
          <li>Altitud: {p.altOpt[0]}–{p.altOpt[1]} m (hasta {p.altAbs[1]} m) · lluvia mínima {p.rainMin} mm/año</li>
          <li>Producción: {p.dmTHaYear[0]}–{p.dmTHaYear[1]} t MS/ha/año · proteína {p.proteinPct[0]}–{p.proteinPct[1]}%</li>
          <li>Exigencia de fertilidad: {p.fertility} · tolera acidez: {p.acidTolerance} · tolera encharcamiento: {p.waterlogTolerance}</li>
          <li>Descanso entre pastoreos: {p.restDays[0]}–{p.restDays[1]} días · {p.grazeHeightCm}</li>
          <li>Siembra: {p.seedKgHa}</li>
          <li>Ganado: {p.species.map((s) => LIVESTOCK_LABEL[s]).join(', ')}</li></ul></div>
        <div className="card"><h2>Características</h2><ul className="clean small">{p.traits.map((t) => <li key={t}>{t}</li>)}</ul></div>
        <div className="card"><h2>Siembra y manejo</h2><ol className="steps">{p.management.map((t) => <li key={t}>{t}</li>)}</ol></div>
        {p.pvc && <div className="card"><h2>Valor cultural (VC)</h2><p className="small">VC = %pureza × %germinación ÷ 100. Con {p.pvc} puntos de VC y una semilla con VC 75%, la dosis es {Math.round((p.pvc / 75) * 10) / 10} kg/ha; con VC 60% serían {Math.round((p.pvc / 60) * 10) / 10} kg/ha. Cotice por costo del área total, no por kg de semilla.</p></div>}
        <p className="mute small">Fuente: {p.source}</p>
        <Disclaimer />
      </div>
    </>
  );
}
