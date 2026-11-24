# Auditoría integral pre-lanzamiento — 7DStudio

**Fecha:** 4 de noviembre de 2026.  
**Objeto:** estado actual del repositorio `D:\7DSTUDIO\paginas-web\v2`.  
**Destino previsto:** https://7dstudio.es, LucusHost/cPanel/LiteSpeed.  
**Modalidad:** auditoría exclusivamente; no se han implementado soluciones, instalado dependencias, desplegado cambios ni enviado formularios reales.

> Las puntuaciones de este informe son valoraciones orientativas. Los resultados de Lighthouse se identifican expresamente como mediciones sintéticas locales. La revisión legal es preliminar y no constituye asesoramiento jurídico ni certificación de cumplimiento.

## A. Resumen ejecutivo

### Dictamen

**Buena base técnica y visual, pero no aconsejo publicar esta compilación como versión comercial definitiva sin cerrar la contradicción entre formularios activos y privacidad redactada como un tratamiento futuro.**

El problema principal no es que falten Astro, velocidad o funcionalidades: la web compila, genera HTML estático, permite configurar presupuestos correctamente y tiene una experiencia móvil generalmente cuidada. El mayor riesgo es de **coherencia operativa y legal**: los envíos están habilitados, pero la política de privacidad, la política de cookies, las condiciones de contratación y parte del contacto afirman que todavía no lo están.

Los datos identificativos básicos del titular **ya están completos en el código auditado**. No sería correcto repetir el diagnóstico anterior de que siguen vacíos. La existencia de `reviewed: true`, sin embargo, no demuestra por sí sola que se hayan resuelto los numerosos textos provisionales y datos de proveedores pendientes.

### Fortalezas comprobadas

- `npm run check`: **79 archivos; 0 errores, 0 advertencias y 0 hints**.
- `npm run build`: **11 páginas estáticas**, generación correcta.
- `npm audit --json`: **0 vulnerabilidades conocidas** notificadas en el árbol actual. No equivale a ausencia absoluta de vulnerabilidades.
- Las 11 páginas tienen un único H1, títulos y descripciones diferenciados y canonical HTTPS del dominio previsto.
- Sitemap XML generado, robots accesible, enlaces internos y anclas revisados sin roturas.
- HTML esencial disponible sin JavaScript; no se han encontrado islas de React/Vue ni hidratación de un framework cliente.
- Las 77 combinaciones página/ancho revisadas —11 páginas × 7 anchos— no presentan desbordamiento horizontal del documento.
- La revisión ampliada de axe A/AA encuentra **20 vistas sin infracciones automáticas y 2 con la misma incidencia del portfolio de la home** —1440 y 390 px—; véase **7D-05**. No se equipara una revisión automática con cumplimiento WCAG completo.
- Cinco ejecuciones de Lighthouse local obtienen **100 en rendimiento, accesibilidad, buenas prácticas y SEO**. No certifican cumplimiento legal, WCAG completo ni rendimiento de producción.
- Los seis formularios superan pruebas con respuestas interceptadas: validación, consentimiento, honeypot, bloqueo de dobles envíos, éxito, errores y conservación de datos.
- La calculadora supera **8.192 combinaciones numéricas** y pruebas de sus modalidades, extras, disponibilidad, acordeones, cantidades y transferencia al formulario.
- Fuentes autohospedadas, WebP, dimensiones de imagen y carga diferida en el portfolio. GSAP se carga condicionalmente y no aparece en la carga móvil medida.
- No se detecta integración de Google Analytics, GTM, publicidad ni escritura propia de cookies/localStorage/sessionStorage durante la navegación local inspeccionada.
- Las demos se distinguen de los proyectos de cliente; no se prometen posiciones garantizadas en Google.

### Riesgos principales

1. **P0:** formularios activos con información de privacidad contradictoria y textos de borrador publicados como indexables.
2. **P1:** proveedores, conservación y condiciones de tratamiento todavía sin cerrar documentalmente.
3. **P1:** nombres accesibles del portfolio que no incorporan adecuadamente su texto visible.
4. **P1:** falta validar el alojamiento real, las redirecciones, TLS, cabeceras y la recepción de consultas.
5. **P1:** las comprobaciones de regresión existentes contienen supuestos antiguos y fallan frente al estado actual.
6. **P2:** imágenes sobredimensionadas y oportunidades concretas de claridad comercial; no requieren un rediseño.

### Alcance, método y límites

Se leyeron las instrucciones de `.rules`, se inspeccionó `.agents` y se cargaron guías aplicables de SEO, accesibilidad, conversión y rendimiento. No se encontraron archivos `AGENTS.md` en el proyecto ni en sus directorios ascendentes comprobados.

Se revisaron configuración, datos compartidos, layouts, páginas, componentes principales, scripts y recursos de salida. Se ejecutaron Astro Check, compilación, auditoría de dependencias, pruebas de navegador, axe y Lighthouse usando herramientas **ya instaladas fuera de las dependencias del proyecto**.

El navegador auditó `http://127.0.0.1:4330`, sirviendo la compilación estática actual. Se utilizaron Chromium y Node 24.18.0 en Windows. Se compararon siete anchos: **1440, 1280, 1024, 768, 430, 390 y 375 px**. Las capturas generales usan movimiento reducido para estabilizar la revisión; se revisaron adicionalmente estados normales de la home y del portfolio.

Las peticiones de envío de pruebas se interceptaron **antes de salir al proveedor**. No se abrió ninguna conversación comercial, no se envió WhatsApp y no se comprobó la entrega real de correo. Los accesos externos de consulta se limitaron a documentación pública e intentos no intrusivos de HEAD/GET al dominio previsto.

Las cuatro variantes del dominio consultadas por HEAD no resolvieron desde este entorno (`EAI_AGAIN`/`ENOTFOUND`); una consulta GET adicional mediante la herramienta de lectura también falló por transporte. **Esto es una limitación de verificación, no prueba suficiente de que el dominio esté mal configurado o caído para todos los usuarios.**

### Arquitectura y preparación del artefacto

| Área | Estado observado |
|---|---|
| Framework | Astro 7.4.2; `output: 'static'`; sin adaptador de servidor necesario para esta salida |
| Lenguaje | TypeScript 6.0.3, configuración estricta de Astro |
| CSS | Tailwind 4.3.3 mediante Vite; estilos globales y abundante CSS local de componentes |
| Tipografía | Manrope Variable autohospedada, `font-display: swap`, preload del WOFF2 latino de 24.836 bytes |
| Animación | GSAP 3.15.0 y ScrollTrigger, importación dinámica condicionada en la home |
| Iconos | Lucide 1.63.0 y sprite SVG propio para QR |
| Integraciones | `@astrojs/sitemap` 3.7.4, Web3Forms mediante POST del navegador |
| Componentes | Agrupados por home, web-design, seo-local, products, about, layout, legal y ui |
| Datos | `site`, `legal`, `webPricing`, `seoPlans`, `projects`, `products`, `serviceFaqs`, `faqs`, entre otros |
| Scripts | Contacto compartido, calculadora, catálogo y proyección cinematográfica |
| Páginas | Home, diseño web, SEO local, productos, quiénes somos, FAQ, contacto y cuatro legales |
| Recursos públicos | Favicon, OG, manifest, robots y sprite; sin carpeta de demos publicadas |
| Salida medida | 54 archivos, 1.684.919 bytes en total, aproximadamente 1,61 MiB; no es el peso de una sola visita |
| Despliegue | Copiar el **contenido de `dist/`** al directorio público; no subir el repositorio completo |

La ruta real de diseño web es **`/diseno-web/`**. `/paginas-web/` devuelve 404 local y no se encontraron enlaces internos que dependan de esa ruta. No se debe presentar como una rotura interna ni crear otra página equivalente sin una decisión de URLs. Si fue una URL pública anterior, procede estudiar una redirección 301.

### Inventario SEO de las páginas

Todas las URLs siguientes responden 200 local, tienen una descripción propia y canonical autorreferente con barra final. No se detectaron saltos de nivel problemáticos en los encabezados del contenido principal. El H2 del diálogo de navegación no se considera un error de jerarquía del contenido.

