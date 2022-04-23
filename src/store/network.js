import Vue from 'vue'

import client from '../api/network'

export const NETWORK_SET_INITIALIZED = 'NETWORK_SET_INITIALIZED'
export const NETWORK_LOAD_NETWORK_DATA = 'NETWORK_LOAD_NETWORK_DATA'
export const NETWORK_LOAD_BLOCKCHAIN_LIST = 'NETWORK_LOAD_BLOCKCHAIN_LIST'
export const NETWORK_SET_CHAIN_STATE = 'NETWORK_SET_CHAIN_STATE'
export const NETWORK_SET_BLOCKCHAIN_HEIGHT = 'NETWORK_SET_BLOCKCHAIN_HEIGHT'

const initialState = () => ({
  availableNetworks: {},
  blockchains: [],
  chainStateMap: {},
  initialized: false
})

const getters = {
  activeChainIds: state => state.blockchains.map(chain => chain.id),
  chainsById: state => state.blockchains.reduce((acc, chain) => Object.assign({[chain.id]: chain}, acc), {}),
  chainsByUrl: state => state.blockchains.reduce((acc, chain) => Object.assign({[chain.url]: chain}, acc), {}),
  getChainData: (_, getters) => chainId => getters.chainsById[chainId],
  getChainState: state => chainId => state.chainStateMap[chainId],
  isLoaded: state => state.initialized
}

const actions = {
  getAvailableNetworks({commit}){
    return client.getAvailableNetworks().then(({data}) => {
      commit(NETWORK_LOAD_NETWORK_DATA, data)
    })
  },
  getBlockchains({commit}) {
    return client.getBlockchainList().then(({data}) => {
      commit(NETWORK_LOAD_BLOCKCHAIN_LIST, data)
    })
  },
  getStatus({commit}, chainId) {
    return client.getBlockchainStatus(chainId).then(({data}) => {
      commit(NETWORK_SET_CHAIN_STATE, {chainId, data})
    })
  },
  initialize({commit, dispatch, getters}) {
    if (!getters.isLoaded) {
      return dispatch('getAvailableNetworks')
        .then(() => dispatch('getBlockchains'))
        .then(() => {
          getters.activeChainIds.forEach(chainId => dispatch('getStatus', chainId))
          commit(NETWORK_SET_INITIALIZED)
        })
    }
  }
}

const mutations = {
  [NETWORK_SET_INITIALIZED](state) {
      state.initialized = true
  },
  [NETWORK_LOAD_NETWORK_DATA](state, data) {
    Vue.set(state, 'availableNetworks', data)
  },
  [NETWORK_LOAD_BLOCKCHAIN_LIST](state, data) {
    Vue.set(state, 'blockchains', data)
  },
  [NETWORK_SET_CHAIN_STATE](state, {chainId, data}) {
    const chainStateMap = {...state.chainStateMap}

    chainStateMap[chainId] = data

    Vue.set(state, 'chainStateMap', chainStateMap)
  },
  [NETWORK_SET_BLOCKCHAIN_HEIGHT](state, {chainId, blockNumber}) {
    const chainStateMap = {...state.chainStateMap}

    if (chainStateMap[chainId]) {
      chainStateMap[chainId].height = blockNumber
      Vue.set(state, 'chainStateMap', chainStateMap)
    }
  }
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations
}
