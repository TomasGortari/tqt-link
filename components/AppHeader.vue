<script setup lang="ts">
const links = [
  {
    label: "Amazon",
    to: "/amazon",
    icon: "i-lucide-shopping-cart"
  },
  {
    label: "TikTok Shop",
    to: "/tiktok",
    icon: "i-lucide-shopping-bag"
  },
  {
    label: "Vidéos",
    to: "/videos",
    icon: "i-lucide-play-circle"
  }
];
</script>

<template>
  <UHeader :links="links">
    <template #logo>
      <ULink to="/">
        <NuxtImg class="h-14" src="/logo.png" alt="Home" />
      </ULink>
    </template>



    <template #panel>
      <UNavigationTree :links="links" default-open />
    </template>
  </UHeader>
</template>
