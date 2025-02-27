<script setup lang="ts">
import { defineBreadcrumb, useSchemaOrg } from '#imports';
import type { ArticlesCategories } from '~~/types/directus';
const { website_id } = useRuntimeConfig().public;
const { $directus, $readItems } = useNuxtApp();
const { data: articles } = await useAsyncData('get-articles', () =>
  $directus.request(
    $readItems('articles', {
      sort: ['-date_created'],
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
  'get-articles categories for header links',
  () =>
    $directus.request(
      $readItems('articles_categories', {
        fields: ['*'],
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
        to: `/blog/category/${item.slug}`,
        icon: item.icon,
        color: 'primary',
        variant: 'outline',
      })),
  }
);
const title = computed(
  () => 'Ultimate Camping & Outdoor Gear Guide | Tips, Reviews & Buying Advice'
);
const description = computed(
  () =>
    'Discover expert camping and outdoor gear guides! Find the best tents, sleeping bags, and hiking equipment with in-depth reviews, tips, and buying advice to enhance your next adventure.'
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
        name: 'Blog',
        item: 'https://www.camp-venture.com/blog',
      },
    ],
  }),
]);
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="title"
      :description="description"
      headline="Blog"
      class="pt-[50px] pb-0"
    >
      <UHorizontalNavigation
        v-if="headerLinks?.length"
        class="pt-[50px]"
        :links="headerLinks"
        :ui="{ container: 'max-w-[95vw] overflow-x-auto ', inner: 'min-w-max' }"
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
        description="No items currently available"
        title="No articles"
      />
    </UPageBody>
  </UContainer>
</template>
