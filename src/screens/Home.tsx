import { useStore } from '../lib/store';
import { Item } from '../components/ui';
import { MONTHS_LONG, fertPlan, fincaAlerts, rankCrops, rankPastures, rainIndex, sowingCalendar, sowingWindows, waterPlan, LIVESTOCK_LABEL, tempFromAlt } from '../lib/engine';
import { useWeather, useHistorical } from '../lib/hooks';
import { weatherLabel } from '../lib/climate';
import { go } from '../lib/router';
import { HERO_IMG } from '../data/photos';
import { NetBadge } from '../components/ui';
import { num } from '../lib/format';
import { getPlace } from '../data/places';

export function Home() {
  const { finca, lastSync } = useStore();
  const { w } = useWeather(finca);
  const { h } = useHistorical(finca);
  const now = new Date();
  const { viable } = rankCrops(finca);
  const top = viable[0];
  const alerts = fincaAlerts(finca, now).filter((a) => a.level !== 'verde');
  const cal = top ? sowingCalendar(top.crop, finca, h?.index) : [];
  const win = sowingWindows(cal)[0];
  const wp = top ? waterPlan(top.crop, finca, now.getMonth()) : null;
  const fp = top ? fertPlan(top.crop, finca) : null;
  const past = rankPastures(finca, finca.livestock, finca.areaHa).viable[0];
  const wl = w ? weatherLabel(w.code) : null;
  const rainNow = rainIndex(finca, h?.index)[now.getMonth()];
  const nowStatus = top ? cal[now.getMonth()] : 'no';

  return (
    <>
      <div className="hero" style={{ ['--img' as string]: `url(${HERO_IMG})` }}>
        <div className="row between"><span style={{ fontWeight: 700 }}>🌿 Smart Siembro</span><NetBadge /></div>
        <h2 style={{ marginTop: 16 }}>¡Hola!</h2>
        <div>Aquí tiene las recomendaciones para esta semana.</div>
      </div>
      <div className="card herocard row between" onClick={() => go('/finca')} style={{ cursor: 'pointer' }}>
        <div className="grow">
          <div className="small mute">📍 {finca.name}</div>
          <b>{getPlace(finca.placeId)?.name ?? 'Sin municipio'}</b><span className="small mute"> · {getPlace(finca.placeId)?.dept}</span>
          <div className="small mute">{finca.alt} msnm · {num(finca.areaHa)} ha</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 26, fontWeight: 700 }}>{wl ? wl.icon : '🌡️'} {w ? Math.round(w.temp) : Math.round(tempFromAlt(finca.alt))}°C</div>
          <div className="small mute">{wl ? wl.text : 'Estimado por altitud'}{w ? ` · ${w.precip7d} mm/7d` : ''}</div>
        </div>
      </div>
      <div className="page" style={{ paddingTop: 2 }}>
        {alerts.map((a, i) => (
          <div key={i} className={'card alert ' + a.level}><b>⚠ {a.title}</b><span className="small">{a.text}</span></div>
        ))}
        <div className="sectionhead"><h2>Lo más importante ahora</h2><a className="link" href="#/alertas">Ver alertas</a></div>
        {top ? (
          <Item icon="📅" title="Siembra recomendada" sub={`${top.crop.name} · ${win ? 'mejor época: ' + win : 'consulte el calendario'}${nowStatus === 'ideal' ? ' (¡ahora es buen momento!)' : ''}`} to="/cuando-sembrar" />
        ) : <Item icon="📅" title="Siembra" sub="Ajuste los datos de su finca para ver recomendaciones" to="/finca" />}
        {wp && top && <Item icon="💧" title="Riego" sub={wp.deficitMm > 0 ? `${top.crop.name}: déficit de ${wp.deficitMm} mm (${num(wp.deficitM3Ha, 0)} m³/ha) por ciclo` : `${top.crop.name}: la lluvia cubre la demanda en este ciclo`} to="/agua" />}
        {fp && top && <Item icon="🌿" title="Aplicación de abono" sub={`${top.crop.name}: N ${fp.N} · P₂O₅ ${fp.P2O5} · K₂O ${fp.K2O} kg/ha`} to="/abonos" />}
        {past && <Item icon="🐄" title="Ganadería" sub={`${LIVESTOCK_LABEL[finca.livestock]}: ${past.pasture.name.split(' cv.')[0]} (rotación cada ${past.pasture.restDays[0]}–${past.pasture.restDays[1]} días)`} to="/ganaderia" />}
        <div className="sectionhead"><h2>Explorar</h2></div>
        <div className="grid2">
          <Item icon="🏆" title="Más rentables" to="/cultivos" />
          <Item icon="🚫" title="No sembrar" to="/alertas" />
          <Item icon="📷" title="Biblioteca" to="/biblioteca" />
          <Item icon="🧮" title="Calculadora" to="/finanzas" />
        </div>
        <p className="mute small" style={{ textAlign: 'center' }}>
          Lluvia esperada este mes: {rainNow >= 0.7 ? 'alta' : rainNow >= 0.4 ? 'media' : 'baja'} · {MONTHS_LONG[now.getMonth()]}
          <br />Última sincronización: {lastSync ? new Date(lastSync).toLocaleDateString('es-CO') : 'pendiente'}
        </p>
      </div>
    </>
  );
}
