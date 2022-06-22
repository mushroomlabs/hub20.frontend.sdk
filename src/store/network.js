import Vue from 'vue'

import client from '../api/network'

export const NETWORK_SET_INITIALIZED = 'NETWORK_SET_INITIALIZED'
export const NETWORK_LOAD_LIST = 'NETWORK_LOAD_LIST'
export const NETWORK_SET_DATA = 'NETWORK_SET_DATA'
export const NETWORK_SET_STATE = 'NETWORK_SET_STATE'
export const NETWORK_SET_BLOCKCHAIN_HEIGHT = 'NETWORK_SET_BLOCKCHAIN_HEIGHT'

const BLOCKCHAIN_NETWORK_TYPES = ['ethereum']

const initialState = () => ({
  availableNetworks: [],
  networkMap: {},
  networkStateMap: {},
  initialized: false,
})

const getters = {
  blockchains: state =>
    Object.values(state.networkMap).filter(network =>
      BLOCKCHAIN_NETWORK_TYPES.includes(network.type)
    ),
  chainsById: (_, getters) =>
    getters.blockchains.reduce(
      (acc, chain) => Object.assign({[chain.chain_id]: chain}, acc),
      {}
    ),
  chainsByUrl: (_, getters) =>
    getters.blockchains.reduce((acc, chain) => Object.assign({[chain.url]: chain}, acc), {}),
  getChainData: (_, getters) => chainId => getters.chainsById[chainId],
  getChainState: (state, getters) => chainId => {
    const chainData = getters.chainsById[chainId]
    return chainData && state.networkStateMap[chainData.id]
  },
  getNetworkData: state => networkId => state.networkMap[networkId],
  getNetworkState: state => networkId => state.networkStateMap[networkId],
  isOnline: state => networkId => {
    const networkState = state.networkStateMap[networkId]
    return networkState && networkState.online
  },
  isLoaded: state => state.initialized,
}

const actions = {
  fetchNetworks({commit}) {
    return client.getAvailableNetworks().then(({data}) => {
      commit(NETWORK_LOAD_LIST, data)
      return data
    })
  },
  getNetworkDetailedData({commit}, networkId) {
    return client.getNetwork(networkId).then(({data}) => {
      commit(NETWORK_SET_DATA, {networkId, data})
    })
  },
  updateBlockHeight({commit, getters}, {chainId, blockNumber}) {
    const chainData = getters.getChainData(chainId)
    const chainState = getters.getChainState(chainId)
    if (chainData && chainState) {
      commit(NETWORK_SET_BLOCKCHAIN_HEIGHT, {
        networkId: chainData.id,
        chainState: chainState,
        blockNumber,
      })
    }
  },
  fetchNetworkState({commit}, networkId) {
    return client.getNetworkStatus(networkId).then(({data}) => commit(NETWORK_SET_STATE, {networkId, data}))
  },
  initialize({commit, dispatch, getters}) {
    if (!getters.isLoaded) {
      return dispatch('fetchNetworks').then(data => {
        data.forEach(networkData => {
          dispatch('fetchNetworkState', networkData.id)
          dispatch('getNetworkDetailedData', networkData.id)
        })
        commit(NETWORK_SET_INITIALIZED)
      })
    }
  },
}

const mutations = {
  [NETWORK_SET_INITIALIZED](state) {
    state.initialized = true
  },
  [NETWORK_LOAD_LIST](state, data) {
    Vue.set(state, 'availableNetworks', data)
  },
  [NETWORK_SET_DATA](state, {networkId, data}) {
    const networkMap = {...state.networkMap}

    networkMap[networkId] = data
    Vue.set(state, 'networkMap', networkMap)
  },
  [NETWORK_SET_STATE](state, {networkId, data}) {
    const networkStateMap = {...state.networkStateMap}

    networkStateMap[networkId] = data

    Vue.set(state, 'networkStateMap', networkStateMap)
  },
  [NETWORK_SET_BLOCKCHAIN_HEIGHT](state, {networkId, chainState, blockNumber}) {
    const networkStateMap = {...state.networkStateMap}

    chainState.height = blockNumber

    networkStateMap[networkId] = chainState

    Vue.set(state, 'networkStateMap', networkStateMap)
  },
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations,
}
