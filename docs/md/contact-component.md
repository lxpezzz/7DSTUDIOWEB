# Contacto unificado

`Contact.astro` es la única sección `#contacto` de la home. Paneles 40/60, radio exterior de 20px y una columna bajo 768px. Conserva Geist y usa únicamente CSS local: carbón `#1B1B1B`, blanco roto `#F8F6F3`, gris cálido `#BBB5AF`, formulario `#F6F3EF`, borde `#DAD5CE` y acento `#B88470`. Los chips solo al seleccionarse usan beige `#E9DFD1` (web), salvia `#DCE2D5` (SEO), malva `#E9DEE5` (QR/NFC) o gris `#E8E6E2` (otra idea); el borde oscurece ese mismo color y el texto permanece oscuro. Transición de color de 150ms, omitida con movimiento reducido. No hay GSAP, burbujas, entrada animada ni movimiento del símbolo.

## Identidad

Utiliza el isotipo SVG original de `brand-v2/brand/svg/7dstudio-isotipo.svg`, centralizado en `src/data/brand.ts`. Es decorativo, `aria-hidden`, sin eventos de puntero. WhatsApp conserva `site.whatsapp`, sin números inventados.

## Configuración y privacidad

- La clave pública facilitada por el titular está centralizada en `site.web3formsKey`; `PUBLIC_WEB3FORMS_KEY` permite sustituirla. Se mantienen endpoint y honeypot `botcheck`.
- La ruta de privacidad es `/politica-de-privacidad/`. Que exista el borrador no habilita formularios.
- `src/data/legal.ts` centraliza datos pendientes. La integración está autorizada (`formsEnabled: true`), pero `reviewed: false` y la identidad incompleta mantienen deshabilitados la casilla y el envío; WhatsApp es un enlace directo independiente.
- `site.privacyReady` exige identidad completa y revisión; `site.formsConfigured` exige además autorización de activación y la clave efectiva (configurada o de entorno). No marcar la revisión como realizada sin confirmación. Es necesario volver a compilar.
- El helper bloquea también envíos programáticos cuando faltan esos requisitos. Los estados de éxito y error se comprueban mediante respuestas simuladas, no enviando datos reales. Sin JS, el POST nativo solo se configura cuando se cumplen los requisitos.
- `mode="contact"` reutiliza la sección en `/contacto/`, con teléfono opcional y selector. Admite `?servicio=web`, `seo-local`, `productos` u `otro`, sin guardar datos personales en la URL.

## Formulario

`src/scripts/contact-form.ts` adapta la lógica existente, no la duplica. Nombre, email, mensaje, servicio y consentimiento son obligatorios. Los chips son radios nativos con un único `name="service"`; el servicio y `privacy=accepted` se incluyen en FormData. Flechas/Tab permiten operar los controles sin manejadores de teclado personalizados.

El estado de envío bloquea dobles solicitudes, marca `aria-busy` y restablece el botón al terminar. El éxito limpia el formulario; el error conserva sus datos. El feedback utiliza una región viva con foco. No se registran ni persisten los mensajes o claves en el navegador.

## Verificación

`node scripts/verify-contact.mjs <QA node_modules> <URL>` registra capturas e informe en `.impeccable/review/contact/`:

- 360, 390, 768, 1024, 1440 y 1920px: sin overflow, proporciones y altura de paneles correctas, símbolo visible, un formulario, teclado y sin infracciones axe detectadas.
- Fixture exclusivamente en navegador, con solicitudes interceptadas: payload del servicio/consentimiento, validación de email, honeypot, bloqueo de duplicados, éxito, error HTTP y error de red. WhatsApp se ofrece mediante un enlace independiente; ya no se convierte un formulario desconfigurado en una solicitud de envío.
- No equivale a entrega real de correo. Queda pendiente completar la identidad del responsable, revisar la política y verificar recepción autorizada. Pruebas ejecutadas en Chromium, no en dispositivos físicos ni otros motores.
