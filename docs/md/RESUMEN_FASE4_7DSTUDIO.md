# Fase 4 — Preparación para producción y condiciones confirmadas

Fecha: 4 de noviembre de 2026. Proyecto: `D:\7DSTUDIO\paginas-web\v2`.
Referencias: auditoría integral y resúmenes de las fases 1, 2 y 3.

## 1. Cambios aplicados

### Accesibilidad

- `.whatsapp-widget` queda dentro de un `aside` con nombre «Contacto por WhatsApp».
  Se corrige el aviso `region` sin cambiar el enlace, sus atributos, hooks de
  presupuesto, CSS, apariencia ni comportamiento.
- La regresión general ahora considera `region` un fallo, además de las reglas
  WCAG y `label-content-name-mismatch`: no se oculta el aviso anterior.

### Preparación técnica y SEO

- Astro conserva salida estática y dominio `https://7dstudio.es`; se explicita
  `trailingSlash: 'always'`, coherente con rutas y canonicals existentes.
- Se completan los metadatos Twitter con título, descripción e imagen existentes.
- La comprobación adicional detectó el canonical de la 404 como `/404/`. Se fija
  explícitamente a `/404.html`, el archivo generado, manteniendo `noindex`.
- Se prepara `public/.htaccess` para Apache 2.4/LiteSpeed: redirecciones al HTTPS
  sin www, tratamiento de `index.html` explícito, 404 local, caché diferenciada,
  compresión de texto y cabeceras de seguridad. **No se ha aplicado al servidor.**
- No se activan HSTS ni CSP. No se añade PWA, service worker, analítica ni captcha.
- Se incluye en `public/manrope-OFL.txt` una copia exacta de la licencia de la
  fuente autohospedada ya instalada. No se sustituye la tipografía ni se eliminan
  otros avisos de licencia.
- Se documentan supuestos, límites y comprobaciones del hosting en
  `docs/produccion-lucushost.md`. Se actualiza la referencia de la 404.

### Condiciones comerciales expresamente confirmadas

La petición posterior autoriza estos cambios concretos en contratación, como
excepción a la restricción inicial de no tocar textos legales/comerciales:

- Hosting y dominio sin coste adicional mientras se mantenga el servicio.
- Dominio siempre a nombre del cliente, que conserva su titularidad.
- Tres meses gratuitos desde la publicación de la web.
- Desde el cuarto mes, **19 €/mes + IVA**, obligatorio solo mientras la web siga
  alojada y gestionada por 7DStudio; separado del desarrollo inicial.
- Una modificación sencilla mensual no acumulable; SEO local aparte.
- Sin permanencia obligatoria.
- Derecho a recibir los archivos, contenidos y trabajos abonados y la información
  necesaria para cambiar de proveedor, respetando las licencias de terceros.
  Dejar el mantenimiento no supone perder los trabajos abonados.

Se actualizan `webCare`, `webCareTerms` y `webMaintenanceScope` y se añade
`webOwnership` en la fuente compartida `src/data/webPricing.ts`. La calculadora,
las FAQ de Diseño Web, la página general de FAQ y el presupuesto preparado para
contacto reutilizan estos datos. Se retiran los pendientes ya resueltos sobre
inicio del periodo gratuito, IVA y titularidad, sin inventar bajas, preavisos,
penalizaciones, plazos o procedimientos de traslado.

Los detalles de propiedad/entrega/cancelación figuran en contratación; las FAQ
resumen lo relevante. **No se cambian importes, compatibilidades ni fórmulas.**
`publicationReady: false` permanece intacto: confirmar estas condiciones no
equivale a aprobar jurídicamente el conjunto de la web.

### Archivos modificados o añadidos

- `src/components/layout/WhatsAppWidget.astro`.
- `src/layouts/BaseLayout.astro`.
- `src/pages/404.astro`.
- `astro.config.mjs`.
- `src/data/webPricing.ts`.
- `src/data/serviceFaqs.ts`.
- `src/data/faqs.ts`.
- `src/pages/condiciones-de-contratacion.astro` — solo secciones 7, 10, 11 y la
  parte inicial de la 12; reglas de desistimiento y demás apartados intactos.
- `public/.htaccess` — nuevo.
- `public/manrope-OFL.txt` — copia del paquete instalado.
- `scripts/verify.mjs` — aserción del aviso `region`.
- `scripts/verify-production.mjs` — nueva comprobación local.
- `scripts/README.md`.
- `docs/produccion-lucushost.md` — nuevo.
- `docs/404-servidor.md`.
- `RESUMEN_FASE4_7DSTUDIO.md` — este documento.

