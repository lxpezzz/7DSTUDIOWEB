import { webPricing, webCare, webOwnership, webMaintenanceScope, formatWebPrice } from './webPricing';

export interface ServiceFaq {
  question: string;
  answer: string;
  questionStrong: string[];
  answerStrong: string[];
  answerItalic?: string[];
}

export const webFaqs: ServiceFaq[] = [
  {
    question: '¿Qué necesito para tener una página web?',
    answer: 'Empezamos con información sobre tu negocio, tus servicios y las imágenes o materiales que tengas. Definimos contigo qué falta y qué alcance necesita el proyecto.',
    questionStrong: ['Qué necesito', 'página web'],
    answerStrong: ['información sobre tu negocio', 'imágenes o materiales', 'qué alcance necesita el proyecto'],
  },
  {
    question: '¿Cuánto cuesta crear una web para mi negocio?',
    answer: `La referencia para una web de una página es de ${formatWebPrice(webPricing.types[0].baseCents!)} + IVA. Si necesitas varias páginas o funcionalidades adicionales, puedes calcular un precio orientativo con nuestra calculadora. Después revisaremos contigo los detalles para confirmar el presupuesto.`,
    questionStrong: ['Cuánto cuesta'],
    answerStrong: [`${formatWebPrice(webPricing.types[0].baseCents!)} + IVA`, 'precio orientativo con nuestra calculadora', 'confirmar el presupuesto'],
  },
  {
    question: '¿Tengo que pagar todos los meses?',
    answer: `El diseño y desarrollo de la web se paga como un proyecto. ${webPricing.conditions.care} Te explicaremos todos los costes antes de empezar.`,
    questionStrong: ['pagar todos los meses'],
    answerStrong: ['se paga como un proyecto', 'Hosting y dominio incluidos', webCare.maintenance.priceLabel],
  },
  {
    question: '¿Qué incluye el mantenimiento mensual de 19 € + IVA?',
    answer: [
      ...webMaintenanceScope,
      `${webCare.maintenance.title}. ${webCare.maintenance.description} ${webCare.maintenance.requirement}`,
    ].join('\n\n'),
    questionStrong: ['mantenimiento mensual de 19 € + IVA'],
    answerStrong: [webCare.maintenance.title, '19 €/mes + IVA'],
  },
  {
    question: '¿El dominio es mío? ¿Puedo cambiar de proveedor?',
    answer: `${webOwnership.domain} ${webOwnership.continuity} ${webOwnership.handover}`,
    questionStrong: ['dominio es mío', 'cambiar de proveedor'],
    answerStrong: ['a nombre del cliente', webOwnership.continuity, 'trabajos de tu web que hayas abonado'],
  },
  {
    question: '¿Qué diferencia hay entre una web de una página y una web de varias páginas?',
    answer: 'La primera reúne la información en una única página. Una web de varias páginas reparte servicios, empresa y contacto en páginas independientes. La elección depende del contenido que necesites presentar.',
    questionStrong: ['web de una página', 'web de varias páginas'],
    answerStrong: ['una única página', 'páginas independientes', 'contenido que necesites presentar'],
  },
  {
    question: '¿Mi web funcionará en el móvil?',
    answer: 'Sí. Adaptamos el diseño a móvil, tablet y ordenador, y revisamos la navegación y las formas de contacto en diferentes tamaños de pantalla.',
    questionStrong: ['funcionará en el móvil'],
    answerStrong: ['Sí.', 'móvil, tablet y ordenador', 'navegación y las formas de contacto'],
  },
  {
    question: '¿Podré solicitar cambios después?',
    answer: `${webMaintenanceScope[0]} Si necesitas ampliar tu web más allá de lo incluido, te indicaremos el presupuesto antes de realizar esos trabajos adicionales.`,
    questionStrong: ['solicitar cambios después'],
    answerStrong: ['modificación sencilla mensual no acumulable', 'ampliar tu web más allá de lo incluido'],
  },
  {
    question: '¿Mi página aparecerá en Google?',
    answer: 'Preparamos la web para que los buscadores puedan entenderla. La indexación y el posicionamiento dependen de varios factores: no garantizamos posiciones. Si necesitas seguimiento, podemos valorar el servicio de SEO local.',
    questionStrong: ['aparecerá en Google'],
    answerStrong: ['los buscadores puedan entenderla', 'no garantizamos posiciones', 'SEO local'],
  },
  {
    question: '¿Qué ocurre si no sé qué tipo de web necesito?',
    answer: 'No necesitas llegar con todo decidido. Cuéntanos qué hace tu negocio y qué te gustaría conseguir; te ayudamos a elegir una opción adecuada antes de cerrar el presupuesto.',
    questionStrong: ['no sé qué tipo de web necesito'],
    answerStrong: ['No necesitas llegar con todo decidido.', 'te ayudamos a elegir una opción adecuada'],
  },
];

