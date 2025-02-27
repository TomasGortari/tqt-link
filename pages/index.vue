<script setup lang="ts">
import {
  defineOrganization,
  defineWebPage,
  defineWebSite,
  useSchemaOrg,
} from '#imports';
import type { ArticlesCategories, ProductCategories } from '~/types/directus';
const { website_id } = useRuntimeConfig().public;
const route = useRoute();
const { $directus, $readItems } = useNuxtApp();
const { data: productCategories } = await useAsyncData(
  'get-articles categories for homepage',
  () =>
    $directus.request(
      $readItems('product_categories', {
        fields: ['*'],
        limit: 6,
        filter: {
          website: {
            _eq: website_id,
          },
        },
      })
    ),
  {
    transform: (d) =>
      d.map((item) => ({
        label: item.name,
        to: `/products/category/${item.slug}`,
        icon: item.icon,
        color: 'primary',
        variant: 'outline',
        description: item.description,
      })),
  }
);

const { data: products } = await useAsyncData(`get-products homepage`, () =>
  $directus.request(
    $readItems('products_affiliate', {
      sort: ['-rating'],
      fields: [
        '*',

        {
          category: ['name', 'slug'],
        },
      ],
      filter: {
        website: {
          _eq: website_id,
        },
      },
      limit: 6,
    })
  )
);

const websiteFeatures = [
  {
    icon: 'i-lucide-tent',
    title: 'Expert Reviews',
    description: 'Curated by outdoor enthusiasts and gear experts.',
  },
  {
    icon: 'i-lucide-star',
    title: 'Trusted Recommendations',
    description: 'Tested & reviewed for performance.',
  },
  {
    icon: 'i-lucide-book-open',
    title: 'In-Depth Guides',
    description: 'Helping you make informed buying decisions.',
  },
  {
    icon: 'i-lucide-link',
    title: 'Affiliate Transparency',
    description: 'We earn commissions at no extra cost to you.',
  },
];

const { data: articles } = await useAsyncData('get-articles homepage', () =>
  $directus.request(
    $readItems('articles', {
      sort: ['-date_created'],
      limit: 6,
      fields: [
        '*',

        {
          category: ['name', 'slug'],
        },
      ],
      filter: {
        website: {
          _eq: website_id,
        },
      },
    })
  )
);

useSeoMeta({
  title: 'Expert Outdoor Gear Reviews & Camping Guides',
  ogTitle: 'Expert Outdoor Gear Reviews & Camping Guides',
  description:
    'CampVenture helps you find the best outdoor gear with expert reviews & in-depth camping guides. Plan your next adventure with confidence!',
  ogDescription:
    'CampVenture helps you find the best outdoor gear with expert reviews & in-depth camping guides. Plan your next adventure with confidence!',
});

useSchemaOrg([
  defineWebSite(),
  defineOrganization({
    name: 'CampVenture',
    url: 'https://www.camp-venture.com',
    logo: 'https://www.camp-venture.com/logo.png',
  }),
  defineWebPage({
    '@type': 'WebPage',
    name: 'Expert Outdoor Gear Reviews & Camping Guides',
    description:
      'CampVenture helps you find the best outdoor gear with expert reviews & in-depth camping guides. Plan your next adventure with confidence!',
    url: 'https://www.camp-venture.com',
  }),
]);
</script>

<template>
  <div>
    <ULandingHero
      orientation="horizontal"
      title="Find the Best Gear for Your Next Adventure"
      description="Expert-backed recommendations for camping, hiking, and survival gear."
      :links="[
        {
          label: 'Explore Gear Guides',
          icon: 'i-lucide-book-open',
          color: 'gray',
          size: 'lg',
          to: '/blog',
        },
        {
          label: 'Start Shopping',
          icon: 'i-lucide-shopping-cart',
          size: 'lg',
          to: '/products',
        },
      ]"
    >
      <NuxtImg
        class="rounded-lg"
        src="/homeimage.jpg"
        alt="Image of camping situation"
      />
    </ULandingHero>
    <ULandingSection title="Find the Perfect Gear by Category">
      <ULandingGrid>
        <ULandingCard
          v-for="(cat, i) in productCategories"
          :class="`col-span-6 lg:col-span-4 row-span-${
            i === 0 || i === 3 || i === 4 ? 2 : 4
          }`"
          :icon="cat.icon"
          :title="cat.label"
          :description="cat.description"
          :to="cat.to"
        />
      </ULandingGrid>
    </ULandingSection>
    <ULandingSection title="Top Gear for Your Next Adventure">
      <UBlogList v-if="products?.length">
        <UBlogPost
          v-for="(product, index) in products"
          :key="index"
          :to="`/products/${product.slug}`"
          :title="product.title"
          :description="product.description"
          :image="`https://api-affiliate-websites.com/assets/${product.image}`"
          :badge="{label: (product.category as ProductCategories).name}"
          orientation="vertical"
          :ui="{
            description: 'line-clamp-2',
          }"
        />
      </UBlogList>
    </ULandingSection>
    <ULandingSection title="Why Choose CampVenture ?">
      <ULandingGrid>
        <ULandingCard
          v-for="(cat, i) in websiteFeatures"
          class="col-span-6 row-span-2"
          :icon="cat.icon"
          :title="cat.title"
          :description="cat.description"
        />
      </ULandingGrid>
    </ULandingSection>
    <ULandingSection title="Latest Outdoor Tips & Guides">
      <UBlogList v-if="articles?.length">
        <UBlogPost
          v-for="(article, index) in articles"
          :key="index"
          :to="`/blog/${article.slug}`"
          :title="article.title"
          :description="article.description"
          :image="`https://api-affiliate-websites.com/assets/${article.image}`"
          :badge="{label: (article.category as ArticlesCategories).name}"
          orientation="vertical"
          :ui="{
            description: 'line-clamp-2',
          }"
        />
      </UBlogList>
    </ULandingSection>
  </div>
</template>
