<script setup lang="ts">
import { NuxtImg } from '#components'
import store from '~/assets/store.json'

// Types
type Product = {
  id: string
  name: string
  image?: string
  amazonLink?: string
  category?: string
  tags?: string[]
  price?: number
}
type Video = {
  id: string
  title: string
  thumb?: string
  productIds: string[]
}

// Maps
const productsMap = store.products as Record<string, Product>
const videosMap = store.videos as Record<string, Video>

// Tableau produits amazon only
const allProducts = computed<Product[]>(() =>
  Object.values(productsMap).filter(p => !!p.amazonLink)
)

// Route + params
const route = useRoute()
const prodKey = (route.query.prod as string) || ''
const videoKey = (route.query.video as string) || ''

// Sélection vidéo / produits de la vidéo
const activeVideo = computed<Video | null>(() => {
  const v = videosMap[videoKey]
  return v && Array.isArray(v.productIds) && v.productIds.length ? v : null
})
const videoProducts = computed<Product[]>(() => {
  if (!activeVideo.value) return []
  return activeVideo.value.productIds
    .map(id => productsMap[id])
    .filter(Boolean)
    .filter(p => !!p.amazonLink)
})

// Fallback : produit unique en vedette via ?prod (si pas de video)
const featured = computed<Product | null>(() => {
  if (activeVideo.value) return null
  const p = prodKey && productsMap[prodKey]
  return p && p.amazonLink ? p : null
})

// Filtres/Recherche/Tri pour la grille complète
const q = ref('')
const selectedCategory = ref<string>('Toutes')
const sortBy = ref<'relevance' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('relevance')

const categories = computed<string[]>(() => {
  const set = new Set<string>()
  for (const p of allProducts.value) if (p.category) set.add(p.category)
  return ['Toutes', ...Array.from(set).sort()]
})

const filtered = computed<Product[]>(() => {
  const term = q.value.trim().toLowerCase()
  let items = allProducts.value.filter(p => {
    const hay = `${p.name} ${(p.tags || []).join(' ')} ${p.category || ''}`.toLowerCase()
    return term ? hay.includes(term) : true
  })
  if (selectedCategory.value !== 'Toutes') {
    items = items.filter(p => p.category === selectedCategory.value)
  }
  switch (sortBy.value) {
    case 'name-asc': items.sort((a,b)=>a.name.localeCompare(b.name)); break
    case 'name-desc': items.sort((a,b)=>b.name.localeCompare(a.name)); break
    case 'price-asc': items.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity)); break
    case 'price-desc': items.sort((a,b)=>(b.price??-Infinity)-(a.price??-Infinity)); break
    default: /* relevance: keep original order */ break
  }
  return items
})

useHead({
  title: 'TrucsQuiChangentTout — Mes trouvailles Amazon',
  meta: [
    { name: 'description', content: 'Produits de mes vidéos + sélection Amazon (liens affiliés).' },
    { property: 'og:title', content: 'Mes trouvailles Amazon' },
    { property: 'og:description', content: 'Gadgets et trouvailles utiles, liens affiliés.' },
    { property: 'og:image', content: '/og-image.jpg' }
  ]
})
</script>

<template>
  <UContainer class="py-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-6 text-center">
      <h1 class="text-2xl font-bold">Mes trouvailles Amazon</h1>
      <p class="text-sm opacity-70 mt-1">
        Certains liens sont affiliés (tu paies le même prix).
      </p>
    </div>

    <!-- Bloc: Produits de la vidéo -->
    <div v-if="activeVideo" class="mb-8">
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
            <p class="text-sm opacity-70">Sélection liée à cette vidéo.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <UCard v-for="p in videoProducts" :key="p.id" class="flex flex-col">
            <img v-if="p.image" :src="p.image" :alt="p.name" class="rounded-xl w-full mb-3" />
            <h3 class="font-medium mb-2 line-clamp-2">{{ p.name }}</h3>
            <div class="flex flex-wrap gap-2 mb-3">
              <UBadge v-if="p.category" variant="soft">{{ p.category }}</UBadge>
              <UBadge v-for="t in (p.tags || [])" :key="t" variant="soft">{{ t }}</UBadge>
            </div>
            <UButton :to="p.amazonLink" target="_blank" rel="nofollow sponsored" block color="primary" variant="solid">
              <template #leading><UIcon name="lucide:shopping-bag" class="w-5 h-5 text-white" /></template>
              Voir sur Amazon
            </UButton>
          </UCard>
        </div>
      </UCard>
    </div>

    <!-- Fallback: Produit unique en vedette -->
    <div v-else-if="featured" class="mb-8">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="lucide:star" class="w-5 h-5"/>
            <span class="font-semibold">Mis en avant</span>
          </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <img v-if="featured.image" :src="featured.image" :alt="featured.name" class="rounded-xl w-full md:col-span-1" />
          <div class="md:col-span-2 space-y-2">
            <h2 class="text-xl font-semibold">{{ featured.name }}</h2>
            <div class="flex flex-wrap gap-2">
              <UBadge v-if="featured.category" variant="soft">{{ featured.category }}</UBadge>
              <UBadge v-for="t in (featured.tags || [])" :key="t" variant="soft">{{ t }}</UBadge>
            </div>
            <UButton :to="featured.amazonLink" target="_blank" rel="nofollow sponsored" color="primary" icon="lucide:shopping-cart">
              Voir sur Amazon
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Toolbar de la grille complète -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <UInput v-model="q" placeholder="Rechercher un produit..." icon="lucide:search" />
      <USelect v-model="selectedCategory" :options="categories" icon="lucide:filter" />
      <USelect
        v-model="sortBy"
        :options="[
          { label: 'Pertinence', value: 'relevance' },
          { label: 'Nom A→Z', value: 'name-asc' },
          { label: 'Nom Z→A', value: 'name-desc' },
          { label: 'Prix ↑', value: 'price-asc' },
          { label: 'Prix ↓', value: 'price-desc' }
        ]"
        icon="lucide:sort-desc"
      />
    </div>

    <!-- Grille complète -->
    <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="p in filtered" :key="p.id" class="flex flex-col">
        <NuxtImg v-if="p.image" :src="p.image" :alt="p.name" class="rounded-xl w-full mb-3 object-cover h-[250px]  " />
        <div class="flex-1">
          <h3 class="font-medium mb-1 line-clamp-2">{{ p.name }}</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <UBadge v-if="p.category" variant="soft">{{ p.category }}</UBadge>
            <UBadge v-for="t in (p.tags || [])" :key="t" variant="soft">{{ t }}</UBadge>
          </div>
        </div>
        <UButton :to="p.amazonLink" target="_blank" rel="nofollow sponsored" block color="primary" variant="solid">
          <template #leading><UIcon name="lucide:shopping-bag" class="w-5 h-5 text-white" /></template>
          Voir sur Amazon
        </UButton>
      </UCard>
    </div>

    <div v-else class="text-center py-16 opacity-70">
      <UIcon name="lucide:inbox" class="w-8 h-8 mx-auto mb-2" />
      Aucun produit ne correspond à ta recherche.
    </div>
  </UContainer>
</template>
