import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { CropWarning, Disclaimer, Donut, Item, Tabs, TopBar } from '../components/ui';
import { CROPS, getCrop } from '../data/crops';
import { calculate, evaluateCrop, rankCrops } from '../lib/engine';
import { cop, copM, fdate, num, pct } from '../lib/format';
import { go } from '../lib/router';

const queryCrop = () => new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('c');

export function Finance() {
  const { finca, addHistory, priceOverrides } = useStore();
  const [tab, setTab] = useState<'cultivo' | 'general'>('cultivo');
  const [cropId, setCropId] = useState(() => queryCrop() ?? rankCrops(finca).viable[0]?.crop.id ?? 'maiz');
  const crop = getCrop(cropId) ?? CROPS[0];
  const ev = evaluateCrop(crop, finca);
  const [area, setArea] = useState(finca.areaHa);
  const [yld, setYld] = useState(Math.round(ev.expectedYield * 10) / 10);
  const [price, setPrice] = useState(priceOverrides[cropId] ?? crop.priceCop);
  const [scale, setScale] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => { setYld(Math.round(evaluateCrop(crop, finca).expectedYield * 10) / 10); setPrice(priceOverrides[crop.id] ?? crop.priceCop); setDone(false); }, [cropId]); // eslint-disable-line react-hooks/exhaustive-deps
  const input = { cropId, areaHa: area, yieldTHa: yld, priceCopT: price, costScale: scale };
  const r = calculate(crop, input);

  return (
    <>
      <TopBar title="Calculadora integral" backBtn={false} />
      <div className="page">
        <Tabs value={tab} onChange={setTab} items={[['cultivo', 'Cultivo'], ['general', 'General']]} />
        {tab === 'general' ? (
          <>
            <div className="card"><h2>Comparar cultivos para su finca</h2><p className="small mute">Utilidad anual por hectárea con los precios de referencia (incluye la inversión inicial de cultivos permanentes repartida en 10 años; editable en cada cálculo).</p></div>
            {rankCrops(finca).viable.map((e) => <Item key={e.crop.id} icon={e.crop.icon} title={e.crop.name} sub={`Costos ${copM(e.cost)} · Ingresos ${copM(e.revenue)} · Utilidad ${copM(e.netAmortized)}/ha/año`} right={<span className={'badge ' + (e.marginAmortized < 0.1 ? 'amber' : '')}>{pct(e.marginAmortized)}</span>} to={'/finanzas?c=' + e.crop.id} />)}
            <button className="btn ghost" onClick={() => go('/resumen')}>Ver resumen de mi finca</button>
          </>
        ) : (
          <>
            <select value={cropId} onChange={(e) => setCropId(e.target.value)} style={{ marginBottom: 6 }} aria-label="Cultivo">{CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
            <CropWarning crop={crop} finca={finca} />
            {r.net < 0 && <div className="card alert rojo" role="alert"><b>⛔ Con estos datos hay pérdida</b><span className="small">Los ingresos no cubren los costos. Revise rendimiento, precio y costos antes de sembrar.</span></div>}
            <div className="card">
              <h2>Datos de su terreno</h2>
              <div className="grid2">
                <div><label className="f">Área (ha)</label><input type="number" step="0.1" min="0" inputMode="decimal" value={area} onChange={(e) => setArea(Number(e.target.value) || 0)} /></div>
                <div><label className="f">Rendimiento ({crop.yieldUnit.split('/')[0]}/ha)</label><input type="number" step="0.1" min="0" inputMode="decimal" value={yld} onChange={(e) => setYld(Number(e.target.value) || 0)} /></div>
                <div><label className="f">Precio de venta (COP/t)</label><input type="number" step="10000" min="0" inputMode="numeric" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} /></div>
                <div><label className="f">Ajuste de costos (×)</label><input type="number" step="0.05" min="0.3" max="3" inputMode="decimal" value={scale} onChange={(e) => setScale(Number(e.target.value) || 1)} /></div>
              </div>
              <p className="mute small">Precios y costos de referencia ({copM(crop.priceCop)}/t); actualícelos con su realidad local (SIPSA-DANE, plaza, cooperativa).</p>
            </div>
            <div className="card">
              <h2>Resultados estimados</h2>
              <div className="grid2">
                <div className="kpi"><small>Producción total</small><b>{num(r.production)} t</b></div>
                <div className="kpi"><small>Ingreso bruto</small><b>{cop(r.revenue)}</b></div>
                <div className="kpi red"><small>Costos estimados</small><b>{cop(r.cost)}</b></div>
                <div className={'kpi ' + (r.net >= 0 ? 'green' : 'red')}><small>Utilidad neta · {pct(r.margin)}</small><b>{cop(r.net)}</b></div>
              </div>
              <div style={{ marginTop: 14 }}><Donut parts={r.breakdown} /></div>
              {crop.establishment > 0 && <p className="mute small">Además requiere inversión inicial de ~{copM(crop.establishment * area)} para {num(area)} ha y {crop.yearsToProd ? `${crop.yearsToProd} año(s) sin ingresos` : 'poco tiempo hasta producir'}.</p>}
              <button className="btn" onClick={() => { addHistory({ cropId, input, result: r }); setDone(true); }}>{done ? '✓ Guardado en mi resumen' : 'Guardar en mi resumen'}</button>
              {done && <button className="btn ghost" style={{ marginTop: 8 }} onClick={() => go('/resumen')}>Ver resumen financiero</button>}
            </div>
          </>
        )}
        <Disclaimer />
      </div>
    </>
  );
}

export function Summary() {
  const { history, clearHistory } = useStore();
  const last = history[0];
  const crop = last ? getCrop(last.cropId) : undefined;
  return (
    <>
      <TopBar title="Mi finca — Resumen financiero" />
      <div className="page">
        {!last || !crop ? <div className="card">Aún no ha guardado cálculos. Use la calculadora y pulse “Guardar en mi resumen”.<button className="btn" style={{ marginTop: 10 }} onClick={() => go('/finanzas')}>Ir a la calculadora</button></div> : (
          <>
            <div className="card">
              <h2>{crop.icon} {crop.name} · {num(last.input.areaHa)} ha</h2>
              <div className="grid2">
                <div className="kpi green"><small>Ingresos estimados</small><b>{cop(last.result.revenue)}</b></div>
                <div className="kpi red"><small>Costos estimados</small><b>{cop(last.result.cost)}</b></div>
                <div className="kpi"><small>Utilidad neta</small><b>{cop(last.result.net)}</b></div>
                <div className="kpi"><small>Margen de rentabilidad</small><b>{pct(last.result.margin)}</b></div>
              </div>
              <h3>Detalle de costos</h3>
              {last.result.breakdown.map((b) => <div key={b.label} className="row between small" style={{ padding: '5px 0', borderBottom: '1px solid var(--line)' }}><span>{b.label}</span><b>{cop(b.value)}</b></div>)}
              <div style={{ marginTop: 14 }}><Donut parts={last.result.breakdown} /></div>
            </div>
            <h3>Historial</h3>
            {history.map((h) => { const c = getCrop(h.cropId); return <Item key={h.id} icon={c?.icon ?? '🌱'} title={`${c?.name} · ${num(h.input.areaHa)} ha`} sub={`${fdate(h.date)} · utilidad ${cop(h.result.net)}`} />; })}
            <button className="btn ghost danger" style={{ marginTop: 8 }} onClick={clearHistory}>Borrar historial</button>
          </>
        )}
        <Disclaimer />
      </div>
    </>
  );
}
