# Servicios · Bento editorial

Guía local de Servicios, del traspaso cinematográfico al HTML real y de los enlaces proyectados de escritorio. No amplía el rediseño al header, catálogo ni otras secciones.

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
   - `src/pages/productos.astro` o `src/pages/productos/index.astro`.
2. En `src/data/services.ts`, cambiar **solo ese servicio** a `published: true`.
3. Reconstruir y comprobar el destino publicado.

Se exige tanto `published: true` como la existencia de la página Astro/Markdown para activar la ruta definitiva. Hasta entonces, por decisión del usuario, la tarjeta completa es un único `a` a `#contacto`, sin enlaces ni botones anidados. El nombre accesible indica que la consulta se hace en Contacto. Todas las tarjetas reales tienen cursor de enlace, hover discreto y foco visible. No hay rutas vacías ni enlaces a páginas inexistentes.

Cada tarjeta muestra un CTA explícito dentro del mismo enlace: «Consultar diseño web», «Consultar SEO local» o «Consultar productos», con flecha, borde y área mínima de 44px de alto. Al publicarse su página, el verbo pasa a «Ver». Es un `span`, no un segundo control. La proyección decorativa clona estos mismos CTA. Se conserva la eliminación del aviso «Página del servicio próximamente» realizada por el usuario.

`Services.astro` obtiene los archivos mediante `import.meta.glob('../../pages/**/*.{astro,md}')`. `getServiceHref` busca el archivo o su `index` en formatos `.astro` o `.md` a partir de **`route`, no de `id`**. SEO local está activo (`published: true`) con su página real en `/seo-local/`. Diseño web y Productos físicos siguen con `published: false` y fallback a Contacto. El tercero es **Productos físicos**, con `id: 'productos-fisicos'`, descripción «Productos físicos personalizados con QR y NFC para mejorar la experiencia de tus clientes.» y etiquetas QR, NFC y Personalizados; su destino preparado es `route: '/productos/'` y mantiene `scene: 'digital'`.

## Composición y movimiento

CSS puro y Geist existente. Fondo `#F4F1EB`, tarjetas blancas, texto `#171717`/`#66615C`; escenas arena `#EDE5DA`, verde grisáceo `#E7E9E0` y rosa piedra `#EDE5E8`. Bordes de 1px y radios 20px. Desde 960px: Diseño web ocupa ambas filas; SEO local y Productos físicos comparten la columna derecha. Por debajo, las tarjetas se apilan en orden natural, sin alturas máximas ni scroll interno. Esta paleta y composición describen Servicios, no un nuevo sistema global.

La iluminación ambiental de las tarjetas reales utiliza dos sombras difusas de 12/24px, borde teñido y flecha superior en un tono más oscuro. `--card-accent` / `--card-accent-ink`: web `#E9DFD1` / `#82705C`, local `#DFE4D7` / `#59674F`, productos `#E9DEE5` / `#7E6072`. El color salvia se ajusta al fondo real `#E7E9E0`. El fondo sigue blanco y el layout no cambia. No hay elevación, escala, rotación ni desplazamiento de tarjeta/flecha. Transiciones de borde/sombra/color de 225ms; con movimiento reducido el estado se aplica sin transición. Hover solo con `(hover: hover) and (pointer: fine)`; el teclado obtiene la misma iluminación más su contorno de foco. Sin hover persistente en táctil. Las tarjetas permiten overflow para las sombras; únicamente las escenas recortan sus imágenes. No se añaden pseudoelementos ni capas que capturen clics; no cambia el sistema de proyección.

Las escenas son decorativas, `aria-hidden`, sin elementos enfocados o clicables. El contenido comercial y las especialidades conservan HTML semántico. Los CTA conservan sus estilos y destinos.

## Proyección del portátil

En escritorio, la animación clona `.services-surface` como HTML decorativo, no como captura ni canvas. Mantener ese contenedor y `#servicios`. El zoom conserva su calibración y fórmulas; el traspaso ocurre en su extremo visual original (`handoffProgress: 0.75`), con pin de 1.5 viewports y `scrub: true`, sin el antiguo último cuarto inerte ni retraso entre zoom y scroll.

Por petición explícita del usuario, por debajo de 768px la foto, la proyección y el primer plano del hero quedan en `display: none`, sin espacio reservado para la imagen; el escenario móvil usa altura automática y `min-height: 0`. No se crean enlaces proyectados ni se ejecutan cálculos de perspectiva en móvil. Las tarjetas reales permanecen apiladas y son enlaces nativos.

