import api from '../api/auth'

import {
  ACTIVATION_BEGIN,
  ACTIVATION_CLEAR,
  ACTIVATION_FAILURE,
  ACTIVATION_SUCCESS,
  REGISTRATION_BEGIN,
  REGISTRATION_CLEAR,
  REGISTRATION_FAILURE,
  REGISTRATION_SUCCESS
} from './types'

const initialState = () => ({
  activationCompleted: false,
  activationError: null,
  activationLoading: false,
  registrationCompleted: false,
  registrationError: null,
  registrationLoading: false
})


const getters = {
  registrationErrorMessage: (_, getters) => getters.registrationErrors && getters.registrationErrors[0],
  registrationErrorResponse: state => (state.registrationError && state.registrationError.response.data) || {},
  registrationErrors: (_, getters) => getters.registrationErrorResponse.non_field_errors || [],
  registrationFieldError: (_, getters) => (fieldName) => {
    const errorList = getters.registrationErrorResponse[fieldName]
    return errorList && errorList[0]
  }
}

const mutations = {
    [ACTIVATION_BEGIN](state) {
      state.activationLoading = true
    },
    [ACTIVATION_CLEAR](state) {
      state.activationCompleted = false
      state.activationError = null
      state.activationLoading = false
    },
    [ACTIVATION_FAILURE](state, error) {
      state.activationError = error
      state.activationLoading = false
    },
    [ACTIVATION_SUCCESS](state) {
      state.activationCompleted = true
      state.activationError = null
      state.activationLoading = false
    },
    [REGISTRATION_BEGIN](state) {
      state.registrationLoading = true
      state.registrationError = null
    },
    [REGISTRATION_CLEAR](state) {
      state.registrationCompleted = false
      state.registrationError = null
      state.registrationLoading = false
    },
    [REGISTRATION_FAILURE](state, error) {
      state.registrationError = error
      state.registrationLoading = false
    },
    [REGISTRATION_SUCCESS](state) {
      state.registrationCompleted = true
      state.registrationError = null
      state.registrationLoading = false
    }
}

const actions = {
  createAccount({commit}, {username, password1, password2, email}) {
      commit(REGISTRATION_BEGIN)
      return api
        .createAccount(username, password1, password2, email)
        .then(({data}) => {
          commit(REGISTRATION_SUCCESS)
          return new Promise(resolve => resolve(data.key))
        })
        .catch((error) => {
          commit(REGISTRATION_FAILURE, error)
          throw error
        })
    },
    activateAccount({commit}, {key}) {
      commit(ACTIVATION_BEGIN)
      return api
        .verifyAccountEmail(key)
        .then(() => commit(ACTIVATION_SUCCESS))
        .catch((error) => commit(ACTIVATION_FAILURE, error))
    },
    clearRegistrationStatus({commit}) {
      commit(REGISTRATION_CLEAR)
    },
    clearActivationStatus({commit}) {
      commit(ACTIVATION_CLEAR)
    }
}

export default {
  namespaced: true,
  state: initialState(),
  actions,
  getters,
  mutations,
}
