export const EVENT_WEBSOCKET_OPEN = 'EVENT_WEBSOCKET_OPEN'
export const EVENT_WEBSOCKET_CLOSE = 'EVENT_WEBSOCKET_CLOSE'
export const EVENT_WEBSOCKET_SET_HANDLER = 'EVENT_WEBSOCKET_SET_HANDLER'
export const EVENT_RESET_STATE = 'EVENT_RESET_STATE'

export const EVENT_TYPES = {
  ETHEREUM_BLOCK_CREATED: 'ethereum.block.created',
  ETHEREUM_DEPOSIT_BROADCAST: 'ethereum.deposit.broadcast',
  DEPOSIT_RECEIVED: 'deposit.received',
  DEPOSIT_CONFIRMED: 'deposit.confirmed',
  ROUTE_EXPIRED: 'route.expired',
  PROVIDER_OFFLINE: 'provider.offline',
  PROVIDER_ONLINE: 'provider.online',
}


const initialState = () => ({
  websocket: null,
  messageHandler: null
})

const actions = {
  initialize({commit}, url) {
    const ws = new WebSocket(url)
    return commit(EVENT_WEBSOCKET_OPEN, ws)
  },
  setEventHandler({commit, state}, messageHandler) {
    if (state.websocket) {
      state.websocket.onmessage = messageHandler
    }
    return commit(EVENT_WEBSOCKET_SET_HANDLER, messageHandler)
  },
  tearDown({commit}) {
    return commit(EVENT_RESET_STATE)
  }
}

const mutations = {
  [EVENT_WEBSOCKET_OPEN](state, websocket) {
    state.websocket = websocket
  },
  [EVENT_WEBSOCKET_CLOSE](state) {
    state.websocket = null
  },
  [EVENT_WEBSOCKET_SET_HANDLER](state, handler) {
    state.messageHandler = handler
  },
  [EVENT_RESET_STATE](state) {
    if (state.websocket) {
      state.websocket.close()
    }
    Object.assign(state, initialState())
  }
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations
}
