// Modo claro / oscuro. Va en el <head> de index.html y catalogo.html para aplicar el tema antes de pintar la página.
// Si la persona nunca tocó el botón, se sigue el modo de su teléfono o computadora.
(function(){
  var KEY = 'ec-tema';
  var root = document.documentElement;
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function saved(){ try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function apply(theme){
    root.setAttribute('data-theme', theme);
    var label = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) buttons[i].setAttribute('aria-label', label);
  }

  apply(saved() || (systemDark.matches ? 'dark' : 'light'));
  if (systemDark.addEventListener) {
    systemDark.addEventListener('change', function(e){ if (!saved()) apply(e.matches ? 'dark' : 'light'); });
  }

  var style = document.createElement('style');
  style.textContent = [
    '[data-theme-toggle]{cursor:pointer;padding:0;font:inherit;}',
    '[data-theme-toggle] .ico-sun{display:none;}',
    '[data-theme="dark"] [data-theme-toggle] .ico-sun{display:block;}',
    '[data-theme="dark"] [data-theme-toggle] .ico-moon{display:none;}',
    // En oscuro el verde de los botones es más claro: letra oscura para que se lea bien
    '[data-theme="dark"] .btn--sello,[data-theme="dark"] .fav-fab,[data-theme="dark"] .new-badge,[data-theme="dark"] .fav-btn.active{color:#1C1613;}',
    // Cambio suave de colores al tocar el botón
    'html.tema-cambiando, html.tema-cambiando *{transition:background-color .45s ease, color .45s ease, border-color .45s ease, fill .45s ease !important;}'
  ].join('\n');
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function(){ apply(root.getAttribute('data-theme')); });

  document.addEventListener('click', function(e){
    var button = e.target.closest && e.target.closest('[data-theme-toggle]');
    if (!button) return;
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.classList.add('tema-cambiando');
    apply(next);
    try { localStorage.setItem(KEY, next); } catch (err) {}
    setTimeout(function(){ root.classList.remove('tema-cambiando'); }, 500);
  });
})();
