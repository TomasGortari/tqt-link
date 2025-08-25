<script setup lang="ts">
const links = [
  {
    label: 'Contact',
    children: [
      { label: 'contact@trucsquichangenttout.com' },

    ],
  },

];
</script>

<template>
  <UFooter>
    <template #top>
      <UFooterColumns :links="links">
       
      </UFooterColumns>
    </template>

    
  </UFooter>
</template>
