<script setup lang="ts">
const links = [
  {
    label: 'Quick Links',
    children: [
      {
        label: 'Home',
        to: '/',
      },
      {
        label: 'Buying Guides',
        to: '/blog/category/buying-guides',
      },
      {
        label: 'Tutorials',
        to: '/blog/category/tutorials',
      },
      {
        label: 'Tips & Tricks',
        to: '/blog/category/tips-tricks',
      },
      {
        label: 'Gear Reviews',
        to: '/blog/category/gear-reviews',
      },
      {
        label: 'Contact',
        to: '/contact',
      },
    ],
  },
  {
    label: 'Legal',
    children: [
      {
        label: 'Privacy Policy',
        to: '/privacy-policy',
      },
      {
        label: 'Terms & Conditions',
        to: '/terms',
      },
      {
        label: 'Affiliate Disclosure',
        to: '/affiliate-disclosure',
      },
    ],
  },
];
</script>

<template>
  <UFooter>
    <template #top>
      <UFooterColumns :links="links">
        <template #left>
          <div class="flex flex-col gap-5">
            <h3 class="text-xl font-bold">About</h3>
            <p class="text-gray-500">
              CampVenture is your go-to guide for outdoor adventures! Explore
              expert camping tips, gear reviews, and the best buying guides for
              your next trip into the wild
            </p>
          </div>
        </template>
      </UFooterColumns>
    </template>

    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </template>
  </UFooter>
</template>
