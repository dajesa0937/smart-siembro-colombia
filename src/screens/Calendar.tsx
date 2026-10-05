import { useState } from 'react';
import { useStore } from '../lib/store';
import { CalendarStrip, CropWarning, Disclaimer, Tabs, Tip, TopBar } from '../components/ui';
import { CROPS, getCrop } from '../data/crops';
import { MONTHS, MONTHS_LONG, REGIME_LABEL, fincaAlerts, rainIndex, rankCrops, sowingCalendar, sowingWindows, tempFromAlt } from '../lib/engine';
import { useHistorical } from '../lib/hooks';
import { fdate } from '../lib/format';

type Tab = 'cultivo' | 'clima' | 'region';

export function Calendar() {
  const { finca } = useStore();
  const { h, refresh, loading, online } = useHistorical(finca);
  const [tab, setTab] = useState<Tab>('cultivo');
  const [cropId, setCropId] = useState(() => rankCrops(finca).viable[0]?.crop.id ?? 'maiz');
  const crop = getCrop(cropId) ?? CROPS[0];
  const cal = sowingCalendar(crop, finca, h?.index);
  const wins = sowingWindows(cal);
  const now = new Date().getMonth();
  const idx = rainIndex(finca, h?.index);
  const { viable } = rankCrops(finca);

  return (
    <>
      <TopBar title="¿Cuándo sembrar?" />
      <div className="page">
        <Tabs value={tab} onChange={setTab} items={[['cultivo', 'Por cultivo'], ['clima', 'Por clima'], ['region', 'Por región']]} />
        {tab === 'cultivo' && (
          <>
            <select value={cropId} onChange={(e) => setCropId(e.target.value)} aria-label="Cultivo">{CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
            <div style={{ marginTop: 12 }}><CropWarning crop={crop} finca={finca} /></div>
            <div className="card">
              <h2>Calendario de siembra</h2>
              <div className="mute small">Zona: {finca.name} ({finca.alt} msnm)</div>
              <CalendarStrip cal={cal} nowMonth={now} />
            </div>
            <div className="card" style={{ background: 'var(--g100)' }}>
              <b>Mejor época para sembrar {crop.name.toLowerCase()}:</b>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--g900)', marginTop: 4 }}>{wins.length ? wins.join(' · ') : 'Requiere riego en todo el año'}</div>
              <div className="mute small">Ciclo: {crop.cycleDays[0] === crop.cycleDays[1] ? 'perenne (producción anual)' : `${crop.cycleDays[0]}–${crop.cycleDays[1]} días`}</div>
            </div>
            <Tip title="Consejo">Evite sembrar en épocas de heladas o lluvias intensas para lograr mejor germinación y rendimiento. {crop.tip}</Tip>
          </>
        )}
        {tab === 'clima' && (
          <>
            <div className="card">
              <h2>Lluvia por mes</h2>
              <div className="mute small">{h ? `Histórico real (últimos ${h.years} años, Open-Meteo) · ${fdate(h.fetchedAt)}` : 'Referencia regional (sin histórico descargado)'}</div>
              <div className="bars">{idx.map((v, i) => <div key={i} className={i === now ? 'now' : ''} style={{ height: Math.max(4, v * 100) + '%' }} title={h ? `${MONTHS[i]}: ${h.mm[i]} mm` : MONTHS[i]} />)}</div>
              <div className="barlbl">{MONTHS.map((m) => <span key={m}>{m[0]}</span>)}</div>
              {h && <div className="mute small" style={{ marginTop: 6 }}>Total anual ≈ {h.mm.reduce((a, b) => a + b, 0).toLocaleString('es-CO')} mm</div>}
              <button className="btn ghost small" style={{ marginTop: 10 }} disabled={!online || loading} onClick={refresh}>{loading ? 'Descargando…' : online ? 'Descargar histórico de 5 años' : 'Requiere conexión'}</button>
            </div>
            <div className="card">
              <h2>Clima de su finca</h2>
              <div className="grid2">
                <div className="kpi"><small>Temperatura media</small><b>{tempFromAlt(finca.alt)} °C</b></div>
                <div className="kpi"><small>Lluvia anual</small><b>{finca.rain.toLocaleString('es-CO')} mm</b></div>
              </div>
              <p className="mute small">{REGIME_LABEL[finca.regime]}</p>
            </div>
            <h3>Riesgos del mes ({MONTHS_LONG[now]})</h3>
            {fincaAlerts(finca).map((a, i) => <div key={i} className={'card alert ' + a.level}><b>{a.title}</b><span className="small">{a.text}</span></div>)}
          </>
        )}
        {tab === 'region' && (
          <div className="card">
            <h2>Qué sembrar mes a mes</h2>
            <div className="mute small">Cultivos viables para {finca.alt} msnm y {finca.rain} mm/año.</div>
            <div className="heat" style={{ marginTop: 10 }}>
              <span />{MONTHS.map((m) => <span key={m} style={{ textAlign: 'center' }}>{m[0]}</span>)}
              {viable.slice(0, 10).map((e) => {
                const c = sowingCalendar(e.crop, finca, h?.index);
                return [<span key={e.crop.id + 'n'} style={{ fontSize: 11 }}>{e.crop.icon} {e.crop.name.split(' ')[0]}</span>, ...c.map((s, i) => <i key={e.crop.id + i} className={'i-' + s} />)];
              })}
            </div>
            <div className="legend" style={{ marginTop: 10 }}><span className="l-ideal">Ideal</span><span className="l-posible">Posible</span><span className="l-no">No recomendado</span></div>
          </div>
        )}
        <Disclaimer />
      </div>
    </>
  );
}
