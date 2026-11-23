# Página 404 en LucusHost / cPanel / LiteSpeed

Astro genera `dist/404.html`. Subir el contenido de `dist/` no garantiza por sí
solo que el servidor utilice esta página para rutas inexistentes.

Cuando se configure el alojamiento, añadir o combinar cuidadosamente esta
directiva en el `.htaccess` del directorio público, sin sustituir sus reglas:

```apache
ErrorDocument 404 /404.html
```

La ruta debe ser local, no una URL absoluta. No redirigir errores a Inicio ni
usar un fallback de SPA que responda 200 para cualquier URL. Si existen reglas
de reescritura, comprobar que no capturan las rutas inexistentes antes del error.
La fase 4 prepara esta directiva en `public/.htaccess`, que se copia a
`dist/.htaccess`. No se ha aplicado al servidor. Revisar los supuestos y el
procedimiento de `produccion-lucushost.md` antes de combinarla con las reglas
reales del alojamiento.

Después de configurar el servidor, comprobar con GET (no solo HEAD):

```powershell
curl.exe -i https://7dstudio.es/ruta-inexistente-qa/
curl.exe -i https://7dstudio.es/carpeta-inexistente-qa/otra-pagina
```

Ambas deben conservar **HTTP 404**, mostrar «404. No encontramos esta página.»
y mantener los enlaces a Inicio, Servicios y Contacto. Revisar también que los
CSS, JS, fuentes y favicon de esa respuesta carguen desde rutas absolutas.
Repetir en una URL inexistente con extensión, por ejemplo `/no-existe-qa.html`.

El acceso directo a `/404.html` puede responder 200 según el servidor: no es la
prueba del estado de las URLs inexistentes. La comprobación de producción
queda pendiente hasta disponer del alojamiento configurado; no requiere ni
autoriza un despliegue durante esta fase.