export const seoFaqs: ServiceFaq[] = [
  {
    question: '¿Necesito tener una página web para contratar SEO local?',
    answer: 'No necesariamente. Podemos empezar mejorando tu Perfil de Empresa en Google, aunque no tengas web. Si dispones de una, también podemos trabajar determinados aspectos para reforzar tu presencia online.',
    questionStrong: ['página web'],
    answerStrong: ['No necesariamente.', 'Perfil de Empresa en Google'],
  },
  {
    question: '¿Cuánto tiempo se tarda en notar resultados?',
    answer: [
      'El SEO local es una carrera de fondo, no un sprint. Algunas mejoras pueden apreciarse rápidamente, pero conseguir una presencia más sólida en Google requiere tiempo, constancia y seguimiento.',
      'Por eso, recomendamos trabajar durante un mínimo de 6 meses, para poder evaluar la evolución y realizar los ajustes necesarios.',
      'Los resultados dependen de cada negocio, su competencia y su situación inicial, por lo que no garantizamos posiciones ni plazos concretos.',
    ].join('\n\n'),
    questionStrong: ['notar resultados'],
    answerStrong: ['tiempo, constancia y seguimiento', 'mínimo de 6 meses', 'no garantizamos posiciones ni plazos concretos'],
    answerItalic: ['una carrera de fondo, no un sprint'],
  },
  {
    question: '¿Qué diferencia hay entre SEO Estándar y Premium?',
    answer: 'Estándar se centra en mantener y mejorar tu presencia local en Google. Premium incluye todo lo anterior y amplía el trabajo con SEO On-Page mensual, directorios profesionales, análisis de competencia y un seguimiento más detallado.',
    questionStrong: ['SEO Estándar y Premium'],
    answerStrong: ['Estándar', 'Premium incluye todo lo anterior', 'SEO On-Page mensual'],
  },
  {
    question: '¿Qué necesitáis para empezar a trabajar con mi negocio?',
    answer: 'Necesitaremos acceso autorizado a tu Perfil de Empresa de Google. Para las mejoras que afecten a tu página web, también necesitaremos permisos de edición. Te explicaremos cómo concedernos acceso de forma segura.',
    questionStrong: ['Qué necesitáis'],
    answerStrong: ['acceso autorizado', 'permisos de edición'],
    answerItalic: ['de forma segura'],
  },
  {
    question: '¿También os encargáis de responder a las reseñas de Google?',
    answer: 'Sí. Nos encargamos de gestionar y preparar respuestas personalizadas a las reseñas, siguiendo el tono de tu negocio. El alcance concreto dependerá del plan contratado.',
    questionStrong: ['responder a las reseñas de Google'],
    answerStrong: ['Sí.', 'respuestas personalizadas', 'plan contratado'],
  },
  {
    question: '¿Tengo que pagar a Google para que aparezca mi negocio?',
    answer: 'No. Crear y gestionar un Perfil de Empresa en Google es gratuito. Lo que pagas a 7DStudio es nuestro trabajo de optimización y seguimiento. Los anuncios de Google Ads son un servicio diferente.',
    questionStrong: ['pagar a Google'],
    answerStrong: ['No.', 'es gratuito', 'trabajo de optimización y seguimiento'],
    answerItalic: ['un servicio diferente'],
  },
  {
    question: 'Mi negocio ya aparece en Google. ¿Necesito SEO local?',
    answer: 'Puede que sí. Aparecer es solo el primer paso. Conviene revisar si tus servicios están bien explicados, si la información está actualizada y si tu ficha ayuda a los clientes a decidirse por tu negocio.',
    questionStrong: ['ya aparece en Google'],
    answerStrong: ['Puede que sí.', 'servicios están bien explicados', 'información está actualizada'],
  },
];
