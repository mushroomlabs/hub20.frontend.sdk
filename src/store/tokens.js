import Vue from 'vue'

import {isNativeToken, default as client} from '../api/tokens'

export const TOKENLIST_FETCH_COLLECTION = 'TOKENLIST_FETCH_COLLECTION'
export const TOKENLIST_FETCH_SINGLE = 'TOKENLIST_FETCH_SINGLE'
export const TOKENLIST_FETCH_ERROR = 'TOKENLIST_FETCH_ERROR'
export const TOKEN_FETCH_COLLECTION = 'TOKEN_FETCH_COLLECTION'
export const TOKEN_FETCH_SINGLE = 'TOKEN_FETCH_SINGLE'
export const TOKEN_FETCH_ERROR = 'TOKEN_FETCH_ERROR'
export const TOKEN_UPDATE_TRANSFER_COST = 'TOKEN_UPDATE_TRANSFER_COST'
export const TOKEN_SET_ROUTES = 'TOKEN_SET_ROUTES'
export const TOKEN_SEARCH_ERROR = 'TOKEN_SEARCH_ERROR'

export const USER_TOKENLIST_FETCH_COLLECTION = 'USER_TOKENLIST_FETCH_COLLECTION'
export const USER_TOKENLIST_FETCH_SINGLE = 'USER_TOKENLIST_FETCH_SINGLE'
export const USER_TOKENLIST_FETCH_ERROR = 'USER_TOKENLIST_FETCH_ERROR'

export const USER_TOKENLIST_EDIT_BEGIN = 'USER_TOKENLIST_EDIT_BEGIN'
export const USER_TOKENLIST_EDIT_COMPLETE = 'USER_TOKENLIST_EDIT_COMPLETE'
export const USER_TOKENLIST_EDIT_ERROR = 'USER_TOKENLIST_EDIT_ERROR'
export const USER_TOKENLIST_EDIT_SET_NAME = 'USER_TOKENLIST_EDIT_SET_NAME'
export const USER_TOKENLIST_EDIT_SET_DESCRIPTION = 'USER_TOKENLIST_EDIT_SET_DESCRIPTION'
export const USER_TOKENLIST_EDIT_SET_TOKENS = 'USER_TOKENLIST_EDIT_SET_TOKENS'
export const USER_TOKENLIST_EDIT_SUCCESS = 'USER_TOKENLIST_EDIT_SUCCESS'

export const USER_TOKEN_FETCH_COLLECTION = 'USER_TOKEN_FETCH_COLLECTION'
export const USER_TOKEN_FETCH_SINGLE = 'USER_TOKEN_FETCH_SINGLE'
export const USER_TOKEN_FETCH_ERROR = 'USER_TOKEN_FETCH_ERROR'
export const USER_TOKEN_REMOVE_SINGLE = 'USER_TOKEN_REMOVE_SINGLE'

function canPayWithRaiden(tokenRouteInfo) {
  return Boolean(tokenRouteInfo && tokenRouteInfo.networks.raiden)
}

const initialTokenListData = () => ({
  name: '',
  description: '',
  tokens: [],
  keywords: []
})

const initialState = () => ({
  tokens: [],
  transferCosts: {},
  routes: {},
  tokenLists: [],
  userTokens: [],
  userTokenLists: [],
  errors: [],
  editingUserTokenList: null
})

const getters = {
  tokenListsByUrl: state =>
    state.tokenLists.reduce(
      (acc, tokenList) => Object.assign({[tokenList.url]: tokenList}, acc),
      {}
    ),
  tokensByUrl: state =>
    state.tokens.reduce((acc, token) => Object.assign({[token.url]: token}, acc), {}),
  tokensByChainId: state => chainId => state.tokens.filter(token => token.chain_id == chainId),
  nativeTokens: state => state.tokens.filter(token => isNativeToken(token)),
  nativeTokensByChain: (_, getters) =>
    getters.nativeTokens.reduce(
      (acc, token) => Object.assign({[token.chain_id]: token}, acc),
      {}
    ),
  nativeToken: (_, getters) => chainId => getters.nativeTokensByChain[chainId],
  userTokenListsByUrl: state =>
    state.userTokenLists.reduce(
      (acc, tokenList) => Object.assign({[tokenList.url]: tokenList}, acc),
      {}
    ),
  userTokensByUrl: state =>
    state.userTokens.reduce((acc, token) => Object.assign({[token.url]: token}, acc), {}),
  tokenListSubmissionErrors: state => state.errors.filter(error => error.type === USER_TOKENLIST_EDIT_ERROR),
  tokensWithRaidenRoute: state => state.tokens.filter(token => canPayWithRaiden(state.routes[token.url]))
}

