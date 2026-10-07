// Temporadas comerciales: se activan solas según la fecha. Lo usan la portada (index.html) y el catálogo (catalogo.html).
// Para previsualizar una temporada: agrega ?season=navidad (o valentin, madres, flores-amarillas) al final del link.

// === EDITAR AQUÍ: temporadas comerciales. Se activan solas según la fecha de hoy (mes/día, sin año). ===
// Para agregar una nueva, copia un bloque y cambia id, fechas (start/end en [mes, dia]), textos y colores.
const SEASONS = [
  { id:'flores-amarillas', badge:'Día de las Flores Amarillas',
    banner:'21 de septiembre: <strong>Día de las Flores Amarillas</strong> — sorprende con una flor eterna que no se marchita.',
    accent:'#C99A0E', accentSoft:'#F7E7B0', glow:'#F2C94C', start:[9,18], end:[9,21] },
  { id:'navidad', badge:'Especial de Navidad',
    banner:'Ideas de regalo para esta <strong>Navidad</strong>: jabones, velones y flores eternas.',
    accent:'#8E2B3A', accentSoft:'#F3DDDF', glow:'#C8A15A', start:[12,1], end:[1,6] },
  { id:'valentin', badge:'Día del Amor y la Amistad',
    banner:'Detalles para <strong>San Valentín</strong>: velones aromáticos y flores eternas que no se marchitan.',
    accent:'#9E1B32', accentSoft:'#F3DADD', glow:'#E8A0AE', start:[2,1], end:[2,14] },
  { id:'madres', badge:'Día de las Madres',
    banner:'Regalos para el <strong>Día de las Madres</strong>: flores eternas y sets de jabones.',
    accent:'#7A4E6D', accentSoft:'#EBD3D6', glow:'#D9A7B4', start:[5,18], end:[5,31] }
];

function dateInRange(month, day, start, end){
  const val = month*100 + day, s = start[0]*100 + start[1], e = end[0]*100 + end[1];
  return s <= e ? (val >= s && val <= e) : (val >= s || val <= e);
}

function getActiveSeason(){
  // Para previsualizar una temporada sin esperar la fecha, entra a la página agregando ?season=id al final,
  // por ejemplo: ecartesanias.com/?season=navidad
  const preview = new URLSearchParams(location.search).get('season');
  if (preview) {
    const found = SEASONS.find(s => s.id === preview);
    if (found) return found;
  }
  const now = new Date();
  return SEASONS.find(s => dateInRange(now.getMonth()+1, now.getDate(), s.start, s.end)) || null;
}

const FLOWER_SVG = `<svg viewBox="0 0 40 40"><g fill="#F2C94C"><ellipse cx="20" cy="10" rx="5" ry="9"/><ellipse cx="20" cy="10" rx="5" ry="9" transform="rotate(72 20 20)"/><ellipse cx="20" cy="10" rx="5" ry="9" transform="rotate(144 20 20)"/><ellipse cx="20" cy="10" rx="5" ry="9" transform="rotate(216 20 20)"/><ellipse cx="20" cy="10" rx="5" ry="9" transform="rotate(288 20 20)"/></g><circle cx="20" cy="20" r="4.5" fill="#B5791A"/></svg>`;

const STAR_SVG = `<svg viewBox="0 0 40 40"><path d="M20 2 L23 17 L38 20 L23 23 L20 38 L17 23 L2 20 L17 17 Z" fill="#E2C27E"/><path d="M20 10 L21.5 18.5 L30 20 L21.5 21.5 L20 30 L18.5 21.5 L10 20 L18.5 18.5 Z" fill="#FFF3D6" transform="rotate(45 20 20)"/></svg>`;

const EMBER_SVG = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="9" fill="#F2C46B"/><circle cx="20" cy="20" r="4.5" fill="#FFF1CF"/></svg>`;

const DOT_SVG = `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="8" fill="var(--season-accent)"/></svg>`;

const PETAL_SVG = `<svg viewBox="0 0 40 40"><path d="M20 3 C31 9 35 22 27 34 C24 38 16 38 13 34 C5 22 9 9 20 3 Z" fill="#B8304A"/><path d="M20 8 C26 13 27 22 22 31 C20 33 18 33 17 31" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2" stroke-linecap="round"/></svg>`;

const PETAL_BLUSH_SVG = `<svg viewBox="0 0 40 40"><path d="M20 3 C31 9 35 22 27 34 C24 38 16 38 13 34 C5 22 9 9 20 3 Z" fill="#E8B4BC"/><path d="M20 8 C26 13 27 22 22 31 C20 33 18 33 17 31" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-linecap="round"/></svg>`;

const WAX_HEART_SVG = `<svg viewBox="0 0 40 40">
  <circle cx="20" cy="20" r="18" fill="var(--season-accent)"/>
  <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="1.5" stroke-dasharray="2 4"/>
  <path d="M20 27 C13 22 10 17 13 13.5 C15.5 10.5 20 12 20 15.5 C20 12 24.5 10.5 27 13.5 C30 17 27 22 20 27 Z" fill="rgba(255,255,255,.85)"/>
</svg>`;

