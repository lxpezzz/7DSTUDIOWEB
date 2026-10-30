export interface Product {
  id: string;
  name: string;
  description: string;
  use: string;
  format: 'card' | 'stand' | 'chip' | 'qr-card' | 'sticker' | 'reviews';
}

export const products: readonly Product[] = [
  { id: 'tarjetas-nfc', name: 'Tarjetas NFC personalizadas', description: 'Comparte tu contacto, tu web o tus redes acercando un móvil compatible.', use: 'Reuniones y contacto profesional', format: 'card' },
  { id: 'expositores', name: 'Expositores NFC + QR', description: 'Un punto de acceso a tu información para mostradores, recepciones y puntos de atención.', use: 'Atención al cliente', format: 'stand' },
  { id: 'chips-nfc', name: 'Chips NFC configurados', description: 'Etiquetas preparadas con la URL o acción acordada, según la compatibilidad del dispositivo.', use: 'Integración en tu negocio', format: 'chip' },
  { id: 'tarjetas-qr', name: 'Tarjetas de contacto QR', description: 'Tarjetas impresas con un QR que dirige a la información que quieras compartir. Sin NFC.', use: 'Contacto mediante la cámara', format: 'qr-card' },
  { id: 'pegatinas', name: 'Pegatinas NFC + QR', description: 'Acerca tu información al cliente desde superficies compatibles y puntos de uso comercial.', use: 'Acceso desde el lugar adecuado', format: 'sticker' },
  { id: 'resenas-google', name: 'Placas para reseñas de Google', description: 'Facilita el acceso a la página de reseñas de tu negocio mediante NFC o QR.', use: 'Opiniones de tus clientes', format: 'reviews' },
];

export const productFaqEmphasis = [
  { question: ['QR y NFC'], answer: ['El QR se escanea con la cámara', 'acercando un móvil compatible', 'con NFC activado'] },
  { question: ['cualquier móvil'], answer: ['conexión a internet', 'depende del modelo, sus ajustes y el sistema operativo', 'no todos los móviles son compatibles'] },
  { question: ['personalizar'], answer: ['el diseño, la información que quieres compartir y la configuración', 'dependen del formato elegido', 'se concretan en el presupuesto'] },
  { question: ['cambiar después', 'el destino'], answer: ['Depende de la solución acordada.', 'un chip NFC puede estar bloqueado', 'consúltalo antes', 'sin prometer actualizaciones gratuitas'] },
  { question: ['cantidades'], answer: ['una cantidad aproximada', 'Confirmaremos las opciones y las cantidades posibles'] },
  { question: ['solicito un presupuesto'], answer: ['Elige un producto', 'la cantidad aproximada', 'escribirnos por WhatsApp', 'antes de preparar el pedido'] },
] as const;

export const productFaqs = [
  { question: '¿Qué diferencia hay entre QR y NFC?', answer: 'El QR se escanea con la cámara del móvil. El NFC permite abrir la información acercando un móvil compatible al producto, con NFC activado. Son dos maneras de acceder al destino acordado.' },
  { question: '¿Funcionan con cualquier móvil?', answer: 'El QR necesita una cámara o aplicación capaz de leerlo y, para abrir una web, conexión a internet. El NFC depende del modelo, sus ajustes y el sistema operativo. Revisamos contigo la opción adecuada; no todos los móviles son compatibles.' },
  { question: '¿Se pueden personalizar?', answer: 'Acordamos contigo el diseño, la información que quieres compartir y la configuración. Las posibilidades dependen del formato elegido y se concretan en el presupuesto.' },
  { question: '¿Puedo cambiar después la información o el destino?', answer: 'Depende de la solución acordada. El destino de un QR impreso no se puede reimprimir a distancia y un chip NFC puede estar bloqueado. Si necesitas cambios futuros, consúltalo antes: valoraremos la configuración y sus condiciones, sin prometer actualizaciones gratuitas.' },
  { question: '¿Qué cantidades puedo pedir?', answer: 'Indícanos una cantidad aproximada, aunque todavía no sea definitiva. Confirmaremos las opciones y las cantidades posibles para el producto que te interesa al preparar el presupuesto.' },
  { question: '¿Cómo solicito un presupuesto?', answer: 'Elige un producto y cuéntanos para qué lo necesitas y, si la sabes, la cantidad aproximada. Puedes usar el formulario cuando esté disponible o escribirnos por WhatsApp. Concretaremos contigo diseño, configuración y presupuesto antes de preparar el pedido.' },
];
