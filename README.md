# 7D Studio · v2

Home estática con Astro, TypeScript, Tailwind CSS v4 y Geist autohospedada mediante Fontsource. Hero cinematográfico con GSAP y ScrollTrigger, cargados bajo demanda en escritorio/tablet sin preferencia de movimiento reducido. Sin rastreadores, cookies no necesarias ni frameworks cliente.

## Desarrollo

```sh
npm install
npm run dev
npm run check
npm run build
npm run preview
```

Subir el contenido de `dist/` al directorio público de LucusHost. `astro.config.mjs` contiene el dominio de producción. La tipografía se sirve localmente; no se realizan peticiones a Google Fonts.

## Hero cinematográfico · primera fase

La cabecera ahora es fija (`z-index: 50`), fuera de `main` y de cualquier capa animada. Conserva su estética y permanece visible durante el zoom y el resto de la navegación. Su altura medida compensa las anclas y la reserva móvil; fondo papel con opacidad del 97% al hacer scroll. `scripts/verify-header.mjs` comprueba superposición, ancestros sin transform, menú/Escape y títulos visibles tras navegar en 360, 390, 768 y 1440px. La regresión cinematográfica también pasa; el fondo translúcido introduce diferencias inferiores al 0,01% de píxeles en la comparación de entrega (la igualdad exacta descrita abajo pertenece al estado anterior a la cabecera fija).

- `src/components/home/Hero.astro`: fotografía a sangre, navegación existente, un único H1, CTA e indicador de scroll. No modifica Proyectos, Proceso, Estudio ni Contacto.
- `src/data/hero-scene.ts`: dimensiones originales, cuatro esquinas interiores normalizadas, apertura visible que conserva muesca/mano/cuerpo y recorrido de dos viewports. Cambiar estos datos si se sustituye la imagen.
- `src/scripts/hero-projection.ts`: homografía CSS `matrix3d`. La superficie HTML, la fotografía y su primer plano comparten exactamente la misma transformación proyectiva durante el enderezado.
- `src/scripts/cinematic-hero.ts`: timeline reversible con pin en el escenario y transformaciones en sus capas interiores. Se calcula `object-fit: cover`, recorte y encuadre en cada refresh. No hay scroll independiente ni scroll suave añadido.
- La pantalla usa una copia decorativa del HTML real de Servicios, `aria-hidden` e `inert`, sin controles ni IDs duplicados. Al liberar el pin, la sección real conserva su posición semántica y continúa el scroll natural.
- Móvil y movimiento reducido: fotografía y pantalla HTML estáticas, sin pin. No se descarga GSAP en la carga inicial de estos modos. Sin JavaScript, permanece la fotografía original y todas las secciones reales.
- Depuración local: `npm run dev` y abrir `/?debugScreen=1`. Muestra los cuatro puntos de calibración sólo en desarrollo; el parámetro no activa depuración en producción.

### Pruebas de esta fase

`npm run check` y `npm run build` correctos. Chromium/Playwright en 360×800, 390×844, 768×1024, 1024×768, 1440×900 y 1920×1080: sin overflow, solapamientos de texto con la pantalla, errores de consola, IDs duplicados ni incidencias de axe detectadas. Comprobados scroll inverso, restauración tras recarga, cambio a móvil, movimiento reducido y alternativa sin JS.

Capturas de escritorio en 0, 15, 30, 45, 60, 75, 95, 100 y 112% del recorrido. La vista proyectada al 95% y Servicios real al 100% coinciden píxel a píxel en los cuatro tamaños cinematográficos. El registro geométrico foto/HTML medido es subpíxel. Revisión independiente: tres correcciones materiales verificadas como resueltas, disposición final `ship` al alcance de esas correcciones.

Reproducir con `node scripts/verify-cinematic.mjs <node_modules-QA> http://127.0.0.1:4330`; requiere Playwright y `@axe-core/playwright` externos. Capturas y reporte en `.impeccable/review/cinematic/`. Los scripts anteriores de hero/sello corresponden a la composición anterior y no validan este hero. No se ha medido nuevamente Lighthouse ni se han probado Safari/Firefox o dispositivos físicos.

## Verificación anterior a esta fase

