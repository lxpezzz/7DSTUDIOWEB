export interface Service {
  id: 'diseno-web' | 'seo-local' | 'productos-fisicos';
  title: string;
  description: string;
  tags: readonly string[];
  scene: 'web' | 'local' | 'digital';
  route: string;
  published: boolean;
}

// Activar published SOLO cuando esté terminada y publicada la página real.
export const services: readonly Service[] = [
  {
    id: 'diseno-web', title: 'Diseño web', scene: 'web',
    description: 'Webs profesionales que transmiten confianza y facilitan el contacto.',
    tags: ['Landing pages', 'Webs corporativas', 'Rediseños'],
    route: '/diseno-web/', published: false,
  },
  {
    id: 'seo-local', title: 'SEO local', scene: 'local',
    description: 'Mejoramos tu visibilidad en Google para que tus clientes puedan encontrarte.',
    tags: ['Perfil de Empresa', 'Reseñas', 'Optimización local'],
    route: '/seo-local/', published: true,
  },
  {
    id: 'productos-fisicos', title: 'Productos físicos', scene: 'digital',
    description: 'Productos físicos personalizados con QR y NFC para mejorar la experiencia de tus clientes.',
    tags: ['QR', 'NFC', 'Personalizados'],
    route: '/productos/', published: false,
  },
];

export function getServiceHref(service: Service, pageFiles: readonly string[]): string | undefined {
  if (!service.published) return undefined;
  const stem = service.route.replace(/^\/|\/$/g, '');
  const exists = pageFiles.some(file =>
    file === `../../pages/${stem}.astro` || file === `../../pages/${stem}/index.astro` ||
    file === `../../pages/${stem}.md` || file === `../../pages/${stem}/index.md`);
  return exists ? service.route : undefined;
}
