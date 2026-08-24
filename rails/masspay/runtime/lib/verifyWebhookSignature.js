import { createHmac, timingSafeEqual } from 'node:crypto'

// MassPay signs webhooks with `X-MassPay-Signature: t=TIMESTAMP,s=HMAC_VALUE`
// where HMAC_VALUE = HMAC-SHA512(secret, `${TIMESTAMP}|${rawBody}`) in hex.
export const verifyWebhookSignature = (rawBody, signatureHeader, secret) => {
  if (!signatureHeader || !secret) return false

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((pair) => pair.trim().split('='))
  )
  const { t: timestamp, s: signature } = parts
  if (!timestamp || !signature) return false

  const expected = createHmac('sha512', secret).update(`${timestamp}|${rawBody}`).digest('hex')
  const expectedBuf = Buffer.from(expected, 'hex')
  const signatureBuf = Buffer.from(signature, 'hex')

  return expectedBuf.length === signatureBuf.length && timingSafeEqual(expectedBuf, signatureBuf)
}
