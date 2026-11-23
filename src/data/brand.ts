// Fuente única de identidad: los originales se mantienen en /brand.
// Vite publica solo los archivos importados, con hash para la caché.
import logo from '../../brand/svg/7dstudio-logo-horizontal.svg?url';
import logoWhite from '../../brand/svg/7dstudio-logo-horizontal-white.svg?url';
import symbol from '../../brand/svg/7dstudio-isotipo.svg?url';
import socialImage from '../../brand/social/og-image.webp?url';
import twitterImage from '../../brand/social/twitter-card.webp?url';

export const brand = { logo, logoWhite, symbol, socialImage, twitterImage };
