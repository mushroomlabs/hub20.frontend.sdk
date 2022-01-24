import client from './client'

export default {
  _client: client,
  getList(params) {
    return this._client.get('/tokens/', {params})
  },
  getToken(tokenUrl) {
    return this._client.get(tokenUrl)
  },
  getTokenData(address, chainId) {
    return this._client.get(`/tokens/${chainId}-${address}`)
  },
  getTransferCostEstimate(token) {
    return this._client.get(`/tokens/${token.chain_id}-${token.address}/transfer_cost`)
  },
  getTokenLists() {
    return this._client.get('/tokenlists')
  }
}
