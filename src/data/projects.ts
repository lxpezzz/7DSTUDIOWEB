// Única fuente de datos para la home, /proyectos/ y las fichas /proyectos/[slug]/.
// Añadir solo capturas WebP autorizadas; importar su metadata desde src/images/projects/.
// Publicar fichas de caso de estudio únicamente para proyectos reales verificados, sin métricas inventadas.
import tapnova from '../images/projects/tapnova.webp';
import psicoinfantil from '../images/projects/psicoinfantil.webp';
import margen from '../images/projects/margen.webp';
import valero from '../images/projects/valero.webp';
import huella from '../images/projects/huella.webp';
import type { ImageMetadata } from 'astro';

export interface ProjectCaseStudyPoint {
  title: string;
  text: string;
}

export interface ProjectCaseStudy {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  subtitle: string;
  location: string;
  services: readonly string[];
  challengeTitle: string;
  challenge: readonly string[];
  solutionTitle: string;
  solution: readonly string[];
  keyPoints: readonly ProjectCaseStudyPoint[];
  relatedLinks: readonly { href: string; label: string }[];
}

export interface Project {
  id: string;
  title: string;
  sector: string;
  description: string;
  highlights?: readonly string[];
  image: ImageMetadata & {
    alt: string;
  };
  // Completar únicamente después de comprobar que la web o demo publicada funciona.
  demoUrl?: string;
  featured: boolean;
  type: 'demo' | 'client' | 'own';
  caseStudy?: ProjectCaseStudy;
}

