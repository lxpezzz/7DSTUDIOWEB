// Completar con datos contrastados del titular. No sustituir por datos de ejemplo.
export const legal = {
  updatedAt: '2026-10-30',
  reviewed: false,
  // Mantener false: el titular aún no ha creado su cuenta de Web3Forms.
  formsEnabled: false,
  entityName: '',
  taxId: '',
  address: '',
  email: '',
  registry: '',
  authorizations: '',
  hostingProvider: '',
  hostingLocation: '',
  emailProvider: '',
  retentionSchedule: '',
  paymentTerms: '',
  deliveryTerms: '',
  revisionTerms: '',
  cancellationTerms: '',
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

export const pendingValue = (value: string) => value || '…';