| URL | Título actual | Intención y valoración |
|---|---|---|
| `/` | 7DStudio \| Diseño web, SEO local y soluciones digitales | Presentación de marca y selección de servicio; propuesta comprensible gracias al subtítulo. Conviene diferenciar su objetivo de la landing de diseño web. |
| `/diseno-web/` | Diseño web en Castellón para negocios \| 7DStudio | Buena correspondencia con contratación de diseño web local, proyectos y presupuesto. |
| `/seo-local/` | SEO local en Castellón \| 7DStudio | Intención local comercial bien resuelta mediante explicación, comparación y planes. |
| `/productos/` | Productos QR y NFC personalizados para negocios \| 7DStudio | Catálogo y consulta; no se hace pasar por comercio electrónico con compra inmediata. |
| `/quienes-somos/` | Quiénes somos \| Diseño web y soluciones digitales · 7DStudio | Confianza y conocimiento del proveedor; falta algo de identidad humana y contextualización del trabajo. |
| `/preguntas-frecuentes/` | Preguntas frecuentes sobre web, SEO Local y QR/NFC \| 7DStudio | Resuelve objeciones; 33 preguntas y organización por categorías. |
| `/contacto/` | Contacto \| Hablemos de tu proyecto · 7DStudio | Conversión; la descripción todavía anuncia un formulario pendiente de activación. |
| `/aviso-legal/` | Aviso legal \| 7DStudio | Identificación legal; mezcla datos ya completos con instrucciones provisionales. |
| `/politica-de-privacidad/` | Política de privacidad \| 7DStudio | Información RGPD; contradice el estado activo de los formularios. |
| `/politica-de-cookies/` | Política de cookies \| 7DStudio | El inventario sin analítica coincide con el código; la referencia a Web3Forms desactivado no. |
| `/condiciones-de-contratacion/` | Condiciones de contratación \| 7DStudio | Alcance comercial; conserva marcadores de borrador y condiciones pendientes. |

Los títulos comerciales tienen entre 33 y 61 caracteres. Las descripciones auditadas están aproximadamente entre 132 y 153 caracteres. No considero un fallo que un título legal sea más corto o que una descripción no llegue a 160 caracteres.

**Indexación:** las 11 URLs son indexables por defecto en esta compilación, incluidas las legales. El sitemap contiene las 11. El problema no es indexar páginas legales definitivas: es que `reviewed: true` ya ha retirado su `noindex` aunque el contenido todavía se presenta como un borrador. Se trata dentro de **7D-01**.

### Mediciones de rendimiento ejecutadas

**Lighthouse 13.6.0**, una ejecución por combinación, contra la compilación local. Móvil: viewport 412 × 823, DPR 1,75, throttling simulado, RTT 150 ms, throughput 1.638,4 Kbit/s y CPU ×4. Escritorio: viewport 1350 × 940, RTT 40 ms, throughput 10.240 Kbit/s y CPU ×1. No son medianas de varias ejecuciones ni métricas de campo.

| Página / perfil | Rendimiento | Accesibilidad | Buenas prácticas | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Home / móvil | 100 | 100 | 100 | 100 | 0,960 s | 0,960 s | 0 ms | 0 |
| Diseño web / móvil | 100 | 100 | 100 | 100 | 1,057 s | 1,057 s | 0 ms | 0 |
| SEO local / móvil | 100 | 100 | 100 | 100 | 0,904 s | 0,904 s | 0 ms | 0 |
| Productos / móvil | 100 | 100 | 100 | 100 | 0,904 s | 0,904 s | 0 ms | 0 |
| Home / escritorio | 100 | 100 | 100 | 100 | 0,252 s | 0,611 s | 0 ms | 0 |

**INP:** no medido como métrica de campo. No se infiere a partir de TBT 0 ni de la puntuación 100. Requiere uso real suficiente en CrUX/Search Console o medición de interacciones/RUM con las garantías de privacidad correspondientes.

La carga registrada por Lighthouse fue de 653.271 bytes en home móvil y 698.647 bytes en escritorio; incluye recursos recogidos durante la auditoría, no solo los estrictamente necesarios para pintar el primer viewport. Las páginas de diseño web, SEO y productos estuvieron entre 125.989 y 133.394 bytes transferidos en estas ejecuciones. Son resultados locales sujetos a caché, compresión, medición y condiciones del alojamiento final.

Lighthouse estima ahorro de imágenes de **519 KiB en home móvil y 496 KiB en escritorio**. Son estimaciones de la herramienta, no una reducción ya conseguida. El logo de 72.252 bytes se sirve a todas las páginas y tiene un margen de optimización especialmente claro. Véase **7D-08**.

Hay diagnósticos de reflow forzado y oportunidades pequeñas de CSS bloqueante, pese a TBT 0. No justifican reescribir la animación ni añadir librerías. Conviene medir de nuevo tras optimizar imágenes y en el servidor final.

## B. Puntuación por categorías

| Categoría | Nota / 10 | Justificación |
|---|---:|---|
| SEO on-page | 8 | Metadatos únicos, contenido de servicio y navegación bien planteados; mejorar diferenciación de intención y precisión de algunas expresiones. |
| SEO técnico | 7,5 | HTML estático, canonical y sitemap correctos; publicación de borradores, 404 de marca y configuración del dominio pendientes. |
| Rendimiento | 9 | Excelente laboratorio local y poco JS cliente; imágenes sobredimensionadas e INP/servidor final sin acreditar. |
| Accesibilidad | 8 | Buena semántica, foco, teclado y movimiento reducido; incidencia confirmada de etiqueta/nombre en portfolio y margen de revisión manual. |
| UX/UI | 8 | Diseño consistente, jerarquía clara, adaptación responsive cuidada; duplicado de menú y pequeños problemas de fallback. |
| Copywriting | 7,5 | Beneficios comprensibles y ausencia de promesas imposibles; quedan tecnicismos, nomenclatura antigua y mensajes provisionales. |
| Conversión | 7 | Contactos claros, portfolio y calculadora útiles; mensajes legales contradictorios y cuotas separadas del resumen final añaden fricción. |
| Seguridad | 7,5 | Sin vulnerabilidades conocidas, sin XSS identificado en entradas actuales y formularios robustos; falta acreditar dominio, panel y cabeceras. |
| Legal y privacidad | 3 | Identidad básica presente y estructura razonable; estado real del tratamiento mal explicado y varios extremos materiales pendientes. |
| Calidad del código | 7,5 | Arquitectura Astro adecuada, datos y comportamientos compartidos, tipado correcto; documentación y pruebas desactualizadas. |
| Preparación para producción | 6 | Artefacto estático válido, pero no hay cierre verificable de privacidad, infraestructura final y entrega de contactos. |

No se ha calculado una media que oculte los bloqueos. Un 100 de Lighthouse o una media alta no compensan el hallazgo P0.

## C. Hallazgos detallados

### 7D-01 — Privacidad publicada incompatible con formularios activos

- **Categoría:** legal, privacidad, conversión e indexación.
- **Severidad / prioridad:** crítica, **P0**.
- **Afecta:** formularios de las seis páginas con contacto; privacidad, cookies y condiciones.
- **Archivos y líneas aproximadas:** `src/data/legal.ts:4–11`; `src/data/site.ts:17–18`; `src/pages/politica-de-privacidad.astro:21–36, 162–190, 240`; `src/pages/politica-de-cookies.astro:33`; `src/pages/condiciones-de-contratacion.astro:60–64`; `src/components/home/Contact.astro:337–345`; `src/layouts/LegalLayout.astro:23, 34–46`.
- **Evidencia:** `reviewed` y `formsEnabled` son `true`, la identidad básica está completa y los seis formularios renderizan `action="https://api.web3forms.com/submit"`, `data-configured="true"` y botón habilitado. La política dice «Los formularios están desactivados» y que Web3Forms no está configurado. La información básica del contacto dice «todavía no activado». Las cuatro páginas legales son indexables y están en el sitemap.
- **Impacto:** el visitante recibe información materialmente falsa sobre si se recogen/transmiten sus datos; pérdida de confianza y riesgo de incumplimiento de información previa RGPD. El booleano de revisión no sustituye revisar el texto.
- **Recomendación:** antes de publicar o recoger consultas reales, cerrar la política y sus primeras capas para describir el tratamiento efectivamente activo. Si no puede cerrarse todavía, mantener los envíos suspendidos de forma coherente hasta hacerlo. No basta con quitar frases de borrador sin validar su contenido. El noindex temporal puede contener la indexación del borrador, pero no subsana la información que recibe quien usa el formulario.
- **Esfuerzo:** medio. **Confianza:** confirmado técnicamente; valoración jurídica final pendiente de profesional.

