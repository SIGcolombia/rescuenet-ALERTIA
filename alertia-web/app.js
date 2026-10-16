/* ==========================================================
   ALERTIA · web
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


/* ---------- piezas del tablero (iguales a la versión móvil) ---------- */
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
  <button type="button" class="btn neutral block" data-action="mode" data-mode="alertia">Ver como ALERTIA</button>`;
}


/* ---------- iconos extra de la versión web ---------- */
Object.assign(ICON, {
  logo: I('<circle cx="6" cy="7" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M8.2 7h7.6M7.2 9l3.7 7.2M16.8 9l-3.7 7.2"/>'),
  inbox: I('<path d="M3.5 13.5 6.5 5h11l3 8.5V19a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/><path d="M3.5 13.5H9a3 3 0 0 0 6 0h5.5"/>'),
  sos: I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.8"/><path d="M5.6 5.6l3.7 3.7M14.7 14.7l3.7 3.7M18.4 5.6l-3.7 3.7M9.3 14.7l-3.7 3.7"/>'),
  salud: I('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 7.5v9M7.5 12h9"/>'),
  danos: I('<path d="M3.5 11.5 12 4l8.5 7.5"/><path d="M6 10v10h12V10"/><path d="m12.5 11.5-2 3.2 3 1.2-2 4"/>'),
  bien: I('<circle cx="12" cy="12" r="9"/><path d="m7.8 12.4 3 3 5.6-6"/>')
});

/* ---------- mensajes que llegan de ALERTIA ---------- */
// Cada número es el mismo que ven los usuarios de la app móvil.
const TIPO = {
  4: { t: 'SOS', k: 'k-actuar', ic: 'sos' },
  3: { t: 'Salud y víveres', k: 'k-amar', ic: 'salud' },
  2: { t: 'Daños', k: 'k-nar', ic: 'danos' },
  1: { t: 'Estamos bien', k: 'k-ok', ic: 'bien' }
};
const sec = id => byId[id].nombre;
const NBSP = '\u00a0';
const INBOX0 = [
  { l: 14 * 60 + 31, c: 'sms', s: 'ribera', n: 4, t: 'Presidente de la JAC respondió «4» al pase de lista de las 2:00 p. m.' },
  { l: 14 * 60 + 22, c: 'app', s: 'ribera', n: 4, t: '5 personas, atrapados: sí. Necesitan agua y medicina.' },
  { l: 14 * 60 + 19, c: 'radio', s: 'centro', n: 2, t: 'Inspector de policía respondió «2». Fachadas caídas y escombros en la vía.' },
  { l: 14 * 60 + 12, c: 'app', s: 'centro', n: 3, t: '3 personas, heridos leves, dependen de oxígeno. Necesitan medicina.' },
  { l: 14 * 60 + 9, e: 13 * 60 + 30, c: 'mula', s: 'ladera', n: 2, t: 'Habitante: grietas nuevas en la ladera y se oyen ruidos. Llegó con la mula de datos.' },
  { l: 14 * 60 + 8, c: 'sms', s: 'sur', n: 1, t: 'Presidente de la JAC respondió «1». Estamos ayudando a los vecinos.' },
  { l: 14 * 60 + 6, c: 'radio', s: 'valle', n: 1, t: 'Presidenta de la JAC respondió «1». Camino con barro, todos estamos bien.' },
  { l: 14 * 60 + 4, c: 'radio', s: 'hosp', n: 1, t: 'Jefe de urgencias respondió «1». Atención normal.' },
  { l: 14 * 60 + 2, c: 'sms', s: 'llana', n: 1, t: 'Docente de la escuela respondió «1».' }
];
// Lo que recoge Defensa Civil 3 en Vereda alta: 2 SOS, 3 salud y víveres, 4 daños, 3 estamos bien.
const MULA_VALTA = [
  [4, '4 personas atrapadas en una vivienda tras el derrumbe. Una con heridas graves.'],
  [4, 'Dos adultos mayores no pueden salir de la vivienda. La vía está cortada.'],
  [3, 'Se acabó el agua potable. Hay 6 niños.'],
  [3, 'Necesitan medicina para la tensión y el azúcar.'],
  [3, 'Varias familias sin alimentos desde ayer.'],
  [2, 'Casa con el techo caído.'],
  [2, 'Camino principal cortado por un derrumbe.'],
  [2, 'Puente de la quebrada dañado.'],
  [2, 'Dos viviendas con grietas grandes.'],
  [1, 'Familia a salvo en la escuela rural.'],
  [1, 'Sin novedad en la parte baja de la vereda.'],
  [1, 'Vecinos reunidos en la caseta comunal, todos bien.']
];

const sinPase = x => x.vigias.every(v => v.resp === 0);

/* ---------- logo ALERTIA (vectorizado del PDF oficial) ---------- */
const LG = {
  g: ["M 541.9 540.7 C 546 540.8 549.9 540.9 553.8 540.1 C 555.7 539.7 557.5 539.1 559.2 538.2 C 563.6 535.8 565.5 531.8 565.5 526.8 C 565.6 521.8 563.7 517.7 559.1 515.2 C 553.7 512.2 547.9 512.6 541.9 512.8 Z M 606.9 603.7 L 603.8 603.7 C 593.4 603.7 583 603.7 572.7 603.8 C 570.8 603.8 569.7 603.2 568.7 601.6 C 560.4 588.7 552.1 575.7 543.7 562.8 C 543.3 562.1 542.8 561.5 541.9 560.9 L 541.9 603.2 C 539.8 603.8 515.2 603.9 512.4 603.4 L 512.4 490.2 C 513 490.1 513.5 489.9 514.1 489.9 C 530 489.9 545.9 489.8 561.8 490.1 C 570.6 490.2 578.7 493 585.3 499.1 C 591.9 505.2 595 512.9 595.7 521.6 C 596.1 527.1 595.8 532.5 594 537.8 C 591 546.6 584.9 552.3 576.3 555.5 C 574.7 556.1 573.2 556.5 571.2 557.1 C 583.1 572.6 594.8 587.9 606.9 603.7", "M 490.9 490.1 L 490.9 514.9 C 479.3 515.1 467.8 514.9 456.1 515 L 456.1 533.9 C 461.6 534 467.1 533.9 472.6 533.9 C 478 533.9 483.4 533.9 489 533.9 L 489 559.1 L 456.1 559.1 L 456.1 578.5 C 460 578.7 463.8 578.6 467.7 578.6 C 471.5 578.6 475.3 578.6 479.1 578.6 C 483 578.6 486.8 578.6 490.9 578.6 L 490.9 603.6 L 426.8 603.6 C 426.3 601.7 426.1 494.1 426.6 490.1 Z M 490.9 490.1", "M 609 490 L 686.8 490 L 686.8 514.9 L 662.8 514.9 C 662.6 518 662.7 520.9 662.7 523.8 C 662.7 526.7 662.7 529.7 662.7 532.6 L 662.7 568.2 C 662.7 571.1 662.7 574 662.7 577 L 662.7 594.6 C 662.7 597.6 662.7 600.5 662.7 603.6 L 633.2 603.6 L 633.2 515.1 C 625 514.8 609.2 514.9 609.2 514.9 Z M 609 490", "M 411 603.6 L 346.5 603.6 C 346 601.8 346.3 490.3 346.3 490.3 L 375.7 490.3 L 375.7 578.6 L 411 578.6 Z M 411 603.6", "M 729.6 603.6 L 700.4 603.6 L 700.4 490.1 L 729.6 490.1 Z M 729.6 603.6", "M 295.9 537.8 C 292.1 540.8 290.3 544.9 289.1 549.5 C 288.8 550.9 288.5 553.5 288.1 554.8 C 287.9 552.5 287.8 548.9 287.4 546.5 C 287.2 545.2 287.1 543.9 286.6 542.7 C 285.6 540.3 283.4 539.3 280.8 539.1 C 277 538.9 267.6 541 266.6 541.1 C 267.8 540.6 277.6 535.8 281.1 533.7 C 285.3 531.2 288.2 527.5 289.7 522.8 C 290.7 520.1 292.4 513.2 292.4 513.2 C 292.4 513.2 292.7 516.4 292.8 517.5 C 293 518.7 293.2 519.9 293.5 521.1 C 294.8 524.6 297.4 526.1 301 525.3 C 304.7 524.5 308.3 523.6 312 522.6 L 303.4 490.3 L 274.5 490.3 L 244.4 603.7 L 270.7 603.7 L 275.2 584.7 L 302.4 584.7 L 306.7 603.7 L 333.5 603.7 L 313.4 528.2 C 309.1 530.1 304.9 532.3 300.6 534.5 C 298.9 535.4 297.4 536.6 295.9 537.8", "M 799.4 564.6 C 795.6 547.6 792.7 531.5 790.7 516.2 L 790.4 516.2 C 788.4 532 785.5 548.1 781.8 564.6 Z M 835.6 604 L 808.7 604 L 804.4 585 L 777.1 585 L 772.6 604 L 746.3 604 L 776.4 490.3 L 805.4 490.3 Z M 835.6 604"],
  cap: 'M286.4 476C282.8 476 279.8 478.9 279.8 482.6V487.7H298.1V482.6C298.1 478.9 295.2 476 291.5 476Z',
  n: 0
};
/* tipo 'word' = nombre completo, 'icon' = solo la A. Usa currentColor: negro en claro, blanco en oscuro. */
function logoSvg(tipo = 'word', cls = '') {
  const id = 'lg' + (++LG.n), icon = tipo === 'icon';
  const vb = icon ? '240 472 98 136' : '244 476 592 128';
  const gl = (icon ? [LG.g[5]] : LG.g).map(d => `<path d="${d}"/>`).join('');
  return `<svg class="logo-svg ${cls}" viewBox="${vb}" role="img" aria-label="ALERTIA"><defs><linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="279.8" x2="298.1" y1="0" y2="0"><stop offset="0" stop-color="#F7931E"/><stop offset="1" stop-color="#ED1C24"/></linearGradient></defs><g fill="currentColor">${gl}</g><path d="${LG.cap}" fill="url(#${id})"/></svg>`;
}

/* ---------- estado ---------- */
const equiposIni = () => ({
  bomberos1: { estado: 'disponible' }, dc3: { estado: 'disponible' },
  dron1: { estado: 'disponible' }, cruzroja2: { estado: 'enruta', destino: 'Centro' }
});
const baseState = () => ({
  landing: true, view: 'tablero', mode: 'alertia', drawer: null, dlg: null, pase: { enviado: null },
  equipos: equiposIni(), bitacora: SEED.map(x => ({ ...x })), minutos: 14 * 60 + 34, toast: null,
  inbox: INBOX0.map(m => ({ ...m, e: m.e ?? m.l, nuevo: false })), mulaOk: false
});
let st = baseState();
let toastTimer = 0;
const themeNow = () => document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const themeIcon = () => (themeNow() === 'dark' ? ICON.sun : ICON.moon);

/* ---------- estructura ---------- */
function header(s) {
  const h = horaEvento(s.minutos);
  return `<header class="hdr">
    <button type="button" class="brand" data-action="home" aria-label="ALERTIA, volver a la portada">${logoSvg('word')}<small>Alertas inteligentes para proteger vidas</small></button>
    <div class="pmu"><b>Puesto de Mando Unificado</b><small>Ocaña, Norte de Santander</small></div>
    <div class="hdr-chan">${canales()}</div>
    <div class="hora" aria-label="Hora ${h} desde el inicio del evento"><b>Hora ${h}</b><small>desde el inicio</small></div>
    <button type="button" class="icon-btn" data-action="theme" data-theme-btn aria-label="Cambiar entre tema claro y oscuro">${themeIcon()}</button>
  </header>`;
}

function nav(s) {
  const sinR = SECTORS.filter(sinPase).length;
  const nuevos = s.inbox.filter(m => m.nuevo).length;
  const item = (id, ic, txt, badge = '') => `<button type="button" data-action="tab" data-tab="${id}" ${s.view === id ? 'aria-current="page"' : ''}>${ICON[ic]}<span>${txt}</span>${badge}</button>`;
  return `<nav class="nav" aria-label="Secciones">
    ${item('tablero', 'map', 'Tablero')}
    ${item('pase', 'clip', 'Pase de lista', `<span class="badge" aria-label="${sinR} sectores sin respuesta">${sinR}</span>`)}
    ${item('bandeja', 'inbox', 'Bandeja ALERTIA', nuevos ? `<span class="badge nuevo" aria-label="${nuevos} mensajes nuevos">${nuevos}</span>` : '')}
    ${item('bitacora', 'book', 'Bitácora')}
    <p class="navnote">ALERTIA recomienda. La decisión es del coordinador y queda en la bitácora.</p>
  </nav>`;
}

/* ---------- vistas ---------- */
/* ---------- resumen, equipos y marcadores ---------- */
function resumen(s) {
  const act = SECTORS.filter(x => x.estado === 'actuar');
  const vuln = act.reduce((n, x) => n + Math.round(x.hab * x.vuln / 100), 0);
  const sin = SECTORS.filter(x => !x.sabe).length;
  const msgs = SECTORS.reduce((n, x) => n + x.reportes, 0);
  const libres = Object.values(s.equipos).filter(e => e.estado === 'disponible').length;
  return `<section class="kpis" aria-label="Resumen de la situación">
    <div class="kpi k-actuar"><span class="ki">${ICON.users}</span><div><b>${miles(vuln)}</b><span>personas vulnerables en ${act.length} sectores donde actuar</span></div></div>
    <div class="kpi k-explorar dash"><span class="ki">${ICON.eye}</span><div><b>${sin} de ${SECTORS.length}</b><span>sectores sin información reciente</span></div></div>
    <button type="button" class="kpi k-neutro" data-action="tab" data-tab="bandeja"><span class="ki">${ICON.inbox}</span><div><b>${msgs}</b><span>mensajes recibidos de ALERTIA <em>Ver bandeja</em></span></div></button>
    <div class="kpi k-ok"><span class="ki">${ICON.truck}</span><div><b>${libres} de ${EQUIPOS.length}</b><span>equipos disponibles para asignar</span></div></div>
  </section>`;
}

function equiposStrip(s) {
  return `<div class="eqstrip" aria-label="Equipos en campo">${EQUIPOS.map(e => {
    const t = s.equipos[e.id], libre = t.estado === 'disponible';
    return `<span class="eq ${libre ? 'libre' : 'ruta'}">${ICON[e.icon]}<span><b>${eqNombre(e.id)}</b><small>${libre ? 'Disponible' : 'En ruta · ' + esc(t.destino)}</small></span></span>`;
  }).join('')}</div>`;
}

function marcadoresEquipos(s) {
  let out = '';
  EQUIPOS.forEach(e => {
    const t = s.equipos[e.id];
    if (t.estado !== 'enruta') return;
    const x = SECTORS.find(z => z.nombre === t.destino);
    if (!x) return;
    const bx = 218, by = 148;
    const lejos = Math.hypot(x.x - bx, x.y - by) > 40;
    const mx = lejos ? (x.x + bx) / 2 : x.x - x.r * .85, my = lejos ? (x.y + by) / 2 : x.y - x.r * .85;
    const ic = ICON[e.icon].replace('<svg class="ic"', '<svg class="tm-ic" x="4" y="4" width="16" height="16"');
    out += `${lejos ? `<path class="team-route" d="M${bx} ${by} L${x.x} ${x.y}"/>` : ''}
      <g class="team-mk" transform="translate(${(mx - 12).toFixed(1)} ${(my - 12).toFixed(1)})"><rect width="24" height="24" rx="7"/>${ic}
      <text x="12" y="-5">${esc(e.nombre)}</text></g>`;
  });
  return out;
}

function mapaConEquipos(s) {
  const svg = mapSvg(s.mode);
  if (s.mode === 'comun') return svg;
  const i = svg.lastIndexOf('</svg>');
  return svg.slice(0, i) + marcadoresEquipos(s) + svg.slice(i);
}

function tablero(s) {
  const comun = s.mode === 'comun';
  const modebar = `<div class="modebar"><span class="lbl">Ver como</span>
      <div class="seg" role="group" aria-label="Ver como">
        <button type="button" data-action="mode" data-mode="alertia" aria-pressed="${!comun}">ALERTIA</button>
        <button type="button" data-action="mode" data-mode="comun" aria-pressed="${comun}">Tablero común</button>
      </div></div>`;
  return `<div class="pagehead"><div><h1>Tablero</h1>
      <p class="sub">Evento iniciado a las 11:00${NBSP}a.${NBSP}m. · actualizado ${hhmm(s.minutos)} · ${comun ? 'Así ordenaría un tablero que solo cuenta mensajes.' : 'Qué hacer ahora, dónde no sabemos y dónde no hay novedad.'}</p></div>
      <div class="pagetools">${modebar}<button type="button" class="btn ghost" data-action="export-situacion">${ICON.download}Exportar situación</button></div></div>
    ${resumen(s)}
    <div class="cols">
      <div class="col sticky">
        ${comun ? `<div class="banner" role="note">${ICON.warn}<span>Lo que no manda mensajes no aparece. Compáralo con ALERTIA.</span></div>` : ''}
        <section class="card mapcard" aria-label="Mapa de sectores">
          <header><h2>Mapa de sectores</h2><small>Selecciona un sector para ver por qué</small></header>
          <div class="mapwrap">${mapaConEquipos(s)}<div class="maptip" id="maptip" role="tooltip" hidden></div></div>${legend(s.mode)}${comun ? '' : equiposStrip(s)}
        </section>
      </div>
      <div class="col">${knowCard()}${comun ? rankingComun() : queHacer() + listas()}</div>
    </div>`;
}

function paseView(s) {
  const sin = SECTORS.filter(sinPase).length;
  const orden = [...SECTORS].sort((a, b) => sinPase(b) - sinPase(a));
  const vigias = SECTORS.reduce((n, x) => n + x.vigias.length, 0);
  return `<div class="pagehead"><div><h1>Pase de lista</h1>
      <p class="sub">Cada dos horas el sistema pregunta a los vigías «¿cómo está su sector?» con un solo número. Que no contesten también es un dato.</p></div></div>
    <section class="card" style="margin-bottom:16px"><div class="paseh"><div>
      <p class="eyebrow">Pase de lista cada dos horas</p>
      <div class="tiles">
        <div class="tile"><small>Último pase</small><b>2:00&nbsp;p.&nbsp;m.</b></div>
        <div class="tile mor"><small>Sin ninguna respuesta</small><b>${sin} sectores</b></div>
        <div class="tile"><small>Próximo</small><b>4:00&nbsp;p.&nbsp;m.</b></div>
      </div>
      ${s.pase.enviado ? `<p class="sent">${ICON.send}<span>Pase enviado a las ${s.pase.enviado} por SMS y radio. Esperando respuestas de ${vigias} vigías.</span></p>` : ''}
    </div>
    <button type="button" class="btn neutral" data-action="pase-ahora" ${s.pase.enviado ? 'disabled' : ''}>${ICON.clip}${s.pase.enviado ? 'Pase enviado' : 'Hacer pase de lista ahora'}</button></div></section>
    <div class="pl-legend" style="margin-bottom:14px" aria-label="Significado de las respuestas">${[1, 2, 3, 4, 0].map(respChip).join('')}</div>
    <div class="pase-grid">${orden.map(x => `<article class="pl-card ${sinPase(x) ? 'nc' : ''}">
      <h3>${x.nombre}</h3>
      ${x.vigias.map(v => `<div class="pl-row"><div class="who"><b>${v.rol}</b><small>${ICON[v.canal]}${CANAL[v.canal]}</small></div>${respChip(v.resp)}</div>`).join('')}
    </article>`).join('')}</div>`;
}

function mensaje(m) {
  const t = TIPO[m.n], tarde = m.e !== m.l;
  return `<li class="msg ${t.k} ${m.nuevo ? 'nuevo' : ''}">
    <span class="tb">${ICON[t.ic]}</span>
    <div class="mt"><p>${esc(m.t)}</p>
      <small><span class="tipo">${m.n} · ${t.t}</span><span><b>${sec(m.s)}</b></span><span>${ICON[m.c]}${CANAL[m.c]}</span>
      <span>${ICON.clock}Llegó ${hhmm(m.l)}${tarde ? ` · escrito en la hora ${horaEvento(m.e)}` : ''}</span></small></div>
    ${m.nuevo ? '<span class="newtag">Nuevo</span>' : ''}</li>`;
}

function bandeja(s) {
  const cnt = n => s.inbox.filter(m => m.n === n).length;
  const max = Math.max(...SECTORS.map(x => x.reportes)) || 1;
  const porSector = [...SECTORS].sort((a, b) => b.reportes - a.reportes);
  const orden = [...s.inbox].sort((a, b) => b.l - a.l);
  return `<div class="pagehead"><div><h1>Bandeja ALERTIA</h1>
      <p class="sub">Mensajes que llegan de la app de los vecinos, los vigías y los brigadistas, por SMS, radio comunitario o mula de datos.</p></div></div>
    <div class="cols2">
      <div class="col">
        <section class="card"><p class="eyebrow">Mensajes por tipo</p>
          <div class="mtiles">${[4, 3, 2, 1].map(n => `<div class="mtile ${TIPO[n].k}"><span class="tb">${ICON[TIPO[n].ic]}</span><div><b>${cnt(n)}</b><span>${TIPO[n].t}</span></div></div>`).join('')}</div></section>
        <section class="card mulacard"><p class="eyebrow" style="color:var(--explorar-t)">Mula de datos</p>
          <h2>${s.mulaOk ? 'Defensa Civil 3 entregó los mensajes de Vereda alta' : 'Defensa Civil 3 regresa de Vereda alta con mensajes guardados'}</h2>
          <p>${s.mulaOk ? 'ALERTIA recalculó el sector con lo que llegó. Revisa el tablero.' : 'Vereda alta no ha contestado ningún pase de lista. Los teléfonos de la vereda guardaron mensajes que la mula recogió en el camino.'}</p>
          <button type="button" class="btn neutral" data-action="mula-sim" ${s.mulaOk ? 'disabled' : ''}>${ICON.mula}${s.mulaOk ? 'Mensajes entregados' : 'Simular llegada de la mula'}</button>
          <p class="cap">Simulación con datos de demostración. En la versión real los mensajes llegan solos cuando el equipo recupera señal o radio.</p></section>
        <section class="card"><p class="eyebrow">Mensajes por sector</p>
          <ul class="persec">${porSector.map(x => `<li class="${x.reportes === 0 ? 'zero' : ''}"><span>${x.nombre}</span><span class="bar" aria-hidden="true"><i style="width:${Math.round(x.reportes / max * 100)}%"></i></span><b>${x.reportes}</b></li>`).join('')}</ul>
          <p class="cap" style="margin-top:10px">Un sector con cero mensajes no es un sector tranquilo: puede ser un sector incomunicado.</p></section>
      </div>
      <div class="col"><section aria-label="Últimos mensajes recibidos"><h2 class="h2" style="margin:0 0 10px">Últimos mensajes recibidos</h2>
        <ol class="msgs">${orden.map(mensaje).join('')}</ol></section></div>
    </div>`;
}

function bitacora(s) {
  return `<div class="pagehead"><div><h1>Bitácora de decisiones</h1>
      <p class="sub">Cada decisión guarda la recomendación del sistema para la rendición de cuentas.</p></div>
      <button type="button" class="btn ghost" data-action="export">${ICON.download}Exportar informe</button></div>
    <ol class="log">${s.bitacora.map(b => `<li class="entry ${EST[b.est].k}">
      <div class="top"><div><p class="when">Hora ${horaEvento(b.min)} · ${hhmm(b.min)}</p><p class="sec">${b.sector}</p></div>
        <span class="tagc ${EST[b.est].k}">${EST[b.est].t}</span></div>
      <p class="dec">${esc(b.decision)}</p>
      <dl class="kv"><dt>Responsable</dt><dd>${b.resp}</dd><dt>Motivo</dt><dd>${esc(b.motivo)}</dd><dt>Resultado</dt><dd>${esc(b.resultado)}</dd></dl>
      <div class="sys"><b>El sistema recomendaba</b>${esc(nb(b.sistema))}</div>
      <div class="pills"><span class="tagc ${b.siguio ? 'k-ok' : 'k-nar'}">${b.siguio ? 'Siguió la recomendación' : 'Se apartó de la recomendación'}</span></div>
    </li>`).join('')}</ol>`;
}

/* ---------- panel de sector y diálogo de asignación ---------- */
function drawer(s) {
  const x = byId[s.drawer.id], k = ESTADO[x.estado].k;
  const lo = Math.max(0, x.prob - x.margen), hi = Math.min(100, x.prob + x.margen);
  const why = [
    ['users', `${miles(x.hab)} habitantes`, false],
    ['users', `${x.vuln} % de población vulnerable`, x.vuln >= 50],
    ['warn', `Amenaza ${x.amenaza} de ${x.tipo}`, x.amenaza === 'alta'],
    ...x.resp.map(([n, t]) => ['sms', `${veces(n)} el vigía respondió «${t}»`, false]),
    ['app', `${x.reportes} ${x.reportes === 1 ? 'mensaje' : 'mensajes'} de ALERTIA`, x.reportes === 0],
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
  return `<div class="scrim" data-action="cerrar"></div>
  <aside class="drawer ${k} ${s.drawer.fresh ? 'anim' : ''}" role="dialog" aria-modal="true" aria-label="Detalle de ${esc(x.nombre)}" tabindex="-1">
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
  </aside>`;
}

const validar = () => !!(st.dlg && st.dlg.team && st.dlg.motivo.trim().length >= 5);

function dialogo(s) {
  const sh = s.dlg, x = byId[sh.id];
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
  return `<div class="scrim" style="z-index:41" data-action="cerrar-dlg"></div>
  <section class="dlg ${sh.fresh ? 'anim' : ''}" role="dialog" aria-modal="true" aria-label="Asignar equipo" tabindex="-1">
    <div class="sheet-h"><div><h2>Asignar equipo</h2><p>${x.nombre} · ${sh.intent === 'verificar' ? 'enviar a verificar' : 'ayuda inmediata'}</p></div>
      <button type="button" class="icon-btn" data-action="cerrar-dlg" aria-label="Cerrar">${ICON.close}</button></div>
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


