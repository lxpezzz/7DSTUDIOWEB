# Fase 2 — Legal y privacidad

Fecha: 4 de noviembre de 2026. Referencias: `AUDITORIA_7DSTUDIO.md` y `RESUMEN_FASE1_7DSTUDIO.md`.

## Resultado y límites

Se han aplicado las correcciones que permiten los hechos conocidos de **7D-01, 7D-02 y 7D-03**. La intervención no certifica cumplimiento ni cierra los bloqueos para publicación o recogida de consultas reales: faltan decisiones del titular y comprobaciones de proveedores.

Los formularios mantienen su activación y funcionamiento anteriores. **No publicar ni recoger consultas reales hasta completar la información pendiente y revisar su suficiencia.** `noindex` y la advertencia editorial no sustituyen esa revisión ni impiden acceder a las páginas o enviar formularios. No se ha desplegado nada ni se han enviado comunicaciones reales.

## Cambios aplicados

- **Privacidad:** describe los formularios activos, campos, finalidad, bases jurídicas, cálculo local, canales externos, proveedores, conservación, posibles transferencias y derechos. Retira las afirmaciones falsas de inactividad y de falta de identidad. Mantiene visibles los extremos materiales sin verificar.
- **Formularios:** primera capa compartida en las seis páginas, con responsable, finalidad, base, Web3Forms/correo, posible transferencia internacional, derechos y referencia a la política. Conserva consentimiento obligatorio, honeypot, validación, estados y comportamiento sin JavaScript.
- **Cookies:** describe el envío real por Web3Forms y el inventario de la aplicación, sin atribuirle las cookies del panel del proveedor. Reduce detalles internos y conserva el pendiente de comprobación en producción. No añade banner sin tecnologías verificadas que lo justifiquen.
- **Aviso legal:** corrige la descripción y las instrucciones obsoletas sobre identidad. Los campos registrales y de autorizaciones siguen señalados para confirmar su aplicabilidad, no se han declarado innecesarios por defecto.
- **Contratación:** corrige las referencias a formularios inactivos, elimina marcadores «…» y explicaciones internas redundantes, conserva los derechos de consumidores y señala los términos aún sin aprobar. Incluye el alcance del mantenimiento ya publicado en la FAQ, sin añadir prestaciones.
- **Datos compartidos:** el alcance de mantenimiento se extrae literalmente a `webMaintenanceScope`, utilizado por FAQ y condiciones. Los precios, fórmulas y texto resultante de la FAQ permanecen iguales. Se retira la ubicación de hosting «España» como hecho confirmado: LucusHost sigue siendo una previsión.
- **Estado editorial:** `publicationReady: false` mantiene la advertencia y el `noindex`, independientemente de `reviewed`. El sitemap excluye las cuatro páginas legales pendientes; conserva Contacto y la exclusión previa de demos. Este indicador tampoco es una prueba de cumplimiento y no debe cambiarse solo para ocultar pendientes.

No se han cambiado importes, reglas económicas, fórmula de cálculo, activación de formularios, dependencias, diseño ni demos. No se inventan plazos, anticipos, permanencias, penalizaciones o titularidad del dominio.

## Información necesaria para cerrar los hallazgos

### 7D-02 — Proveedores y operación

| Pendiente | Evidencia o decisión necesaria |
|---|---|
| Hosting | Confirmar contratación efectiva de LucusHost, entidad y servicio; servidores, copias, registros técnicos, duración y acuerdo de tratamiento. |
| Correo | Buzón realmente configurado como destinatario de Web3Forms, proveedor y cuenta particular/empresarial, condiciones y acceso. El email público no acredita estos datos. |
| Web3Forms | Cuenta y plan, destinatario, integraciones, conservación efectiva, procedimiento de eliminación y acuerdo de tratamiento aplicable. |
| Transferencias | Países, subencargados, garantías efectivas y modo de obtener copia para Web3Forms y demás servicios. La documentación citada no demuestra su aplicación contractual a esta cuenta. |
| Conservación | Criterios operativos para consultas atendidas/abandonadas, clientes, facturas, reclamaciones, mensajes, registros y copias; cuándo y cómo se elimina o bloquea en cada proveedor. No se ha adoptado como plazo propio el máximo de tres años mencionado por Web3Forms. |
| WhatsApp | Tipo de cuenta, condiciones, acceso, conservación y eliminación de conversaciones. |
| Seguridad | Medidas efectivas, responsables del acceso y configuración; necesidad y base jurídica de los registros técnicos. |
| Aplicabilidad | Confirmar datos registrales, autorizaciones/colegiación y si procede designar o informar de un DPO. No son obligaciones universales; no se ha inventado un DPO. |

