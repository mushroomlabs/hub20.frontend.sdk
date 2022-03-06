import Vue from 'vue'

import client from '../api/raiden'

export const RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_SUCCESS = 'RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_SUCCESS'
export const RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_FAILURE = 'RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_FAILURE'
export const RAIDEN_FETCH_NODE_COLLECTION_SUCCESS = 'RAIDEN_FETCH_NODE_COLLECTION_SUCCESS'
export const RAIDEN_FETCH_NODE_COLLECTION_FAILURE = 'RAIDEN_FETCH_NODE_COLLECTION_FAILURE'
export const RAIDEN_FETCH_NODE_SUCCESS = 'RAIDEN_FETCH_NODE_SUCCESS'
export const RAIDEN_FETCH_NODE_FAILURE = 'RAIDEN_FETCH_NODE_FAILURE'
export const RAIDEN_FETCH_NODE_STATUS_SUCCESS = 'RAIDEN_FETCH_NODE_STATUS_SUCCESS'
export const RAIDEN_FETCH_NODE_STATUS_FAILURE = 'RAIDEN_FETCH_NODE_STATUS_FAILURE'
export const RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_SUCCESS = 'RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_SUCCESS'
export const RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_FAILURE = 'RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_FAILURE'
export const RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_SUCCESS = 'RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_SUCCESS'
export const RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_FAILURE = 'RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_FAILURE'
export const RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_SUCCESS = 'RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_SUCCESS'
export const RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_FAILURE = 'RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_FAILURE'


const initialState = () => ({
  raidenNodeMap: {},
  raidenStatusData: {},
  errors: [],
  channelDepositRequests: {},
  channelWithdrawalRequests: {},
  serviceDepositRequests: {},
  tokenNetworkMap: {}
})

const getters = {
  raidenNodesById: state => Object.values(state.raidenNodeMap).reduce((acc, raiden) => Object.assign({[raiden.id]: raiden}, acc), {}),
  raidenNodesByUrl: state => state.raidenNodeMap,
  raidenNodes: state => Object.values(state.raidenNodeMap),
  tokenNetworks: state => Object.values(state.tokenNetworkMap)
}

const mutations = {
  [RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_SUCCESS](state, tokenNetworks) {
    tokenNetworks.forEach(tokenNetwork => Vue.set(state.tokenNetworkMap, tokenNetwork.url, tokenNetwork))
  },
  [RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_FAILURE](state, error) {
    state.errors.push({type: RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_FAILURE, error})
  },
  [RAIDEN_FETCH_NODE_COLLECTION_SUCCESS](state, raidenNodes) {
    raidenNodes.forEach(raidenNode => Vue.set(state.raidenNodeMap, raidenNode.url, raidenNode))
  },
  [RAIDEN_FETCH_NODE_COLLECTION_FAILURE](state, error) {
    state.errors.push({type: RAIDEN_FETCH_NODE_COLLECTION_FAILURE, error})
  },
  [RAIDEN_FETCH_NODE_SUCCESS](state, raidenNode) {
    Vue.set(state.raidenNodeMap, raidenNode.url, raidenNode)
  },
  [RAIDEN_FETCH_NODE_FAILURE](state, error) {
    state.errors.push({type: RAIDEN_FETCH_NODE_FAILURE, error})
  },
  [RAIDEN_FETCH_NODE_STATUS_SUCCESS](state, raidenStatus) {
    Vue.set(state.raidenStatusData, raidenStatus.raiden, raidenStatus)
  },
  [RAIDEN_FETCH_NODE_STATUS_FAILURE](state, error) {
    state.errors.push({type: RAIDEN_FETCH_NODE_STATUS_FAILURE, error})
  },
  [RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_SUCCESS](state, depositData) {
    Vue.set(state.serviceDepositRequests, depositData.url, depositData)
  },
  [RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_FAILURE](state, error) {
    state.errors.push({type: RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_FAILURE, error})
  },
  [RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_SUCCESS](state, depositData) {
    Vue.set(state.channelDepositRequests, depositData.url, depositData)
  },
  [RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_FAILURE](state, error) {
    state.errors.push({type: RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_FAILURE, error})
  },
  [RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_SUCCESS](state, withdrawalData) {
    Vue.set(state.channelWithdrawalRequests, withdrawalData.url, withdrawalData)
  },
  [RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_FAILURE](state, error) {
    state.errors.push({type: RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_FAILURE, error})
  },
}


const actions = {
  fetchTokenNetworkList({commit}) {
    return client
      .getTokenNetworkList()
      .then(({data}) => commit(RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_SUCCESS, data))
      .catch((error) => commit(RAIDEN_FETCH_TOKEN_NETWORK_COLLECTION_FAILURE, error))
  },
  fetchNodeList({commit}) {
    return client
      .getRaidenList()
      .then(({data}) => commit(RAIDEN_FETCH_NODE_COLLECTION_SUCCESS, data))
      .catch((error) => commit(RAIDEN_FETCH_NODE_COLLECTION_FAILURE, error))
  },
  fetchNode({commit}, raidenId) {
    return client
      .getRaiden(raidenId)
      .then(({data}) => commit(RAIDEN_FETCH_NODE_SUCCESS, data))
      .catch((error) => commit(RAIDEN_FETCH_NODE_FAILURE, error))
  },
  fetchStatus({commit}, raidenId) {
    return client
      .getRaidenStatus(raidenId)
      .then(({data}) => commit(RAIDEN_FETCH_NODE_STATUS_SUCCESS, data))
      .catch((error) => commit(RAIDEN_FETCH_NODE_STATUS_FAILURE, error))
  },
  createUDCDepositRequest({commit}, {raiden, amount}) {
    return client
      .createServiceDepositRequest(raiden.id, amount)
      .then(({data}) => commit(RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_SUCCESS, data))
      .catch((error) => commit(RAIDEN_CREATE_SERVICE_DEPOSIT_REQUEST_FAILURE, error))
  },
  createChannelDepositRequest({commit}, {raiden, channel, amount}) {
    return client
      .createChannelDepositRequest(raiden.id, channel.id, amount)
      .then(({data}) => commit(RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_SUCCESS, data))
      .catch((error) => commit(RAIDEN_CREATE_CHANNEL_DEPOSIT_REQUEST_FAILURE, error))
  },
  createChannelWithdrawalRequest({commit}, {raiden, channel, amount}) {
    return client
      .createChannelWithdrawalRequest(raiden.id, channel.id, amount)
      .then(({data}) => commit(RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_SUCCESS, data))
      .catch((error) => commit(RAIDEN_CREATE_CHANNEL_WITHDRAWAL_REQUEST_FAILURE, error))
  },
}


export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations
}
