# Verificación técnica

Requisitos: Node compatible con el proyecto y una instalación **ya disponible**
de Playwright, Chromium y `@axe-core/playwright`. Las herramientas QA no forman
parte del bundle. No hace falta añadir dependencias a la web.

```powershell
npm run check
npm run build
# Reutilizar el preview local existente si sirve este proyecto; si no:
npm run preview -- --host 127.0.0.1 --port 4330
```

En otra terminal, con la carpeta real de las herramientas:

```powershell
node scripts/verify-regression.mjs "C:\ruta\qa\node_modules" http://127.0.0.1:4330
```

También se puede ejecutar individualmente cualquiera de los scripts del runner
con los mismos argumentos. El runner devuelve código distinto de cero si falla
alguna prueba y guarda sus resultados en `.impeccable/review/phase3/regression.json`.
Las capturas y JSON de pruebas específicas mantienen sus carpetas de evidencia.
Ejecutar contra la compilación estática actual, no contra artefactos antiguos.

## Contrato actual

- Navegación entre páginas; menú móvil mediante diálogo hasta 1023 px.
- Header en el flujo sin JS en móvil, fijo al mejorar con JS; anclas accesibles.
- Tres tarjetas de Servicios enlazadas a sus páginas publicadas.
- Portfolio con proyectos existentes y demo de Huella; no se exige estado vacío.
- SEO con formulario, siete FAQ y prestaciones reales de los dos planes.
- Los CTA de planes seleccionan un plan en el formulario; no abren WhatsApp.
- Seis formularios actualmente activos. Los tests verifican el estado técnico,
  **no autorizan publicación ni acreditan aprobación jurídica**. Se prueban
  por separado fixtures de navegador inactivas y escenarios activos.
- Respuestas simuladas de Web3Forms: éxito, errores y validación. Se sustituye
  la clave existente por una ficticia, sin duplicarla. Nunca se envían correos.
- `qa-browser.mjs` bloquea las peticiones no GET/HEAD y la red externa antes de
  navegar. Solo los mocks explícitos tienen prioridad. Service workers bloqueados.
- 404 personalizada local con HTTP 404; configuración final del servidor pendiente
  según `docs/404-servidor.md`. No hay PWA, manifest enlazado ni service worker.

El runner cubre responsive, axe A/AA y etiqueta visible/nombre accesible,
menú/teclado/anclas, formularios, calculadora (8.192 combinaciones), proyectos,
tarjetas, efectos de hover y ciclo de vida de la proyección cinematográfica.
Los avisos de mejores prácticas fuera de WCAG y de la incidencia de nombres
accesibles se registran por separado, no se ocultan.

Los scripts de sello (`verify-seal.mjs`) son comprobaciones históricas de un
componente que no está en la home actual; no son una puerta de lanzamiento.
Las pruebas específicas de símbolo/encabezados conservadas pueden ejecutarse
para cambios de esas superficies, pero no sustituyen esta regresión.

## Preparación de producción y condiciones confirmadas

Después del runner existente, ejecutar:

```powershell
node scripts/verify-production.mjs "C:\ruta\qa\node_modules" http://127.0.0.1:4330
```

Comprueba metadatos/JSON-LD de las trece páginas, recursos sociales y locales,
las condiciones compartidas, los seis formularios sin envío, el widget de
WhatsApp con axe/teclado y cuatro rutas a siete anchos. Revisa la copia del
`.htaccess`, la licencia de Manrope y la ausencia de archivos privados en
`dist/`. Guarda evidencia en `.impeccable/review/phase4/`.

**No prueba las reglas de Apache/LiteSpeed ni sustituye las comprobaciones
del servidor:** Astro preview no interpreta `.htaccess`. La configuración y
los pendientes están en `docs/produccion-lucushost.md`.
