import { createMasspayClient } from '../lib/masspayClient.js'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const sdk = createMasspayClient(config)
  return sdk.AccountService.getAccountBalance()
})