/* ---------- portada ---------- */
function heroFondo() {
  let r = 7; const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  let bloques = '';
  for (let cx = 0; cx < 1600; cx += 80) for (let cy = 0; cy < 900; cy += 70) {
    if (rnd() < .22) continue;
    const w = 46 + rnd() * 22, h = 38 + rnd() * 18;
    bloques += `<rect class="hb-block" x="${(cx + 8 + rnd() * 6).toFixed(0)}" y="${(cy + 8 + rnd() * 6).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="3"/>`;
  }
  return `<svg class="hero-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect class="hb-base" width="1600" height="900"/>
    <g>${bloques}</g>
    <path class="hb-river" d="M-40 640C260 600 420 760 700 700S1120 470 1380 520 1560 640 1660 600" />
    <g class="hb-roads"><path d="M0 250H1600M0 480H1600M0 780H1600M330 0V900M760 0V900M1180 0V900M1480 0V900"/></g>
    <polygon class="hb-s hb-s-act" points="610,900 700,520 980,330 1130,420 1090,900"/>
    <polygon class="hb-s hb-s-nar" points="250,620 440,380 700,520 610,900 330,900"/>
    <polygon class="hb-s hb-s-amar" points="980,330 1050,60 1290,120 1330,400 1130,420"/>
    <polygon class="hb-s hb-s-ok" points="1130,420 1330,400 1600,470 1600,900 1090,900"/>
    <circle class="hb-pt" cx="880" cy="560" r="7"/><circle class="hb-pt" cx="1180" cy="250" r="7"/><circle class="hb-pt" cx="470" cy="520" r="7"/>
  </svg>`;
}

