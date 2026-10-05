import { useState } from 'react';
import { useStore } from '../lib/store';
import { CropWarning, Disclaimer, Item, Tabs, Tip, TopBar } from '../components/ui';
import { CROPS, getCrop } from '../data/crops';
import { LIVESTOCK_LABEL, MONTHS_LONG, rankCrops, waterPlan } from '../lib/engine';
import { num } from '../lib/format';

const LITERS_DAY = { leche: 90, carne: 45, doble: 65, ovino: 6, caprino: 6 } as const;

export function Water() {
  const { finca } = useStore();
  const [tab, setTab] = useState<'cultivos' | 'ganaderia'>('cultivos');
  const [cropId, setCropId] = useState(() => rankCrops(finca).viable[0]?.crop.id ?? 'maiz');
  const [month, setMonth] = useState(new Date().getMonth());
  const crop = getCrop(cropId) ?? CROPS[0];
  const w = waterPlan(crop, finca, month);
  const daily = LITERS_DAY[finca.livestock] * finca.heads;

  return (
    <>
      <TopBar title="Agua y riego" />
      <div className="page">
        <Tabs value={tab} onChange={setTab} items={[['cultivos', 'Cultivos'], ['ganaderia', 'Ganadería']]} />
        {tab === 'cultivos' && (
          <>
            <div className="grid2" style={{ marginBottom: 12 }}>
              <select value={cropId} onChange={(e) => setCropId(e.target.value)} aria-label="Cultivo">{CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label="Mes de siembra">{MONTHS_LONG.map((m, i) => <option key={m} value={i}>Siembra: {m}</option>)}</select>
            </div>
            <CropWarning crop={crop} finca={finca} />
            <h2>Necesidad de agua</h2>
            <div className="card">
              <div className="grid2">
                <div className="kpi"><small>Demanda del cultivo</small><b>{num(w.needMm, 0)} mm</b></div>
                <div className="kpi"><small>Lluvia útil esperada</small><b>{num(w.rainEffMm, 0)} mm</b></div>
                <div className={'kpi ' + (w.deficitMm > 0 ? 'red' : 'green')}><small>Déficit a cubrir con riego</small><b>{num(w.deficitMm, 0)} mm</b></div>
                <div className="kpi"><small>Volumen neto</small><b>{num(w.deficitM3Ha, 0)} m³/ha</b><small>{num(w.deficitLHa, 0)} litros/ha</small></div>
              </div>
              <p className="mute small">1 mm de lámina = 10 m³/ha (10.000 L/ha). Calculado con demanda hídrica del cultivo, lluvia del régimen de su zona y 75% de eficiencia de la lluvia.</p>
              <Item icon="📅" title="Frecuencia de riego (época seca)" sub={`cada ${w.frequencyDays[0]}–${w.frequencyDays[1]} días en suelo ${finca.texture}`} />
            </div>
            <h3>Volumen bruto según sistema de riego</h3>
            {w.systems.map((s) => <Item key={s.name} icon={s.name === 'Goteo' ? '💧' : s.name === 'Aspersión' ? '🌦️' : '🌊'} title={s.name} sub={`Eficiencia ${Math.round(s.eff * 100)}% · ${num(s.grossM3Ha, 0)} m³/ha`} right={<span className="badge">{s.savingVsGravity > 0 ? `ahorra ${s.savingVsGravity}%` : 'referencia'}</span>} />)}
            <h3>Recomendaciones</h3>
            <div className="card"><ul className="clean small">
              <li>Use riego por goteo o aspersión para ahorrar hasta ~40% de agua frente a gravedad.</li>
              <li>Riegue temprano en la mañana o al final de la tarde (menos evaporación).</li>
              <li>Monitoree la humedad del suelo (meta el dedo 10 cm: si se desmorona, riegue).</li>
              <li>Use coberturas (mulch) para conservar humedad.</li>
              <li>Verifique la concesión de aguas con su corporación autónoma regional.</li>
            </ul></div>
          </>
        )}
        {tab === 'ganaderia' && (
          <>
            <div className="card">
              <h2>Consumo de agua del hato</h2>
              <p>{LIVESTOCK_LABEL[finca.livestock]} · {finca.heads} animales</p>
              <div className="grid2"><div className="kpi"><small>Por día</small><b>{num(daily, 0)} L</b></div><div className="kpi"><small>Por mes</small><b>{num((daily * 30) / 1000, 1)} m³</b></div></div>
              <p className="mute small">Referencia: vaca lechera en producción ~90 L/día; carne ~45; doble propósito ~65; ovino/caprino ~6 (aumenta con calor).</p>
            </div>
            <Tip icon="🚰" title="Ahorro y bienestar"><ul className="clean small"><li>Bebederos con flotador y limpios.</li><li>Cosecha de agua lluvia de techos: 1 mm sobre 1 m² = 1 litro.</li><li>Proteja nacimientos y quebradas con cercas y aislamiento.</li></ul></Tip>
          </>
        )}
        <Disclaimer />
      </div>
    </>
  );
}
