import client from './client'

export default {
  _client: client,
  getBlockchainStatusList() {
    return this._client.get('/status/networks')
  },
  getBlockchainStatus(chainId) {
    return this._client.get(`/status/networks/${chainId}`)
  }
}
