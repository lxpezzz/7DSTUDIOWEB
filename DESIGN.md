---
name: 7D Studio
description: Sistema construido de minimalismo editorial digital para un estudio independiente.
colors:
  paper: "#f8f7f4"
  ink: "#171717"
  muted: "#686868"
  line: "#e3e1dc"
  accent: "#3159e8"
  white: "#ffffff"
  portfolio-surface: "#eeede9"
  portfolio-line: "#d7d5cf"
  contact-copy: "#b4b4b4"
  contact-note: "#aaa"
  field-line: "#555"
  field-placeholder: "#a0a0a0"
  submit-hover: "#dcd9d2"
typography:
  display:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "clamp(36px, 3.4vw, 58px)"
    fontWeight: 450
    lineHeight: 1.045
    letterSpacing: "-.04em"
  hero-display-tablet:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "clamp(36px, 4.6vw, 48px)"
    fontWeight: 450
    lineHeight: 1.045
    letterSpacing: "-.04em"
  hero-display-mobile:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "clamp(43px, 8.6vw, 64px)"
    fontWeight: 450
    lineHeight: 1.045
    letterSpacing: "-.04em"
  hero-description:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "15px"
    lineHeight: 1.6
  hero-description-mobile:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  hero-eyebrow:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "9px"
    fontWeight: 500
    letterSpacing: ".075em"
  hero-scroll:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "9px"
    letterSpacing: ".1em"
  headline:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "clamp(34px, 4.1vw, 58px)"
    fontWeight: 450
    lineHeight: 1.08
    letterSpacing: "-.04em"
  title:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "clamp(28px, 3vw, 41px)"
    fontWeight: 450
    lineHeight: 1.12
    letterSpacing: "-.035em"
  body:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "17px"
    lineHeight: 1.65
  label:
    fontFamily: "'Geist Variable', Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: ".08em"
rounded:
  button: "3px"
  field: "0px"
spacing:
  gutter: "clamp(24px, 4.45vw, 64px)"
  section: "112px"
  section-mobile: "72px"
  editorial-gap: "48px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-contact:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "16px 22px"
    width: "100%"
  button-contact-hover:
    backgroundColor: "{colors.submit-hover}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.field}"
    padding: "10px 0 13px"
    width: "100%"
---

# Design System: 7D Studio

## Overview

**Creative North Star: "Minimalismo editorial digital"**

El sistema construido presenta un estudio independiente mediante tipografía, espacio y filetes. Geist sobre papel cálido y tinta casi negra sostiene una composición asimétrica; el azul aparece como señal puntual y respuesta interactiva. El hero incorpora una fotografía aportada por el usuario: su pantalla conduce a la sección HTML real de Servicios; las demás superficies mantienen la profundidad plana, sin degradados, tarjetas flotantes ni fotografía artificial.

Esta actualización documenta únicamente hero, navegación y Servicios después de las correcciones revisadas; portfolio y secciones posteriores conservan su documentación. Fuentes actuales: `src/components/home/Hero.astro`, `Services.astro`, `src/scripts/cinematic-hero.ts`, `hero-projection.ts`, `src/data/hero-scene.ts`, `src/layouts/BaseLayout.astro`, `src/styles/global.css` y `.impeccable/review/cinematic/qa.json`. Astro y Tailwind 4 se conservan. El contrato de BaseLayout fija la dirección cinematográfica editorial sobre el seed `1c1b8177`.

**Key Characteristics:**
- Geist como única familia, jerarquía por escala y peso contenido.
- Papel, tinta, gris y filetes; azul puntual.
- Retícula asimétrica y superficies planas.
- Fotografía original, perspectiva HTML y entrega a Servicios semánticos; móvil y movimiento reducido estáticos.
- Numeración de secciones, eyebrow y marca tipográfica con ® exigidos por el brief.

## Colors

El frontmatter registra los valores reales; las cinco variables de identidad proceden del tema global y los neutros auxiliares de los componentes.

### Primary
- **Azul puntual** (`accent`): punto del estado de portfolio, hover del botón principal, selección de texto y contorno de foco; el eyebrow del hero actual no lleva punto.

