<template>
  <UPage>
    <ULandingHero
      orientation="horizontal"
      :title="title"
      :description="description"
      align="left"
      card
      :links="[
        {
          icon: 'i-lucide-shopping-cart',
          label: 'Check Price on Amazon',
          to: product.affiliate_link,
          target: '_blank',
          size: 'xl',
          block: true,
        },
      ]"
    >
      <NuxtImg
        :src="`https://api-affiliate-websites.com/assets/${product.image}`"
        :alt="product?.name || 'Image produit'"
        class="w-full rounded-md"
      />
    </ULandingHero>
    <UContainer class="max-w-screen-xl mx-auto">
      <UBreadcrumb :links="links" />
    </UContainer>
    <ULandingSection
      title="Key Features"
      :features="(product.features as string[]).map((res) => ({name: res}))"
    >
    </ULandingSection>
    <ULandingSection
      class="max-w-screen-md mx-auto font-medium"
      title="Who Is This Product Best For?"
      :description="product.suitability"
    >
    </ULandingSection>

    <ULandingSection title="Pro & Cons">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h3 class="text-2xl font-bold pb-5 text-green-700">Pros</h3>
          <ul class="pl-6 flex flex-col gap-4">
            <li
              class="font-medium flex items-center"
              v-for="pro in product.pros"
              :key="pro"
            >
              <UIcon
                name="i-lucide-check"
                class="text-green-500 w-5 h-5 mr-5"
              /><span>{{ pro }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-2xl font-bold pb-5 text-red-700">Cons</h3>
          <ul class="pl-6 flex flex-col gap-4">
            <li
              class="font-medium flex items-center"
              v-for="con in product.cons"
              :key="con"
            >
              <UIcon
                name="i-lucide-x"
                class="text-red-500 w-5 h-5 mr-5"
              /><span>{{ con }}</span>
            </li>
          </ul>
        </div>
      </div>
    </ULandingSection>
    <ULandingSection
      v-if="product.related_articles?.length"
      title="Related articles"
    >
      <UBlogList>
        <UBlogPost
          v-for="(article, index) in product.related_articles
            .filter((a) => a.articles_id)
            .map((res) => res.articles_id)"
          :key="index"
          :to="`/blog/${article?.slug || ''}`"
          :title="article.title"
          :description="article.description"
          :image="`https://api-affiliate-websites.com/assets/${article.image}`"
          :date="
            new Date(
              article?.date_updated || article.date_created
            ).toLocaleDateString('en', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          "
          :badge="{label: (article.category as ArticlesCategories).name}"
          :orientation="'vertical'"
          :ui="{
            description: 'line-clamp-2',
          }"
        />
        <!-- :class="[index === 0 && 'col-span-full']" -->
      </UBlogList>
    </ULandingSection>
    <UContainer class="max-w-screen-md mx-auto py-10">
      <UPageCard
        :ui="{ title: 'text-xl', description: 'text-md' }"
        title="Check price on Amazon"
        description="Get the best deal on this top-rated product! Click to check the latest price, read customer reviews, and see if there are any discounts available on Amazon today !"
        icon="i-lucide-shopping-cart"
        :to="product.affiliate_link"
        target="_blank"
      />
    </UContainer>
  </UPage>
</template>

<script setup lang="ts">
import {
  defineAggregateRating,
  defineBreadcrumb,
  defineOffer,
  defineProduct,
  useSchemaOrg,
} from '#imports';
import type {
  ArticlesCategories,
  ProductCategories,
  ProductsAffiliate,
} from '~~/types/directus';

const { website_id } = useRuntimeConfig().public;
const route = useRoute();
const { $directus, $readItems } = useNuxtApp();
const { data: product } = await useAsyncData(
  `get-product ${route.params.slug} `,
  () =>
    $directus.request(
      $readItems('products_affiliate', {
        fields: [
          '*',
          {
            category: ['name', 'slug', 'icon'],
            related_articles: [
              { articles_id: ['*', { category: ['name, slug'] }] },
            ],
          },
        ],
        filter: {
          _and: [
            {
              slug: {
                _eq: route.params.slug as string,
              },
            },
            {
              website: {
                _eq: website_id,
              },
            },
          ],
        },
      })
    ),
  { transform: (d) => d?.[0] }
);
console.log('Product', product.value);
if (!product?.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    message: "This page doesn't exist",
    fatal: true,
  });

const title = product.value.title;
const description = product.value.description;

const links = [
  {
    label: 'Products',
    icon: 'i-lucide-shopping-basket',
    to: '/products',
  },
  {
    label: (product.value.category as ProductCategories)?.name || 'Categories',
    icon: (product.value.category as ProductCategories)?.icon || '',
    to: `/products/category/${
      (product.value.category as ProductCategories)?.slug || ''
    }`,
  },
  {
    label: product.value.name,
  },
];

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: `https://api-affiliate-websites.com/assets/${product.value.image}`,
  twitterImage: `https://api-affiliate-websites.com/assets/${product.value.image}`,
});

useSchemaOrg([
  defineProduct({
    name: product.value.name,
    image: `https://api-affiliate-websites.com/assets/${product.value.image}`,
    description: product.value.description,
    offers: {
      url: product.value.affiliate_link,
      price: product.value.price,
      priceCurrency: 'USD',
      availability: 'InStock',
    },
  }),
  defineOffer({
    '@type': 'Offer',
    url: product.value.affiliate_link,
    price: product.value.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock', // Ou 'https://schema.org/OutOfStock' si indisponible
    itemCondition: 'https://schema.org/NewCondition', // L'état du produit
    seller: {
      '@type': 'Organization',
      name: 'Amazon',
      url: 'https://www.amazon.com',
    },
  }),

  defineOffer({
    '@type': 'Offer',
    url: product.value.affiliate_link,
    price: product.value.price,
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock', // Ou 'https://schema.org/OutOfStock' si indisponible
    itemCondition: 'https://schema.org/NewCondition', // L'état du produit
    seller: {
      '@type': 'Organization',
      name: 'Amazon',
      url: 'https://www.amazon.com',
    },
  }),

  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Products',
        item: 'https://www.camp-venture.com/products',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.value.name,
        item: `https://www.camp-venture.com/products/${product.value.slug}`,
      },
    ],
  }),
]);
</script>
