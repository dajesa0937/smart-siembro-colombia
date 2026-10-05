# Fuentes, supuestos y pendientes de validación (v0.1)

## Qué es dato y qué es supuesto
- **Rangos agroecológicos** (altitud, lluvia, pH, drenaje, pendiente) por cultivo y pasto: primera referencia desde literatura técnica general. **Pendiente**: contrastar con las fichas y la zonificación de aptitud de **UPRA**, fichas **Agrosavia**, gremios y **FAO EcoCrop**.
- **Pastos Brachiaria/Panicum** (altitud, precipitación mínima, % proteína, producción MS, valor cultural, dosis de semilla): tomados del catálogo `catalogo-semillas-pasto-soesp.pdf` (Durespo/SOESP). La extracción del PDF fue parcial: validar columna por columna contra el original. Kikuyo, ryegrass, estrella y elefante: referencia técnica general.
- **Precios (COP/t) y costos/ha**: valores de referencia **editables**, sin fuente oficial cargada. **Pendiente**: conectar precios mayoristas SIPSA-DANE y costos de producción por gremio.
- **Clima por municipio** (altitud, lluvia anual, régimen): aproximado para ~40 municipios. **Pendiente**: series IDEAM por estación y cobertura de todos los municipios (DIVIPOLA).
- **Temperatura**: gradiente altitudinal 0,6 °C/100 m (aprox.).
- **Calendario**: índice relativo de lluvia por régimen (andino bimodal, Caribe, Orinoquía, Pacífico, Amazonía), refinado con histórico real de Open-Meteo cuando hay conexión.
- **Riego**: demanda hídrica por ciclo (aprox. ETc FAO-56) menos 75 % de la lluvia del ciclo. 1 mm = 10 m³/ha.
- **Carga animal**: 11,25 kg MS/día por UGG (450 kg), aprovechamiento 50 % del forraje.
- **Páramo**: alerta por altitud > 3.000 m (Ley 1930 de 2018); es una advertencia genérica, no delimitación oficial.
- **Plaguicidas**: no hay dosis numéricas; solo categorías y remisión a registro ICA.

## Fotos (biblioteca visual)
La galería funciona con ilustraciones hasta que se carguen fotos reales. Para agregar: `public/img/<cultivos|pastos|plagas>/<id>.jpg` + id en `src/data/photos.ts`. Solo fotos propias o con licencia abierta (Wikimedia Commons CC, material Agrosavia/ICA con permiso). Registre aquí la atribución:

| Archivo | Autor | Licencia | Fuente |
|---|---|---|---|
| `hero-ganaderia.jpg`, `hero-maiz.jpg` | Dawin (fotos propias) | Propias | `MOCUKPS_PROYECTO/` |

## Siguientes pasos sugeridos
1. Validar datos con un agrónomo (rangos, rendimientos, costos) y cargar zonificación UPRA.
2. Cargar fotos reales por cultivo / plaga / pasto / deficiencia.
3. Backend opcional (cuentas, sincronización de fincas, datos de municipio completos).
4. Notificaciones (siembra, riego, abono) y reportes de seguimiento por ciclo.
5. Empaquetar como app móvil (Capacitor) si se requiere tienda.
