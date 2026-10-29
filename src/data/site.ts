export const site = {
  name: '7D Studio',
  url: 'https://7dstudio.es',
  title: '7D Studio | Diseño web, SEO local y soluciones digitales',
  description: 'Diseñamos páginas web, mejoramos tu SEO local y creamos soluciones digitales para empresas y negocios. Estudio digital en Castellón.',
  phone: '621 200 800',
  phoneHref: 'tel:+34621200800',
  whatsapp: 'https://wa.me/34621200800',
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || '',
  // URL de la política publicada y revisada. Sin ella, el formulario no admite envíos.
  privacyPolicyUrl: import.meta.env.PUBLIC_PRIVACY_POLICY_URL || '',
  // No publicar enlaces legales hasta disponer de textos revisados y datos del titular.
  legalLinks: [] as { label: string; href: string }[],
};

export const navigation = [
  { label: 'Páginas web', href: '/diseno-web/' },
  { label: 'Seo Local', href: '/seo-local/' },
  { label: 'Productos', href: '/#productos' },
  { label: 'Preguntas frecuentes', href: '/diseno-web/#preguntas-web' },
  { label: 'Cómo trabajamos', href: '/#como-trabajamos' },
  { label: 'Contacto', href: '/#contacto' },
];

export function getNavigation(pathname: string) {
  const seo = pathname.startsWith('/seo-local');
  const web = pathname.startsWith('/diseno-web');
  return navigation.map(item => {
    if (item.label === 'Contacto') {
      return { ...item, href: seo ? '/seo-local/#contacto-seo' : web ? '/diseno-web/#contacto-web' : '/#contacto' };
    }
    if (item.label === 'Preguntas frecuentes' && seo) {
      return { ...item, href: '/seo-local/#preguntas-seo' };
    }
    return item;
  });
}