const SEASON_ICONS = {
  'valentin': WAX_HEART_SVG,
  'navidad': STAR_SVG
};

// Flor de nube (gypsophila): ramita blanca como la de los mini ramos.
const GYPSOPHILA_SVG = `<svg viewBox="0 0 40 40"><path d="M20 38 L20 22 M20 26 L12 16 M20 24 L28 14 M20 22 L20 10" stroke="#8A9A78" stroke-width="1.4" fill="none" stroke-linecap="round"/><g fill="#FFFFFF" stroke="rgba(75,46,69,.25)" stroke-width=".8"><circle cx="12" cy="15" r="3.2"/><circle cx="9" cy="11" r="2.6"/><circle cx="15" cy="11" r="2.4"/><circle cx="28" cy="13" r="3.2"/><circle cx="31" cy="9" r="2.4"/><circle cx="25" cy="9" r="2.6"/><circle cx="20" cy="9" r="3.4"/><circle cx="20" cy="4.5" r="2.6"/></g></svg>`;

const SEASON_FIELDS = {
  'flores-amarillas': { svg: FLOWER_SVG, glow: 'rgba(242,201,76,.5)' },
  'navidad': { svg: EMBER_SVG, glow: '#F2C46B', variant: 'rise' },
  'valentin': { svg: [PETAL_SVG, PETAL_BLUSH_SVG, PETAL_BLUSH_SVG], glow: 'rgba(158,27,50,.25)' },
  'madres': { svg: GYPSOPHILA_SVG, glow: 'rgba(255,255,255,.6)' }
};

// Charamico: rama seca pintada de dorado, el árbol de Navidad tradicional dominicano.
const CHARAMICO_SVG = `<svg viewBox="0 0 500 70" preserveAspectRatio="none">
  <path class="limb" stroke-width="3.2" pathLength="1" d="M-6 34 C60 22 110 28 160 24 S260 14 320 20 S430 30 506 16"/>
  <path class="limb" stroke-width="1.6" pathLength="1" d="M70 26 C80 12 92 8 104 6 M96 10 L102 -2 M150 25 C158 38 170 46 184 50 M232 18 C240 6 250 2 262 0 M300 19 C312 32 326 38 342 40 M330 34 L338 48 M392 26 C400 12 414 6 428 6 M452 22 C462 34 474 40 490 42 M24 30 C30 42 38 48 50 52"/>
  <circle class="tip" cx="104" cy="6" r="2.6"/><circle class="tip" cx="102" cy="-2" r="2"/><circle class="tip" cx="184" cy="50" r="2.6"/>
  <circle class="tip" cx="262" cy="0" r="2.6"/><circle class="tip" cx="342" cy="40" r="2.6"/><circle class="tip" cx="338" cy="48" r="2"/>
  <circle class="tip" cx="428" cy="6" r="2.6"/><circle class="tip" cx="490" cy="42" r="2.6"/><circle class="tip" cx="50" cy="52" r="2.6"/>
  <circle class="light" cx="40" cy="30" r="2.4"/><circle class="light" cx="128" cy="26" r="2.4"/><circle class="light" cx="206" cy="20" r="2.4"/>
  <circle class="light" cx="280" cy="17" r="2.4"/><circle class="light" cx="364" cy="24" r="2.4"/><circle class="light" cx="440" cy="25" r="2.4"/>
  <circle class="light" cx="84" cy="16" r="1.8"/><circle class="light" cx="168" cy="43" r="1.8"/><circle class="light" cx="316" cy="30" r="1.8"/><circle class="light" cx="470" cy="34" r="1.8"/>
</svg>`;

function christmasBannerText(){
  const now = new Date(), m = now.getMonth() + 1, d = now.getDate();
  if (m === 1) return 'Todavía hay tiempo para los <strong>Reyes</strong>: velones, jabones y flores eternas para regalar.';
  if (m === 12 && d === 24) return 'Hoy es <strong>Nochebuena</strong>. Escríbenos y te ayudamos con un regalo de último momento.';
  if (m === 12 && d > 24) return '<strong>Feliz Navidad</strong> de parte de Artesanías EC.';
  return `Faltan <strong>${daysLabel(daysUntil(12, 24))} para Nochebuena</strong>. Pide con tiempo tus regalos hechos a mano.`;
}

function valentinBannerText(){
  const now = new Date();
  if (now.getMonth() === 1 && now.getDate() === 14) return 'Hoy es el <strong>Día del Amor y la Amistad</strong>. Escríbenos y te ayudamos con un detalle de último momento.';
  return `Faltan <strong>${daysLabel(daysUntil(2, 14))} para el 14 de febrero</strong>. Flores eternas, velones y jabones para regalar.`;
}

// En República Dominicana el Día de las Madres es el último domingo de mayo.
function mothersDay(year){
  const d = new Date(year, 4, 31);
  d.setDate(31 - d.getDay());
  return d;
}

