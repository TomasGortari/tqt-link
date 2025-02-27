<script setup lang="ts">
import { useSchemaOrg, defineWebPage, defineWebSite } from '#imports';
const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === 'dark' ? '#111827' : 'white'
);

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
});

useSeoMeta({
  titleTemplate: '%s - CampVenture',
  ogImage: '/opengraph.png',
  twitterImage: '/opengraph.png',
  twitterCard: 'summary_large_image',
});
// useSchemaOrg([
//   defineWebPage({
//     name: 'My Page',
//   }),
//   defineWebSite({
//     name: 'My Site',
//   }),
// ]);
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
