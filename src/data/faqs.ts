import { webCareTerms, webMaintenanceScope } from './webPricing';
import { productFaqs, productFaqEmphasis } from './products';
import { webFaqs, seoFaqs } from './serviceFaqs';

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

export const faqCategories: readonly FaqCategory[] = [
  {
    id: 'general',
    title: 'General',
    questions: [
      {
        question: '¿Qué servicios ofrece 7DStudio?',
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
      ...webFaqs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
        highlight: faq.answerStrong,
        link: { href: '/diseno-web/#presupuesto', label: 'Calcular el presupuesto de mi web' },
      })),
      {
        question: '¿Cuánto tardáis en tener lista una web?',
        answer: 'El plazo se acuerda después de revisar el alcance y los materiales disponibles. Una web sencilla no requiere el mismo trabajo que un proyecto con varias páginas o funciones especiales. Antes de empezar, concretamos contigo la planificación; no aplicamos un plazo de siete días a todos los proyectos.',
        highlight: ['El plazo se acuerda', 'el alcance y los materiales disponibles', 'concretamos contigo la planificación'],
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
      ...seoFaqs.map(faq => ({
        question: faq.question,
        answer: faq.answer,
        highlight: faq.answerStrong,
        link: { href: '/seo-local/', label: 'Conocer el servicio de SEO local' },
      })),
      {
        question: '¿Qué es el SEO Local y para qué sirve?',
        answer: 'Es el trabajo de mejorar cómo se presenta tu negocio en las búsquedas locales de Google. Revisamos tu Perfil de Empresa, la información, las reseñas y otros aspectos según el plan. Sirve para que quienes buscan tus servicios en tu zona encuentren información útil y actualizada, sin garantizar posiciones ni ventas.',
        highlight: ['las búsquedas locales de Google', 'información útil y actualizada', 'sin garantizar posiciones ni ventas'],
        link: { href: '/seo-local/', label: 'Entender cómo trabajamos el SEO Local' },
      },
    ],
  },
  {
    id: 'productos-qr-nfc',
    title: 'Productos QR y NFC',
    questions: [
      ...productFaqs.map((faq, index) => ({
        question: faq.question,
        answer: faq.answer,
        highlight: productFaqEmphasis[index].answer,
        link: { href: '/productos/', label: 'Explorar los productos QR y NFC' },
      })),
      {
        question: '¿Qué información puedo compartir con estos productos?',
        answer: 'Puedes dirigir a tus clientes a tu contacto, web, WhatsApp, reseñas, redes sociales, reservas o catálogo. Acordamos el destino y la configuración según el formato y su compatibilidad. El producto facilita el acceso; no incluye por sí solo crear una web, un catálogo o una herramienta de reservas.',
        highlight: ['Acordamos el destino y la configuración', 'El producto facilita el acceso'],
        link: { href: '/productos/', label: 'Explorar los productos QR y NFC' },
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
        link: { href: '/preguntas-frecuentes/#contacto', label: 'Ir al contacto de 7DStudio' },
      },
      {
        question: '¿Tengo que pagar una cuota mensual?',
        answer: `El diseño y desarrollo de la web se paga como un proyecto. ${webCareTerms} Los productos QR/NFC se presupuestan según lo acordado. Te explicaremos los costes y las condiciones antes de empezar.`,
        highlight: ['se paga como un proyecto', '3 meses de mantenimiento gratis', '19 €/mes + IVA', 'antes de empezar'],
      },
      {
        question: '¿Puedo contratar varios servicios?',
        answer: 'Sí. Podemos valorar juntos una web, el trabajo de SEO Local y los productos QR/NFC que necesite tu negocio. Revisamos qué aporta cada servicio y concretamos su alcance y presupuesto. Contratarlos juntos no implica que todos estén incluidos en un mismo precio ni que haya descuentos automáticos.',
        highlight: ['Sí.', 'su alcance y presupuesto', 'no implica que todos estén incluidos'],
      },
      {
        question: '¿Podré solicitar cambios o ampliaciones después?',
        answer: `${webMaintenanceScope[0]} Las ampliaciones fuera de lo incluido se presupuestan por separado. En los productos QR/NFC, cambiar el destino depende de la configuración acordada; conviene consultarlo antes si prevés necesitar actualizaciones.`,
        highlight: ['modificación sencilla mensual no acumulable', 'depende de la configuración acordada'],
      },
    ],
  },
];