`min-height: 100svh` mantiene el fondo completo al entregar la proyección al HTML real; `isolation: isolate` impide que un CTA de la sección real escape por encima de la copia durante el pin. Los enlaces proyectados son spans decorativos, no controles duplicados.

La copia visual del portátil siempre es `inert` y `aria-hidden`. `cinematic-handoff.ts` oculta explícitamente foto, primer plano, proyección y exterior mediante `hidden`, reforzado por CSS para que `display: block` no lo anule. Ocultar solo el escenario no bastaba: la proyección declaraba `visibility: visible` y seguía pintándose. El pin conserva su geometría y deja pasar eventos al HTML real. La reversa restaura las capas.

### Enlaces proyectados

- `cinematic-links.ts` crea tres enlaces transparentes independientes de la copia decorativa, fuera de `inert`/`aria-hidden`. Lee destino y nombre accesible de las tarjetas reales: comparten sus guardas de publicación y el fallback autorizado a Contacto.
- Se inicializa dentro del mismo `gsap.matchMedia()` cinematográfico (desde 768px y sin movimiento reducido), pero solo activa las zonas desde 1024px. Entre 768 y 1023px se conserva la navegación real: el Bento proyectado puede estar apilado y recortado, sin objetivos fiables para las tres tarjetas.
- Las medidas de cada tarjeta proceden de su layout local en el clon. Solo se leen al medir/refrescar. La nueva capa recibe exactamente la misma `matrix3d` calculada para la proyección en cada render, sin coordenadas de pantalla fijas ni otra animación.
- La apertura de la foto, incluida la mano y la muesca, se convierte una vez a coordenadas locales y recorta también el hit testing mientras la fotografía esté visible. Los huecos entre tarjetas no interceptan eventos. El exterior del hero tampoco captura eventos fuera de sus textos/enlaces.
- Mientras está activa la proyección interactiva, la superficie real es `inert`. Al terminar, se desactiva la capa proyectada y se habilita la real. Si había foco en una tarjeta, pasa a su equivalente con `preventScroll`, también al invertir el scroll. No hay dos juegos activos en el teclado.
- En móvil, movimiento reducido o sin JS, solo se usan los enlaces reales. La limpieza responsive elimina los enlaces proyectados y restaura la superficie real. El texto de las tarjetas reales declara `user-select: text` y los enlaces no son arrastrables, permitiendo selección nativa sin cambiar su diseño.

## QA

`scripts/verify-services-glow.mjs` comprueba hover sobre el padding, colores, reposo, geometría invariable, fondo blanco, teclado, ausencia de hover táctil permanente, enlaces y movimiento reducido en 1440/1024/390/360px. Capturas e informe en `.impeccable/review/services-glow/`.

`node scripts/verify-services-bento.mjs <node_modules-QA> <URL>` verifica composición, carga WebP, textos, guardas de rutas y axe en 360, 390, 768, 1024, 1440 y 1920px; comprueba selección de texto real y clic nativo del CTA tras liberar el pin. `scripts/verify-service-links.mjs` comprueba los enlaces reales completos (imagen, título, descripción, etiquetas y padding), teclado, cursor y eventos tras el zoom, incluyendo la navegación a la página SEO local.

`scripts/verify-cinematic.mjs` comprueba los seis anchos, reversa, recarga intermedia, redimensionado, movimiento reducido, contenido sin JS, imagen móvil oculta, capas realmente no renderizadas y selección nativa de «Diseño web». Compara inmediatamente antes del extremo (99.9%) con la entrega, no el antiguo plateau 95–100%. El antialiasing transformado/nativo puede variar: exige encuadre <2px, área alterada <4% y diferencia media <1/255 por canal; no afirma igualdad exacta.

`scripts/verify-projected-links.mjs` valida clics nativos confiables al 0/25/50/90%, puntos interiores y máscaras, igualdad de matrices, reversa, Tab/Enter, transferencia de foco, wheel, resize, ancla directa y enlaces reales en seis anchos. Para conservar el estado durante esa prueba, intercepta el clic de SEO local; `verify-seo-local.mjs` comprueba por separado su navegación real desde la proyección. También valida movimiento reducido, sin JS y consulta el estado HTTP de las tres rutas (SEO local 200; las otras pendientes). Informes y capturas en `.impeccable/review/projected-links/`. La validación utiliza Chromium; no sustituye pruebas en Safari/Firefox y dispositivos físicos. La restauración de la posición exacta tras recargar más allá del pin depende del navegador; la capa activa se comprueba contra la posición que restaure.
