export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@paga-peaha-ai/ip',
    '@paga-peaha-ai/template',
    '@paga-peaha-ai/peach',
    '@paga-peaha-ai/booking',
    '@paga-peaha-ai/robosats',
    '@paga-peaha-ai/masspay'
  ],

  ipDetection: {
    enabled: true,
    currency: true
  },

  css: ['~/assets/css/main.css']
})
