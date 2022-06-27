import Decimal from 'decimal.js-light'

import client from '../api/checkout'

import {
  CHECKOUT_STORE_SETUP_ERROR,
  CHECKOUT_STORE_SET_DATA,
  CHECKOUT_CHARGE_SETUP_ERROR,
  CHECKOUT_CHARGE_SET_DATA,
  CHECKOUT_SET_DATA,
  CHECKOUT_RESET,
  CHECKOUT_SET_PREFERRED_PAYMENT_NETWORK,
  CHECKOUT_WEBSOCKET_OPEN,
  CHECKOUT_WEBSOCKET_CLOSE,
} from './types'

const initialState = () => ({
  merchantStore: null,
  checkout: null,
  charge: null,
  websocket: null,
  supportsWebsocket: true,
  preferedPaymentNetwork: null,
  storeSetupError: null,
  chargeSetupError: null
})

const getters = {
  isLoaded: state => Boolean(state.merchantStore),
  isReady: (state, getters) => getters.isLoaded && Boolean(state.checkout),
  storeId: state => state.merchantStore && state.merchantStore.id,
  checkoutId: state => state.checkout && state.checkout.id,
  hasActiveConnection: state => state.websocket && state.websocket.readyState === WebSocket.OPEN,
  chargeCurrencyCode: state => state.charge && state.charge.currencyCode,
  chargeAmount: state => state.charge && Decimal(state.charge.amount).toNumber(),
  invoice: state => state.checkout && state.checkout.invoice,
  isExpired: state => Boolean(state.checkout && state.checkout.status === 'expired'),
  isOpen: state => Boolean(state.checkout && state.checkout.status === 'open'),
  isProcessing: state => Boolean(state.checkout && state.checkout.status === 'paid'),
  isFinalized: state =>
    Boolean(state.checkout) && ['expired', 'confirmed'].includes(state.checkout.status),
  acceptedTokens: state => state.merchantStore && state.merchantStore.accepted_currencies
}

const mutations = {
  [CHECKOUT_STORE_SET_DATA](state, storeData) {
    state.merchantStore = storeData
  },
  [CHECKOUT_CHARGE_SET_DATA](state, chargeData) {
    state.charge = chargeData
  },
  [CHECKOUT_SET_DATA](state, checkoutData) {
    state.checkout = checkoutData
  },
  [CHECKOUT_SET_PREFERRED_PAYMENT_NETWORK](state, paymentNetwork) {
    state.preferedPaymentNetwork = paymentNetwork
  },
  [CHECKOUT_STORE_SETUP_ERROR](state, error) {
    state.storeSetupError = error
  },
  [CHECKOUT_CHARGE_SETUP_ERROR](state, error) {
    state.chargeSetupError = error
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
  start({state, commit}, {token, tokenAmount, paymentNetwork}) {
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