### 7D-02 — Proveedores y conservación sin concretar

- **Categoría:** legal y privacidad.
- **Severidad / prioridad:** alta, **P1**.
- **Afecta:** política de privacidad y operación del servicio.
- **Archivos y líneas:** `src/data/legal.ts:14–17`; `src/pages/politica-de-privacidad.astro:74–77, 122–140, 150–167, 183–203`.
- **Evidencia:** proveedor de hosting, proveedor de correo y calendario de conservación vacíos; aparecen «…», «pendiente de definir» y descripciones futuras. Se declara ubicación España sin documentación de la configuración del alojamiento aportada en el repositorio. El usuario indica LucusHost como alojamiento previsto; el código todavía no lo identifica como proveedor.
- **Impacto:** no se puede comprobar que la información de destinatarios, encargados, conservación y transferencias corresponda al tratamiento real. El email de contacto no acredita quién procesa el buzón ni sus condiciones.
- **Recomendación:** inventariar el hosting realmente contratado, correo receptor, cuenta/plan Web3Forms, contratos de encargo y regiones; documentar criterios de conservación por finalidad. Verificar las garantías aplicables a transferencias internacionales. No fijar plazos arbitrarios ni rellenar campos no aplicables con datos ficticios.
- **Esfuerzo:** medio. **Confianza:** ausencias confirmadas; suficiencia jurídica y contratos pendientes de comprobar.

### 7D-03 — Condiciones operativas de continuidad y baja todavía abiertas

- **Categoría:** contratación y transparencia económica.
- **Severidad / prioridad:** alta, **P1**.
- **Afecta:** condiciones, mantenimiento mensual y relación comercial.
- **Archivos y líneas:** `src/pages/condiciones-de-contratacion.astro:66–70, 91–95, 151–176`; `src/data/legal.ts:18–21`; `src/data/webPricing.ts:23–36`; `src/data/serviceFaqs.ts:31–38`.
- **Evidencia:** subsisten marcadores para validez del presupuesto, aceptación, titularidad/renovación del dominio y procedimiento de baja. Pagos, revisiones y cancelaciones remiten genéricamente a «Según contrato o acuerdo previo». Los tres meses gratis no especifican aquí su fecha de inicio. El límite no acumulable y el alcance de la modificación mensual se explican en FAQ, no con el mismo detalle en las condiciones compartidas de presupuesto. «19 €/mes» no lleva una precisión fiscal inmediata propia, aunque el bloque general sí avisa de IVA no incluido.
- **Impacto:** dudas sobre cuándo empieza la cuota, qué ocurre al marcharse, control del dominio y alcance de los cambios. No se ha demostrado un cobro indebido; es un riesgo de información y de futura contratación.
- **Recomendación:** acordar por escrito inicio del periodo gratuito, tratamiento del IVA de la cuota, titularidad/traslado del dominio, baja, facturación, alcance y no acumulación de cambios. Reflejar lo aprobado de forma consistente en la oferta y el contrato. No inventar permanencia, penalizaciones ni derechos de propiedad. Es especialmente necesario antes de aceptar contrataciones o cobrar; una consulta no es una contratación.
- **Esfuerzo:** medio. **Confianza:** omisiones confirmadas; condiciones definitivas pendientes de validación comercial/jurídica.

### 7D-04 — Alcance de varias páginas descrito como una sola página

- **Categoría:** calculadora y copywriting.
- **Severidad / prioridad:** media, **P1**.
- **Afecta:** modalidad de 750 € y FAQ de diseño web.
- **Archivos y líneas:** `src/data/webPricing.ts:49–52`; `src/data/serviceFaqs.ts:43–46`.
- **Evidencia:** la modalidad de varias páginas incluye 5 páginas, pero su lista contiene «Servicios e información de tu negocio en una página». La FAQ compartida sigue llamándola «web corporativa», mientras la selección usa «Web de varias páginas».
- **Impacto:** ambigüedad sobre lo contratado y dificultad para comparar las dos opciones.
- **Recomendación:** corregir únicamente la descripción y unificar la nomenclatura visible con el alcance de 5 páginas ya configurado. Conservar ID `corporate`, precio, compatibilidades y fórmulas.
- **Esfuerzo:** bajo. **Confianza:** confirmado.

### 7D-05 — El nombre accesible del portfolio no coincide con el texto visible

- **Categoría:** accesibilidad WCAG 2.2 AA, criterio 2.5.3 de nivel A.
- **Severidad / prioridad:** alta, **P1**.
- **Afecta:** catálogo horizontal de proyectos de la home.
- **Archivo y líneas:** `src/components/ui/ProjectCatalogue.astro:27–57`.
- **Evidencia:** las tarjetas enlazadas de TAPNOVA y PSICOINFANTIL tienen `aria-label="Explorar demo de …"`, pero incluyen más texto visible dentro del enlace. Axe ejecutado sobre el portfolio tras entrar en la sección y Lighthouse señalan `label-content-name-mismatch` en ambas. Evidencia en `functional.json` y los informes Lighthouse de home.
- **Impacto:** dificulta activarlas mediante control por voz y crea una discrepancia entre lo que se ve y lo que anuncia la tecnología de apoyo.
- **Recomendación:** aprovechar el nombre nativo del enlace o asociarlo al texto visible con un patrón adecuado; preservar la advertencia de nueva pestaña sin reemplazar indebidamente la etiqueta visible. Repetir la prueba después de hacer scroll, no solo en la vista inicial.
- **Esfuerzo:** bajo. **Confianza:** confirmado. El 100 de accesibilidad de Lighthouse no invalida esta incidencia; ese audit no reduce necesariamente su puntuación global.

### 7D-06 — Sin JavaScript, el header móvil tapa las migas de pan

- **Categoría:** responsive y mejora progresiva.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** al menos diseño web y SEO local sin JS a 390 px.
- **Archivos y líneas:** `src/styles/global.css:227–233`; `src/components/layout/Header.astro:185–225, 331–338`.
- **Evidencia:** el header sin mejora JS mide **248,75 px**, pero `--header-height` queda en **164 px**. En diseño web y SEO las migas están entre y=184 e y=220, enteramente bajo el header fijo. El H1 no queda tapado en las mediciones realizadas; no se afirma lo contrario.
- **Impacto:** pérdida de navegación contextual y compensación insuficiente de algunas anclas en el fallback.
- **Recomendación:** resolver la reserva de espacio del menú fallback con CSS/layout, sin depender exclusivamente del `ResizeObserver` de JavaScript. Comprobar anclas y primer contenido a 375–430 px sin JS.
- **Esfuerzo:** bajo/medio. **Confianza:** confirmado; `focused-checks.json` contiene las coordenadas.

### 7D-07 — «Inicio» duplicado en el menú móvil

- **Categoría:** UX y navegación.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** todas las páginas al abrir el menú móvil.
- **Archivos y líneas:** `src/components/layout/Header.astro:6–16`; `src/data/site.ts:22–29`.
- **Evidencia:** `mobileNavigation` antepone Inicio y después copia una navegación que ya lo incluye. Se verificaron dos enlaces consecutivos a `/` en el diálogo de las 11 páginas.
- **Impacto:** redundancia visible, un tabulador adicional y sensación de falta de revisión.
- **Recomendación:** una única fuente de navegación sin duplicar la entrada inicial. Mantener el diálogo, Escape, restauración de foco y el tamaño táctil existentes, que funcionan.
- **Esfuerzo:** bajo. **Confianza:** confirmado.

### 7D-08 — Imágenes mucho mayores que su presentación

