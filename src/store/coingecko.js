import Vue from 'vue'

import client from '../api/coingecko'
import {isNativeToken} from '../api/tokens'

export const COINGECKO_FETCH_PLATFORM_COLLECTION = 'COINGECKO_FETCH_PLATFORM_COLLECTION'
export const COINGECKO_SET_EXCHANGE_RATES = 'COINGECKO_SET_EXCHANGE_RATES'
export const EXCHANGE_RATE_SET_BASE_CURRENCY = 'EXCHANGE_RATE_SET_BASE_CURRENCY'

const initialState = () => ({
  platforms: [],
  exchangeRates: {},
  baseCurrency: 'USD',
})

const getters = {
  ethereumCompatibleBlockchains: state => state.platforms.filter(chain => chain.chain_identifier != null),
  exchangeRate: state => token => {
    const rates = state.exchangeRates[token.chain_id]
    const tokenRates = rates && rates[token.address.toLowerCase()]
    return tokenRates && tokenRates[state.baseCurrency.toLowerCase()]
  }
}

const mutations = {
  [COINGECKO_FETCH_PLATFORM_COLLECTION](state, platformList) {
    platformList.forEach(platform => state.platforms.push(platform))
  },
  [COINGECKO_SET_EXCHANGE_RATES](state, {rates, chainId}) {
    Vue.set(state.exchangeRates, chainId, rates)
  },
  [EXCHANGE_RATE_SET_BASE_CURRENCY](state, currencyCode) {
    state.baseCurrency = currencyCode
  }
}

const actions = {
  setBaseCurrency({commit}, currencyCode) {
    return commit(EXCHANGE_RATE_SET_BASE_CURRENCY, currencyCode)
  },
  fetchPlatformList({commit}) {
    return client
      .getPlatforms()
      .then(({data}) => commit(COINGECKO_FETCH_PLATFORM_COLLECTION, data))
  },
  fetchRates({commit, state}, {tokenList, chainId}) {
    const platformTokens = tokenList.filter(token => token.chain_id == chainId && !isNativeToken(token))
    const platform = state.platforms.filter(p => p.chain_identifier == chainId).pop()
    const currencyCode = state.baseCurrency

    if (!platformTokens.length || !platform) {
      return
    }

    return client
      .getTokenRates(platformTokens, platform.id, currencyCode)
      .then(({data}) => commit(COINGECKO_SET_EXCHANGE_RATES, {
        rates: data,
        chainId: chainId
      }))
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations,
}
