import client from './client'

export const prepareStoreDataPayload = storeData => {
  const {name, site_url, accepted_token_list} = storeData

  // We don't want to allow empty strings or other falsy values.
  const checkout_webhook_url = storeData.checkout_webhook_url || null

  return {name, site_url, accepted_token_list, checkout_webhook_url}

}

export default {
  _client: client,
  create(storeData) {
    const payload = prepareStoreDataPayload(storeData)
    return this._client.post('/my/stores', payload)
  },
  getList() {
    return this._client.get('/my/stores')
  },
  get(storeId) {
    return this._client.get(`/my/stores/${storeId}`)
  },
  update(storeData) {
    const payload = prepareStoreDataPayload(storeData)

    return this._client.put(storeData.url, payload)
  },
  remove(storeId) {
    return this._client.delete(`/my/stores/${storeId}`)
  },
}
