<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Terms & Conditions"
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
const { website_id } = useRuntimeConfig().public;
const { data } = await useAsyncData('get tc', () =>
  $directus.request(
    $readSingleton('tc', {
      fields: ['*'],
      filter: {
        website: {
          _eq: website_id,
        },
      },
    })
  )
);

useSeoMeta({
  title: 'Terms & Conditions',
  ogTitle: 'Terms & Conditions',
  description:
    'Read the Terms & Conditions of CampVenture to understand the guidelines for using our website, including content usage, user responsibilities, and legal disclaimers. Stay informed before exploring our outdoor gear recommendations.',
  ogDescription:
    'Read the Terms & Conditions of CampVenture to understand the guidelines for using our website, including content usage, user responsibilities, and legal disclaimers. Stay informed before exploring our outdoor gear recommendations.',
});
</script>
