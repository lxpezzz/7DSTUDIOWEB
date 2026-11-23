# Correcciones técnicas — Fase 1

Referencia: `AUDITORIA_7DSTUDIO.md`. Fecha: 4 de noviembre de 2026.

Se han implementado exclusivamente **7D-04, 7D-05, 7D-07, 7D-08 y 7D-09**. No se han modificado textos legales, condiciones comerciales, precios, fórmulas, configuración de producción ni dependencias.

## Cambios aplicados

| Hallazgo | Solución |
|---|---|
| **7D-04** | La lista de incluidos de la modalidad de varias páginas indica ahora las **5 páginas incluidas**, usando el dato existente. La FAQ compartida utiliza «web de varias páginas» en lugar de «corporativa». El ID interno `corporate` permanece igual. |
| **7D-05** | Se retiró el `aria-label` que sustituía el contenido visible de las tarjetas del portfolio. El enlace conserva su nombre nativo y una advertencia para lectores de pantalla de apertura en otra pestaña. No se alteraron destinos, distribución ni interacción. |
| **7D-07** | El menú móvil deriva una sola lista de la navegación existente, sin anteponer otro «Inicio». Se conservan diálogo, Escape y restauración de foco. |
| **7D-08** | Logos, portfolio y símbolo pequeño de servicios utilizan `Image` de `astro:assets`, con variantes WebP, `srcset` y `sizes`. Se conservan originales, textos alternativos, proporciones y estilos. La fotografía del hero no se ha modificado. |
| **7D-09** | El resumen del presupuesto incluye un bloque separado «Mantenimiento · cuota aparte»: tres meses gratis, después **19 €/mes**, y obligatoriedad mientras siga alojada y gestionada por 7DStudio. Reutiliza los textos de precio existentes y no suma la cuota al desarrollo. |

La corrección de la FAQ se refleja tanto en Diseño Web como en Preguntas Frecuentes, porque comparten datos.

## Archivos modificados en esta fase

1. `src/data/webPricing.ts` — solo el texto de incluidos de varias páginas; sin cambios en condiciones, importes o funciones.
2. `src/data/serviceFaqs.ts` — nomenclatura y explicación de la comparación de modalidades.
3. `src/data/projects.ts` — tipado `ImageMetadata` necesario para optimizar las imágenes con Astro.
4. `src/components/ui/ProjectCatalogue.astro` — nombre accesible y variantes de imagen del catálogo.
5. `src/components/layout/Header.astro` — menú sin duplicado y logo responsivo.
6. `src/components/layout/Footer.astro` — logo responsivo y carga diferida.
7. `src/components/web-design/WebProjects.astro` — imágenes responsivas del portfolio.
8. `src/components/about/AboutProjects.astro` — imágenes responsivas de proyectos.
9. `src/components/services/DigitalScene.astro` — variante pequeña del símbolo decorativo.
10. `src/components/web-design/WebCalculator.astro` — recordatorio mensual y sus estilos locales.

Este documento resume la entrega. `AUDITORIA_7DSTUDIO.md` se conserva como informe histórico, sin reescribir sus conclusiones originales.

Había cambios ajenos en el repositorio al empezar. Durante el trabajo también se han observado cambios concurrentes en la demo de Huella, su enlace y sus datos. Se han conservado; no forman parte de estas correcciones.

## Medición de imágenes

Tamaños de los archivos realmente elegidos por Chromium antes/después, con la misma configuración: viewport 390 o 1440 px, densidad 1, movimiento reducido. Son ejemplos por recurso, **no porcentajes de mejora de toda la visita ni de Core Web Vitals**.

| Recurso / viewport | Antes | Después | Reducción aproximada |
|---|---:|---:|---:|
| Logo header, 390 px | 72.252 bytes | 4.066 bytes | 94 % |
| Logo header, 1440 px | 72.252 bytes | 5.178 bytes | 93 % |
| Logo footer, 390 px | 72.252 bytes | 4.834 bytes | 93 % |
| Logo footer, 1440 px | 72.252 bytes | 6.084 bytes | 92 % |
| Primera captura del catálogo, 390 px | 139.256 bytes | 7.416 bytes | 95 % |
| Primera captura del catálogo, 1440 px | 139.256 bytes | 21.918 bytes | 84 % |
| Símbolo de la escena digital | 40.034 bytes | 852 bytes | 98 % |

