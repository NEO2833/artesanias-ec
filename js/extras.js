// Lo que ya tenía el sitio: WhatsApp, Instagram, Lo más nuevo, fechas para
// regalar, favoritos y el visor de fotos.
(() => {
  // === EDITAR AQUÍ: número de WhatsApp (país + número, sin espacios) e Instagram ===
  const WHATSAPP_NUMBER = "18297200691";
  const INSTAGRAM_URL = "https://www.instagram.com/ec__artesanias";

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const openWhatsApp = (msg) => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");

  // WhatsApp genérico (botones con data-wa) e Instagram.
  document.addEventListener("click", (e) => {
    const wa = e.target.closest("[data-wa]");
    if (!wa) return;
    e.preventDefault();
    openWhatsApp(wa.dataset.msg || "Hola, vi la página de Artesanías EC y me gustaría más información.");
  });
  document.querySelectorAll("[data-instagram]").forEach((a) => { a.href = INSTAGRAM_URL; });
  document.getElementById("year").textContent = new Date().getFullYear();

  // ---------- Lo más nuevo: productos con isNew, primero los de fecha más reciente ----------
  (function newest() {
    if (typeof PRODUCTS !== "object") return;
    const lists = Object.keys(PRODUCTS).map((cat) => PRODUCTS[cat].map((p) => ({ cat, ...p })).filter((p) => p.isNew).reverse());
    const dated = lists.flat().filter((p) => p.added).sort((a, b) => b.added.localeCompare(a.added));
    const undated = [];
    for (let round = 0; lists.some((l) => l[round]); round++) lists.forEach((l) => { if (l[round] && !l[round].added) undated.push(l[round]); });
    const items = dated.concat(undated).slice(0, 4);
    if (!items.length) return;
    const grid = document.querySelector(".newest-grid");
    grid.innerHTML = items.map((p) => `
      <li><a href="#catalogo" data-line="${p.cat}">
        <figure><img src="${esc(p.img)}" alt="${esc(`${p.title}, ${p.tag}`)}" loading="lazy" /></figure>
        <h3>${esc(p.title)}</h3><span>${esc(p.tag)}</span>
      </a></li>`).join("");
    // Llevan al catálogo con su línea elegida (el script del catálogo escucha data-line).
    grid.querySelectorAll("[data-line]").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(`.filter[data-cat="${a.dataset.line}"]`)?.click();
      if (window.goToCatalog) window.goToCatalog(a);
      else document.getElementById("catalogo").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    }));
    document.getElementById("nuevo").hidden = false;
  })();

  // ---------- Fechas para regalar (las fechas salen de temporadas-cine.js) ----------
  (function dates() {
    const S = window.EC_SEASONS;
    if (!S) return;
    const IDEAS = {
      "navidad": { para: "Nochebuena", encargo: "Navidad", ideas: "Sets de jabones, velones y flores eternas para regalar en familia." },
      "valentin": { para: "San Valentín", encargo: "San Valentín", ideas: "Velones aromáticos y flores eternas que no se marchitan." },
      "madres": { para: "el Día de las Madres", encargo: "el Día de las Madres", ideas: "Flores eternas y sets de jabones para mamá." },
      "flores-amarillas": { para: "las Flores Amarillas", encargo: "el Día de las Flores Amarillas", ideas: "Una flor eterna amarilla que no se marchita." },
    };
    const fmt = new Intl.DateTimeFormat("es-DO", { weekday: "long", day: "numeric", month: "long" });
    const events = S.list.map((s) => ({ ...s, ...IDEAS[s.id], ...S.nextEvent(s.id) })).sort((a, b) => a.days - b.days);
    document.querySelector(".dates-grid").innerHTML = events.map((ev, i) => `
      <article class="date-card${i === 0 ? " first" : ""}" style="--c:${ev.flame}">
        ${ev.days === 0
          ? '<span class="num">Hoy</span>'
          : `<span class="num">${ev.days}</span><span class="lbl">${ev.days === 1 ? "día" : "días"} para ${ev.para}</span>`}
        <h3>${ev.name}</h3>
        <span class="when">${fmt.format(ev.date)}</span>
        ${i === 0 ? `<p class="ideas">${ev.ideas}</p>` : ""}
        <a class="order" data-wa data-msg="Hola, quiero encargar un regalo para ${ev.encargo}." href="#">Encargar</a>
      </article>`).join("");
    document.getElementById("fechas").hidden = false;
  })();

  // ---------- Favoritos (se guardan en este teléfono, como antes) ----------
  const FAV_KEY = "ec-favoritos";
  let favorites = {};
  try { favorites = JSON.parse(localStorage.getItem(FAV_KEY) || "{}"); } catch (e) { favorites = {}; }
  const save = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favorites)); } catch (e) {} };
  const fab = document.getElementById("favFab");
  const panel = document.getElementById("favPanel");

  function syncFavorites() {
    const n = Object.keys(favorites).length;
    fab.hidden = n === 0;
    fab.querySelector(".fav-count").textContent = n;
    document.querySelectorAll(".fav-btn").forEach((b) => b.setAttribute("aria-pressed", String(!!favorites[b.dataset.favKey])));
  }
  function renderPanel() {
    const entries = Object.entries(favorites);
    panel.querySelector(".fav-list").innerHTML = entries.map(([key, label]) =>
      `<li><span>${esc(label)}</span><button type="button" data-remove="${esc(key)}" aria-label="Quitar ${esc(label)}">✕</button></li>`).join("");
    panel.querySelector(".fav-empty").hidden = entries.length > 0;
    document.getElementById("favSend").hidden = entries.length === 0;
  }
  let lastFocus = null;
  function openPanel() {
    lastFocus = document.activeElement;
    renderPanel();
    panel.hidden = false;
    panel.querySelector(".fav-close").focus();
    if (!reduce && window.gsap) gsap.fromTo(panel.querySelector(".fav-sheet"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" });
  }
  function closePanel() { panel.hidden = true; lastFocus?.focus(); }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".fav-btn");
    if (!btn) return;
    e.stopPropagation();
    const key = btn.dataset.favKey;
    if (favorites[key]) delete favorites[key];
    else {
      favorites[key] = btn.dataset.favLabel;
      // Un latido al guardar.
      if (!reduce && window.gsap) gsap.fromTo(btn, { scale: 1 }, { keyframes: [{ scale: 1.3, duration: 0.14 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }] });
    }
    save();
    syncFavorites();
  });
  fab.addEventListener("click", openPanel);
  panel.addEventListener("click", (e) => {
    if (e.target === panel || e.target.closest(".fav-close")) return closePanel();
    const remove = e.target.closest("[data-remove]");
    if (remove) { delete favorites[remove.dataset.remove]; save(); syncFavorites(); renderPanel(); }
  });
  document.getElementById("favSend").addEventListener("click", (e) => {
    e.preventDefault();
    const list = Object.values(favorites).map((l) => `- ${l}`).join("\n");
    openWhatsApp(`Hola, me interesan estos productos:\n${list}\n¿Me dan más información?`);
  });
  syncFavorites();

  // ---------- Visor: tocar la foto de un producto la abre en grande ----------
  const lightbox = document.getElementById("lightbox");
  const lbImg = lightbox.querySelector("img");
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".item figure img");
    if (!img) return;
    lastFocus = document.activeElement;
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lightbox.hidden = false;
    lightbox.querySelector(".lightbox-close").focus();
    if (!reduce && window.gsap) gsap.fromTo(lbImg, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" });
  });
  const closeLightbox = () => { lightbox.hidden = true; lastFocus?.focus(); };
  lightbox.addEventListener("click", (e) => { if (e.target !== lbImg) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!lightbox.hidden) closeLightbox();
    if (!panel.hidden) closePanel();
  });
})();
