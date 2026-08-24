import { defineEventHandler, getRouterParam, getQuery, setResponseStatus } from 'h3'
import sortBy from 'lodash.sortby'
import { fetchTuPrestamoOffers } from '../../../../utils/fetchTuPrestamo.js'

export default defineEventHandler(async (event) => {
  try {
    const type = getRouterParam(event, 'type')
    const { monto, month, iva } = getQuery(event)

    if (!monto || !month) {
      setResponseStatus(event, 400)
      return { error: { statusCode: 400, message: 'monto and month query params are required' } }
    }

    const [tuprestamo] = await Promise.all([
      fetchTuPrestamoOffers({ monto, month, type, iva })
    ])

    const data = sortBy([...tuprestamo.data], 'monthlyPayment')
    const errors = [tuprestamo.error].filter(e => e !== undefined)

    return { data, errors }
  } catch (error) {
    console.log('financing offers api error', error)
    setResponseStatus(event, 500)
    return { error: true, data: false }
  }
})
