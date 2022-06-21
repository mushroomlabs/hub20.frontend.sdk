import client from './client'

export default {
  _client: client,
  getAvailableNetworks() {
    return this._client.get('/networks')
  },
  getNetwork(networkId) {
    return this._client.get(`/networks/${networkId}`)
  },
  getNetworkStatus(networkId) {
    return this._client.get(`/networks/${networkId}/status`)
  }
}
