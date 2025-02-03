<script setup lang="ts">
import type { ArticlesCategories } from '~~/types/directus';
const route = useRoute();
const { $directus, $readItems } = useNuxtApp();
const { data: articles } = await useAsyncData(
  `get-articles for category slug: ${route.params.slug}`,
  () =>
    $directus.request(
      $readItems('articles', {
        sort: ['date_created'],
        fields: [
          '*',

          {
            category: ['name', 'slug'],
          },
        ],
        filter: {
          category: {
            slug: {
              _eq: route.params.slug as string,
            },
          },
        },
      })
    )
);

const { data: headerLinks } = await useAsyncData(
  'get-articles categories for header links category',
  () =>
    $directus.request(
      $readItems('articles_categories', {
        fields: ['*'],
      })
    ),
  {
    transform: (d) =>
      d.map((item) => ({
        label: item.name,
        to: `/blog/category/${item.slug}`,
        icon: item.icon,
        color: 'primary',
        variant: 'outline',
        active: item.slug === (route.params.slug as string),
      })),
  }
);

const { data: category } = await useAsyncData(
  'get articles category',
  () =>
    $directus.request(
      $readItems('articles_categories', {
        fields: ['*'],
        filter: {
          slug: {
            _eq: route.params.slug as string,
          },
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
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="category.title"
      :description="category.description"
      class="pt-[50px] pb-0"
    >
      <template #headline>
        <UBreadcrumb
          :links="[{ label: 'Blog', to: '/blog' }, { label: category.name }]"
        />
      </template>
      <UHorizontalNavigation
        v-if="headerLinks?.length"
        class="pt-[50px]"
        :links="headerLinks"
      />
    </UPageHeader>
    <!-- :links="headerLinks as any" -->

    <UPageBody>
      <UBlogList v-if="articles?.length">
        <UBlogPost
          v-for="(article, index) in articles"
          :key="index"
          :to="`/blog/${article.slug}`"
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
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          :ui="{
            description: 'line-clamp-2',
          }"
        />
      </UBlogList>
      <UAlert
        v-else
        description="This categories doesn't contains articles yet"
        title="No articles"
      />
    </UPageBody>
  </UContainer>
</template>
