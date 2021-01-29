import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

import {EVENT_TYPES} from '@/store'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('store', () => {
  it('should provide EVENT_TYPES', () => {
    expect(typeof EVENT_TYPES).toBeDefined()
  })
})
