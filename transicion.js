// Transición entre la portada y el catálogo: un telón verde salvia (con borde festoneado y el logo)
// sube y cubre la pantalla, se cambia de página detrás, y en la página nueva el telón se levanta.
// Va en el <head> de index.html y catalogo.html para que el telón esté puesto desde el primer instante.
(function(){
  var KEY = 'ec-telon';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    'html::after{',
    '  content:"";position:fixed;left:0;right:0;top:-20px;bottom:-20px;z-index:1000;pointer-events:none;',
    '  background:',
    '    url(imagenes/logo.png) center/112px no-repeat,',
    '    radial-gradient(circle at center,#F6F2EA 66px,transparent 67px),',
    '    #3B4433;',
    '  -webkit-mask:',
    '    radial-gradient(circle at 20px 20px,#000 19.5px,transparent 20px) top/40px 20px repeat-x,',
    '    linear-gradient(#000,#000) center/100% calc(100% - 40px) no-repeat,',
    '    radial-gradient(circle at 20px 0,#000 19.5px,transparent 20px) bottom/40px 20px repeat-x;',
    '  mask:',
    '    radial-gradient(circle at 20px 20px,#000 19.5px,transparent 20px) top/40px 20px repeat-x,',
    '    linear-gradient(#000,#000) center/100% calc(100% - 40px) no-repeat,',
    '    radial-gradient(circle at 20px 0,#000 19.5px,transparent 20px) bottom/40px 20px repeat-x;',
    '  transform:translateY(100%);visibility:hidden;',
    '}',
    'html.telon-sube::after{visibility:visible;transform:translateY(0);transition:transform .65s cubic-bezier(.76,0,.24,1);}',
    'html.telon-puesto::after{visibility:visible;transform:translateY(0);transition:none;}',
    'html.telon-se-va::after{visibility:visible;transform:translateY(-100%);transition:transform .75s cubic-bezier(.76,0,.24,1);}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // Llegando desde la otra página: el telón ya está puesto y se levanta cuando la página está lista.
  var arriving = false;
  try { arriving = sessionStorage.getItem(KEY) === '1'; sessionStorage.removeItem(KEY); } catch (e) {}
  if (arriving && !reduceMotion) {
    root.classList.add('telon-puesto');
    document.addEventListener('DOMContentLoaded', function(){
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        root.classList.remove('telon-puesto');
        root.classList.add('telon-se-va');
        setTimeout(function(){ root.classList.remove('telon-se-va'); }, 900);
      }); });
    });
  }

  // Al volver con el botón "atrás", el navegador puede mostrar la página guardada con el telón puesto: lo quitamos.
  window.addEventListener('pageshow', function(e){
    if (e.persisted) root.classList.remove('telon-sube', 'telon-puesto', 'telon-se-va');
  });

  function otherPageLink(a){
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return null;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(href)) return null;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return null;
    var samePage = url.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '');
    return samePage ? null : url;
  }

  // Precarga la otra página en cuanto el dedo o el mouse se acerca al link, para que el cambio sea casi instantáneo.
  var prefetched = {};
  function prefetch(e){
    var url = otherPageLink(e.target.closest && e.target.closest('a'));
    if (!url || prefetched[url.pathname]) return;
    prefetched[url.pathname] = true;
    var link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url.pathname;
    document.head.appendChild(link);
  }
  document.addEventListener('pointerover', prefetch, { passive: true });
  document.addEventListener('touchstart', prefetch, { passive: true });

  // Link a esta misma página sin sección (el logo estando en la portada): volver al principio con el telón.
  function samePageTopLink(a){
    if (!a || a.target === '_blank') return false;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    var url = new URL(a.href, location.href);
    return url.origin === location.origin && !url.hash &&
      url.pathname.replace(/index\.html$/, '') === location.pathname.replace(/index\.html$/, '');
  }

  function backToTop(){
    if (reduceMotion || window.scrollY < 300) { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    root.classList.remove('telon-se-va');
    root.classList.add('telon-sube');
    setTimeout(function(){
      window.scrollTo({ top: 0, behavior: 'instant' });
      // Las animaciones ligadas al scroll saltan directo a su estado inicial, sin "ponerse al día" a la vista.
      if (window.ScrollTrigger) {
        ScrollTrigger.update();
        ScrollTrigger.getAll().forEach(function(st){ var tw = st.getTween && st.getTween(); if (tw) tw.progress(1); });
      }
      requestAnimationFrame(function(){ requestAnimationFrame(function(){
        root.classList.remove('telon-sube');
        root.classList.add('telon-se-va');
        setTimeout(function(){ root.classList.remove('telon-se-va'); }, 900);
      }); });
    }, 700);
  }

  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (samePageTopLink(e.target.closest('a'))) { e.preventDefault(); backToTop(); return; }
    var url = otherPageLink(e.target.closest('a'));
    if (!url || reduceMotion) return;
    e.preventDefault();
    try { sessionStorage.setItem(KEY, '1'); } catch (err) {}
    root.classList.remove('telon-se-va');
    root.classList.add('telon-sube');
    setTimeout(function(){ location.href = url.href; }, 650);
  });
})();
