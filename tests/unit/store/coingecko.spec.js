import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

import coingecko, {COINGECKO_FETCH_PLATFORM_COLLECTION} from '@/store/coingecko'
import coingeckoPlatformList from '../../__mocks__/coingecko/platforms.json'


function createStoreConfig() {
  return {
    modules: {
      coingecko
    }
  }
}

let store

beforeEach(() => {
  createLocalVue().use(Vuex)
  const storeConfig = createStoreConfig()
  store = new Vuex.Store(storeConfig)
})

describe('coigecko store module', () => {
  it('should load coingecko platforms', () => {
    store.commit(`coingecko/${COINGECKO_FETCH_PLATFORM_COLLECTION}`, coingeckoPlatformList)
    expect(store.state.coingecko.platforms.length).toBe(coingeckoPlatformList.length)
  })
})