- `npm run check`: sin errores, advertencias ni hints.
- `npm run build`: generación estática correcta.
- Chromium/Playwright sobre producción: 360, 390, 768, 1024 y 1440 px; capturas inspeccionadas, sin overflow horizontal, anclas rotas, errores de consola ni incidencias de axe WCAG A/AA detectadas.
- Menú móvil, Escape, cierre tras navegar, validación, preparación de WhatsApp y alternativa sin JavaScript comprobados.
- Error, conservación de datos, reintento, éxito y reset de Web3Forms comprobados con API interceptada/simulada. No se ha probado la entrega real.
- Lighthouse local de producción (28/10/2026): móvil y escritorio **100 rendimiento / 100 accesibilidad / 100 buenas prácticas / 100 SEO**. CLS 0. Estos resultados no garantizan las métricas del alojamiento final ni certifican cumplimiento WCAG completo.
- Robots, sitemap, favicon y OG responden HTTP 200. Revisión visual independiente cerrada con disposición `ship` al alcance implementado, conservando los pendientes autorizados.

Evidencia en `.impeccable/review/` (local, ignorada en Git). Scripts reproducibles: `scripts/verify.mjs` y `scripts/verify-form.mjs`, recibiendo como primer argumento una carpeta `node_modules` externa con `playwright` y `@axe-core/playwright`, y como segundo la URL. Las herramientas de QA no forman parte del bundle ni de las dependencias de producción. `--generate-og` regenera la composición OG; documentar de nuevo su procedencia tras regenerarla.

## Contenido y configuración

- `src/data/site.ts`: marca, contacto, navegación y enlaces legales. Teléfono autorizado a partir de v1. No hay email confirmado.
- `src/data/projects.ts`: proyectos reales, vacíos de forma intencionada. Al completarlo, el estado editorial se sustituye por una retícula. Diferenciar trabajos para clientes, propios y demostraciones. Añadir capturas optimizadas, dimensiones y texto alternativo; obtener permiso de publicación.
- `.env.example`: copiar a `.env` y completar `PUBLIC_WEB3FORMS_KEY` para activar Web3Forms. La clave de acceso de Web3Forms es pública por diseño. Restringir dominios desde Web3Forms. Reconstruir después de modificar variables.
- Sin clave, el formulario valida los campos y prepara una URL de WhatsApp. Hay un segundo paso explícito; no se simulan envíos. Sin JS, utilizar los enlaces directos o el teléfono.

## Bloqueos antes de publicar

1. Aportar identidad fiscal del titular y textos revisados de aviso legal y privacidad. No había páginas legales en v2 ni v1; no se han inventado. Crear las páginas e incorporarlas a `legalLinks` antes de producción. Revisar la información del formulario y el tratamiento por WhatsApp/Web3Forms.
2. Configurar Web3Forms y verificar una entrega real, incluyendo error y éxito. El envío real no se puede comprobar sin clave.
3. Incorporar proyectos y capturas reales si se quiere publicar portfolio.
4. Si se incorpora analítica no necesaria, implementar consentimiento previo. Actualmente no hace falta un banner de cookies porque no se cargan estas tecnologías.

## Imágenes

`src/images/hero/hero-7dstudio.png` es el recurso original aportado por el usuario (1672×941), conservado sin modificar. La home sirve `src/images/hero/hero-7dstudio.webp`, conversión WebP de unos 50 KiB; no descarga el PNG. La escena es un recurso visual proporcionado, no un caso de portfolio ni una afirmación de trabajo para un cliente. Procedencia y conversión en sus sidecars `.json`.

Conversión reproducible: `ffmpeg -y -i src/images/hero/hero-7dstudio.png -c:v libwebp -quality 86 src/images/hero/hero-7dstudio.webp`.

`src/images/branding/` contiene el logo completo y el símbolo metálico en WebP, importados desde los componentes. Las imágenes utilizadas por la interfaz se importan desde `src/images` para que Astro genere sus URL de producción.

`public/og.png` es una composición tipográfica de la marca, generada localmente desde la propia home; no representa un proyecto ni un cliente. Se conserva en `public` para mantener su URL estable al compartir la web. `public/favicon.svg` es un monograma vectorial de 7D, no un logotipo gráfico recuperado.

La licencia de Geist se distribuye en `public/geist-OFL.txt`.
