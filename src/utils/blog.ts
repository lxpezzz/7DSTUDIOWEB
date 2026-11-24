import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedBlogPosts(): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function hasPublishedBlogPosts(): Promise<boolean> {
  return (await getPublishedBlogPosts()).length > 0;
}
