import client from './client'

export default {
  _client: client,
  getBlockchainList() {
    return this._client.get('/networks/blockchains')
  },
  getBlockchainStatus(chainId) {
    return this._client.get(`/networks/blockchains/${chainId}/status`)
  }
}
