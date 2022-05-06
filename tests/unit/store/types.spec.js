import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

import {EVENT_TYPES} from '@/store'

describe('store types definition', () => {
  it('should provide EVENT_TYPES', () => {
    expect(typeof EVENT_TYPES).toBeDefined()
  })
})
