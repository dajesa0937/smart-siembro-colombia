import { useState } from 'react';
import { Disclaimer, Item, Tabs, Thumb, TopBar } from '../components/ui';
import { PESTS, getPest } from '../data/pests';
import { PASTURES } from '../data/pastures';
import { CROPS } from '../data/crops';
import { PHOTOS } from '../data/photos';

type Tab = 'plagas' | 'pastos' | 'cultivos' | 'deficiencias';

export function Library() {
  const [tab, setTab] = useState<Tab>('plagas');
  const total = PHOTOS.cultivos.length + PHOTOS.pastos.length + PHOTOS.plagas.length;
  return (
    <>
      <TopBar title="Biblioteca visual" />
      <div className="page">
        <Tabs value={tab} onChange={setTab} items={[['plagas', 'Plagas'], ['pastos', 'Pastos'], ['cultivos', 'Cultivos'], ['deficiencias', 'Deficiencias']]} />
        {total === 0 && <div className="card alert"><b>📷 Fotos pendientes de cargar</b><span className="small">La galería está lista para fotos reales sin conexión. Mientras se agregan (ver docs/FUENTES.md), se muestran ilustraciones.</span></div>}
        {tab === 'plagas' && PESTS.filter((p) => p.type !== 'deficiencia').map((p) => <Item key={p.id} icon={<Thumb kind="plagas" id={p.id} icon={p.icon} />} title={p.name} sub={`${p.sci} · ${p.crops}`} to={'/plaga/' + p.id} />)}
        {tab === 'deficiencias' && PESTS.filter((p) => p.type === 'deficiencia').map((p) => <Item key={p.id} icon={p.icon} title={p.name} sub={p.symptoms} to={'/plaga/' + p.id} />)}
        {tab === 'pastos' && PASTURES.map((p) => <Item key={p.id} icon={p.icon} title={p.name} sub={<i>{p.sci}</i>} to={'/pasto/' + p.id} />)}
        {tab === 'cultivos' && CROPS.map((c) => <Item key={c.id} icon={c.icon} title={c.name} sub={<i>{c.sci}</i>} to={'/cultivo/' + c.id} />)}
        <Disclaimer />
      </div>
    </>
  );
}

export function PestDetail({ id }: { id: string }) {
  const p = getPest(id);
  if (!p) return <><TopBar title="Ficha" /><div className="page">No encontrada.</div></>;
  return (
    <>
      <TopBar title={p.name} />
      <div className="page">
        <div className="row" style={{ marginBottom: 12 }}><Thumb kind="plagas" id={p.id} icon={p.icon} size="lg" /><div><b style={{ fontSize: 18 }}>{p.name}</b><div className="mute small"><i>{p.sci}</i></div><span className="badge gray">{p.type}</span> <span className="badge">{p.crops}</span></div></div>
        <div className="card"><h2>Cómo reconocerlo</h2><p className="small">{p.symptoms}</p><p className="mute small">{p.threshold}</p></div>
        <div className="card"><h2>🧑‍🌾 Control cultural</h2><ul className="clean small">{p.cultural.map((t) => <li key={t}>{t}</li>)}</ul></div>
        {p.biological.length > 0 && <div className="card"><h2>🌿 Control biológico / orgánico</h2><ul className="clean small">{p.biological.map((t) => <li key={t}>{t}</li>)}</ul></div>}
        <div className="card alert"><h2>Control químico</h2><p className="small">{p.chemicalNote}</p><p className="small"><b>Dosis y producto:</b> solo según etiqueta de un producto con registro ICA y recomendación de un ingeniero agrónomo.</p></div>
        <Disclaimer />
      </div>
    </>
  );
}
