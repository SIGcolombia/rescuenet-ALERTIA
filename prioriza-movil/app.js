/* ==========================================================
   Prioriza · móvil
   Sin librerías ni recursos externos. Funciona sin internet.
   Datos de demostración (no son datos reales de Ocaña).
   ========================================================== */
(() => {
'use strict';

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const miles = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const dec = n => String(n).replace('.', ',');
const hhmm = m => { const h = Math.floor(m / 60) % 24, mi = m % 60; return `${h % 12 || 12}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'p. m.' : 'a. m.'}`; };
const INICIO = 11 * 60;                       // el evento empezó a las 11:00 a. m.
const horaEvento = m => Math.floor((m - INICIO) / 60);
const veces = n => (n === 1 ? '1 vez' : `${n} veces`);
const pct = s => `${s.prob} % ± ${s.margen} %`;
const nb = t => String(t).replace(/ (%|±)/g, ' $1').replace(/± /g, '± ');

/* ---------- iconos (SVG en línea) ---------- */
const I = body => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const ICON = {
  sms: I('<path d="M4 5h16v11H9l-5 4z"/>'),
  radio: I('<circle cx="12" cy="12" r="1.6"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 19.1a10 10 0 0 1 0-14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>'),
  app: I('<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>'),
  mula: I('<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>'),
  map: I('<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>'),
  clip: I('<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 2.5h6v4H9zM8.5 13l2.2 2.2 4.8-4.7"/>'),
  book: I('<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3M9 7.5h6M9 11h6"/>'),
  clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: I('<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>'),
  close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  truck: I('<path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
  amb: I('<path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7M8 8.8v4.4M5.8 11h4.4"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
  moto: I('<circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5 9 9h5l4.5 7.5M9 9 7.5 6.5H5M12 12.5h4"/>'),
  dron: I('<rect x="9.5" y="10" width="5" height="4" rx="1"/><path d="M9.5 10 7 7.5M14.5 10 17 7.5M9.5 14 7 16.5M14.5 14 17 16.5"/><circle cx="5.5" cy="6" r="2.2"/><circle cx="18.5" cy="6" r="2.2"/><circle cx="5.5" cy="18" r="2.2"/><circle cx="18.5" cy="18" r="2.2"/>'),
  warn: I('<path d="M12 3.5 2.5 20h19z"/><path d="M12 10v4.5M12 17.4v.1"/>'),
  check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  download: I('<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15"/>'),
  star: I('<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8z"/>'),
  block: I('<circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/>'),
  users: I('<circle cx="9" cy="8.5" r="3.2"/><path d="M3 20c.4-3.4 3-5.3 6-5.3s5.6 1.9 6 5.3M16 5.6a3.2 3.2 0 0 1 0 5.8M18.5 14.9c1.5.8 2.4 2.3 2.7 4.1"/>'),
  pulse: I('<path d="M3 12h4l2.5-6 5 12 2.5-6H21"/>'),
  eye: I('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>'),
  info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>'),
  send: I('<path d="M21 3 3 10.5l7 2.5 2.5 7z"/>')
};
const CANAL = { sms: 'SMS', radio: 'Radio LoRa', app: 'App ALERTIA', mula: 'Mula de datos' };

/* ---------- datos de demostración ---------- */
const RESP = {
  0: { t: 'No contestó', k: 'k-explorar', dash: true },
  1: { t: '1 · Estamos bien', k: 'k-ok' },
  2: { t: '2 · Daños', k: 'k-nar' },
  3: { t: '3 · Salud o víveres', k: 'k-amar' },
  4: { t: '4 · SOS', k: 'k-actuar' }
};
const ESTADO = {
  actuar: { txt: 'Actuar', k: 'k-actuar' },
  explorar: { txt: 'Explorar primero', k: 'k-explorar' },
  sinnovedad: { txt: 'Sin novedad confirmada', k: 'k-ok' }
};

// e = hora en que se escribió el mensaje, l = hora en que llegó al PMU
const SECTORS = [
  { id: 'ribera', nombre: 'Ribera del río', lineas: ['Ribera del río'], estado: 'actuar', sabe: true,
    hab: 1816, vuln: 50, amenaza: 'alta', tipo: 'inundación', prob: 84, margen: 8, reportes: 7,
    x: 128, y: 205, r: 34, necesita: ['Búsqueda y rescate', 'Maquinaria'],
    resp: [[2, 'SOS']], sinResp: 0,
    vigias: [{ rol: 'Presidente de la JAC', canal: 'sms', resp: 4, ult: 'respondió «4 · SOS» a las 2:00 p. m.' }],
    linea: [
      { c: 'sms', e: 3, l: 3, t: 'Presidente de la JAC respondió «4 · SOS» al pase de lista.' },
      { c: 'app', e: 3, l: 3, t: 'Habitante: «El agua entró a las casas de la orilla, hay adultos mayores».' },
      { c: 'radio', e: 2, l: 2, t: 'Voluntario de la Defensa Civil: «El río arrastró el puente peatonal».' }
    ] },
  { id: 'centro', nombre: 'Centro', lineas: ['Centro'], estado: 'actuar', sabe: true,
    hab: 3200, vuln: 35, amenaza: 'media', tipo: 'inundación', prob: 76, margen: 14, reportes: 10,
    x: 218, y: 148, r: 34, necesita: ['Salud', 'Evaluación estructural'],
    resp: [[2, 'daños']], sinResp: 0,
    vigias: [{ rol: 'Inspector de policía', canal: 'radio', resp: 2, ult: 'respondió «2 · Daños» a las 2:00 p. m.' }],
    linea: [
      { c: 'radio', e: 3, l: 3, t: 'Inspector de policía respondió «2 · Daños» al pase de lista.' },
      { c: 'app', e: 3, l: 3, t: 'Habitantes: fachadas caídas y escombros en la vía.' },
      { c: 'mula', e: 2, l: 3, t: 'Brigadista: «Dos edificios con daño estructural frente a la plaza».' }
    ] },
  { id: 'ladera', nombre: 'Ladera norte', lineas: ['Ladera norte'], estado: 'explorar', sabe: false, tag: 'no contesta', corte: true,
    hab: 2400, vuln: 70, amenaza: 'alta', tipo: 'deslizamiento', prob: 77, margen: 14, reportes: 1,
    x: 78, y: 84, r: 38,
    resp: [[1, 'daños']], sinResp: 2,
    vigias: [
      { rol: 'Presidenta de la JAC', canal: 'sms', resp: 0, ult: 'sin respuesta desde la hora 1' },
      { rol: 'Docente de la escuela rural', canal: 'radio', resp: 0, ult: 'sin respuesta desde la hora 1' }
    ],
    linea: [
      { c: 'sms', e: 3, l: 3, nc: true, t: 'Pase de lista de las 2:00 p. m. a la Presidenta de la JAC. No contestó.' },
      { c: 'mula', e: 2, l: 3, t: 'Habitante (app): «Se ven grietas nuevas en la ladera y se oyen ruidos».' },
      { c: 'sms', e: 1, l: 1, nc: true, t: 'Pase de lista de las 12:00 p. m. No contestó.' },
      { c: 'sms', e: 0, l: 0, t: 'Presidenta de la JAC respondió «2 · Daños».' }
    ] },
  { id: 'valta', nombre: 'Vereda alta', lineas: ['Vereda alta'], estado: 'explorar', sabe: false, tag: 'vía bloqueada', corte: true,
    hab: 640, vuln: 55, amenaza: 'alta', tipo: 'deslizamiento', prob: 62, margen: 24, reportes: 0,
    x: 288, y: 66, r: 28,
    resp: [], sinResp: 2,
    vigias: [{ rol: 'Inspector de la vereda', canal: 'radio', resp: 0, ult: 'nunca ha respondido' }],
    linea: [
      { c: 'radio', e: 3, l: 3, nc: true, t: 'Pase de lista de las 2:00 p. m. al Inspector de la vereda. No contestó.' },
      { c: 'mula', e: 2, l: 3, t: 'Brigadista: «La vía a la vereda está cortada por un derrumbe».' },
      { c: 'radio', e: 1, l: 1, nc: true, t: 'Pase de lista de las 12:00 p. m. No contestó.' }
    ] },
  { id: 'sur', nombre: 'Barrio sur', lineas: ['Barrio sur'], estado: 'sinnovedad', sabe: true,
    hab: 2100, vuln: 30, amenaza: 'baja', tipo: 'inundación', prob: 12, margen: 9, reportes: 2,
    x: 214, y: 262, r: 26,
    resp: [[1, 'estamos bien']], sinResp: 0,
    vigias: [{ rol: 'Presidente de la JAC', canal: 'sms', resp: 1, ult: 'respondió «1 · Estamos bien» a las 2:00 p. m.' }],
    linea: [
      { c: 'sms', e: 3, l: 3, t: 'Presidente de la JAC respondió «1 · Estamos bien».' },
      { c: 'app', e: 2, l: 2, t: 'Habitante: «Sin daños, estamos ayudando a los vecinos».' }
    ] },
  { id: 'valle', nombre: 'Vereda del valle', lineas: ['Vereda del', 'valle'], estado: 'sinnovedad', sabe: true,
    hab: 900, vuln: 40, amenaza: 'media', tipo: 'inundación', prob: 18, margen: 12, reportes: 1,
    x: 54, y: 270, r: 24,
    resp: [[1, 'estamos bien']], sinResp: 0,
    vigias: [{ rol: 'Presidenta de la JAC', canal: 'radio', resp: 1, ult: 'respondió «1 · Estamos bien» a las 2:00 p. m.' }],
    linea: [
      { c: 'radio', e: 3, l: 3, t: 'Presidenta de la JAC respondió «1 · Estamos bien».' },
      { c: 'app', e: 2, l: 2, t: 'Habitante: «Camino con barro, pero todos estamos bien».' }
    ] },
  { id: 'llana', nombre: 'Vereda llana', lineas: ['Vereda llana'], estado: 'sinnovedad', sabe: true,
    hab: 750, vuln: 35, amenaza: 'baja', tipo: 'inundación', prob: 9, margen: 7, reportes: 1,
    x: 306, y: 272, r: 24,
    resp: [[1, 'estamos bien']], sinResp: 0,
    vigias: [{ rol: 'Docente de la escuela', canal: 'sms', resp: 1, ult: 'respondió «1 · Estamos bien» a las 2:00 p. m.' }],
    linea: [{ c: 'sms', e: 3, l: 3, t: 'Docente de la escuela respondió «1 · Estamos bien».' }] },
  { id: 'hosp', nombre: 'Hospital y universidad', lineas: ['Hospital y', 'universidad'], estado: 'sinnovedad', sabe: true,
    hab: 1500, vuln: 25, amenaza: 'media', tipo: 'sismo', prob: 6, margen: 5, reportes: 3,
    x: 306, y: 172, r: 24,
    resp: [[1, 'estamos bien']], sinResp: 0,
    vigias: [{ rol: 'Jefe de urgencias', canal: 'radio', resp: 1, ult: 'respondió «1 · Estamos bien» a las 2:00 p. m.' }],
    linea: [
      { c: 'radio', e: 3, l: 3, t: 'Jefe de urgencias respondió «1 · Estamos bien». Atención normal.' },
      { c: 'app', e: 2, l: 2, t: 'Brigadista: «Sin daño estructural, la planta eléctrica funciona».' },
      { c: 'app', e: 1, l: 1, t: 'Universidad evacuada sin heridos.' }
    ] }
];
const byId = Object.fromEntries(SECTORS.map(s => [s.id, s]));

const EQUIPOS = [
  { id: 'bomberos1', nombre: 'Bomberos 1', tipo: 'camión', icon: 'truck' },
  { id: 'dc3', nombre: 'Defensa Civil 3', tipo: 'moto', icon: 'moto' },
  { id: 'dron1', nombre: 'Dron 1', tipo: '', icon: 'dron' },
  { id: 'cruzroja2', nombre: 'Cruz Roja 2', tipo: 'ambulancia', icon: 'amb' }
];
const eqById = Object.fromEntries(EQUIPOS.map(e => [e.id, e]));
const eqNombre = id => { const e = eqById[id]; return e.tipo ? `${e.nombre} · ${e.tipo}` : e.nombre; };

// [km, minutos, nota]. Si bloq es true el equipo no puede llegar por tierra.
const RUTA = {
  ribera: { bomberos1: [1.2, 6], dc3: [0.9, 4], dron1: [1.0, 3], cruzroja2: [1.8, 8] },
  centro: { bomberos1: [0.4, 3], dc3: [0.6, 3], dron1: [0.5, 2], cruzroja2: [0.3, 2] },
  ladera: { bomberos1: [4.8, 22], dc3: [3.9, 18], dron1: [2.9, 6], cruzroja2: [4.5, 20] },
  valta: { bomberos1: [8.2, null, true], dc3: [8.2, 40], dron1: [6.1, 11], cruzroja2: [8.6, null, true] }
};
const rutaDe = (sid, eid) => {
  const r = (RUTA[sid] && RUTA[sid][eid]) || [2.5, 10];
  return { km: r[0], min: r[1], bloq: r[2] === true };
};
const PRIORIDAD = {
  ribera: ['bomberos1', 'dc3', 'dron1'],
  centro: ['bomberos1', 'dc3', 'dron1'],
  ladera: ['dron1', 'dc3', 'bomberos1'],
  valta: ['dron1', 'dc3'],
  _: ['dc3', 'dron1', 'bomberos1']
};
const recomendado = (sid, eqs) => (PRIORIDAD[sid] || PRIORIDAD._).find(id => eqs[id].estado === 'disponible' && !rutaDe(sid, id).bloq) || null;
const razon = (sid, eid) => {
  if (eid === 'dron1') return byId[sid].corte ? 'porque la vía está bloqueada' : 'porque es el que llega primero';
  if (eid === 'bomberos1') return 'porque lleva herramienta de rescate y maquinaria';
  return 'porque es el que llega primero';
};

const SEED = [
  { min: 13 * 60 + 40, sectorId: 'ribera', sector: 'Ribera del río', decision: 'Esperar al pase de lista de las 2:00 p. m.', motivo: 'Los mensajes eran pocos y contradictorios.', resp: 'Coordinador de gestión del riesgo', sistema: 'Recomendaba actuar en Ribera del río (52 % ± 20 %)', siguio: false, resultado: 'El pase confirmó SOS. La ayuda salió 20 minutos después.', est: 'cerrado' },
  { min: 13 * 60 + 15, sectorId: 'centro', sector: 'Centro', decision: 'Asignar Cruz Roja 2 · ambulancia', motivo: 'Heridos reportados cerca de la plaza.', resp: 'Coordinador de gestión del riesgo', sistema: 'Recomendaba actuar en Centro (71 % ± 15 %) con Cruz Roja 2 · ambulancia', siguio: true, resultado: 'En ruta hacia el hospital con 2 heridos.', est: 'curso' },
  { min: 12 * 60 + 20, sectorId: 'ladera', sector: 'Ladera norte', decision: 'Enviar a verificar con Defensa Civil 3 · moto', motivo: 'Sin respuesta y amenaza alta de deslizamiento.', resp: 'Jefe de operaciones del PMU', sistema: 'Recomendaba explorar primero Ladera norte (68 % ± 22 %)', siguio: true, resultado: 'No llegó, el sendero estaba cortado por un derrumbe.', est: 'fallido' }
];
const EST = { curso: { t: 'En curso', k: 'k-amar' }, cerrado: { t: 'Cerrado', k: 'k-ok' }, fallido: { t: 'No concluyó', k: 'k-nar' } };

/* ---------- estado ---------- */
const equiposIni = () => ({
  bomberos1: { estado: 'disponible' }, dc3: { estado: 'disponible' },
  dron1: { estado: 'disponible' }, cruzroja2: { estado: 'enruta', destino: 'Centro' }
});
const baseState = () => ({
  tab: 'tablero', mode: 'prioriza', sheet: null, pase: { enviado: null },
  equipos: equiposIni(), bitacora: SEED.map(x => ({ ...x })), minutos: 14 * 60 + 34, toast: null
});
const PRESETS = [
  { t: 'Tablero principal', s: 'Qué hacer ahora y mapa de sectores', make: () => baseState() },
  { t: 'Tablero común', s: 'Lo que vería un tablero que solo cuenta mensajes', make: () => ({ ...baseState(), mode: 'comun' }) },
  { t: 'Detalle de sector', s: 'Por qué Ladera norte está en «Explorar primero»', make: () => ({ ...baseState(), sheet: { type: 'sector', id: 'ladera', fresh: false } }) },
  { t: 'Pase de lista', s: 'Quién contestó y quién no', make: () => ({ ...baseState(), tab: 'pase' }) },
  { t: 'Asignar equipo', s: 'Recomendación y motivo obligatorio', make: () => { const b = baseState(); b.sheet = { type: 'asignar', id: 'valta', intent: 'verificar', team: recomendado('valta', b.equipos), motivo: '', fresh: false }; return b; } },
  { t: 'Bitácora de decisiones', s: 'Rendición de cuentas de cada decisión', make: () => ({ ...baseState(), tab: 'bitacora' }) }
];

let st = baseState();
let view = 'gallery';
let toastTimer = 0;
const narrowMQ = window.matchMedia('(max-width: 520px)');
const isNarrow = () => narrowMQ.matches;

/* ---------- piezas pequeñas ---------- */
const themeNow = () => document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const themeIcon = () => (themeNow() === 'dark' ? ICON.sun : ICON.moon);

function rangeBar(s, full) {
  const lo = Math.max(0, s.prob - s.margen), hi = Math.min(100, s.prob + s.margen);
  if (!full) {
    return `<span class="rbar ${ESTADO[s.estado].k} ${s.estado === 'explorar' ? 'dash' : ''}" aria-hidden="true"><i class="band" style="left:${lo}%;width:${hi - lo}%"></i><i class="pt" style="left:${s.prob}%"></i></span>`;
  }
  return `<div class="rfull ${ESTADO[s.estado].k}" role="img" aria-label="Probabilidad ${s.prob} por ciento, con margen entre ${lo} y ${hi} por ciento">
    <i class="band" style="left:${lo}%;width:${hi - lo}%"></i><i class="pt" style="left:${s.prob}%"></i>
    ${lo >= 16 ? '<span class="tk min">0 %</span>' : ''}<span class="tk edge" style="left:${lo}%">${lo} %</span><span class="tk edge" style="left:${hi}%">${hi} %</span>${hi <= 84 ? '<span class="tk max">100 %</span>' : ''}
  </div>`;
}
const respChip = r => `<span class="rchip ${RESP[r].k} ${RESP[r].dash ? 'dash' : ''}">${RESP[r].t}</span>`;
const tagEstado = s => `<span class="tagc ${ESTADO[s.estado].k} ${s.estado === 'explorar' ? 'dash' : ''}">${ESTADO[s.estado].txt}</span>`;

/* ---------- mapa ---------- */
const MAP_BASE = `
  <rect class="map-bg" width="360" height="330"/>
  <path class="map-slope" d="M0 0H172C160 52 122 104 62 122C32 130 12 128 0 126Z"/>
  <path class="map-contour" d="M0 34C62 40 112 24 152 0M0 64C72 74 132 54 176 22M0 94C60 102 114 84 158 54"/>
  <path class="map-river" d="M150 0C160 70 112 120 128 195S152 280 112 330"/>
  <path class="map-road" d="M0 140C90 132 170 150 360 128M224 0C222 90 232 210 214 330M0 236C110 230 220 246 360 234M298 0C300 70 306 120 307 330"/>
  <g class="block-mark" transform="translate(302 134)"><rect x="-11" y="-6" width="22" height="12" rx="3"/><path d="M-6 -6l-4 12M0 -6l-4 12M6 -6l-4 12"/></g>
  <text class="map-lbl" x="46" y="12">LADERA</text>
  <text class="map-lbl" x="170" y="324">RÍO</text>`;

function sectorG(s, r, comun) {
  const { x, y } = s;
  const k = comun ? 'comun' : s.estado;
  let inner = '', tag = '';
  if (!comun) {
    if (s.estado === 'actuar') inner = `<text class="in-n" x="${x}" y="${y + 5.5}">${s.prob} %</text>`;
    else if (s.estado === 'explorar') inner = `<text class="in-q" x="${x}" y="${y + 9}">?</text>`;
    else inner = `<path class="in-ok" d="M${x - 6} ${y + 1}l4.5 4.5L${x + 7} ${y - 5}"/>`;
    if (s.tag) {
      const w = Math.round(s.tag.length * 5.8 + 18);
      tag = `<g class="tag"><rect x="${x - w / 2}" y="${y - r - 25}" width="${w}" height="18" rx="9"/><text x="${x}" y="${y - r - 12.5}">${s.tag}</text></g>`;
    }
  }
  const ly = y + r + 13;
  let label = s.lineas.map((t, i) => `<text class="lbl-name" x="${x}" y="${ly + i * 12}">${esc(t)}</text>`).join('');
  if (comun) label += `<text class="lbl-rep ${s.reportes === 0 ? 'zero' : ''}" x="${x}" y="${ly + s.lineas.length * 12}">${s.reportes} ${s.reportes === 1 ? 'reporte' : 'reportes'}</text>`;
  const aria = comun ? `${s.nombre}, ${s.reportes} reportes` : `${s.nombre}, ${ESTADO[s.estado].txt}, probabilidad ${pct(s)}`;
  return `<g class="sector-g" data-action="sector" data-id="${s.id}" role="button" tabindex="0" aria-label="${esc(aria)}">
    <circle cx="${x}" cy="${y}" r="${Math.max(r, 20)}" fill="transparent"/>
    <circle class="ccl ${k}" cx="${x}" cy="${y}" r="${r}"/>${inner}${tag}${label}</g>`;
}

function mapSvg(mode) {
  const comun = mode === 'comun';
  const rOf = s => (comun ? Math.max(3.5, 5 + s.reportes * 4.2) : s.r);
  const orden = [...SECTORS].sort((a, b) => rOf(b) - rOf(a));
  return `<svg class="map" viewBox="0 0 360 330" role="group" aria-label="Mapa esquemático de los ocho sectores">${MAP_BASE}${orden.map(s => sectorG(s, rOf(s), comun)).join('')}</svg>`;
}

function legend(mode) {
  if (mode === 'comun') {
    return `<div class="legend"><span class="lg k-nar"><i class="sw fill"></i>Tamaño = número de mensajes</span><span class="lg k-neutro"><i class="sw" style="border-style:dotted"></i>Sin mensajes = casi invisible</span></div>`;
  }
  return `<div class="legend">
    <span class="lg k-actuar"><i class="sw fill"></i>Actuar</span>
    <span class="lg k-explorar"><i class="sw dash"></i>Explorar · no sabemos</span>
    <span class="lg k-ok"><i class="sw"></i>Sin novedad</span></div>`;
}

/* ---------- pantallas ---------- */
function topbar(s) {
  const h = horaEvento(s.minutos);
  return `<header class="topbar">
    <div class="brand"><span class="logo">${ICON.pulse}</span><div><b>Prioriza</b><small>Puesto de Mando de Ocaña</small></div></div>
    <div class="hora" aria-label="Hora ${h} desde el inicio del evento"><b>Hora ${h}</b><small>desde el inicio</small></div>
    <button type="button" class="icon-btn" data-action="theme" data-theme-btn aria-label="Cambiar entre tema claro y oscuro">${themeIcon()}</button>
  </header>`;
}

function tabbar(s) {
  const sinResp = SECTORS.filter(x => !x.sabe).length;
  const tab = (id, ic, txt, extra = '') => `<button type="button" class="tab" data-action="tab" data-tab="${id}" ${s.tab === id ? 'aria-current="page"' : ''}>${ICON[ic]}<span>${txt}</span>${extra}</button>`;
  return `<nav class="tabbar" aria-label="Secciones">
    ${tab('tablero', 'map', 'Tablero')}
    ${tab('pase', 'clip', 'Pase de lista', `<span class="badge" aria-label="${sinResp} sectores sin respuesta">${sinResp}</span>`)}
    ${tab('bitacora', 'book', 'Bitácora')}
  </nav>`;
}

function knowCard() {
  const sabe = SECTORS.filter(s => s.sabe).length;
  const no = SECTORS.filter(s => !s.sabe);
  const segs = [...SECTORS].sort((a, b) => b.sabe - a.sabe).map(s => `<i class="${s.sabe ? '' : 'no'}"></i>`).join('');
  return `<section class="card know" aria-label="Cobertura de información">
    <p class="eyebrow">Lo que sabemos y lo que no</p>
    <p class="know-main">Sabemos algo de <b class="big">${sabe} de ${SECTORS.length}</b> sectores</p>
    <div class="segs" aria-hidden="true">${segs}</div>
    <p class="know-sub"><span class="sq"></span><span>Sin información reciente de <b>${no.map(n => n.nombre).join('</b> y <b>')}</b>. Que no contesten también es un dato.</span></p>
  </section>`;
}

function canales() {
  return `<div class="chips-scroll" role="list" aria-label="Estado de canales">
    <span class="chip st-ok" role="listitem"><i class="dot"></i>SMS activo</span>
    <span class="chip st-warn" role="listitem"><i class="dot"></i>Radio LoRa 3 de 4 nodos</span>
    <span class="chip" role="listitem"><i class="dot"></i>Última mula hace 40 min</span>
  </div>`;
}

function queHacer() {
  const a = SECTORS.filter(s => s.estado === 'actuar').sort((x, y) => y.prob - x.prob)[0];
  const e = SECTORS.filter(s => s.estado === 'explorar').sort((x, y) => y.prob - x.prob)[0];
  const vuln = Math.round(a.hab * a.vuln / 100);
  return `<h2 class="h2">Qué hacer ahora</h2>
  <article class="act k-actuar">
    <p class="eyebrow" style="color:var(--actuar-t)">Prioridad 1</p>
    <h3 class="tit">Ayuda ya · ${a.nombre}</h3>
    <p class="body">Cerca de <span class="num">${miles(vuln)}</span> personas vulnerables probablemente necesitan ayuda <b>(${a.prob} %)</b>.</p>
    <div class="chips">${a.necesita.map(n => `<span class="chip tint">${n}</span>`).join('')}</div>
    <div class="btns">
      <button type="button" class="btn primary" data-action="asignar" data-id="${a.id}" data-intent="asignar">Asignar equipo</button>
      <button type="button" class="btn" data-action="sector" data-id="${a.id}">¿Por qué?</button>
    </div>
  </article>
  <article class="act k-explorar dash">
    <p class="eyebrow" style="color:var(--explorar-t)">No sabemos</p>
    <h3 class="tit">Mandar a mirar · ${e.nombre}</h3>
    <p class="body"><b>${miles(e.hab)} habitantes.</b> Nadie contestó el último pase de lista.</p>
    <div class="btns">
      <button type="button" class="btn primary" data-action="asignar" data-id="${e.id}" data-intent="verificar">Enviar a verificar</button>
      <button type="button" class="btn" data-action="sector" data-id="${e.id}">¿Por qué?</button>
    </div>
  </article>`;
}

function lista(titulo, estado, sub, items, subtituloItem) {
  const k = ESTADO[estado].k, dash = estado === 'explorar' ? 'dash' : '';
  return `<section class="list ${k}" aria-label="${titulo}">
    <header><h3>${titulo}</h3><span class="count">${items.length}</span></header>
    <p class="sub">${sub}</p>
    <ol>${items.map((s, i) => `<li><button type="button" class="row ${dash}" data-action="sector" data-id="${s.id}" aria-label="${esc(`${i + 1}. ${s.nombre}, ${pct(s)}`)}">
      <span class="n">${i + 1}</span>
      <span class="rt"><b>${s.nombre}</b><small>${subtituloItem(s)}</small></span>
      <span class="pv"><b>${pct(s)}</b>${rangeBar(s)}</span></button></li>`).join('')}</ol>
  </section>`;
}

function listas() {
  const por = e => SECTORS.filter(s => s.estado === e).sort((a, b) => b.prob - a.prob);
  return `${lista('Actuar', 'actuar', 'Alta probabilidad e información reciente.', por('actuar'), s => `${miles(s.hab)} hab. · ${s.vuln} % vulnerables`)}
  ${lista('Explorar primero', 'explorar', 'Alta probabilidad, pero sin información reciente.', por('explorar'), s => (s.tag === 'no contesta' ? 'No contesta' : 'Vía bloqueada') + ` · ${miles(s.hab)} hab.`)}
  ${lista('Sin novedad confirmada', 'sinnovedad', 'Respondieron «estamos bien» en el último pase.', por('sinnovedad'), s => `Respondió «${RESP[s.vigias[0].resp].t}»`)}`;
}

function rankingComun() {
  const orden = [...SECTORS].sort((a, b) => b.reportes - a.reportes || a.nombre.localeCompare(b.nombre, 'es'));
  const max = Math.max(...orden.map(s => s.reportes)) || 1;
  const pos = id => orden.findIndex(s => s.id === id) + 1;
  const l = byId.ladera, v = byId.valta;
  return `<h2 class="h2">Orden por número de mensajes</h2>
  <section class="list rank k-nar" aria-label="Orden por número de mensajes"><ol>
    ${orden.map((s, i) => `<li><button type="button" class="row" data-action="sector" data-id="${s.id}">
      <span class="n">${i + 1}</span>
      <span class="rt"><b>${s.nombre}</b><small>${s.reportes} ${s.reportes === 1 ? 'reporte' : 'reportes'} · ${miles(s.hab)} hab.</small>
      <span class="mbar" aria-hidden="true"><i style="width:${Math.round(s.reportes / max * 100)}%"></i></span></span></button></li>`).join('')}
  </ol></section>
  <p class="callout"><b>${l.nombre}</b> (${miles(l.hab)} habitantes, ${l.vuln} % vulnerables) quedaría en el puesto ${pos(l.id)}.º y <b>${v.nombre}</b> en el ${pos(v.id)}.º. Lo que no manda mensajes no aparece.</p>
  <button type="button" class="btn neutral block" data-action="mode" data-mode="prioriza">Ver como Prioriza</button>`;
}

function tableroScreen(s) {
  const comun = s.mode === 'comun';
  return `<div class="stack">
    ${knowCard()}
    <div class="modebar"><span class="lbl">Ver como</span>
      <div class="seg" role="group" aria-label="Ver como">
        <button type="button" data-action="mode" data-mode="prioriza" aria-pressed="${!comun}">Prioriza</button>
        <button type="button" data-action="mode" data-mode="comun" aria-pressed="${comun}">Tablero común</button>
      </div></div>
    ${canales()}
    ${comun ? `<div class="banner" role="note">${ICON.warn}<span>Así ordenaría un tablero que solo cuenta mensajes. Lo que no manda mensajes no aparece.</span></div>` : ''}
    <section class="card mapcard" aria-label="Mapa de sectores">
      <header><h2>Mapa de sectores</h2><small>Toca un sector</small></header>
      ${mapSvg(s.mode)}${legend(s.mode)}
    </section>
    ${comun ? rankingComun() : queHacer() + listas()}
  </div>`;
}

function paseScreen(s) {
  const sin = SECTORS.filter(x => !x.sabe).length;
  const orden = [...SECTORS].sort((a, b) => (a.sabe - b.sabe));
  return `<div class="stack">
    <section class="card">
      <p class="eyebrow">Pase de lista cada dos horas</p>
      <div class="tiles">
        <div class="tile"><small>Último pase</small><b>2:00&nbsp;p.&nbsp;m.</b></div>
        <div class="tile mor"><small>Sin ninguna respuesta</small><b>${sin} sectores</b></div>
        <div class="tile"><small>Próximo</small><b>4:00&nbsp;p.&nbsp;m.</b></div>
      </div>
      ${s.pase.enviado ? `<p class="sent">${ICON.send}<span>Pase enviado a las ${s.pase.enviado} por SMS y radio. Esperando respuestas de ${SECTORS.reduce((n, x) => n + x.vigias.length, 0)} vigías.</span></p>` : ''}
      <button type="button" class="btn neutral block" style="margin-top:12px" data-action="pase-ahora" ${s.pase.enviado ? 'disabled' : ''}>${ICON.clip}${s.pase.enviado ? 'Pase enviado' : 'Hacer pase de lista ahora'}</button>
    </section>
    <div class="pl-legend" aria-label="Significado de las respuestas">${[1, 2, 3, 4, 0].map(respChip).join('')}</div>
    ${orden.map(x => `<article class="pl-card ${x.sabe ? '' : 'nc'}">
      <h3>${x.nombre}</h3>
      ${x.vigias.map(v => `<div class="pl-row"><div class="who"><b>${v.rol}</b><small>${ICON[v.canal]}${CANAL[v.canal]}</small></div>${respChip(v.resp)}</div>`).join('')}
    </article>`).join('')}
  </div>`;
}

function bitacoraScreen(s) {
  return `<div class="stack">
    <h2 class="h2" style="margin:4px 2px 0">Bitácora de decisiones</h2>
    <button type="button" class="btn ghost block" data-action="export">${ICON.download}Exportar informe</button>
    <p class="note">${ICON.info}<span>Cada decisión guarda la recomendación del sistema para la rendición de cuentas.</span></p>
    <ol class="log">${s.bitacora.map(b => `<li class="entry ${EST[b.est].k}">
      <div class="top"><div><p class="when">Hora ${horaEvento(b.min)} · ${hhmm(b.min)}</p><p class="sec">${b.sector}</p></div>
        <span class="tagc ${EST[b.est].k}">${EST[b.est].t}</span></div>
      <p class="dec">${esc(b.decision)}</p>
      <dl class="kv"><dt>Responsable</dt><dd>${b.resp}</dd><dt>Motivo</dt><dd>${esc(b.motivo)}</dd><dt>Resultado</dt><dd>${esc(b.resultado)}</dd></dl>
      <div class="sys"><b>El sistema recomendaba</b>${esc(nb(b.sistema))}</div>
      <div class="pills"><span class="tagc ${b.siguio ? 'k-ok' : 'k-nar'}">${b.siguio ? 'Siguió la recomendación' : 'Se apartó de la recomendación'}</span></div>
    </li>`).join('')}</ol>
  </div>`;
}

/* ---------- hojas inferiores ---------- */
function sectorSheet(s) {
  const x = byId[s.sheet.id], k = ESTADO[x.estado].k;
  const lo = Math.max(0, x.prob - x.margen), hi = Math.min(100, x.prob + x.margen);
  const why = [
    ['users', `${miles(x.hab)} habitantes`, false],
    ['users', `${x.vuln} % de población vulnerable`, x.vuln >= 50],
    ['warn', `Amenaza ${x.amenaza} de ${x.tipo}`, x.amenaza === 'alta'],
    ...x.resp.map(([n, t]) => ['sms', `${veces(n)} el vigía respondió «${t}»`, false]),
    ...(x.sinResp ? [['clock', `${x.sinResp} pases de lista sin respuesta`, true]] : []),
    ['pulse', `Probabilidad ${pct(x)}`, true]
  ];
  const tl = [...x.linea].sort((a, b) => b.l - a.l).map(m => {
    const tarde = m.e !== m.l;
    return `<li class="${m.nc ? 'nc' : ''} ${tarde ? 'late' : ''}"><span class="tic">${ICON[m.c]}</span>
      <div><p>${esc(m.t)}</p>${tarde
        ? `<span class="late-m">Escrito: hora ${m.e} · Llegó: hora ${m.l} (${CANAL[m.c].toLowerCase()})</span>`
        : `<p class="meta">Hora ${m.l} · ${CANAL[m.c]}</p>`}</div></li>`;
  }).join('');
  const prim = x.estado === 'explorar' ? 'verificar' : 'asignar';
  return `<div class="backdrop" data-action="cerrar"></div>
  <section class="sheet tall ${s.sheet.fresh ? 'anim' : ''} ${k}" role="dialog" aria-modal="true" aria-label="Detalle de ${esc(x.nombre)}" tabindex="-1">
    <div class="grab"></div>
    <div class="sheet-h"><div><h2>${x.nombre}</h2>${tagEstado(x)}</div>
      <button type="button" class="icon-btn" data-action="cerrar" aria-label="Cerrar">${ICON.close}</button></div>
    <div class="sheet-b">
      <section><h3>Por qué está aquí</h3><ul class="why">${why.map(([ic, t, hot]) => `<li class="${hot ? 'hot' : ''}">${ICON[ic]}<span>${t}</span></li>`).join('')}</ul></section>
      <section><h3>Probabilidad de que necesite ayuda</h3>
        <div class="prob"><b>${pct(x)}</b></div>${rangeBar(x, true)}
        <p class="cap">La probabilidad real está entre ${lo} % y ${hi} %. Mientras más grande el margen, menos sabemos.</p></section>
      <section><h3>Vigías del sector</h3><ul class="vig">${x.vigias.map(v => `<li><span class="box">${ICON[v.canal]}</span><span><b>${v.rol}</b> · ${CANAL[v.canal]} · <span class="${v.resp === 0 ? 'silent' : ''}">${v.ult}</span></span></li>`).join('')}</ul></section>
      <section><h3>Mensajes recibidos</h3><ol class="tl">${tl}</ol></section>
    </div>
    <div class="sheet-f">
      <button type="button" class="btn ${prim === 'verificar' ? 'primary k-explorar' : 'ghost'}" data-action="asignar" data-id="${x.id}" data-intent="verificar">Enviar a verificar</button>
      <button type="button" class="btn ${prim === 'asignar' ? 'primary k-actuar' : 'ghost'}" data-action="asignar" data-id="${x.id}" data-intent="asignar">Asignar equipo</button>
    </div>
  </section>`;
}

const validar = () => !!(st.sheet && st.sheet.type === 'asignar' && st.sheet.team && st.sheet.motivo.trim().length >= 5);

function asignarSheet(s) {
  const sh = s.sheet, x = byId[sh.id];
  const reco = recomendado(x.id, s.equipos);
  const lista = EQUIPOS.map(e => {
    const est = s.equipos[e.id], ru = rutaDe(x.id, e.id);
    const libre = est.estado === 'disponible' && !ru.bloq;
    const estado = ru.bloq ? `<i class="dot off"></i>No puede llegar · vía bloqueada`
      : est.estado === 'disponible' ? `<i class="dot"></i>Disponible` : `<i class="dot off"></i>En ruta · ${est.destino}`;
    const dist = ru.bloq ? `${dec(ru.km)} km` : `${dec(ru.km)} km · ${ru.min} min`;
    return `<button type="button" class="team" role="radio" aria-checked="${sh.team === e.id}" data-action="team" data-id="${e.id}" ${libre ? '' : 'disabled'}>
      <span class="t-ic">${ICON[e.icon]}</span>
      <span class="t-tx"><b>${eqNombre(e.id)}</b><small>${estado}</small><small class="dist">${dist}</small></span>
      ${reco === e.id ? '<em class="rec">Recomendado</em>' : ''}</button>`;
  }).join('');
  const ok = validar();
  const aparta = sh.team && reco && sh.team !== reco;
  return `<div class="backdrop" data-action="cerrar"></div>
  <section class="sheet ${s.sheet.fresh ? 'anim' : ''}" role="dialog" aria-modal="true" aria-label="Asignar equipo" tabindex="-1">
    <div class="grab"></div>
    <div class="sheet-h"><div><h2>Asignar equipo</h2><p>${x.nombre} · ${sh.intent === 'verificar' ? 'enviar a verificar' : 'ayuda inmediata'}</p></div>
      <button type="button" class="icon-btn" data-action="cerrar" aria-label="Cerrar">${ICON.close}</button></div>
    <div class="sheet-b">
      ${reco ? `<p class="reco">${ICON.star}<span><b>Recomendado: ${eqNombre(reco)}</b>, ${razon(x.id, reco)}.</span></p>`
        : `<p class="reco none">${ICON.warn}<span><b>Ningún equipo disponible puede llegar.</b> Libera uno o prueba otro canal.</span></p>`}
      <div class="teams" role="radiogroup" aria-label="Equipos disponibles">${lista}</div>
      ${aparta ? `<p class="warnline">${ICON.warn}<span>Elegiste un equipo distinto al recomendado. Queda registrado en la bitácora.</span></p>` : ''}
      <div class="field"><label for="motivo-${x.id}">Motivo de la decisión <span>(obligatorio)</span></label>
        <textarea id="motivo-${x.id}" data-role="motivo" placeholder="Por qué tomas esta decisión">${esc(sh.motivo)}</textarea>
        <small>Se guarda en la bitácora junto con la recomendación del sistema.</small></div>
    </div>
    <p class="hint" ${ok ? 'hidden' : ''}>Elige un equipo y escribe el motivo para confirmar.</p>
    <div class="sheet-f"><button type="button" class="btn neutral" data-action="confirmar" ${ok ? '' : 'disabled'}>Confirmar y guardar en bitácora</button></div>
  </section>`;
}

/* ---------- montaje ---------- */
function appHtml(s) {
  const pantalla = s.tab === 'pase' ? paseScreen(s) : s.tab === 'bitacora' ? bitacoraScreen(s) : tableroScreen(s);
  const hoja = !s.sheet ? '' : s.sheet.type === 'sector' ? sectorSheet(s) : asignarSheet(s);
  return `<div class="app">${topbar(s)}<main class="content" tabindex="-1">${pantalla}</main>${tabbar(s)}${hoja}${s.toast ? `<div class="toast" role="status">${esc(s.toast)}</div>` : ''}</div>`;
}

function phone(s, live) {
  return `<div class="phone" ${live ? 'data-live' : 'aria-hidden="true"'}>
    <div class="screen"><span class="notch"></span>
      <div class="statusbar"><span>${hhmm(s.minutos).split(' ')[0]}</span>
        <span class="sb-r"><span class="sb-sig"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:11px"></i></span><span class="sb-bat"><i></i></span></span></div>
      ${appHtml(s)}
    </div></div>`;
}

function renderStage() {
  const stage = $('#stage');
  if (isNarrow() && view === 'gallery') view = 'app';
  document.querySelectorAll('[data-action="view"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  if (view === 'gallery') {
    stage.innerHTML = `<div class="gallery">${PRESETS.map((p, i) => `<figure class="gal-item">
      <div class="phone-wrap gal-open" role="button" tabindex="0" data-action="open-preset" data-i="${i}" aria-label="Abrir «${p.t}» en la app">${phone(p.make(), false)}</div>
      <figcaption class="gal-cap">${i + 1} · ${p.t}<small>${p.s}</small></figcaption></figure>`).join('')}</div>`;
  } else {
    stage.innerHTML = `<div class="phone-wrap live">${phone(st, true)}</div>`;
    fit();
  }
  syncThemeButtons();
}

function draw(reset) {
  const wrap = $('.phone-wrap.live');
  if (!wrap) return;
  const c = $('.content', wrap), sb = $('.sheet-b', wrap), had = sb && sb.dataset.k;
  const sc = c ? c.scrollTop : 0, sbs = sb ? sb.scrollTop : 0;
  wrap.innerHTML = phone(st, true);
  const c2 = $('.content', wrap), sb2 = $('.sheet-b', wrap);
  if (c2 && !reset) c2.scrollTop = sc;
  if (sb2 && sb && !reset && !st.sheet.fresh) sb2.scrollTop = sbs;
  if (st.sheet && st.sheet.fresh) { st.sheet.fresh = false; const sh = $('.sheet', wrap); if (sh) sh.focus({ preventScroll: true }); }
}

function fit() {
  const wrap = $('.phone-wrap.live');
  if (!wrap) return;
  if (isNarrow()) { wrap.style.removeProperty('--s'); return; }
  const arriba = $('#showcase').offsetHeight, pie = $('#showcase-foot').offsetHeight;
  const s = Math.min(1, (innerHeight - arriba - pie - 28) / 832, (innerWidth - 32) / 410);
  wrap.style.setProperty('--s', Math.max(.5, s).toFixed(3));
}

function syncThemeButtons() {
  document.querySelectorAll('[data-theme-btn]').forEach(b => { b.innerHTML = themeIcon(); });
}

/* ---------- acciones ---------- */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('prioriza-tema', t); } catch (e) { /* sin almacenamiento */ }
  syncThemeButtons();
}

function toast(msg) {
  st.toast = msg; draw();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { st.toast = null; draw(); }, 3200);
}

function confirmar() {
  if (!validar()) return;
  const sh = st.sheet, x = byId[sh.id], reco = recomendado(x.id, st.equipos);
  st.minutos += 2;
  st.bitacora.unshift({
    min: st.minutos, sectorId: x.id, sector: x.nombre,
    decision: `${sh.intent === 'verificar' ? 'Enviar a verificar con' : 'Asignar'} ${eqNombre(sh.team)}`,
    motivo: sh.motivo.trim(), resp: 'Coordinador de gestión del riesgo',
    sistema: `Recomendaba ${x.estado === 'explorar' ? 'explorar primero' : 'actuar en'} ${x.nombre} (${pct(x)})${reco ? ` con ${eqNombre(reco)}` : ''}`,
    siguio: sh.team === reco, resultado: 'En curso, el equipo va en camino.', est: 'curso'
  });
  st.equipos[sh.team] = { estado: 'enruta', destino: x.nombre };
  st.sheet = null; st.tab = 'bitacora';
  draw(true);
  toast('Decisión guardada en la bitácora con la recomendación del sistema.');
}

function exportar() {
  try {
    const cab = ['Hora', 'Sector', 'Decisión', 'Motivo', 'Responsable (rol)', 'Recomendación del sistema', 'Coincide con el sistema', 'Resultado'];
    const filas = st.bitacora.map(b => [`Hora ${horaEvento(b.min)} · ${hhmm(b.min)}`, b.sector, b.decision, b.motivo, b.resp, b.sistema, b.siguio ? 'Sí' : 'No', b.resultado]);
    const csv = '﻿' + [cab, ...filas].map(r => r.map(c => `"${String(c).replace(/ /g, ' ').replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'bitacora-prioriza-ocana.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    // Algunos visores bloquean las descargas, por eso también se copia el CSV.
    const aviso = 'Informe CSV listo. Si no se descargó, quedó copiado para pegarlo en una hoja de cálculo.';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(csv.replace(/^﻿/, '')).then(() => toast(aviso), () => toast('Informe CSV generado. Si no se descargó, prueba desde otro navegador.'));
    } else {
      toast('Informe CSV generado. Si no se descargó, prueba desde otro navegador.');
    }
  } catch (err) {
    toast('No se pudo exportar desde este navegador.');
  }
}

function setView(v) {
  view = isNarrow() ? 'app' : v;
  renderStage();
}

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  if (a === 'theme') { setTheme(themeNow() === 'dark' ? 'light' : 'dark'); draw(); return; }
  if (a === 'view') { setView(el.dataset.view); return; }
  if (a === 'open-preset') { st = PRESETS[+el.dataset.i].make(); if (st.sheet) st.sheet.fresh = true; setView('app'); return; }
  if (!el.closest('[data-live]')) return;

  let reset = false;
  switch (a) {
    case 'tab': st.tab = el.dataset.tab; st.sheet = null; reset = true; break;
    case 'mode': st.mode = el.dataset.mode; break;
    case 'sector': st.sheet = { type: 'sector', id: el.dataset.id, fresh: true }; break;
    case 'cerrar': st.sheet = null; break;
    case 'asignar': st.sheet = { type: 'asignar', id: el.dataset.id, intent: el.dataset.intent, team: recomendado(el.dataset.id, st.equipos), motivo: '', fresh: true }; break;
    case 'team': if (st.sheet) st.sheet.team = el.dataset.id; break;
    case 'confirmar': confirmar(); return;
    case 'export': exportar(); return;
    case 'pase-ahora':
      st.minutos += 1; st.pase.enviado = hhmm(st.minutos); draw();
      toast('Pase de lista enviado. Las respuestas aparecen aquí cuando lleguen.'); return;
    default: return;
  }
  draw(reset);
});

document.addEventListener('input', ev => {
  if (!ev.target.matches('[data-role="motivo"]') || !st.sheet) return;
  st.sheet.motivo = ev.target.value;
  const ok = validar(), b = $('[data-live] [data-action="confirmar"]'), h = $('[data-live] .hint');
  if (b) b.disabled = !ok;
  if (h) h.hidden = ok;
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && st.sheet && view === 'app') { st.sheet = null; draw(); return; }
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[role="button"][data-action]')) {
    ev.preventDefault(); ev.target.click();
  }
});

window.addEventListener('resize', fit);
(narrowMQ.addEventListener ? narrowMQ.addEventListener.bind(narrowMQ, 'change') : narrowMQ.addListener.bind(narrowMQ))(() => renderStage());

/* ---------- inicio ---------- */
try { const t = localStorage.getItem('prioriza-tema'); if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t; } catch (e) { /* sin almacenamiento */ }
const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark' || q.get('tema') === 'light') document.documentElement.dataset.theme = q.get('tema');
const pantalla = parseInt(q.get('pantalla'), 10);
if (pantalla >= 1 && pantalla <= PRESETS.length) { st = PRESETS[pantalla - 1].make(); view = 'app'; }
else if (q.get('vista') === 'app') view = 'app';
renderStage();
})();
