import client from './client'

export default {
  _client: client,
  getList(params) {
    return this._client.get('/tokens/', {params})
  },
  getTokenData(address, chainId) {
    return this._client.get(`/tokens/${chainId}-${address}`)
  }
}
