import { defineEventHandler, getRouterParam, getQuery } from 'h3'
import { fetchTuPrestamoOffers } from '../../../../utils/fetchTuPrestamo.js'

export default defineEventHandler(async (event) => {
  const type = getRouterParam(event, 'type')
  const { monto, month, iva } = getQuery(event)
  return fetchTuPrestamoOffers({ monto, month, type, iva })
})
