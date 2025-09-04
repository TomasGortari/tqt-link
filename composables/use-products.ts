// composables/useProducts.ts
import { toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Query } from '@directus/sdk'
import type { CustomDirectusTypes, Products } from '~/types/directus' // ← adapte le chemin

export const useProducts = (query?: MaybeRefOrGetter<Query<CustomDirectusTypes, Products>>) => {
  const { $directus, $readItems } = useNuxtApp()

  return useQuery({
    queryKey: ['products', query],
    queryFn: () => $directus.request($readItems('products', toValue(query))),
    placeholderData: (d) => d
  })
}

export const useProduct = (id: number, query?: MaybeRefOrGetter<Query<CustomDirectusTypes, Products>>) => {
  const { $directus, $readItem } = useNuxtApp()

  return useQuery({
    queryKey: ['products', id, query],
    queryFn: () => $directus.request($readItem('products', id, toValue(query))),
    placeholderData: (d) => d,
    retry: false
  })
}
