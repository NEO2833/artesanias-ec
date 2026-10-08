// === EDITAR AQUÍ: catálogo de productos. Lo usan el catálogo (catalogo.html) y "Lo más nuevo" de la portada (index.html). ===
// Para agregar uno nuevo, copia una línea y cambia los datos.
// isNew:true le pone la etiqueta "Nuevo" y lo muestra en "Lo más nuevo" de la portada.
// added:"AAAA-MM-DD" (fecha en que se agregó) hace que salga primero en "Lo más nuevo".
const PRODUCTS = {
  jabones: [
    {img:"imagenes/jabones/jabon-exfoliante-cafe.jpg", title:"Jabón Exfoliante de Café", tag:"Fragancia Vainilla"},
    {img:"imagenes/jabones/jabon-hidratante-vainilla.jpg", title:"Jabón Hidratante", tag:"Fragancia Vainilla"},
    {img:"imagenes/jabones/jabon-hidratante-mango-gardenia.jpg", title:"Jabón Hidratante", tag:"Mango y Gardenia"},
    {img:"imagenes/jabones/jabon-hidratante-sandalo.jpg", title:"Jabón Hidratante", tag:"Fragancia Sándalo"},
    {img:"imagenes/jabones/set-regalo-jabones-velones.jpg", title:"Set de Regalo Artesanal", tag:"Jabones y velones", desc:"Combina piezas a tu gusto para armar un set de regalo.", wide:true},
    {img:"imagenes/jabones/jabon-hidratante-suavidad.jpg", title:"Jabón Hidratante", tag:"Suavidad y frescura"},
    {img:"imagenes/jabones/jabon-decorativo-sakura.jpg", title:"Jabón Decorativo", tag:"Fragancia Sakura"},
    {img:"imagenes/jabones/jabon-hidratante-naranja.jpg", title:"Jabón Hidratante", tag:"Fragancia Naranja"},
    {img:"imagenes/jabones/jabon-exfoliante-bolas.jpg", title:"Bolas de Jabón Exfoliante", tag:"Edición exfoliante"},
    {img:"imagenes/jabones/jabon-unificador-tono.jpg", title:"Jabón Unificador de Tono de Piel", tag:"Piel pareja y luminosa"},
    {img:"imagenes/jabones/jabon-hidratante-azul.jpg", title:"Jabón Hidratante", tag:"Azul"},
    {img:"imagenes/jabones/jabon-suavizante-blanco.jpg", title:"Jabón Suavizante en Corazón", tag:"Blanco"},
    {img:"imagenes/jabones/jabon-exfoliante-floral.jpg", title:"Jabón Exfoliante Floral", tag:"Blanco y Gris", isNew:true},
    {img:"imagenes/jabones/set-detalles-artesanales.jpg", title:"Set de Detalles Artesanales", tag:"Regalo especial", desc:"Caja con mini jabones, sachet y vela — ideal para un regalo pequeño.", isNew:true},
    {img:"imagenes/jabones/set-jabones-vela-caja-kraft.jpg", title:"Set de Jabones y Vela en Caja Kraft", tag:"Regalo especial", desc:"Caja kraft con jabones jaspeados, sachet y velita aromática.", isNew:true},
    {img:"imagenes/jabones/jabon-decorativo-margaritas.jpg", title:"Jabón Decorativo Margaritas", tag:"Rosa y Amarillo", desc:"Vara con dos margaritas talladas a mano, para lucir o regalar.", isNew:true},
    {img:"imagenes/jabones/jabon-decorativo-margarita-amarilla.jpg", title:"Jabón Decorativo Margarita", tag:"Amarillo", isNew:true},
    {img:"imagenes/jabones/jabon-suavizante-corazon-aguacate-lavanda.jpg", title:"Jabón Suavizante en Corazón", tag:"Aguacate y Lavanda", desc:"Hidrata y suaviza la piel con aceite natural de aguacate y fragancia de ramas de lavanda.", isNew:true},
    {img:"imagenes/jabones/jabon-unificador-corazon-curcuma-coco-vainilla.jpg", title:"Jabón Unificador de Tono en Corazón", tag:"Cúrcuma, Coco y Vainilla", desc:"Ayuda a borrar manchas oscuras y unificar el tono de la piel, con cúrcuma, esencia de limón y fragancia de coco y vainilla.", isNew:true},
    {img:"imagenes/jabones/set-jabones-cesta-dia-madres.jpg", title:"Cesta de Jabones Artesanales", tag:"Piel unificada e hidratada", desc:"Jabones artesanales para mantener el tono de tu piel unificado e hidratado.", wide:true, isNew:true}
  ],
  sachets: [
    {img:"imagenes/jabones/sachet-lavanda.jpg", title:"Sachet Aromático", tag:"Ramas de Lavanda"},
    {img:"imagenes/jabones/jabon-petalos.jpg", title:"Sachet Aromático", tag:"Edición floral"},
    {img:"imagenes/jabones/jabon-canela-sandalo.jpg", title:"Sachet Aromático", tag:"Canela y Sándalo"},
    {img:"imagenes/jabones/sachet-vainilla.jpg", title:"Sachet Aromático", tag:"Fragancia Vainilla"},
    {img:"imagenes/jabones/sachet-ambar-algodon.jpg", title:"Sachet Aromático", tag:"Ámbar y Algodón"},
    {img:"imagenes/jabones/sachet-cedro.jpg", title:"Sachet Aromático", tag:"Fragancia Cedro"}
  ],
  velones: [
    {img:"imagenes/velones/velon-te-alto-1.jpg", title:"Velón Aromático", tag:"Té Alto"},
    {img:"imagenes/velones/velon-vainilla-caramelo.jpg", title:"Velón Aromático", tag:"Vainilla y Caramelo"},
    {img:"imagenes/velones/velon-te-alto-2.jpg", title:"Velón Aromático", tag:"Té Alto"},
    {img:"imagenes/velones/velon-coco.jpg", title:"Velón Aromático", tag:"Coco"},
    {img:"imagenes/velones/velon-te-blanco.jpg", title:"Velón Aromático", tag:"Té Blanco"},
    {img:"imagenes/velones/velon-ambar-negro.jpg", title:"Velón Aromático", tag:"Ámbar Negro"},
    {img:"imagenes/velones/set-velon-difusor.jpg", title:"Set de Velón y Difusor", tag:"Edición especial", desc:"Set con velón, difusor de varillas y detalles decorativos.", wide:true},
    {img:"imagenes/velones/velon-lavanda.jpg", title:"Velón Aromático", tag:"Lavanda"},
    {img:"imagenes/velones/velon-eucalipto.jpg", title:"Velón Aromático", tag:"Eucalipto"},
    {img:"imagenes/velones/velon-flores-secas-lavanda.jpg", title:"Velón Aromático", tag:"Lavanda y Flores Secas", desc:"Vela en copa de cristal, decorada con flores secas de lavanda sobre la cera.", isNew:true},
    {img:"imagenes/velones/velon-te-alto-vaso-yute.jpg", title:"Velón Aromático", tag:"Té Alto", desc:"Velón en vaso de vidrio, amarrado con lazo de yute.", isNew:true, added:"2026-10-08"},
    {img:"imagenes/velones/velon-te-blanco-petalos-rosas.jpg", title:"Velón Aromático", tag:"Té Blanco", desc:"Decorado con pétalos de rosas y ramas de crisantemos sobre la cera.", isNew:true, added:"2026-10-08"}
  ],
  flores: [
    {img:"imagenes/flores/claveles-eternos-blanco.jpg", title:"Ramo de Claveles Eternos", tag:"Blanco clásico", desc:"Claveles preservados en florero de vidrio con moño decorativo."},
    {img:"imagenes/flores/rosas-eternas-amarillo.jpg", title:"Ramo de Rosas Eternas", tag:"Amarillo", desc:"Rosas preservadas en florero de vidrio, ideales para decorar cualquier espacio."},
    {img:"imagenes/flores/rosas-eternas-azul-maceta.jpg", title:"Rosas Eternas en Maceta", tag:"Azul", desc:"Arreglo de rosas preservadas en maceta decorativa con acabado dorado."},
    {img:"imagenes/flores/flor-liston-rosa-maceta.jpg", title:"Dhalia", tag:"Rosa", desc:"Flor artesanal hecha con listón de satín, presentada en maceta con moño."},
    {img:"imagenes/flores/mini-ramo-rosas-amarillas.jpg", title:"Mini Ramo de Rosas Eternas", tag:"Amarillo con lazo verde", desc:"Rosas eternas y flor de nube envueltas en papel, con moño de listón satinado.", isNew:true},
    {img:"imagenes/flores/rosas-liston-marfil-maceta.jpg", title:"Ramo de Rosas de Listón", tag:"Marfil", desc:"Rosas hechas a mano con listón de satín, presentadas en maceta de cerámica con moño.", isNew:true},
    {img:"imagenes/flores/rosas-liston-rosapalo-maceta.jpg", title:"Ramo de Rosas de Listón", tag:"Rosa Palo", desc:"Rosas hechas a mano con listón de satín, presentadas en maceta de cerámica con moño dorado.", isNew:true},
    {img:"imagenes/flores/centro-mesa-rosas-clavel-dhalia.jpg", title:"Centro de Mesa", tag:"Rosas, Clavel y Dhalia", desc:"Centro de mesa artesanal hecho con listón de satín, presentado en caja decorativa sobre base de pedestal.", isNew:true}
  ],
  subeniles: [
    {img:"imagenes/subeniles/baby-shower-caja-individual.jpg", title:"Cajita de Jabones Bebé", tag:"Baby Shower", desc:"Mini jabones (osito, biberón, huellita y coche) en caja con ventana y moño de listón."},
    {img:"imagenes/subeniles/baby-shower-pedido-mayor.jpg", title:"Recuerdos por Mayor", tag:"Baby Shower", desc:"Se arman por cantidad según el número de invitados de tu evento.", wide:true},
    {img:"imagenes/subeniles/baby-shower-produccion.jpg", title:"Mini Jabones para Armar", tag:"Baby Shower", desc:"Mini jabones sueltos (osito, biberón, huellita, coche y más) listos para empacar en tu cajita."}
  ]
};
