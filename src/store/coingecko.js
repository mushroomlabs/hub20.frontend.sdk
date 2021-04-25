import Vue from 'vue'

import client from '../api/coingecko'
import {BASE_TOKEN_LIST, ETHEREUM_NETWORKS} from './tokens'

export const EXCHANGE_RATE_SET_COINGECKO_LIST = 'EXCHANGE_RATE_SET_COINGECKO_LIST'
export const EXCHANGE_RATE_SET_COINGECKO_RATE = 'EXCHANGE_RATE_SET_COINGECKO_RATE'
export const COINGECKO_TOKEN_SET_LOGO_URL = 'COINGECKO_TOKEN_SET_LOGO_URL'

const initialState = () => ({
  tokens: [],
  exchangeRates: {},
  baseCurrency: 'USD',
  tokenLogoMap: {},
})

const getters = {
  exchangeRatesByCurrency: state => currencyCode => state.exchangeRates[currencyCode],
  exchangeRate: (state, getters) => token => {
    let exchangeRates = getters.exchangeRatesByCurrency(state.baseCurrency)
    return exchangeRates && exchangeRates[token.address]
  },
  tokenByAddress: state => tokenAddress =>
    state.tokens.filter(token => token.address == tokenAddress).shift(),
  tokenLogoByAddress: state => tokenAddress => state.tokenLogoMap[tokenAddress],
}

const mutations = {
  [EXCHANGE_RATE_SET_COINGECKO_LIST](state, tokenList) {
    state.tokens = tokenList
  },
  [EXCHANGE_RATE_SET_COINGECKO_RATE](state, {token, currencyCode, rate}) {
    let exchangeRates = state.exchangeRates[currencyCode] || {}
    exchangeRates[token.address] = rate
    Vue.set(state, 'exchangeRates', {[currencyCode]: exchangeRates})
  },
  [COINGECKO_TOKEN_SET_LOGO_URL](state, {token, url}) {
    Vue.set(state.tokenLogoMap, token.address, url)
  },
}

const actions = {
  fetchCoingeckoTokenList({commit}) {
    return client
      .getTokenList()
      .then(({data}) => commit(EXCHANGE_RATE_SET_COINGECKO_LIST, data.tokens))
  },
  fetchRates({dispatch, rootState}) {
    rootState.tokens.tokens.forEach(token => dispatch('fetchRate', token))
  },
  fetchRate({commit, getters, state}, token) {
    const currencyCode = state.baseCurrency
    const isMainnet = token.network_id == ETHEREUM_NETWORKS.mainnet
    const address = isMainnet ? token.address : BASE_TOKEN_LIST[token.code]
    const coingeckoToken = address && getters.tokenByAddress(address)

    if (coingeckoToken) {
      return client
        .getTokenRate(coingeckoToken, currencyCode)
        .then(rate => commit(EXCHANGE_RATE_SET_COINGECKO_RATE, {token, currencyCode, rate}))
    } else {
      return client
        .getEthereumRate(currencyCode)
        .then(rate => commit(EXCHANGE_RATE_SET_COINGECKO_RATE, {token, currencyCode, rate}))
    }
  },
  initialize({dispatch}) {
    dispatch('fetchCoingeckoTokenList').then(() => dispatch('fetchRates'))
  },
  refresh({dispatch}) {
    dispatch('fetchRates')
  },
  fetchTokenLogoUrl({commit}, token) {
    return client
      .getTokenLogoUrl(token)
      .then(url => commit(COINGECKO_TOKEN_SET_LOGO_URL, {token, url}))
  },
}

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations,
}
