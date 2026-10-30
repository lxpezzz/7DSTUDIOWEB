import { webPricing, formatWebPrice } from './webPricing';
import { seoPlans } from './seoPlans';
import { productFaqs } from './products';

interface Faq {
  question: string;
  answer: string;
  highlight: readonly string[];
  link?: { href: string; label: string };
}

interface FaqCategory {
  id: string;
  title: string;
  questions: readonly Faq[];
}

const onePage = webPricing.types.find(type => type.id === 'one-page')!;
const corporate = webPricing.types.find(type => type.id === 'corporate')!;
const standard = seoPlans.find(plan => plan.id === 'seo-estandar')!;
const premium = seoPlans.find(plan => plan.id === 'seo-premium')!;
const formatSeoPrice = (price: number) => new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
}).format(price);

export const faqCategories: readonly FaqCategory[] = [
  {
    id: 'general',
    title: 'General',
    questions: [
      {
        question: '¿Qué servicios ofrece 7D Studio?',
        answer: 'Diseñamos páginas web, trabajamos el SEO Local y preparamos productos físicos QR y NFC personalizados. Puedes contar con nosotros para presentar tu negocio, cuidar cómo aparece en Google o facilitar que tus clientes accedan a tu información. Cada servicio tiene su propio alcance y presupuesto.',
        highlight: ['páginas web', 'SEO Local', 'productos físicos QR y NFC personalizados'],
      },
      {
        question: '¿Trabajáis con cualquier tipo de negocio?',
        answer: 'Trabajamos con empresas, profesionales y negocios locales. Antes de aceptar un proyecto, revisamos qué necesitas y si nuestros servicios encajan con tu actividad y tus objetivos. No todas las soluciones son adecuadas para todos los casos; te explicaremos qué podemos abordar y qué habría que valorar por separado.',
        highlight: ['empresas, profesionales y negocios locales', 'si nuestros servicios encajan'],
      },
      {
        question: '¿Qué ocurre si no sé qué servicio necesito?',
        answer: 'No necesitas llegar con todo decidido. Cuéntanos qué hace tu negocio, cómo te encuentran tus clientes y qué te gustaría mejorar. Te ayudamos a distinguir si necesitas una web, trabajar tu presencia local o facilitar el contacto con un producto QR/NFC antes de concretar una propuesta.',
        highlight: ['No necesitas llegar con todo decidido.', 'antes de concretar una propuesta'],
      },
    ],
  },
  {
    id: 'diseno-web',
    title: 'Diseño Web',
    questions: [
      {
        question: '¿Cuánto cuesta crear una página web?',
        answer: `La web de una página tiene un precio base de ${formatWebPrice(onePage.baseCents!)} + IVA y la corporativa, de ${formatWebPrice(corporate.baseCents!)} + IVA. Los extras dependen de lo que necesites. La calculadora muestra un precio orientativo; después revisamos contigo los detalles para confirmar el presupuesto. Dominio, alojamiento y mantenimiento se valoran por separado.`,
        highlight: [`${formatWebPrice(onePage.baseCents!)} + IVA`, `${formatWebPrice(corporate.baseCents!)} + IVA`, 'confirmar el presupuesto'],
        link: { href: '/diseno-web/#presupuesto', label: 'Calcular el presupuesto de mi web' },
      },
      {
        question: '¿Qué diferencia hay entre una web One Page y una corporativa?',
        answer: `Una One Page reúne la información en una única página. Una corporativa reparte servicios, empresa y contacto en varias páginas; nuestra configuración base incluye ${corporate.includedPages}. La elección depende de cuánto contenido necesitas presentar y de cómo quieres organizarlo para tus clientes, no de que una opción sea siempre mejor.`,
        highlight: ['una única página', 'varias páginas', 'cuánto contenido necesitas presentar'],
        link: { href: '/diseno-web/', label: 'Conocer las opciones de diseño web' },
      },
      {
        question: '¿Cuánto tardáis en tener lista una web?',
        answer: 'El plazo se acuerda después de revisar el alcance y los materiales disponibles. Una web sencilla no requiere el mismo trabajo que un proyecto con varias páginas o funciones especiales. Antes de empezar, concretamos contigo la planificación; no aplicamos un plazo de siete días a todos los proyectos.',
        highlight: ['El plazo se acuerda', 'el alcance y los materiales disponibles', 'concretamos contigo la planificación'],
      },
      {
        question: '¿Mi página funcionará en móviles y tablets?',
        answer: 'Sí. Adaptamos el diseño a móvil, tablet y ordenador, y revisamos la navegación y las formas de contacto en diferentes tamaños de pantalla. Así, la información y los botones se organizan según el espacio disponible, en lugar de limitarse a reducir la versión de escritorio.',
        highlight: ['Sí.', 'móvil, tablet y ordenador', 'la navegación y las formas de contacto'],
      },
      {
        question: '¿Tengo que proporcionar los textos y fotografías?',
        answer: 'Empezamos con información sobre tu negocio, tus servicios y las imágenes o materiales que tengas. Definimos contigo qué falta y qué alcance necesita el proyecto. Si necesitas ayuda adicional con los contenidos o las fotografías, la valoramos antes de presupuestar; no damos por incluida su creación en todos los proyectos.',
        highlight: ['las imágenes o materiales que tengas', 'qué falta y qué alcance necesita el proyecto', 'no damos por incluida su creación'],
      },
    ],
  },
  {
    id: 'seo-local',
    title: 'SEO Local',
    questions: [
      {
        question: '¿Qué es el SEO Local y para qué sirve?',
        answer: 'Es el trabajo de mejorar cómo se presenta tu negocio en las búsquedas locales de Google. Revisamos tu Perfil de Empresa, la información, las reseñas y otros aspectos según el plan. Sirve para que quienes buscan tus servicios en tu zona encuentren información útil y actualizada, sin garantizar posiciones ni ventas.',
        highlight: ['las búsquedas locales de Google', 'información útil y actualizada', 'sin garantizar posiciones ni ventas'],
        link: { href: '/seo-local/', label: 'Entender cómo trabajamos el SEO Local' },
      },
      {
        question: '¿Necesito una página web para aparecer en Google?',
        answer: 'No necesariamente. Podemos empezar mejorando tu Perfil de Empresa en Google, aunque no tengas web, siempre que tu negocio cumpla los requisitos de Google. Si dispones de una, también podemos trabajar determinados aspectos para reforzar tu presencia online. Las mejoras en tu web requieren los permisos de edición correspondientes.',
        highlight: ['No necesariamente.', 'Perfil de Empresa en Google', 'cumpla los requisitos de Google'],
      },
      {
        question: '¿Cuánto se tarda en notar resultados?',
        answer: 'No hay un plazo garantizado. Algunas mejoras pueden apreciarse pronto, pero una presencia más sólida requiere tiempo, constancia y seguimiento. Recomendamos trabajar durante un mínimo de seis meses para evaluar la evolución y hacer ajustes. Los resultados dependen de tu situación inicial y la competencia; no garantizamos posiciones ni plazos concretos.',
        highlight: ['No hay un plazo garantizado.', 'Recomendamos', 'no garantizamos posiciones ni plazos concretos'],
      },
      {
        question: '¿Qué diferencia hay entre los planes Estándar y Premium?',
        answer: `${standard.name} (${formatSeoPrice(standard.price)}${standard.period} ${standard.taxLabel}) se centra en mantener y mejorar tu presencia local en Google. ${premium.name} (${formatSeoPrice(premium.price)}${premium.period} ${premium.taxLabel}) incluye lo anterior y amplía el trabajo con mejoras mensuales de la web, directorios profesionales, análisis de competencia y un seguimiento más detallado. Las tareas web requieren acceso autorizado.`,
        highlight: [standard.name, premium.name, 'mejoras mensuales de la web', 'acceso autorizado'],
        link: { href: '/seo-local/#planes', label: 'Comparar el alcance de los planes SEO' },
      },
    ],
  },
  {
    id: 'productos-qr-nfc',
    title: 'Productos QR y NFC',
    questions: [
      {
        question: '¿Cuál es la diferencia entre QR y NFC?',
        answer: productFaqs[0].answer,
        highlight: ['El QR se escanea con la cámara', 'acercando un móvil compatible', 'con NFC activado'],
      },
      {
        question: '¿Son compatibles con todos los móviles?',
        answer: productFaqs[1].answer,
        highlight: ['conexión a internet', 'depende del modelo, sus ajustes y el sistema operativo', 'no todos los móviles son compatibles'],
      },
      {
        question: '¿Qué información puedo compartir con estos productos?',
        answer: 'Puedes dirigir a tus clientes a tu contacto, web, WhatsApp, reseñas, redes sociales, reservas o catálogo. Acordamos el destino y la configuración según el formato y su compatibilidad. El producto facilita el acceso; no incluye por sí solo crear una web, un catálogo o una herramienta de reservas.',
        highlight: ['Acordamos el destino y la configuración', 'El producto facilita el acceso'],
        link: { href: '/productos/', label: 'Explorar los productos QR y NFC' },
      },
      {
        question: '¿Puedo cambiar el enlace después de recibir el producto?',
        answer: productFaqs[3].answer,
        highlight: ['Depende de la solución acordada.', 'un chip NFC puede estar bloqueado', 'consúltalo antes'],
      },
    ],
  },
  {
    id: 'presupuestos-contratacion',
    title: 'Presupuestos y contratación',
    questions: [
      {
        question: '¿Cómo puedo solicitar un presupuesto?',
        answer: 'Cuéntanos qué negocio tienes, qué servicio te interesa y qué te gustaría conseguir. Puedes escribirnos por WhatsApp o utilizar el formulario de contacto cuando esté disponible. Si buscas una web, la calculadora te ayuda a preparar una orientación inicial; el presupuesto definitivo se confirma después de revisar los detalles.',
        highlight: ['qué servicio te interesa', 'el presupuesto definitivo se confirma después'],
        link: { href: '/preguntas-frecuentes/#contacto', label: 'Ir al contacto de 7D Studio' },
      },
      {
        question: '¿Tengo que pagar una cuota mensual?',
        answer: 'El diseño y desarrollo de la web se paga como un proyecto. El dominio y el alojamiento pueden tener costes periódicos; el mantenimiento se valora por separado. Los planes de SEO Local son mensuales. Los productos QR/NFC se presupuestan según lo acordado. Te explicaremos los costes y las condiciones antes de empezar.',
        highlight: ['se paga como un proyecto', 'pueden tener costes periódicos', 'Los planes de SEO Local son mensuales', 'antes de empezar'],
      },
      {
        question: '¿Puedo contratar varios servicios?',
        answer: 'Sí. Podemos valorar juntos una web, el trabajo de SEO Local y los productos QR/NFC que necesite tu negocio. Revisamos qué aporta cada servicio y concretamos su alcance y presupuesto. Contratarlos juntos no implica que todos estén incluidos en un mismo precio ni que haya descuentos automáticos.',
        highlight: ['Sí.', 'su alcance y presupuesto', 'no implica que todos estén incluidos'],
      },
      {
        question: '¿Podré solicitar cambios o ampliaciones después?',
        answer: 'Por supuesto. Si más adelante necesitas actualizar información, añadir servicios o ampliar tu web, podemos ayudarte. Te indicaremos el presupuesto antes de realizar cualquier modificación. En los productos QR/NFC, cambiar el destino depende de la configuración acordada; conviene consultarlo antes si prevés necesitar actualizaciones.',
        highlight: ['presupuesto antes de realizar cualquier modificación', 'depende de la configuración acordada'],
      },
    ],
  },
];
