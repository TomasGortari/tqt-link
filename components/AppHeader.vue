<script setup lang="ts">
const links = [

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
