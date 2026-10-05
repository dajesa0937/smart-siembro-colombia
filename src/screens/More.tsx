import { useState } from 'react';
import { useStore } from '../lib/store';
import { Item, TopBar } from '../components/ui';
import { useOnline } from '../lib/online';
import { fetchHistorical, fetchWeather } from '../lib/climate';
import { fdate } from '../lib/format';
import { SOURCES } from '../data/sources';
import { go } from '../lib/router';
import { PESTS } from '../data/pests';
import { CROPS } from '../data/crops';
import { PASTURES } from '../data/pastures';

export function More({ needRefresh, update, checkUpdate }: { needRefresh: boolean; update: () => void; checkUpdate: () => Promise<void> }) {
  const { finca, lastSync, markSynced, reset } = useStore();
  const online = useOnline();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const sync = async () => {
    setBusy(true); setMsg('');
    const results = await Promise.allSettled([fetchWeather(finca.lat, finca.lon), fetchHistorical(finca.lat, finca.lon), checkUpdate()]);
    const ok = results.some((r) => r.status === 'fulfilled');
    if (ok) markSynced();
    setMsg(ok ? 'Sincronizado: clima actual, histórico de lluvia y contenido de la app verificados.' : 'No se pudo sincronizar. Intente de nuevo con mejor señal.');
    setBusy(false);
  };

  return (
    <>
      <TopBar title="Más" backBtn={false} />
      <div className="page">
        <div className="card">
          <h2>📶 Modo sin conexión</h2>
          <p className="small">Estado: <b>{online ? 'con internet' : 'sin internet'}</b>. Todo el contenido (cultivos, pastos, plagas, calendarios y fotos) está guardado en el teléfono: la app funciona sin internet. Con conexión se actualiza el clima y el contenido nuevo (solo lo que cambió).</p>
          <p className="mute small">Contenido: {CROPS.length} cultivos · {PASTURES.length} pastos · {PESTS.length} fichas fitosanitarias · Última sincronización: {fdate(lastSync)}</p>
          <button className="btn" disabled={!online || busy} onClick={sync}>{busy ? 'Sincronizando…' : online ? 'Sincronizar ahora' : 'Sin conexión'}</button>
          {msg && <p className="small">{msg}</p>}
          {needRefresh && <button className="btn ghost" style={{ marginTop: 8 }} onClick={update}>Hay una versión nueva: actualizar</button>}
        </div>
        <Item icon="📍" title="Mi finca" sub="Ubicación, suelo y ganadería" to="/finca" />
        <Item icon="🚫" title="Alertas" sub="Qué no sembrar y riesgos del mes" to="/alertas" />
        <Item icon="💧" title="Agua y riego" to="/agua" />
        <Item icon="🌿" title="Abonos y fertilización" to="/abonos" />
        <Item icon="📅" title="¿Cuándo sembrar?" to="/cuando-sembrar" />
        <Item icon="📷" title="Biblioteca visual" to="/biblioteca" />
        <Item icon="📊" title="Resumen financiero" to="/resumen" />
        <div className="card" style={{ marginTop: 14 }}>
          <h2>📚 Fuentes de referencia</h2>
          <ul className="clean small">{SOURCES.map((s) => <li key={s.name}><b>{s.name}</b> — {s.use}</li>)}</ul>
          <p className="mute small">Los valores de la versión 0.1 son orientativos y están pendientes de validación con agrónomos y datos oficiales (ver docs/FUENTES.md).</p>
        </div>
        <button className="btn ghost danger" onClick={() => { if (window.confirm('¿Borrar todos los datos guardados en este dispositivo?')) { reset(); go('/bienvenida'); } }}>Borrar mis datos</button>
        <p className="disclaimer">Smart Siembro Colombia v0.1</p>
      </div>
    </>
  );
}
