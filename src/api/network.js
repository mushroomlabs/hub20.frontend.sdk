import client from './client'

export default {
  _client: client,
  getAvailableNetworks() {
    return this._client.get('/networks')
  },
  getBlockchainList() {
    return this._client.get('/networks/blockchains')
  },
  getBlockchainStatus(chainId) {
    return this._client.get(`/networks/blockchains/${chainId}/status`)
  }
}