function landing() {
  const tira = [['tablero', ICON.map, 'Tablero de sectores'], ['pase', ICON.clip, 'Pase de lista'], ['bandeja', ICON.inbox, 'Bandeja ALERTIA'], ['bitacora', ICON.book, 'Bitácora']]
    .map(([t, ic, tx]) => `<button type="button" data-action="entrar" data-tab="${t}">${ic}<span>${tx}</span></button>`).join('')
    + `<button type="button" data-action="ver-info">${ICON.info}<span>Cómo funciona</span></button>`;
  const para = [
    [ICON.users, 'Priorizar', 'Ordena los sectores según las personas vulnerables que probablemente necesitan ayuda, con un porcentaje y su margen de error.'],
    [ICON.eye, 'Mirar el silencio', 'Un sector que no contesta también es un dato. ALERTIA lo marca como «Explorar» y no lo da por seguro.'],
    [ICON.radio, 'Llegar sin internet', 'Los mensajes viajan por SMS, radio LoRa o mula de datos, y la app de campo funciona sin señal.'],
    [ICON.book, 'Dejar constancia', 'Cada decisión queda en la bitácora con lo que recomendaba el sistema y quién decidió.']
  ].map(([ic, t, d]) => `<article class="l-card"><span class="l-ic">${ic}</span><h3>${t}</h3><p>${d}</p></article>`).join('');
  const pasos = [
    ['1', 'Reportan', 'Vecinos, vigías y brigadistas envían un solo número que resume lo que ven. No piden nombre ni contraseña.'],
    ['2', 'ALERTIA ordena', 'Junta los mensajes, estima dónde hay más gente en riesgo y separa los sectores sin información.'],
    ['3', 'El coordinador decide', 'Asigna el equipo desde el tablero. ALERTIA recomienda, la decisión es de la persona.']
  ].map(([n, t, d]) => `<li><b class="l-n">${n}</b><div><h3>${t}</h3><p>${d}</p></div></li>`).join('');
  return `<div class="landing">
    <section class="hero">
      ${heroFondo()}<div class="hero-shade"></div>
      <header class="l-top">
        <span class="l-brand">${logoSvg('word')}</span>
        <div class="l-right">
          <button type="button" class="l-link" data-action="entrar" data-tab="tablero">Puesto de Mando</button>
          <button type="button" class="icon-btn" data-action="theme" data-theme-btn aria-label="Cambiar entre tema claro y oscuro">${themeIcon()}</button>
        </div>
      </header>
      <div class="hero-body">
        <p class="l-kicker">Reto 9 · Priorización post-emergencia · Ocaña, Norte de Santander</p>
        <h1 class="hero-word" aria-label="ALERTIA">${logoSvg('word')}</h1>
        <p class="hero-tag">Alertas inteligentes para proteger vidas</p>
        <p class="hero-txt">Después de una emergencia no alcanza para todos a la vez. ALERTIA reúne los mensajes de la comunidad, aunque no haya internet, y le dice al Puesto de Mando dónde actuar primero y dónde todavía nadie ha avisado.</p>
        <button type="button" class="btn-hero" data-action="entrar" data-tab="tablero">Entrar al Puesto de Mando</button>
      </div>
      <nav class="l-strip" aria-label="Accesos rápidos">${tira}</nav>
    </section>
    <section class="l-info" id="info">
      <div class="l-wrap">
        <p class="l-eyebrow">Qué es</p>
        <h2>Un tablero que sirve para decidir con poca información</h2>
        <p class="l-lead">ALERTIA conecta una app de campo para la comunidad con un tablero para el Puesto de Mando Unificado. Su trabajo es convertir mensajes sueltos en una lista clara de sectores donde actuar y sectores donde hay que averiguar.</p>
        <h2 class="l-h2b">Para qué sirve</h2>
        <div class="l-cards">${para}</div>
        <h2 class="l-h2b">Cómo funciona</h2>
        <ol class="l-steps">${pasos}</ol>
        <div class="l-cta"><div><b>Ver el caso de Ocaña</b><span>Sectores, equipos y mensajes de ejemplo para recorrer el tablero completo.</span></div><button type="button" class="btn-hero sm" data-action="entrar" data-tab="tablero">Entrar al Puesto de Mando</button></div>
        <p class="l-demo">Los datos son de demostración y no corresponden a información real de Ocaña.</p>
      </div>
    </section>
  </div>`;
}

