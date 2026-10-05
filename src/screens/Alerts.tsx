import { useStore } from '../lib/store';
import { Disclaimer, TopBar } from '../components/ui';
import { fincaAlerts, rankCrops } from '../lib/engine';
import { go } from '../lib/router';

export function Alerts() {
  const { finca } = useStore();
  const alerts = fincaAlerts(finca);
  const { notRecommended, viable } = rankCrops(finca);
  const cond = viable.filter((v) => v.verdict === 'condicionado');
  return (
    <>
      <TopBar title="Alertas" />
      <div className="page">
        <h2>Clima y riesgos</h2>
        {alerts.map((a, i) => <div key={i} className={'card alert ' + a.level}><b>{a.title}</b><span className="small">{a.text}</span></div>)}
        <h2 style={{ marginTop: 18 }}>🚫 No siembre en su finca</h2>
        {notRecommended.map((e) => (
          <div key={e.crop.id} className="card alert rojo" onClick={() => go('/cultivo/' + e.crop.id)} style={{ cursor: 'pointer' }}>
            <b>{e.crop.icon} {e.crop.name}</b>
            <ul className="clean small">{e.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
          </div>
        ))}
        {!notRecommended.length && <p className="mute">No hay cultivos descartados con los datos actuales.</p>}
        {cond.length > 0 && <>
          <h2 style={{ marginTop: 18 }}>⚠ Siembre solo con precauciones</h2>
          {cond.map((e) => <div key={e.crop.id} className="card alert" onClick={() => go('/cultivo/' + e.crop.id)} style={{ cursor: 'pointer' }}><b>{e.crop.icon} {e.crop.name}</b><ul className="clean small">{e.reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}</ul></div>)}
        </>}
        <Disclaimer />
      </div>
    </>
  );
}
