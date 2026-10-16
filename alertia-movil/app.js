/* ==========================================================
   ALERTIA · móvil
   Sin librerías ni recursos externos. Funciona sin internet.
   Datos de demostración (no son datos reales de Ocaña).
   ========================================================== */
(() => {
'use strict';

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const NB = ' ';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hhmm = m => {
  const h = Math.floor(m / 60) % 24, mi = m % 60;
  const suf = h === 12 && mi === 0 ? 'm.' : h >= 12 ? `p.${NB}m.` : `a.${NB}m.`;
  return `${h % 12 || 12}:${String(mi).padStart(2, '0')}${NB}${suf}`;
};
const lista = a => (a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} y ${a[a.length - 1]}`);
const personas = n => `${n} ${n === 1 ? 'persona' : 'personas'}`;

/* ---------- iconos (SVG en línea) ---------- */
const I = body => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const ICON = {
  logo: I('<circle cx="6" cy="7" r="2.2"/><circle cx="18" cy="7" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M8.2 7h7.6M7.2 9l3.7 7.2M16.8 9l-3.7 7.2"/>'),
  sos: I('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.8"/><path d="M5.6 5.6l3.7 3.7M14.7 14.7l3.7 3.7M18.4 5.6l-3.7 3.7M9.3 14.7l-3.7 3.7"/>'),
  salud: I('<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 7.5v9M7.5 12h9"/>'),
  danos: I('<path d="M3.5 11.5 12 4l8.5 7.5"/><path d="M6 10v10h12V10"/><path d="m12.5 11.5-2 3.2 3 1.2-2 4"/>'),
  bien: I('<circle cx="12" cy="12" r="9"/><path d="m7.8 12.4 3 3 5.6-6"/>'),
  signal: I('<path d="M5 19v-4M10 19v-8M15 19V7M20 19V3"/>'),
  nosignal: I('<path d="M5 19v-4M10 19v-8M15 19v-6"/><path d="m3 3 18 18"/>'),
  radio: I('<circle cx="12" cy="12" r="1.6"/><path d="M7.8 16.2a6 6 0 0 1 0-8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 19.1a10 10 0 0 1 0-14.2M19.1 4.9a10 10 0 0 1 0 14.2"/>'),
  lock: I('<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'),
  back: I('<path d="M15 5l-7 7 7 7"/>'),
  minus: I('<path d="M5 12h14"/>'),
  plus: I('<path d="M12 5v14M5 12h14"/>'),
  check: I('<path d="m5 12.5 4.5 4.5L19 7.5"/>'),
  x: I('<path d="M6 6l12 12M18 6 6 18"/>'),
  home: I('<path d="M3.5 11.5 12 4l8.5 7.5"/><path d="M6 10v10h12V10"/>'),
  send: I('<path d="M21 3 3 10.5l7 2.5 2.5 7z"/>'),
  list: I('<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>'),
  clip: I('<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 2.5h6v4H9zM8.5 13l2.2 2.2 4.8-4.7"/>'),
  help: I('<circle cx="12" cy="12" r="9"/><path d="M9.2 9.3a3 3 0 1 1 4.3 2.7c-.9.5-1.5 1.1-1.5 2.1M12 17.2v.1"/>'),
  box: I('<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>'),
  eye: I('<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>'),
  block: I('<circle cx="12" cy="12" r="9"/><path d="m5.7 5.7 12.6 12.6"/>'),
  camera: I('<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/>'),
  pmu: I('<path d="M4 21V8l8-5 8 5v13"/><path d="M9 21v-6h6v6M9 11h.01M15 11h.01"/>'),
  shield: I('<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/><path d="m8.8 12.2 2.4 2.4 4.2-4.6"/>'),
  info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.8v.1"/>'),
  download: I('<path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15"/>'),
  sun: I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  moon: I('<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/>'),
  phone: I('<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/>'),
  moto: I('<circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M5.5 16.5 9 9h5l4.5 7.5M9 9 7.5 6.5H5M12 12.5h4"/>')
};

/* ---------- datos ---------- */
const CAT = {
  4: { k: 'k-sos', t: 'SOS', ayuda: 'Atrapados o heridos graves', ic: 'sos', sms: 'SOS' },
  3: { k: 'k-salud', t: 'Salud y víveres', ayuda: 'Medicamentos, agua, comida', ic: 'salud', sms: 'Salud y víveres' },
  2: { k: 'k-danos', t: 'Daños', ayuda: 'Casas, vías, puentes', ic: 'danos', sms: 'Daños' },
  1: { k: 'k-bien', t: 'Estamos bien', ayuda: 'Sin novedad', ic: 'bien', sms: 'Estamos bien' }
};
const CONN = {
  con: { cls: 'net-con', ic: 'signal', corto: 'Con señal', largo: 'Con señal' },
  sin: { cls: 'net-sin', ic: 'nosignal', corto: 'Sin señal: el mensaje queda guardado', largo: 'Sin señal: tu mensaje se guardará y saldrá con el próximo equipo que pase' },
  radio: { cls: 'net-radio', ic: 'radio', corto: 'Radio comunitario conectado', largo: 'Radio comunitario conectado' }
};
const QUIEN = ['Niños', 'Adultos mayores', 'Discapacidad o movilidad reducida', 'Embarazadas', 'Dependen de oxígeno o electricidad'];
const NECESITA = ['Agua', 'Comida', 'Medicina', 'Refugio', 'Rescate', 'Energía'];
const ROLES = {
  vecino: { t: 'Vecino', home: 'inicio', sector: 'Vereda alta · Ocaña', tabs: [['inicio', 'home', 'Inicio'], ['envio', 'send', 'Mi envío'], ['ayuda', 'help', 'Ayuda']] },
  vigia: { t: 'Vigía', home: 'pase', sector: 'Ladera norte · Ocaña', tabs: [['pase', 'clip', 'Pase de lista'], ['ayuda', 'help', 'Ayuda']] },
  brigadista: { t: 'Brigadista', home: 'tareas', sector: 'Defensa Civil 3 · Moto', tabs: [['tareas', 'list', 'Tareas'], ['mula', 'box', 'Recoger'], ['ayuda', 'help', 'Ayuda']] }
};
const SITIOS = {
  ladera: { n: 'Ladera norte', km: '3,9', min: 18 },
  ribera: { n: 'Ribera del río', km: '0,9', min: 4 }
};
const MULA = { 4: 2, 3: 3, 2: 4, 1: 3 };

/* ---------- estado ---------- */
const blank = () => ({ personas: 1, atrapados: null, heridos: null, quien: [], necesita: [], via: false });
const ejemplo = () => ({ personas: 5, atrapados: 'si', heridos: 'leves', quien: ['Adultos mayores'], necesita: ['Agua', 'Medicina'], via: false });
const base = () => ({
  role: 'vecino', screen: 'inicio', conn: 'sin', min: 14 * 60 + 13, cat: null, det: blank(), envio: null,
  pase: { resp: null, hist: [{ h: `12:00${NB}m.`, r: 2 }, { h: `10:00 a.${NB}m.`, r: 1 }] },
  ruta: null, foco: 'ladera', mula: { fase: 'idle' },
  ver: { dano: null, atrapados: 0, heridos: 0, fallecidos: 0, viviendas: 0, via: false, foto: false, enviado: false },
  toast: null
});
const PRESETS = [
  { t: 'Inicio del vecino', s: 'Vecino · Sin señal', make: () => base() },
  { t: 'Detalles rápidos', s: 'Vecino · Sin señal · todo es opcional', make: () => ({ ...base(), screen: 'detalles', cat: 4, det: ejemplo() }) },
  { t: 'Estado del envío', s: 'Vecino · Sin señal · el mensaje queda guardado', make: () => ({ ...base(), screen: 'envio', cat: 4, min: 14 * 60 + 14,
      envio: { cat: 4, min: 14 * 60 + 14, sin: false, det: { ...blank(), personas: 5, atrapados: 'si', necesita: ['Agua', 'Medicina'] } } }) },
  { t: 'Pase de lista del vigía', s: 'Vigía · Con señal', make: () => ({ ...base(), role: 'vigia', screen: 'pase', conn: 'con', min: 14 * 60 + 1 }) },
  { t: 'Tareas del brigadista', s: 'Brigadista · Sin señal · mapa sin internet', make: () => ({ ...base(), role: 'brigadista', screen: 'tareas', min: 14 * 60 + 20 }) },
  { t: 'Mula de datos', s: 'Brigadista · Sin señal · recoger mensajes', make: () => ({ ...base(), role: 'brigadista', screen: 'mula', min: 14 * 60 + 47, mula: { fase: 'listo' } }) },
  { t: 'Verificación en terreno', s: 'Brigadista · Radio comunitario', make: () => ({ ...base(), role: 'brigadista', screen: 'verifica', conn: 'radio', min: 15 * 60 + 5, ruta: 'ladera',
      ver: { dano: true, atrapados: 2, heridos: 1, fallecidos: 0, viviendas: 6, via: true, foto: false, enviado: false } }) },
  { t: 'Privacidad y ayuda', s: 'Para todos los usuarios', make: () => ({ ...base(), screen: 'ayuda', conn: 'con' }) }
];

let st = base();
let view = 'gallery';
let toastTimer = 0, scanTimer = 0;
const narrowMQ = window.matchMedia('(max-width: 520px)');
const isNarrow = () => narrowMQ.matches;
const themeNow = () => document.documentElement.dataset.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
const themeIcon = () => (themeNow() === 'dark' ? ICON.sun : ICON.moon);

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

/* ---------- piezas ---------- */
function topbar(s) {
  const sub = s.screen === 'detalles' || s.screen === 'verifica';
  const lead = sub
    ? `<button type="button" class="backbtn" data-action="atras" aria-label="Volver">${ICON.back}</button>`
    : '';
  const sector = s.screen === 'verifica' ? SITIOS[s.ruta || 'ladera'].n : ROLES[s.role].sector;
  return `<header class="topbar">${lead}
    <div class="brand">${logoSvg('word')}<small>${sector}</small></div>
    <button type="button" class="theme-btn" data-action="theme" data-theme-btn aria-label="Cambiar entre fondo claro y oscuro">${themeIcon()}</button>
  </header>`;
}

function connbar(s) {
  const c = CONN[s.conn];
  const txt = s.conn === 'sin' && (s.screen === 'inicio' || s.screen === 'detalles') ? c.largo : c.corto;
  const i = txt.indexOf(': ');
  const html = i > 0 ? `<b>${txt.slice(0, i)}:</b> ${txt.slice(i + 2)}` : `<b>${txt}</b>`;
  return `<div class="connbar ${c.cls}" role="status">${ICON[c.ic]}<p>${html}</p></div>`;
}

function tabbar(s) {
  const cur = s.screen;
  return `<nav class="tabbar" aria-label="Secciones">${ROLES[s.role].tabs.map(([id, ic, t]) =>
    `<button type="button" class="tab" data-action="tab" data-tab="${id}" ${cur === id ? 'aria-current="page"' : ''}>${ICON[ic]}<span>${t}</span></button>`).join('')}</nav>`;
}

const triBtn = (n, action = 'cat') => {
  const c = CAT[n];
  return `<button type="button" class="tri ${c.k}" data-action="${action}" data-n="${n}" aria-label="${n}. ${c.t}. ${c.ayuda}">
    <span class="num"><b>${n}</b>${ICON[c.ic]}</span>
    <span class="txt"><b>${c.t}</b><span>${c.ayuda}</span></span></button>`;
};

/* ---------- 1. inicio del vecino ---------- */
function inicio() {
  return `<div class="stack">
    <h1 class="q">¿Qué está pasando?</h1>
    ${[4, 3, 2, 1].map(n => triBtn(n)).join('')}
    <p class="priv">${ICON.lock}<span>Sin registro. No compartimos tu nombre.</span></p>
  </div>`;
}

/* ---------- 2. detalles rápidos ---------- */
function detalles(s) {
  const c = CAT[s.cat], d = s.det;
  const show = { 4: ['atr', 'her', 'qui', 'nec', 'via'], 3: ['her', 'qui', 'nec', 'via'], 2: ['qui', 'nec', 'via'], 1: ['qui'] }[s.cat];
  const has = k => show.includes(k);
  const opt = (key, val, txt, cur, ic) => `<button type="button" data-action="set" data-key="${key}" data-val="${val}" aria-pressed="${cur === val}">${cur === val && ic ? ICON.check : ''}${txt}</button>`;
  const chip = (key, val, arr) => `<button type="button" class="chip" data-action="chip" data-key="${key}" data-val="${esc(val)}" aria-pressed="${arr.includes(val)}">${arr.includes(val) ? ICON.check : ''}${val}</button>`;
  return `<div class="stack">
    <div class="dhead ${c.k}"><span class="num"><b>${s.cat}</b>${ICON[c.ic]}</span><div><h1>${c.t}</h1><p>Todo es opcional</p></div></div>
    <section class="blk"><h2>¿Cuántas personas están con usted?</h2>
      <div class="counter">
        <button type="button" class="sbtn" data-action="dec" data-grp="det" data-key="personas" aria-label="Una persona menos" ${d.personas <= 1 ? 'disabled' : ''}>${ICON.minus}</button>
        <output class="cnum" aria-live="polite">${d.personas}</output>
        <button type="button" class="sbtn" data-action="inc" data-grp="det" data-key="personas" aria-label="Una persona más">${ICON.plus}</button>
      </div></section>
    ${has('atr') ? `<section class="blk"><h2>¿Hay personas atrapadas?</h2>
      <div class="opts" role="group" aria-label="Personas atrapadas">${opt('atrapados', 'si', 'Sí', d.atrapados, 1)}${opt('atrapados', 'no', 'No', d.atrapados, 1)}</div></section>` : ''}
    ${has('her') ? `<section class="blk"><h2>¿Hay heridos?</h2>
      <div class="opts" role="group" aria-label="Heridos">${opt('heridos', 'ninguno', 'Ninguno', d.heridos)}${opt('heridos', 'leves', 'Leves', d.heridos)}${opt('heridos', 'graves', 'Graves', d.heridos)}</div></section>` : ''}
    ${has('qui') ? `<section class="blk"><h2>¿Quiénes están?</h2><div class="chips">${QUIEN.map(v => chip('quien', v, d.quien)).join('')}</div></section>` : ''}
    ${has('nec') ? `<section class="blk"><h2>¿Qué necesitan?</h2><div class="chips">${NECESITA.map(v => chip('necesita', v, d.necesita)).join('')}</div></section>` : ''}
    ${has('via') ? `<button type="button" class="swrow" role="switch" aria-checked="${d.via}" data-action="via"><span class="lab">${ICON.block}<span>La vía está bloqueada</span></span><span class="yn">${d.via ? 'Sí' : 'No'}</span><span class="sw"></span></button>` : ''}
  </div>`;
}

const footDetalles = s => `<div class="footbar two ${CAT[s.cat].k}">
  <button type="button" class="btn primary" data-action="enviar">Enviar ahora</button>
  <button type="button" class="btn" data-action="enviar-sin">Enviar sin detalles</button></div>`;

/* ---------- 3. estado del envío ---------- */
function resumenFilas(e) {
  const d = e.det, c = e.cat, f = [];
  if (e.sin) return [['Detalles', 'Sin detalles']];
  f.push(['Personas', personas(d.personas)]);
  if (c === 4 && d.atrapados) f.push(['Atrapados', d.atrapados === 'si' ? 'sí' : 'no']);
  if ((c === 4 || c === 3) && d.heridos) f.push(['Heridos', d.heridos === 'ninguno' ? 'ninguno' : d.heridos]);
  if (d.quien.length) f.push(['Quiénes', lista(d.quien.map(x => x.toLowerCase()))]);
  if (d.necesita.length) f.push(['Necesidades', lista(d.necesita.map(x => x.toLowerCase()))]);
  if (d.via) f.push(['Vía', 'bloqueada']);
  return f;
}

function envio(s) {
  const e = s.envio;
  if (!e) {
    return `<div class="stack"><h1 class="q">Mi envío</h1>
      <div class="empty"><p class="h2">Aún no has enviado ningún mensaje.</p>
      <button type="button" class="btn primary k-neutro block" data-action="tab" data-tab="inicio">${ICON.home}Ir al inicio</button></div></div>`;
  }
  const c = CAT[e.cat], t = hhmm(e.min), sin = s.conn === 'sin';
  const por = s.conn === 'radio' ? 'radio comunitario' : 'SMS';
  const step = (cls, ic, tit, sub) => `<li class="${cls} ${CONN[s.conn].cls}"><span class="tic">${ICON[ic]}</span><span class="tx"><b>${tit}</b><span>${sub}</span></span></li>`;
  return `<div class="stack">
    <h1 class="h1">Estado de tu envío</h1>
    <ol class="tl" aria-label="Pasos del envío">
      ${step('done', 'check', 'Guardado en tu teléfono', `Hecho · ${t}`)}
      ${step(sin ? 'wait' : 'done', sin ? 'send' : 'check', 'Enviado por SMS o radio', sin ? 'En espera · sale con el próximo equipo' : `Hecho · ${t} · ${por}`)}
      ${step(sin ? 'pend' : 'wait', 'pmu', 'Recibido en el Puesto de Mando', sin ? 'Pendiente' : 'En espera · aún sin confirmación')}
    </ol>
    <article class="sumcard ${c.k}" aria-label="Resumen del mensaje">
      <div class="top"><span class="num">${ICON[c.ic]}</span><b>${e.cat} · ${c.t}</b></div>
      <dl class="kv">${resumenFilas(e).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
    </article>
    <p class="note">${ICON.info}<span>Si no hay señal, el mensaje sale solo cuando pase un equipo de rescate. Puedes cerrar la app.</span></p>
    <button type="button" class="btn block" data-action="otro">Enviar otro mensaje</button>
  </div>`;
}

/* ---------- 4. pase de lista del vigía ---------- */
function pase(s) {
  const p = s.pase;
  const hist = p.hist.map(h => `<li class="${CAT[h.r].k}"><span>${h.r} · ${CAT[h.r].t}</span><time>${h.h}</time></li>`).join('');
  let resp;
  if (p.resp) {
    const c = CAT[p.resp];
    const donde = s.conn === 'sin' ? 'Quedó guardada y sale con el próximo equipo.' : s.conn === 'radio' ? 'Enviada por radio comunitario.' : 'Enviada con señal.';
    resp = `<div class="sent ${c.k}"><div class="top"><span class="num">${ICON[c.ic]}</span><b>Respuesta enviada: ${p.resp} · ${c.t}</b></div>
      <p>${donde}</p><button type="button" class="btn block" data-action="cambiar">Cambiar respuesta</button></div>`;
  } else {
    resp = [4, 3, 2, 1].map(n => triBtn(n, 'pase-resp')).join('');
  }
  return `<div class="stack">
    <div><p class="eyebrow">Barrio Ladera norte · usted es vigía</p><h1 class="h1">Pase de lista de las 2:00${NB}p.${NB}m.</h1></div>
    <h2 class="q">¿Cómo está su sector?</h2>
    ${resp}
    <p class="note">${ICON.phone}<span>Si no tiene datos, puede responder por SMS con un solo número: 1, 2, 3 o 4.</span></p>
    <h2 class="h2">Sus últimas respuestas</h2>
    <ul class="hist">${hist}</ul>
  </div>`;
}

/* ---------- 5. tareas del brigadista ---------- */
function mapa(foco) {
  const rutas = {
    ladera: 'M218 146 C190 146 150 142 112 138 C96 130 86 112 80 92',
    ribera: 'M218 146 C190 152 160 162 142 182 C134 192 130 198 128 202'
  };
  const k = foco === 'ribera' ? 'k-sos' : 'k-pend';
  return `<svg class="map ${k}" viewBox="10 40 340 210" role="img" aria-label="Mapa sin conexión con la ruta desde el Puesto de Mando hasta ${SITIOS[foco].n}">
    <rect class="map-bg" x="0" y="0" width="360" height="330"/>
    <path class="map-slope" d="M0 0H172C160 52 122 104 62 122C32 130 12 128 0 126Z"/>
    <path class="map-contour" d="M0 34C62 40 112 24 152 0M0 64C72 74 132 54 176 22M0 94C60 102 114 84 158 54"/>
    <path class="map-river" d="M150 0C160 70 112 120 128 195S152 280 112 330"/>
    <path class="map-road" d="M0 140C90 132 170 150 360 128M224 0C222 90 232 210 214 330M0 236C110 230 220 246 360 234M298 0C300 70 306 120 307 330"/>
    <path class="route-bg" d="${rutas[foco]}"/>
    <path class="route" d="${rutas[foco]}"/>
    <circle class="pin-c" cx="78" cy="84" r="${foco === 'ladera' ? 12 : 7}" style="--c:var(--pend)"/>
    <circle class="pin-c" cx="128" cy="205" r="${foco === 'ribera' ? 12 : 7}" style="--c:var(--sos)"/>
    <rect class="pmu-sq" x="209" y="137" width="18" height="18" rx="4"/>
    <text class="pmu-t" x="218" y="177">Puesto de Mando</text>
    <text class="pin-t" x="78" y="60">Ladera norte</text>
    <text class="pin-t" x="128" y="238">Ribera del río</text>
  </svg>`;
}

function tarea(id, s) {
  const lad = id === 'ladera', k = lad ? 'k-pend' : 'k-sos', si = SITIOS[id];
  const enRuta = s.ruta === id;
  const titulo = lad ? 'Mandar a mirar: Ladera norte' : 'Ayuda ya: Ribera del río';
  const cuerpo = lad ? '<p><b>Por qué:</b> 2.400 habitantes, zona de deslizamiento, nadie contesta desde hace 2 pases de lista</p>' : '<p><b>Enviar:</b> búsqueda y rescate</p>';
  const accion = enRuta
    ? `<p class="enruta">${ICON.moto}<span>En ruta · ${si.km} km · ${si.min} min</span></p>
       <button type="button" class="btn primary block" data-action="llegue" data-id="${id}">${lad ? 'Llegué: verificar' : 'Llegué: reportar'}</button>`
    : `<button type="button" class="btn primary block" data-action="ruta" data-id="${id}">Iniciar ruta</button>`;
  return `<article class="task ${k} ${lad ? 'dash' : ''}" aria-label="${titulo}">
    <h2><span class="tico">${ICON[lad ? 'eye' : 'sos']}</span><span>${titulo}</span></h2>${cuerpo}${accion}</article>`;
}

function tareas(s) {
  return `<div class="stack">
    <div><p class="eyebrow">Tareas del Puesto de Mando</p><h1 class="h1">Equipo Defensa Civil 3 · Moto</h1></div>
    <section class="mapcard" aria-label="Mapa de la ruta">${mapa(s.foco)}
      <p class="offline">${ICON.download}<span>Mapa descargado · funciona sin internet</span></p></section>
    ${tarea('ladera', s)}${tarea('ribera', s)}
  </div>`;
}

/* ---------- 6. mula de datos ---------- */
function mula(s) {
  const m = s.mula, listo = m.fase === 'listo', busca = m.fase === 'buscando';
  const total = Object.values(MULA).reduce((a, b) => a + b, 0);
  const btn = `<div class="radar ${listo ? 'small' : ''} ${busca ? 'scan' : ''}">
    <button type="button" class="rbtn" data-action="recoger" ${busca ? 'disabled' : ''} aria-label="Recoger mensajes cercanos">${ICON.box}<span>${busca ? 'Buscando…' : 'Recoger mensajes cercanos'}</span></button></div>`;
  const res = listo ? `<div class="result">
      <h2 class="h1">${total} mensajes recogidos de Vereda alta</h2>
      <div class="counts">${[4, 3, 2, 1].map(n => `<div class="count ${CAT[n].k}"><span class="ico">${ICON[CAT[n].ic]}</span><div><b>${MULA[n]}</b><span>${CAT[n].t}</span></div></div>`).join('')}</div>
      <p class="note">${ICON.info}<span>Se entregarán al Puesto de Mando apenas tengas señal o radio.</span></p></div>` : `
      <p class="note">${ICON.info}<span>Acércate a una vereda o barrio sin señal. Los teléfonos cercanos te pasan sus mensajes guardados.</span></p>`;
  return `<div class="stack"><h1 class="h1">Mula de datos</h1>${btn}${res}</div>`;
}

function pendbar(s) {
  const listo = s.mula.fase === 'listo';
  const total = Object.values(MULA).reduce((a, b) => a + b, 0);
  const n = listo ? total : 0;
  if (listo && s.conn !== 'sin') {
    return `<div class="pendbar done" role="status"><span>Entregados al Puesto de Mando</span><b>${n}</b></div>`;
  }
  return `<div class="pendbar" role="status"><span>Pendientes por entregar</span><b>${n}</b></div>`;
}

/* ---------- 7. verificación en terreno ---------- */
function verifica(s) {
  const v = s.ver, si = SITIOS[s.ruta || 'ladera'];
  if (v.enviado) {
    const donde = s.conn === 'sin' ? 'Quedó guardado y sale con la próxima señal, radio o mula de datos.' : s.conn === 'radio' ? 'Enviado por radio comunitario.' : 'Enviado con señal.';
    return `<div class="stack"><div class="sent ${v.dano ? 'k-sos' : 'k-bien'}"><div class="top"><span class="num">${ICON[v.dano ? 'sos' : 'bien']}</span><b>${v.dano ? 'Daño confirmado' : 'Sin daño'} en ${si.n}</b></div>
      <p>${donde}</p></div>
      <button type="button" class="btn block" data-action="volver-tareas">Volver a las tareas</button></div>`;
  }
  const num = (key, lab) => `<div class="crow"><span class="lab">${lab}</span><span class="st">
      <button type="button" class="sbtn" data-action="dec" data-grp="ver" data-key="${key}" aria-label="Menos: ${lab}" ${v[key] <= 0 ? 'disabled' : ''}>${ICON.minus}</button>
      <output aria-live="polite">${v[key]}</output>
      <button type="button" class="sbtn" data-action="inc" data-grp="ver" data-key="${key}" aria-label="Más: ${lab}">${ICON.plus}</button></span></div>`;
  return `<div class="stack">
    <h1 class="q">¿Qué encontraron en ${si.n}?</h1>
    <div class="yn2" role="group" aria-label="Resultado de la verificación">
      <button type="button" class="big2 k-sos" data-action="dano" data-val="si" aria-pressed="${v.dano === true}">${ICON.sos}Confirmamos daño</button>
      <button type="button" class="big2 k-bien" data-action="dano" data-val="no" aria-pressed="${v.dano === false}">${ICON.bien}No hay daño</button>
    </div>
    ${v.dano === false
      ? `<p class="note">${ICON.info}<span>Sin daño: se informa al Puesto de Mando como sector sin novedad confirmada.</span></p>`
      : `${num('atrapados', 'Personas atrapadas')}${num('heridos', 'Heridos graves')}${num('fallecidos', 'Fallecidos')}${num('viviendas', 'Viviendas afectadas')}
    <button type="button" class="swrow" role="switch" aria-checked="${v.via}" data-action="via-ver"><span class="lab">${ICON.block}<span>Vía bloqueada</span></span><span class="yn">${v.via ? 'Sí' : 'No'}</span><span class="sw"></span></button>
    <button type="button" class="swrow" data-action="foto" aria-pressed="${v.foto}"><span class="lab">${ICON.camera}<span>${v.foto ? 'Foto agregada' : 'Agregar foto'} <small class="opc">(opcional)</small></span></span>${v.foto ? ICON.check : ''}</button>`}
  </div>`;
}

const footVerifica = s => `<div class="footbar"><button type="button" class="btn primary k-neutro" data-action="ver-enviar" ${s.ver.dano === null ? 'disabled' : ''}>Enviar al Puesto de Mando</button></div>`;

/* ---------- 8. privacidad y ayuda ---------- */
function ayuda(s, live) {
  const demo = live && isNarrow() ? `<section class="blk"><h2>Probar la demostración</h2>
      <p class="sub">Quién usa la app</p>
      <div class="chips">${Object.entries(ROLES).map(([k, r]) => `<button type="button" class="chip" data-action="role" data-role="${k}" aria-pressed="${s.role === k}">${r.t}</button>`).join('')}</div>
      <p class="sub">Conexión</p>
      <div class="chips">${Object.entries(CONN).map(([k, c]) => `<button type="button" class="chip" data-action="conn" data-conn="${k}" aria-pressed="${s.conn === k}">${k === 'con' ? 'Con señal' : k === 'sin' ? 'Sin señal' : 'Radio comunitario'}</button>`).join('')}</div></section>` : '';
  return `<div class="stack">
    <h1 class="q">Privacidad y ayuda</h1>
    <section class="blk"><h2>¿Qué datos se envían?</h2>
      <ul class="dl">
        <li>${ICON.check}<span>El sector donde está</span></li>
        <li>${ICON.check}<span>Su ubicación aproximada</span></li>
        <li>${ICON.check}<span>El número de personas</span></li>
        <li>${ICON.check}<span>Lo que necesitan</span></li>
        <li class="no">${ICON.x}<span><b>Nunca</b> su nombre ni su documento</span></li>
      </ul>
      <p class="sub">Protegemos sus datos según la Ley 1581 de 2012 de protección de datos personales.</p></section>
    <section class="blk"><h2>Cómo enviar sin la app</h2>
      <p>Escriba al número del PMU solo un número:</p>
      <p class="bignum" aria-label="Número de ejemplo 300 000 0000">300 000 0000</p>
      <p class="sub">Número de ejemplo para la demostración</p>
      <ul class="codes">${[4, 3, 2, 1].map(n => `<li class="${CAT[n].k}"><span class="n">${n}</span><span>${CAT[n].t}</span></li>`).join('')}</ul></section>
    <button type="button" class="swrow" role="switch" aria-checked="${themeNow() === 'dark'}" data-action="theme"><span class="lab">${ICON.moon}<span>Fondo oscuro</span></span><span class="yn">${themeNow() === 'dark' ? 'Sí' : 'No'}</span><span class="sw"></span></button>
    ${demo}
  </div>`;
}

/* ---------- montaje ---------- */
const SCREENS = { inicio, detalles, envio, pase, tareas, mula, verifica, ayuda };
function appHtml(s, live) {
  const sc = s.screen;
  const foot = sc === 'detalles' ? footDetalles(s) : sc === 'verifica' && !s.ver.enviado ? footVerifica(s) : '';
  const tabs = sc === 'detalles' || sc === 'verifica' ? '' : tabbar(s);
  const pend = sc === 'mula' ? pendbar(s) : '';
  return `<div class="app">${topbar(s)}${connbar(s)}<main class="content" tabindex="-1">${SCREENS[sc](s, live)}</main>${foot}${pend}${tabs}${s.toast ? `<div class="toast" role="status">${esc(s.toast)}</div>` : ''}</div>`;
}

function phone(s, live) {
  const off = s.conn === 'sin';
  return `<div class="phone" ${live ? 'data-live' : 'aria-hidden="true"'}>
    <div class="screen"><span class="notch"></span>
      <div class="statusbar"><span>${hhmm(s.min).split(NB)[0]}</span>
        <span class="sb-r"><span class="sb-sig ${off ? 'off' : ''}"><i style="height:4px"></i><i style="height:6px"></i><i style="height:8px"></i><i style="height:11px"></i></span><span class="sb-bat"><i></i></span></span></div>
      ${appHtml(s, live)}
    </div></div>`;
}

function renderStage() {
  const stage = $('#stage');
  if (isNarrow() && view === 'gallery') view = 'app';
  document.querySelectorAll('[data-action="view"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  $('#demobar').hidden = view !== 'app';
  if (view === 'gallery') {
    stage.innerHTML = `<div class="gallery">${PRESETS.map((p, i) => `<figure class="gal-item">
      <div class="phone-wrap gal-open" role="button" tabindex="0" data-action="open-preset" data-i="${i}" aria-label="Abrir «${p.t}» en la app">${phone(p.make(), false)}</div>
      <figcaption class="gal-cap">${i + 1} · ${p.t}<small>${p.s}</small></figcaption></figure>`).join('')}</div>`;
  } else {
    stage.innerHTML = `<div class="phone-wrap live">${phone(st, true)}</div>`;
    fit();
  }
  syncControls();
}

function draw(reset) {
  const wrap = $('.phone-wrap.live');
  if (!wrap) return;
  const c = $('.content', wrap), sc = c ? c.scrollTop : 0;
  wrap.innerHTML = phone(st, true);
  const c2 = $('.content', wrap);
  if (c2 && !reset) c2.scrollTop = sc;
  syncControls();
}

function fit() {
  const wrap = $('.phone-wrap.live');
  if (!wrap) return;
  if (isNarrow()) { wrap.style.removeProperty('--s'); return; }
  const h = ['#showcase', '#demobar', '#showcase-foot'].reduce((a, id) => a + (($(id) && !$(id).hidden) ? $(id).offsetHeight : 0), 0);
  const s = Math.min(1, (innerHeight - h - 28) / 832, (innerWidth - 32) / 410);
  wrap.style.setProperty('--s', Math.max(.5, s).toFixed(3));
}

function syncControls() {
  document.querySelectorAll('[data-theme-btn]').forEach(b => { b.innerHTML = themeIcon(); });
  document.querySelectorAll('[data-action="role"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.role === st.role)));
  document.querySelectorAll('[data-action="conn"]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.conn === st.conn)));
}

/* ---------- acciones ---------- */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('alertia-tema', t); } catch (e) { /* sin almacenamiento */ }
}

function toast(msg) {
  st.toast = msg; draw();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { st.toast = null; draw(); }, 3400);
}

function setRole(r) {
  st = { ...base(), role: r, screen: ROLES[r].home, conn: st.conn };
  if (r === 'brigadista') st.min = 14 * 60 + 20;
  clearTimeout(scanTimer);
}

function enviar(sin) {
  st.min += 1;
  st.envio = { cat: st.cat, min: st.min, sin, det: { ...st.det, quien: [...st.det.quien], necesita: [...st.det.necesita] } };
  st.screen = 'envio';
}

function setView(v) {
  view = isNarrow() ? 'app' : v;
  renderStage();
}

document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  if (a === 'theme') { setTheme(themeNow() === 'dark' ? 'light' : 'dark'); draw(); syncControls(); return; }
  if (a === 'view') { setView(el.dataset.view); return; }
  if (a === 'open-preset') { st = PRESETS[+el.dataset.i].make(); setView('app'); return; }
  if (a === 'role' && view === 'app') { setRole(el.dataset.role); draw(true); return; }
  if (a === 'conn' && view === 'app') { st.conn = el.dataset.conn; draw(); return; }
  if (!el.closest('[data-live]')) return;

  let reset = false;
  switch (a) {
    case 'tab': st.screen = el.dataset.tab; reset = true; break;
    case 'cat': st.cat = +el.dataset.n; st.det = blank(); st.screen = 'detalles'; reset = true; break;
    case 'atras': st.screen = st.screen === 'verifica' ? 'tareas' : 'inicio'; reset = true; break;
    case 'inc': case 'dec': {
      const d = a === 'inc' ? 1 : -1, k = el.dataset.key, box = el.dataset.grp === 'det' ? st.det : st.ver;
      box[k] = clamp(box[k] + d, el.dataset.grp === 'det' ? 1 : 0, 99); break;
    }
    case 'set': st.det[el.dataset.key] = st.det[el.dataset.key] === el.dataset.val ? null : el.dataset.val; break;
    case 'chip': {
      const arr = st.det[el.dataset.key], v = el.dataset.val, i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1); else arr.push(v); break;
    }
    case 'via': st.det.via = !st.det.via; break;
    case 'enviar': enviar(false); reset = true; break;
    case 'enviar-sin': enviar(true); reset = true; break;
    case 'otro': st.cat = null; st.det = blank(); st.screen = 'inicio'; reset = true; break;
    case 'pase-resp':
      st.min += 1; st.pase.resp = +el.dataset.n; st.pase.hist.unshift({ h: hhmm(st.min), r: st.pase.resp }); break;
    case 'cambiar': st.pase.hist.shift(); st.pase.resp = null; break;
    case 'ruta': st.ruta = el.dataset.id; st.foco = el.dataset.id; break;
    case 'llegue': st.ruta = el.dataset.id; st.screen = 'verifica'; st.ver = { ...base().ver }; reset = true; break;
    case 'volver-tareas': st.screen = 'tareas'; st.ver = { ...base().ver }; st.ruta = null; reset = true; break;
    case 'recoger':
      st.mula = { fase: 'buscando' }; clearTimeout(scanTimer);
      scanTimer = setTimeout(() => { if (st.mula.fase === 'buscando') { st.mula = { fase: 'listo' }; st.min += 2; draw(); } }, 1700);
      break;
    case 'dano': st.ver.dano = el.dataset.val === 'si'; if (!st.ver.dano) { Object.assign(st.ver, { atrapados: 0, heridos: 0, fallecidos: 0, viviendas: 0, via: false }); } break;
    case 'via-ver': st.ver.via = !st.ver.via; break;
    case 'foto': st.ver.foto = !st.ver.foto; break;
    case 'ver-enviar':
      if (st.ver.dano === null) return;
      st.min += 1; st.ver.enviado = true; reset = true; break;
    default: return;
  }
  draw(reset);
});

document.addEventListener('keydown', ev => {
  if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches('[role="button"][data-action]')) {
    ev.preventDefault(); ev.target.click();
  }
});

window.addEventListener('resize', fit);
(narrowMQ.addEventListener ? narrowMQ.addEventListener.bind(narrowMQ, 'change') : narrowMQ.addListener.bind(narrowMQ))(() => renderStage());

/* ---------- inicio ---------- */
try { const t = localStorage.getItem('alertia-tema'); if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t; } catch (e) { /* sin almacenamiento */ }
const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark' || q.get('tema') === 'light') document.documentElement.dataset.theme = q.get('tema');
const pantalla = parseInt(q.get('pantalla'), 10);
if (pantalla >= 1 && pantalla <= PRESETS.length) { st = PRESETS[pantalla - 1].make(); view = 'app'; }
else if (q.get('vista') === 'app') view = 'app';
renderStage();
})();
