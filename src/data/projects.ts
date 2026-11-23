// Única fuente de datos para la home y el futuro catálogo /proyectos/.
// Añadir solo capturas WebP autorizadas; importar su metadata desde src/images/projects/.
// No hay capturas ni URLs de proyectos disponibles todavía: no publicar ejemplos ficticios.
import tapnova from '../images/projects/tapnova.webp';
import psicoinfantil from '../images/projects/psicoinfantil.webp';
import margen from '../images/projects/margen.webp';
import valero from '../images/projects/valero.webp';
import huella from '../images/projects/huella.webp';
import type { ImageMetadata } from 'astro';


export interface Project {
  id: string;
  title: string;
  sector: string;
  description: string;
  highlights?: readonly string[];
  image: ImageMetadata & {
    alt: string;
  };
  // Completar únicamente después de comprobar que la demo publicada funciona.
  demoUrl?: string;
  featured: boolean;
  type: 'demo' | 'client' | 'own';
}

export const projects: Project[] = [
  {
    id: 'tapnova',
    title: 'TAPNOVA',
    sector: 'Tecnología',
    description: 'Pagina web de TAPNOVA, empresa tecnológica especializada en soluciones digitales para la hostelería.',
    image: { ...tapnova, alt: 'Pagina web de TAPNOVA, empresa tecnológica especializada en soluciones digitales para la hostelería.' },
    demoUrl: 'https://tapnova.es/',
    featured: true,
    type: 'client',
  },
  {
    id: 'psicoinfantil',
    title: 'PSICOINFANTIL CASTELLÓN',
    sector: 'Psicología infantil',
    description: 'Pagina web de PSICOINFANTIL, empresa de psicología infantil y juvenil en Castellón.',
    image: { ...psicoinfantil, alt: 'Pagina web de PSICOINFANTIL, empresa de psicología infantil y juvenil en Castellón.' },
    demoUrl: 'https://psicoinfantilcastellon.com/',
    featured: true,
    type: 'client',
  },
  {
    id: 'margen',
    title: 'MARGEN — Hair Studio',
    sector: 'Peluquería boutique · Demo premium',
    description: 'Una experiencia editorial para una peluquería de autor. Fotografía protagonista, diseño a medida y una forma diferente de mostrar cada transformación.',
    highlights: ['Diseño editorial', 'Lookbook fotográfico', 'Antes & Después'],
    image: { ...margen, alt: 'Captura de la web conceptual MARGEN — Hair Studio, con hero editorial de peluquería boutique.' },
    demoUrl: 'https://peluqueria.7dstudio.es/',
    featured: true,
    type: 'demo',
  },
  {
    id: 'valero',
    title: 'VALERO — Asesoría Familiar',
    sector: 'Asesoría · Demo interactiva',
    description: 'Una visita digital por una asesoría familiar. Un recorrido arquitectónico conectado al scroll que permite descubrir sus servicios.',
    highlights: ['Scrollytelling arquitectónico', 'Fotografía de interiores', 'Páginas de servicios'],
    image: { ...valero, alt: 'Captura de la web conceptual VALERO — Asesoría Familiar, mostrando la entrada arquitectónica del despacho.' },
    demoUrl: 'https://asesoria.7dstudio.es/',
    featured: true,
    type: 'demo',
  },
  {
    id: 'huella',
    title: 'HUELLA',
    sector: 'Peluquería canina',
    description: 'Pagina web de HUELLA, empresa de peluquería canina.',
    image: { ...huella, alt: 'Pagina web de HUELLA, empresa de peluquería canina.' },
    demoUrl: '/demos/huella/',
    featured: true,
    type: 'demo',
  },
];

export function getHomeProjects(items: readonly Project[] = projects): Project[] {
  return items.filter(project => project.featured);
}

// La validación de formato no sustituye comprobar la publicación de cada demo.
export function getDemoUrl(value?: string): string | undefined {
  if (!value) return undefined;
  // Las demos integradas usan rutas locales, sin depender del dominio publicado.
  if (/^\/demos\/[a-z0-9-]+\/$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
