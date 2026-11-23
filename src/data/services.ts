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
    description: 'Webs a medida que transmiten confianza y convierten visitas en clientes.',
    tags: ['Landing pages', 'Webs corporativas', 'Rediseños'],
    route: '/diseno-web/', published: true,
  },
  {
    id: 'seo-local', title: 'SEO local', scene: 'local',
    description: 'Mejora tu visibilidad en Google y atrae clientes en tu zona.',
    tags: ['Perfil de Empresa', 'Reseñas', 'Optimización local'],
    route: '/seo-local/', published: true,
  },
  {
    id: 'productos-fisicos', title: 'Soluciones QR y NFC', scene: 'digital',
    description: 'Soportes con QR y NFC que conectan tu local con tu web al instante.',
    tags: ['QR', 'NFC', 'Personalización'],
    route: '/productos/', published: true,
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
