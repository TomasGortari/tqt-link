<script setup lang="ts">
useSeoMeta({
  // title: page.value.title,
  // ogTitle: page.value.title,
  // description: page.value.description,
  // ogDescription: page.value.description,
});
</script>

<template>
  <div>
    <ULandingHero :title="'home'" :description="'Description'">
      <div
        class="absolute inset-0 landing-grid z-[-1] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      />
    </ULandingHero>
  </div>
</template>
