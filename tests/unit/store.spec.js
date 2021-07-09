import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

import {EVENT_TYPES} from '@/store'

import coingeckoAPI from '@/api/coingecko'

import createStoreConfig from '../__mocks__/storeConfig'
import mockCoingeckoTokenList from '../__mocks__/coingecko/tokens.json'

let store

beforeEach(() => {
  createLocalVue().use(Vuex)
  const storeConfig = createStoreConfig()
  store = new Vuex.Store(storeConfig)
})

describe('store', () => {
  it('should load coingecko tokens', () => {

    let tokenList = mockCoingeckoTokenList.tokens

    store.commit('coingecko/EXCHANGE_RATE_SET_COINGECKO_LIST', tokenList)
    expect(store.state['coingecko/tokens']).toBe(tokenList)
  })

  it('should provide EVENT_TYPES', () => {
    expect(typeof EVENT_TYPES).toBeDefined()
  })
})
