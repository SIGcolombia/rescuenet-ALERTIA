# ALERTIA

**Alertas inteligentes para proteger vidas.**

Prototipos navegables para el reto 9 del Rally Latinoamericano de Innovación (optimización y priorización de recursos en la post-emergencia), caso Ocaña, Norte de Santander.

| Carpeta | Qué es | Quién la usa |
|---|---|---|
| `alertia-movil/` | App de campo de 8 pantallas: enviar un mensaje, pase de lista, tareas, mula de datos, verificación y privacidad | Vecino, vigía, brigadista |
| `alertia-web/` | Tablero de escritorio con mapa, ranking, pase de lista, bandeja de mensajes de ALERTIA y bitácora | Puesto de Mando (PMU) |
| `logo/` | Logo de ALERTIA en SVG, versiones negra y blanca, nombre completo e icono | Todas |
| `alertia-pmu-movil/` | Versión del Puesto de Mando para el celular | Coordinador en terreno |

Cada carpeta es HTML, CSS y JavaScript puros. No hay build ni dependencias: abre `index.html` o publica la raíz con GitHub Pages.

## Qué es real y qué es demostración

- Los datos de sectores, mensajes y equipos son de ejemplo, no son datos reales de Ocaña.
- Las probabilidades y el botón «Simular llegada de la mula» están escritos a mano. Falta el servicio que reciba los mensajes de ALERTIA y recalcule los sectores.
- El número del PMU que aparece en la pantalla de ayuda es de ejemplo.

## Parámetros para la URL

`?pantalla=N` (1 a 8 en ALERTIA, 1 a 6 en el PMU móvil), `?vista=app`, `?tema=dark`. En la web: `?inicio=1` (portada, es lo que se ve por defecto), `?vista=tablero|pase|bandeja|bitacora` (entra directo al tablero), `?sector=ladera`, `?modo=comun`, `?mula=1`.
