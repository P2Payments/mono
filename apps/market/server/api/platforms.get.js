export default defineEventHandler(async event => {
  const platforms = ['Bisq', 'Robosats', 'Peach Bitcoin']; // 'Bity', 'Lnp2pbot'
  return platforms.sort();
})