- **Categoría:** rendimiento móvil y recursos.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** header/footer, portfolio y símbolo decorativo de servicios.
- **Archivos y líneas:** `src/components/layout/Header.astro:24–29, 161–164`; `src/components/layout/Footer.astro:11–16, 59–62`; `src/components/ui/ProjectCatalogue.astro:36–43`; `src/components/web-design/WebProjects.astro:77–84`; `src/data/projects.ts:31, 41, 51`.
- **Evidencia:** logo 1600 × 531, 72.252 bytes, mostrado a 168–240 px; proyectos de unos 2700–2900 px, entre 112.034 y 160.426 bytes, mostrados en tarjetas sin `srcset`. Lighthouse estima 519 KiB de ahorro en imágenes para home móvil. El símbolo de servicios también sirve 512 × 573 para una visualización pequeña.
- **Impacto:** tráfico innecesario en todas las páginas por el logo y mayor descarga al entrar en portfolio. La lazy loading reduce la prioridad, pero no ajusta la resolución.
- **Recomendación:** generar variantes responsivas con la infraestructura de Astro ya instalada y tamaños adecuados a cada uso. Mantener las proporciones, alt y lazy loading correctos. No convertir por sistema todos los recursos a AVIF ni alterar la fotografía del hero, que ya pesa aproximadamente 50 KiB.
- **Esfuerzo:** bajo/medio. **Confianza:** confirmado; el ahorro exacto final requiere medir la nueva salida, no asumir la estimación de Lighthouse.

### 7D-09 — El resumen final no recuerda la cuota recurrente

- **Categoría:** UX, CRO y transparencia de presupuesto.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** resumen sticky y resumen móvil de la calculadora.
- **Archivo y líneas:** `src/components/web-design/WebCalculator.astro:101–130, 234–273` aproximadamente.
- **Evidencia:** el bloque izquierdo explica 3 meses gratis y 19 €/mes obligatorios. El resumen de la derecha —o posterior en móvil— muestra precio inicial, extras, IVA y aviso orientativo, pero no la cuota. Captura `calculator-summary-390.png` y texto en `focused-checks.json`. Las condiciones sí se incorporan al mensaje/formulario solicitado.
- **Impacto:** al revisar solo el resumen final puede perderse de vista que existe un coste recurrente. No se trata de una ocultación total: la información está disponible antes en la configuración.
- **Recomendación:** recordatorio breve de la cuota separado del importe inicial, sin sumarla al desarrollo ni repetir todos los textos. Mantener claramente diferenciados pago inicial y servicio mensual.
- **Esfuerzo:** bajo. **Confianza:** disposición confirmada; efecto en abandono o comprensión probable, sin medición de usuarios.

### 7D-10 — Pruebas de regresión obsoletas

- **Categoría:** calidad y preparación para producción.
- **Severidad / prioridad:** alta, **P1**.
- **Afecta:** automatización de contacto y SEO; parte de scripts de etapas anteriores.
- **Archivos y líneas:** `scripts/verify-web3forms.mjs:43, 55–59`; `scripts/verify-seo-local.mjs:57, 64`; `scripts/verify-header.mjs:48–50`; `scripts/verify.mjs:44–60`.
- **Evidencia ejecutada:** `verify-web3forms` falla porque exige que el botón siga deshabilitado, aunque ahora está activo. `verify-seo-local` falla porque exige cero formularios, aunque hay uno. Además presupone seis FAQ donde ahora hay siete. Por lectura, otros scripts buscan navegación por anclas o nombres de botones ya sustituidos.
- **Impacto:** no existe una señal de regresión fiable si se confunden supuestos antiguos con fallos de la aplicación. Arreglar solo la primera aserción del test Web3Forms tampoco basta: su fixture añade otra `access_key` cuando ya existe una.
- **Recomendación:** actualizar los tests al contrato funcional aprobado, conservando interceptación obligatoria de todos los envíos y separando escenarios activo/inactivo. No adaptar la aplicación para satisfacer pruebas de una fase antigua. Incorporar un punto de ejecución de QA documentado; no se exige instalar un framework nuevo.
- **Esfuerzo:** medio. **Confianza:** confirmado por ejecución y lectura. Las pruebas actuales de auditoría sí han comprobado el comportamiento activo sin envíos externos.

### 7D-11 — Configuración real de producción no acreditada

- **Categoría:** despliegue, SEO técnico y seguridad.
- **Severidad / prioridad:** alta como puerta de lanzamiento, **P1**.
- **Afecta:** dominio, LucusHost, cPanel y LiteSpeed.
- **Archivos:** `astro.config.mjs:5–9`; `README.md:15`; no se encontró configuración de cabeceras/redirecciones del servidor dentro del artefacto revisado.
- **Evidencia:** Astro genera el dominio canónico correcto, pero eso no implementa redirecciones HTTP/HTTPS ni www. Las consultas HEAD a las cuatro variantes no pudieron resolver el dominio desde el entorno auditor. No se pudo inspeccionar el certificado, compresión, HSTS, CSP, caché ni respuestas del servidor final.
- **Impacto:** riesgo todavía no descartado de versiones duplicadas, configuración TLS/caché incorrecta o comportamiento distinto al preview.
- **Recomendación:** validar desde una red con acceso al dominio: certificado, redirección hacia una sola variante HTTPS, barras finales, 404 real, Brotli/gzip, caché de `_astro` y cabeceras. Definir CSP compatible con los scripts inline y `connect-src` de Web3Forms, preferiblemente probada antes en Report-Only. No imponer una política restrictiva sin probarla ni activar HSTS de larga duración a ciegas.
- **Esfuerzo:** medio. **Confianza:** pendiente de verificar. **No se declara un fallo confirmado de LucusHost ni del DNS.**

### 7D-12 — Falta validar el último tramo de recepción y protección del proveedor

- **Categoría:** formularios, seguridad operativa y conversión.
- **Severidad / prioridad:** alta como comprobación de lanzamiento, **P1**.
- **Afecta:** Web3Forms y buzón receptor.
- **Archivos y líneas:** `src/data/site.ts:5, 14–18`; `src/scripts/contact-form.ts:12–36`.
- **Evidencia:** se confirma el envío HTTP del lado cliente con simulaciones y manejo correcto de respuestas. No se ha accedido al panel Web3Forms, verificado destinatario, cuota, restricciones de dominio, antispam del proveedor ni recepción de un correo. La clave del formulario es pública por diseño; **no se considera un secreto filtrado**.
- **Impacto:** un formulario visualmente correcto todavía puede fallar por configuración de cuenta, límites o entrega. La validación y honeypot del cliente no demuestran protección efectiva frente a peticiones construidas fuera del navegador.
- **Recomendación:** comprobar configuración y restricciones del proveedor, bandeja de entrada/spam, notificaciones de límite y política de datos. Tras cerrar privacidad, realizar una prueba real explícitamente autorizada y confirmar recepción. No hace falta añadir un captcha que cargue terceros antes de justificarlo.
- **Esfuerzo:** bajo/medio. **Confianza:** pendiente de verificar; no se ha observado spam ni una pérdida real de consultas.

### 7D-13 — Recuperación de errores 404 sin experiencia propia

- **Categoría:** UX y despliegue.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** accesos a URLs inexistentes o antiguas.
- **Archivos:** no existe `src/pages/404.astro` ni `dist/404.html` en la compilación auditada.
- **Evidencia:** `/ruta-inexistente-auditoria/` devuelve 404 en preview; no hay página estática de marca para trasladar a cPanel. El comportamiento visual exacto de producción dependerá del servidor.
- **Impacto:** pérdida de oportunidades cuando un visitante llega desde un enlace equivocado, sin una salida comercial útil.
- **Recomendación:** una 404 sencilla con enlaces reales a servicios/contacto y respuesta HTTP 404. Confirmar `ErrorDocument` o configuración equivalente del hosting. No redirigir todas las URLs inexistentes a Inicio con 200.
- **Esfuerzo:** bajo. **Confianza:** ausencia del artefacto confirmada; respuesta final pendiente de servidor.

### 7D-14 — Intención de la home poco diferenciada de la landing web

- **Categoría:** SEO on-page y arquitectura comercial.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** home, diseño web y quiénes somos.
- **Archivos y líneas:** `src/data/site.ts:9–10`; `src/components/home/Hero.astro:50–57`; `src/pages/diseno-web.astro:134–156`; `src/pages/quienes-somos.astro:90–112`.
- **Evidencia:** la home enumera diseño web, SEO local y soluciones digitales; diseño web ya dispone de una URL local y comercial más concreta. Quiénes somos vuelve a utilizar diseño web en su título, pero aporta poca identidad personal. No hay datos de Search Console ni SERP que permitan demostrar canibalización.
- **Impacto:** oportunidad de asignar mejor la captación de marca/general a Inicio y las consultas de contratación local a cada landing.
- **Recomendación:** mantener `/diseno-web/` como destino principal de «diseño web en Castellón» y variantes empresariales, `/seo-local/` para posicionamiento local y la home para la marca y oferta conjunta. Revisar textos de enlaces desde contexto, sin crear páginas por localidades ficticias ni repetir Castellón en cada encabezado.
- **Esfuerzo:** bajo/medio. **Confianza:** oportunidad probable; **canibalización no confirmada**.

