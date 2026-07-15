import { MasspayJsSdk } from 'masspay-js-sdk'

export const createMasspayClient = (config) => new MasspayJsSdk({
  BASE: config.masspayBaseUrl,
  AUTHORIZER_NAME_API_KEY: `Bearer ${config.masspayApiKey}`
})
