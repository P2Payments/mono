import { randomUUID } from 'node:crypto'
import { createMasspayClient } from './masspayClient.js'

// ponytail: sweeps the *entire* available balance to a single preconfigured
// beneficiary in PYG via SIPAP. Splitting by percentage or multiple
// destinations can be added later once there's more than one payee.
export const sweepToBeneficiary = async (config) => {
  const sdk = createMasspayClient(config)

  const balances = await sdk.AccountService.getAccountBalance()
  const account = balances.find((b) => b.currency_code === config.masspaySourceCurrency) ?? balances[0]

  if (!account || account.balance <= 0) {
    return { swept: false, reason: 'no available balance' }
  }

  // Quotes expire 2 minutes after creation, so commit immediately.
  const quote = await sdk.PayoutService.initiatePayout(config.masspayBeneficiaryUserToken, {
    client_transfer_id: randomUUID(),
    source_token: account.token,
    source_amount: account.balance,
    source_currency_code: account.currency_code,
    destination_currency_code: 'PYG',
    destination_token: config.masspayDestinationToken,
    attr_set_token: config.masspayAttrSetToken,
    notify_user: false
  })

  if (!quote?.payout_token || quote.payout_token === 'NSF' || quote.payout_token === 'DUPLICATE') {
    return { swept: false, reason: quote?.payout_token ?? 'quote failed', quote }
  }

  const commit = await sdk.PayoutService.commitPayoutTxn(config.masspayBeneficiaryUserToken, quote.payout_token)
  return { swept: commit.status === 'success', quote, commit }
}
