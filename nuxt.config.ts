// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  uiPro: {
    license: '830E32F5-0C2F-4E23-B090-B08B3717C33B',
  },
  devtools: {
    enabled: true,
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@nuxtjs/sitemap',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/robots',
    'nuxt-schema-org',
  ],
  image: {
    providers: {
      directus: {
        options: {
          baseURL: 'https://api-affiliate-websites.com/assets',
        },
      },
    },
  },
 
  compatibilityDate: '2024-07-11',

  typescript: {
    strict: false,
  },
  // $schema: {
  //   host: 'https://www.camp-venture.com',

  // },
  site: {
    url: 'https://www.trucsquichangenttout.com',
    name: 'TrucsQuiChangentTout',
  },

});
