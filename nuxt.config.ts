// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase"],

  app: {
    head: {
      title: "Glakulin"
    }
  },

  supabase: {
    // страница /table публичная — авто-редирект отключаем полностью,
    // доступ к админ-функциям проверяем вручную через useSupabaseUser()
    redirectOptions: {
      login: '/table',
      callback: '/table',
      exclude: ['/**'],
    }
  },

  runtimeConfig: {
    steamgriddbApiKey: process.env.STEAMGRIDDB_KEY,
    adminKey: process.env.ADMIN_KEY
  }
})
