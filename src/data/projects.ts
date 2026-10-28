// Única fuente de datos para la home y el futuro catálogo /proyectos/.
// Añadir solo capturas WebP autorizadas; importar su metadata desde src/images/projects/.
// No hay capturas ni URLs de proyectos disponibles todavía: no publicar ejemplos ficticios.
import tapnova from '../images/projects/tapnova.webp';
import psicoinfantil from '../images/projects/psicoinfantil.webp';
import huella from '../images/projects/huella.webp';


export interface Project {
  id: string;
  title: string;
  sector: string;
  description: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  // Completar únicamente después de comprobar que la demo publicada funciona.
  demoUrl?: string;
  featured: boolean;
  type: 'demo' | 'client' | 'own';
}

export const projects: Project[] = [{
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
    id: 'huella',
    title: 'HUELLA ',
    sector: 'PELUQUERÍA CANINA',
    description: 'Pagina web de HUELLA, empresa de peluquería canina',
    image: { ...huella, alt: 'Pagina web de HUELLA, empresa de peluquería canina' },
    // demoUrl: 'https://psicoinfantilcastellon.com/'
    featured: true,
    type: 'demo',
  },
];

export function getHomeProjects(items: readonly Project[] = projects): Project[] {
  return items.filter(project => project.featured).slice(0, 4);
}

// La validación de formato no sustituye comprobar la publicación de cada demo.
export function getDemoUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}
