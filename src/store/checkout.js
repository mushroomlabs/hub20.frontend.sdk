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
export const CHECKOUT_SET_PREFERRED_PAYMENT_NETWORK = 'CHECKOUT_SET_PREFERRED_PAYMENT_NETWORK'
export const CHECKOUT_WEBSOCKET_OPEN = 'CHECKOUT_WEBSOCKET_OPEN'
export const CHECKOUT_WEBSOCKET_CLOSE = 'CHECKOUT_WEBSOCKET_CLOSE'

const initialState = () => ({
  merchantStore: null,
  checkout: null,
  charge: null,
  websocket: null,
  supportsWebsocket: true,
  preferedPaymentNetwork: null
})

const getters = {
  isLoaded: state => Boolean(state.merchantStore),
  isReady: (state, getters) => getters.isLoaded && Boolean(state.checkout),
  storeId: state => state.merchantStore && state.merchantStore.id,
  checkoutId: state => state.checkout && state.checkout.id,
  hasActiveConnection: state => state.websocket && state.websocket.readyState === WebSocket.OPEN,
  chargeCurrencyCode: state => state.charge && state.charge.currencyCode,
  chargeAmount: state => state.charge && state.charge.amount,
  checkoutAmount: (_, getters) => getters.invoice && getters.invoice.amount,
  routes: state => state.checkout && state.checkout.routes,
  openRoutes: (_, getters) => getters.routes.filter(route => route.is_open),
  payments: state => (state.checkout && state.checkout.payments) || [],
  confirmedPayments: (_, getters) => getters.payments.filter(payment => payment.confirmed),
  invoice: state => state.checkout && state.checkout.invoice,
  paymentToken: (_, getters, __, rootGetters) => {
    const tokenUrl = getters.invoice && getters.invoice.token
    const tokenMap = rootGetters['tokens/tokensByUrl']
    return tokenUrl && tokenMap && tokenMap[tokenUrl]
  },
  totalAmountPaid: (state, getters) =>
    getters.payments.reduce((acc, payment) => acc + payment.amount, 0),
  totalAmountConfirmed: getters =>
    getters.confirmedPayments ? getters.confirmedPayments.reduce((acc, payment) => acc + payment.amount, 0) : 0,
  hasPartialPayment: (state, getters) => {
    return getters.totalAmountPaid > 0 && getters.totalAmountPaid < state.checkout.invoice.amount
  },
  isConfirmed: (_, getters) => getters.totalAmountConfired >= getters.checkoutAmount,
  isExpired: state => Boolean(state.checkout && state.checkout.status === 'expired'),
  isOpen: state => Boolean(state.checkout && state.checkout.status === 'open'),
  isProcessing: state => Boolean(state.checkout && state.checkout.status === 'paid'),
  isPaid: (_, getters) => Boolean(getters.tokenAmountDue) && getters.tokenAmountDue.lte(getters.totalAmountPaid),
  isFinalized: state =>
    Boolean(state.checkout) && ['expired', 'confirmed'].includes(state.checkout.status),
  tokenAmountDue: (_, getters) => {
    if (!getters.checkoutAmount) return null
    if (!getters.paymentToken) return null

    return Decimal(getters.checkoutAmount).toDecimalPlaces(getters.paymentToken.decimals)
  },
  pendingAmountDue: (_, getters) => {
    if (!getters.checkoutAmount) return null

    const received = Decimal(getters.totalAmountPaid)
    const dueAmount = Decimal(getters.checkoutAmount).minus(received)
    return dueAmount.gte(0) ? dueAmount : Decimal(0)
  },
  acceptedTokens: state => state.merchantStore && state.merchantStore.accepted_currencies
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
  [CHECKOUT_SET_PREFERRED_PAYMENT_NETWORK](state, paymentNetwork) {
    state.preferedPaymentNetwork = paymentNetwork
  },
  [CHECKOUT_RESET](state) {
    state.checkout = null

    if (state.websocket) {
      state.websocket.close()
      state.websocket = null
    }
  },
  [CHECKOUT_WEBSOCKET_OPEN](state, websocket) {
    state.websocket = websocket
  },
  [CHECKOUT_WEBSOCKET_CLOSE](state) {
    if (state.websocket) {
      state.websocket.close()
      state.websocket = null
    }
  },
}

const actions = {
  start({state, commit, getters}, {token, tokenAmount, paymentNetwork}) {
    commit(CHECKOUT_SET_PREFERRED_PAYMENT_NETWORK, paymentNetwork)

    return client
      .create({
        storeData: state.merchantStore,
        reference: state.charge && state.charge.reference,
        tokenAmount: Number(tokenAmount).toFixed(token.decimals),
        token,
      })
      .then(({data}) => commit(CHECKOUT_SET_DATA, data))
  },
  openNewRoute({dispatch, getters}, paymentNetwork) {
    const checkoutId = getters.checkoutId

    return client
      .createNewRoute(checkoutId, paymentNetwork)
      .then(() => dispatch('fetch', checkoutId))
  },
  reset({commit}) {
    commit(CHECKOUT_RESET)
  },
  openWebsocket({commit, rootGetters}, checkoutId) {
    const url = rootGetters['server/checkoutEventWebsocketUrl'](checkoutId)
    const ws = new WebSocket(url)
    commit(CHECKOUT_WEBSOCKET_OPEN, ws)
    return ws
  },
  closeWebsocket({commit}) {
    commit(CHECKOUT_WEBSOCKET_CLOSE)
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
