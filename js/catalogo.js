// Catálogo: se arma con PRODUCTS (productos.js, el mismo archivo del catálogo
// real). Funciona sin animaciones; con GSAP + Flip los productos se reacomodan
// al filtrar y la pastilla de luz se desliza entre las líneas.
(() => {
  const WHATSAPP = "18297200691";
  const ORDER = ["velones", "flores", "jabones", "sachets", "subeniles"];
  const LABELS = { todos: "Todo", velones: "Velones", flores: "Flores Eternas", jabones: "Jabones", sachets: "Sachets", subeniles: "Souvenirs" };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canAnimate = !reduce && !!window.gsap && !!window.Flip;
  if (canAnimate) gsap.registerPlugin(Flip);

  const grid = document.querySelector(".grid");
  const filters = document.querySelector(".filters");
  const pill = filters.querySelector(".filter-pill");
  const count = document.querySelector(".shop-count");
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const chatIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';

  const items = [];
  // En cada línea, lo nuevo sale primero: los que tienen fecha (el más reciente
  // arriba), después los demás marcados como nuevos (el último agregado arriba)
  // y luego el resto en su orden de siempre.
  const nuevoPrimero = (lista) => {
    const conFecha = lista.filter((p) => p.isNew && p.added).sort((a, b) => b.added.localeCompare(a.added));
    const nuevos = lista.filter((p) => p.isNew && !p.added).reverse();
    return conFecha.concat(nuevos, lista.filter((p) => !p.isNew));
  };
  ORDER.forEach((cat) => {
    nuevoPrimero(PRODUCTS[cat] || []).forEach((p) => {
      const li = document.createElement("li");
      li.className = "item";
      li.dataset.cat = cat;
      const msg = `Hola, me interesa: ${p.title} (${p.tag}).`;
      li.innerHTML =
        `<figure>${p.isNew ? '<span class="badge">Nuevo</span>' : ""}` +
        `<button class="fav-btn" type="button" data-fav-key="${esc(p.img)}" data-fav-label="${esc(`${p.title} (${p.tag})`)}" aria-pressed="false" aria-label="Guardar ${esc(p.title)} en favoritos"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 21s-7-4.35-9.5-8.5C.5 8 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4 4.5 8.5C19 16.65 12 21 12 21z\"/></svg></button>` +
        `<img src="${esc(p.img)}" alt="${esc(`${p.title}, ${p.tag}`)}" loading="lazy" /></figure>` +
        `<h3>${esc(p.title)}</h3><p class="tag">${esc(p.tag)}</p>` +
        (p.desc ? `<p class="desc">${esc(p.desc)}</p>` : "") +
        `<a class="order" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${chatIcon}Pedir por WhatsApp</a>`;
      grid.append(li);
      items.push(li);
    });
  });

  ["todos", ...ORDER].forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "filter";
    b.dataset.cat = cat;
    b.textContent = LABELS[cat];
    b.setAttribute("aria-pressed", String(cat === "todos"));
    b.addEventListener("click", () => setFilter(cat));
    filters.append(b);
  });

  function movePill(btn, instant) {
    const r = btn.getBoundingClientRect();
    const box = filters.getBoundingClientRect();
    const props = { x: r.left - box.left, y: r.top - box.top, width: r.width, height: r.height };
    if (window.gsap) {
      if (canAnimate && !instant) gsap.to(pill, { ...props, duration: 0.45, ease: "power3.out" });
      else gsap.set(pill, props);
    } else {
      Object.assign(pill.style, { transform: `translate(${props.x}px, ${props.y}px)`, width: `${props.width}px`, height: `${props.height}px` });
    }
  }

  let current = "todos";
  let entradas = null; // la entrada por tandas al bajar (se apaga al elegir una línea)
  // Al elegir una línea: la lista se desvanece un instante, cambia y vuelve a
  // aparecer. Antes los productos viajaban uno por uno a su lugar nuevo; en
  // teléfonos y computadoras normales esa animación se quedaba a medias y los
  // productos se veían oscuros, transparentes o faltaban.
  function setFilter(cat, { instant = false } = {}) {
    current = cat;
    filters.querySelectorAll(".filter").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cat === cat)));
    movePill(filters.querySelector(`[data-cat="${cat}"]`), instant);

    const aplicar = () => {
      items.forEach((li) => { li.hidden = !(cat === "todos" || li.dataset.cat === cat); });
      const n = items.filter((li) => !li.hidden).length;
      count.textContent = `${n} ${n === 1 ? "producto" : "productos"}`;
      window.ScrollTrigger && ScrollTrigger.refresh();
    };
    if (!canAnimate || instant) { aplicar(); return; }

    // Después de elegir una línea, los productos se muestran de una vez (sin la
    // entrada por tandas, que encima de esto los dejaba a medio aparecer).
    if (entradas) { entradas.forEach((t) => t.kill()); entradas = null; }
    gsap.killTweensOf(items);
    gsap.set(items, { clearProps: "opacity,transform" });
    // Si las fotos se estaban "encendiendo" (botón Ver catálogo), quedan encendidas ya.
    const fotos = grid.querySelectorAll(".item figure");
    gsap.killTweensOf(fotos);
    gsap.set(fotos, { clearProps: "filter,boxShadow" });

    gsap.killTweensOf(grid);
    gsap.to(grid, {
      opacity: 0, duration: 0.14, ease: "power1.out",
      onComplete: () => {
        aplicar();
        gsap.fromTo(grid, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.32, ease: "power3.out", clearProps: "opacity,transform" });
      },
    });
  }

  // Las tarjetas de "Lo que hacemos" llevan al catálogo con su línea ya elegida.
  document.querySelectorAll(".card[data-go]").forEach((card) => {
    const name = card.querySelector("h3").textContent;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Ver ${name} en el catálogo`);
    const go = () => {
      setFilter(card.dataset.go);
      if (window.goToCatalog) window.goToCatalog(card);
      else document.getElementById("catalogo").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    };
    card.addEventListener("click", go);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  });

  // Links a una línea (pie de página, "Lo más nuevo", catalogo.html#velones o ?linea=velones).
  document.querySelectorAll("[data-line]").forEach((a) => a.addEventListener("click", (e) => {
    e.preventDefault();
    setFilter(a.dataset.line);
    if (window.goToCatalog) window.goToCatalog(a);
    else document.getElementById("catalogo").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }));
  const askedLine = new URLSearchParams(location.search).get("linea") || location.hash.slice(1);
  const startLine = ORDER.includes(askedLine) ? askedLine : "todos";

  setFilter(startLine, { instant: true });
  if (startLine !== "todos" || location.hash === "#catalogo") {
    requestAnimationFrame(() => document.getElementById("catalogo").scrollIntoView({ behavior: "instant" }));
  }
  // La pastilla depende del ancho de la letra: se recoloca cuando cargan las fuentes y al cambiar el tamaño.
  document.fonts?.ready.then(() => movePill(filters.querySelector(`[data-cat="${current}"]`), true));
  addEventListener("resize", () => movePill(filters.querySelector(`[data-cat="${current}"]`), true));

  // Entrada de los productos al bajar, por tandas. Los que todavía no se ven
  // empiezan ocultos (así no "parpadean": visibles, luego ocultos, luego aparecen).
  if (canAnimate && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const abajo = items.filter((li) => !li.hidden && li.getBoundingClientRect().top > innerHeight);
    gsap.set(abajo, { opacity: 0, y: 18 });
    entradas = ScrollTrigger.batch(abajo, {
      start: "top 94%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.05, clearProps: "opacity,transform" }),
    });
  }
})();