function madresBannerText(){
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = mothersDay(now.getFullYear());
  if (target < today) target = mothersDay(now.getFullYear() + 1);
  const days = Math.round((target - today) / 86400000);
  if (days === 0) return 'Hoy es el <strong>Día de las Madres</strong>. Escríbenos y te ayudamos con un regalo de último momento.';
  return `Faltan <strong>${daysLabel(days)} para el Día de las Madres</strong> (domingo ${target.getDate()} de mayo). Flores eternas y sets de jabones para mamá.`;
}

// Días que faltan para la próxima fecha [mes, día] (si ya pasó este año, cuenta para el siguiente).
function daysUntil(month, day){
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(now.getFullYear(), month - 1, day);
  if (target < today) target = new Date(now.getFullYear() + 1, month - 1, day);
  return Math.round((target - today) / 86400000);
}

function daysLabel(days){ return `${days} ${days === 1 ? 'día' : 'días'}`; }

// Fecha del día especial de cada temporada en un año dado (la usa el calendario de regalos de la portada).
function seasonEventDate(id, year){
  switch (id) {
    case 'flores-amarillas': return new Date(year, 8, 21);
    case 'navidad': return new Date(year, 11, 24);
    case 'valentin': return new Date(year, 1, 14);
    case 'madres': return mothersDay(year);
  }
  return null;
}

// Próxima vez que llega ese día (si ya pasó este año, la del año que viene) y cuántos días faltan.
function nextSeasonEvent(id){
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let date = seasonEventDate(id, now.getFullYear());
  if (date < today) date = seasonEventDate(id, now.getFullYear() + 1);
  return { date, days: Math.round((date - today) / 86400000) };
}

function loadScript(src){
  return new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src; el.onload = resolve; el.onerror = reject;
    document.head.appendChild(el);
  });
}

// Se carga una sola vez aunque lo pidan la temporada y el resto de la página.
let gsapReady = null;
function loadGsap(){
  const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/';
  gsapReady = gsapReady || loadScript(CDN + 'gsap.min.js')
    .then(() => loadScript(CDN + 'ScrollTrigger.min.js'))
    .then(() => gsap.registerPlugin(ScrollTrigger));
  return gsapReady;
}

// Listón de satín que amarra las tres fotos del inicio, con moño y sello de lacre "EC".
// Coordenadas en % del área de fotos (viewBox 100x100 estirado), por eso el trazo no escala.
// El listón largo va detrás de las fotos; el moño y las puntas van al frente.
const LAZO_BACK_SVG = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
  <g class="ribbon"><path pathLength="1" d="M-4 78 C12 62 30 52 44 46 C52 43 54 42 56 40 C66 30 82 26 104 8"/></g>
  <g class="ribbon-shine"><path pathLength="1" d="M-4 78 C12 62 30 52 44 46 C52 43 54 42 56 40 C66 30 82 26 104 8"/></g>
</svg>`;

const LAZO_FRONT_SVG = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
  <g class="ribbon">
    <path pathLength="1" d="M56 40 C55 48 52 56 47 64"/>
    <path pathLength="1" d="M56 40 C60 47 65 52 71 56"/>
  </g>
  <g class="ribbon-shine">
    <path pathLength="1" d="M56 40 C55 48 52 56 47 64"/>
    <path pathLength="1" d="M56 40 C60 47 65 52 71 56"/>
  </g>
  <g class="bow">
    <path d="M56 40 C46 26 36 26 38 36 C39 42 48 42 56 40 Z"/>
    <path d="M56 40 C66 24 78 26 75 37 C73 43 64 42 56 40 Z"/>
  </g>
  <g class="bow-fold">
    <path d="M55 39 C48 33 43 32 41 35"/>
    <path d="M57 39 C64 32 70 31 72 34"/>
  </g>
</svg>`;

const WAX_SEAL_SVG = `<svg viewBox="0 0 100 100">
  <path class="wax" d="M50 4 C62 3 70 10 79 12 C90 15 96 27 95 38 C94 47 99 55 96 65 C93 77 84 82 76 89 C67 96 57 95 48 97 C37 99 28 92 20 86 C10 79 5 70 4 58 C3 48 1 38 6 28 C11 17 22 13 32 9 C38 6 44 5 50 4 Z"/>
  <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="3"/>
  <circle cx="50" cy="50" r="31" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1" transform="translate(-1 -1)"/>
  <text x="50" y="61" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="32" fill="rgba(0,0,0,.28)">EC</text>
  <text x="49" y="60" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="32" fill="rgba(255,225,225,.55)">EC</text>
  <ellipse cx="34" cy="24" rx="10" ry="5" fill="rgba(255,255,255,.22)" transform="rotate(-30 34 24)"/>
</svg>`;

