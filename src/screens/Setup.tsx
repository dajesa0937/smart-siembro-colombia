import { useMemo, useState } from 'react';
import { useStore } from '../lib/store';
import { TopBar, Field, Disclaimer } from '../components/ui';
import { DEPARTMENTS, PLACES, getPlace, nearestPlace } from '../data/places';
import { go } from '../lib/router';
import { LIVESTOCK_LABEL, REGIME_LABEL, tempFromAlt } from '../lib/engine';
import { fetchElevation } from '../lib/climate';
import type { Drainage, Fertility, Livestock, Texture } from '../lib/types';

export function Setup() {
  const { finca, setFinca, finishSetup, configured } = useStore();
  const [dept, setDept] = useState(getPlace(finca.placeId)?.dept ?? 'Antioquia');
  const [msg, setMsg] = useState('');
  const places = useMemo(() => PLACES.filter((p) => p.dept === dept), [dept]);

  const pick = (id: string) => {
    const p = getPlace(id);
    if (p) setFinca({ placeId: p.id, lat: p.lat, lon: p.lon, alt: p.alt, rain: p.rain, regime: p.regime });
  };
  const gps = () => {
    setMsg('Buscando ubicación…');
    if (!navigator.geolocation) return setMsg('Este dispositivo no permite ubicación. Elija su municipio.');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      const near = nearestPlace(lat, lon);
      const el = await fetchElevation(lat, lon);
      setDept(near.dept);
      setFinca({ placeId: near.id, lat, lon, alt: el ?? near.alt, rain: near.rain, regime: near.regime });
      setMsg(`Ubicación detectada cerca de ${near.name}${el ? `, altitud ${el} m` : ' (altitud tomada del municipio; ajústela si es necesario)'}.`);
    }, () => setMsg('No se pudo obtener la ubicación. Elija su municipio.'), { timeout: 10000 });
  };
  const typical = () => setFinca({ texture: 'franco', drainage: 'bueno', fertility: 'media', ph: finca.alt > 1200 ? 5.3 : 5.9, slope: finca.alt > 1200 ? 20 : 8 });
  const nn = (v: string) => (v === '' ? 0 : Number(v));

  return (
    <>
      <TopBar title={configured ? 'Mi finca' : 'Cuéntenos de su finca'} backBtn={configured} />
      <div className="page">
        <div className="card">
          <h2>📍 Ubicación</h2>
          <button className="btn ghost small" onClick={gps}>Usar mi ubicación (GPS)</button>
          {msg && <p className="mute small">{msg}</p>}
          <Field label="Nombre de la finca"><input value={finca.name} onChange={(e) => setFinca({ name: e.target.value })} /></Field>
          <div className="grid2">
            <Field label="Departamento"><select value={dept} onChange={(e) => { setDept(e.target.value); const p = PLACES.find((x) => x.dept === e.target.value); if (p) pick(p.id); }}>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Municipio"><select value={finca.placeId ?? ''} onChange={(e) => pick(e.target.value)}><option value="" disabled>Elegir…</option>{places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
          </div>
          <div className="grid2">
            <Field label="Altitud (msnm)"><input type="number" inputMode="numeric" value={finca.alt} onChange={(e) => setFinca({ alt: nn(e.target.value) })} /></Field>
            <Field label="Lluvia anual (mm)"><input type="number" inputMode="numeric" value={finca.rain} onChange={(e) => setFinca({ rain: nn(e.target.value) })} /></Field>
          </div>
          <p className="mute small">Temperatura media estimada: <b>{tempFromAlt(finca.alt)} °C</b> · {REGIME_LABEL[finca.regime]}. Si conoce los datos de su vereda, corríjalos.</p>
        </div>

        <div className="card">
          <h2>🟤 Suelo</h2>
          <button className="btn ghost small" onClick={typical}>No sé: usar valores típicos de la zona</button>
          <div className="grid2">
            <Field label="Textura"><select value={finca.texture} onChange={(e) => setFinca({ texture: e.target.value as Texture })}><option value="arenoso">Arenoso (suelto)</option><option value="franco">Franco (equilibrado)</option><option value="arcilloso">Arcilloso (pegajoso)</option></select></Field>
            <Field label="Drenaje"><select value={finca.drainage} onChange={(e) => setFinca({ drainage: e.target.value as Drainage })}><option value="bueno">Bueno (no se encharca)</option><option value="moderado">Moderado</option><option value="pobre">Pobre (se encharca)</option></select></Field>
            <Field label="pH del suelo"><input type="number" step="0.1" min="3" max="9" inputMode="decimal" value={finca.ph} onChange={(e) => setFinca({ ph: nn(e.target.value) })} /></Field>
            <Field label="Fertilidad"><select value={finca.fertility} onChange={(e) => setFinca({ fertility: e.target.value as Fertility })}><option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option></select></Field>
            <Field label="Pendiente (%)"><input type="number" min="0" max="100" inputMode="numeric" value={finca.slope} onChange={(e) => setFinca({ slope: nn(e.target.value) })} /></Field>
            <Field label="Área (ha)"><input type="number" step="0.1" min="0.1" inputMode="decimal" value={finca.areaHa} onChange={(e) => setFinca({ areaHa: nn(e.target.value) })} /></Field>
          </div>
          <label className="f" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" style={{ width: 20 }} checked={finca.hasIrrigation} onChange={(e) => setFinca({ hasIrrigation: e.target.checked })} />Tengo riego disponible</label>
        </div>

        <div className="card">
          <h2>🐄 Ganadería</h2>
          <div className="grid2">
            <Field label="Tipo de ganado"><select value={finca.livestock} onChange={(e) => setFinca({ livestock: e.target.value as Livestock })}>{Object.entries(LIVESTOCK_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></Field>
            <Field label="Número de animales"><input type="number" min="0" inputMode="numeric" value={finca.heads} onChange={(e) => setFinca({ heads: nn(e.target.value) })} /></Field>
          </div>
        </div>
        <button className="btn" onClick={() => { finishSetup(); go('/'); }}>{configured ? 'Guardar' : 'Ver mis recomendaciones'}</button>
        <Disclaimer />
      </div>
    </>
  );
}
