import { describe, expect, it } from 'vitest';
import { calculate, defaultFinca, evaluateCrop, fertPlan, rankCrops, rankPastures, rangeScore, sowingCalendar, sowingWindows, tempFromAlt, waterPlan } from './engine';
import { CROPS, getCrop } from '../data/crops';
import { PLACES, nearestPlace } from '../data/places';

const finca = (o: object = {}) => ({ ...defaultFinca(), ...o });

describe('motor de recomendación', () => {
  it('rangeScore: 1 dentro del óptimo y 0 fuera del absoluto', () => {
    expect(rangeScore(5, [3, 7], [1, 9])).toBe(1);
    expect(rangeScore(0, [3, 7], [1, 9])).toBe(0);
    expect(rangeScore(2, [3, 7], [1, 9])).toBeCloseTo(0.5);
  });
  it('temperatura baja con la altitud', () => {
    expect(tempFromAlt(0)).toBeGreaterThan(tempFromAlt(2500));
    expect(tempFromAlt(1500)).toBeGreaterThan(17);
  });
  it('papa NO se recomienda en costa a nivel del mar y SÍ en altiplano', () => {
    const papa = getCrop('papa')!;
    expect(evaluateCrop(papa, finca({ alt: 20, rain: 1000, regime: 'caribe' })).verdict).toBe('no-recomendado');
    expect(evaluateCrop(papa, finca({ alt: 2600, rain: 1000, ph: 5.5 })).verdict).not.toBe('no-recomendado');
  });
  it('Sincelejo: papa es NO recomendada (clima cálido, 213 m)', () => {
    const sin = PLACES.find((x) => x.id === 'sincelejo')!;
    const e = evaluateCrop(getCrop('papa')!, finca({ alt: sin.alt, rain: sin.rain, regime: sin.regime }));
    expect(e.verdict).toBe('no-recomendado');
    expect(e.reasons.join(' ')).toMatch(/Altitud/);
  });
  it('aguacate no tolera drenaje pobre', () => {
    const e = evaluateCrop(getCrop('aguacate')!, finca({ alt: 2000, drainage: 'pobre', rain: 1400 }));
    expect(e.verdict).toBe('no-recomendado');
    expect(e.reasons.join(' ')).toMatch(/drenaje/i);
  });
  it('arroz se acepta con drenaje pobre en tierra caliente', () => {
    const e = evaluateCrop(getCrop('arroz')!, finca({ alt: 100, drainage: 'pobre', texture: 'arcilloso', slope: 2, rain: 2000, regime: 'llanos' }));
    expect(e.verdict).not.toBe('no-recomendado');
  });
  it('sobre 3000 m se alerta por páramo', () => {
    const e = evaluateCrop(getCrop('papa')!, finca({ alt: 3300 }));
    expect(e.verdict).toBe('no-recomendado');
    expect(e.reasons.join(' ')).toMatch(/páramo/);
  });
  it('rankCrops separa viables de no recomendados y cubre todos los cultivos', () => {
    const r = rankCrops(finca({ alt: 1500 }));
    expect(r.viable.length + r.notRecommended.length).toBe(CROPS.length);
    expect(r.viable.length).toBeGreaterThan(2);
  });
  it('cada punto de las ciudades produce al menos un cultivo viable', () => {
    for (const p of PLACES) {
      const r = rankCrops(finca({ alt: p.alt, rain: p.rain, regime: p.regime, ph: 5.8 }));
      expect(r.viable.length, p.name).toBeGreaterThan(0);
    }
  });
  it('calendario: Andino bimodal marca abril-mayo y octubre como ideal; ene-feb no', () => {
    const cal = sowingCalendar(getCrop('maiz')!, finca());
    expect(cal[3]).toBe('ideal');
    expect(cal[9]).toBe('ideal');
    expect(cal[0]).not.toBe('ideal');
    expect(sowingWindows(cal).length).toBeGreaterThan(0);
  });
  it('calendario: heladas descartan dic-feb sobre 2600 m', () => {
    const cal = sowingCalendar(getCrop('papa')!, finca({ alt: 2800 }));
    expect([cal[11], cal[0], cal[1]]).toEqual(['no', 'no', 'no']);
  });
  it('riego: goteo ahorra ~40% frente a gravedad', () => {
    const w = waterPlan(getCrop('maiz')!, finca({ rain: 700 }), 0);
    expect(w.deficitMm).toBeGreaterThan(0);
    expect(w.systems[0].savingVsGravity).toBeGreaterThanOrEqual(38);
  });
  it('fertilización: convierte a producto comercial y avisa de encalado', () => {
    const f = fertPlan(getCrop('maiz')!, finca({ ph: 4.9, fertility: 'baja' }));
    expect(f.urea).toBeGreaterThan(0);
    expect(f.dap).toBe(Math.round(f.P2O5 / 0.46));
    expect(f.limeNote).toBeTruthy();
  });
  it('calculadora: utilidad = ingresos - costos', () => {
    const c = getCrop('maiz')!;
    const r = calculate(c, { cropId: c.id, areaHa: 2, yieldTHa: 5, priceCopT: 1_400_000, costScale: 1 });
    expect(r.net).toBe(r.revenue - r.cost);
    expect(r.production).toBe(10);
    expect(r.breakdown.reduce((a, b) => a + b.value, 0)).toBe(r.cost);
  });
  it('pastos: kikuyo en altura, brachiaria en tierra caliente', () => {
    const alto = rankPastures(finca({ alt: 2500, rain: 1800, fertility: 'media' }), 'leche', 10).viable.map((e) => e.pasture.id);
    expect(alto).toContain('kikuyo');
    expect(alto).not.toContain('mombaza');
    const calido = rankPastures(finca({ alt: 300, rain: 1500, fertility: 'media' }), 'carne', 10).viable.map((e) => e.pasture.id);
    expect(calido.some((id) => id.includes('brachiaria'))).toBe(true);
    expect(calido).not.toContain('kikuyo');
  });
  it('lugar más cercano', () => {
    expect(nearestPlace(6.26, -75.57).id).toBe('medellin');
  });
});
