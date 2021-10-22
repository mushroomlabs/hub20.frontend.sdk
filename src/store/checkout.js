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
  handlers: null,
  charge: null,
  websocket: null,
})

const getters = {
  isLoaded: state => Boolean(state.merchantStore),
  isReady: (state, getters) => getters.isLoaded && Boolean(state.checkout),
  storeId: state => state.merchantStore && state.merchantStore.id,
  onCheckoutCanceled: state => state.handlers && state.handlers.onCheckoutCanceled,
  onCheckoutFinished: state => state.handlers && state.handlers.onCheckoutFinished,
  checkoutId: state => state.checkout && state.checkout.id,
  chargeCurrencyCode: state => state.charge && state.charge.currencyCode,
  chargeAmount: state => state.charge && state.charge.amount,
  externalIdentifier: state => state.charge && state.charge.externalIdentifier,
  payments: state => state.checkout && state.checkout.payments,
  paymentToken: (state, getters, _, rootGetters) => {
    let tokenUrl = state.checkout && state.checkout.token
    return tokenUrl && rootGetters['tokens/tokensByUrl'][tokenUrl]
  },
  tokenPayments: (state, getters) => {
    let token = getters.paymentToken
    return (
      (token &&
       getters.payments.filter(payment => payment.currency.address == token.address)) ||
      []
    )
  },
  totalAmountPaid: (state, getters) =>
    getters.payments.reduce((acc, payment) => acc + payment.amount, 0),
  isConfirmed: state => state.checkout && state.checkout.status === 'confirmed',
  isExpired: state => state.checkout && state.checkout.status === 'expired',
  isOpen: state => state.checkout && state.checkout.status === 'open',
  isProcessing: state => state.checkout && state.checkout.status === 'paid',
  isFinalized: state => state.checkout && ['expired', 'confirmed'].includes(state.checkout.status),
  tokenAmountDue: (state, getters, _, rootGetters) => token => {
    let exchangeRate = rootGetters['coingecko/exchangeRate'](token)
    let tokenAmount = getters.chargeAmount && getters.chargeAmount / exchangeRate
    return tokenAmount && Decimal(tokenAmount).toDecimalPlaces(token.decimals)
  },
  pendingAmountDue: (state, getters) => {
    if (!state.checkout) return null
    if (!state.checkout.amount) return null

    const received = getters.tokenPayments.reduce(
      (acc, payment) => acc.add(Decimal(payment.amount)),
      Decimal(0)
    )
    return Decimal(state.checkout.amount).minus(received)
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
  [CHECKOUT_SET_OPTIONAL_HANDLERS](state, options) {
    state.handlers = {
      onCheckoutFinished: options && options.onComplete,
      onCheckoutCanceled: options && options.onCancel,
    }
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
  startCheckout({commit, getters, state}, token) {
    let tokenAmount = getters.tokenAmountDue(token)

    return client
      .create({
        storeData: state.merchantStore,
        externalIdentifier: getters.externalIdentifier,
        token,
        tokenAmount,
      })
      .then(({data}) => {
        commit(CHECKOUT_SET_DATA, data)
      })
  },
  leaveCheckout({commit, getters, state}) {
    if (getters.onCheckoutCanceled) {
      getters.onCheckoutCanceled(state.checkout)
    }
    commit(CHECKOUT_RESET)
  },
  fetchCheckout({commit}, checkoutId) {
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
