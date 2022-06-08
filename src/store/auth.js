import auth from '../api/auth'

const TOKEN_STORAGE_KEY = 'token'
const USERNAME_STORAGE_KEY = 'username'

import {
  LOGIN_BEGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  AUTH_SET_USERNAME,
  AUTH_SET_TOKEN,
  AUTH_REMOVE_TOKEN,
  AUTH_REMOVE_USERNAME,
  AUTH_RESET_STATE
} from './types'

const initialState = () => ({
  authenticating: false,
  error: null,
  username: null,
  token: null
})

const getters = {
  isAuthenticated: state => !!state.token,
  loggedUsername: (state, getters) => getters.isAuthenticated && state.username,
  errorMessage: (_, getters) => getters.submissionErrors && getters.submissionErrors[0],
  submissionErrors: state => (state.error && state.error.response.data.non_field_errors) || []
}

const actions = {
  login({commit}, {username, password}) {
    commit(LOGIN_BEGIN)
    return auth
      .login(username, password)
      .then(({data}) => {
        commit(AUTH_SET_TOKEN, data.key)
        commit(AUTH_SET_USERNAME, username)
      })
      .then(() => commit(LOGIN_SUCCESS, username))
      .catch((error) => commit(LOGIN_FAILURE, error))
  },
  logout({commit}) {
    return auth
      .logout()
      .then(() => commit(LOGOUT))
      .finally(() => {
        commit(AUTH_REMOVE_TOKEN)
        commit(AUTH_REMOVE_USERNAME)
      })
  },
  initialize({commit}) {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)
    const username = localStorage.getItem(USERNAME_STORAGE_KEY)

    if (token) {
      commit(AUTH_SET_TOKEN, token)
    }

    if (username) {
      commit(AUTH_SET_USERNAME, username)
    }
  },
  tearDown({commit}) {
    commit(AUTH_RESET_STATE)
  }
}

const mutations = {
  [LOGIN_BEGIN](state) {
    state.authenticating = true
    state.error = null
  },
  [LOGIN_FAILURE](state, error) {
    state.authenticating = false
    state.error = error
  },
  [LOGIN_SUCCESS](state, username) {
    state.username = username
    state.error = null
  },
  [LOGOUT](state) {
    state.authenticating = false
    state.error = null
  },
  [AUTH_SET_TOKEN](state, token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    auth.setToken(token)
    state.token = token
  },
  [AUTH_REMOVE_TOKEN](state) {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    auth.removeToken()
    state.token = null
  },
  [AUTH_SET_USERNAME](state, username) {
    localStorage.setItem(USERNAME_STORAGE_KEY, username)
    state.username = username
  },
  [AUTH_REMOVE_USERNAME](state) {
    localStorage.removeItem(USERNAME_STORAGE_KEY)
    state.username = null
  },
  [AUTH_RESET_STATE](state) {
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
