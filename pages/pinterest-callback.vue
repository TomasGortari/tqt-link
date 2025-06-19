<!-- /pages/pinterest-callback.vue -->
<template>
  <UPage>
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-6">
          <div class="flex justify-center">
            <div class="bg-red-600 p-3 rounded-full">
              <Icon name="i-lucide-pin" class="text-white h-8 w-8" />
            </div>
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mt-4">Connexion Pinterest</h1>
        </div>

        <div v-if="success" class="text-green-700">Connexion réussie ! Redirection...</div>
        <div v-else-if="error" class="text-red-600">Erreur : {{ error }}</div>
        <div v-else>Connexion en cours...</div>
      </div>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const error = ref<string | null>(null)
const success = ref<boolean>(false)

onMounted(async () => {
  const code = route.query.code as string

  if (!code) {
    error.value = 'Code manquant dans l’URL.'
    return
  }

  try {
    const res = await fetch('https://www.camp-venture.com/api/pinterest/exchange-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })

    if (!res.ok) throw new Error('Erreur lors de l’échange de code.')

    const data = await res.json()

    // ✅ Seulement côté client ici
    localStorage.setItem('pinterest_token', data.access_token)
    success.value = true

    setTimeout(() => {
      router.push('/pinterest-dashboard')
    }, 1500)
  } catch (err: any) {
    error.value = err.message || 'Une erreur inconnue est survenue.'
  }
})
</script>

