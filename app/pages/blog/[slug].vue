<script setup lang="ts">
import type { ArticlesCategories } from '~/types/directus';

const route = useRoute();
const { $directus, $readItems } = useNuxtApp();
const { data: post } = await useAsyncData(
  'get-articles',
  () =>
    $directus.request(
      $readItems('articles', {
        fields: [
          '*',

          {
            category: ['name', 'slug'],
            related_articles: [
              { related_articles_id: ['*', { category: ['name', 'slug'] }] },
            ],
          },
        ],
        filter: {
          slug: {
            _eq: route.params.slug as string,
          },
        },
      })
    ),
  { transform: (d) => d?.[0] }
);

const { data: related_articles } = await useAsyncData(
  'get-related articles',
  () =>
    $directus.request(
      $readItems('articles', {
        limit: 4,
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
              _eq: (post.value.category as ArticlesCategories).slug,
            },
          },
        },
      })
    ),
  {
    transform: (d) =>
      d?.filter(
        (x) =>
          x.slug !== (route.params.slug as string) &&
          !post.value.related_articles?.find(
            (y) => y.related_articles_id.slug === x.slug
          )
      ),
  }
);

if (!post?.value)
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    message: "This page doesn't exist",
    fatal: true,
  });

const title = post.value.title;
const description = post.value.description;

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});
</script>

<template>
  <UContainer>
    <UPageHeader
      class="max-w-screen-md mx-auto"
      :title="post.title"
      :description="post.description"
      :ui="{ title: 'sm:text-5xl md:text-6xl', description: 'text-xl' }"
    >
      <template #headline>
        <UBreadcrumb
          :links="[{ label: 'Blog', to: '/blog' }, { label: post.title }]"
        />
      </template>
      <div class="pt-10">
        <time class="text-gray-500 dark:text-gray-400">{{
          new Date(post?.date_updated || post.date_created).toLocaleDateString(
            'en',
            {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }
          )
        }}</time>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody prose>
        <div class="max-w-screen-md mx-auto" v-html="post.content"></div>
      </UPageBody>
      <ULandingSection
        v-if="related_articles?.length || post.related_articles?.length"
        class="max-w-screen-lg mx-auto"
        title="Other articles you might like"
      >
        <UBlogList class="!grid-cols-6">
          <UBlogPost
            v-for="(article, index) in post.related_articles?.map(
              (x) => x.related_articles_id
            ) || []"
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
            :orientation="'vertical'"
            :class="'col-span-3'"
            :ui="{
              description: 'line-clamp-2',
            }"
          />
          <UBlogPost
            v-for="(article, index) in related_articles || []"
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
            :orientation="'vertical'"
            :class="'col-span-3'"
            :ui="{
              description: 'line-clamp-2',
            }"
          />
        </UBlogList>
      </ULandingSection>
    </UPage>
  </UContainer>
</template>
