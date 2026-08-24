import { sweepToBeneficiary } from '../lib/sweepToBeneficiary.js'

// Manual trigger for the same full-balance sweep the webhook performs —
// useful for testing in sandbox without waiting for a real deposit webhook.
export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  return sweepToBeneficiary(config)
})
