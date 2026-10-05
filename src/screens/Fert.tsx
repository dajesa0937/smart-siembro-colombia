import { useState } from 'react';
import { useStore } from '../lib/store';
import { CropWarning, Disclaimer, Item, Tabs, Tip, TopBar } from '../components/ui';
import { CROPS, getCrop } from '../data/crops';
import { fertPlan, rankCrops } from '../lib/engine';
import { num } from '../lib/format';

export function Fert() {
  const { finca } = useStore();
  const [tab, setTab] = useState<'cultivo' | 'ganaderia'>('cultivo');
  const [cropId, setCropId] = useState(() => rankCrops(finca).viable[0]?.crop.id ?? 'maiz');
  const crop = getCrop(cropId) ?? CROPS[0];
  const fp = fertPlan(crop, finca);
  const bultos = (kgHa: number) => num((kgHa * finca.areaHa) / 50, 1);

  return (
    <>
      <TopBar title="Abonos y fertilización" />
      <div className="page">
        <Tabs value={tab} onChange={setTab} items={[['cultivo', 'Cultivo'], ['ganaderia', 'Ganadería']]} />
        {tab === 'cultivo' && (
          <>
            <select value={cropId} onChange={(e) => setCropId(e.target.value)} style={{ marginBottom: 12 }} aria-label="Cultivo">{CROPS.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
            <CropWarning crop={crop} finca={finca} />
            <h2>Plan de fertilización</h2>
            <Item icon="🟫" title="Abono orgánico (compost)" sub={`${fp.organicT} t/ha · ${num(fp.organicT * finca.areaHa)} t para ${num(finca.areaHa)} ha (al preparar el suelo)`} />
            <Item icon="🟢" title="Nitrógeno (urea 46%)" sub={`${fp.urea} kg/ha de urea ≈ ${bultos(fp.urea)} bultos de 50 kg en su finca · aporta N total ${fp.N} kg/ha`} />
            <Item icon="⚪" title="Fósforo (DAP 18-46-0)" sub={`${fp.dap} kg/ha ≈ ${bultos(fp.dap)} bultos · a la siembra`} />
            <Item icon="🔴" title="Potasio (KCl 60%)" sub={`${fp.kcl} kg/ha ≈ ${bultos(fp.kcl)} bultos · fraccionado`} />
            <p className="mute small">{crop.fert.note} Dosis ajustadas a fertilidad {finca.fertility}: a menor fertilidad, mayor dosis dentro del rango técnico.</p>
            {fp.limeNote && <div className="card alert"><b>Corrija la acidez primero</b><span className="small">{fp.limeNote}</span></div>}
            <Tip icon="🍃" title="Tips para ahorrar"><ul className="clean small"><li>Use abonos orgánicos y biofertilizantes.</li><li>Aplique solo la dosis necesaria según el análisis.</li><li>Haga análisis de suelo cada 2 años.</li></ul></Tip>
            <div className="card alert rojo" style={{ marginTop: 12 }}><b>⛔ Cuándo NO fertilizar con químicos</b><ul className="clean small">{crop.noChem.slice(0, 2).map((t) => <li key={t}>{t}</li>)}<li>Con lluvia fuerte inminente o suelo encharcado (se lava el abono y contamina el agua).</li><li>Sin análisis de suelo previo ni en suelos con pH muy bajo sin encalar.</li></ul></div>
          </>
        )}
        {tab === 'ganaderia' && (
          <>
            <h2>Fertilización de potreros</h2>
            <div className="card"><ul className="clean small">
              <li>Fraccione el nitrógeno: aplique después de cada pastoreo (tras 2–3 días de salida del ganado) y con humedad en el suelo.</li>
              <li>Referencia de partida en pastos mejorados: 50–100 kg N/ha por aplicación anual dividida; ajústela con análisis de suelo y la guía de su técnico.</li>
              <li>Fósforo y calcio: corrija a la siembra o renovación según análisis.</li>
              <li>Devuelva nutrientes con estiércol compostado o abono de lagunas de oxidación tratadas (sin pasar de la carga recomendada).</li>
              <li>No mezcle semilla de pasto con urea ni cloruro de potasio (la quema); el superfosfato sí se puede mezclar el mismo día de la siembra.</li>
            </ul></div>
            <Tip icon="🌱" title="Alternativas">Asocie leguminosas (trébol blanco, maní forrajero, Desmodium según la altitud) para aportar nitrógeno natural.</Tip>
          </>
        )}
        <Disclaimer />
      </div>
    </>
  );
}
