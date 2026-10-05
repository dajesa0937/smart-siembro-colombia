# Arquitectura (v0.1)

- **Stack**: React 18 + TypeScript + Vite + vite-plugin-pwa. Sin librerías de UI ni de gráficos (bundle ≈ 81 KB gzip) para gama media-baja.
- **Datos**: módulos TypeScript en `src/data` compilados dentro del bundle → precacheados → 100 % offline desde la primera visita.
- **Motor** (`src/lib/engine.ts`): funciones puras y probadas (`npm test`). Cada cultivo recibe una aptitud 0–100 (altitud 30 %, lluvia 20 %, pH 15 %, drenaje 15 %, textura 10 %, pendiente 10 %) y *bloqueos duros* (altitud/pH/drenaje/lluvia fuera de rango, pendiente extrema, páramo) que generan el aviso **No sembrar** con la razón.
- **Rentabilidad**: rendimiento esperado (rango × aptitud × fertilidad) × precio − costos; para permanentes se amortiza establecimiento y años sin producción a 10 años.
- **Estado**: `localStorage` (finca, historial, última sincronización). Clima y histórico en caché por coordenada.
- **Sincronización**: clima actual + histórico de 5 años (Open-Meteo) + verificación de nueva versión del service worker (`registerType: 'prompt'`).
- **Rutas**: hash router propio (`#/cultivos`, `#/cultivo/papa`) → funciona en cualquier hosting estático y offline.
- **Evolución prevista**: mover `src/data` a JSON versionado (`/data/v1/*.json`) con sincronización diferencial por hash cuando el contenido crezca.
