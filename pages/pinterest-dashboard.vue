<script setup lang="ts">
import { useAsyncData } from '#app';
import { NuxtImg } from '#components';
import { ref } from 'vue';

const { $directus, $readItems } = useNuxtApp();
const showModal = ref(false);
const selectedPin = ref(null);
const publishStatus = ref<'idle' | 'success' | 'error'>('idle');
const publishError = ref<string | null>(null);

const {
  data: pins,
  error,
  pending,
} = await useAsyncData('get-scheduled-pins', () =>
  $directus.request(
    $readItems('pins', {
      filter: {
        status: { _eq: 'scheduled' },
      },
      sort: ['-date_to_publish'],
      fields: [
        'id',
        'title',
        'description',
        'image_url',
        'link_url',
        'boards',
        'date_to_publish',
      ],
    })
  )
);

const publishPin = async (pin: any) => {
  selectedPin.value = pin;
  publishStatus.value = 'idle';
  publishError.value = null;
  showModal.value = true;

  try {
    const res = await fetch('/api/pinterest/publish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pinId: pin.id,
        access_token: localStorage.getItem('pinterest_token'),
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || 'Erreur lors de la publication.');
    }
    publishStatus.value = 'success';
  } catch (err: any) {
    publishStatus.value = 'error';
    publishError.value = err.message;
  }
};
</script>

<template>
  <UPage>
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            📌 Tableau de bord Pinterest
          </h1>
          <p class="text-gray-500 mt-1">Epingles prévues pour publication</p>
        </div>

        <div v-if="pending" class="text-gray-500">
          Chargement des épingles...
        </div>
        <div v-else-if="error" class="text-red-600">
          Erreur : {{ error.message }}
        </div>
        <div v-else-if="pins?.length === 0" class="text-gray-500">
          Aucune épingle planifiée.
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <UCard
            v-for="pin in pins"
            :key="pin.id"
            class="flex flex-col h-full"
            :ui="{ body: { base: 'flex-1 flex flex-col' } }"
          >
            <NuxtImg
              v-if="pin.image_url"
              :src="`https://api-affiliate-websites.com/assets/${pin.image_url}`"
              alt="Image de l'épingle"
              class="rounded-md mb-3 w-full h-40 object-cover"
              format="webp"
              width="400"
              height="200"
            />

            <template #header>
              <h2 class="text-lg font-semibold text-gray-900 truncate">
                {{ pin.title || 'Sans titre' }}
              </h2>
            </template>

            <p class="text-sm text-gray-600 line-clamp-3 mb-2">
              {{ pin.description }}
            </p>

            <div class="mt-auto">
              <div
                class="flex flex-col items-center justify-between text-xs text-gray-500 mb-2"
              >
                <div class="flex flex-col gap-y-2">
                  <UBadge
                    v-for="(board, key) in pin.boards"
                    :key="key"
                    size="xs"
                    variant="soft"
                    color="gray"
                  >
                    {{ board || 'Board inconnu' }}
                  </UBadge>
                </div>
              </div>

              <UButton
                size="sm"
                color="primary"
                variant="solid"
                icon="i-lucide-upload-cloud"
                label="Publier"
                block
                @click="publishPin(pin)"
              />
            </div>
          </UCard>
        </div>
      </div>

      <!-- Modale de résultat publication -->
      <UModal v-model="showModal">
        <UCard>
          <template #header>
            <div class="text-lg font-bold">Création d'un pin</div>
          </template>

          <div v-if="publishStatus === 'success'">
            <p class="text-green-600">Pin publié avec succès !</p>
          </div>
          <div v-else-if="publishStatus === 'error'">
            <p class="text-red-600">Erreur : {{ publishError }}</p>
          </div>
          <div v-else>
            <p>Publication en cours...</p>
          </div>

          <template #footer>
            <UButton label="Fermer" block @click="showModal = false" />
          </template>
        </UCard>
      </UModal>
    </div>
  </UPage>
</template>
