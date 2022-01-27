import Vue from 'vue'

import client from '../api/network'

export const NETWORK_SET_INITIALIZED = 'NETWORK_SET_INITIALIZED'
export const NETWORK_LOAD_BLOCKCHAIN_LIST = 'NETWORK_LOAD_BLOCKCHAIN_LIST'
export const NETWORK_LOAD_BLOCKCHAIN_DATA = 'NETWORK_LOAD_BLOCKCHAIN_DATA'
export const NETWORK_SET_BLOCKCHAIN_HEIGHT = 'NETWORK_SET_BLOCKCHAIN_HEIGHT'

const initialState = () => ({
  blockchains: [],
  chainDataMap: {},
  initialized: false
})

const getters = {
  activeChainIds: state => state.blockchains.map(chain => chain.id),
  chainsById: state => state.blockchains.reduce((acc, chain) => Object.assign({[chain.id]: chain}, acc), {}),
  chainData: (_, getters) => chainId => getters.chainsById[chainId],
  chainState: state => chainId => state.chainDataMap[chainId],
  IsNodeOnline: (_, getters) => chainId => getters.chainState(chainId) && getters.chainState(chainId).online,
  IsNodeSynced: (_, getters) => chainId => getters.chainState(chainId) && getters.chainState(chainId).synced,
  currentBlock: (_, getters) => chainId => getters.chainState(chainId) && getters.chainState(chainId).height,
  isLoaded: state => state.initialized
}

const actions = {
  getBlockchains({commit}) {
    return client.getBlockchainList().then(({data}) => {
      commit(NETWORK_LOAD_BLOCKCHAIN_LIST, data)
    })
  },
  getStatus({commit}, chainId) {
    return client.getBlockchainStatus(chainId).then(({data}) => {
      commit(NETWORK_LOAD_BLOCKCHAIN_DATA, {chainId, data})
    })
  },
  initialize({commit, dispatch, getters}) {
    if (!getters.isLoaded) {
      return dispatch('getBlockchains').then(() => {
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
  [NETWORK_LOAD_BLOCKCHAIN_LIST](state, data) {
    Vue.set(state, 'blockchains', data)
  },
  [NETWORK_LOAD_BLOCKCHAIN_DATA](state, {chainId, data}) {
    Vue.set(state.chainDataMap, chainId, data)
  },
  [NETWORK_SET_BLOCKCHAIN_HEIGHT](state, {chainId, blockNumber}) {
    const chainDataMap = {...state.chainDataMap}

    if (chainDataMap[chainId]) {
      chainDataMap[chainId].height = blockNumber
      Vue.set(state, 'chainDataMap', chainDataMap)
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
