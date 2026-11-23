// Completar con datos contrastados del titular. No sustituir por datos de ejemplo.
export const legal = {
  updatedAt: '2026-11-04',
  reviewed: true,
  // Revisión editorial pendiente: no controla la activación técnica de formularios.
  // No marcar como completa sin verificar proveedores y condiciones pendientes.
  publicationReady: false,
  // Integración autorizada por el titular. La activación sigue sujeta a
  // completar la identidad y revisar la privacidad (site.privacyReady).
  formsEnabled: true,
  entityName: 'Héctor López Díaz',
  taxId: '20925225D',
  address: 'Calle Carlos González Espresati, 19, 12004 Castellón de la Plana, España',
  email: '7dstudio.es@gmail.com',
  registry: '',
  authorizations: '',
  hostingProvider: '',
  hostingLocation: '',
  emailProvider: '',
  retentionSchedule: '',
  paymentTerms: 'Según contrato o acuerdo previo',
  deliveryTerms: 'De 2 a 3 semanas desde la recepción del contenido necesario, según el alcance del proyecto',
  revisionTerms: 'Según contrato o acuerdo previo',
  cancellationTerms: 'Según contrato o acuerdo previo',
};

export const legalLinks = [
  { label: 'Aviso legal', href: '/aviso-legal/' },
  { label: 'Política de privacidad', href: '/politica-de-privacidad/' },
  { label: 'Política de cookies', href: '/politica-de-cookies/' },
  { label: 'Condiciones de contratación', href: '/condiciones-de-contratacion/' },
  { label: 'Contacto', href: '/contacto/' },
];

export const legalSources = {
  lssi: 'https://www.boe.es/eli/es/l/2002/07/11/34/con',
  gdpr: 'https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807',
  lopdgdd: 'https://www.boe.es/eli/es/lo/2018/12/05/3/con',
  consumers: 'https://www.boe.es/eli/es/rdlg/2007/11/16/1/con',
  aepd: 'https://www.aepd.es/',
  cookies: 'https://www.aepd.es/guias/guia-cookies.pdf',
  web3formsPrivacy: 'https://web3forms.com/privacy',
  web3formsDpa: 'https://web3forms.com/dpa',
};

export const pendingValue = (value: string) => value || 'Pendiente de confirmar';

export const formPrivacyNotice = `Responsable: ${legal.entityName}. Usamos tus datos para atender la consulta o preparar el presupuesto solicitado, sobre la base de medidas precontractuales o del consentimiento para otras consultas. Sin publicidad. El envío se procesa por Web3Forms y correo y puede implicar transferencias internacionales. Puedes solicitar acceso, rectificación, supresión y los demás derechos en ${legal.email}. Consulta los detalles y las verificaciones pendientes en la política de privacidad enlazada arriba.`;
