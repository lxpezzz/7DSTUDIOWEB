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
  badge: string;
  cta: string;
  order: number;
  featured: boolean;
}

// Añadir únicamente prestaciones acordadas. Las listas vacías no se renderizan.
export const seoPlans: readonly SeoPlan[] = [
  {
    id: 'seo-estandar',
    name: 'SEO Estándar',
    price: 129,
    period: '/mes',
    taxLabel: '+ IVA',
    description: 'Para negocios que quieren empezar a trabajar su presencia local de forma profesional.',
    included: [],
    excluded: [],
    badge: '',
    cta: 'Consultar SEO Estándar',
    order: 1,
    featured: false,
  },
  {
    id: 'seo-premium',
    name: 'SEO Premium',
    price: 179,
    period: '/mes',
    taxLabel: '+ IVA',
    description: 'Para negocios que buscan un trabajo más amplio y un seguimiento adaptado a sus necesidades.',
    included: [],
    excluded: [],
    badge: '',
    cta: 'Consultar SEO Premium',
    order: 2,
    featured: true,
  },
];

export function getSeoPlanHref(plan: SeoPlan): string {
  const href = new URL(site.whatsapp);
  href.searchParams.set('text', `Hola, me gustaría información sobre el plan ${plan.name} de SEO local para mi negocio.`);
  return href.href;
}
