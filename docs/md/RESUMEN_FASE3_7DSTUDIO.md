# Fase 3 — Correcciones técnicas finales

Fecha: 4 de noviembre de 2026. Referencias: `AUDITORIA_7DSTUDIO.md`,
`RESUMEN_FASE1_7DSTUDIO.md` y `RESUMEN_FASE2_7DSTUDIO.md`.

## Correcciones

| Objetivo | Cambio |
|---|---|
| Accesibilidad de Servicios | Los enlaces de `ServiceCard.astro` utilizan su nombre nativo, sin un `aria-labelledby` limitado al título ni una etiqueta que reemplace su contenido visible. Los artículos no enlazados conservan su asociación al título. Se mantienen textos, destinos, estilos y comportamiento. |
| **7D-06** | El header móvil sin mejora JS pasa al flujo normal. La compensación `--header-height` es cero en ese estado; con JS se mantiene fijo y medido por `ResizeObserver`. No se usa una estimación de la altura del menú fallback. |
| **7D-10** | Las pruebas actuales verifican navegación entre páginas, diálogo móvil, formularios activos/inactivos, prestaciones y siete FAQ de SEO, selección de plan en el formulario y portfolio con proyectos publicados. Se corrigen destinos antiguos de Servicios y proyección. El fixture Web3Forms sustituye la clave existente en vez de añadir otra. |
| **7D-13** | Nueva 404 editorial con mensaje claro, Inicio, Servicios y Contacto. Reutiliza layout, tipografía, botones, cabecera y pie; incluye `noindex`. Astro genera `dist/404.html`. |
| **7D-18** | Confirmados los tres iconos ausentes. Se elimina únicamente el manifest obsoleto no enlazado; se conserva el favicon existente. No se añade PWA ni service worker. |

Se revisaron `.rules`, `.agents` y las instrucciones relevantes antes de analizar
código. No se encontró `AGENTS.md` en el proyecto ni en los ascendentes
comprobados. Se conservaron los cambios previos del repositorio.

## Archivos de aplicación y documentación

- `src/components/services/ServiceCard.astro`.
- `src/components/layout/Header.astro` — solo regla CSS del fallback móvil.
- `src/styles/global.css` — compensación del header móvil.
- `src/pages/404.astro` — nuevo.
- `public/site.webmanifest` — eliminado por desuso, con tres recursos ausentes.
- `docs/404-servidor.md` — configuración y comprobaciones futuras del alojamiento.
- `scripts/README.md` — requisitos, seguridad y punto de ejecución de QA.
- `RESUMEN_FASE3_7DSTUDIO.md` — este documento.

## Scripts

Actualizados:

- `scripts/verify.mjs`.
- `scripts/verify-header.mjs`.
- `scripts/verify-web3forms.mjs`.
- `scripts/verify-form.mjs`.
- `scripts/verify-contact.mjs`.
- `scripts/verify-seo-local.mjs`.
- `scripts/verify-projects.mjs`.
- `scripts/verify-project-links.mjs`.
- `scripts/verify-service-links.mjs`.
- `scripts/verify-services-bento.mjs`.
- `scripts/verify-services-glow.mjs`.
- `scripts/verify-projected-links.mjs`.
- `scripts/verify-cinematic.mjs` — protección de red y selección del título real no enlazado: las tarjetas ahora navegan a páginas publicadas. Se conservan las comprobaciones de geometría, entrega y reversa.

Nuevos:

- `scripts/qa-browser.mjs` — contextos de navegador con red cerrada por defecto.
- `scripts/verify-calculator.mjs` — regresión numérica y de interacción.
- `scripts/verify-static.mjs` — artefacto 404, recursos, sitemap, legales pendientes y manifest.
- `scripts/verify-regression.mjs` — ejecución agrupada con resultado y código de salida.

## Seguridad y alcance

Todos los contextos del runner bloquean peticiones distintas de GET/HEAD y la
red externa antes de navegar. Los mocks explícitos de Web3Forms y destinos
de proyectos tienen prioridad y responden localmente; no se envían consultas
reales. Se bloquean service workers únicamente en los contextos de QA.

Los tests activos no significan que la privacidad esté aprobada: las limitaciones
de la fase 2 siguen vigentes. No se cambia `publicationReady` ni la activación
de formularios para satisfacer pruebas antiguas.

La instantánea SHA-256 inicial y la comparación de alcance comprueban que no
se modifican páginas/layouts legales, datos compartidos, precios, condiciones,
fórmulas, scripts de cálculo/contacto, configuración/componentes de formularios,
demos, paquetes ni configuración de Astro. Se verifica además el `noindex` de las
cuatro páginas legales pendientes, su exclusión del sitemap y la conservación
de Contacto y de la exclusión de demos.