También se comprobó la selección de variantes en densidad 2. Las dimensiones visuales de las imágenes medidas se mantienen con diferencias inferiores a 1 px. Los archivos originales no se han sobrescrito.

## Pruebas realizadas

### Después de cada cambio

- **7D-04:** compilación; comparación con la instantánea inicial de precios, extras, páginas incluidas y condiciones; comprobación de la FAQ y de una suma representativa.
- **7D-05:** compilación; axe en el portfolio a 390 y 1440 px; comprobación del nombre nativo, aviso de nueva pestaña y atributos del enlace.
- **7D-07:** compilación; menú a 375, 390 y 768 px; una sola opción Inicio, apertura, Escape, devolución del foco y ausencia de overflow.
- **7D-08:** Astro Check y compilación; comparación de tamaños de archivos, dimensiones visuales y alt antes/después; revisión de capturas en móvil y escritorio.
- **7D-09:** Astro Check y compilación; comprobación de las cuatro modalidades, precio inicial separado de la cuota y transferencia de presupuesto sin cambio de importe.

### Regresión final

- `npm run check`: **96 archivos, 0 errores, 0 advertencias y 0 hints**.
- `npm run build`: correcto; **12 páginas estáticas**, incluida la demo añadida por el usuario fuera de esta fase.
- **8.192 casos numéricos** de calculadora: totales correctos, sin cambio de fórmulas.
- Todas las modalidades y extras, disponibilidad, cantidades, selección persistente entre acordeones, resumen y limpieza de presupuesto comprobados.
- Los seis formularios: consentimiento, email, honeypot, duplicados, éxito, errores HTTP/API/JSON/red y conservación de datos, mediante respuestas interceptadas. **Ningún envío real.**
- **7 páginas × 7 anchos** —1440, 1280, 1024, 768, 430, 390 y 375 px—: sin desbordamiento horizontal; menú y resumen responsive comprobados.
- Axe en móvil y escritorio: sin las incidencias del portfolio corregidas en 7D-05; calculadora y recordatorio sin nuevas incidencias detectadas.
- `scripts/verify-project-links.mjs`: correcto en 390 y 1440 px; enlaces, foco, desplazamiento de teclado/táctil y apertura de proyecto preservados.
- Comparación de código y hashes: páginas legales, datos legales, condiciones comerciales, scripts de cálculo/contacto, paquetes y configuración de Astro sin modificaciones de esta fase. Las funciones de cálculo y descripción del presupuesto permanecen idénticas.

## Avisos fuera de alcance

La revisión ampliada de axe ha detectado `label-content-name-mismatch` en las tarjetas de **Servicios** de la home. Se comprobó que `ServiceCard.astro` coincide con su contenido al empezar esta fase. No se ha modificado ese componente ni se han ocultado los avisos: figuran en la evidencia `ui.json` como incidencias ajenas al portfolio solicitado.

Los scripts antiguos que la auditoría ya identificaba como obsoletos no se han corregido: eso corresponde a 7D-10, fuera de esta fase. Se usaron comprobaciones adicionales acotadas, sin cambiar la aplicación para satisfacer supuestos antiguos.

No se han resuelto los bloqueos legales ni se ha certificado la configuración de producción.

## Evidencias

Directorio local: `.impeccable/review/phase1/`.

- `before.json`: instantánea de partida para comparar alcance y reglas.
- `images-before.json` / `images-after.json`: tamaños y geometría de las imágenes.
- `ui.json`: responsive, menú, accesibilidad, avisos fuera de alcance y pruebas de densidad 2.
- `functional.json`: pruebas interceptadas de formularios y calculadora.
- `scope.json`: archivos que difieren de la instantánea inicial y comprobaciones de protección del alcance.
- Capturas del portfolio, home, Diseño Web, Quiénes Somos y resumen, en móvil/escritorio.

No se han instalado dependencias, desplegado cambios ni enviado comunicaciones externas.
