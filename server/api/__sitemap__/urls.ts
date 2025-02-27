import { defineSitemapEventHandler } from '#imports';
import {
  Articles,
  ArticlesCategories,
  ProductCategories,
  ProductsAffiliate,
} from '~~/types/directus';

export default defineSitemapEventHandler(async (event) => {
  // fetch data directly in the correct type
  const { apiUrl } = useRuntimeConfig(event);

  const articlesCategories = await $fetch<{ data: ArticlesCategories[] }>(
    `${apiUrl}/items/articles_categories`
  ).then((res) => res.data);

  const articles = await $fetch<{ data: Articles[] }>(
    `${apiUrl}/items/articles`
  ).then((res) => res.data);

  const productsCategories = await $fetch<{ data: ProductCategories[] }>(
    `${apiUrl}/items/product_categories`
  ).then((res) => res.data);

  const products = await $fetch<{ data: ProductsAffiliate[] }>(
    `${apiUrl}/items/products_affiliate`
  ).then((res) => res.data);

  const staticUrls = [
    '/contact',
    '/privacy-policy',
    '/affiliate-disclosure',
    '/',
    '/terms-conditions',
  ];

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
    ...productsCategories.map((c) => ({
      loc: `products/category/${c.slug}`,
      lastmod: c?.date_updated || (c.date_created as string),
    })),
    ...products.map((c) => ({
      loc: `products/${c.slug}`,
      lastmod: c?.date_updated || (c.date_created as string),
    })),
  ];
});
