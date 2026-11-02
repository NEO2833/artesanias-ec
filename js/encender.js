// Transición "encender el catálogo".
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap) return;
  const ignite = document.querySelector(".ignite");
  const shop = document.getElementById("catalogo");
  const title = document.getElementById("shop-title");

  // El título se parte en letras para encenderlas una por una (el lector de
  // pantalla sigue leyendo el título entero).
  const label = title.textContent;
  title.setAttribute("aria-label", label);
  title.innerHTML = [...label].map((c) => `<span class="ch" aria-hidden="true">${c}</span>`).join("");
  const letters = title.querySelectorAll(".ch");

  let running = false;
  function lightUp() {
    const tl = gsap.timeline();
    tl.fromTo(letters,
      { opacity: 0, y: 18, filter: "blur(10px)", textShadow: "0 0 34px rgba(240,166,90,1)" },
      { opacity: 1, y: 0, filter: "blur(0px)", textShadow: "0 0 0px rgba(240,166,90,0)", duration: 0.9, ease: "power3.out", stagger: 0.045 })
      .fromTo(".filters, .shop-count", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, clearProps: "opacity,transform" }, 0.35);
    // Los productos que se ven se encienden uno tras otro, como velas.
    const visible = [...document.querySelectorAll(".grid .item:not([hidden]) figure")]
      .filter((fig) => fig.getBoundingClientRect().top < innerHeight);
    visible.forEach((fig, i) => {
      tl.fromTo(fig,
        { filter: "brightness(0.05) saturate(0.4)", boxShadow: "0 0 0px 0px rgba(240,166,90,0)" },
        { keyframes: [
            { filter: "brightness(1.35) saturate(1.1)", boxShadow: "0 0 46px 6px rgba(240,166,90,0.55)", duration: 0.35, ease: "power2.out" },
            { filter: "brightness(1) saturate(1)", boxShadow: "0 0 0px 0px rgba(240,166,90,0)", duration: 0.9, ease: "power2.inOut" },
          ], clearProps: "filter,boxShadow" },
        0.45 + i * 0.11);
    });
    return tl;
  }

  window.goToCatalog = (origin) => {
    if (running) return;
    running = true;
    const r = origin.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    ignite.style.setProperty("--x", x + "px");
    ignite.style.setProperty("--y", y + "px");
    // Lo que se ve antes de que llegue la luz: el catálogo a oscuras.
    gsap.set(letters, { opacity: 0 });
    gsap.timeline({ onComplete: () => { running = false; gsap.set(ignite, { clearProps: "all" }); } })
      .set(ignite, { visibility: "visible", opacity: 1 })
      .fromTo(ignite, { clipPath: `circle(0px at ${x}px ${y}px)` },
        { clipPath: `circle(${Math.hypot(innerWidth, innerHeight) * 1.05}px at ${x}px ${y}px)`, duration: 0.75, ease: "power3.in" })
      // Ya cubierta la pantalla: saltamos directo al catálogo (sin recorrer la galería).
      .add(() => {
        const top = shop.getBoundingClientRect().top + scrollY - 70;
        window.scrollTo({ top, behavior: "instant" });
        window.ScrollTrigger && ScrollTrigger.update();
      })
      .to(ignite, { opacity: 0, duration: 1.1, ease: "power2.out" }, "+=0.08")
      // Se arma al llegar (no antes): así sabe qué productos quedaron a la vista.
      .call(lightUp, null, "<0.15");
  };

  // ---------- Logo: soplar la vela y volver a encenderla arriba ----------
  const dusk = document.querySelector(".dusk");
  const brand = document.querySelector(".brand");
  const logo = brand.querySelector("img");
  let relighting = false;

  function smokeFrom(x, y) {
    for (let i = 0; i < 7; i++) {
      const puff = document.createElement("span");
      puff.className = "smoke";
      puff.setAttribute("aria-hidden", "true");
      document.body.append(puff);
      gsap.fromTo(puff,
        { left: x - 7, top: y - 7, opacity: 0, scale: 0.6 },
        { keyframes: [
            { opacity: 0.9, duration: 0.25 },
            { opacity: 0, duration: 1.1 },
          ],
          // El logo está pegado arriba: el humo sube poco y se lo lleva el aire hacia la derecha.
          x: gsap.utils.random(30, 110), y: gsap.utils.random(-30, 10), scale: gsap.utils.random(2.6, 4.2),
          duration: 1.35, delay: i * 0.08, ease: "power1.out", onComplete: () => puff.remove() });
    }
  }

  brand.addEventListener("click", (e) => {
    e.preventDefault();
    if (relighting || running) return;
    relighting = true;
    const r = logo.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 120;
    const iris = { r: far };
    const paint = () => dusk.style.setProperty("--r", iris.r + "px");
    dusk.style.setProperty("--x", x + "px");
    dusk.style.setProperty("--y", y + "px");
    paint();
    smokeFrom(x, y);

    const heroWords = document.querySelectorAll(".hero-title .word");
    gsap.timeline({ onComplete: () => { relighting = false; gsap.set(dusk, { clearProps: "visibility" }); } })
      .set(dusk, { visibility: "visible" })
      // Se apaga: la oscuridad se cierra hasta quedar solo el logo.
      .to(iris, { r: r.width * 0.9, duration: 0.95, ease: "power3.inOut", onUpdate: paint }, 0.1)
      .to(logo, { boxShadow: "0 0 0 3px rgba(240,166,90,0.9), 0 0 40px 12px rgba(240,166,90,0.75)", duration: 0.3, ease: "power2.out" }, 0.85)
      .to(logo, { rotation: 360, duration: 0.9, ease: "power3.inOut" }, 0.8)
      // A oscuras: subimos a la portada y la dejamos lista para encenderse.
      .add(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
        window.ScrollTrigger && ScrollTrigger.update();
        gsap.set(".hero-media", { filter: "brightness(0.15)", scale: 1.08 });
        gsap.set(heroWords, { opacity: 0, yPercent: 40, filter: "blur(10px)" });
        gsap.set(".hero-sub", { opacity: 0, y: 16 });
      }, 1.1)
      // Se vuelve a encender desde el logo.
      .to(iris, { r: far, duration: 1.4, ease: "power2.in", onUpdate: paint }, 1.35)
      .to(logo, { boxShadow: "0 0 0 0px rgba(240,166,90,0), 0 0 0px 0px rgba(240,166,90,0)", duration: 0.8, ease: "power2.out", clearProps: "boxShadow,transform" }, 1.5)
      .to(".hero-media", { filter: "brightness(1)", scale: 1, duration: 2, ease: "power3.out", clearProps: "filter,transform" }, 1.45)
      .to(heroWords, { opacity: 1, yPercent: 0, filter: "blur(0px)", duration: 1.1, ease: "power3.out", stagger: 0.07, clearProps: "opacity,transform,filter" }, 1.7)
      .to(".hero-sub", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", clearProps: "opacity,transform" }, 2.2);
  });

  document.querySelector(".nav-cta").addEventListener("click", (e) => {
    e.preventDefault();
    window.goToCatalog(e.currentTarget);
  });
})();
