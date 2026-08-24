export const endpointDefs = [
  { method: 'GET', route: 'currencies',                       file: 'api/currencies.get.js' },
  { method: 'GET', route: 'platforms',                        file: 'api/platforms.get.js' },
  { method: 'GET', route: 'offers/:currency/buy',             file: 'api/offers/[currency]/buy/index.get.js' },
  { method: 'GET', route: 'offers/:currency/buy/bisq',        file: 'api/offers/[currency]/buy/bisq.get.js' },
  { method: 'GET', route: 'offers/:currency/buy/robosats',    file: 'api/offers/[currency]/buy/robosats.get.js' },
  { method: 'GET', route: 'offers/:currency/buy/peach',       file: 'api/offers/[currency]/buy/peach.get.js' },
  { method: 'GET', route: 'offers/:currency/sell',            file: 'api/offers/[currency]/sell/index.get.js' },
  { method: 'GET', route: 'offers/:currency/sell/bisq',       file: 'api/offers/[currency]/sell/bisq.get.js' },
  { method: 'GET', route: 'offers/:currency/sell/robosats',   file: 'api/offers/[currency]/sell/robosats.get.js' },
  { method: 'GET', route: 'offers/:currency/sell/peach',      file: 'api/offers/[currency]/sell/peach.get.js' },
  { method: 'GET', route: 'financing/types',                  file: 'api/financing/types.get.js' },
  { method: 'GET', route: 'financing/platforms',              file: 'api/financing/platforms.get.js' },
  { method: 'GET', route: 'financing/:type',                  file: 'api/financing/[type]/index.get.js' },
  { method: 'GET', route: 'financing/:type/tuprestamo',       file: 'api/financing/[type]/tuprestamo.get.js' },
  { method: 'ALL', route: 'tor-proxy/**',                     file: 'api/tor-proxy/[..._].js' }
]
