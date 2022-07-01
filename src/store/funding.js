import Vue from 'vue'

import client from '../api/funding'

import {
  FUNDING_DEPOSIT_FAILURE,
  FUNDING_DEPOSIT_LOADED,
  FUNDING_DEPOSIT_CREATED,
  FUNDING_DEPOSIT_LIST_LOADED,
  FUNDING_ROUTING_FAILURE,
  FUNDING_TRANSFER_CREATED,
  FUNDING_TRANSFER_LOADED,
  FUNDING_TRANSFER_FAILURE,
  FUNDING_TRANSFER_LIST_LOADED,
  FUNDING_RESET_STATE,
} from './types'

const initialState = () => ({
  depositMap: {},
  transferMap: {},
  errors: []
})


const getters = {
  deposits: state => Object.values(state.depositMap),
  depositsById: state => state.depositMap,
  depositsByToken: (_, getters) => token =>
    getters.deposits.filter(deposit => deposit.token == token.url),
  openDeposits: (_, getters) => getters.deposits.filter(deposit => deposit.status == 'open'),
  openDepositsByToken: (state, getters) => token =>
    getters.openDeposits.filter(deposit => deposit.token == token.url),
  transfers: state => Object.values(state.transferMap),
  transfersById: state => state.transferMap,
  transfersByToken: (_, getters) => token =>
    getters.transfers.filter(transfer => transfer.token == token.url),
  openTransfers: (_, getters) => getters.transfers.filter(transfer => transfer.status == 'scheduled'),
  openTransfersByToken: (state, getters) => token =>
    getters.openTransfers.filter(transfer => transfer.token == token.url),
}

const actions = {
  createDeposit({commit}, token) {
    return client
      .createDeposit(token)
      .then(({data}) => {
        commit(FUNDING_DEPOSIT_CREATED, data)
        return data
      })
      .catch(error => commit(FUNDING_DEPOSIT_FAILURE, error.response))
  },
  fetchDeposit({commit}, depositId) {
    return client
      .getDeposit(depositId)
      .then(({data}) => {
        commit(FUNDING_DEPOSIT_LOADED, data)
        return data
      })
      .catch(error => commit(FUNDING_DEPOSIT_FAILURE, error.response))
  },
  fetchDeposits({commit}) {
    return client
      .getDeposits()
      .then(({data}) => commit(FUNDING_DEPOSIT_LIST_LOADED, data))
      .catch(error => commit(FUNDING_DEPOSIT_FAILURE, error.response))
  },
  fetchOpenDeposits({commit}) {
    return client
      .getDeposits({open: true})
      .then(({data}) => commit(FUNDING_DEPOSIT_LIST_LOADED, data))
      .catch(error => commit(FUNDING_DEPOSIT_FAILURE, error.response))
  },
  createDepositRoute({commit, dispatch}, {deposit, network}) {
    return client
      .createRoute(deposit, network)
      .then(({data}) => {
        dispatch('fetchDeposit', deposit.id)
        return data
      })
      .catch(error => commit(FUNDING_ROUTING_FAILURE, error.response))
  },
  createTransfer({commit}, {payload, network}) {
    const {token, amount, ...params} = payload
    return client
      .scheduleTransfer(token, amount, network, params)
      .then(({data}) => {
        commit(FUNDING_TRANSFER_CREATED, data)
        return data
      })
      .catch(error => commit(FUNDING_TRANSFER_FAILURE, error))
  },
  fetchTransfers({commit}) {
    return client
      .getTransfers()
      .then(({data}) => commit(FUNDING_TRANSFER_LIST_LOADED, data))
      .catch(error => commit(FUNDING_TRANSFER_FAILURE, error))
  },
  fetchTransfer({commit}, transferId) {
    console.log('fetching transfer', transferId)
    return client
      .getTransfer(transferId)
      .then(({data}) => {
        commit(FUNDING_TRANSFER_LOADED, data)
        return data
      })
      .catch(error => commit(FUNDING_TRANSFER_FAILURE, error.response))
  },
  initialize({dispatch}) {
    dispatch('fetchDeposits')
    dispatch('fetchTransfers')
  },
  tearDown({commit}) {
    commit(FUNDING_RESET_STATE)
  }
}

const mutations = {
  [FUNDING_DEPOSIT_CREATED](state, depositData) {
    const depositMap = {...state.depositMap}
    depositMap[depositData.id] = depositData
    Vue.set(state, 'depositMap', depositMap)
  },
  [FUNDING_DEPOSIT_LOADED](state, depositData) {
    const depositMap = {...state.depositMap}
    depositMap[depositData.id] = depositData
    Vue.set(state, 'depositMap', depositMap)
  },
  [FUNDING_DEPOSIT_FAILURE](state, error) {
    state.errors.push(error.data)
  },
  [FUNDING_DEPOSIT_LIST_LOADED](state, depositList) {
    const depositMap = {...state.depositMap}

    depositList.forEach(deposit => depositMap[deposit.id] = deposit)
    Vue.set(state, 'depositMap', depositMap)
  },
  [FUNDING_ROUTING_FAILURE](state, error) {
    state.errors.push(error.data)
  },
  [FUNDING_TRANSFER_CREATED](state, transferData) {
    const transferMap = {...state.transferMap}
    transferMap[transferData.id] = transferData
    Vue.set(state, 'transferMap', transferMap)
  },
  [FUNDING_TRANSFER_LOADED](state, transferData) {
    const transferMap = {...state.transferMap}
    transferMap[transferData.id] = transferData
    Vue.set(state, 'transferMap', transferMap)
  },
  [FUNDING_TRANSFER_FAILURE](state, error) {
    state.errors.push(error)
  },
  [FUNDING_TRANSFER_LIST_LOADED](state, transferList) {
    const transferMap = {...state.transferMap}

    transferList.forEach(transfer => transferMap[transfer.id] = transfer)
    Vue.set(state, 'transferMap', transferMap)
  },
  [FUNDING_RESET_STATE](state) {
    Object.assign(state, initialState())
  }
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations
}
