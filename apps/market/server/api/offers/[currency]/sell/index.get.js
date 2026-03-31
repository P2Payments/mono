import sortBy from 'lodash.sortby';
import { testValidCurrency } from '~/server/utils/testValidCurrency'

export default defineEventHandler(async (event) => {
  try {
    const currency = getRouterParam(event, 'currency');

    const isSupportedCurrency = await testValidCurrency(event, currency)
    if (!isSupportedCurrency) {
      setResponseStatus(event, 404)
      return { error: { statusCode: 404 } }
    }

    const bisqFetch = $fetch(`/api/offers/${currency}/sell/bisq`);
    const roboSatsFetch = $fetch(`/api/offers/${currency}/sell/robosats`);
    const peachFetch = $fetch(`/api/offers/${currency}/sell/peach`);

    const promises = [
      bisqFetch,
      roboSatsFetch,
      peachFetch
    ];

    const [
      bisq,
      roboSats,
      peach
    ] = await Promise.all(promises);

    const data = sortBy([
      ...bisq.data,
      ...roboSats.data,
      ...peach.data
    ], 'price');

    const errors = [
      bisq.error,
      roboSats.error,
      peach.error
    ].filter(error => error !== undefined);

    return { data, errors };
  } catch (error) {
    console.log('sell offers api error', error);
    setResponseStatus(event, 500);
    return { error: true, data: false };
  }
});
