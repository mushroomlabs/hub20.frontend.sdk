import client from '../api/audit'

export const AUDIT_FETCH_ACCOUNTING_REPORT_BEGIN = 'AUDIT_FETCH_ACCOUNTING_REPORT_BEGIN'
export const AUDIT_FETCH_ACCOUNTING_REPORT_FAILURE = 'AUDIT_FETCH_ACCOUNTING_REPORT_FAILURE'
export const AUDIT_FETCH_ACCOUNTING_REPORT_SUCCESS = 'AUDIT_FETCH_ACCOUNTING_REPORT_SUCCESS'
export const AUDIT_FETCH_WALLET_BALANCES_BEGIN = 'AUDIT_FETCH_WALLET_BALANCES_BEGIN'
export const AUDIT_FETCH_WALLET_BALANCES_FAILURE = 'AUDIT_FETCH_WALLET_BALANCES_FAILURE'
export const AUDIT_FETCH_WALLET_BALANCES_SUCCESS = 'AUDIT_FETCH_WALLET_BALANCES_SUCCESS'
export const AUDIT_RESET_STATE = 'AUDIT_RESET_STATE'


const getTokenBalance = (balanceList, token) => balanceList.filter(balance => balance.token == token.url).shift()

const initialState = () => ({
  loadingBooks: false,
  loadingWallets: false,
  accountingBooks: {},
  wallets: [],
  error: null
})

const getters = {
  treasuryBook: state => state.accountingBooks && state.accountingBooks.treasury,
  userBook: state => state.accountingBooks && state.accountingBooks.user_accounts,
  walletBook: state => state.accountingBooks && state.accountingBooks.wallets,
  raidenBook: state => state.accountingBooks && state.accountingBooks.raiden,
  externalAccountBook: state =>
    state.accountingBooks && state.accountingBooks.external_addresses,
  walletAddresses: state => state.wallets && Object.keys(state.wallets),
  walletBalances: state => (address, token) => {
    const walletBalances = state.wallets && state.wallets[address]
    return walletBalances && getTokenBalance(walletBalances, token)
  }
}

const actions = {
  fetchAccountingReport({commit}) {
    commit(AUDIT_FETCH_ACCOUNTING_REPORT_BEGIN)
    client
      .getAccountingReport()
      .then(({data}) => commit(AUDIT_FETCH_ACCOUNTING_REPORT_SUCCESS, data))
      .catch(exc => commit(AUDIT_FETCH_ACCOUNTING_REPORT_FAILURE, exc))
  },
  fetchWalletBalances({commit}) {
    commit(AUDIT_FETCH_WALLET_BALANCES_BEGIN)
    client
      .getWalletBalances()
      .then(({data}) => commit(AUDIT_FETCH_WALLET_BALANCES_SUCCESS, data))
      .catch(exc => commit(AUDIT_FETCH_WALLET_BALANCES_FAILURE, exc))
  },
  tearDown({commit}) {
    commit(AUDIT_RESET_STATE)
  }
}

const mutations = {
  [AUDIT_FETCH_ACCOUNTING_REPORT_BEGIN](state) {
    state.loadingBooks = true
  },
  [AUDIT_FETCH_ACCOUNTING_REPORT_SUCCESS](state, accountingBooksData) {
    state.loadingBooks = false
    state.accountingBooks = accountingBooksData
  },
  [AUDIT_FETCH_ACCOUNTING_REPORT_FAILURE](state, error) {
    state.loadingBooks = false
    state.error = error
  },
  [AUDIT_FETCH_WALLET_BALANCES_BEGIN](state) {
    state.loadingWallets = true
  },
  [AUDIT_FETCH_WALLET_BALANCES_SUCCESS](state, walletData) {
    state.loadingWallets = false
    state.wallets = walletData
  },
  [AUDIT_FETCH_WALLET_BALANCES_FAILURE](state, error) {
    state.loadingWallets = false
    state.error = error
  },
  [AUDIT_RESET_STATE](state) {
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
