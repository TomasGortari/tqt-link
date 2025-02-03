<script setup lang="ts">
const links = [
  {
    label: 'Buying Guides',
    to: '/blog/category/buying-guides',
    icon: 'i-lucide-shopping-cart',
  },
  {
    label: 'Tutorials',
    to: '/blog/category/tutorials',
    icon: 'i-lucide-book-open',
  },
  {
    label: 'Tips & Tricks',
    to: '/blog/category/tips-tricks',
    icon: 'i-lucide-lightbulb',
  },
  {
    label: 'Gear Reviews',
    to: '/blog/category/gear-reviews',
    icon: 'i-lucide-star',
  },
];
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <ULink to="/">
        <NuxtImg class="h-14" src="/logo.png" alt="Home" />
      </ULink>
    </template>

    <template #right>
      <UButton label="Shop" color="primary" icon="i-lucide-store" to="/shop" />
    </template>

    <template #panel>
      <UNavigationTree :links="links" default-open />
    </template>
  </UHeader>
</template>
