# Preparación para LucusHost / cPanel / LiteSpeed

**No se ha desplegado ni aplicado ninguna regla al servidor. No publicar mientras
estén pendientes la revisión legal/comercial y las comprobaciones operativas.**

## Artefacto

1. Ejecutar `npm run check`, `npm run build` y las regresiones de `scripts/README.md`.
2. Revisar `docs/md/RESUMEN_FASE4_7DSTUDIO.md` y los pendientes con el titular.
3. La salida es estática: subir **solo el contenido de `dist/`**, no la carpeta
   contenedora ni el repositorio. No se necesita Node, PHP, `npm install` ni un
   adaptador Astro en el hosting para servir esta web.
4. `public/.htaccess` se copia a `dist/.htaccess` durante la compilación. Mostrar
   archivos ocultos al preparar el paquete. Este archivo no se interpreta en
   Astro preview: sus efectos reales necesitan validación en Apache/LiteSpeed.

No subir `.env*`, `.git`, `node_modules`, `src`, `.astro`, `.agents`, `.rules`,
`.impeccable`, `scripts`, `docs`, informes, resúmenes, backups, logs, mapas de
fuente ni archivos de herramientas. Conservar los avisos de licencia incluidos
en `dist/`, como `manrope-OFL.txt`. La clave Web3Forms de navegador es pública
por diseño: el bundle no debe contener credenciales privadas.

Si ya existe una web en el directorio público, hacer backup y comparar las
reglas existentes. **No sobrescribir ni borrar su `.htaccess` a ciegas.** Retirar
solo archivos antiguos identificados para evitar rutas obsoletas; no vaciar
directorios compartidos. Las actualizaciones deben evitar un intervalo con HTML
que apunte a hashes retirados: subir recursos antes que HTML y conservar los
hashes anteriores el tiempo necesario.

## Supuestos de la configuración preparada

- Dominio canónico `https://7dstudio.es`, instalado en la **raíz**, no subcarpeta.
- Certificado válido para `7dstudio.es` y `www.7dstudio.es` antes de redirigir.
- LiteSpeed con compatibilidad Apache 2.4 y permisos de `.htaccess` para
  `DirectoryIndex`, `ErrorDocument`, reescritura, cabeceras, filtros y acceso.
- HTTPS reconocido por el servidor de origen. **No se confía en un
  `X-Forwarded-Proto` recibido del cliente.** Si se incorpora Cloudflare u otro
  proxy que termine TLS, acordar con el hosting la detección segura del esquema
  antes de usar estas reglas: de lo contrario puede haber bucles.
- Directorio dedicado al sitio estático, sin WordPress ni otro router compartido.
- No hay integraciones que necesiten embeber esta web desde otro origen o usar
  cámara, micrófono o geolocalización. Si cambian, revisar sus cabeceras.

Los bloques `IfModule` evitan errores cuando falta un módulo, pero **también
significan que sus reglas no se aplicarán**. Confirmar soporte efectivo con
LucusHost. No se dispone aquí de Apache/LiteSpeed para ejecutar una prueba de
sintaxis ni acreditar su interpretación exacta en la cuenta contratada.

## Reglas preparadas y comprobaciones del servidor

| Área | Preparado | Pendiente de comprobar en el hosting |
|---|---|---|
| Astro | `output: static`, dominio HTTPS sin www y `trailingSlash: always` | Document root correcto y MIME de JS/CSS/fuentes |
| Redirecciones | HTTP y www → `https://7dstudio.es`, 301, destino constante, ruta y query conservadas | Certificados, ausencia de bucles y convivencia con Force HTTPS de cPanel |
| Rutas | Directorios con `index.html`; eliminación de `index.html` explícito | Barra final de directorios y ruta anidada, sin transformar URLs inexistentes en 200 |
| Certificados | Excepción de `/.well-known/acme-challenge/` y `pki-validation/` | AutoSSL/renovación y tratamiento real de esas rutas por cPanel |
| Caché | `_astro/` existente: un año e immutable; otros assets: un día; HTML/XML/TXT: revalidación | `Cache-Control`, ETag/Last-Modified, 304 y posibles reglas del panel/CDN |
| LiteSpeed | Headers de caché del navegador compatibles con el servidor estático | No se habilita LSCache de página completa; no hace falta WordPress ni plugin. Verificar overrides del hosting |
| Compresión | DEFLATE para HTML, CSS, JS, XML, JSON y SVG | `Content-Encoding` gzip o Brotli y `Vary: Accept-Encoding`; Brotli se gestiona en el servidor, no se promete por el archivo |
| Seguridad | nosniff, referrer policy, SAMEORIGIN y restricciones de APIs no usadas; archivos sensibles y listado de directorios protegidos | Cabeceras en 200, redirecciones y 404, ausencia de duplicados y soporte de directivas |
| 404 | `ErrorDocument 404 /404.html`, sin fallback SPA | HTTP 404 real en rutas simples, anidadas y con extensión; ver `404-servidor.md` |
| SEO | Canonicals HTTPS, robots y sitemap filtrado | GET público, Search Console y validadores de datos estructurados |