/* ---------- montaje ---------- */
function appHtml(s) {
  if (s.landing) return landing();
  const vista = s.view === 'pase' ? paseView(s) : s.view === 'bandeja' ? bandeja(s) : s.view === 'bitacora' ? bitacora(s) : tablero(s);
  return `<div class="web">${header(s)}<div class="shell">${nav(s)}
    <main class="main" id="main" tabindex="-1">${vista}<p class="foot-demo">Datos de demostración. ALERTIA recomienda, la decisión es del coordinador.</p></main></div>
    ${s.drawer ? drawer(s) : ''}${s.dlg ? dialogo(s) : ''}${s.toast ? `<div class="toast" role="status">${esc(s.toast)}</div>` : ''}</div>`;
}

function draw(reset) {
  const root = $('#root');
  const y = window.scrollY, sb = $('.drawer .sheet-b'), sbs = sb ? sb.scrollTop : 0, hadDlg = !!$('.dlg');
  root.innerHTML = appHtml(st);
  if (reset) window.scrollTo(0, 0); else window.scrollTo(0, y);
  const sb2 = $('.drawer .sheet-b');
  if (sb2 && sb && !(st.drawer && st.drawer.fresh)) sb2.scrollTop = sbs;
  const fresh = (st.dlg && st.dlg.fresh) ? $('.dlg') : (st.drawer && st.drawer.fresh) ? $('.drawer') : null;
  if (st.drawer) st.drawer.fresh = false;
  if (st.dlg) st.dlg.fresh = false;
  if (fresh) fresh.focus({ preventScroll: true });
  else if (hadDlg && !st.dlg && st.drawer) { const d = $('.drawer'); if (d) d.focus({ preventScroll: true }); }
}