### 7D-15 — Schema de negocio local básico, sin identidad completa

- **Categoría:** datos estructurados y SEO local.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** JSON-LD común a todas las páginas.
- **Archivo y líneas:** `src/layouts/BaseLayout.astro:20–38`.
- **Evidencia:** se genera `ProfessionalService` con nombre, URL, teléfono y `areaServed`, pero sin dirección estructurada, imagen identificativa ni un `@id` estable que permita enlazar entidades. Los datos básicos del titular ya están en otra fuente. Los JSON-LD se parsean correctamente; **no se ha demostrado que sean sintácticamente inválidos**.
- **Impacto:** menor precisión para relacionar la entidad y sus páginas; posibles carencias de elegibilidad en validadores específicos de negocio local.
- **Recomendación:** validar el tipo apropiado al negocio real y añadir solo datos comerciales públicos y confirmados; no confundir domicilio fiscal con establecimiento abierto al público. Evitar horarios, perfiles sociales o valoraciones inventados. Utilizar Rich Results Test/Schema Validator después de publicar.
- **Esfuerzo:** bajo/medio. **Confianza:** campos ausentes confirmados; elegibilidad externa pendiente.

### 7D-16 — Tecnicismos que pueden dificultar comparar el servicio SEO

- **Categoría:** copywriting y conversión.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** prestaciones y aclaraciones de los planes SEO.
- **Archivos y líneas:** `src/data/seoPlans.ts:33–40, 88`; `src/data/serviceFaqs.ts:94–99` aproximadamente.
- **Evidencia:** se utilizan «SEO On-Page», «URL optimizada al mes» y «Alt de imágenes». Hay explicaciones próximas que ayudan, pero el visitante debe traducir parte del lenguaje técnico para comparar el alcance.
- **Impacto:** más esfuerzo de comprensión para el público no técnico y percepción de una diferencia de precio poco tangible.
- **Recomendación:** encabezar con la tarea reconocible —mejoras en una página existente al mes— y dejar el término técnico como aclaración opcional. Conservar los límites reales de una página, accesos y directorios; no prometer primeras posiciones.
- **Esfuerzo:** bajo. **Confianza:** lenguaje confirmado; mejora comercial probable, sin experimento de conversión.

### 7D-17 — La sección «Quiénes somos» explica principios, no quién atiende

- **Categoría:** confianza y CRO.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** quiénes somos y credibilidad de los contactos.
- **Archivo y líneas:** `src/pages/quienes-somos.astro:105–160, 165–177, 285–296` aproximadamente.
- **Evidencia:** la página desarrolla claridad, diseño, utilidad, servicios y proceso. La persona responsable aparece en los textos legales/contacto, no en la presentación del estudio. Hay dos proyectos clasificados como cliente y una demo, pero las fichas explican sobre todo el sector y no el trabajo concreto realizado.
- **Impacto:** quien compara proveedores sabe qué se ofrece, pero obtiene pocas señales sobre quién responderá y qué experiencia relevante puede comprobar.
- **Recomendación:** incorporar identidad profesional y forma de atención confirmadas; ampliar uno o dos casos con problema, alcance y resultado observable. Pedir autorización de publicación. No inventar equipo, antigüedad, testimonios, estadísticas ni resultados de negocio.
- **Esfuerzo:** medio. **Confianza:** contenido observado confirmado; impacto comercial probable.

### 7D-18 — Manifest con iconos inexistentes

- **Categoría:** recursos y pulido de producción.
- **Severidad / prioridad:** baja, **P3**.
- **Afecta:** `site.webmanifest` y posibles usos de instalación.
- **Archivo y líneas:** `public/site.webmanifest:10–27`; `src/layouts/BaseLayout.astro:49–58`.
- **Evidencia:** las tres URLs `/assets/7dstudio/icon-192x192.png`, `/assets/7dstudio/icon-512x512.png` y `/assets/7dstudio/icon-maskable-512x512.png` devuelven 404 y no existen en `public`. El layout no enlaza el manifest, por lo que no son errores de carga en la navegación ordinaria auditada.
- **Impacto:** artefacto incoherente si se habilita o utiliza la instalación; no bloquea el sitio informativo actual.
- **Recomendación:** decidir si se necesita manifest. Si se conserva, enlazar únicamente recursos existentes y adecuados; si no, retirar el artefacto obsoleto en una futura tarea autorizada. No convertir por ello la web en una PWA ni añadir service worker sin necesidad.
- **Esfuerzo:** bajo. **Confianza:** confirmado.

### 7D-19 — Documentación operativa que describe etapas anteriores

- **Categoría:** mantenimiento y calidad de código.
- **Severidad / prioridad:** baja, **P3**.
- **Afecta:** documentación de arranque, decisiones y fuente de datos de proyectos.
- **Archivos y líneas:** `README.md:3, 51–60, 73`; `src/data/projects.ts:1–3`; `src/components/home/Contact.md:13–15`.
- **Evidencia:** README sigue describiendo Geist, ausencia de email, proyectos vacíos, páginas legales por crear y antiguo fallback de WhatsApp. El código usa Manrope, dispone de datos de contacto, proyectos, páginas legales y formularios activos. También hay comentarios de proyectos que dicen que no existen capturas, aunque se importan inmediatamente después.
- **Impacto:** un futuro mantenimiento puede desactivar funciones válidas, confiar en una prueba antigua o seguir instrucciones de despliegue incompletas.
- **Recomendación:** actualizar exclusivamente el estado vigente, separar historial de decisiones y describir la activación real de formularios. Mantener la documentación histórica como tal, sin usarla como prueba del estado actual.
- **Esfuerzo:** bajo. **Confianza:** confirmado.

### 7D-20 — Conversión e indexación sin línea base verificable

- **Categoría:** medición y oportunidades de negocio.
- **Severidad / prioridad:** media, **P2**.
- **Afecta:** toma de decisiones después del lanzamiento.
- **Archivos/evidencia:** no se encontró integración de GA/GTM ni analítica cliente; no se proporcionó acceso a Search Console, datos de contactos ni informe CrUX. Esto coincide con la política de cookies y **no es por sí mismo un error de privacidad o de implementación**.
- **Impacto:** no puede determinarse qué página genera consultas, si el CTA convierte o si hay consultas orgánicas con impresiones sin clics. Tampoco se puede asegurar canibalización ni CWV reales.
- **Recomendación:** verificar Search Console y sitemap, y definir una línea base sencilla de consultas por canal/servicio. Si se decide medir eventos como solicitud de presupuesto, clic en WhatsApp y formulario aceptado, evaluar primero la solución y su base legal. No enviar nombre, email ni mensaje a una herramienta de analítica; no instalar GA ni un banner sin necesidad justificada.
- **Esfuerzo:** bajo/medio. **Confianza:** ausencia de evidencia confirmada; configuración externa de Search Console pendiente de confirmar.

### Comprobaciones funcionales y comerciales sin fallo aritmético

La calculadora está en `/diseno-web/`, no en `/paginas-web/`. Se verificó el siguiente contrato:

| Modalidad / extra | Importe y regla comprobados |
|---|---|
| Una página | 400 € iniciales, 1 página incluida, IVA no incluido |
| Varias páginas | 750 € iniciales, 5 páginas incluidas, IVA no incluido |
| Rediseño / a medida | Total nulo en datos; «A medida» en interfaz, sin precio cerrado ficticio |
| Páginas adicionales | 90 €/página, 0–20, solo varias páginas; normaliza negativos, decimales y excesos |
| Catálogo | 150 €, una página/varias páginas |
| Otro idioma | 80 €, una página/varias páginas |
| Galería / portfolio | 80 €, una página/varias páginas |
| Blog | 150 €, solo varias páginas |
| Reservas externas | 75 €, una página/varias páginas |
| Logotipo | 50 €, una página/varias páginas |
| Mejora de fotografías | 50 €, una página/varias páginas |
| Fotografías profesionales | 150 €, una página/varias páginas |

