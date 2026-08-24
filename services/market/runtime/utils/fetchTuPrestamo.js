import { ofetch } from 'ofetch'

const BASE_URL = 'https://tuprestamo.com.py/resultados.php'

const parseGs = (str) => {
  const digits = String(str || '').replace(/\D/g, '')
  return digits ? parseInt(digits, 10) : null
}

// ponytail: regex scraping of tuprestamo.com.py's fixed 3-card result layout
// (no JSON API exists there — verified). Swap to an HTML parser dependency
// if the source markup changes and this starts silently returning [].
const parseCard = (card) => {
  const entity = card.match(/company-name">([^<]+)/)?.[1]?.trim()
  const rating = card.match(/rating-count">\s*([\d.]+)\s*\((\d+)\s*valoraciones\)/)
  const purpose = card.match(/Prop[oó]sito:<\/span>\s*<span class="detail-value">([^<]+)/)?.[1]?.trim()
  const term = card.match(/Plazo:<\/span>\s*<span class="detail-value">([^<]+)/)?.[1]
  const amount = card.match(/Monto:<\/span>\s*<span class="detail-value">([^<]+)/)?.[1]
  const otherFees = card.match(/Otros gastos:<\/span>\s*<span class="detail-value">([^<]+)/)?.[1]
  // Requisitos value can wrap plain text or nested <span class="req-tag"> pills — strip all tags to get plain text
  const requirements = card.match(/Requisitos:<\/span>\s*<span class="detail-value[^"]*">([\s\S]*?)<\/div>\s*<\/div>/)?.[1]
    ?.replace(/<[^>]+>/g, ' ')
  const monthlyPayment = card.match(/payment-amount">\s*([^<]+)/)?.[1]

  return {
    entity: entity || null,
    rating: rating ? parseFloat(rating[1]) : null,
    reviews: rating ? parseInt(rating[2], 10) : null,
    purpose: purpose || null,
    termMonths: term ? parseInt(term, 10) : null,
    amount: parseGs(amount),
    otherFees: parseGs(otherFees),
    monthlyPayment: parseGs(monthlyPayment),
    requirements: requirements ? requirements.replace(/\s+/g, ' ').trim() : null
  }
}

export const fetchTuPrestamoOffers = async ({ monto, month, type = 'personal', iva = 1 }) => {
  try {
    const html = await ofetch(BASE_URL, {
      query: { monto, month, type, iva },
      responseType: 'text'
    })

    const cards = html.match(/<div class="result-card[\s\S]*?(?=<div class="result-card|<div class="cta-section|$)/g) || []

    const data = cards
      .map(parseCard)
      .filter(offer => offer.entity)
      .map(offer => ({
        service: 'TuPrestamo',
        site: 'https://tuprestamo.com.py/',
        features: ['py', 'loan'],
        ...offer
      }))

    return { data }
  } catch (error) {
    console.log('tuprestamo financing api error', error?.message || error)
    return { data: [], error: 'tuprestamo' }
  }
}