/* ---------- acciones ---------- */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('alertia-tema', t); } catch (e) { /* sin almacenamiento */ }
}

function toast(msg, ms = 3600) {
  st.toast = msg; draw();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { st.toast = null; draw(); }, ms);
}

function confirmar() {
  if (!validar()) return;
  const sh = st.dlg, x = byId[sh.id], reco = recomendado(x.id, st.equipos);
  st.minutos += 2;
  st.bitacora.unshift({
    min: st.minutos, sectorId: x.id, sector: x.nombre,
    decision: `${sh.intent === 'verificar' ? 'Enviar a verificar con' : 'Asignar'} ${eqNombre(sh.team)}`,
    motivo: sh.motivo.trim(), resp: 'Coordinador de gestión del riesgo',
    sistema: `Recomendaba ${x.estado === 'explorar' ? 'explorar primero' : 'actuar en'} ${x.nombre} (${pct(x)})${reco ? ` con ${eqNombre(reco)}` : ''}`,
    siguio: sh.team === reco, resultado: 'En curso, el equipo va en camino.', est: 'curso'
  });
  st.equipos[sh.team] = { estado: 'enruta', destino: x.nombre };
  st.dlg = null; st.drawer = null; st.view = 'bitacora';
  draw(true);
  toast('Decisión guardada en la bitácora con la recomendación del sistema.');
}

