import { useState } from 'react';
import { useStore } from '../lib/store';
import { Disclaimer, Item, Tabs, Thumb, TopBar, verdictBadge } from '../components/ui';
import { getCrop } from '../data/crops';
import { getPest } from '../data/pests';
import { evaluateCrop, fertPlan, totalCost } from '../lib/engine';
import { copM, num, pct } from '../lib/format';

type Tab = 'resumen' | 'siembra' | 'semillas' | 'abonos' | 'plagas' | 'quimicos';

export function CropDetail({ id }: { id: string }) {
  const { finca } = useStore();
  const [tab, setTab] = useState<Tab>('resumen');
  const crop = getCrop(id);
  if (!crop) return <><TopBar title="Cultivo" /><div className="page">Cultivo no encontrado.</div></>;
  const ev = evaluateCrop(crop, finca);
  const fp = fertPlan(crop, finca);

  return (
    <>
      <TopBar title={crop.name} />
      <div className="page">
        <div className="row" style={{ marginBottom: 12 }}>
          <Thumb kind="cultivos" id={crop.id} icon={crop.icon} size="lg" />
          <div className="grow"><b style={{ fontSize: 18 }}>{crop.name}</b><div className="mute small"><i>{crop.sci}</i></div><div style={{ marginTop: 4 }}>{verdictBadge(ev.verdict)} <span className="badge gray">Aptitud {ev.score}/100</span></div></div>
        </div>
        <Tabs value={tab} onChange={setTab} items={[['resumen', 'Resumen'], ['siembra', 'Siembra'], ['semillas', 'Semillas'], ['abonos', 'Abonos'], ['plagas', 'Plagas'], ['quimicos', 'Químicos']]} />

        {tab === 'resumen' && (
          <>
            {ev.reasons.length > 0 && <div className={'card alert ' + (ev.verdict === 'no-recomendado' ? 'rojo' : '')}><b>{ev.verdict === 'no-recomendado' ? 'Por qué NO sembrarlo en su finca' : 'Condiciones a tener en cuenta'}</b><ul className="clean small">{ev.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul></div>}
            {ev.positives.length > 0 && <div className="card alert verde"><b>A su favor</b><ul className="clean small">{ev.positives.map((r, i) => <li key={i}>{r}</li>)}</ul></div>}
            <div className="card">
              <h2>Requerimientos</h2>
              <ul className="clean small">
                <li>Altitud óptima: {crop.altOpt[0]}–{crop.altOpt[1]} msnm (tolera {crop.altAbs[0]}–{crop.altAbs[1]})</li>
                <li>Lluvia óptima: {crop.rainOpt[0]}–{crop.rainOpt[1]} mm/año</li>
                <li>pH: {crop.phOpt[0]}–{crop.phOpt[1]} · Suelos: {crop.textures.join(', ')} · Drenaje: {crop.drainage.join(' o ')}</li>
                <li>Pendiente máxima recomendada: {crop.slopeMax}%</li>
                <li>Ciclo: {crop.cycleDays[0] === crop.cycleDays[1] ? 'perenne' : `${crop.cycleDays[0]}–${crop.cycleDays[1]} días`}{crop.yearsToProd ? ` · primera producción a los ${crop.yearsToProd} años` : ''}</li>
                <li>Densidad: {crop.density}</li>
              </ul>
            </div>
            <div className="card">
              <h2>Rentabilidad aproximada (por ha)</h2>
              <div className="grid2">
                <div className="kpi"><small>Rendimiento esperado</small><b>{num(ev.expectedYield)} t</b><small>{crop.yieldUnit}</small></div>
                <div className="kpi"><small>Precio de referencia</small><b>{copM(crop.priceCop)}/t</b><small>volatilidad {crop.priceVolatility}</small></div>
                <div className="kpi red"><small>Costos</small><b>{copM(totalCost(crop))}</b></div>
                <div className={'kpi ' + (ev.net >= 0 ? 'green' : 'red')}><small>Utilidad año productivo</small><b>{copM(ev.net)}</b><small>margen {pct(ev.margin)}</small></div>
              </div>
              {crop.establishment > 0 && <p className="mute small">Inversión inicial de establecimiento: {copM(crop.establishment)}/ha. {crop.yearsToProd ? `Sin ingresos los primeros ${crop.yearsToProd} año(s). ` : ''}Utilidad anual promedio a 10 años (con inversión): {copM(ev.netAmortized)}/ha ({pct(ev.marginAmortized)}).</p>}
              <button className="btn ghost small" onClick={() => (window.location.hash = '/finanzas?c=' + crop.id)}>Calcular con mis datos</button>
            </div>
            <div className="tip"><div>💡</div><div><b>Consejo</b>{crop.tip}</div></div>
          </>
        )}
        {tab === 'siembra' && (
          <div className="card"><h2>Cómo sembrar, paso a paso</h2><ol className="steps">{crop.steps.map((s, i) => <li key={i}>{s}</li>)}</ol><p className="mute small">Densidad: {crop.density}</p></div>
        )}
        {tab === 'semillas' && (
          <>
            <div className="card"><h2>Tipo de semilla</h2><p>{crop.seedType}</p></div>
            <h3>Mejores variedades</h3>
            {crop.varieties.map((v) => (
              <div key={v.name} className="card"><div className="row between"><b>{v.name}</b><span className="badge">{v.tag}</span></div><ul className="clean small">{v.traits.map((t, i) => <li key={i}>{t}</li>)}<li>Ciclo: {v.cycle}</li></ul></div>
            ))}
            <div className="tip"><div>🌱</div><div><b>Recomendación</b>Use semillas certificadas y trate la semilla con bioinoculantes para mejorar germinación y desarrollo. Verifique las variedades disponibles en su UMATA o proveedor registrado ICA.</div></div>
          </>
        )}
        {tab === 'abonos' && (
          <>
            <div className="card">
              <h2>Plan de fertilización</h2>
              <Item icon="🟫" title="Abono orgánico (compost)" sub={`${fp.organicT} t/ha — al preparar el suelo`} />
              <Item icon="🟢" title="Nitrógeno (N)" sub={`${fp.N} kg N/ha ≈ ${fp.urea} kg de urea/ha (fraccionar)`} />
              <Item icon="⚪" title="Fósforo (P₂O₅)" sub={`${fp.P2O5} kg/ha ≈ ${fp.dap} kg de DAP/ha (a la siembra)`} />
              <Item icon="🔴" title="Potasio (K₂O)" sub={`${fp.K2O} kg/ha ≈ ${fp.kcl} kg de cloruro de potasio/ha`} />
              <p className="mute small">{crop.fert.note}</p>
              {fp.limeNote && <p className="small"><b>Encalado:</b> {fp.limeNote}</p>}
            </div>
            <div className="tip"><div>♻️</div><div><b>Tips para ahorrar</b><ul className="clean small"><li>Use abonos orgánicos y biofertilizantes.</li><li>Aplique solo la dosis necesaria según análisis.</li><li>Haga análisis de suelo cada 2 años.</li></ul></div></div>
          </>
        )}
        {tab === 'plagas' && (
          <>
            {crop.pests.length ? crop.pests.map((pid) => { const p = getPest(pid); return p ? <Item key={pid} icon={p.icon} title={p.name} sub={p.sci} to={'/plaga/' + pid} /> : null; }) : <div className="card mute">Sin fichas de plagas cargadas aún para este cultivo (pendiente de la próxima versión).</div>}
            <div className="card"><b>Principio de manejo integrado</b><p className="small">Monitoree semanalmente, use variedades tolerantes, conserve enemigos naturales y aplique plaguicidas solo cuando se supere el umbral y con productos registrados ante el ICA.</p></div>
          </>
        )}
        {tab === 'quimicos' && (
          <>
            <div className="card alert rojo"><b>⛔ Cuándo NO usar químicos</b><ul className="clean small">{crop.noChem.map((t, i) => <li key={i}>{t}</li>)}<li>No aplicar cerca de nacimientos de agua, quebradas, viviendas ni cultivos orgánicos vecinos.</li><li>No aplicar con viento fuerte, calor extremo ni lluvia próxima.</li></ul></div>
            <div className="card"><b>Productos y dosis</b><p className="small">La dosis y el producto <b>deben salir de la etiqueta de un producto con registro vigente del ICA</b> y de la recomendación de un ingeniero agrónomo, según el problema confirmado en campo. Esta app no entrega dosis numéricas de plaguicidas.</p><p className="small">Siempre: use equipo de protección personal, respete el periodo de carencia y el de reingreso, haga triple lavado de envases y llévelos a los puntos de recolección (Campo Limpio).</p></div>
            <div className="card"><b>Alternativas biológicas / orgánicas</b><ul className="clean small"><li>Bioinsumos: Bacillus thuringiensis, Trichoderma, Beauveria bassiana, Metarhizium.</li><li>Cultivos trampa, barreras vivas y rotación.</li><li>Control manual y cultural de arvenses.</li></ul></div>
          </>
        )}
        <Disclaimer />
      </div>
    </>
  );
}