## 2. Resultados de pruebas

- `npm run check`: **102 archivos; 0 errores, 0 advertencias, 0 hints**.
- `npm run build`: correcto; **13 páginas estáticas**.
- Regresión existente: **15 scripts PASS**, incluidos seis formularios
  interceptados, **8.192 casos numéricos** de calculadora, 56 vistas responsive,
  112 vistas de header con/sin JS, enlaces, teclado, táctil y ciclo cinematográfico.
- QA adicional: **13 rutas SEO, 28 vistas axe/responsive y 42 recursos locales**.
  Incluye Inicio, Diseño Web, FAQ y contratación a 1440, 1280, 1024, 768, 430,
  390 y 375 px; sin overflow ni violaciones axe detectadas en esas vistas.
- Widget: región semántica, visibilidad por breakpoint, foco, enlace, nueva pestaña
  y apertura con destino interceptado. Ningún mensaje real a WhatsApp.
- Revisados títulos/descripciones únicos, H1, canonical HTTPS autorreferente,
  Open Graph/Twitter, imágenes sociales, JSON-LD parseable, estado de indexación,
  sitemap, robots y recursos. OG principal existente: **1200 × 630 px**.
- Las cuatro legales pendientes, demo y 404 siguen con `noindex`. Las legales y
  demos no entran en el sitemap; Contacto sigue incluido. Robots permite rastreo
  para que se pueda leer `noindex`; no se usa como control de acceso.
- La 404 local conserva HTTP 404 para URLs inexistentes simples, anidadas y con
  extensión. **No acredita todavía el estado HTTP del hosting real.**
- Verificada copia de `.htaccess` y licencia, MIME de recursos locales revisados y
  ausencia de archivos privados, informes, fuentes de código y mapas en `dist/`.
- Comparación SHA-256/de código: datos numéricos, funciones de cálculo, configuración
  y componentes de formularios, otras páginas legales, datos legales,
  `publicationReady`, paquetes y demos intactos. CSS y enlace del widget idénticos.
  Dentro de contratación se preservan los otros apartados y el desistimiento.
- Detector de diseño: solo avisos preexistentes del widget —radio, colores y tamaño
  tipográfico respecto a `DESIGN.md`—. No se rediseña el componente para silenciarlos.

Comandos de navegador, con herramientas ya instaladas fuera del proyecto:

```powershell
node scripts/verify-regression.mjs C:\Users\PC-user\AppData\Local\Temp\opencode\7d-qa\node_modules http://127.0.0.1:4330
node scripts/verify-production.mjs C:\Users\PC-user\AppData\Local\Temp\opencode\7d-qa\node_modules http://127.0.0.1:4330
```

Evidencia local: `.impeccable/review/phase4/` (`before.json`, `scope.json`,
`production.json`, copia de `regression.json` y capturas). Los scripts existentes
mantienen también sus carpetas habituales de salida. Se reutilizó el preview local.
Pruebas en Chromium; no se certifica accesibilidad integral ni otros navegadores.

## 3. Archivos preparados para producción

- **Contenido de `dist/`**, incluidas las carpetas `_astro/` y `demos/`, páginas,
  recursos existentes, `robots.txt`, `sitemap-index.xml`, sitemap de URLs, `404.html`,
  licencias y el archivo oculto `.htaccess`.
- El `.htaccess` prepara caché de un año/immutable solo para archivos existentes
  bajo `_astro/`; un día para otros assets; HTML/XML/TXT con revalidación.
  No se activa LSCache de página completa ni se instala un plugin.
- Se solicita DEFLATE para formatos de texto, sin recomprimir imágenes/fuentes.
  Brotli, `Vary` y la compresión efectiva dependen del servidor y deben medirse.
