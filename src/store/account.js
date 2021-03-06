import Decimal from 'decimal.js-light'

import api from '../api/account'
import utils from './utils'

import {
  UPDATE_BALANCES_BEGIN,
  UPDATE_BALANCES_SUCCESS,
  UPDATE_BALANCES_FAILURE,
  UPDATE_CREDITS_BEGIN,
  UPDATE_CREDITS_SUCCESS,
  UPDATE_CREDITS_FAILURE,
  UPDATE_DEBITS_BEGIN,
  UPDATE_DEBITS_SUCCESS,
  UPDATE_DEBITS_FAILURE,
  SET_BALANCES,
  SET_CREDITS,
  SET_DEBITS,
  SET_PROFILE,
  ACCOUNT_SET_INITIALIZED,
  ACCOUNT_RESET_STATE,
} from './types'


const initialState = () => ({
  balances: [],
  credits: [],
  debits: [],
  profile: null,
  error: null,
  initialized: false
})

const getters = {
  hasAdminAccess: state => state.profile && state.profile.has_admin_access,
  openBalances: state =>
    state.balances.filter(balance =>
      Decimal(balance.amount)
        .abs()
        .gt(0)
    ),
  balancesByTokenUrl: state =>
    state.balances.reduce((acc, balance) => Object.assign({[balance.token]: balance}, acc), {}),
  transactions: state => utils.sortedByDate(state.credits.concat(state.debits)),
  tokenBalance: (_, getters) => token => {
    let balance = getters.balancesByTokenUrl[token.url]
    return balance ? Decimal(balance.amount) : Decimal(0)
  },
  isLoaded: state => state.initialized
}

const actions = {
  fetchBalances({commit}) {
    commit(UPDATE_BALANCES_BEGIN)
    return api
      .getBalances()
      .then(({data}) => commit(SET_BALANCES, data))
      .then(() => commit(UPDATE_BALANCES_SUCCESS))
      .catch(exc => commit(UPDATE_BALANCES_FAILURE, exc))
  },
  fetchCredits({commit}) {
    commit(UPDATE_CREDITS_BEGIN)
    return api
      .getCredits()
      .then(({data}) => commit(SET_CREDITS, data))
      .then(() => commit(UPDATE_CREDITS_SUCCESS))
      .catch(exc => commit(UPDATE_CREDITS_FAILURE, exc))
  },
  fetchDebits({commit}) {
    commit(UPDATE_DEBITS_BEGIN)
    return api
      .getDebits()
      .then(({data}) => commit(SET_DEBITS, data))
      .then(() => commit(UPDATE_DEBITS_SUCCESS))
      .catch(exc => commit(UPDATE_DEBITS_FAILURE, exc))
  },
  fetchProfileData({commit}) {
    return api.getAccountDetails().then(({data}) => commit(SET_PROFILE, data))
  },
  fetchAll({dispatch}) {
    dispatch('fetchBalances')
    dispatch('fetchCredits')
    dispatch('fetchDebits')
    dispatch('fetchProfileData')
  },
  initialize({commit, dispatch, getters}) {
    if (!getters.isLoaded) {
      return dispatch('fetchAll').then(() => commit(ACCOUNT_SET_INITIALIZED))
    }
  },
  refresh({dispatch}) {
    dispatch('fetchBalances')
    dispatch('fetchCredits')
    dispatch('fetchDebits')
  },
  tearDown({commit}) {
    commit(ACCOUNT_RESET_STATE)
  }
}

const mutations = {
  [UPDATE_BALANCES_BEGIN](state) {
    state.error = null
  },
  [SET_BALANCES](state, balances) {
    state.balances = balances
    state.error = null
  },
  [UPDATE_BALANCES_SUCCESS](state) {
    state.error = null
  },
  [UPDATE_BALANCES_FAILURE](state, exc) {
    state.balances = []
    state.error = exc
  },
  [UPDATE_CREDITS_BEGIN](state) {
    state.error = null
  },
  [SET_PROFILE](state, profileData) {
    state.profile = profileData
  },
  [SET_CREDITS](state, credits) {
    state.credits = credits
    state.error = null
  },
  [UPDATE_CREDITS_SUCCESS](state) {
    state.error = null
  },
  [UPDATE_CREDITS_FAILURE](state, exc) {
    state.credits = []
    state.error = exc
  },
  [UPDATE_DEBITS_BEGIN](state) {
    state.error = null
  },
  [SET_DEBITS](state, debits) {
    state.debits = debits
    state.error = null
  },
  [UPDATE_DEBITS_SUCCESS](state) {
    state.error = null
  },
  [UPDATE_DEBITS_FAILURE](state, exc) {
    state.debits = []
    state.error = exc
  },
  [ACCOUNT_SET_INITIALIZED](state) {
    state.initialized = true
  },
  [ACCOUNT_RESET_STATE](state) {
    Object.assign(state, initialState())
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters,
  actions,
  mutations
}