### Neutral
- **Papel** (`paper`): fondo general, texto sobre carbón y botón de contacto.
- **Tinta** (`ink`): texto principal, botón primario y fondo de contacto.
- **Gris editorial** (`muted`): texto secundario, numeración y última frase del estudio. La última frase del hero usa el gris local `#565656`, no un cambio del token global.
- **Filete** (`line`): límites de cabecera, secciones, servicios, pasos y pie.
- **Superficie y filete de portfolio**: variación cálida de fondo y separador dentro de la sección de proyectos.
- **Blanco y auxiliares de contacto**: texto de campos, copias secundarias, placeholders, bordes y hover del botón invertido. No constituyen una segunda paleta de marca.

**The Accent Rule.** El azul señala y responde; no sustituye los grandes fondos de papel y carbón que existen en la home.

## Typography

**Display Font / Body Font:** Geist Variable, con Arial y sans-serif como fallback. WOFF2 latino local, pesos variables (100–900), `font-display: swap` y precarga en BaseLayout. No hay familia mono ni serif.

### Hierarchy
- **Display:** rol exclusivo del hero actual, con variantes locales `hero-display-tablet` y `hero-display-mobile` en el frontmatter, sin modificar la rampa global de títulos, cuerpo y etiquetas. La variante tablet corresponde a 768–1023px o escritorio desde 1024px con aspecto máximo 1:1. Última frase al 78%, bloque de 12ch (13ch móvil), margen superior de 14px; los saltos explícitos permiten reflujo adicional.
- **Headline:** títulos de sección con balance de texto. El estudio usa una escala propia (`clamp(42px, 5.4vw, 76px)`, interlínea 1.07); contacto otra (`clamp(40px, 4.4vw, 62px)`, interlínea 1.1). Ambos conservan peso 450 y tracking negativo.
- **Title:** títulos de filas de servicio. Los títulos de proceso usan una escala menor (`clamp(20px, 1.8vw, 25px)`).
- **Body:** copia general del frontmatter, reducida a 16px en móvil; servicios y proceso tienen texto secundario de 15–16px. La descripción local del hero tiene sus propios roles en el frontmatter y ancho máximo de 330px; la declaración del estudio mantiene 495px.
- **Label:** numeración y etiquetas de sección, reducidas a 11px en móvil. Eyebrow y enlace de scroll del hero usan los roles locales del frontmatter; el eyebrow móvil tiene interlínea 1.7. Metadatos y pies de 9–13px. Numeración con cifras tabulares.
- **Marca:** texto de 25px, peso 650, tracking -.065em; en cabecera móvil 22px. ® en superíndice de 10px, peso 450. No existe logotipo gráfico en esta composición.

## Layout

Contenedor centrado con ancho `min(100% - var(--gutter) * 2, 1280px)`. El gutter fluido y el ritmo de sección están en el frontmatter. La retícula editorial habitual es `1fr 2fr`, con separación de 48px. La cabecera es fija a sangre (`position: fixed`, `z-index: 50`), hermana de `main` y fuera del escenario GSAP, sin ancestros transformados. Su interior conserva el contenedor y altura mínima de 104px; fondo papel, al 97% de opacidad después de 8px de scroll. Contacto sigue a sangre con interior contenido.

La home construida funciona en modo **Persuade**: hero → servicios → portfolio → proceso → estudio → contacto → pie. Es una composición de esta superficie, no una obligación para todas las futuras páginas.

- **Hero:** fotografía a sangre y escenario de `100svh` (mínimo inicial 680px); navegación superior, eyebrow, titular, descripción y CTA a la izquierda, sin invadir la pantalla. Copia de ancho 31%, máximo 470px, a `max(150px, 20%)`; scroll exploratorio abajo. La fotografía se adapta con cover; a 1024–1279px en aspecto horizontal se alinea a la izquierda. En tablet y escritorio de aspecto máximo 1:1, foto y primer plano empiezan 180px más abajo y la copia ocupa hasta 55%/440px.
- **Servicios:** filas horizontales (`56px 1fr 1fr`, gap 32px), no tarjetas. Nota de siete días expresamente condicionada al alcance y materiales.
- **Portfolio:** superficie tonal con estado editorial vacío honesto; no hay imágenes renderizadas ni casos inventados. Existe una rama de código para proyectos futuros, pero no se presenta como portfolio publicado.
- **Proceso:** tres columnas iguales con gap de 40px, numeración y flechas entre pasos.
- **Estudio:** declaración tipográfica en la columna ancha; lugar en la estrecha.
- **Contacto:** carbón; retícula `1.1fr 1fr`, gap fluido de 48–116px. Pie en papel, tres columnas `2fr 1fr 1fr`.

