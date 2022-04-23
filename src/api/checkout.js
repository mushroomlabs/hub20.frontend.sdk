import client from './client'

export default {
  _client: client,
  create({storeData, token, tokenAmount, reference}) {
    const payload = {
      store: storeData.id,
      token: token.url,
      amount: tokenAmount,
      reference: reference
    }
    return this._client.post('/checkout', payload)
  },
  getStoreData(storeId){
    return this._client.get(`/stores/${storeId}`)
  },
  fetch(checkoutId) {
    return this._client.get(`/checkout/${checkoutId}`)
  },
  createNewRoute(checkoutId, paymentNetwork) {
    const url = `/checkout/${checkoutId}/routes`
    return this._client.post(url, {network: paymentNetwork})
  },
}