Resultados adicionales:

- Los importes se calculan en céntimos y el desglose coincide con el total.
- Al cambiar modalidad se eliminan selecciones incompatibles; no se arrastran cargos ocultos.
- Contenido empieza abierto; los otros grupos cerrados. Es posible cerrar todos y solo se mantiene uno abierto.
- Los extras conservan su selección al cerrar/abrir el grupo; los contadores reflejan tipos de extra, no unidades de páginas.
- Las listas de incluidos cambian por modalidad; los detalles no dependen de hover.
- El mantenimiento no incrementa el precio inicial. Hosting/dominio y cuota se presentan separados de extras.
- Se muestran 3 meses gratis, después 19 €/mes y continuidad obligatoria si se conserva alojamiento/gestión con 7DStudio. Una modificación mensual y SEO aparte están descritos; los límites y condiciones pendientes se tratan en 7D-03.
- El resumen se transfiere a `budget_summary` y a los enlaces de WhatsApp solo tras solicitarlo; no se envía automáticamente.
- La limpieza y el reset retiran el presupuesto aplicado; se mantienen las opciones de consulta personalizada.
- El resumen es sticky en escritorio con margen de header y estático después de las opciones en móvil; no se añade un resumen flotante intrusivo.

**Formularios:** las seis ubicaciones usan el helper compartido, `FormData`, `Accept: application/json`, timeout de 20 segundos, estado de carga, feedback accesible y comprobación estricta de éxito. Los errores HTTP, de API, JSON inválido y red conservan los datos. Los datos del proveedor no se insertan como HTML. La prueba no acredita la recepción de correo ni la configuración antispam del proveedor.

**WhatsApp y teléfono:** las URLs locales de contacto son coherentes, los enlaces externos revisados usan `noopener noreferrer` y las consultas se preparan sin envío automático. La apertura/entrega en aplicaciones móviles reales queda pendiente.

### Evaluación visual, accesibilidad y código: qué conservar

- **No recomiendo un rediseño completo.** La tipografía protagonista, colores por servicio, divisores y espacios producen una identidad reconocible, no una colección de componentes inconexos. Las ilustraciones de productos están identificadas como composiciones ilustrativas.
- La home tiene una dirección visual propia con el portátil y su transición. En móvil se evita cargar GSAP; no hay datos que justifiquen retirarlo por defecto.
- Los formularios tienen labels visibles, campos opcionales identificados, consentimiento sin marcar y errores no destructivos. No añadir pasos, cuentas o campos obligatorios sin una necesidad real.
- Se comprobó apertura/cierre del menú, Escape, restauración de foco y navegación del catálogo con teclado. El catálogo admite desplazamiento táctil sin abrir accidentalmente el proyecto en el script existente ejecutado.
- No se han detectado imágenes sin `alt` ni sin dimensiones. Los `alt=""` decorativos son apropiados; no deben convertirse en relleno de palabras clave.
- La existencia de controles de 18 px no se ha declarado automáticamente como incumplimiento de target size: radios y checkboxes tienen labels y áreas asociadas, y los enlaces inline tienen excepciones aplicables. WCAG 2.2 AA no equivale a exigir 44 px para cualquier elemento.
- El movimiento reducido está presente en CSS y en el comportamiento del hero/catálogo. Falta validación con lectores de pantalla y otros motores; no se certifica WCAG completo con axe.
- Hay componentes largos —Contacto, unas 904 líneas; SEO local, unas 878—, pero gran parte es CSS/markup específico. Su tamaño no demuestra un error ni justifica una fragmentación indiscriminada.
- `innerHTML` del hero copia HTML estático controlado o construye depuración con números y restricciones de desarrollo. Los datos de formulario se escriben con `textContent`. No se encontró un flujo actual confirmado de entrada de usuario a ejecución HTML/JS.
- La `.env` está excluida de Git; el `.env.example` no contiene secretos privados. La clave Web3Forms pública no se ha contabilizado como fuga de credenciales. No se ha realizado un escaneo exhaustivo de todo el historial Git.

### Alternativas concretas de copywriting

Son recomendaciones para una futura intervención, no cambios aplicados. Cuando dependen de un proveedor o condición no confirmada, deben validarse antes de usarse.

| Texto actual | Problema | Alternativa recomendada | Justificación comercial |
|---|---|---|---|
| «Los formularios están desactivados» | Contradice los botones y el POST activo. | «Usamos los datos que nos facilites para responder a tu consulta y, si lo solicitas, preparar un presupuesto. El envío se procesa mediante Web3Forms.» | Explica la acción real y la finalidad. Debe acompañarse de responsable, conservación y demás información aprobada; no sustituye toda la política. |
| «Envío por Web3Forms previsto, todavía no activado» | Hace dudar de si se puede contactar. | «Tu consulta se envía mediante Web3Forms. Puedes ejercer tus derechos a través del contacto indicado en nuestra política de privacidad.» | Elimina una objeción artificial sin simular que el correo ya se recibió. |
| Meta de Contacto: «formulario pendiente de activación» | Mensaje desactualizado que puede aparecer en buscadores. | «Consulta tu proyecto de diseño web, SEO local o productos QR/NFC. Contacta con 7DStudio por teléfono, WhatsApp o formulario.» | Coincide con los canales disponibles y ofrece un siguiente paso claro. |
| Varias páginas: «Servicios e información de tu negocio en una página» | Contradice el alcance de 5 páginas. | «La información de tu negocio organizada en las 5 páginas incluidas.» | Ayuda a entender por qué cuesta más sin alterar el precio ni el alcance. |
| «¿Qué diferencia hay entre una web de una página y una web corporativa?» | Nomenclatura distinta a la calculadora. | «¿Qué diferencia hay entre una web de una página y una web de varias páginas?» | Facilita reconocer y comparar la modalidad elegida. |
| «URL optimizada al mes» | Exige conocer qué significa URL/optimización. | «Una página de tu web mejorada cada mes.» | Traduce el servicio a una tarea reconocible; mantener cerca el alcance técnico y los permisos necesarios. |
| «Optimización SEO On-Page de 1 página al mes» | Beneficio poco tangible para quien no conoce SEO. | «Mejoras mensuales en una página existente de tu web para ayudar a Google a entenderla.» | Explica el trabajo sin garantizar posicionamiento ni aumentar el alcance. |
| Resumen: «Precio inicial orientativo · desarrollo y extras» | Correcto, pero no recuerda el coste posterior. | Mantener el título y añadir separado: «Mantenimiento: 3 meses gratis; después, 19 €/mes, obligatorio si sigues con tu web alojada y gestionada por 7DStudio.» | Evita sorpresas en el punto de decisión sin sumar cuotas al pago inicial. Confirmar cómo debe indicarse su IVA. |
| «Lo digital debería hacerte las cosas más fáciles.» | Buena filosofía, poca información sobre quién atiende. | Conservar el titular y añadir una presentación profesional real del responsable y su forma de trabajar. | Añade confianza verificable sin sustituir una frase útil por un eslogan genérico ni inventar un equipo. |

No propongo repetir Castellón en todos los H1, multiplicar CTA de WhatsApp, introducir urgencia artificial ni prometer un número de clientes. La mejora más importante de copy es eliminar contradicciones y concretar el servicio, no escribir más texto.

## D. Tabla de prioridades

Dentro de cada prioridad se ordena primero el riesgo/impacto y, cuando es comparable, el menor esfuerzo. Los controles pendientes se distinguen de fallos confirmados.