### 7D-03 — Decisiones comerciales

1. Confirmar si se contrata solo con profesionales o también con consumidores.
2. IVA de los 19 €/mes y fecha de inicio de los tres meses gratuitos.
3. Titularidad, renovación y traslado del dominio; entrega/migración de la web al salir.
4. Facturación, forma y vencimiento de pago, anticipos si existen y procedimiento de baja.
5. Validez del presupuesto, medio de aceptación y confirmación en soporte duradero.
6. Revisiones de desarrollo incluidas y procedimiento de validación; sin cambiar el alcance mensual ya publicado.
7. Cancelación y resolución; instrucciones y formulario de desistimiento cuando proceda; entrega de productos sin envío.
8. Procedimiento de incidencias y mecanismos extrajudiciales aplicables, sin atribuir adhesiones inexistentes.

Las condiciones esenciales deben comunicarse antes de aceptar un presupuesto; remitir a un futuro acuerdo no basta para dar estos puntos por cerrados.

## Archivos modificados

- `src/data/legal.ts`
- `src/data/webPricing.ts`
- `src/data/serviceFaqs.ts`
- `src/layouts/LegalLayout.astro`
- `src/components/legal/LegalIdentity.astro`
- `src/pages/aviso-legal.astro`
- `src/pages/politica-de-privacidad.astro`
- `src/pages/politica-de-cookies.astro`
- `src/pages/condiciones-de-contratacion.astro`
- `src/pages/contacto.astro`
- `src/components/home/Contact.astro`
- `src/components/web-design/WebContact.astro`
- `src/components/seo-local/SeoContact.astro`
- `src/components/products/ProductContact.astro`
- `astro.config.mjs` — solo el filtrado de páginas legales pendientes del sitemap, preservando el filtro de demos existente.

`src/data/faqs.ts` y la calculadora no requieren cambios: ya consumen las fuentes compartidas. Se mantienen las modificaciones anteriores y el trabajo concurrente del usuario.

## Verificación

- `npm run check`: **96 archivos; 0 errores, 0 advertencias, 0 hints**.
- `npm run build`: correcto, **12 páginas**.
- **8.192 casos de cálculo** correctos; modalidades, extras, compatibilidades y transferencia del resumen preservados.
- **Seis formularios con respuestas interceptadas:** consentimiento, validación, honeypot, duplicados, éxito y errores HTTP/API/JSON/red. Ningún envío real.
- **Diez páginas × siete anchos** (1440, 1280, 1024, 768, 430, 390 y 375 px), sin overflow horizontal.
- Axe en `main` de páginas legales y en los formularios a 1440 y 390 px: sin violaciones detectadas en esos ámbitos. Revisión visual de capturas de cabecera legal y primera capa de formularios. No equivale a auditoría integral de accesibilidad.
- Verificados índices internos, avisos editoriales, `noindex`, exclusiones del sitemap y conservación de Contacto y del filtro de demos.
- Comparación por hashes: scripts de formularios/calculadora, configuración de activación, dependencias y demos intactos. `webPricing.ts` es idéntico al original de esta fase al retirar la extracción literal del alcance; reconstruir la FAQ antes de esa extracción produce el mismo hash.
- Detector de diseño ejecutado: comunica discrepancias con `DESIGN.md` en estilos preexistentes (colores, radios, tamaños y un borde de WebContact). No se han rediseñado para corregir documentación/estilos ajenos a esta fase.
- El script ampliado registra además tres iconos del manifiesto con respuesta 404. No se corrigen en esta intervención legal.

Evidencias locales: `.impeccable/review/phase2/` (`before.json`, `scope.json`, `functional.json`, `legal-qa.json` y capturas). No se ha verificado la infraestructura pública ni las cuentas o contratos de proveedores.
