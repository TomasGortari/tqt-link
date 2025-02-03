<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Privacy Policy"
        :description="`Last Updated: ${new Date(
          data?.date_updated || data.date_created
        ).toLocaleDateString('en', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        })} `"
      />
      <UPageBody prose>
        <div v-html="data.content" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>

<script lang="ts" setup>
const { $directus, $readSingleton } = useNuxtApp();

const { data } = await useAsyncData('get privacy-policy', () =>
  $directus.request($readSingleton('privacy_policy', { fields: ['*'] }))
);

useSeoMeta({
  title: 'Privacy Policy',
  ogTitle: 'Privacy Policy',
  description:
    'Learn how CampVenture collects, uses, and protects your personal information. Read our Privacy Policy to understand your rights and how we ensure data security for our users.',
  ogDescription:
    'Learn how CampVenture collects, uses, and protects your personal information. Read our Privacy Policy to understand your rights and how we ensure data security for our users.',
});
</script>
