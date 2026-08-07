import { createMasspayClient } from '../lib/masspayClient.js'

// Non-committing preview of what a payout of `amount` (source currency,
// default masspaySourceCurrency) would convert to in PYG via SIPAP.
// Creates a quote but never commits it — no funds move. Requires the
// funding account to already hold at least `amount`, otherwise MassPay
// returns payout_token: 'NSF'.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const amount = Number(query.amount ?? 100)

  const sdk = createMasspayClient(config)
  const balances = await sdk.AccountService.getAccountBalance()
  const account = balances.find((b) => b.currency_code === config.masspaySourceCurrency) ?? balances[0]

  if (!account) {
    throw createError({ statusCode: 404, statusMessage: 'No MassPay funding account found' })
  }

  return sdk.PayoutService.initiatePayout(config.masspayBeneficiaryUserToken, {
    client_transfer_id: `quote_${Date.now()}`,
    source_token: account.token,
    source_amount: amount,
    source_currency_code: account.currency_code,
    destination_currency_code: 'PYG',
    destination_token: config.masspayDestinationToken,
    attr_set_token: config.masspayAttrSetToken,
    notify_user: false
  })
})
