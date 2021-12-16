import Vue from 'vue'

import client from '../api/network'

export const NETWORK_LOAD_BLOCKCHAIN_STATUS_SUCCESS = 'NETWORK_LOAD_BLOCKCHAIN_STATUS_SUCCESS'
export const NETWORK_SET_ETHEREUM_CURRENT_BLOCK = 'NETWORK_SET_ETHEREUM_CURRENT_BLOCK'

const initialState = () => ({
  blockchains: []
})

const getters = {
  chainsById: state => state.blockchains.reduce((acc, chain) => Object.assign({[chain.blockchain.network]: chain}, acc), {}),
  NodeOnline: (_, getters) => chainId => getters.chainsById[chainId].online,
  NodeSynced: (_, getters) => chainId => getters.chainsById[chainId].synced,
  currentBlock: (_, getters) => chainId => getters.chainsById[chainId].currentBlock,
}

const actions = {
  getStatus({commit}) {
    client.getBlockchainStatusList().then(({data}) => {
      commit(NETWORK_LOAD_BLOCKCHAIN_STATUS_SUCCESS, data)
    })
  },
  initialize({dispatch}) {
    return dispatch('getStatus')
  },
  refresh({dispatch}) {
    return dispatch('getStatus')
  }
}

const mutations = {
  [NETWORK_LOAD_BLOCKCHAIN_STATUS_SUCCESS](state, data) {
    state.blockchains = data
  },
  [NETWORK_SET_ETHEREUM_CURRENT_BLOCK](state, blockNumber) {
    Vue.set(state.ethereum, 'currentBlock', blockNumber)
  }
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations
}