| Prioridad | ID | Actuación | Impacto | Esfuerzo | Confianza |
|---|---|---|---|---|---|
| **P0** | 7D-01 | Alinear formularios activos, privacidad, primera capa y estado de los borradores | Muy alto | Medio | Confirmado |
| **P1** | 7D-02 | Cerrar inventario de proveedores, conservación y garantías de tratamiento | Alto | Medio | Ausencias confirmadas; validación pendiente |
| **P1** | 7D-05 | Corregir etiqueta/nombre accesible en enlaces del portfolio | Alto | Bajo | Confirmado |
| **P1** | 7D-04 | Corregir descripción de las 5 páginas y nomenclatura visible | Medio/alto | Bajo | Confirmado |
| **P1** | 7D-03 | Concretar continuidad, IVA de cuota, dominio, cambios y baja | Alto | Medio | Omisiones confirmadas; aprobación pendiente |
| **P1** | 7D-12 | Verificar panel, destinatario y protección del proveedor; luego prueba real autorizada | Alto | Bajo/medio | Pendiente |
| **P1** | 7D-11 | Validar dominio, HTTPS, redirecciones, caché y cabeceras en LucusHost | Alto | Medio | Pendiente |
| **P1** | 7D-10 | Actualizar regresiones que todavía esperan formularios desactivados o inexistentes | Alto | Medio | Confirmado |
| **P2** | 7D-08 | Reducir logo y servir variantes responsivas de portfolio | Alto en descarga | Bajo/medio | Confirmado |
| **P2** | 7D-09 | Recordar el coste recurrente junto al resumen inicial | Medio/alto | Bajo | Disposición confirmada; efecto probable |
| **P2** | 7D-07 | Eliminar Inicio duplicado en menú móvil | Medio | Bajo | Confirmado |
| **P2** | 7D-06 | Corregir reserva del header sin JS | Medio | Bajo/medio | Confirmado |
| **P2** | 7D-13 | Crear/verificar recuperación 404 con estado HTTP correcto | Medio | Bajo | Ausencia confirmada; servidor pendiente |
| **P2** | 7D-16 | Traducir tecnicismos SEO a tareas reconocibles | Medio | Bajo | Probable mejora |
| **P2** | 7D-15 | Completar entidad estructurada con datos comerciales confirmados | Medio | Bajo/medio | Ausencias confirmadas |
| **P2** | 7D-14 | Diferenciar objetivos de home y landings; comprobar consultas en Search Console | Medio | Bajo/medio | Probable; no canibalización demostrada |
| **P2** | 7D-20 | Establecer línea base de indexación, consultas y rendimiento de campo | Alto a medio plazo | Bajo/medio | Evidencia externa pendiente |
| **P2** | 7D-17 | Añadir presentación humana y casos con alcance concreto autorizado | Medio | Medio | Probable mejora |
| **P3** | 7D-19 | Actualizar README/comentarios y separar documentación histórica | Medio en mantenimiento | Bajo | Confirmado |
| **P3** | 7D-18 | Resolver o descartar manifest con iconos inexistentes | Bajo | Bajo | Confirmado |

## E. Quick wins: las 10 mejores relaciones impacto/esfuerzo

1. **Cerrar las frases de estado del formulario**, después de confirmar la información jurídica: privacidad, primera capa de contacto, cookies, condiciones y meta de Contacto deben describir una misma realidad. No es solo un cambio cosmético. **7D-01**.
2. **Retirar el reemplazo incorrecto del nombre accesible de las tarjetas** y volver a probar con el portfolio visible. **7D-05**.
3. **Corregir la descripción de la modalidad de 5 páginas** y reutilizar «varias páginas» en la FAQ, sin tocar las reglas. **7D-04**.
4. **Redimensionar el logo compartido**, conservando su apariencia y una variante adecuada a pantallas de alta densidad. Afecta a todas las páginas. **7D-08**.
5. **Añadir una línea de cuota recurrente al resumen**, separada del precio inicial. **7D-09**.
6. **Eliminar el segundo Inicio del menú móvil.** **7D-07**.
7. **Comprobar en el panel Web3Forms destinatario, límites y restricciones de dominio**; no necesita rediseñar formularios. **7D-12**.
8. **Verificar HTTPS y una única variante del dominio en cPanel/LiteSpeed**, una vez disponible el acceso. **7D-11**.
9. **Sustituir «URL optimizada» por una explicación reconocible** y conservar los límites reales del servicio. **7D-16**.
10. **Actualizar las dos aserciones de estado antiguas y sus fixtures**, y documentar una regresión que siempre intercepte los envíos. **7D-10**.

Los quick wins no sustituyen completar conservación/proveedores ni las condiciones de continuidad. Se prioriza rapidez solo cuando no elimina una comprobación necesaria.

## F. Roadmap recomendado

### 1. Antes de publicar

**Responsable del negocio / asesoría:**

- Resolver 7D-01 y 7D-02: tratamiento actual, destinatarios, conservación, contratos y transferencias aplicables. Confirmar si registro/autorización resultan aplicables; no tratarlos como obligatorios universales.
- Aprobar condiciones económicas y de baja de 7D-03. Aclarar la fiscalidad de la cuota de 19 €, fecha de inicio y límites del cambio mensual. Mantener intactos los importes aprobados.
- Confirmar derechos de publicación de proyectos y recursos. La auditoría no acredita autorizaciones ni la titularidad fiscal de los datos aportados.

**Desarrollo:**

- Corregir 7D-04 y 7D-05, ambos acotados y de bajo esfuerzo.
- Recuperar una batería de tests actualizada y segura, 7D-10.
- Incluir, si entra en la ventana de lanzamiento, el duplicado de navegación y el recordatorio económico. No retrasar los bloqueos por un rediseño.

**Hosting / operación:**

- Verificar 7D-11 en el dominio y configuración final, no solo en preview.
- Verificar 7D-12 en el proveedor. Solo después del cierre legal y con autorización específica, una consulta real de prueba y confirmación de recepción. No ejecutada en esta auditoría.
- Subir solo `dist/`; comprobar que `.env`, `.git`, herramientas, informe de auditoría y evidencias no se publican por error.

**Criterio de salida:** cero contradicciones materiales sobre el tratamiento, contacto receptor comprobado, URLs/SSL verificados y pruebas de regresión actuales sin envíos externos accidentales.

### 2. Primera semana después del lanzamiento

- Validar cobertura, canonical elegida y sitemap en Search Console. Inspeccionar Inicio, Diseño Web y SEO Local.
- Repetir Lighthouse/PageSpeed en producción con varias ejecuciones y comprobar cabeceras, caché y compresión reales. No comparar un único laboratorio local con una muestra de campo como si fueran equivalentes.
- Reducir logo/portfolio y medir transferencia con la misma configuración antes/después, 7D-08.
- Resolver recuperación 404 y comprobar cualquier redirección desde URLs anteriores, 7D-13.
- Comprobar Safari/iOS y Android físico: menú, teclado, formularios, WhatsApp, teléfono, acordeones y sticky.
- Revisar consultas recibidas y causas reales de error sin registrar indiscriminadamente mensajes personales en analítica.

### 3. Primer mes

- Revisar consultas/impressions/CTR por landing y ajustar el mapa de intención, 7D-14.
- Completar schema con datos comerciales adecuados, 7D-15; validar externamente sin prometer rich results.
- Simplificar el lenguaje técnico de planes, 7D-16, y mejorar presentación humana/casos, 7D-17.
- Evaluar comprensión de los costes inicial/recurrente con usuarios representativos, no solo con personas técnicas.
- Obtener datos de INP, LCP y CLS reales si existe volumen suficiente. CrUX puede no tener muestra suficiente en un sitio recién lanzado.

### 4. Mejoras futuras

- Casos de estudio útiles y autorizados que expliquen decisiones y resultados observables, sin métricas inventadas.
- Contenido que responda a preguntas comerciales reales de las consultas recibidas; evitar blog de relleno o páginas masivas por localidades.
- Revisar la deuda de documentación y archivos provisionales, 7D-18/19.
- Considerar experimentos de CTA solo cuando exista volumen de tráfico útil. Una web pequeña no necesita un sistema complejo de A/B testing para corregir problemas evidentes.
- No introducir chatbot, captcha externo, PWA, más animaciones o nuevas dependencias sin un problema medido que lo justifique.

## G. Comprobaciones pendientes y evidencias

### Matriz de verificación

