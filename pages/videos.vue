<script setup lang="ts">

import type { Videos, Products } from '~/types/directus'

// Config & helpers pour les assets
const runtimeConfig = useRuntimeConfig()
const assetBase = runtimeConfig.public.directusUrl?.replace(/\/+$/, '') || ''
const assetUrl = (fileId?: string | null) => (fileId ? `${assetBase}/assets/${fileId}` : '')

// Recherche simple
const q = ref('')

// Fetch des vidéos publiées + produits liés (via junction)
const { data: videosRes } = useVideos({
  fields: [
    'id','title','status','thumb.id',
    'tiktok_link','youtube_link','instagram_link',
    // Junction M2M: videos.products[].products_id -> Products
    'products.products_id.id',
    'products.products_id.name',
    'products.products_id.amazon_link',
    'products.products_id.status'
  ],
  filter: { status: { _eq: 'published' } },
  sort: ['-date_created']
} as any)

// Mapping Directus -> UI
type UIVideo = {
  id: number
  title: string
  thumb?: string
  tiktok_link?: string
  youtube_link?: string
  instagram_link?: string
  amazonCount: number
}

const videos = computed<UIVideo[]>(() => {
  const rows = videosRes.value ?? []
  return rows.map((v: Videos) => {
    // Compte des produits Amazon publiés
    let amazon = 0
    const junctions = (v.products as any[]) || []
    for (const j of junctions) {
      const p = j?.products_id as Products | undefined
      if (!p) continue
      if (p.status === 'published' && p.amazon_link) amazon++
    }
    return {
      id: v.id!,
      title: v.title ?? '',
      thumb: assetUrl((v.thumb as any)?.id ?? null),
      tiktok_link: v.tiktok_link ?? undefined,
      youtube_link: v.youtube_link ?? undefined,
      instagram_link: v.instagram_link ?? undefined,
      amazonCount: amazon
    }
  })
})

// Lien de redirection prioritaire (TikTok si dispo, sinon Amazon)
function targetFor(v: UIVideo) {
  return v.tiktok_link ? `/tiktok?video=${encodeURIComponent(String(v.id))}` : `/amazon?video=${encodeURIComponent(String(v.id))}`
}

// Recherche simple par titre
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  const list = videos.value
  if (!term) return list
  return list.filter(v => v.title.toLowerCase().includes(term))
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
        <NuxtImg
          v-if="v.thumb"
          :src="v.thumb"
          :alt="v.title"
          class=" h-60 object-cover w-full rounded-lg"
        />

        <h3 class="font-semibold mb-2 line-clamp-2">{{ v.title }}</h3>

        <!-- Badges: lien TikTok dispo + nombre de produits Amazon -->
        <div class="flex items-center gap-2 mb-4">
          <UBadge v-if="v.tiktok_link" color="primary" variant="soft">
            <UIcon name="lucide:music" class="w-4 h-4 mr-1" /> TikTok dispo
          </UBadge>
          <UBadge v-if="v.amazonCount" variant="soft">
            <UIcon name="lucide:shopping-cart" class="w-4 h-4 mr-1" /> {{ v.amazonCount }} Amazon
          </UBadge>
          <UBadge v-if="!v.tiktok_link && !v.amazonCount" color="yellow" variant="soft">
            Aucun produit
          </UBadge>
        </div>

        <!-- CTA direction automatique -->
        <UButton :to="targetFor(v)" block color="primary" variant="solid" class="mb-2">
          <template #leading>
            <UIcon
              :name="v.tiktok_link ? 'lucide:shopping-bag' : 'lucide:shopping-cart'"
              class="w-5 h-5 text-white"
            />
          </template>
          Voir les produits
        </UButton>

        <!-- Boutons vidéos (multi-plateformes) -->
        <div class="flex flex-col gap-2">
          <UButton
            v-if="v.tiktok_link"
            :to="v.tiktok_link"
            target="_blank"
            color="pink"
            size="sm"
          >
            <UIcon name="lucide:music" class="w-4 h-4 mr-1" /> TikTok
          </UButton>
          <UButton
            v-if="v.youtube_link"
            :to="v.youtube_link"
            target="_blank"
            color="red"
            size="sm"
          >
            <UIcon name="lucide:youtube" class="w-4 h-4 mr-1" /> YouTube
          </UButton>
          <UButton
            v-if="v.instagram_link"
            :to="v.instagram_link"
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
