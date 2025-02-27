<template>
  <UContainer>
    <UPage :ui="{ wrapper: 'lg:gap-12' }">
      <UPageHeader
        :title="title"
        :description="description"
        class="pt-[50px] pb-0"
      >
        <template #headline>
          <UBreadcrumb :links="[{ label: 'Products' }]" />
        </template>
      </UPageHeader>
      <!-- :links="headerLinks as any" -->
      <template #left>
        <UAside :links="headerLinks">
          <template #top>
            <h2 class="text-xl font-bold">Products categories</h2>
          </template>
        </UAside>
      </template>
      <UDropdown
        :items="
          headerLinks.map((l) => [{ label: l.label, icon: l.icon, to: l.to }])
        "
        :popper="{ placement: 'bottom-start', scroll: true }"
        :ui="{
          width: 'w-full',
          wrapper: 'md:hidden',
          item: {
            size: 'text-base',
            icon: { active: 'text-primary-600', inactive: 'text-primary-300' },
          },
        }"
      >
        <UButton
          color="primary"
          icon="i-lucide-chart-bar-stacked"
          class="mt-10 mb-5 p-3"
          label="Product Categories"
          trailing-icon="i-heroicons-chevron-down-20-solid"
        />
      </UDropdown>
      <UPageBody>
        <UBlogList v-if="products?.length">
          <UBlogPost
            :ui="{
              description: 'line-clamp-2',
              image: {
                wrapper:
                  'ring-1 ring-gray-200 dark:ring-gray-800 relative overflow-hidden aspect-[4/4] w-full rounded-lg pointer-events-none',
                base: 'object-cover object-center w-full h-full transform transition-transform duration-200',
              },
            }"
            v-for="(product, index) in products"
            :key="index"
            :to="`/products/${product.slug}`"
            :title="product.title"
            :description="product.description"
            :image="`https://api-affiliate-websites.com/assets/${product.image}`"
            :badge="{label: (product.category as ProductCategories).name}"
            orientation="vertical"
          />
        </UBlogList>
        <UAlert
          v-else
          description="This categories doesn't contains products yet"
          title="No products"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import { defineBreadcrumb, useSchemaOrg } from '#imports';
import type { ProductCategories } from '~~/types/directus';
const { website_id } = useRuntimeConfig().public;
const route = useRoute();
const { $directus, $readItems } = useNuxtApp();
const { data: products } = await useAsyncData(`get-products all`, () =>
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
    })
  )
);

const { data: headerLinks } = await useAsyncData(
  'get-products categories for header links category',
  () =>
    $directus.request(
      $readItems('product_categories', {
        fields: ['name', 'icon', 'slug'],
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
        active: item.slug === (route.params.slug as string),
      })),
  }
);

const title = computed(
  () => 'Best Camping Gear & Outdoor Equipment – Shop Top-Rated Products'
);
const description = computed(
  () =>
    'Discover the best camping gear and outdoor equipment all in one place! From high-quality tents and sleeping bags to hiking backpacks and survival tools, find everything you need for your next adventure. Explore top-rated products and get the best deals today !'
);

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
});
useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Products',
        item: 'https://www.camp-venture.com/products',
      },
    ],
  }),
]);
</script>
