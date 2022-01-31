import client from './client'

export default {
  _client: client,
  create(storeData) {
    const {name, site_url, accepted_token_list, checkout_webhook_url} = storeData
    return this._client.post('/my/stores', {
      name,
      site_url,
      accepted_token_list,
      checkout_webhook_url,
    })
  },
  getList() {
    return this._client.get('/my/stores')
  },
  get(storeId) {
    return this._client.get(`/my/stores/${storeId}`)
  },
  update(storeData) {
    const {url, name, site_url, accepted_token_list} = storeData

    // We don't want to allow empty strings or other falsy values.
    const checkout_webhook_url = storeData.checkout_webhook_url || null

    return this._client.put(url, {name, site_url, accepted_token_list, checkout_webhook_url})
  },
  remove(storeId) {
    return this._client.delete(`/my/stores/${storeId}`)
  },
}
