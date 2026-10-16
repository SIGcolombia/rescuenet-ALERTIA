# RescuENet y Prioriza

Prototipos navegables para el reto 9 del Rally Latinoamericano de Innovación (optimización y priorización de recursos en la post-emergencia), caso Ocaña, Norte de Santander.

| Carpeta | Qué es | Quién la usa |
|---|---|---|
| `rescuenet-movil/` | App móvil de 8 pantallas: enviar un mensaje, pase de lista, tareas, mula de datos, verificación y privacidad | Vecino, vigía, brigadista |
| `prioriza-web/` | Tablero de escritorio con mapa, ranking, pase de lista, bandeja de mensajes de RescuENet y bitácora | Puesto de Mando (PMU) |
| `prioriza-movil/` | Versión del tablero para el celular | Coordinador en terreno |

Cada carpeta es HTML, CSS y JavaScript puros. No hay build ni dependencias: abre `index.html` o publica la raíz con GitHub Pages.

## Qué es real y qué es demostración

- Los datos de sectores, mensajes y equipos son de ejemplo, no son datos reales de Ocaña.
- Las probabilidades y el botón «Simular llegada de la mula» están escritos a mano. Falta el servicio que reciba los mensajes de RescuENet y recalcule los sectores.
- El número del PMU que aparece en la pantalla de ayuda es de ejemplo.

## Parámetros para la URL

`?pantalla=N` (1 a 8 en RescuENet, 1 a 6 en Prioriza móvil), `?vista=app`, `?tema=dark`. En Prioriza web: `?vista=pase|bandeja|bitacora`, `?sector=ladera`, `?modo=comun`, `?mula=1`.