- Cabeceras: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` y
  `Permissions-Policy`. Sin HSTS ni CSP restrictiva.

**No subir el repositorio**, `.env*`, `.git`, dependencias, `src`, herramientas,
evidencias, informes, backups ni archivos de desarrollo. No se ha creado ni
enviado un paquete al hosting. Copiar `dist/` no autoriza publicar antes del cierre legal.

## 4. Configuración pendiente en LucusHost

1. Confirmar cuenta/plan contratado, document root, permisos de `.htaccess`,
   compatibilidad Apache 2.4/LiteSpeed y módulos/directivas admitidos.
2. Certificado válido para ambos hosts antes de redirigir. Confirmar HTTPS en origen;
   si existe proxy/CDN, adaptar con el proveedor la detección del esquema para
   evitar bucles. No confiar en cabeceras de proxy arbitrarias.
3. Combinar las reglas con el `.htaccess` real tras backup, sin sobrescribirlo a
   ciegas; evitar duplicar redirecciones de cPanel. Revisar AutoSSL y sus retos.
4. Verificar HTTP/www → HTTPS sin www, rutas/query, barra final, `index.html`, MIME,
   404 real, cabeceras en 200/301/404, caché, 304, gzip/Brotli y `Vary`.
5. Validar cuenta Web3Forms: destinatario, dominio permitido, cuota, filtros antispam,
   contratos y conservación; buzón y recepción. No se ha accedido al panel.
6. Verificar Search Console, lectura del sitemap y datos estructurados externamente.
   JSON-LD parseable no acredita elegibilidad de resultados enriquecidos ni
   configuración completa de la entidad de negocio local.

No hay Apache/LiteSpeed disponible aquí para ejecutar una prueba de sintaxis.
**Astro preview no interpreta `.htaccess`: las reglas preparadas no se presentan
como configuración de servidor ya validada.** Ver procedimiento y comandos en
`docs/produccion-lucushost.md`.

## 5. Checklist final de publicación

- [x] Código estático compilado, regresiones y QA local ejecutados.
- [x] Condiciones comerciales confirmadas reflejadas en la fuente compartida.
- [x] Pendientes legales siguen identificados, con `publicationReady: false`.
- [x] Configuración de hosting y exclusiones preparadas/documentadas, sin aplicar.
- [ ] Cerrar los puntos jurídicos, de proveedores y de operación con el titular/asesoría.
- [ ] Obtener aprobación expresa de publicación; no cambiar el indicador editorial
      simplemente para retirar advertencias o pasar pruebas.
- [ ] Confirmar licencias/autorizaciones de todos los recursos y proyectos publicados.
- [ ] Backup, certificado, document root y revisión de reglas con LucusHost.
- [ ] Compilar de nuevo y repetir QA sobre el artefacto exacto autorizado.
- [ ] Subir solo `dist/`, incluyendo archivos ocultos, cuando se autorice.
- [ ] Comprobar en el dominio real las respuestas y cabeceras descritas, móvil,
      escritorio y otros motores/dispositivos, sin soft-404 ni bucles.
- [ ] Solo con privacidad cerrada y autorización específica, probar un envío real
      y confirmar recepción. Las simulaciones actuales no prueban entrega.
- [ ] Verificar Search Console y monitorizar errores tras la publicación.

## 6. Bloqueos y revisiones todavía abiertos

**Jurídicos/comerciales:** proveedores y contratos de tratamiento; transferencias
y conservación efectiva; correo receptor, WhatsApp y medidas operativas; aplicabilidad
de registros/autorizaciones/DPO; contratación con consumidores, desistimiento y
documentación correspondiente; validez/aceptación de presupuestos; pagos, vencimientos,
anticipos si existen, revisiones de desarrollo y mecanismo de finalización/traslado;
reclamaciones y mecanismos extrajudiciales. No se inventan procedimientos de baja
ni plazos de preaviso para completar estos pendientes.

Ya **no** quedan como decisiones comerciales desconocidas el IVA de los 19 €/mes,
el inicio de los tres meses gratuitos, la titularidad del dominio, la ausencia de
permanencia y la entrega de trabajos abonados. Su redacción y encaje con el contrato
completo siguen sujetos a revisión jurídica; esta fase no certifica cumplimiento.

**Técnicos/operativos:** servidor, TLS, redirecciones/caché/compresión/cabeceras reales,
compatibilidad de `.htaccess`, controles del proveedor y recepción de correo, otros
motores y tecnologías de apoyo. Los controles antispam del cliente —consentimiento,
honeypot, validación y bloqueo de duplicados— son eludibles: no equivalen a protección
del servidor. No se ha declarado la protección de datos validada.

Se mantiene la recomendación de **no publicar ni recoger consultas reales hasta
cerrar los bloqueos legales y operativos** de las fases anteriores. No se han
instalado dependencias, desplegado cambios, enviado formularios reales ni modificado
DNS o cPanel. La preparación es local y queda lista para su validación en el hosting
cuando se autorice, no para publicar automáticamente.
