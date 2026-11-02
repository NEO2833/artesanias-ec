// El catálogo ahora vive en la portada (index.html#catalogo). Los links viejos
  // (catalogo.html#velones, catalogo.html#como-pedir, etc.) siguen funcionando:
  // se mandan a la línea correspondiente.
  (function () {
    var lines = ["jabones", "sachets", "velones", "flores", "subeniles"];
    var h = location.hash.slice(1);
    var params = new URLSearchParams(location.search);
    if (lines.indexOf(h) > -1) params.set("linea", h);
    var q = params.toString();
    var target = "index.html" + (q ? "?" + q : "") + (h === "como-pedir" ? "#como-pedir" : "#catalogo");
    location.replace(target);
  })();
