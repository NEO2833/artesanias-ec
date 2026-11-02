(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Grano de película: ruido nuevo cada 3 cuadros, en un canvas pequeño estirado.
  const canvas = document.querySelector(".grain");
  if (!reduce) {
    const ctx = canvas.getContext("2d");
    canvas.width = 220; canvas.height = 220;
    const img = ctx.createImageData(220, 220);
    let frame = 0;
    (function noise() {
      if (frame++ % 3 === 0) {
        for (let i = 0; i < img.data.length; i += 4) {
          const v = Math.random() * 255;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
          img.data[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
      }
      requestAnimationFrame(noise);
    })();
  }

  // Parte un texto en palabras envueltas en <span>, conservando <em>.
  function splitWords(el, cls) {
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(part);
            else { const s = document.createElement("span"); s.className = cls; s.textContent = part; frag.append(s); }
          });
          child.replaceWith(frag);
        } else walk(child);
      });
    };
    walk(el);
    return el.querySelectorAll("." + cls);
  }

  const heroWords = splitWords(document.querySelector("[data-split]"), "word");
  const manifestoWords = splitWords(document.querySelector("[data-words]"), "w");
  // Las palabras clave del manifiesto se encienden en color.
  manifestoWords.forEach((w) => { if (/^(paciencia|pensado|regales)/i.test(w.textContent)) w.classList.add("hot"); });

  if (reduce || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);

  // Entrada: la foto se acerca despacio y las palabras aparecen desde el desenfoque.
  gsap.from(".hero-media img", { scale: 1.22, filter: "brightness(0.2) saturate(0.95)", duration: 2.4, ease: "power3.out" });
  gsap.from(heroWords, { yPercent: 40, opacity: 0, filter: "blur(10px)", duration: 1.1, ease: "power3.out", stagger: 0.07, delay: 0.25 });
  gsap.from(".hero-sub, .scroll-cue", { y: 16, opacity: 0, duration: 1, ease: "power3.out", delay: 0.9, stagger: 0.12 });

  // Luz que sigue al ratón, con retraso suave, y parpadeo de llama.
  const glow = document.querySelector(".glow");
  const toX = gsap.quickTo(glow, "x", { duration: 0.9, ease: "power3.out" });
  const toY = gsap.quickTo(glow, "y", { duration: 0.9, ease: "power3.out" });
  gsap.set(glow, { x: innerWidth / 2, y: innerHeight * 0.62 });
  addEventListener("pointermove", (e) => { toX(e.clientX); toY(e.clientY); });
  gsap.to(glow, { opacity: "random(0.62, 1)", scale: "random(0.96, 1.04)", duration: "random(0.08, 0.28)",
    ease: "sine.inOut", repeat: -1, repeatRefresh: true });

  // Al bajar, la portada se oscurece y el texto sube (parallax).
  // Punto de partida fijo (el de la hoja de estilos): si no, toma el de la entrada
  // (casi negro) y al volver arriba la foto queda oscura.
  gsap.fromTo(".hero-media img", { yPercent: 0, scale: 1.08, filter: "brightness(0.62) saturate(0.95)" }, { yPercent: 12, scale: 1.16, filter: "brightness(0.25) saturate(0.95)", ease: "none", immediateRender: false,
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  gsap.to(".hero-copy, .scroll-cue", { yPercent: -35, opacity: 0, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "70% top", scrub: true } });

  // Manifiesto: cada palabra se enciende al pasar.
  gsap.to(manifestoWords, { opacity: 1, stagger: 0.08, ease: "none",
    scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 45%", scrub: true } });

  // Cada foto se revela desde abajo (clip-path) y su imagen se mueve más lento
  // que el marco (parallax). En la galería horizontal se mide contra el
  // desplazamiento lateral (containerAnimation), no contra el scroll vertical.
  function revealFigure(fig, container) {
    const lateral = container
      ? { containerAnimation: container, start: "left 88%" }
      : { start: "top 85%" };
    gsap.from(fig, { clipPath: "inset(100% 0 0 0)", duration: 1.2, ease: "power4.out",
      scrollTrigger: { trigger: fig, toggleActions: "play none none reverse", ...lateral } });
    // La imagen mide 115-120% del marco: de -13% a 0% siempre lo cubre entero.
    gsap.fromTo(fig.querySelector("img"), { yPercent: -13 }, { yPercent: 0, ease: "none",
      scrollTrigger: container
        ? { trigger: fig, containerAnimation: container, start: "left right", end: "right left", scrub: true }
        : { trigger: fig, start: "top bottom", end: "bottom top", scrub: true } });
  }

  // Galería: en escritorio se fija y avanza de lado con el scroll; en el celular baja normal.
  const mm = gsap.matchMedia();
  const cards = gsap.utils.toArray(".card figure");
  mm.add("(min-width: 52.01rem)", () => {
    const track = document.querySelector(".track");
    const distance = () => track.scrollWidth - innerWidth;
    const slide = gsap.to(track, { x: () => -distance(), ease: "none",
      scrollTrigger: { trigger: ".gallery", start: "top top", end: () => "+=" + distance(), pin: true, scrub: 0.6, invalidateOnRefresh: true } });
    cards.forEach((fig) => revealFigure(fig, slide));
  });
  mm.add("(max-width: 52rem)", () => {
    cards.forEach((fig) => revealFigure(fig));
  });
  gsap.utils.toArray(".process-media figure").forEach((fig) => revealFigure(fig));

  // Proceso: las dos fotos se separan a distinta velocidad.
  gsap.to(".pm-a", { y: -60, ease: "none", scrollTrigger: { trigger: ".process", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".pm-b", { y: 60, ease: "none", scrollTrigger: { trigger: ".process", start: "top bottom", end: "bottom top", scrub: true } });

  // Cierre: el título aparece como el de la portada.
  const closingWords = splitWords(document.querySelector("#closing-title"), "word");
  gsap.from(closingWords, { yPercent: 40, opacity: 0, filter: "blur(8px)", duration: 1, ease: "power3.out", stagger: 0.06,
    scrollTrigger: { trigger: ".closing", start: "top 70%" } });
})();
