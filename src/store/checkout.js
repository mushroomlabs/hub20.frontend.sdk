import Decimal from 'decimal.js-light'

import client from '../api/checkout'

export const STORE_SET = 'STORE_SET'
export const STORE_SET_OPENED = 'STORE_SET_OPENED'
export const STORE_SET_CLOSED = 'STORE_SET_CLOSED'

export const CHARGE_SET_DATA = 'CHARGE_SET_DATA'
export const CHECKOUT_SET_DATA = 'CHECKOUT_SET_DATA'
export const CHECKOUT_SET_OPTIONAL_HANDLERS = 'CHECKOUT_SET_OPTIONAL_HANDLERS'
export const CHECKOUT_RESET = 'CHECKOUT_RESET'
export const CHECKOUT_SET_CANCELED = 'CHECKOUT_SET_CANCELED'
export const CHECKOUT_SET_PAYMENT_SENT = 'CHECKOUT_SET_PAYMENT_SENT'
export const CHECKOUT_SET_PAYMENT_RECEIVED = 'CHECKOUT_SET_PAYMENT_RECEIVED'
export const CHECKOUT_SET_PAYMENT_CONFIRMED = 'CHECKOUT_SET_PAYMENT_CONFIRMED'
export const CHECKOUT_SET_EXPIRED = 'CHECKOUT_SET_EXPIRED'
export const CHECKOUT_WEBSOCKET_OPEN = 'CHECKOUT_WEBSOCKET_OPEN'

const initialState = () => ({
  merchantStore: null,
  checkout: null,
  charge: null,
  websocket: null,
})

const getters = {
  isLoaded: state => Boolean(state.merchantStore),
  isReady: (state, getters) => getters.isLoaded && Boolean(state.checkout),
  storeId: state => state.merchantStore && state.merchantStore.id,
  checkoutId: state => state.checkout && state.checkout.id,
  chargeCurrencyCode: state => state.charge && state.charge.currencyCode,
  chargeAmount: state => state.charge && state.charge.amount,
  externalIdentifier: state => state.charge && state.charge.externalIdentifier,
  payments: state => (state.checkout && state.checkout.payments) || [],
  confirmedPayments: (_, getters) => getters.payments.filter(payment => payment.confirmed),
  paymentToken: (state, getters, _, rootGetters) => {
    let tokenUrl = state.checkout && state.checkout.token
    return tokenUrl && rootGetters['tokens/tokensByUrl'][tokenUrl]
  },
  tokenPayments: (state, getters) => {
    let token = getters.paymentToken
    return (
      (token && getters.payments &&
        getters.payments.filter(payment => payment.currency.address == token.address)) ||
      []
    )
  },
  totalAmountPaid: (state, getters) =>
    getters.payments ? getters.tokenPayments.reduce((acc, payment) => acc + payment.amount, 0) : 0,
  totalAmountConfirmed: getters =>
    getters.confirmedPayments ? getters.confirmedPayments.reduce((acc, payment) => acc + payment.amount, 0) : 0,
  hasPartialPayment: (state, getters) => {
    return getters.totalAmountPaid > 0 && getters.totalAmountPaid < state.checkout.amount
  },
  hasPartialConfirmation: (state, getters) => {
    return (
      getters.totalAmountConfirmed > 0 && getters.totalAmountConfirmed < state.checkout.amount
    )
  },
  isConfirmed: state => Boolean(state.checkout && state.checkout.status === 'confirmed'),
  isExpired: state => Boolean(state.checkout && state.checkout.status === 'expired'),
  isOpen: state => Boolean(state.checkout && state.checkout.status === 'open'),
  isProcessing: state => Boolean(state.checkout && state.checkout.status === 'paid'),
  isPaid: (_, getters) => Boolean(getters.tokenAmountDue) && getters.tokenAmountDue.lte(getters.totalAmountPaid),
  isFinalized: state =>
    Boolean(state.checkout) && ['expired', 'confirmed'].includes(state.checkout.status),
  tokenAmountDue: (state, getters) => {
    if (!state.checkout) return null
    if (!state.checkout.amount) return null

    return Decimal(state.checkout.amount).toDecimalPlaces(getters.paymentToken.decimals)
  },
  pendingAmountDue: (state, getters) => {
    if (!state.checkout) return null
    if (!state.checkout.amount) return null

    const received = getters.tokenPayments.reduce(
      (acc, payment) => acc.add(Decimal(payment.amount)),
      Decimal(0)
    )

    const dueAmount = Decimal(state.checkout.amount).minus(received)
    return dueAmount.gte(0) ? dueAmount : Decimal(0)
  },
  acceptedTokens: (state, getters, rootState) => {
    let allTokens = rootState.tokens.tokens
    let tokenUrls = state.merchantStore && state.merchantStore.accepted_currencies
    return tokenUrls && allTokens && allTokens.filter(t => tokenUrls.includes(t.url))
  },
}

const mutations = {
  [STORE_SET](state, storeData) {
    state.merchantStore = storeData
  },
  [CHARGE_SET_DATA](state, chargeData) {
    state.charge = chargeData
  },
  [CHECKOUT_SET_DATA](state, checkoutData) {
    state.checkout = checkoutData
  },
  [CHECKOUT_RESET](state) {
    state.checkout = null

    if (state.websocket) {
      state.websocket.close()
    }
  },
  [CHECKOUT_WEBSOCKET_OPEN](state, websocket) {
    state.websocket = websocket
  },
}

const actions = {
  start({state, commit, getters}, {token, tokenAmount}) {
    return client
      .create({
        storeData: state.merchantStore,
        externalIdentifier: getters.externalIdentifier,
        tokenAmount: Number(tokenAmount).toFixed(token.decimals),
        token,
      })
      .then(({data}) => {
        commit(CHECKOUT_SET_DATA, data)
      })
  },
  reset({commit}) {
    commit(CHECKOUT_RESET)
  },
  openWebsocket({commit, rootGetters}, checkoutId) {
    const url = rootGetters['server/checkoutEventWebsocketUrl'](checkoutId)
    return commit(CHECKOUT_WEBSOCKET_OPEN, new WebSocket(url))
  },
  fetch({commit}, checkoutId) {
    return client.fetch(checkoutId).then(({data}) => commit(CHECKOUT_SET_DATA, data))
  },
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations,
}
