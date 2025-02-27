<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Affiliate disclosure"
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

const { data } = await useAsyncData('get ad', () =>
  $directus.request($readSingleton('ad', { fields: ['*'] }))
);

useSeoMeta({
  title: 'Affiliate disclosure',
  ogTitle: 'Affiliate disclosure',
  description:
    'CampVenture participates in the Amazon Associates Program. Learn how our affiliate partnerships support our content while ensuring transparency in our product recommendations. Read our full Affiliate Disclosure here.',
  ogDescription:
    'CampVenture participates in the Amazon Associates Program. Learn how our affiliate partnerships support our content while ensuring transparency in our product recommendations. Read our full Affiliate Disclosure here.',
});
</script>
