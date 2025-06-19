<template>
  <UPage>
    <div class="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div class="w-full max-w-2xl text-center">
        <div class="mb-8">
          <div class="flex items-center justify-center mb-4">
            <div class="bg-red-600 p-3 rounded-full">
              <UIcon name="i-lucide-pin" class="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Camp Venture</h1>
          <p class="text-gray-600 text-lg">Plateforme d'aventure et de découverte</p>
        </div>

        <div class="rounded-lg border bg-card text-card-foreground shadow-md p-8 bg-slate-50">
          <div class="flex flex-col space-y-1.5 p-6 text-center pb-6">
            <h3 class="tracking-tight text-3xl font-bold text-gray-900 mb-4">Connexion à Pinterest</h3>
            <p class="text-lg text-gray-600 leading-relaxed">
              Connectez votre compte Pinterest pour publier automatiquement des épingles à partir de Camp Venture.
              Partagez vos aventures et inspirez la communauté !
            </p>
          </div>

          <div class="p-6 pt-0">
            <UButton
              icon="i-lucide-pin"
              class="bg-red-600 hover:bg-red-700 text-white"
              block
              :to="authUrl"
            >
              Se connecter à Pinterest
            </UButton>

            <div class="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div class="flex items-center">
                <LucideCircleCheckBig class="h-4 w-4 mr-1 text-green-500" />Sécurisé
              </div>
              <div class="flex items-center">
                <LucideCircleCheckBig class="h-4 w-4 mr-1 text-green-500" />Rapide
              </div>
              <div class="flex items-center">
                <LucideCircleCheckBig class="h-4 w-4 mr-1 text-green-500" />Gratuit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UPage>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#imports'


const config = useRuntimeConfig()
const clientId = config.public.pinterestClientId || '1522855'
const redirectUri = 'https://www.camp-venture.com/pinterest-callback'

const scope = [
  'boards:read',
  'pins:read',
  'pins:write',
  'boards:write'
].join(',')

const state = Math.random().toString(36).substring(2)

const authUrl = `https://www.pinterest.com/oauth/?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`
</script>