function aplicarMula() {
  st.mulaOk = true; st.minutos += 3;
  const x = byId.valta;
  Object.assign(x, { sabe: true, estado: 'actuar', prob: 71, margen: 11, reportes: MULA_VALTA.length, necesita: ['Salud', 'Agua y alimentos'] });
  x.linea.unshift({ c: 'mula', e: 2, l: 3, t: 'Brigadista (mula de datos): 12 mensajes de la vereda, 2 SOS, 3 salud y víveres, 4 daños y 3 estamos bien.' });
  MULA_VALTA.forEach(([n, t], i) => st.inbox.push({ l: st.minutos, e: 13 * 60 + 50 - i, c: 'mula', s: 'valta', n, t, nuevo: true }));
}

function simularMula() {
  if (st.mulaOk) return;
  aplicarMula();
  draw();
  toast('Llegaron 12 mensajes de Vereda alta. ALERTIA recalculó el sector: pasó de «Explorar primero» a «Actuar» (71 % ± 11 %). Simulación con datos de demostración.', 7000);
}

function descargarCSV(nombre, cab, filas) {
  try {
    const csv = '﻿' + [cab, ...filas].map(r => r.map(c => `"${String(c).replace(/ /g, ' ').replace(/"/g, '""')}"`).join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
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

function exportar() {
  const cab = ['Hora', 'Sector', 'Decisión', 'Motivo', 'Responsable (rol)', 'Recomendación del sistema', 'Coincide con el sistema', 'Resultado'];
  const filas = st.bitacora.map(b => [`Hora ${horaEvento(b.min)} · ${hhmm(b.min)}`, b.sector, b.decision, b.motivo, b.resp, b.sistema, b.siguio ? 'Sí' : 'No', b.resultado]);
  descargarCSV('bitacora-alertia-ocana.csv', cab, filas);
}

function exportarSituacion() {
  const cab = ['Sector', 'Estado', 'Probabilidad (%)', 'Margen (± %)', 'Habitantes', 'Población vulnerable (%)', 'Mensajes recibidos', 'Responde el pase de lista'];
  const filas = [...SECTORS].sort((a, b) => b.prob - a.prob).map(x => [x.nombre, ESTADO[x.estado].txt, x.prob, x.margen, x.hab, x.vuln, x.reportes, sinPase(x) ? 'No' : 'Sí']);
  descargarCSV('situacion-alertia-ocana.csv', cab, filas);
}

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  let reset = false;
  switch (a) {
    case 'theme': setTheme(themeNow() === 'dark' ? 'light' : 'dark'); break;
    case 'tab':
      if (st.view === 'bandeja') st.inbox.forEach(m => { m.nuevo = false; });
      st.view = el.dataset.tab; st.drawer = null; st.dlg = null; reset = true; break;
    case 'home': st.landing = true; st.drawer = null; st.dlg = null; reset = true; break;
    case 'entrar': st.landing = false; st.view = el.dataset.tab || 'tablero'; reset = true; break;
    case 'ver-info': { const i = $('#info'); if (i) i.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return; }
    case 'mode': st.mode = el.dataset.mode; break;
    case 'sector': st.drawer = { id: el.dataset.id, fresh: true }; break;
    case 'cerrar': st.drawer = null; break;
    case 'cerrar-dlg': st.dlg = null; break;
    case 'asignar': st.dlg = { id: el.dataset.id, intent: el.dataset.intent, team: recomendado(el.dataset.id, st.equipos), motivo: '', fresh: true }; break;
    case 'team': if (st.dlg) st.dlg.team = el.dataset.id; break;
    case 'confirmar': confirmar(); return;
    case 'export': exportar(); return;
    case 'export-situacion': exportarSituacion(); return;
    case 'mula-sim': simularMula(); return;
    case 'pase-ahora':
      st.minutos += 1; st.pase.enviado = hhmm(st.minutos); draw();
      toast('Pase de lista enviado. Las respuestas aparecen aquí cuando lleguen.'); return;
    default: return;
  }
  draw(reset);
});

document.addEventListener('input', ev => {
  if (!ev.target.matches('[data-role="motivo"]') || !st.dlg) return;
  st.dlg.motivo = ev.target.value;
  const ok = validar(), b = $('.dlg [data-action="confirmar"]'), h = $('.dlg .hint');
  if (b) b.disabled = !ok;
  if (h) h.hidden = ok;
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') {
    if (st.dlg) { st.dlg = null; draw(); } else if (st.drawer) { st.drawer = null; draw(); }
    return;
  }
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[role="button"][data-action]')) {
    ev.preventDefault(); ev.target.click();
  }
});

