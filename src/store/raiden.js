import client from '../api/raiden'

export const RAIDEN_LOAD_SUCCESS = 'RAIDEN_LOAD_SUCCESS'
export const RAIDEN_LOAD_FAILURE = 'RAIDEN_LOAD_FAILURE'


const initialState = () => ({
  raidenNodes: null,
  error: null
})


const mutations = {
  [RAIDEN_LOAD_SUCCESS](state, raidenNodes) {
    state.raidenNodes = raidenNodes
    state.error = null
  },
  [RAIDEN_LOAD_FAILURE](state, error) {
    state.raidenNodes = null
    state.error = error
  },
}


const actions = {
  fetch({commit}) {
    client.getRaidenList().then(({data}) => {
      commit(RAIDEN_LOAD_SUCCESS, data)
    }).catch((error) => commit(RAIDEN_LOAD_FAILURE, error))
  }
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  mutations
}
