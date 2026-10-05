# Smart Siembro Colombia

PWA offline-first para agricultores y ganaderos de Colombia: cultivos rentables, alertas de qué **no** sembrar, pastos según ganadería, calendario de siembra, agua y riego, abonos, biblioteca de plagas y calculadora financiera. Diseñada según el mockup de `MOCUKPS_PROYECTO/` (AgroConecta).

## Empezar (VS Code)

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # pruebas del motor de recomendación
npm run build      # genera dist/ con service worker (PWA)
npm run preview    # probar la versión compilada y el modo sin conexión
```

Para probar offline: `npm run build && npm run preview`, abrir la app una vez, y en DevTools → Network → *Offline*.

## Estructura

| Ruta | Contenido |
|---|---|
| `src/data/` | Cultivos, pastos, plagas, municipios y fuentes (**aquí se edita el conocimiento agronómico**) |
| `src/lib/engine.ts` | Motor: aptitud, alertas "NO sembrar", calendario, riego, fertilización, finanzas, carga animal |
| `src/lib/climate.ts` | Clima en vivo e histórico (Open-Meteo) con caché local |
| `src/screens/` | Pantallas (inicio, finca, calendario, cultivos, ganadería, agua, abonos, finanzas, biblioteca, más) |
| `public/img/` | Fotos que viajan offline (ver `src/data/photos.ts`) |
| `docs/` | Arquitectura, fuentes y pendientes de validación |

## Offline-first

Datos, JS, CSS y fotos se **precachean** con el service worker (vite-plugin-pwa). El estado de la finca y el clima/histórico consultados se guardan en `localStorage`. Con conexión, el botón *Sincronizar* actualiza clima, histórico y detecta versión nueva de contenido (solo se descarga lo que cambió). El indicador En línea / Sin conexión aparece en cada pantalla.

## Despliegue

Netlify (`netlify.toml` incluido): `npm run build`, publicar `dist/`. Repositorio previsto: `github.com/dajesa0937/siembro-colombia` (o uno nuevo para esta versión).

## Importante

Los rangos, rendimientos, costos y precios de la v0.1 son **orientativos** y deben validarse con un ingeniero agrónomo antes de usarse como asesoría. Ver `docs/FUENTES.md`. La app **no** entrega dosis numéricas de plaguicidas: remite a etiqueta ICA y asesor técnico.
