import { endpointDefs } from './module/definitions/endpoints.js'

const prefix = '/api/rails/masspay'

export default defineNitroConfig({
  compatibilityDate: '2026-07-14',

  runtimeConfig: {
    masspayBaseUrl: process.env.NUXT_MASSPAY_BASE_URL || 'https://api.masspay.io/v1.0.0',
    masspayApiKey: process.env.NUXT_MASSPAY_API_KEY,
    masspayWebhookSecret: process.env.NUXT_MASSPAY_WEBHOOK_SECRET,
    masspayBeneficiaryUserToken: process.env.NUXT_MASSPAY_BENEFICIARY_USER_TOKEN,
    masspayDestinationToken: process.env.NUXT_MASSPAY_DESTINATION_TOKEN,
    masspayAttrSetToken: process.env.NUXT_MASSPAY_ATTR_SET_TOKEN,
    masspaySourceCurrency: process.env.NUXT_MASSPAY_SOURCE_CURRENCY || 'USD'
  },

  handlers: endpointDefs.map(ep => {
    const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
    const route = routeRel ? `${prefix}/${routeRel}` : prefix
    const def = { route, handler: `./runtime/handlers/${ep.file}` }
    if (ep.method !== 'ALL') def.method = ep.method
    return def
  })
})