Hasta 767px, las secciones principales pasan a una columna y el ritmo general se reduce. Servicios y proceso conservan un carril de numeración (`28px`) y gap de 16px. El hero vuelve al flujo: navegación → copia (márgenes 36px arriba y 32px abajo) → foto de proporción 1672/941 → enlace de scroll. No hay índice ni sello activos, ni excepción tipográfica hasta 389px. El estudio y contacto tienen escalas móviles propias. El pie pasa a dos columnas, con la marca ocupando ambas.

La navegación se transforma hasta 640px: cabecera mínima de 84px y menú desplegable dentro de la cabecera fija. ResizeObserver actualiza `--header-height`; el hero móvil reserva esa altura y `scroll-padding-top` añade 24px para las anclas. Sin JS, se reserva una altura móvil conservadora de 164px. El hero actual no tiene una variante adicional desde 1500px.

QA existente, no repetido en este pase documental: `scripts/verify-cinematic.mjs` y `.impeccable/review/cinematic/qa.json`, solo Chromium, a 360, 390, 768, 1024, 1440 y 1920px; cero errores, fallos, violaciones axe y overflow en las comprobaciones registradas. Registro foto/HTML subpíxel (máximo observado 0.17048px, aproximadamente 0.17px). Las cuatro comparaciones de entrega entre 95% y 100% son idénticas píxel a píxel. El script comprueba reversa, recarga intermedia, cambio a móvil, móvil inicial sin descarga de GSAP, movimiento reducido y contenido sin JavaScript. No acredita otros navegadores ni añade resultados de Lighthouse.

## Elevation & Depth

No hay sombras. La jerarquía se construye con espacio, escala tipográfica, filetes y dos cambios tonales de sección: portfolio cálido y contacto carbón. El hero añade profundidad fotográfica con una proyección HTML y un primer plano enmascarado; no introduce tarjetas elevadas ni blur.

## Shapes

Predominan líneas de 1px y geometría rectangular. Botones con esquina apenas suavizada; campos rectos con solo borde inferior. El punto azul del estado de portfolio (5px) acompaña el sistema. Flechas SVG de trazo fino acompañan las acciones.

### Apertura fotográfica y componente legado

`src/data/hero-scene.ts` conserva las cuatro esquinas de pantalla normalizadas sobre la foto original (1672 × 941), no sobre un recorte CSS. El polígono de apertura en coordenadas de esa imagen preserva muesca, mano y silueta del cuerpo sobre el cristal. La máscara SVG mantiene ese primer plano por encima de la proyección HTML.

`src/components/ui/StudioSeal.astro` permanece como componente legado reutilizable, sin uso en el hero actual. Sus proporciones y animación no forman parte del sistema activo de esta fase.

## Components

### Buttons and text links

Botón primario sólido, mínimo 54px de alto, separación interna de 28px entre texto y flecha; tipografía de 14px y peso 500. Hover azul. La variante de contacto invierte papel/tinta y ocupa todo el ancho. Deshabilitado: opacidad .6 y cursor de espera. Los enlaces de texto tienen mínimo 44px de alto, gap de 16px y subrayado que aparece al hover.

Las flechas de botones y enlaces se desplazan (3px, -3px) al hover durante .3s; color/fondo o subrayado transicionan en .25s. Foco global: contorno azul de 2px con offset de 6px. El titular actual no tiene animación de entrada independiente. Con movimiento reducido se eliminan animaciones, transiciones y scroll suave.

### Cinematic hero and Services handoff

La foto aportada por el usuario se conserva en `public/hero-7dstudio.png` (1672 × 941); la versión servida es `public/hero-7dstudio.webp` (51,324 bytes, aproximadamente 50KiB). Es un recurso visual editorial proporcionado, no un caso de portfolio ni evidencia de trabajo para un cliente.

Servicios mantiene su sección semántica nativa en el DOM, con IDs y títulos reales. La pantalla solo muestra un clon decorativo `aria-hidden` e `inert`, sin IDs, referencias de etiquetado ni controles/enlaces. Ese clon usa el mismo ancho de viewport que la sección real, no una miniatura con tipografía recompuesta.

