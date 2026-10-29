export type WebTypeId = 'one-page' | 'corporate' | 'redesign' | 'custom';

export interface WebType {
  id: WebTypeId;
  name: string;
  description: string;
  baseCents: number | null;
  includedPages: number | null;
  provisional: boolean;
  included: readonly string[];
}

export interface WebExtra {
  id: string;
  name: string;
  description: string;
  unitCents: number;
  quantity: boolean;
  compatibleWith: readonly WebTypeId[];
  provisional: boolean;
}

const corporateIncludedPages = 5;


export const webPricing = {
  reviewRequired: true,
  defaultType: 'one-page' as WebTypeId,
  maxAdditionalPages: 20,
  types: [
    {
      id: 'one-page', name: 'Web de una página',
      description: 'Toda la información importante de tu negocio en una única página.',
      baseCents: 40000, includedPages: 1, provisional: false,
      included: ['Diseño adaptado a móvil, tablet y ordenador', 'Servicios e información de tu negocio en una página', 'Formulario de contacto y enlaces a tus vías de contacto', 'Enlace a WhatsApp o teléfono para que tus clientes puedan contactarte directamente','Optimización técnica de imágenes', 'Optimización y configuración de SEO básico'],
    },
    {
      id: 'corporate', name: 'Web corporativa',
      description: 'Varias páginas para explicar tus servicios, tu empresa y cómo contactar.',
      baseCents: 75000, includedPages: corporateIncludedPages, provisional: true,
      included: ['Diseño adaptado a móvil, tablet y ordenador', 'Organización de servicios, empresa y contacto', 'Formulario de contacto y enlaces a tus vías de contacto'],
    },
    {
      id: 'redesign', name: 'Rediseño de una web existente',
      description: 'Ya tienes una web, pero quieres mejorar su diseño o funcionamiento.',
      baseCents: null, includedPages: null, provisional: false,
      included: ['Valoramos tu web actual y el alcance de las mejoras antes de presupuestar.'],
    },
    {
      id: 'custom', name: 'Proyecto a medida',
      description: 'Necesitas una tienda online, funcionalidades especiales o algo diferente.',
      baseCents: null, includedPages: null, provisional: false,
      included: ['Tiendas online, integraciones complejas y desarrollos especiales requieren un análisis individual.'],
    },
  ] satisfies WebType[],
  extras: [
    { id: 'pages', name: 'Páginas adicionales', description: 'Se añaden a las páginas incluidas en la web corporativa.', unitCents: 9000, quantity: true, compatibleWith: ['corporate'], provisional: false },
    { id: 'catalogo', name: 'Catálogo de productos o servicios', description: 'Mostramos tus productos o servicios mediante un catálogo visual, con fotografías, descripciones y botones de consulta. Sin pagos online.', unitCents: 15000, quantity: false, compatibleWith: ['one-page', 'corporate'], provisional: false },
    { id: 'idioma', name: 'Web en otro idioma', description: 'Ofrece tu página web en un idioma adicional.', unitCents: 8000, quantity: false, compatibleWith: ['one-page', 'corporate'], provisional: false },
    { id: 'gallery', name: 'Galería o portfolio personalizado', description: 'Una selección organizada de imágenes o trabajos.', unitCents: 8000, quantity: false, compatibleWith: ['one-page', 'corporate'], provisional: false },
    { id: 'blog', name: 'Blog o noticias', description: 'Un apartado de publicaciones. No incluye redacción de artículos.', unitCents: 15000, quantity: false, compatibleWith: ['corporate'], provisional: false },
    { id: 'bookings', name: 'Integración con reservas externas', description: 'Conexión con una herramienta existente, no un motor de reservas a medida.', unitCents: 7500, quantity: false, compatibleWith: ['one-page', 'corporate'], provisional: false },
    { id: 'logo', name: 'Diseño de logotipo', description: 'Creamos un logotipo personalizado para representar tu negocio.', unitCents: 5000, quantity: false, compatibleWith: ['one-page', 'corporate'], provisional: false },
    { id: 'optimization-photos', name: 'Mejora de fotografías para tu web', description: 'Retocamos y preparamos hasta 10 fotografías que nos proporciones para que tu negocio tenga una imagen más cuidada.', unitCents: 5000, quantity: false, compatibleWith: ['one-page', 'corporate'], provisional: false },
    { id: 'profesional-photos', name: 'Fotografías profesionales para tu web', description: 'Imágenes de tu local, instalaciones, equipo o productos para mostrar tu negocio tal y como es.', unitCents: 15000, quantity: false, compatibleWith: ['one-page', 'corporate'], provisional: false },
    
    
  ] satisfies WebExtra[],
  conditions: {
    estimate: 'El precio es orientativo. El presupuesto definitivo se confirmará después de conocer los detalles del proyecto.',
    notIncluded: 'IVA no incluido. Hosting, dominio, mantenimiento y servicios SEO mensuales se valoran por separado; no están incluidos en este cálculo.',
    review: `Corporativa, sus ${corporateIncludedPages} páginas incluidas y todos los extras son provisionales y están pendientes de revisión comercial.`,
    scope: 'El alcance de contenidos, integraciones y publicación se acuerda antes de empezar. No incluye tarifas de plataformas externas.',
  },
};

export interface WebSelection {
  typeId: string;
  extraIds: readonly string[];
  additionalPages: number;
}

export function calculateWebQuote(selection: WebSelection) {
  const type = webPricing.types.find(type => type.id === selection.typeId) || webPricing.types[0];
  const selected = new Set(selection.extraIds);
  const count = Number.isFinite(selection.additionalPages)
    ? Math.max(0, Math.min(webPricing.maxAdditionalPages, Math.floor(selection.additionalPages))) : 0;
  const lines = type.baseCents === null ? [] : webPricing.extras.flatMap(extra => {
    if (!(extra.compatibleWith as readonly string[]).includes(type.id)) return [];
    const quantity = extra.quantity ? count : selected.has(extra.id) ? 1 : 0;
    return quantity > 0 ? [{ id: extra.id, name: extra.name, quantity, unitCents: extra.unitCents, amountCents: extra.unitCents * quantity, provisional: extra.provisional }] : [];
  });
  const totalCents = type.baseCents === null ? null : type.baseCents + lines.reduce((sum, line) => sum + line.amountCents, 0);
  return { type, lines, totalCents, provisional: type.provisional || lines.some(line => line.provisional) };
}

export function formatWebPrice(cents: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(cents / 100);
}

export function describeWebQuote(quote: ReturnType<typeof calculateWebQuote>) {
  return [
    `Tipo de web: ${quote.type.name}`,
    quote.type.baseCents === null ? 'Presupuesto personalizado: importe a confirmar tras analizar el proyecto.' : `Base: ${formatWebPrice(quote.type.baseCents)}`,
    ...(quote.type.includedPages ? [`Páginas incluidas: ${quote.type.includedPages}${quote.type.provisional ? ' (provisional)' : ''}`] : []),
    ...quote.lines.map(line => `${line.name} × ${line.quantity}: ${formatWebPrice(line.amountCents)}${line.provisional ? ' (provisional)' : ''}`),
    ...(quote.totalCents !== null ? [`Total orientativo: ${formatWebPrice(quote.totalCents)} + IVA${quote.provisional ? ' · contiene tarifas provisionales' : ''}`] : []),
    webPricing.conditions.estimate,
    webPricing.conditions.notIncluded,
    ...(webPricing.reviewRequired ? [webPricing.conditions.review] : []),
    webPricing.conditions.scope,
  ].join('\n');
}