| Comprobación | Resultado / límite |
|---|---|
| Astro Check y build | Ejecutados y correctos |
| Auditoría de dependencias | Ejecutada, 0 vulnerabilidades conocidas; sin `npm audit fix` |
| 11 rutas generadas y HTML estático | Confirmadas |
| Sitemap / robots / canonical | Generados y comprobados localmente; envío/lectura en Search Console pendiente |
| Enlaces internos y anclas | Sin roturas en lo revisado |
| Recursos solicitados por las páginas | Sin respuestas fallidas registradas en las vistas auditadas |
| Manifest | Tres referencias inexistentes confirmadas; no enlazado por el layout |
| 404 | Estado 404 correcto en preview; sin página estática propia; servidor final pendiente |
| Responsive | 11 páginas × 7 anchos, sin overflow horizontal del documento |
| Axe | Revisión final ampliada A/AA: 20 vistas sin infracciones y 2 de home con label/name mismatch; reproducción adicional tras entrar en portfolio confirma los mismos 2 enlaces |
| Teclado | Menú/Escape/restauración de foco, acordeones y catálogo comprobados; no prueba exhaustiva de todas las combinaciones de tecnología de apoyo |
| Formulario | Seis ubicaciones, éxito y errores simulados, ningún envío real |
| Calculadora | 8.192 combinaciones numéricas más flujos interactivos; sin error de suma detectado |
| Lighthouse | 5 ejecuciones locales conservadas, 100 en las cuatro categorías medidas |
| INP real | No medido; no hay acceso a RUM/CrUX suficiente |
| Cookies/almacenamiento | Sin cookies ni claves propias de storage durante navegación local; sin Google Analytics/GTM en código revisado |
| Banner/rechazo de cookies | No existe; no es una carencia demostrada mientras no haya tecnologías no exentas. Verificar infraestructura final antes de añadir o descartar consentimiento |
| HTTPS, www, DNS, cabeceras, caché LucusHost | No verificados: el dominio no resolvió desde el entorno auditor |
| Entrega Web3Forms / bandeja de entrada | Pendiente; prohibido enviar comunicaciones reales en esta auditoría |
| Google Search Console / Business Profile | Sin acceso; no se acredita configuración ni resultados |
| Google Analytics | No integrado; añadirlo no es requisito de lanzamiento por sí mismo |
| Jurisprudencia/validez del contrato concreto | Fuera de una auditoría técnica; requiere revisión profesional |

### Qué necesita navegador adicional o dispositivos reales

- Safari/WebKit y Firefox, además de Chromium.
- VoiceOver/NVDA/TalkBack, control por voz y zoom de usuario.
- Prueba completa de foco no oculto por header/barra inferior, especialmente con teclado virtual.
- Comportamiento de `details` exclusivos, restauración tras volver atrás y orientación horizontal.
- Apertura real de aplicaciones de teléfono/WhatsApp sin enviar mensajes.

### Qué necesita acceso a producción y paneles

- DNS desde varias redes, certificado, cadena de redirecciones HTTP/HTTPS/www y status de URLs sin barra.
- Configuración cPanel/LiteSpeed: cabeceras, CSP compatible, HSTS prudente, compresión, caché de assets con hash y comportamiento de errores.
- Inspeccionar cookies/Set-Cookie y terceros realmente cargados por la infraestructura final.
- Panel Web3Forms: destinatario, dominio permitido, cuotas, antispam, integraciones, conservación y contratos.
- Configuración de correo y gestión de consultas. No se atribuyen aquí requisitos DNS propios del dominio a un servicio que pueda enviar usando la infraestructura de Web3Forms sin comprobar cómo está configurado.
- Rich Results Test y Schema Validator. `ProfessionalService` sin más campos no se ha etiquetado como JSON inválido; hay que distinguir sintaxis de elegibilidad.

### Qué necesita confirmación jurídica o comercial

- Revisión material de los textos aunque `legal.reviewed` esté a `true`.
- Identidad y condiciones de todos los encargados realmente utilizados, documentación de transferencias y conservación adecuada por finalidad.
- Aplicabilidad de inscripción registral, autorizaciones o DPO: no son requisitos universales.
- Tratamiento fiscal de la cuota recurrente, inicio de los meses gratuitos, titularidad de dominio, baja, cambios no acumulables y alcance de revisión/entrega.
- Garantías/condiciones de productos personalizados y derechos del consumidor según la contratación concreta. No confundir ausencia de checkout con ausencia de obligaciones al contratar por otros canales.
- Autorizaciones de portfolio y licencias de recursos. La licencia SIL OFL de Manrope está en el paquete instalado; comprobar su correcta conservación/distribución en el artefacto o metadatos. No se ha acreditado una infracción de licencia.

### Evidencias locales entregadas

Directorio: **`.impeccable/review/prelaunch-20261104/`**. Está ignorado por Git y no forma parte de `dist/`.

- `browser.json`: metadatos, H1/encabezados, esquemas, imágenes, enlaces, anchos, resultados axe, menú, errores y almacenamiento de las 11 páginas.
- `functional.json`: resultados de los seis formularios interceptados, 8.192 casos de cálculo, interacciones, accesibilidad del portfolio y recursos del manifest.
- `accessibility-expanded.json`: revisión final de las 11 páginas en 1440 y 390 px, incluyendo expresamente las etiquetas A y AA de WCAG 2.0, 2.1 y 2.2 disponibles en axe. Complementa el conjunto inicial más limitado de etiquetas de `browser.json`; sus resultados ampliados son los utilizados en este informe.
- `focused-checks.json`: geometría del header/migas sin JS y texto del resumen de presupuesto.
- `assets.json`: inventario de archivos compilados, tamaños y estimación de tamaño gzip por archivo.
- `production-head.json`: intentos de HEAD a las cuatro variantes del dominio y errores de resolución observados.
- `lighthouse-summary.json`: configuración, métricas y resultados por ejecución.
- `lighthouse-home-mobile`, `lighthouse-home-desktop`, `lighthouse-diseno-web-mobile`, `lighthouse-seo-local-mobile`, `lighthouse-productos-mobile`: informes completos en **JSON y HTML**.
- Capturas `home`, `diseno-web`, `seo-local`, `productos`, `quienes-somos`, `preguntas-frecuentes`, `contacto`, en 1440 y 390 px; `nojs-seo-390.png` y `calculator-summary-390.png`.
- `integrity.json`: comprobación final de integridad de los archivos protegidos durante la auditoría.

Las capturas de página completa pueden mostrar placeholders de imágenes lazy antes de entrar en esas secciones. Eso no se ha contabilizado como imagen rota: se revisaron también navegación/scroll y peticiones de recursos.

**Scripts existentes ejecutados:**

```text
npm run check
npm run build
npm audit --json
node scripts/verify-project-links.mjs <QA node_modules> http://127.0.0.1:4330
node scripts/verify-web3forms.mjs <QA node_modules>
node scripts/verify-seo-local.mjs <QA node_modules> http://127.0.0.1:4330
```

El de enlaces de proyectos pasa en 390 y 1440 px. Los dos últimos fallan por los supuestos obsoletos descritos en 7D-10. Se ejecutaron además comprobaciones de auditoría externas al código fuente, con Playwright/axe/Lighthouse ya disponibles. No se ha ejecutado `--generate-og`, `npm audit fix`, ninguna instalación ni ningún despliegue.

### Referencias de revisión

- LSSI-CE, especialmente información del prestador y tecnologías de almacenamiento: https://www.boe.es/eli/es/l/2002/07/11/34/con
- RGPD: información, conservación, encargados y transferencias; artículos 5, 13, 28 y 44 y siguientes: https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807
- LOPDGDD: https://www.boe.es/eli/es/lo/2018/12/05/3/con
- Normativa de consumidores y usuarios, según contratación y destinatario: https://www.boe.es/eli/es/rdlg/2007/11/16/1/con
- Guía de cookies AEPD: https://www.aepd.es/guias/guia-cookies.pdf
- Web3Forms: https://web3forms.com/privacy y https://web3forms.com/dpa, consultados en esta auditoría; documentación con fecha 13 de julio de 2026. Describe a Web3Creative como encargado, operación desde India, subencargados e infraestructura multirregión. No demuestra qué contratos/configuración tiene la cuenta de 7DStudio.

### Conclusión final

**Conservar la arquitectura, el diseño general y la lógica comercial. Corregir primero la información de tratamiento real, cerrar las condiciones pendientes y verificar la operación de producción.** La base no necesita reconstruirse: las mejoras con mayor retorno están en coherencia, confianza, accesibilidad puntual, recursos responsivos y una validación de lanzamiento reproducible.

No se ha aplicado ninguna de las soluciones recomendadas.
