// Temporadas "Luz de vela": la habitación cambia con la ocasión. Lo usa la portada (index.html).
// Se activan solas según la fecha (mismas fechas que el catálogo real).
// Para verlas sin esperar: agrega ?season=valentin (o madres, flores-amarillas, navidad) al link.
//
// Este archivo va justo después de la portada en el HTML: cambia la foto, los
// textos y los colores ANTES de que se armen las animaciones de entrada; la
// decoración animada (partículas y pieza central) arranca cuando carga la página.
(() => {
  // === EDITAR AQUÍ: fechas [mes, día], textos y colores de cada temporada ===
  const SEASONS = [
    {
      id: "valentin", start: [2, 1], end: [2, 14], eventDate: (y) => new Date(y, 1, 14),
      name: "San Valentín",
      title: "Hecho a mano, <em>con amor</em> para regalar.",
      sub: "Rosas eternas, velones y jabones para decir te quiero sin prisa.",
      image: "imagenes/flores/centro-mesa-rosas-clavel-dhalia.jpg", position: "center 55%",
      flame: "#f08aa0", ember: "#b8344f", glow: "240 120 150",
    },
    {
      id: "madres", start: [5, 18], end: [5, 31], eventDate: (y) => lastSundayOfMay(y),
      name: "Día de las Madres",
      title: "Para mamá, <em>hecho a mano</em>.",
      sub: "Flores eternas y sets de jabones envueltos para ella, uno por uno.",
      image: "imagenes/jabones/set-jabones-cesta-dia-madres.jpg", position: "center 40%",
      flame: "#e6a3b6", ember: "#9b5774", glow: "230 160 185",
    },
    {
      id: "flores-amarillas", start: [9, 18], end: [9, 21], eventDate: (y) => new Date(y, 8, 21),
      name: "Día de las Flores Amarillas",
      title: "Una flor amarilla <em>que no se marchita</em>.",
      sub: "Este 21 de septiembre, regala rosas eternas que duran para siempre.",
      image: "img/rosas-eternas-amarillo-hero.jpg", position: "center 50%",
      flame: "#f6c945", ember: "#c99a0e", glow: "246 201 69",
    },
    {
      id: "navidad", start: [12, 1], end: [1, 6], eventDate: (y) => new Date(y, 11, 24),
      name: "Navidad",
      title: "Regalos hechos a mano, <em>encendidos</em> para Navidad.",
      sub: "Velones, centros de mesa y jabones listos para poner bajo el árbol.",
      image: "imagenes/velones/centro-mesa-navideno.jpg", position: "center 60%",
      flame: "#e9b45c", ember: "#9e2b2b", glow: "240 170 90",
    },
  ];

  // En República Dominicana el Día de las Madres es el último domingo de mayo.
  function lastSundayOfMay(year) {
    const d = new Date(year, 4, 31);
    d.setDate(31 - d.getDay());
    return d;
  }

  function inRange(m, d, start, end) {
    const v = m * 100 + d, s = start[0] * 100 + start[1], e = end[0] * 100 + end[1];
    return s <= e ? v >= s && v <= e : v >= s || v <= e;
  }

  // El calendario "Fechas para regalar" usa estas mismas fechas.
  window.EC_SEASONS = {
    list: SEASONS,
    nextEvent(id) {
      const s = SEASONS.find((x) => x.id === id);
      const n = new Date();
      const today = new Date(n.getFullYear(), n.getMonth(), n.getDate());
      let date = s.eventDate(n.getFullYear());
      if (date < today) date = s.eventDate(n.getFullYear() + 1);
      return { date, days: Math.round((date - today) / 86400000) };
    },
  };

  const preview = new URLSearchParams(location.search).get("season");
  const now = new Date();
  const season = preview
    ? SEASONS.find((s) => s.id === preview)
    : SEASONS.find((s) => inRange(now.getMonth() + 1, now.getDate(), s.start, s.end));
  if (!season) return;

  // Cuenta regresiva hasta el día (si ya pasó este año, cuenta para el que viene).
  function countdown() {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let target = season.eventDate(now.getFullYear());
    if (target < today) target = season.eventDate(now.getFullYear() + 1);
    const days = Math.round((target - today) / 86400000);
    if (season.id === "navidad" && now.getMonth() === 0) return "Todavía hay tiempo para los Reyes";
    if (days === 0) return "Es hoy";
    return `Faltan ${days} ${days === 1 ? "día" : "días"}`;
  }

  // ---------- Portada: colores, foto y textos de la ocasión ----------
  const root = document.documentElement;
  root.dataset.season = season.id;
  root.style.setProperty("--flame", season.flame);
  root.style.setProperty("--ember", season.ember);
  root.style.setProperty("--glow-rgb", season.glow);

  const hero = document.querySelector(".hero");
  const img = hero.querySelector(".hero-media img");
  img.src = season.image;
  img.alt = `${season.name}: productos hechos a mano`;
  img.style.objectPosition = season.position;
  hero.querySelector(".hero-title").innerHTML = season.title;
  hero.querySelector(".hero-sub").textContent = season.sub;

  const tag = document.createElement("p");
  tag.className = "season-tag";
  tag.innerHTML = `<span>${season.name}</span><i aria-hidden="true"></i><span>${countdown()}</span>`;
  hero.querySelector(".hero-copy").prepend(tag);

  const deco = document.createElement("div");
  deco.className = "season-deco";
  deco.setAttribute("aria-hidden", "true");
  hero.querySelector(".hero-media").after(deco);

  const canvas = document.createElement("canvas");
  canvas.className = "season-particles";
  canvas.setAttribute("aria-hidden", "true");
  deco.before(canvas);


  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Piezas centrales (SVG) ----------
  const SVG = {
    // Listón de satín que cruza la portada, con moño y sello de lacre.
    valentin: `
      <svg class="sv-ribbon" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <defs><linearGradient id="satin" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#f6a5b8"/><stop offset=".5" stop-color="#d1456a"/><stop offset="1" stop-color="#8f1d3b"/></linearGradient></defs>
        <path class="sv-draw" d="M-20 470 C 180 420, 300 560, 470 500 S 760 360, 1020 410" stroke="url(#satin)" stroke-width="14" fill="none" stroke-linecap="round"/>
      </svg>
      <div class="sv-bow">
        <svg viewBox="0 0 120 80"><path d="M60 40 C 30 5, 4 14, 10 34 C 14 52, 40 50, 60 40 Z" fill="#c93a5f"/><path d="M60 40 C 90 5, 116 14, 110 34 C 106 52, 80 50, 60 40 Z" fill="#c93a5f"/>
          <path d="M60 40 L 44 76 M60 40 L 78 74" stroke="#a52648" stroke-width="7" stroke-linecap="round"/><circle cx="60" cy="40" r="9" fill="#e45a7d"/></svg>
      </div>
      <div class="sv-seal"><span>EC</span></div>`,
    // Rama de charamico dorada con bolitas colgando.
    navidad: `
      <svg class="sv-branch" viewBox="0 0 1000 300" preserveAspectRatio="xMidYMin slice">
        <path class="sv-draw" d="M-10 40 C 160 90, 330 60, 500 80 S 820 40, 1010 70" stroke="#d6a84e" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path class="sv-draw" d="M180 74 C 200 40, 230 30, 260 34 M420 76 C 440 110, 470 120, 505 112 M640 66 C 660 30, 700 22, 730 30 M820 52 C 840 86, 870 96, 905 90" stroke="#c9963c" stroke-width="3" fill="none" stroke-linecap="round"/>
      </svg>
      ${[[12, 70, "#b3222f"], [27, 120, "#d6a84e"], [43, 90, "#8e1b26"], [58, 135, "#d6a84e"], [74, 80, "#b3222f"], [88, 110, "#d6a84e"]]
        .map(([x, len, c]) => `<div class="sv-bauble" style="left:${x}%;--len:${len}px;--c:${c}"><i></i><b></b></div>`).join("")}`,
    // Tarjetita de papel kraft amarrada con hilo.
    madres: `
      <div class="sv-card"><i></i><div><span>Para ti,</span><b>mamá</b></div></div>`,
    // Flor amarilla gigante que florece detrás del título.
    "flores-amarillas": `
      <svg class="sv-flower" viewBox="-125 -125 250 250">
        ${Array.from({ length: 14 }, (_, i) => `<ellipse class="sv-petal" rx="16" ry="62" cy="-48" transform="rotate(${(360 / 14) * i})" fill="url(#pet)"/>`).join("")}
        ${Array.from({ length: 14 }, (_, i) => `<ellipse class="sv-petal sv-inner" rx="11" ry="40" cy="-30" transform="rotate(${(360 / 14) * i + 12.8})" fill="url(#pet2)"/>`).join("")}
        <defs>
          <radialGradient id="pet" cy="1" r="1"><stop offset="0" stop-color="#ffe58a"/><stop offset=".7" stop-color="#f2c12e"/><stop offset="1" stop-color="#c99a0e"/></radialGradient>
          <radialGradient id="pet2" cy="1" r="1"><stop offset="0" stop-color="#fff2b8"/><stop offset="1" stop-color="#f6c945"/></radialGradient>
          <radialGradient id="core"><stop offset="0" stop-color="#fff6d0"/><stop offset=".6" stop-color="#ffd85a"/><stop offset="1" stop-color="#e0a516"/></radialGradient>
        </defs>
        <circle class="sv-core" r="20" fill="url(#core)"/>
      </svg>`,
  };
  deco.innerHTML = SVG[season.id] || "";

  // ---------- Partículas en canvas ----------
  function startParticles() {
    if (reduce) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let W = 0, H = 0, raf = 0, visible = true;
    const small = matchMedia("(max-width: 52rem)").matches;
    const count = { valentin: 34, madres: 30, "flores-amarillas": 34, navidad: 46 }[season.id] * (small ? 0.6 : 1);

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener("resize", resize);

    const rand = (a, b) => a + Math.random() * (b - a);
    const rising = season.id === "valentin";
    function make(initial) {
      const p = {
        x: rand(0, W), y: initial ? rand(0, H) : rising ? H + 20 : -20,
        size: rand(5, 13), speed: rand(0.25, 0.7), sway: rand(0.4, 1.2), phase: rand(0, Math.PI * 2),
        rot: rand(0, Math.PI * 2), vr: rand(-0.02, 0.02), alpha: rand(0.35, 0.9), blur: Math.random() < 0.3,
      };
      if (season.id === "flores-amarillas" && Math.random() < 0.4) p.pollen = true;
      if (season.id === "navidad") {
        // Lucecitas: un hilo que cuelga en curva por arriba; el resto son destellos que caen.
        p.light = Math.random() < 0.5;
        if (p.light) {
          const t = Math.random();
          p.x = t * W;
          p.y = H * 0.1 + Math.sin(t * Math.PI) * H * 0.12 + rand(-6, 6);
          p.size = rand(2.5, 5);
        } else p.size = rand(1.2, 2.6);
      }
      return p;
    }
    const ps = Array.from({ length: Math.round(count) }, () => make(true));

    function heart(s) {
      ctx.beginPath();
      ctx.moveTo(0, s * 0.35);
      ctx.bezierCurveTo(-s, -s * 0.35, -s * 0.45, -s, 0, -s * 0.45);
      ctx.bezierCurveTo(s * 0.45, -s, s, -s * 0.35, 0, s * 0.35);
      ctx.fill();
    }
    function petal(s, c1, c2) {
      const g = ctx.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.55, s, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    let t = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      t += 1;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        ctx.save();
        if (season.id === "navidad" && p.light) {
          // Titilan en su lugar.
          const a = p.alpha * (0.55 + 0.45 * Math.sin(t * 0.05 * p.speed * 3 + p.phase));
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          g.addColorStop(0, `rgba(255,236,190,${a})`);
          g.addColorStop(0.3, `rgba(240,180,90,${a * 0.6})`);
          g.addColorStop(1, "rgba(240,170,90,0)");
          ctx.fillStyle = g;
          ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);
          ctx.restore();
          continue;
        }
        p.y += rising ? -p.speed : p.pollen ? -p.speed * 0.5 : p.speed;
        p.x += Math.sin(t * 0.012 * p.sway + p.phase) * 0.35;
        p.rot += p.vr;
        if (rising ? p.y < -30 : p.pollen ? p.y < -20 : p.y > H + 30) Object.assign(p, make(false), p.pollen ? { y: H + 10 } : {});
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        if (p.blur) ctx.filter = "blur(2px)";
        if (season.id === "valentin") {
          ctx.shadowColor = "rgba(240,110,140,0.9)"; ctx.shadowBlur = 14;
          ctx.fillStyle = "#f58aa5";
          heart(p.size);
        } else if (season.id === "madres") {
          petal(p.size, "#f7c6d2", "#c97891");
        } else if (season.id === "flores-amarillas") {
          if (p.pollen) {
            ctx.shadowColor = "rgba(255,210,90,1)"; ctx.shadowBlur = 10;
            ctx.fillStyle = "#ffe08a";
            ctx.beginPath(); ctx.arc(0, 0, p.size * 0.22, 0, Math.PI * 2); ctx.fill();
          } else petal(p.size, "#ffe680", "#d9a414");
        } else {
          // Navidad: destellos dorados que caen.
          ctx.shadowColor = "rgba(255,210,130,1)"; ctx.shadowBlur = 8;
          ctx.fillStyle = "#ffe2a8";
          ctx.beginPath(); ctx.arc(0, 0, p.size, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }
    frame();
    // Solo se dibuja mientras la portada se ve.
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(hero);
  }

  // ---------- Animación de la pieza central ----------
  function animateDeco() {
    const gsap = window.gsap;
    if (!gsap) return;
    const q = (sel) => deco.querySelectorAll(sel);
    const draw = (el, opts) => {
      const len = el.getTotalLength();
      return gsap.fromTo(el, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ...opts });
    };
    const tl = gsap.timeline({ delay: 1.1 });

    if (season.id === "valentin") {
      q(".sv-draw").forEach((p) => tl.add(draw(p, { duration: 1.8, ease: "power2.inOut" }), 0));
      tl.fromTo(q(".sv-bow"), { scale: 0, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(2)" }, 1.4)
        .fromTo(q(".sv-seal"), { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power4.in" }, 1.9)
        .to(q(".sv-seal"), { keyframes: [{ scale: 1.08, duration: 0.08 }, { scale: 1, duration: 0.2 }] });
      gsap.to(q(".sv-bow"), { rotation: 4, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.2 });
    }

    if (season.id === "navidad") {
      q(".sv-draw").forEach((p, i) => tl.add(draw(p, { duration: i ? 1 : 1.8, ease: "power2.inOut" }), i ? 0.9 : 0));
      tl.fromTo(q(".sv-bauble"), { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "bounce.out", stagger: 0.12 }, 1);
      q(".sv-bauble").forEach((b, i) => {
        gsap.fromTo(b, { rotation: -5 }, { rotation: 5, duration: 2 + i * 0.25, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 + i * 0.1 });
      });
    }

    if (season.id === "madres") {
      tl.fromTo(q(".sv-card"), { y: -220, rotation: -18, opacity: 0 }, { y: 0, rotation: 6, opacity: 1, duration: 1.4, ease: "elastic.out(1, 0.5)" });
      gsap.to(q(".sv-card"), { rotation: -4, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.6 });
    }

    if (season.id === "flores-amarillas") {
      // Tenue (0.26): es un sol detrás del título, el texto tiene que leerse.
      tl.fromTo(q(".sv-flower"), { rotation: -40, scale: 0.4, opacity: 0 }, { rotation: 0, scale: 1, opacity: 0.26, duration: 2.2, ease: "power3.out" })
        .fromTo(q(".sv-petal:not(.sv-inner)"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.4, ease: "back.out(1.6)", stagger: { each: 0.05, from: "random" } }, 0.1)
        .fromTo(q(".sv-inner"), { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.1, ease: "back.out(1.8)", stagger: { each: 0.04, from: "random" } }, 0.6)
        .fromTo(q(".sv-core"), { scale: 0 }, { scale: 1, duration: 0.8, ease: "back.out(2)", transformOrigin: "50% 50%" }, 1);
      gsap.to(q(".sv-flower"), { rotation: 360, duration: 140, ease: "none", repeat: -1, delay: 2.4 });
    }

    // Al bajar, la decoración sube más lento y se desvanece con la portada.
    if (window.ScrollTrigger) {
      gsap.to(deco, { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "80% top", scrub: true } });
    }
  }

  addEventListener("DOMContentLoaded", () => {
    // El catálogo también lo dice (está más abajo: existe cuando carga la página).
    const shopHead = document.querySelector(".shop-head");
    if (shopHead) {
      const chip = document.createElement("span");
      chip.className = "season-chip";
      chip.textContent = `Especial ${season.name}`;
      shopHead.querySelector("h2").after(chip);
    }
    startParticles();
    if (!reduce) animateDeco();
  });
})();