No se comprimen de nuevo WebP/PNG/WOFF2 mediante DEFLATE. No se eliminan ETag ni
Last-Modified. No se configura CORS abierto para Web3Forms: es el proveedor quien
debe permitir el origen del formulario.

### HSTS y CSP

No se activa ninguna de las dos. Antes de valorar HSTS, verificar TLS,
redirecciones y todos los subdominios; no usar `includeSubDomains` ni preload
sin inventario y decisión explícita.

Una futura CSP debe probarse primero en **Report-Only**. El sitio tiene JSON-LD
y scripts inline de Astro; la demo Huella utiliza Google Fonts e imágenes
Unsplash. Los formularios requieren conexiones y envío nativo sin JS a
`https://api.web3forms.com`. Inventariar `script-src`, `style-src`, `font-src`,
`img-src`, `connect-src` y `form-action`; no bloquearlos ni introducir
`unsafe-eval`/una política restrictiva por copiar una plantilla. No se añade un
endpoint de informes ni se transmiten datos de visitantes en esta fase.

## Web3Forms: revisión técnica, no validación de protección de datos

Se conservan los seis formularios y su configuración. Hay consentimiento
obligatorio sin marcar, validación nativa, honeypot `botcheck`, bloqueo de
duplicados, timeout de 20 segundos, éxito estricto y conservación de datos ante
errores. Se usan `FormData` y mensajes con `textContent`, sin persistir ni registrar
los datos enviados. Las pruebas interceptan todas las peticiones de envío.

Estos controles del navegador **no son rate limiting ni protección antispam del
servidor**: pueden eludirse con peticiones construidas manualmente. Sin acceso
al proveedor no se acredita la entrega, cuota, dominio permitido, antispam,
retención, plan ni destinatario. Revisar en la cuenta de Web3Forms y el buzón:

- Destinatario efectivo, dominio/orígenes permitidos y límites disponibles en el plan.
- Filtros antispam, consumo de cuota, alertas y recuperación ante fallo.
- Contratos/encargados, países y transferencias, integraciones y eliminación.
- Si después se decide usar captcha, evaluar necesidad, accesibilidad y privacidad
  antes de cargar terceros; no se añade uno ahora.
- Solo tras cerrar privacidad y con autorización expresa, realizar un envío de
  prueba y confirmar recepción/spam. **No se ha realizado aquí.**

## Verificación futura, solo cuando se autorice publicar

Ejemplos manuales (no se han ejecutado contra producción en esta fase):

```powershell
curl.exe -I http://7dstudio.es/diseno-web/?qa=1
curl.exe -I http://www.7dstudio.es/diseno-web/?qa=1
curl.exe -I https://www.7dstudio.es/diseno-web/?qa=1
curl.exe -I https://7dstudio.es/diseno-web
curl.exe -I https://7dstudio.es/diseno-web/index.html
curl.exe -i https://7dstudio.es/ruta-inexistente-qa/
curl.exe -i https://7dstudio.es/carpeta-inexistente-qa/otra-pagina
curl.exe -i https://7dstudio.es/inexistente-qa.html
curl.exe -I -H "Accept-Encoding: gzip, br" https://7dstudio.es/
curl.exe -I https://7dstudio.es/robots.txt
curl.exe -I https://7dstudio.es/sitemap-index.xml
```

No basta comprobar HEAD: revisar también GET y el contenido de las respuestas.
Inspeccionar una URL real con hash de `dist/_astro/` para MIME, compresión y
caché larga, y una URL inexistente bajo `_astro/` para que no reciba caché
immutable. Repetir HTML tras actualizarlo para descartar caché antigua. Revisar
404, `.env`, listado de directorios y ausencia de ficheros del repositorio sin
usar escáneres intrusivos. No usar la página directa `/404.html` para demostrar
que una URL inexistente conserva su estado.

`robots.txt` permite rastrear el sitio y apunta a `sitemap-index.xml`. No bloquear
en robots las legales pendientes: los buscadores deben poder leer su `noindex`.
`publicationReady: false` y las exclusiones del sitemap se mantienen. Un archivo
robots no es control de acceso ni impide envíos de formularios.

Referencias de sintaxis y operación:
- https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html
- https://httpd.apache.org/docs/2.4/mod/mod_headers.html
- https://httpd.apache.org/docs/2.4/mod/mod_deflate.html
- https://www.lucushost.com/ayuda/activar-certificado-ssl-cpanel/
- https://www.lucushost.com/ayuda/administrador-de-archivos-cpanel/