## Pruebas y evidencias

- `npm run check`: 101 archivos; 0 errores, advertencias y hints.
- `npm run build`: correcto; 13 páginas estáticas, incluida la 404 y la demo existente.
- Responsive: ocho rutas por siete anchos —1440, 1280, 1024, 768, 430, 390 y 375 px—, sin overflow horizontal.
- Axe en móvil/escritorio; Servicios y portfolio comprobados después de hacer scroll.
- Header: **112 vistas** —ocho rutas × siete anchos × con/sin JS—, menú, Escape, restitución del foco, migas, skip link y ancla de Contacto correctos.
- Seis formularios: estado activo, fixtures inactivas, consentimiento, email, honeypot, bloqueo de duplicados, payload sin clave duplicada, éxito, errores y conservación de datos. Respuestas interceptadas.
- Calculadora: **8.192 casos numéricos**, modalidades, extras, compatibilidades, totales, acordeones, persistencia, transferencia de presupuesto y limpieza correctos.
- Portfolio, tarjetas completas de Servicios, enlaces proyectados, teclado, táctil, hover, movimiento reducido y ciclo cinematográfico comprobados. Las pruebas esperan al estado real de los controles tras el scroll, no a un intervalo arbitrario.
- 404 local: rutas inexistentes simple, anidada y con extensión conservan HTTP 404 y la página personalizada, sin redirección a Inicio. Recursos locales y exclusión del sitemap verificados.
- Capturas revisadas de Servicios y 404 en móvil/escritorio y del header móvil con/sin JS.

Medición específica de Diseño Web y SEO Local, idéntica en ambas páginas:

| Ancho | JS: fin header / inicio migas | Sin JS: fin header / inicio migas |
|---|---|---|
| 375 px | 84 / 104 px | 249 / 269 px |
| 390 px | 84 / 104 px | 249 / 269 px |
| 430 px | 84 / 104 px | 185 / 205 px |

Las migas quedan 20 px por debajo de la cabecera en las doce vistas medidas.

**Regresión final: 15 scripts, todos PASS**, ejecutados con:

```powershell
node scripts/verify-regression.mjs C:\Users\PC-user\AppData\Local\Temp\opencode\7d-qa\node_modules http://127.0.0.1:4330
```

Se reutilizó el preview local existente de este proyecto. Los fallos de las
primeras ejecuciones eran expectativas/sincronización obsoletas de los tests;
se corrigieron en los scripts, sin adaptar la aplicación a contratos antiguos.
La ejecución final completa y la matriz de header quedan registradas en
`.impeccable/review/phase3/regression.json` y `header.json`.

Evidencia local: `.impeccable/review/phase3/` (`before.json`, `scope.json`,
`ui.json`, `header.json`, `calculator.json`, `static.json`, `manifest.json`,
`regression.json`, `breadcrumbs.json` y capturas). Las pruebas específicas mantienen también sus
carpetas anteriores, con resultados actuales.

## Pendientes y límites

1. **404 en producción:** no se ha desplegado ni modificado el servidor. Hay
   instrucciones para `ErrorDocument 404 /404.html` en `docs/404-servidor.md`.
   Tras configurar LucusHost/LiteSpeed hay que comprobar con GET que las URLs
   inexistentes devuelven HTTP 404, no 200 ni una redirección. El preview local
   no acredita la configuración del alojamiento real.
2. **Aviso axe fuera del alcance:** `region` para `.whatsapp-widget` en escritorio.
   Se registra aparte en `ui.json`; no se oculta ni se presenta como corregido.
3. **Detector de diseño:** señala discrepancias preexistentes entre `DESIGN.md`
   y los estilos actuales —Manrope, radios, tamaños y colores—. La 404 nueva no
   introduce avisos en esa ejecución. No se modifica el diseño para resolver
   documentación histórica ajena a esta fase.
4. Se mantienen los pendientes legales, comerciales, de proveedores, recepción
   real de correo e infraestructura de las fases anteriores. No se certifican
   WCAG completo, cumplimiento jurídico ni condiciones de producción. Las
   pruebas de navegador se ejecutaron en Chromium; quedan pendientes otros
   motores, dispositivos físicos y tecnologías de apoyo.
5. `verify-seal.mjs` se conserva como prueba histórica de un componente que ya
   no está montado en la home; no se considera una regresión de la aplicación
   actual. El runner y su alcance vigente están documentados.

No se han instalado dependencias ni realizado despliegues.
