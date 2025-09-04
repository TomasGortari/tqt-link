import { createDirectus, rest, readItem, readItems, readMe, createItem, updateItems, createItems, updateItem, authentication, aggregate, deleteItem, uploadFiles, updateMe, readFiles } from '@directus/sdk'
import type { CustomDirectusTypes } from '../types/directus'

export default defineNuxtPlugin(() => {
  const localStorage = useLocalStorage<string | null>('trucs-auth', null)

  const directus = createDirectus<CustomDirectusTypes>('https://api-affiliate-websites.com').with(rest()).with(authentication('json', {
    storage: {
      get: () => JSON.parse(localStorage.value ?? '{}'),
      set: value => localStorage.value = JSON.stringify(value)
    }
  }))

  return {
    provide: { directus, readItem, readItems, readMe, createItem, updateItems, createItems, updateItem, aggregate, deleteItem, uploadFiles, updateMe, readFiles }
  }
})