Solo desde 768px y sin preferencia de movimiento reducido se importan GSAP y ScrollTrigger de forma diferida. Tras fuentes e imagen, se fija el escenario durante una distancia de dos alturas de viewport, con `scrub: 1`; acercamiento y enderezado progresivos terminan en la sección real. Foto completa y primer plano reciben la misma homografía que registra la interfaz: no son capas ampliadas con una escala independiente. El exterior se desvanece y queda inert durante el acercamiento; la foto desaparece antes de la entrega. Al completar, el escenario se oculta y Servicios continúa con scroll nativo. El margen de solapamiento de `-100svh` se aplica únicamente cuando el hero está listo; reversa y limpieza responsive restauran sus estados.

En móvil o movimiento reducido se proyecta HTML estático en la pantalla mediante ResizeObserver, sin pin ni descarga inicial de GSAP. Sin JavaScript quedan la fotografía original y el contenido normal, sin proyección, pin ni solapamiento. La calibración visual `?debugScreen` solo existe en desarrollo (`DEV`).

### Navigation and brand

Marca textual enlazada con ® en cabecera y pie. Navegación de escritorio con gap de 36px, enlaces de 13px y área mínima de 44px. Hover por subrayado. En móvil, botón «Menú», dos trazos que se cruzan al abrir y `aria-expanded`; Escape y selección de enlace cierran. Sin JavaScript, los enlaces permanecen visibles. No se implementa estado de sección activa.

Cabecera persistente comprobada en Chromium a 360, 390, 768 y 1440px: permanece en y=0 y por encima de la escena y secciones, sin recibir opacity/inert de GSAP. Se verifican menú, Escape, anclas y ausencia de ancestros con transform/perspective/filter mediante `scripts/verify-header.mjs`; evidencia en `.impeccable/review/header/`. La regresión cinematográfica conserva sus pruebas aprobadas; con la cabecera translúcida, la diferencia de capturas 95%/100% es inferior al 0,01% de píxeles (la igualdad exacta anterior corresponde al estado sin cabecera persistente).

### Editorial rows and numbered headings

Etiquetas de sección numeradas 01–05 y eyebrow son requisitos explícitos, no adornos prescindibles. Las filas de servicios se separan por filetes; sus especialidades son texto corrido separado por puntos, no chips interactivos. Los pasos de proceso comparten borde superior y números tabulares. No hay biblioteca de tarjetas visible en el estado actual.

### Portfolio empty state

Estado «PORTFOLIO EN PREPARACIÓN», punto azul, explicación y enlace a contacto. Sin imagen, mockup ni placeholder ilustrado. Este estado corresponde a la home actual; no prohíbe futuros casos reales con contexto.

### Contact fields and feedback

Nombre, email y mensaje con etiquetas visibles, indicación de obligatoriedad y validación nativa. Fondo transparente, texto blanco y línea inferior; el foco blanquea la línea además del contorno global. Textarea redimensionable verticalmente, mínimo 100px. En móvil los campos usan 16px. Mensajes de estado en región `aria-live="polite"`, con foco tras la respuesta.

Web3Forms está pendiente de clave: no se describe como envío operativo. Con JavaScript, el formulario prepara el texto y muestra un enlace para revisarlo y enviarlo en WhatsApp; no lo envía automáticamente. Sin JavaScript, el botón permanece deshabilitado en este estado y se ofrecen WhatsApp directo y llamada. Teléfono confirmado: 621 200 800. La rama de envío Web3Forms existe, con estados de espera, éxito y error, pero no está activada. Información legal y proyectos reales siguen pendientes aceptados; no se inventan enlaces legales ni email.

Para esta fase hero/navegación/Servicios, la revisión independiente comunicada tuvo disposición original **fix**; el veredicto posterior evaluó las tres correcciones como resueltas y cerró **ship**. Es un veredicto sobre esas correcciones, no una segunda revisión integral ni una reevaluación de las secciones posteriores. Este pase solo documenta el estado construido.

## Do's and Don'ts

### Do:
- **Do** conservar Geist, papel, tinta, gris, filetes y azul puntual.
- **Do** mantener la numeración, el eyebrow y ® exigidos por el brief.
- **Do** permitir que el titular y las retículas refluyan en móvil.
- **Do** mostrar estados honestos de portfolio y contacto, con foco visible y movimiento reducido.

### Don't:
- **Don't** introducir degradados, tarjetas flotantes ni fotografía artificial.
- **Don't** inventar clientes, métricas, casos, imágenes de proyectos, email o envíos completados.
- **Don't** confundir ramas futuras de código con capacidades actualmente activadas.
- **Don't** convertir la composición concreta de esta home en una regla universal para otras superficies.
