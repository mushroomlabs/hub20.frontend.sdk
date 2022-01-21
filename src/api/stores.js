import client from './client'

export default {
  _client: client,
  create(storeData) {
    const {name, site_url, accepted_token_list} = storeData
    let payload = {name, site_url, accepted_token_list}
    return this._client.post('/my/stores', payload)
  },
  getList() {
    return this._client.get('/my/stores')
  },
  get(storeId) {
    return this._client.get(`/my/stores/${storeId}`)
  },
  update(storeData) {
    const {url, name, site_url, accepted_token_list} = storeData
    let payload = {name, site_url, accepted_token_list}
    return this._client.put(url, payload)
  },
  remove(storeId) {
    return this._client.delete(`/my/stores/${storeId}`)
  }
}
