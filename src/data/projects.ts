// Añadir exclusivamente proyectos reales y capturas con permiso de publicación.
// Las demos y proyectos propios deben identificarse explícitamente en `kind`.
export interface Project {
  name: string;
  category: string;
  services: string;
  kind: 'Cliente' | 'Proyecto propio' | 'Demostración';
  image: string;
  width: number;
  height: number;
  alt: string;
  href?: string;
}

export const projects: Project[] = [];
