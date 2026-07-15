import { createHash } from 'node:crypto'
import { verifyWebhookSignature } from '../lib/verifyWebhookSignature.js'
import { sweepToBeneficiary } from '../lib/sweepToBeneficiary.js'
import { alreadyProcessed, markProcessed } from '../lib/processedWebhooks.js'

// Incoming funds (USDT load, ACH deposit) surface as `load` or `balance_credit`
// events. Any other event_type (payout status, KYC, tax, ...) is ignored here.
const FUNDING_EVENTS = new Set(['load', 'balance_credit'])

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event, 'utf8')
  const signatureHeader = getHeader(event, 'x-masspay-signature')

  if (!verifyWebhookSignature(rawBody, signatureHeader, config.masspayWebhookSecret)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid webhook signature' })
  }

  const payload = JSON.parse(rawBody)

  if (!FUNDING_EVENTS.has(payload.event_type)) {
    return { ok: true, ignored: true, event_type: payload.event_type }
  }

  if (payload.status && payload.status !== 'COMPLETED') {
    return { ok: true, ignored: true, reason: `status ${payload.status}` }
  }

  const dedupeKey = createHash('sha256').update(rawBody).digest('hex')
  if (alreadyProcessed(dedupeKey)) {
    return { ok: true, ignored: true, reason: 'duplicate webhook' }
  }
  markProcessed(dedupeKey)

  const result = await sweepToBeneficiary(config)
  return { ok: true, ...result }
})
