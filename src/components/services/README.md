# Servicios · Bento editorial

Guía local de Servicios y de las dos excepciones CSS autorizadas en Hero (imagen móvil y entrega de interacción). No amplía el rediseño al header, catálogo, otras secciones ni al motor de escena de escritorio.

## Archivos

- `../home/Services.astro`: encabezado, retícula 55/45 y CTA existente.
- `ServiceCard.astro`: contenedor, contenido comercial, variantes y enlace único opcional.
- `WebScene.astro`: navegador con la captura WebP real de HUELLA proporcionada por el usuario, ya existente en `src/images/projects/huella.webp`. Astro genera versiones de 640 y 960px (aproximadamente 16 y 28KB); no se ha generado una imagen nueva ni una captura ficticia.
- `LocalScene.astro`: mapa geométrico y ficha HTML. Valoración y horario son exclusivamente ilustrativos y están identificados visualmente como ejemplo; no son reseñas ni resultados reales.
- `DigitalScene.astro`: microlanding de ejemplo con símbolo propio de 7D Studio y NFC; no hay un QR falso ni controles interactivos dentro de la escena.
- `../../data/services.ts`: textos, etiquetas, rutas y estado de publicación.

## Activar las rutas

1. Terminar la página real correspondiente:
   - `src/pages/diseno-web.astro` o `src/pages/diseno-web/index.astro`.
   - `src/pages/seo-local.astro` o `src/pages/seo-local/index.astro`.
   - `src/pages/soluciones-digitales.astro` o `src/pages/soluciones-digitales/index.astro`.
2. En `src/data/services.ts`, cambiar **solo ese servicio** a `published: true`.
3. Reconstruir y comprobar el destino publicado.

Se exige tanto `published: true` como la existencia de la página Astro/Markdown: hasta entonces la tarjeta es un `article`, sin href, tabindex ni cursor de enlace. El estado «Página del servicio próximamente» es explícito. Al activarse, el contenedor completo pasa a ser un único `a`, sin enlaces ni botones anidados, con foco visible. No hay rutas vacías en esta entrega.

`Services.astro` obtiene los archivos mediante `import.meta.glob('../../pages/**/*.{astro,md}')`. `getServiceHref` busca el archivo o su `index` en formatos `.astro` o `.md` a partir de **`route`, no de `id`**. Los tres servicios siguen con `published: false`. El tercero es **Productos físicos**, con `id: 'productos-fisicos'`, descripción «Productos físicos personalizados con QR y NFC para mejorar la experiencia de tus clientes.» y etiquetas QR, NFC y Personalizados; mantiene `route: '/soluciones-digitales/'` y `scene: 'digital'`. No cambiar esa ruta al renombrar el identificador.

## Composición y movimiento

CSS puro y Geist existente. Fondo `#F4F1EB`, tarjetas blancas, texto `#171717`/`#66615C`; escenas arena `#EDE5DA`, verde grisáceo `#E7E9E0` y rosa piedra `#EDE5E8`. Bordes de 1px, radios 20px, sin sombras decorativas. Desde 960px: Diseño web ocupa ambas filas; SEO local y Productos físicos comparten la columna derecha. Por debajo, las tarjetas se apilan en orden natural, sin alturas máximas ni scroll interno. Esta paleta y composición describen Servicios, no un nuevo sistema global.

Las microinteracciones usan únicamente transform, duran 300–350ms y se desactivan con movimiento reducido. Las escenas son decorativas, `aria-hidden`, sin elementos enfocados o clicables. El contenido comercial y las especialidades conservan HTML semántico.

## Proyección del portátil

En escritorio, la animación sigue clonando `.services-surface`, sin modificar cálculos de cámara, duración, pin ni perspectiva. Mantener ese contenedor y `#servicios`.

Por petición explícita del usuario, por debajo de 768px la foto, la proyección y el primer plano del hero quedan en `display: none`, sin espacio reservado para la imagen; el escenario móvil usa altura automática y `min-height: 0`. Esta excepción CSS no rediseña el hero de escritorio ni modifica su script.

`min-height: 100svh` mantiene el fondo completo al entregar la proyección al HTML real; `isolation: isolate` impide que un CTA de la sección real escape por encima de la copia durante el pin. Los enlaces proyectados son spans decorativos, no controles duplicados.

Durante el recorrido, incluso cuando el plano ya se ha enderezado, la copia del portátil es `inert`. Al completar el scroll, se muestra el HTML real. Se corrigió con autorización el bloqueo previo del ratón: `.cinematic-hero.cinematic-complete { pointer-events: none; }` permite que el contenedor del pin no intercepte la selección ni los clics de Servicios. Al volver hacia arriba se restaura el comportamiento del hero.

## QA

`node scripts/verify-services-bento.mjs <node_modules-QA> <URL>` verifica composición, carga WebP, textos, guardas de rutas y axe. El último informe `.impeccable/review/services-bento/qa.json` pasa en 360, 390, 768, 1024, 1440 y 1920px, sin desbordamiento, texto recortado, errores JS ni infracciones axe; comprueba selección de texto real y clic nativo del CTA tras liberar el pin. El futuro estado enlazado (hover, foco y clic de tarjeta) se probó únicamente mediante un mock del DOM del navegador: no se publicó ninguna ruta.

`scripts/verify-cinematic.mjs` pasa los mismos seis anchos y comprueba reversa, recarga, redimensionado, movimiento reducido, contenido sin JavaScript, imagen móvil oculta y entrega al HTML real con hit testing y selección nativa al final. La comparación entre el 95% y el 100% registra una proporción máxima de píxeles cambiados de `0.0000279744` (aproximadamente `0.0028%`): bordes de antialiasing imperceptibles, no igualdad exacta de píxeles. La validación del navegador utiliza Chromium; no sustituye pruebas en Safari/Firefox y dispositivos físicos.
