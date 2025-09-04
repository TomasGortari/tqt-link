

<template>
  <UContainer class="py-8 max-w-lg mx-auto">
    <!-- Titre / Branding -->
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold">TrucsQuiChangentTout</h1>
      <p class="opacity-70">Mes liens utiles et trouvailles</p>
    </div>

    <!-- Les 3 boutons principaux -->
    <div class="space-y-3 mb-8">
  <UButton block size="lg" to="/amazon" color="primary" variant="solid">
    <template #leading>
      <UIcon name="lucide:shopping-cart" class="text-white w-5 h-5" />
    </template>
    Mes trouvailles Amazon
  </UButton>

  <UButton block size="lg" to="/tiktok" color="primary" variant="solid">
    <template #leading>
      <UIcon name="lucide:store" class="text-white w-5 h-5" />
    </template>
    Mes produits TikTok Shop
  </UButton>

  <UButton block size="lg" to="/videos" color="primary" variant="solid">
    <template #leading>
      <UIcon name="lucide:play-circle" class="text-white w-5 h-5" />
    </template>
    Mes astuces & vidéos
  </UButton>
</div>


   
  </UContainer>
</template>
