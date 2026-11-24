# SEO local · `/seo-local/`

## Alcance e identidad

Landing estática para propietarios de pequeños negocios. Explica el valor antes de presentar los planes. Reutiliza BaseLayout, Header, Footer, SectionCta, Geist, contenedor y botones existentes. Salvia de la escena de Servicios (`#E7E9E0`), con `#DCE2D5` y tinta verde `#47563E`/`#59674F` como variaciones locales. Sin dependencias nuevas, Tailwind, GSAP, formularios duplicados ni fotografías de stock.

## Archivos

- `src/pages/seo-local.astro`: contenido, recorrido de búsqueda, explicación del trabajo, inicio, seis FAQ nativas y CTA final.
- `SearchPreview.astro`: búsqueda y mapa esquemáticos en HTML/CSS. Negocios A/B/C ficticios, sin cifras, puntuaciones ni resultados atribuibles a clientes.
- `ProfileComparison.astro`: fichas ilustrativas descuidada/cuidada. Los bloques de fotografías son esquemáticos, no capturas ni imágenes reales. No promete posiciones.
- `SeoPlans.astro`: tarjetas ordenadas por datos, listas condicionales y consultas identificadas por WhatsApp.
- `src/data/seoPlans.ts`: fuente única de configuración comercial.

## Editar planes

Cada objeto permite editar `id`, `name`, `price` (número en euros), `period`, `taxLabel`, `description`, `included`, `excluded`, `badge`, `cta`, `order` y `featured`. Las listas y etiquetas vacías no producen apartados ni relleno. Las características están deliberadamente vacías: deben completarse solo con información confirmada por el titular.

Los precios suministrados son 129 €/mes + IVA y 179 €/mes + IVA. Se formatean con Intl para español. El estilo Premium no afirma ser el plan más vendido ni recomienda prestaciones no definidas.

`getSeoPlanHref` reutiliza `site.whatsapp` e identifica el nombre actual del plan en el mensaje preparado. No envía mensajes ni implementa pagos. La explicación general del trabajo no se presenta como una lista de prestaciones de ambos planes.

## Integración y SEO

BaseLayout acepta título, descripción y JSON-LD de página, con canonical derivada de la ruta. Los valores por defecto conservan los metadatos de la home. Esta landing añade WebPage y BreadcrumbList coherentes con el contenido visible; no añade valoraciones, ofertas ni garantías a datos estructurados.

`services.ts` activa únicamente SEO local, con guardia de página existente. `site.ts` corrige su enlace de navegación a `/seo-local/`; header/footer no cambian su implementación. Diseño web y Productos siguen sin páginas publicadas: se enlaza a `/#servicios` para presentarlos, sin inventar rutas activas.

El formulario de la home no se modifica: su política y configuración de envío continúan pendientes. Las consultas de esta landing usan el WhatsApp existente y no dependen de ese bloqueo.

## Instrucciones aplicadas

Se consultaron los diez archivos de `.rules/`: arquitectura Astro, código legible, CSS local, datos e integridad comercial, componentes por responsabilidad, assets, SVG, simplicidad, fases y consistencia visual. No se encontraron AGENTS.md en el proyecto ni en los directorios superiores comprobados. No se modificó `.rules` ni `.agents`.

Skills consultados: frontend-design (heredar identidad y dar protagonismo a la comparación), impeccable (brief específico y revisión visual acotada), web-design-guidelines (semántica, foco, enlaces nativos y FAQ) y core-web-vitals (HTML inicial, fuentes locales, sin JS innecesario ni dependencias). No se delegó en agentes.

El criterio general de priorizar capturas reales se aplica a interfaces reales. Aquí el usuario pidió representaciones ilustrativas HTML/CSS, por lo que se usan esquemas rotulados. No se necesitan iconos nuevos ni se añade lucide-astro, ausente en las dependencias. El brief concreto prevalece sobre recomendaciones estéticas genéricas de las skills.

## Verificación

`node scripts/verify-seo-local.mjs <QA node_modules> <URL>` verifica HTTP 200, metadatos, un H1, esquema, enlaces reales/proyectados desde la home, consultas por teclado, URLs de WhatsApp de ambos planes, FAQ nativas, listas vacías ocultas, accesibilidad axe, responsive y overflow en 1440/1280/1024/768/430/390/375px. Comprueba también movimiento reducido y contenido sin JS. Guarda capturas e informe en `.impeccable/review/seo-local/`.

La comparación SHA-256 utiliza `protected-before.json`, capturado antes de editar, para comprobar que Hero, su motor/calibración, Servicios/Bento, Proyectos, Contacto y CSS global no cambiaron. Esa evidencia local debe conservarse para repetir la comprobación de esta entrega. La regresión visual y reversible del hero usa `scripts/verify-cinematic.mjs`.

Las métricas LCP/CLS registradas son de laboratorio local en Chromium, sin red móvil simulada: no equivalen a Core Web Vitals de producción ni incluyen INP de usuarios reales. Las consultas se prueban interceptando la navegación a WhatsApp; no se envían mensajes. No se atribuyen pruebas a Safari/Firefox ni a dispositivos físicos.

Pendiente: definir las prestaciones incluidas/excluidas de ambos planes. No existe lint configurado; se ejecutan Astro check y build.
