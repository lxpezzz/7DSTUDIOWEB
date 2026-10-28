# Contacto unificado

`Contact.astro` es la única sección `#contacto` de la home. Paneles 40/60, radio exterior de 20px y una columna bajo 768px. Conserva Geist y usa únicamente CSS local: carbón `#1B1B1B`, blanco roto `#F8F6F3`, gris cálido `#BBB5AF`, formulario `#F6F3EF`, borde `#DAD5CE` y acento `#B88470`. Los chips solo al seleccionarse usan beige `#E9DFD1` (web), salvia `#DCE2D5` (SEO), malva `#E9DEE5` (QR/NFC) o gris `#E8E6E2` (otra idea); el borde oscurece ese mismo color y el texto permanece oscuro. Transición de color de 150ms, omitida con movimiento reducido. No hay GSAP, burbujas, entrada animada ni movimiento del símbolo.

## Identidad

Reutiliza `src/images/finalcta/simbolometal-7d.webp`, recurso original transparente de 1024 × 1145. Astro genera derivados WebP; no se recrea ni se altera el símbolo. Es decorativo, `aria-hidden`, sin eventos de puntero. WhatsApp conserva `site.whatsapp`, sin números inventados.

## Configuración y privacidad

- `PUBLIC_WEB3FORMS_KEY`: misma clave pública que utilizaba el formulario anterior; se mantienen endpoint, asunto, remitente y honeypot `botcheck`.
- `PUBLIC_PRIVACY_POLICY_URL`: URL real de la política publicada y revisada. Configurar ambas variables en el entorno y volver a compilar.
- Actualmente no hay página legal ni URL configurada. Por decisión expresa del usuario, la casilla y el envío permanecen deshabilitados; se explica el motivo y se ofrece WhatsApp directo. No hay enlace legal ficticio.
- Con política disponible pero sin Web3Forms, se conserva el comportamiento anterior: preparar el mensaje para revisión y envío manual por WhatsApp. Se indica que no se ha enviado automáticamente.
- Con ambas configuraciones, se envía mediante Web3Forms. Sin JS también se conserva el POST nativo cuando ambas están disponibles.

## Formulario

`src/scripts/contact-form.ts` adapta la lógica existente, no la duplica. Nombre, email, mensaje, servicio y consentimiento son obligatorios. Los chips son radios nativos con un único `name="service"`; el servicio y `privacy=accepted` se incluyen en FormData. Flechas/Tab permiten operar los controles sin manejadores de teclado personalizados.

El estado de envío bloquea dobles solicitudes, marca `aria-busy` y restablece el botón al terminar. El éxito limpia el formulario; el error conserva sus datos. El feedback utiliza una región viva con foco. No se registran ni persisten los mensajes o claves en el navegador.

## Verificación

`node scripts/verify-contact.mjs <QA node_modules> <URL>` registra capturas e informe en `.impeccable/review/contact/`:

- 360, 390, 768, 1024, 1440 y 1920px: sin overflow, proporciones y altura de paneles correctas, símbolo visible, un formulario, teclado y sin infracciones axe detectadas.
- Fixture exclusivamente en navegador, con clave ficticia y solicitudes interceptadas: payload del servicio/consentimiento, validación de email, honeypot, bloqueo de duplicados, éxito, error HTTP, error de red y fallback a WhatsApp.
- No equivale a entrega real de correo. Queda pendiente configurar la política y Web3Forms y verificar recepción autorizada. Pruebas ejecutadas en Chromium, no en dispositivos físicos ni otros motores.
