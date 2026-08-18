export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@paguaitu/ip',
    '@paguaitu/template',
    '@paguaitu/peach',
    '@paguaitu/booking',
    '@paguaitu/robosats',
    '@paguaitu/masspay'
  ],

  ipDetection: {
    enabled: true,
    currency: true
  },

  css: ['~/assets/css/main.css']
})
