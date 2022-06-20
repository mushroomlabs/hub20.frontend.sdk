import client from './client'

export const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000'

export const isNativeToken = token => (token.address === undefined && token.chain_id !== undefined)

export const convertToToken = userToken => {
  const tokenUrl = userToken.token
  const token = {...userToken}
  delete token.token

  token.url = tokenUrl
  return token
}

export const resolveTokenUrl = token => `/tokens/${token.id}`
export const resolveUserTokenUrl = token => `/my/tokens/${token.id}`

export default {
  _client: client,
  token: {
    getList(params) {
      return client.get('/tokens', {params})
    },
    getByUrl(tokenUrl) {
      return client.get(tokenUrl)
    },
    get(token) {
      return client.get(resolveTokenUrl(token))
    },
    getTransferCostEstimate(token) {
      return client.get(`${resolveTokenUrl(token)}/transfer_cost`)
    },
    getRoutes(token) {
      return client.get(`${resolveTokenUrl(token)}/routes`)
    },
    getExtraInfo(token) {
      return client.get(`${resolveTokenUrl(token)}/info`)
    },
    search(searchTerm, filterParams) {
      const params = {...filterParams}

      if (searchTerm) {
        params['search'] = searchTerm
      }

      return this.getList(params)
    },
  },
  userToken: {
    getList(params) {
      return client.get('/my/tokens', {params})
    },
    getByUrl(userTokenUrl) {
      return client.get(userTokenUrl)
    },
    get(userToken) {
      return client.get(resolveUserTokenUrl(userToken))
    },
    track(token) {
      const tokenUrl = resolveTokenUrl(token)
      return client.post('/my/tokens', {token: tokenUrl})
    },
    remove(token) {
      const userTokenUrl = resolveUserTokenUrl(token)
      return client.delete(userTokenUrl)
    },
  },
  tokenList: {
    getList() {
      return client.get('/tokenlists')
    },
  },
  userTokenList: {
    getList() {
      return client.get('/my/tokenlists')
    },
    getById(tokenListId) {
      return client.get(`/my/tokenlists/${tokenListId}`)
    },
    create(tokenListData) {
      const {name, description, tokens, keywords} = tokenListData
      return client.post('/my/tokenlists', {name, description, tokens, keywords})
    },
    update(tokenList) {
      const {url, name, description, tokens, keywords} = tokenList
      return client.put(url, {name, description, tokens, keywords})
    },
  },
}