function setupValentin(){
  const badge = document.querySelector('.season-badge');
  if (badge) { badge.classList.add('season-badge--note'); badge.querySelector('.season-dot')?.remove(); }

  const archWindow = document.querySelector('.intro-window');
  if (archWindow) setupValentinLanding(archWindow);

  const art = document.querySelector('.hero-art');
  if (!art) return;
  art.classList.add('is-lazo');
  const lazoBack = document.createElement('div');
  lazoBack.className = 'lazo lazo--back';
  lazoBack.innerHTML = LAZO_BACK_SVG;
  const lazoFront = document.createElement('div');
  lazoFront.className = 'lazo lazo--front';
  lazoFront.innerHTML = LAZO_FRONT_SVG;
  const seal = document.createElement('div');
  seal.className = 'wax-seal';
  seal.innerHTML = WAX_SEAL_SVG;
  art.prepend(lazoBack);
  art.append(lazoFront, seal);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap().then(() => {
    gsap.timeline({ delay: .3 })
      .from(lazoBack.querySelectorAll('path'), { strokeDasharray: 1, strokeDashoffset: 1, duration: 1.2, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' })
      .from(lazoFront.querySelectorAll('.ribbon path, .ribbon-shine path'), { strokeDasharray: 1, strokeDashoffset: 1, duration: .6, ease: 'power2.out', clearProps: 'strokeDasharray,strokeDashoffset' }, '-=.2')
      .from(lazoFront.querySelectorAll('.bow path, .bow-fold path'), { scale: 0, svgOrigin: '56 40', duration: .6, ease: 'back.out(2)', stagger: .08 }, '-=.4')
      .from(seal, { scale: 1.9, rotation: -25, opacity: 0, duration: .45, ease: 'power3.in' }, '-=.1')
      .to(seal, { scaleX: 1.08, scaleY: .92, duration: .08, yoyo: true, repeat: 1, ease: 'power1.out' });

    // Parallax al hacer scroll: el regalo completo sube más lento, las fotos crecen un poco y el sello gira.
    const hero = document.querySelector('.hero');
    const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(art, { y: 70, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.fromTo(art.querySelectorAll('.seal-big'), { scale: 1 }, { scale: 1.1, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to(seal.firstElementChild, { rotation: 18, ease: 'none', scrollTrigger: { ...scrub } });
  }).catch(() => {});
}

// Portada: rama de charamico sobre el arco, con bolas doradas colgando a distintas alturas.
function buildArchCharamico(){
  const baubles = [[130, 37, 64, 16], [245, 33, 118, 21], [360, 26, 84, 17], [470, 29, 140, 22]];
  const hanging = baubles.map(([x, y, len, r], i) => `
    <g class="arch-bauble"><g class="arch-sway" style="transform-origin:${x}px ${y}px;animation-delay:${-i * 1.3}s">
      <line x1="${x}" y1="${y}" x2="${x}" y2="${y + len - r}" stroke="#E2C27E" stroke-width="1.2"/>
      <rect x="${x - r * .32}" y="${y + len - r - 7}" width="${r * .64}" height="8" rx="2" fill="#B8924A"/>
      <circle cx="${x}" cy="${y + len}" r="${r}" fill="url(#archGold)"/>
      <ellipse cx="${x - r * .35}" cy="${y + len - r * .35}" rx="${r * .22}" ry="${r * .3}" fill="rgba(255,255,255,.55)"/>
    </g></g>`).join('');
  return `<svg viewBox="0 0 600 230" aria-hidden="true">
    <defs><radialGradient id="archGold" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#FFF6DD"/><stop offset=".35" stop-color="#E2C27E"/><stop offset=".8" stop-color="#B8924A"/><stop offset="1" stop-color="#8E6A2E"/></radialGradient></defs>
    ${hanging}
    <path class="limb" stroke-width="4" pathLength="1" d="M-10 48 C80 30 160 40 245 33 S400 20 470 29 S560 42 610 22"/>
    <path class="limb" stroke-width="2" pathLength="1" d="M70 40 C80 24 92 18 108 14 M180 38 C190 54 204 62 220 66 M300 28 C310 12 324 6 340 4 M410 24 C420 40 434 48 450 52 M520 34 C530 18 546 12 562 12"/>
    <circle class="tip" cx="108" cy="14" r="3"/><circle class="tip" cx="220" cy="66" r="3"/><circle class="tip" cx="340" cy="4" r="3"/><circle class="tip" cx="450" cy="52" r="3"/><circle class="tip" cx="562" cy="12" r="3"/>
    <circle class="light" cx="40" cy="44" r="3"/><circle class="light" cx="190" cy="37" r="3"/><circle class="light" cx="300" cy="28" r="3"/><circle class="light" cx="410" cy="24" r="3"/><circle class="light" cx="540" cy="36" r="3"/>
  </svg>`;
}

function setupChristmasLanding(win){
  const decor = document.createElement('div');
  decor.className = 'arch-charamico charamico';
  decor.innerHTML = buildArchCharamico();
  win.appendChild(decor);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap().then(() => {
    gsap.timeline({ delay: .3 })
      .from(decor.querySelectorAll('.limb'), { strokeDasharray: 1, strokeDashoffset: 1, duration: 1.3, ease: 'power2.inOut', stagger: .2, clearProps: 'strokeDasharray,strokeDashoffset' })
      .from(decor.querySelectorAll('.tip, .light'), { opacity: 0, duration: .4, stagger: .03, clearProps: 'opacity' }, '-=.6')
      .from(decor.querySelectorAll('.arch-bauble'), { y: -60, opacity: 0, duration: 1.2, ease: 'elastic.out(1, .45)', stagger: .15 }, '-=.8');
    // Al bajar, la rama sube y se desvanece mientras el arco se abre.
    gsap.to(decor, { autoAlpha: 0, y: -80, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top 84px', end: '+=320', scrub: true } });
  }).catch(() => {});
}

function setupChristmas(){
  const badge = document.querySelector('.season-badge');
  if (badge) { badge.classList.add('season-badge--tag'); badge.querySelector('.season-dot')?.remove(); }

  const archWindow = document.querySelector('.intro-window');
  if (archWindow) setupChristmasLanding(archWindow);

  const art = document.querySelector('.hero-art');
  if (!art) return;
  art.classList.add('is-charamico');
  const branch = document.createElement('div');
  branch.className = 'charamico';
  branch.innerHTML = CHARAMICO_SVG;
  art.prepend(branch);

  // Cada foto se envuelve en un adorno (hilo + tapita dorada). La imagen conserva sus clases para que siga la rotación de fotos.
  art.querySelectorAll('.seal-big').forEach((img, i) => {
    const ornament = document.createElement('div');
    ornament.className = `ornament o${i + 1}`;
    ornament.innerHTML = '<div class="ornament-sway"><span class="ornament-cap"></span></div>';
    img.replaceWith(ornament);
    ornament.firstChild.appendChild(img);
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap()
    .then(() => {
      const ornaments = art.querySelectorAll('.ornament');
      gsap.timeline()
        .from(branch.querySelectorAll('.limb'), { strokeDasharray: 1, strokeDashoffset: 1, duration: 1.4, ease: 'power2.inOut', stagger: .2, clearProps: 'strokeDasharray,strokeDashoffset' })
        .from(branch.querySelectorAll('.tip, .light'), { opacity: 0, duration: .4, stagger: .03, clearProps: 'opacity' }, '-=.6')
        .from(ornaments, { y: -90, opacity: 0, duration: 1.3, ease: 'elastic.out(1, .45)', stagger: .18 }, '-=.9');

      // Parallax al hacer scroll: la rama con sus adornos sube más lento que la página,
      // cada adorno se columpia desde su hilo (sin despegarse de la rama) y la foto crece un poco.
      const hero = document.querySelector('.hero');
      const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to(art, { y: 70, ease: 'none', scrollTrigger: { ...scrub } });
      [5, -7, 9].forEach((rotation, i) => {
        if (!ornaments[i]) return;
        gsap.to(ornaments[i], { rotation, transformOrigin: '50% 0', ease: 'none', scrollTrigger: { ...scrub } });
        gsap.fromTo(ornaments[i].querySelector('img'), { scale: 1 }, { scale: 1.12, ease: 'none', scrollTrigger: { ...scrub } });
      });
    })
    .catch(() => {});
}

// Ramo: las tres fotos salen de un cono de papel kraft amarrado con hilo, con tarjeta para mamá.
// Coordenadas en % del área de fotos (viewBox 100x100 estirado).
const RAMO_STEMS_SVG = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
  <path pathLength="1" d="M26 50 C34 66 44 80 49 96"/>
  <path pathLength="1" d="M50 30 C50 54 50 76 50 96"/>
  <path pathLength="1" d="M74 50 C66 66 56 80 51 96"/>
  <path pathLength="1" d="M38 62 C32 58 28 58 24 60 M62 60 C68 56 72 56 76 58"/>
</svg>`;

const RAMO_WRAP_SVG = `<svg viewBox="0 0 100 100" preserveAspectRatio="none">
  <path class="kraft-a" d="M0 56 C8 52 20 50 34 51 L52 91 L45 91 Z"/>
  <path class="kraft-b" d="M100 56 C92 52 80 50 66 51 L48 91 L55 91 Z"/>
  <path class="kraft-c" d="M27 63 C38 58 62 58 73 63 L55 91 L45 91 Z"/>
  <path class="fold" d="M34 51 L50 89 M66 51 L50 89"/>
  <path class="twine" d="M44 86 C48 88 52 88 56 86 M50 87 C44 82 40 84 42 88 C44 90 48 89 50 87 C56 82 60 84 58 88 C56 90 52 89 50 87 M49 88 C47 92 45 95 43 97 M51 88 C53 92 56 94 60 95"/>
  <path class="stem-ends" d="M47 91 L46 99 M50 91 L50 100 M53 91 L54 99"/>
</svg>`;

function setupMadres(){
  const badge = document.querySelector('.season-badge');
  if (badge) { badge.classList.add('season-badge--card'); badge.querySelector('.season-dot')?.remove(); }

  const archWindow = document.querySelector('.intro-window');
  if (archWindow) setupMadresLanding(archWindow);

  const art = document.querySelector('.hero-art');
  if (!art) return;
  art.classList.add('is-ramo');
  const stems = document.createElement('div');
  stems.className = 'ramo-stems';
  stems.innerHTML = RAMO_STEMS_SVG;
  const wrap = document.createElement('div');
  wrap.className = 'ramo-wrap';
  wrap.innerHTML = RAMO_WRAP_SVG;
  const card = document.createElement('div');
  card.className = 'ramo-card';
  card.textContent = 'Para mamá, con amor';
  art.prepend(stems);
  art.append(wrap, card);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap().then(() => {
    // Orden de florecer: la del centro primero, luego los lados.
    const blooms = ['.s3', '.s1', '.s2'].map(c => art.querySelector('.seal-big' + c)).filter(Boolean);
    gsap.timeline({ delay: .3 })
      .from(wrap.querySelectorAll('.kraft-a, .kraft-b, .kraft-c, .fold'), { y: 40, opacity: 0, duration: .7, ease: 'power3.out', stagger: .1 })
      .from(wrap.querySelectorAll('.twine, .stem-ends'), { opacity: 0, duration: .4 }, '-=.2')
      .from(stems.querySelectorAll('path'), { strokeDasharray: 1, strokeDashoffset: 1, duration: .8, ease: 'power2.out', stagger: .1, clearProps: 'strokeDasharray,strokeDashoffset' }, '-=.4')
      .from(blooms, { scale: .2, yPercent: 60, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', stagger: .2, clearProps: 'opacity' }, '-=.5')
      .from(card, { rotation: -40, opacity: 0, y: -20, duration: .9, ease: 'elastic.out(1, .5)' }, '-=.4');

    // Parallax al hacer scroll: el ramo sube más lento, las flores crecen un poco y la tarjeta se mece.
    const hero = document.querySelector('.hero');
    const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(art, { y: 70, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.fromTo(blooms, { scale: 1 }, { scale: 1.1, ease: 'none', immediateRender: false, scrollTrigger: { ...scrub } });
    gsap.to(card, { rotation: 14, ease: 'none', scrollTrigger: { ...scrub } });
  }).catch(() => {});
}

function floresAmarillasBannerText(){
  const now = new Date();
  if (now.getMonth() === 8 && now.getDate() === 21) return 'Hoy es el <strong>Día de las Flores Amarillas</strong>. Regala una flor eterna que no se marchita.';
  return `Faltan <strong>${daysLabel(daysUntil(9, 21))} para el Día de las Flores Amarillas</strong>. Regala una flor eterna que no se marchita.`;
}

// Flor amarilla gigante: dos coronas de pétalos que se abren detrás de las fotos.
function buildBigFlower(){
  const ring = (count, len, width, offset, cls) => {
    let out = '';
    for (let i = 0; i < count; i++) {
      const angle = offset + i * 360 / count;
      out += `<path class="${cls}" d="M100 100 C${100 - width} ${100 - len * .35} ${100 - width * .7} ${100 - len} 100 ${100 - len} C${100 + width * .7} ${100 - len} ${100 + width} ${100 - len * .35} 100 100 Z" transform="rotate(${angle} 100 100)"/>`;
    }
    return out;
  };
  return `<svg viewBox="0 0 200 200">
    <g class="petals-outer">${ring(14, 98, 20, 0, 'petal-outer')}</g>
    <g class="petals-inner">${ring(14, 74, 16, 360 / 28, 'petal-inner')}</g>
    <circle class="flower-heart" cx="100" cy="100" r="34"/>
  </svg>`;
}

function setupFloresAmarillas(){
  const badge = document.querySelector('.season-badge');
  if (badge) { badge.classList.add('season-badge--marker'); badge.querySelector('.season-dot')?.remove(); }

  const archWindow = document.querySelector('.intro-window');
  if (archWindow) setupFloresLanding(archWindow);

  const art = document.querySelector('.hero-art');
  if (!art) return;
  art.classList.add('is-flor');
  const flower = document.createElement('div');
  flower.className = 'big-flower';
  flower.innerHTML = buildBigFlower();
  art.prepend(flower);

  // La foto del centro se queda fija en las rosas eternas amarillas (no entra en la rotación de fotos).
  const center = art.querySelector('.seal-big.s3');
  if (center) { center.src = 'imagenes/flores/rosas-eternas-amarillo-hero.jpg'; center.dataset.fixed = '1'; }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap().then(() => {
    const svg = flower.querySelector('svg');
    gsap.timeline({ delay: .3 })
      .from(flower.querySelectorAll('.petal-outer'), { scale: 0, svgOrigin: '100 100', duration: .9, ease: 'back.out(1.4)', stagger: .04 })
      .from(flower.querySelectorAll('.petal-inner'), { scale: 0, svgOrigin: '100 100', duration: .7, ease: 'back.out(1.6)', stagger: .04 }, '-=.8')
      .from(center, { scale: .4, opacity: 0, duration: .8, ease: 'back.out(1.8)', clearProps: 'opacity' }, '-=.5')
      .from(art.querySelectorAll('.seal-big.s1, .seal-big.s2'), { scale: .5, opacity: 0, duration: .7, ease: 'back.out(1.6)', stagger: .15, clearProps: 'opacity' }, '-=.4');

    // Parallax al hacer scroll: la flor gira despacio y crece, las fotos crecen un poco.
    const hero = document.querySelector('.hero');
    const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
    gsap.to(art, { y: 70, ease: 'none', scrollTrigger: { ...scrub } });
    gsap.to(svg, { rotation: 50, scale: 1.08, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { ...scrub } });
    gsap.fromTo(art.querySelectorAll('.seal-big'), { scale: 1 }, { scale: 1.1, ease: 'none', immediateRender: false, scrollTrigger: { ...scrub } });
  }).catch(() => {});
}

const SEASON_SETUP = {
  'flores-amarillas': setupFloresAmarillas,
  'navidad': setupChristmas,
  'valentin': setupValentin,
  'madres': setupMadres
};

const SEASON_BANNER_TEXT = {
  'flores-amarillas': floresAmarillasBannerText,
  'navidad': christmasBannerText,
  'valentin': valentinBannerText,
  'madres': madresBannerText
};

function spawnField(svgOrList, glow, variant){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const svgs = Array.isArray(svgOrList) ? svgOrList : [svgOrList];
  const field = document.createElement('div');
  field.className = 'petal-field';
  field.setAttribute('aria-hidden', 'true');
  field.style.setProperty('--field-glow', glow);
  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('div');
    petal.className = variant ? `petal ${variant}` : 'petal';
    const onLeftEdge = Math.random() < 0.5;
    const pos = onLeftEdge ? Math.random() * 14 : 86 + Math.random() * 14;
    const size = 14 + Math.random() * 16;
    const duration = 11 + Math.random() * 9;
    const delay = Math.random() * -duration;
    const drift = (20 + Math.random() * 40) * (Math.random() < 0.5 ? -1 : 1);
    petal.style.left = pos + '%';
    petal.style.setProperty('--sz', size + 'px');
    petal.style.setProperty('--dur', duration + 's');
    petal.style.setProperty('--delay', delay + 's');
    petal.style.setProperty('--drift', drift + 'px');
    petal.innerHTML = svgs[Math.floor(Math.random() * svgs.length)];
    field.appendChild(petal);
  }
  document.body.appendChild(field);
}

// === Portada: decoración de cada temporada alrededor del arco de la foto principal ===

// Al bajar, la decoración sube y se desvanece mientras el arco se abre a pantalla completa.
function fadeArchDecor(els){
  // fromTo + immediateRender:false para que siempre parta visible, aunque la animación de entrada aún no termine.
  gsap.fromTo(els, { autoAlpha: 1, y: 0 }, {
    autoAlpha: 0, y: -80, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: '.intro', start: 'top 84px', end: '+=320', scrub: true }
  });
}

// San Valentín: el arco envuelto como regalo, con listón cruzado, moño y sello de lacre.
function setupValentinLanding(win){
  const clip = win.querySelector('.intro-clip') || win;
  const ribbon = document.createElement('div');
  ribbon.className = 'arch-ribbon';
  ribbon.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <path class="band" d="M72 -2 L72 102"/><path class="band" d="M-2 30 L102 30"/>
    <path class="shine" d="M72 -2 L72 102"/><path class="shine" d="M-2 30 L102 30"/>
  </svg>`;
  clip.appendChild(ribbon);
  const bow = document.createElement('div');
  bow.className = 'arch-bow';
  bow.innerHTML = `<svg viewBox="0 0 120 80" aria-hidden="true">
    <path class="loop" d="M60 40 C40 8 8 10 14 34 C18 50 44 48 60 40 Z"/>
    <path class="loop" d="M60 40 C80 8 112 10 106 34 C102 50 76 48 60 40 Z"/>
    <path class="fold" d="M58 39 C44 26 30 22 22 28 M62 39 C76 26 90 22 98 28"/>
    <path class="loop" d="M56 44 C50 58 44 68 36 78 L46 76 L50 80 C56 66 60 56 62 46 Z"/>
    <path class="loop" d="M64 44 C70 58 76 68 84 78 L74 76 L70 80 C64 66 60 56 58 46 Z"/>
  </svg><div class="arch-seal">${WAX_SEAL_SVG}</div>`;
  win.appendChild(bow);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap().then(() => {
    const seal = bow.querySelector('.arch-seal');
    gsap.timeline({ delay: .3 })
      .from(ribbon, { clipPath: 'inset(0% 100% 100% 0%)', duration: 1.1, ease: 'power2.inOut', clearProps: 'clipPath' })
      .from(bow.querySelector('svg'), { scale: 0, transformOrigin: '50% 50%', duration: .6, ease: 'back.out(2)' }, '-=.3')
      .from(seal, { scale: 1.9, rotation: -25, opacity: 0, duration: .45, ease: 'power3.in' }, '-=.1')
      .to(seal, { scaleX: 1.08, scaleY: .92, duration: .08, yoyo: true, repeat: 1 });
    fadeArchDecor([bow]);
  }).catch(() => {});
}

// Día de las Madres: la parte de abajo del arco envuelta en papel kraft como un ramo, con tarjeta.
function setupMadresLanding(win){
  const wrap = document.createElement('div');
  wrap.className = 'ramo-wrap arch-wrap';
  wrap.innerHTML = RAMO_WRAP_SVG;
  const card = document.createElement('div');
  card.className = 'arch-card';
  card.textContent = 'Para mamá, con amor';
  win.append(wrap, card);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap().then(() => {
    gsap.timeline({ delay: .3 })
      .from(wrap.querySelectorAll('.kraft-a, .kraft-b, .kraft-c, .fold'), { y: 50, opacity: 0, duration: .8, ease: 'power3.out', stagger: .12 })
      .from(wrap.querySelectorAll('.twine, .stem-ends'), { opacity: 0, duration: .4 }, '-=.2')
      .from(card, { rotation: -40, opacity: 0, y: -20, duration: .9, ease: 'elastic.out(1, .5)' }, '-=.2');
    fadeArchDecor([wrap, card]);
  }).catch(() => {});
}

// Flores Amarillas: una flor amarilla gigante se abre detrás del arco, como un sol.
function setupFloresLanding(win){
  const flower = document.createElement('div');
  flower.className = 'big-flower arch-flower';
  flower.innerHTML = buildBigFlower();
  win.prepend(flower);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadGsap().then(() => {
    gsap.timeline({ delay: .3 })
      .from(flower.querySelectorAll('.petal-outer'), { scale: 0, svgOrigin: '100 100', duration: .9, ease: 'back.out(1.4)', stagger: .04 })
      .from(flower.querySelectorAll('.petal-inner'), { scale: 0, svgOrigin: '100 100', duration: .7, ease: 'back.out(1.6)', stagger: .04 }, '-=.8');
    gsap.to(flower.querySelector('svg'), { rotation: 60, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top 84px', end: 'bottom bottom', scrub: true } });
    gsap.to(flower, { autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.intro', start: 'top 84px', end: '+=420', scrub: true } });
  }).catch(() => {});
}

(function applySeason(){
  const season = getActiveSeason();
  if (!season) return;

  document.documentElement.dataset.season = season.id;
  document.documentElement.style.setProperty('--accent-glow', season.glow || season.accent);
  document.documentElement.style.setProperty('--season-accent', season.accent);
  document.documentElement.style.setProperty('--season-accent-soft', season.accentSoft);

  const fieldSvg = SEASON_FIELDS[season.id] ? SEASON_FIELDS[season.id].svg : null;
  const seasonIcon = SEASON_ICONS[season.id] || (Array.isArray(fieldSvg) ? fieldSvg[0] : fieldSvg) || DOT_SVG;

  const eyebrow = document.getElementById('heroEyebrow');
  if (eyebrow) eyebrow.insertAdjacentHTML('afterend', `<span class="season-badge"><span class="season-dot">${seasonIcon}</span>${season.badge}</span>`);

  if (SEASON_FIELDS[season.id]) spawnField(SEASON_FIELDS[season.id].svg, SEASON_FIELDS[season.id].glow, SEASON_FIELDS[season.id].variant);

  if (SEASON_SETUP[season.id]) SEASON_SETUP[season.id]();

  const dismissKey = `season-dismissed-${season.id}-${new Date().getFullYear()}`;
  let dismissed = false;
  try { dismissed = localStorage.getItem(dismissKey) === '1'; } catch(e) {}

  if (!dismissed) {
    const banner = document.getElementById('seasonBanner');
    if (banner) {
      const bannerText = SEASON_BANNER_TEXT[season.id] ? SEASON_BANNER_TEXT[season.id]() : season.banner;
      banner.innerHTML = `<div class="season-banner season-banner--${season.id}"><span class="season-dot">${seasonIcon}</span><span>${bannerText}</span><button aria-label="Cerrar aviso">✕</button></div>`;
      const bar = banner.querySelector('.season-banner');
      // La portada usa esta altura para que el arco quepa completo en pantalla con la barra puesta.
      const setBannerHeight = h => {
        document.documentElement.style.setProperty('--banner-h', h + 'px');
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      };
      setBannerHeight(bar.offsetHeight);
      banner.querySelector('button').addEventListener('click', () => {
        try { localStorage.setItem(dismissKey, '1'); } catch(e) {}
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          banner.innerHTML = '';
          setBannerHeight(0);
        } else {
          bar.classList.add('closing');
          bar.addEventListener('transitionend', () => { banner.innerHTML = ''; setBannerHeight(0); }, { once:true });
        }
      });
    }
  }
})();
