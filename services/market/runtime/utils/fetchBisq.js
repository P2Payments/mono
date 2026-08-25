import groupBy from 'lodash.groupby'
import minBy from 'lodash.minby'
import maxBy from 'lodash.maxby'
import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { capitalize } from './capitalize.js'

const BISQ_ONION = 'http://runbtcxzz4v2haszypwbrn2baqdo7tlwt6dw7g27cwwaootd4gktwayd.onion'
const SOCKS_URL = 'socks5h://127.0.0.1:9050'

const fetchBisqOffers = async (currency) => {
  const url = `${BISQ_ONION}/api/offers?market=BTC_${currency}`
  const agent = new SocksProxyAgent(SOCKS_URL)

  const res = await got(url, {
    agent: { http: agent, https: agent },
    timeout: { request: 20000 },
    headers: {
      accept: 'application/json',
      'user-agent': 'paguaitu'
    }
  })

  try {
    return JSON.parse(res.body)
  } catch (e) {
    return null
  }
}

export const fetchBisqBuy = async (currency) => {
  try {
    const offers = await fetchBisqOffers(currency)
    if (!offers) return { data: [], error: 'bisq' }

    const key = `btc_${currency.toLowerCase()}`
    const buys = offers?.[key]?.buys

    if (!Array.isArray(buys) || buys.length === 0) return { data: [] }

    const methods = groupBy(buys, 'payment_method')
    const data = Object.keys(methods).reduce((arr, method) => {
      const offer = parseFloat(minBy(methods[method], 'price').price)
      const fee = offer * 1.15 / 100
      arr.push({
        service: 'Bisq',
        site: 'https://bisq.network/',
        features: ['on-chain', 'p2p', 'open-source'],
        method: capitalize(method.split('_').join(' ')).replace('F2f', 'In Person'),
        price: parseFloat(offer - fee)
      })
      return arr
    }, [])

    return { data }
  } catch (error) {
    console.log('bisq buy api error', error?.message || error)
    return { data: [], error: 'bisq' }
  }
}

export const fetchBisqSell = async (currency) => {
  try {
    const offers = await fetchBisqOffers(currency)
    if (!offers) return { data: [], error: 'bisq' }

    const key = `btc_${currency.toLowerCase()}`
    const sells = offers?.[key]?.sells

    if (!Array.isArray(sells) || sells.length === 0) return { data: [] }

    const methods = groupBy(sells, 'payment_method')
    const data = Object.keys(methods).reduce((arr, method) => {
      const offer = parseFloat(maxBy(methods[method], 'price').price)
      const fee = offer * 1.15 / 100
      arr.push({
        service: 'Bisq',
        site: 'https://bisq.network/',
        features: ['on-chain', 'p2p', 'open-source'],
        method: capitalize(method.split('_').join(' ')).replace('F2f', 'In Person'),
        price: parseFloat(offer + fee)
      })
      return arr
    }, [])

    return { data }
  } catch (error) {
    console.log('bisq sell api error', error?.message || error)
    return { data: [], error: 'bisq' }
  }
}
