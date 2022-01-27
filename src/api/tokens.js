import client from './client'

export const convertToToken = (userToken) => {
  const tokenUrl = userToken.token
  const token = {...userToken}
  delete token.token

  token.url = tokenUrl
  return token
}

export default {
  _client: client,
  getList(params) {
    return this._client.get('/tokens', {params})
  },
  getTokenByUrl(tokenUrl) {
    return this._client.get(tokenUrl)
  },
  getToken(token) {
    return this._client.get(this.resolveTokenUrl(token))
  },
  getTransferCostEstimate(token) {
    return this._client.get(`/tokens/${token.chain_id}-${token.address}/transfer_cost`)
  },
  getTokenLists() {
    return this._client.get('/tokenlists')
  },
  getUserTokens(params) {
    return this._client.get('/my/tokens', {params})
  },
  getUserTokenByUrl(userTokenUrl) {
    return this._client.get(userTokenUrl)
  },
  getUserToken(userToken) {
    return this._client.get(this.resolveUserTokenUrl(userToken))
  },
  trackToken(token) {
    const tokenUrl = this.resolveTokenUrl(token)
    return this._client.post('/my/tokens', {token: tokenUrl})
  },
  removeUserToken(token) {
    const userTokenUrl = this.resolveUserTokenUrl(token)
    return this._client.delete(userTokenUrl)
  },
  searchTokens(searchTerm, filterParams){
    const params = {...filterParams}

    if (searchTerm) {
      params['search'] = searchTerm
    }

    return this.getList(params)
  },
  resolveTokenUrl(token) {
    return `/tokens/${token.chain_id}-${token.address}`
  },
  resolveUserTokenUrl(token) {
    return `/my/tokens/${token.chain_id}-${token.address}`
  }
}
