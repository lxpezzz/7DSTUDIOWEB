# Añadir demos al minicatálogo

La home todavía no publica proyectos: faltan capturas y URLs reales. No uses recursos de marca, fotos de stock ni el hero como capturas de proyectos.

1. Guarda una captura autorizada y optimizada en WebP en `src/images/projects/`. Se recomienda una captura de escritorio de unos 1600px de ancho; el catálogo muestra un encuadre 16:10 desde la parte superior, sin deformar la imagen.
2. Importa la captura en `src/data/projects.ts` y añade un objeto a `projects`:

```ts
import captura from '../images/projects/tu-demo.webp';

export const projects: Project[] = [
  {
    id: 'identificador-unico',
    title: 'Título real del proyecto',
    sector: 'Sector real',
    description: 'Descripción breve y veraz de la propuesta.',
    image: { ...captura, alt: 'Descripción de la página mostrada en la captura.' },
    // demoUrl: 'URL_HTTPS_PUBLICADA', // Añadir solo tras comprobar la demo real.
    featured: true,
    type: 'demo',
  },
];
```

Los textos del ejemplo son marcadores para sustituir, no proyectos publicados. Tipos disponibles: `demo` (etiqueta «Demostración»), `client` y `own`. `id` debe ser estable y único.

La home muestra los **primeros cuatro** objetos con `featured: true`, en el orden del array. `featured: false` conserva el registro para el futuro catálogo sin publicarlo en la home.

`demoUrl` es opcional. Sin URL absoluta HTTP/HTTPS válida no se muestra «Explorar demo». El formato se comprueba automáticamente; tú debes verificar que la URL esté publicada y funcione. Se abre en otra pestaña con `noopener noreferrer`.

El enlace «Ver todos los proyectos» solo se activa al existir `src/pages/proyectos.astro` o `src/pages/proyectos/index.astro`. Esta fase no crea ninguna ruta.

Sin JavaScript, el catálogo conserva scroll nativo, swipe y enlaces. Con JavaScript añade flechas, estado de posición y teclas ←/→/Inicio/Fin al enfocar el catálogo. No hay reproducción automática, pin ni dependencia de GSAP. Con movimiento reducido se desactivan scroll suave y ampliación de imágenes.
