import {v4 as uuidv4} from 'uuid'
import { shallowMount } from '@vue/test-utils'

import PaymentRequest from '@/components/payment/requests/PaymentRequest'
import {tokenList} from '../../fixtures/tokens'

const EPOCH_TIMESTAMP = '1970-01-01T00:00:00.000000Z'
const SERVER_API = 'http://example.com'

// pick a random token from the list
const TOKEN_URL = tokenList.map(token => token.url).sort(() => Math.random() - 0.5)[0]

const depositFactory = (values = {}) => {
  const DEPOSIT_ID = uuidv4()

  const DEPOSIT = {
    url: "`${SERVER_API}/my/deposits/${DEPOSIT_ID}",
    id: DEPOSIT_ID,
    token: TOKEN_URL,
    created: EPOCH_TIMESTAMP,
    routes: [],
    payments: [],
    status: "open"
  }

  return shallowMount(PaymentRequest, {propsData: {paymentRequest: DEPOSIT}})
}

describe('deposit', () => {
  it('should have proper class', () => {
    const wrapper = depositFactory()
    expect(wrapper.find('.payment-request').exists()).toBeTruthy()
  })
})
