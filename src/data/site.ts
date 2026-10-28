export const site = {
  name: '7D Studio',
  url: 'https://7dstudio.es',
  title: '7D Studio | Diseño web, SEO local y soluciones digitales',
  description: 'Diseñamos páginas web, mejoramos tu SEO local y creamos soluciones digitales para empresas y negocios. Estudio digital en Castellón.',
  phone: '621 200 800',
  phoneHref: 'tel:+34621200800',
  whatsapp: 'https://wa.me/34621200800',
  web3formsKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || '',
  // No publicar enlaces legales hasta disponer de textos revisados y datos del titular.
  legalLinks: [] as { label: string; href: string }[],
};

export const navigation = [
  { label: 'Servicios', href: '/#servicios' },
  { label: 'Proyectos', href: '/#proyectos' },
  { label: 'Estudio', href: '/#estudio' },
  { label: 'Contacto', href: '/#contacto' },
];
