import { defineSitemapEventHandler } from '#imports';
import { Articles, ArticlesCategories } from '~/types/directus';

export default defineSitemapEventHandler(async (event) => {
  // fetch data directly in the correct type
  const { apiUrl } = useRuntimeConfig(event);

  const articlesCategories = await $fetch<{ data: ArticlesCategories[] }>(
    `${apiUrl}/items/articles_categories`
  ).then((res) => res.data);

  const articles = await $fetch<{ data: Articles[] }>(
    `${apiUrl}/items/articles`
  ).then((res) => res.data);

  const staticUrls = ['/contact', '/privacy-policy'];

  return [
    // map URLS as needed
    ...staticUrls.map((loc) => ({
      loc,
    })),
    ...articlesCategories.map((c) => ({
      loc: `blog/category/${c.slug}`,
      lastmod: c?.date_updated || (c.date_created as string),
    })),
    ...articles.map((c) => ({
      loc: `blog/${c.slug}`,
      lastmod: c?.date_updated || (c.date_created as string),
    })),
  ];
});
