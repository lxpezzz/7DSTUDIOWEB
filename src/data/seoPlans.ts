import { site } from './site';

export interface SeoPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  taxLabel: string;
  description: string;
  included: readonly string[];
  excluded: readonly string[];
  scopeNote?: string;
  badge: string;
  cta: string;
  contactHref: string;
  order: number;
  featured: boolean;
}

// Límites compartidos por las prestaciones y sus aclaraciones.
export const seoPlanScope = {
  standardPublicationsPerMonth: 1,
  premiumPublicationsPerMonth: 2,
  premiumOnPagePagesPerMonth: 1,
  directoryActionsPerQuarter: 3,
  localCompetitors: 3,
};

export const seoPlanNotes = {
  webAccess: {
    eyebrow: 'ACCESO A TU WEB',
    title: 'Necesario para aplicar mejoras',
    text: 'Las tareas relacionadas con SEO On-Page requieren una web activa y acceso autorizado para poder realizar los cambios.',
    clarification: '* También para la auditoría y los ajustes iniciales, según las posibilidades técnicas de la web.',
  },
  onPage: {
    eyebrow: 'INCLUIDO EN PREMIUM',
    title: `URL optimizada al mes`,
    text: 'Trabajamos una página existente de tu web para mejorar cómo entiende Google tu negocio.',
    chips: ['Títulos SEO', 'Metadescripciones', 'Encabezados', 'Enlaces internos', 'Textos existentes', 'Alt de imágenes'],
  },
  excluded: {
    eyebrow: 'SIN CONFUSIONES',
    title: 'Un alcance claro',
    text: 'Antes de empezar, revisamos qué necesita tu negocio y qué incluye el plan. Si necesitas una web nueva o mejoras adicionales, te preparamos una propuesta aparte.',
  },
  general: 'Planes destinados a un negocio y una ubicación. Los servicios están sujetos a los accesos y permisos necesarios.',
  google: 'El Perfil de Empresa de Google es gratuito. Nuestros honorarios corresponden al trabajo profesional de optimización y seguimiento.',
};

// Las listas vacías no se renderizan. Premium enumera solo sus ampliaciones.
export const seoPlans: readonly SeoPlan[] = [
  {
    id: 'seo-estandar',
    name: 'SEO Estándar',
    price: 129,
    period: '/mes',
    taxLabel: '+ IVA',
    description: 'Para negocios que quieren empezar a trabajar su presencia local de forma profesional.',
    included: [
      'Optimización del Perfil de Empresa en Google.',
      'Auditoría SEO inicial de tu página web.*',
      'Ajustes SEO básicos de la web.*',
      'Gestión y respuesta de reseñas de Google.',
      `${seoPlanScope.standardPublicationsPerMonth} publicación mensual en Google.`,
      'Revisión de datos, servicios y horarios.',
      'Informe mensual de resultados.',
    ],
    excluded: [],
    scopeNote: 'La auditoría y los ajustes web forman parte de la puesta a punto inicial; no implican una optimización mensual ilimitada.',
    badge: '',
    cta: 'Consultar SEO Estándar',
    contactHref: '/seo-local/#contacto-seo',
    order: 1,
    featured: false,
  },
  {
    id: 'seo-premium',
    name: 'SEO Premium',
    price: 179,
    period: '/mes',
    taxLabel: '+ IVA',
    description: 'Para negocios que quieren trabajar su visibilidad con mayor intensidad, cuidar su reputación y conocer mejor a su competencia.',
    included: [
      'Todo lo incluido en SEO Estándar.',
      `${seoPlanScope.premiumPublicationsPerMonth} publicaciones mensuales en Google (en total).`,
      'Gestión ampliada y personalizada de reseñas.',
      `Optimización SEO On-Page de ${seoPlanScope.premiumOnPagePagesPerMonth} página al mes.*`,
      'Alta y gestión en directorios relevantes para tu negocio.',
      `Análisis de hasta ${seoPlanScope.localCompetitors} competidores locales.`,
      'Seguimiento ampliado de búsquedas locales.',
      'Informe mensual detallado con recomendaciones.',
    ],
    excluded: [],
    scopeNote: `Directorios: hasta ${seoPlanScope.directoryActionsPerQuarter} altas o actualizaciones por trimestre. Seleccionamos directorios locales, profesionales y sectoriales adecuados y mantenemos coherentes el nombre, dirección, teléfono y demás datos. Sin inscripciones masivas de baja calidad ni garantías de aceptación o mejora de posicionamiento.`,
    badge: '',
    cta: 'Consultar SEO Premium',
    contactHref: '/seo-local/#contacto-seo',
    order: 2,
    featured: true,
  },
];

export function getSeoPlanHref(plan: SeoPlan): string {
  const href = new URL(plan.contactHref, site.url);
  href.searchParams.set('plan', plan.id);
  return `${href.pathname}${href.search}${href.hash}`;
}
