// composables/useVideos.ts
import { toValue, type MaybeRefOrGetter } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Query } from '@directus/sdk'
import type { CustomDirectusTypes, Videos } from '~/types/directus' // ← adapte le chemin

export const useVideos = (query?: MaybeRefOrGetter<Query<CustomDirectusTypes, Videos>>) => {
  const { $directus, $readItems } = useNuxtApp()

  return useQuery({
    queryKey: ['videos', query],
    queryFn: () => $directus.request($readItems('videos', toValue(query))),
    placeholderData: (d) => d
  })
}

export const useVideo = (id: number, query?: MaybeRefOrGetter<Query<CustomDirectusTypes, Videos>>) => {
  const { $directus, $readItem } = useNuxtApp()

  return useQuery({
    queryKey: ['videos', id, query],
    queryFn: () => $directus.request($readItem('videos', id, toValue(query))),
    placeholderData: (d) => d,
    retry: false
  })
}