const actions = {
  searchTokens({commit}, {searchTerm, filterParams}) {
    return client
      .token.search(searchTerm, filterParams)
      .catch(error => commit(TOKEN_SEARCH_ERROR, error))
  },
  fetchTokens({commit}, filterOptions) {
    return client
      .token.getList(filterOptions)
      .then(({data}) => commit(TOKEN_FETCH_COLLECTION, data))
      .catch(error => commit(TOKEN_FETCH_ERROR, error))
  },
  fetchToken({commit}, token) {
    return client.token.get(token).then(({data}) => commit(TOKEN_FETCH_SINGLE, data))
  },
  fetchTokenByUrl({commit}, tokenUrl) {
    return client.token.getByUrl(tokenUrl).then(({data}) => {
      commit(TOKEN_FETCH_SINGLE, data)
      return data
    })
  },
  fetchNativeToken({commit}, chainId) {
    return client.token
                 .getNativeToken(chainId)
                 .then(({data}) => commit(TOKEN_FETCH_SINGLE, data))
  },
  fetchTransferCostEstimate({commit}, token) {
    return client
      .token.getTransferCostEstimate(token)
      .then(({data}) => commit(TOKEN_UPDATE_TRANSFER_COST, {token, weiAmount: data}))
  },
  fetchRoutes({commit}, token) {
    return client
      .token.getRoutes(token)
      .then(({data}) => commit(TOKEN_SET_ROUTES, {token, routes: data}))
  },
  fetchTokenLists({commit, dispatch}) {
    return client
      .tokenList.getList()
      .then(({data}) => {
        commit(TOKENLIST_FETCH_COLLECTION, data)
        data.forEach(tokenList =>
          tokenList.forEach(tokenUrl => dispatch('fetchTokenByUrl', tokenUrl))
        )
      })
      .catch(error => commit(TOKENLIST_FETCH_ERROR, error))
  },
  fetchUserTokens({commit}, filterOptions) {
    return client
      .userToken.getList(filterOptions)
      .then(({data}) => {
        commit(USER_TOKEN_FETCH_COLLECTION, data)
      })
      .catch(error => commit(USER_TOKEN_FETCH_ERROR, error))
  },
  fetchUserToken({commit}, userToken) {
    return client
      .userToken.get(userToken)
      .then(({data}) => commit(USER_TOKEN_FETCH_SINGLE, data))
  },
  fetchUserTokenByUrl({commit, getters}, tokenUrl) {
    if (!getters.userTokensByUrl[tokenUrl]) {
      return client
        .userToken.getByUrl(tokenUrl)
        .then(({data}) => commit(USER_TOKEN_FETCH_SINGLE, data))
    }
  },
  fetchUserTokenLists({commit, dispatch}) {
    return client
      .userTokenList.getList()
      .then(({data}) => {
        commit(USER_TOKENLIST_FETCH_COLLECTION, data)
        data.forEach(tokenList =>
          tokenList.forEach(tokenUrl => dispatch('fetchTokenByUrl', tokenUrl))
        )
      })
      .catch(error => commit(USER_TOKENLIST_FETCH_ERROR, error))
  },
  fetchUserTokenList({commit, dispatch}, tokenListId) {
    return client
      .userTokenList.getById(tokenListId)
      .then(({data}) => {
        commit(USER_TOKENLIST_FETCH_SINGLE, data)
        data.tokens.forEach(tokenUrl => dispatch('fetchTokenByUrl', tokenUrl))
        return data
      })
      .catch(error => commit(USER_TOKENLIST_FETCH_ERROR, error))
  },
  trackToken({commit}, token) {
    return client.userToken.track(token).then(({data}) => commit(USER_TOKEN_FETCH_SINGLE, data))
  },
  untrackToken({commit}, token) {
    return client.userToken.remove(token).then(() => commit(USER_TOKEN_REMOVE_SINGLE, token))
  },
  saveUserTokenList({commit}, tokenList) {
    const action = tokenList.url ? client.userTokenList.update : client.userTokenList.create
    return action(tokenList)
      .then(({data}) => commit(USER_TOKENLIST_FETCH_SINGLE, data))
      .catch(({response}) => commit(USER_TOKENLIST_EDIT_ERROR, response.data))
  }
}