/* ---------- lista y mapa se resaltan entre sí ---------- */
function resaltar(id, on) {
  document.querySelectorAll(`.sector-g[data-id="${id}"], .row[data-action="sector"][data-id="${id}"]`).forEach(e => e.classList.toggle('hl', on));
}
document.addEventListener('pointerover', ev => {
  const el = ev.target.closest('.sector-g, .row[data-action="sector"]');
  if (el) resaltar(el.dataset.id, true);
});
document.addEventListener('pointerout', ev => {
  const el = ev.target.closest('.sector-g, .row[data-action="sector"]');
  if (el) resaltar(el.dataset.id, false);
  if (el && el.matches('.sector-g')) { const t = $('#maptip'); if (t) t.hidden = true; }
});
document.addEventListener('pointermove', ev => {
  const g = ev.target.closest('.sector-g'), tip = $('#maptip');
  if (!tip) return;
  if (!g) { tip.hidden = true; return; }
  const x = byId[g.dataset.id], box = tip.parentElement.getBoundingClientRect();
  tip.innerHTML = st.mode === 'comun'
    ? `<b>${x.nombre}</b><span>${x.reportes} ${x.reportes === 1 ? 'mensaje' : 'mensajes'} · ${miles(x.hab)} hab.</span>`
    : `<b>${x.nombre}</b><span class="tagc ${ESTADO[x.estado].k} ${x.estado === 'explorar' ? 'dash' : ''}">${ESTADO[x.estado].txt}</span><span>${pct(x)}</span><span>${miles(x.hab)} hab. · ${x.vuln} % vulnerables</span>`;
  tip.hidden = false;
  let l = ev.clientX - box.left + 16;
  if (l + tip.offsetWidth > box.width - 6) l = ev.clientX - box.left - tip.offsetWidth - 16;
  tip.style.left = Math.max(6, l) + 'px';
  tip.style.top = Math.max(6, Math.min(ev.clientY - box.top + 16, box.height - tip.offsetHeight - 6)) + 'px';
});

/* ---------- inicio ---------- */
try { const t = localStorage.getItem('alertia-tema'); if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t; } catch (e) { /* sin almacenamiento */ }
const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark' || q.get('tema') === 'light') document.documentElement.dataset.theme = q.get('tema');
if (['tablero', 'pase', 'bandeja', 'bitacora'].includes(q.get('vista'))) { st.view = q.get('vista'); st.landing = false; }
if (q.get('modo') === 'comun') { st.mode = 'comun'; st.landing = false; }
if (byId[q.get('sector')]) { st.drawer = { id: q.get('sector'), fresh: false }; st.landing = false; }
if (q.get('mula') === '1') { aplicarMula(); st.landing = false; }
if (q.get('inicio') === '1') st.landing = true;
draw(true);
})();
