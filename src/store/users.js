import client from '../api/users'

export const USERS_LOAD_SUCCESS = 'USERS_LOAD_SUCCESS'
export const USERS_LOAD_FAILURE = 'USERS_LOAD_FAILURE'

const initialState = () => ({
  users: [],
  error: null,
  initialized: false
})

const getters = {
  usersByUsername: state =>
    state.users.reduce((acc, user) => Object.assign({[user.username]: user}, acc), {}),
  usernames: state => state.users.map(user => user.username),
  isLoaded: state => state.initialized
}

const actions = {
  fetchUsers({commit, getters}) {
    if (!getters.isLoaded) {
      return client
        .getUserList()
        .then(({data}) => {
          commit(USERS_LOAD_SUCCESS, data)
        })
        .catch(error => commit(USERS_LOAD_FAILURE, error.response))
    }
  }
}

const mutations = {
  [USERS_LOAD_SUCCESS](state, data) {
    state.users = data
    state.error = null
  },
  [USERS_LOAD_FAILURE](state, error) {
    state.error = error
  }
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations
}
