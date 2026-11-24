import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    category: z.enum(['Diseño web', 'SEO local', 'QR y NFC']),
    readingTime: z.string(),
    summary: z.string(),
    relatedService: z.object({
      href: z.string(),
      label: z.string(),
      eyebrow: z.string(),
      title: z.string(),
      text: z.string(),
    }),
  }),
});

export const collections = { blog };
