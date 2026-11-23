import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { legal, legalLinks } from './src/data/legal.ts';

export default defineConfig({
  site: 'https://7dstudio.es',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({
    filter: (page) => {
      const pathname = new URL(page).pathname;
      const isLegalPage = legalLinks.some((link) => link.href !== '/contacto/' && link.href === pathname);
      return !pathname.startsWith('/demos/') && (legal.publicationReady || !isLegalPage);
    },
  })],
  vite: { plugins: [tailwindcss()] },
});
