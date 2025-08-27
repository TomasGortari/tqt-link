<script setup lang="ts">
import store from '~/assets/store.json'

type Product = {
  id: string
  name: string
  image?: string
  amazonLink?: string
  tiktokLink?: string
  category?: string
  tags?: string[]
}

type Links = {
    tiktok: string
    instagram: string
    youtube: string

}

type Video = {
  id: string
  title: string
  thumb?: string
  productIds: string[]
  links: Links
}

const productsMap = store.products as Record<string, Product>
const videosMap = store.videos as Record<string, Video>

const videos = computed<Video[]>(() => Object.values(videosMap))

// Helpers: compter produits Amazon/TikTok par vidéo
function countByPlatform(v: Video) {
  let amazon = 0, tiktok = 0
  for (const id of v.productIds) {
    const p = productsMap[id]
    if (!p) continue
    if (p.amazonLink) amazon++
    if (p.tiktokLink) tiktok++
  }
  return { amazon, tiktok }
}

// Lien de redirection prioritaire
function targetFor(v: Video) {
  const { tiktok } = countByPlatform(v)
  return tiktok > 0 ? `/tiktok?video=${encodeURIComponent(v.id)}` : `/amazon?video=${encodeURIComponent(v.id)}`
}

// Recherche simple par titre
const q = ref('')
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return videos.value
  return videos.value.filter(v => v.title.toLowerCase().includes(term))
})

useHead({
  title: 'TrucsQuiChangentTout — Mes vidéos',
  meta: [
    { name: 'description', content: 'Toutes mes vidéos et les produits associés (TikTok Shop / Amazon).' },
    { property: 'og:title', content: 'Mes vidéos' },
    { property: 'og:description', content: 'Hub des vidéos avec liens produits.' },
    { property: 'og:image', content: '/og-image.jpg' }
  ]
})
</script>

<template>
  <UContainer class="py-8 max-w-5xl mx-auto">
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold">Mes vidéos</h1>
      <p class="text-sm opacity-70 mt-1">
        Clique sur une vidéo pour voir les produits associés (TikTok Shop si dispo, sinon Amazon).
      </p>
    </div>

    <!-- Barre de recherche -->
    <div class="mb-6">
      <UInput v-model="q" placeholder="Rechercher une vidéo..." icon="lucide:search" />
    </div>

    <!-- Grille de vidéos -->
    <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="v in filtered" :key="v.id" class="flex flex-col">
        <img
          v-if="v.thumb"
          :src="v.thumb"
          :alt="v.title"
          class="rounded-xl w-full h-40 object-cover mb-3"
        />

        <h3 class="font-semibold mb-2 line-clamp-2">{{ v.title }}</h3>

        <!-- Badges compte produits -->
        <div class="flex items-center gap-2 mb-4">
          <UBadge v-if="countByPlatform(v).tiktok" color="primary" variant="soft">
            <UIcon name="lucide:shopping-bag" class="w-4 h-4 mr-1" /> {{ countByPlatform(v).tiktok }} TikTok
          </UBadge>
          <UBadge v-if="countByPlatform(v).amazon" variant="soft">
            <UIcon name="lucide:shopping-cart" class="w-4 h-4 mr-1" /> {{ countByPlatform(v).amazon }} Amazon
          </UBadge>
          <UBadge v-if="!countByPlatform(v).tiktok && !countByPlatform(v).amazon" color="yellow" variant="soft">
            Aucun produit
          </UBadge>
        </div>

        <!-- CTA direction automatique -->
        <UButton :to="targetFor(v)" block color="primary" variant="solid" class="mb-2">
  <template #leading>
    <UIcon
      :name="countByPlatform(v).tiktok ? 'lucide:shopping-bag' : 'lucide:shopping-cart'"
      class="w-5 h-5 text-white"
    />
  </template>
  Voir les produits
</UButton>

<!-- Boutons vidéos (multi-plateformes) -->
<div class="flex flex-col gap-2">
  <UButton
    v-if="v.links?.tiktok"
    :to="v.links.tiktok"
    target="_blank"
    color="pink"
    
    size="sm"
  >
    <UIcon name="lucide:music" class="w-4 h-4 mr-1" /> TikTok
  </UButton>
  <UButton
    v-if="v.links?.youtube"
    :to="v.links.youtube"
    target="_blank"
    color="red"

    size="sm"
  >
    <UIcon name="lucide:youtube" class="w-4 h-4 mr-1" /> YouTube
  </UButton>
  <UButton
    v-if="v.links?.instagram"
    :to="v.links.instagram"
    target="_blank"
    color="purple"

    size="sm"
  >
    <UIcon name="lucide:instagram" class="w-4 h-4 mr-1" /> Insta
  </UButton>
</div>
      </UCard>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-16 opacity-80">
      <UIcon name="lucide:inbox" class="w-8 h-8 mx-auto mb-2" />
      Aucune vidéo trouvée.
    </div>
  </UContainer>
</template>
