<script setup lang="ts">


// Types (adapte le chemin si besoin)
import { NuxtImg } from '#components'
import type { CustomDirectusTypes, Products, Videos } from '~/types/directus'

// Composables Directus (d’après ceux que tu as fait générer)


// Helpers
const runtimeConfig = useRuntimeConfig()
const assetBase = runtimeConfig.public.directusUrl?.replace(/\/+$/, '') || ''
const assetUrl = (fileId?: string | null) => (fileId ? `${assetBase}/assets/${fileId}` : '')

// Route + params
const route = useRoute()
const videoId = computed<number | null>(() => {
  const v = route.query.video
  const n = Number(v)
  return Number.isFinite(n) ? n : null
})
const prodId = computed<number | null>(() => {
  const p = route.query.prod
  const n = Number(p)
  return Number.isFinite(n) ? n : null
})

// ----- DATA FETCHING -----
// 1) Vidéo active (si ?video)
const {
  data: activeVideoRes,
  status: videoStatus
} = useVideo(videoId.value as number, {
  // Champs nécessaires pour la card vidéo + les produits liés via la table pivot
  fields: [
    'id','title','thumb.id','tiktok_link','youtube_link','instagram_link','status',
    // M2M via junction: videos.products[].products_id -> Products
    'products.products_id.id',
    'products.products_id.name',
    'products.products_id.amazon_link',
    'products.products_id.image.id',
    'products.products_id.status',
    'products.products_id.tags',
    'products.products_id.category.id',
    'products.products_id.category.name'
  ],
  // Aucun tri/limite particulier ici
} as any)

// 2) Produits publiés pour la grille complète
const {
  data: productsRes,
  status: productsStatus
} = useProducts({
  fields: [
    'id','name','amazon_link','status','tags',
    'image.id',
    'category.id','category.name'
  ],
  filter: { status: { _eq: 'published' } },
  sort: ['name']
} as any)

// 3) Produit en vedette (si ?prod et pas de ?video)
const {
  data: featuredRes,
  status: featuredStatus
} = useProduct(prodId.value as number, {
  fields: [
    'id','name','amazon_link','status','tags',
    'image.id',
    'category.id','category.name'
  ]
} as any)

// ----- MAPPERS (Directus -> UI props) -----
type UIProduct = {
  id: number
  name: string
  image?: string
  amazonLink?: string
  category?: string
  tags?: string[]
}

type UIVideo = {
  id: number
  title: string
  thumb?: string
  tiktok_link?: string
  youtube_link?: string
  instagram_link?: string
}

const allProducts = computed<UIProduct[]>(() => {
  const rows = productsRes.value ?? []
  return rows
    .filter(p => p?.status === 'published')
    .map(p => ({
      id: p.id!,
      name: p.name ?? '',
      image: assetUrl((p.image as any)?.id ?? null),
      amazonLink: p.amazon_link ?? undefined,
      category: (p.category as any)?.name ?? undefined,
      tags: Array.isArray(p.tags) ? p.tags as string[] : (typeof p.tags === 'string' ? (p.tags as string).split(',').map(s=>s.trim()).filter(Boolean) : [])
    }))
    .filter(p => !!p.amazonLink)
})

// Vidéo active (UI)
const activeVideo = computed<UIVideo | null>(() => {
  if (!videoId.value) return null
  const v = activeVideoRes.value
  if (!v || v.status !== 'published') return null
  return {
    id: v.id!,
    title: v.title ?? '',
    thumb: assetUrl((v.thumb as any)?.id ?? null),
    tiktok_link: v.tiktok_link ?? undefined,
    youtube_link: v.youtube_link ?? undefined,
    instagram_link: v.instagram_link ?? undefined
  }
})

// Produits de la vidéo active via junction
const videoProducts = computed<UIProduct[]>(() => {
  const v = activeVideoRes.value
  if (!v || !Array.isArray(v.products)) return []
  const junctions = v.products as any[] // VideosProducts[]
  const items: UIProduct[] = []
  for (const j of junctions) {
    const p = j?.products_id as Products | undefined
    if (!p || p.status !== 'published' || !p.amazon_link) continue
    items.push({
      id: p.id!,
      name: p.name ?? '',
      image: assetUrl((p.image as any)?.id ?? null),
      amazonLink: p.amazon_link ?? undefined,
      category: (p.category as any)?.name ?? undefined,
      tags: Array.isArray(p.tags) ? (p.tags as string[]) : (typeof p.tags === 'string' ? (p.tags as string).split(',').map(s=>s.trim()).filter(Boolean) : [])
    })
  }
  return items
})

// Produit vedette (si pas de vidéo)
const featured = computed<UIProduct | null>(() => {
  if (activeVideo.value || !prodId.value) return null
  const p = featuredRes.value
  if (!p || p.status !== 'published' || !p.amazon_link) return null
  return {
    id: p.id!,
    name: p.name ?? '',
    image: assetUrl((p.image as any)?.id ?? null),
    amazonLink: p.amazon_link ?? undefined,
    category: (p.category as any)?.name ?? undefined,
    tags: Array.isArray(p.tags) ? p.tags as string[] : (typeof p.tags === 'string' ? (p.tags as string).split(',').map(s=>s.trim()).filter(Boolean) : [])
  }
})

// Filtres/Recherche/Tri
const q = ref('')
const selectedCategory = ref<string>('Toutes')
const sortBy = ref<'relevance' | 'name-asc' | 'name-desc'>('relevance') // (on retire le tri par prix)

const categories = computed<string[]>(() => {
  const set = new Set<string>()
  for (const p of allProducts.value) if (p.category) set.add(p.category)
  return ['Toutes', ...Array.from(set).sort()]
})

const filtered = computed<UIProduct[]>(() => {
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
    default: /* relevance: ordre d’arrivée */ break
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
          <NuxtImg v-if="activeVideo.thumb" :src="activeVideo.thumb" :alt="activeVideo.title" class="w-28 h-16 object-cover rounded-lg" />
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
          { label: 'Nom Z→A', value: 'name-desc' }
        ]"
        icon="lucide:sort-desc"
      />
    </div>

    <!-- Grille complète -->
    <div v-if="filtered.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="p in filtered" :key="p.id" class="flex flex-col">
        <NuxtImg v-if="p.image" :src="p.image" :alt="p.name" class="rounded-xl w-full mb-3 object-cover h-[250px]" />
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