export const projects: Project[] = [
  {
    id: 'psicoinfantil',
    title: 'PSICOINFANTIL CASTELLÓN',
    sector: 'Psicología infantil y juvenil',
    description: 'Página web de PSICOINFANTIL CASTELLÓN, consulta de psicología infantil, juvenil y orientación familiar en Castellón de la Plana.',
    highlights: ['Arquitectura por áreas de atención', 'Diseño sereno para familias', 'Contacto directo'],
    image: { ...psicoinfantil, alt: 'Captura de la página web de PSICOINFANTIL CASTELLÓN, consulta de psicología infantil y juvenil en Castellón de la Plana.' },
    demoUrl: 'https://psicoinfantilcastellon.com/',
    featured: true,
    type: 'client',
    caseStudy: {
      slug: 'psicoinfantil-castellon',
      seoTitle: 'Diseño web para Psicoinfantil Castellón | Caso 7DStudio',
      seoDescription: 'Caso de diseño web en Castellón para Psicoinfantil Castellón: arquitectura clara por áreas de psicología infantil y juvenil, trato cercano y acceso rápido.',
      headline: 'Diseño web para Psicoinfantil Castellón',
      subtitle: 'Una presencia digital serena y estructurada para una consulta de psicología infantil, juvenil y orientación familiar en Castellón de la Plana.',
      location: 'Castellón de la Plana',
      services: [
        'Diseño web a medida',
        'Arquitectura de contenidos',
        'Adaptación móvil y escritorio',
        'SEO técnico base',
      ],
      challengeTitle: 'Transmitir cercanía y rigor desde la primera visita',
      challenge: [
        'Cuando una familia busca ayuda en psicología infantil o juvenil, necesita comprender con claridad qué áreas se trabajan, cómo es la atención en consulta y cómo pedir una primera cita sin sentirse abrumada por lenguaje clínico ni menús confusos.',
        'El objetivo de la web era presentar de forma ordenada especialidades distintas —psicología infantil, adolescencia y orientación vocacional, dificultades de aprendizaje, evaluación psicopedagógica y orientación familiar— reflejando el trato privado, cercano y sin esperas de la consulta en Castellón de la Plana.',
      ],
      solutionTitle: 'Estructura clara por necesidades reales y lectura reposada',
      solution: [
        'Se diseñó una web limpia, luminosa y fácil de recorrer en móvil, organizando cada área de intervención con explicaciones directas pensadas para madres y padres que buscan respuestas concretas.',
        'La navegación prioriza la comprensión del enfoque profesional, la ubicación de la consulta en Castellón y unas vías de contacto siempre accesibles, cuidando además la velocidad de carga y la base semántica para búsquedas locales.',
      ],
      keyPoints: [
        {
          title: 'Servicios organizados por etapas',
          text: 'Diferenciación clara entre psicología infantil, adolescencia, rendimiento escolar, evaluación psicopedagógica y asesoramiento familiar.',
        },
        {
          title: 'Tono visual tranquilo y legible',
          text: 'Jerarquía tipográfica cuidada y espacios limpios para acompañar una lectura pausada en un servicio sanitario y familiar.',
        },
        {
          title: 'Contacto directo desde móvil',
          text: 'Información de la consulta en Castellón de la Plana y acceso sencillo para resolver dudas o solicitar cita previa.',
        },
        {
          title: 'Base técnica rápida y semántica',
          text: 'Estructura HTML ordenada, imágenes optimizadas y etiquetado preparado para búsquedas locales en Google.',
        },
      ],
      relatedLinks: [
        { href: '/diseno-web/#presupuesto', label: 'Calcular presupuesto de una web similar' },
        { href: '/seo-local/', label: 'Ver servicio de SEO local en Castellón' },
      ],
    },
  },
  {
    id: 'tapnova',
    title: 'TAPNOVA',
    sector: 'Tecnología para hostelería',
    description: 'Página web de TAPNOVA, empresa especializada en soluciones físicas QR/NFC y servicios digitales para hostelería y sector HORECA.',
    highlights: ['Catálogo físico + digital', 'Narrativa comercial clara', 'Enfoque sector HORECA'],
    image: { ...tapnova, alt: 'Captura de la página web de TAPNOVA, empresa de soluciones QR/NFC y digitales para la hostelería.' },
    demoUrl: 'https://tapnova.es/',
    featured: true,
    type: 'client',
    caseStudy: {
      slug: 'tapnova',
      seoTitle: 'Diseño web para TAPNOVA (sector HORECA) | Caso 7DStudio',
      seoDescription: 'Caso de diseño web para TAPNOVA: presentación clara de soportes físicos QR y NFC y soluciones digitales orientadas a hoteles, restaurantes y cafeterías.',
      headline: 'Diseño web para TAPNOVA',
      subtitle: 'Una web comercial enfocada a explicar soluciones físicas QR/NFC y servicios digitales para hoteles, restaurantes y cafeterías.',
      location: 'España · Sector HORECA',
      services: [
        'Diseño web a medida',
        'Estructura comercial de oferta',
        'Adaptación móvil y escritorio',
        'Optimización de rendimiento y SEO base',
      ],
      challengeTitle: 'Explicar una oferta híbrida físico-digital en segundos',
      challenge: [
        'TAPNOVA combina soportes físicos personalizados con tecnología QR y NFC para mesa —como portacuentas artesanales, expositores y posavasos— junto con servicios digitales orientados a hostelería (web HORECA y visibilidad local).',
        'El reto era presentar ambos mundos de forma cohesionada para que cualquier responsable de restaurante, cafetería u hotel entendiera de inmediato qué hace cada soporte (cartas digitales, reseñas, reservas o redes sociales) y cómo solicitar información.',
      ],
      solutionTitle: 'Jerarquía visual directa orientada a consulta comercial',
      solution: [
        'Se planteó una arquitectura de página clara que separa los bloques de producto físico y servicio digital sin perder la unidad de marca, apoyándose en titulares directos y ejemplos de uso en sala.',
        'La experiencia está pensada para consultarse cómodamente desde el teléfono —el dispositivo más habitual en hostelería— manteniendo llamadas a la acción limpias, carga ligera y estructura semántica cuidada.',
      ],
      keyPoints: [
        {
          title: 'Oferta física y digital bien articulada',
          text: 'Presentación ordenada de soportes NFC/QR de mesa junto a las soluciones web y de visibilidad local para hostelería.',
        },
        {
          title: 'Casos de uso comprensibles al instante',
          text: 'Explicación directa de cómo un toque o escaneo lleva al cliente del local a la carta digital, las reseñas o las reservas.',
        },
        {
          title: 'Navegación ágil en móvil',
          text: 'Pensada para propietarios y gerentes de negocios HORECA que consultan y contactan directamente desde su smartphone.',
        },
        {
          title: 'Rendimiento técnico cuidado',
          text: 'Código ligero, recursos optimizados y estructura SEO base preparada para posicionar su propuesta en buscadores.',
        },
      ],
      relatedLinks: [
        { href: '/diseno-web/#presupuesto', label: 'Calcular presupuesto para tu web' },
        { href: '/productos/', label: 'Ver nuestros productos QR y NFC en Castellón' },
      ],
    },
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
    description: 'Página web de demostración para una peluquería canina: servicios claros, galería cuidada y contacto rápido.',
    highlights: ['Estructura de negocio local', 'Diseño cercano', 'Adaptación móvil'],
    image: { ...huella, alt: 'Captura de la demo conceptual HUELLA, página web de peluquería canina.' },
    demoUrl: '/demos/huella/',
    featured: true,
    type: 'demo',
  },
];

export function getHomeProjects(items: readonly Project[] = projects): Project[] {
  return items.filter(project => project.featured);
}

export function getClientProjects(items: readonly Project[] = projects): Project[] {
  return items.filter(project => project.type === 'client');
}

export function getDemoProjects(items: readonly Project[] = projects): Project[] {
  return items.filter(project => project.type === 'demo');
}

export function getProjectCaseStudies(items: readonly Project[] = projects): (Project & { caseStudy: ProjectCaseStudy })[] {
  return items.filter(
    (project): project is Project & { caseStudy: ProjectCaseStudy } =>
      project.type === 'client' && Boolean(project.caseStudy),
  );
}

export function getProjectCaseStudyHref(project: Project): string | undefined {
  return project.type === 'client' && project.caseStudy
    ? `/proyectos/${project.caseStudy.slug}/`
    : undefined;
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
