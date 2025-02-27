<template>
  <UContainer>
    <UPage :ui="{ wrapper: 'lg:gap-12' }">
      <UPageHeader
        :title="category.title"
        :description="category.description"
        class="pt-[50px] pb-0"
      >
        <template #headline>
          <UBreadcrumb
            :links="[
              {
                label: 'Products',
                icon: 'i-lucide-shopping-basket',
                to: '/products',
              },
              { label: category.name },
            ]"
          />
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
const { data: products } = await useAsyncData(
  `get-products for category slug: ${route.params.slug}`,
  () =>
    $directus.request(
      $readItems('products_affiliate', {
        sort: ['-date_created'],
        fields: [
          '*',

          {
            category: ['name', 'slug'],
          },
        ],
        filter: {
          _and: [
            {
              category: {
                slug: {
                  _eq: route.params.slug as string,
                },
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
    transform: (d) => {
      console.log(
        d.map((item) => ({
          label: item.name,
          to: `/products/category/${item.slug}`,
          icon: item.icon,
          color: 'primary',
          variant: 'outline',
          active: item.slug === (route.params.slug as string),
        }))
      );
      return d.map((item) => ({
        label: item.name,
        to: `/products/category/${item.slug}`,
        icon: item.icon,
        color: 'primary',
        variant: 'outline',
        active: item.slug === (route.params.slug as string),
      }));
    },
  }
);

const { data: category } = await useAsyncData(
  `get product category ${route.params.slug}`,
  () =>
    $directus.request(
      $readItems('product_categories', {
        fields: ['*'],
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
  {
    transform: (d) => d?.[0],
  }
);

if (!category?.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    message: "This page doesn't exist",
    fatal: true,
  });

useSeoMeta({
  title: category.value.title,
  ogTitle: category.value.title,
  description: category.value.description,
  ogDescription: category.value.description,
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
      {
        '@type': 'ListItem',
        position: 2,
        name: category.value.title,
        item: `https://www.camp-venture.com/products/${category.value.slug}`,
      },
    ],
  }),
]);
</script>
