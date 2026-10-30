import { legal, legalLinks } from './legal';

const identityComplete = Boolean(legal.entityName && legal.taxId && legal.address && legal.email);
export const site = {
  name: '7D Studio',
  url: 'https://7dstudio.es',
  title: '7D Studio | Diseño web, SEO local y soluciones digitales',
  description: 'Diseñamos páginas web, mejoramos tu SEO local y creamos soluciones digitales para empresas y negocios. Estudio digital en Castellón.',
  phone: '621 200 800',
  phoneHref: 'tel:+34621200800',
  whatsapp: 'https://wa.me/34621200800',
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || '',
  privacyPolicyUrl: '/politica-de-privacidad/',
  // Una ruta existente no implica que el borrador esté revisado ni autoriza envíos.
  privacyReady: legal.reviewed && identityComplete,
  formsConfigured: legal.formsEnabled && legal.reviewed && identityComplete && Boolean(import.meta.env.PUBLIC_WEB3FORMS_KEY),
  legalLinks,
};

export const navigation = [
  { label: 'Páginas web', href: '/diseno-web/' },
  { label: 'Seo Local', href: '/seo-local/' },
  { label: 'Productos', href: '/productos/' },
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
  { label: 'Quiénes somos', href: '/quienes-somos/' },
  { label: 'Contacto', href: '/contacto/' },
];

export function getNavigation(_pathname: string) {
  return navigation;
}