const mutations = {
  [TOKENLIST_FETCH_ERROR](state, error) {
    state.errors.push({error, type: TOKENLIST_FETCH_ERROR})
  },
  [TOKENLIST_FETCH_COLLECTION](state, tokenList) {
    Vue.set(state, 'tokenLists', tokenList)
  },
  [TOKEN_FETCH_ERROR](state, error) {
    state.errors.push({error, type: TOKEN_FETCH_ERROR})
  },
  [TOKEN_FETCH_COLLECTION](state, data) {
    const currentTokensByUrl = state.tokens.map(token => token.url)
    data.forEach(token => {
      if (!currentTokensByUrl.includes(token.url)) {
        state.tokens.push(token)
      }
    })
  },
  [TOKEN_FETCH_SINGLE](state, token) {
    const currentTokensByUrl = state.tokens.map(token => token.url)
    if (!currentTokensByUrl.includes(token.url)) {
      state.tokens.push(token)
    }
  },
  [TOKEN_UPDATE_TRANSFER_COST](state, {token, weiAmount}) {
    Vue.set(state.transferCosts, token.url, weiAmount)
  },
  [TOKEN_SET_ROUTES](state, {token, routes}) {
    Vue.set(state.routes, token.url, routes)
  },
  [TOKEN_SEARCH_ERROR](state, error) {
    state.errors.push({error, type: TOKEN_SEARCH_ERROR})
  },
  [USER_TOKENLIST_FETCH_ERROR](state, error) {
    state.errors.push({error, type: USER_TOKENLIST_FETCH_ERROR})
  },
  [USER_TOKENLIST_FETCH_SINGLE](state, userTokenList) {
    const tokenListsByUrl = state.userTokenLists.map(userTokenList => userTokenList.url)
    if (!tokenListsByUrl.includes(userTokenList.url)) {
      state.userTokenLists.push(userTokenList)
    }
  },
  [USER_TOKENLIST_FETCH_COLLECTION](state, userTokenLists) {
    Vue.set(state, 'userTokenLists', userTokenLists)
  },
  [USER_TOKEN_FETCH_ERROR](state, error) {
    state.errors.push({error, type: USER_TOKEN_FETCH_ERROR})
  },
  [USER_TOKEN_FETCH_COLLECTION](state, data) {
    const currentTokensByUrl = state.userTokens.map(userToken => userToken.url)
    data.forEach(userToken => {
      if (!currentTokensByUrl.includes(userToken.url)) {
        state.userTokens.push(userToken)
      }
    })
  },
  [USER_TOKEN_FETCH_SINGLE](state, userToken){
    const currentTokensByUrl = state.userTokens.map(userToken => userToken.url)
    if (!currentTokensByUrl.includes(userToken.url)) {
      state.userTokens.push(userToken)
    }
  },
  [USER_TOKEN_REMOVE_SINGLE](state, token) {
    const newList = state.userTokens.filter(
      userToken => !(token.address == userToken.address && token.chain_id == userToken.chain_id)
    )
    Vue.set(state, 'userTokens', newList)
  },
  [USER_TOKENLIST_EDIT_BEGIN](state, tokenListData) {
    state.editingUserTokenList = tokenListData || initialTokenListData()
  },
  [USER_TOKENLIST_EDIT_COMPLETE](state) {
    state.editingUserTokenList = null
  },
  [USER_TOKENLIST_EDIT_SET_NAME](state, name) {
    Vue.set(state.editingUserTokenList, 'name', name)
  },
  [USER_TOKENLIST_EDIT_SET_DESCRIPTION](state, description) {
   Vue.set(state.editingUserTokenList, 'description', description)
  },
  [USER_TOKENLIST_EDIT_SET_TOKENS](state, tokenUrlList) {
    Vue.set(state.editingUserTokenList, 'tokens', tokenUrlList)
  },
  [USER_TOKENLIST_EDIT_SUCCESS](state) {
    const cleared = state.errors.filter(error => error.type === USER_TOKENLIST_EDIT_ERROR)
    Vue.set(state, 'errors', cleared)
  },
  [USER_TOKENLIST_EDIT_ERROR](state, error) {
    state.errors.push({error: error, type: USER_TOKENLIST_EDIT_ERROR})
  },
}

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations,
}
