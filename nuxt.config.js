export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@p2pagos/ip',
    '@p2pagos/template',
    '@p2pagos/peach',
    '@p2pagos/booking',
    '@p2pagos/robosats',
    '@p2pagos/masspay'
  ],

  ipDetection: {
    enabled: true,
    currency: true
  },

  css: ['~/assets/css/main.css']
})
