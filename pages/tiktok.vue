<script setup lang="ts">
import store from '~/assets/store.json'

type Product = {
  id: string
  name: string
  image?: string
  tiktokLink?: string
  amazonLink?: string
  category?: string
  tags?: string[]
}
type Video = {
  id: string
  title: string
  thumb?: string
  productIds: string[]
}

const productsMap = store.products as Record<string, Product>
const videosMap = store.videos as Record<string, Video>

// Tous les produits éligibles TikTok Shop
const allTikTokProducts = computed<Product[]>(() =>
  Object.values(productsMap).filter(p => !!p.tiktokLink)
)

// Paramètre ?video=
const route = useRoute()
const videoKey = (route.query.video as string) || ''

const activeVideo = computed<Video | null>(() => {
  const v = videosMap[videoKey]
  return v && Array.isArray(v.productIds) && v.productIds.length ? v : null
})
const videoTikTokProducts = computed<Product[]>(() => {
  if (!activeVideo.value) return []
  return activeVideo.value.productIds
    .map(id => productsMap[id])
    .filter(Boolean)
    .filter(p => !!p.tiktokLink)
})

const hasAnyTikTokProduct = computed(() => allTikTokProducts.value.length > 0)

useHead({
  title: 'TrucsQuiChangentTout — Mes produits TikTok Shop',
  meta: [
    { name: 'description', content: 'Produits que je propose via TikTok Shop (affiliation native TikTok).' },
    { property: 'og:title', content: 'Mes produits TikTok Shop' },
    { property: 'og:description', content: 'Sélection affiliée TikTok Shop.' },
    { property: 'og:image', content: '/og-image.jpg' }
  ]
})

// (Optionnel) ton profil TikTok pour le bouton "Me suivre"
const TIKTOK_PROFILE_URL = 'https://www.tiktok.com/@trucsquichangenttout'
</script>

<template>
  <UContainer class="py-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold">Mes produits TikTok Shop</h1>
      <p class="text-sm opacity-70 mt-1">
        Les achats se font directement dans TikTok (liens natifs). Certains liens sont affiliés.
      </p>
    </div>

    <!-- Bloc: Produits de la vidéo (si ?video=... et au moins 1 produit TikTok pour cette vidéo) -->
    <div v-if="activeVideo && videoTikTokProducts.length" class="mb-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="lucide:film" class="w-5 h-5"/>
            <span class="font-semibold">Produits de la vidéo</span>
          </div>
        </template>

        <div class="flex items-start gap-4 mb-4">
          <img v-if="activeVideo.thumb" :src="activeVideo.thumb" :alt="activeVideo.title" class="w-28 h-16 object-cover rounded-lg" />
          <div>
            <h2 class="text-lg font-semibold">{{ activeVideo.title }}</h2>
            <p class="text-sm opacity-70">Liés à cette vidéo sur TikTok.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="p in videoTikTokProducts" :key="p.id" class="flex flex-col">
            <img v-if="p.image" :src="p.image" :alt="p.name" class="rounded-xl w-full mb-3" />
            <h3 class="font-medium mb-2 line-clamp-2">{{ p.name }}</h3>
            <div class="flex flex-wrap gap-2 mb-3">
              <UBadge v-if="p.category" variant="soft">{{ p.category }}</UBadge>
              <UBadge v-for="t in (p.tags || [])" :key="t" variant="soft">{{ t }}</UBadge>
            </div>
            <UButton :to="p.tiktokLink" target="_blank" rel="nofollow" block color="primary" variant="solid">
              <template #leading><UIcon name="lucide:shopping-bag" class="w-5 h-5 text-white" /></template>
              Ouvrir dans TikTok
            </UButton>
          </UCard>
        </div>
      </UCard>
    </div>

    <!-- Grille complète si on a des produits TikTok -->
    <div v-if="hasAnyTikTokProduct" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="p in allTikTokProducts" :key="p.id" class="flex flex-col">
        <img v-if="p.image" :src="p.image" :alt="p.name" class="rounded-xl w-full mb-3" />
        <div class="flex-1">
          <h3 class="font-medium mb-1 line-clamp-2">{{ p.name }}</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <UBadge v-if="p.category" variant="soft">{{ p.category }}</UBadge>
            <UBadge v-for="t in (p.tags || [])" :key="t" variant="soft">{{ t }}</UBadge>
          </div>
        </div>
        <UButton :to="p.tiktokLink" target="_blank" rel="nofollow" block color="primary" variant="solid">
          <template #leading><UIcon name="lucide:shopping-cart" class="w-5 h-5 text-white" /></template>
          Ouvrir dans TikTok
        </UButton>
      </UCard>
    </div>

    <!-- Empty state si aucun produit TikTok (ton cas actuel) -->
    <div v-else class="text-center py-16 opacity-90">
      <UIcon name="lucide:package" class="w-10 h-10 mx-auto mb-3" />
      <p class="mb-4">Pas encore de produits disponibles sur TikTok Shop.</p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <UButton :to="TIKTOK_PROFILE_URL" target="_blank" icon="lucide:contact" color="primary" variant="solid">
          Me suivre sur TikTok
        </UButton>
        <UButton to="/amazon" icon="lucide:shopping-bag" variant="soft">
          Voir mes trouvailles Amazon
        </UButton>
      </div>
      <p class="mt-4 text-sm opacity-60">
        Je débloque l’accès créateur TikTok Shop dès que possible — reste connecté 🙌
      </p>
    </div>
  </UContainer>
</template>
