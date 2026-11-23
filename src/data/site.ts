import { legal, legalLinks } from './legal';

const identityComplete = Boolean(legal.entityName && legal.taxId && legal.address && legal.email);
// Web3Forms proporciona una clave pública para formularios de navegador.
const web3formsKey = import.meta.env.PUBLIC_WEB3FORMS_KEY?.trim() || '4b3c35fa-8f49-43d1-abb4-d0ff176c5677';
export const site = {
  name: '7DStudio',
  url: 'https://7dstudio.es',
  title: '7DStudio | Diseño web, SEO local y soluciones digitales',
  description: 'Diseñamos páginas web, mejoramos tu SEO local y creamos soluciones digitales para empresas y negocios. Estudio digital en Castellón.',
  phone: '621 200 800',
  phoneHref: 'tel:+34621200800',
  whatsapp: 'https://wa.me/34621200800',
  web3formsKey,
  privacyPolicyUrl: '/politica-de-privacidad/',
  // Una ruta existente no implica que el borrador esté revisado ni autoriza envíos.
  privacyReady: legal.reviewed && identityComplete,
  formsConfigured: legal.formsEnabled && legal.reviewed && identityComplete && Boolean(web3formsKey),
  legalLinks,
};

export const navigation = [
  { label: 'Inicio', href: '/' },
  { label: 'Diseño web', href: '/diseno-web/' },
  { label: 'Seo Local', href: '/seo-local/' },
  { label: 'Productos', href: '/productos/' },
  { label: 'Quiénes somos', href: '/quienes-somos/' },
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
  { label: 'Contacto', href: '/contacto/' },
];

export function getNavigation(_pathname: string) {
  return navigation;
}
