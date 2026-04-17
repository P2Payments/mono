import { middlewareDefs } from './module/definitions/middlewares.js'

export default defineNitroConfig({
  compatibilityDate: '2026-02-10',

  runtimeConfig: {
    ipinfoApiKey: process.env.NUXT_IPINFO_API_KEY,
    ipDetection: {
      country: process.env.NUXT_IP_DETECTION_COUNTRY === 'true',
      currency: process.env.NUXT_IP_DETECTION_CURRENCY === 'true',
      cloudflareSecret: process.env.NUXT_IP_DETECTION_CLOUDFLARE_SECRET,
      rateLimit: Number(process.env.NUXT_IP_DETECTION_RATE_LIMIT) || 100,
      limitPaths: process.env.NUXT_IP_DETECTION_LIMIT_PATHS
        ? process.env.NUXT_IP_DETECTION_LIMIT_PATHS.split(',').map(p => p.trim())
        : []
    }
  },

  handlers: middlewareDefs.map(mw => ({
    middleware: true,
    route: '/',
    handler: `./runtime/middleware/${mw.file}`
  }))
})
