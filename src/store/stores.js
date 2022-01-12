import stores from '../api/stores'

export const STORE_INITIALIZE = 'STORE_INITIALIZE'
export const STORE_COLLECTION_SET = 'STORE_COLLECTION_SET'
export const STORE_COLLECTION_SETUP_SUCCESS = 'STORE_COLLECTION_SETUP_SUCCESS'
export const STORE_COLLECTION_SETUP_FAILURE = 'STORE_COLLECTION_SETUP_FAILURE'
export const STORE_EDIT_BEGIN = 'STORE_EDIT_BEGIN'
export const STORE_EDIT_SET_NAME = 'STORE_EDIT_SET_NAME'
export const STORE_EDIT_SET_URL = 'STORE_EDIT_SET_URL'
export const STORE_EDIT_SET_WEBHOOK_URL = 'STORE_EDIT_SET_WEBHOOK_URL'
export const STORE_EDIT_SET_ACCEPTED_TOKENS = 'STORE_EDIT_SET_ACCEPTED_TOKENS'
export const STORE_EDIT_SUCCESS = 'STORE_EDIT_SUCCESS'
export const STORE_EDIT_FAILURE = 'STORE_EDIT_FAILURE'
export const STORE_RESET_STATE = 'STORE_RESET_STATE'


const initialStoreData = {
  name: '',
  site_url: '',
  accepted_currencies: []
}

const initialState = () => ({
  userStores: [],
  editingData: null,
  submissionErrors: null,
  fetchError: null,
  initialized: false
})

const getters = {
  stores: state => state.userStores,
  storesById: state =>
    state.userStores.reduce((acc, store) => Object.assign({[store.id]: store}, acc), {}),
  storeData: (_, getters) => storeId => getters.storesById[storeId],
  submissionErrorMessages: state => ({
    name: state && state.submissionErrors && state.submissionErrors.name && state.submissionErrors.name[0],
    siteUrl: state && state.submissionErrors && state.submissionErrors.site_url && state.submissionErrors.site_url[0],
    acceptedTokens: state && state.submissionErrors && state.submissionErrors.accepted_currencies && state.submissionErrors.accepted_currencies[0],
  }),
  isLoaded: state => state.initialized
}

const actions = {
  fetchStores({commit}) {
    return stores
      .getList()
      .then(({data}) => commit(STORE_COLLECTION_SET, data))
      .catch(error => commit(STORE_COLLECTION_SETUP_FAILURE, error.response))
  },
  updateStore({commit}, storeData) {
    return stores
      .update(storeData)
      .then(() => commit(STORE_EDIT_SUCCESS))
      .catch(error => commit(STORE_EDIT_FAILURE, error.response))
  },
  createStore({commit, dispatch}, storeData) {
    return stores
      .create(storeData)
      .then(() => commit(STORE_EDIT_SUCCESS))
      .then(() => dispatch('fetchStores'))
      .catch(error => commit(STORE_EDIT_FAILURE, error))
  },
  editStore({getters, commit}, storeId) {
    const isCached = storeId in getters.storesById
    const storeData = storeId ? getters.storesById[storeId] : initialStoreData
    const storeDataPromise =
      storeId && !isCached ? stores.get(storeId) : Promise.resolve({data: storeData})

    return storeDataPromise
      .then(({data}) => commit(STORE_EDIT_BEGIN, data))
      .catch(error => commit(STORE_EDIT_FAILURE, error))
  },
  removeStore({dispatch}, storeData) {
    return stores.remove(storeData.id).then(() => dispatch('fetchStores'))
  },
  initialize({commit, dispatch, getters}) {
    if (!getters.isLoaded) {
      return dispatch('fetchStores').then(() => commit(STORE_INITIALIZE))
    }
  },
  tearDown({commit}) {
    return commit(STORE_RESET_STATE)
  }
}

const mutations = {
  [STORE_INITIALIZE](state) {
    state.initialized = true
  },
  [STORE_COLLECTION_SETUP_FAILURE](state, error) {
    state.fetchError = error
  },
  [STORE_COLLECTION_SETUP_SUCCESS](state) {
    state.fetchError = null
  },
  [STORE_EDIT_BEGIN](state, storeData) {
    state.editingData = storeData || initialStoreData
  },
  [STORE_EDIT_SUCCESS](state) {
    state.submissionErrors = null
  },
  [STORE_EDIT_FAILURE](state, error) {
    state.submissionErrors = error.response.data
  },
  [STORE_EDIT_SET_NAME](state, name) {
    if (state.editingData) {
      state.editingData.name = name
    }
  },
  [STORE_EDIT_SET_URL](state, siteUrl) {
    if (state.editingData) {
      state.editingData.site_url = siteUrl
    }
  },
  [STORE_EDIT_SET_WEBHOOK_URL](state, webhookUrl) {
    if (state.editingData) {
      state.editingData.checkout_webhook_url = webhookUrl
    }
  },
  [STORE_EDIT_SET_ACCEPTED_TOKENS](state, acceptedTokens) {
    if (state.editingData) {
      state.editingData.accepted_currencies = acceptedTokens
    }
  },
  [STORE_COLLECTION_SET](state, data) {
    state.userStores = data
  },
  [STORE_RESET_STATE](state) {
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
