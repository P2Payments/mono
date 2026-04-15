import { getRequestHeader } from 'h3'

export const getRealIp = (event) => {
  const cf = getRequestHeader(event, 'cf-connecting-ip')
  if (cf) return cf.trim()

  const xff = getRequestHeader(event, 'x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()

  const xr = getRequestHeader(event, 'x-real-ip')
  if (xr) return xr.trim()

  return event.node.req?.socket?.remoteAddress || undefined
}
