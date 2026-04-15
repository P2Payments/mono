export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@p2pagos/ip-detection',
    '@p2pagos/template',
    '@p2pagos/peach',
    '@p2pagos/booking',
    '@p2pagos/robosats'
  ],

  ipDetection: {
    enabled: true,
    currency: true
  }
})
