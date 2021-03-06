import Decimal from 'decimal.js-light'
import {v4 as uuidv4} from 'uuid'
import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'

import coingeckoModule from '@/store/coingecko'
import checkoutModule from '@/store/checkout'
import tokenModule from '@/store/tokens'

import {
  CHECKOUT_CHARGE_SET_DATA,
  CHECKOUT_SET_DATA,
  CHECKOUT_STORE_SET_DATA,
  TOKEN_FETCH_COLLECTION,
} from '@/store/types'

import {tokenList} from '../../fixtures/tokens'

const EXTERNAL_IDENTIFIER = 'CHECKOUT UNIT TEST'
const CURRENCY = 'USD'
const AMOUNT = Decimal('0.01')
const CHECKOUT_ID = uuidv4()
const SERVER_API = 'http://example.com'
const STORE_ID = 'deadbeef-dead-dead-dead-deadbeefbeef'
const ROUTE_ID = uuidv4()

const STORE_URL = `${SERVER_API}/stores/${STORE_ID}`
const WALLET_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const STARTING_BLOCK = 2700000

const CHECKOUT_URL = `${SERVER_API}/${CHECKOUT_ID}`
const ROUTE_URL = `${SERVER_API}/${CHECKOUT_ID}/routes/${ROUTE_ID}`

// pick a random token from the list
const TOKEN_URL = tokenList.map(token => token.url).sort(() => Math.random() - 0.5)[0]

const MERCHANT_STORE = {
  id: STORE_ID,
  url: STORE_URL,
  name: 'Test Shop',
  site_url: 'http://shop.example.com',
  public_key: '-----BEGIN PUBLIC KEY-----\n\n-----END PUBLIC KEY-----',
  accepted_currencies: tokenList.map(token => token.url),
}

const CHARGE_DATA = {
  amount: AMOUNT,
  currencyCode: CURRENCY,
  externalIdentifier: EXTERNAL_IDENTIFIER,
}

const CHECKOUT = {
  url: CHECKOUT_URL,
  id: CHECKOUT_ID,
  created: '1970-01-01T00:00:00.000000Z',
  expires_on: '1970-01-01T00:15:00.000000Z',
  store: STORE_ID,
  invoice: {
    token: TOKEN_URL,
    amount: AMOUNT.toNumber(),
    reference: EXTERNAL_IDENTIFIER,
  },
  routes: [
    {
      url: ROUTE_URL,
      checkout: CHECKOUT_URL,
      id: ROUTE_ID,
      network: 'blockchain',
      address: WALLET_ADDRESS,
      start_block: STARTING_BLOCK,
      expiration_block: STARTING_BLOCK + 100,
    },
  ],
  payments: [],
}

function createStoreConfig() {
  return {
    modules: {
      coingecko: coingeckoModule,
      tokens: tokenModule,
      checkout: checkoutModule,
    },
  }
}

describe('store', () => {
  let store

  beforeEach(() => {
    createLocalVue().use(Vuex)
    const storeConfig = createStoreConfig()
    store = new Vuex.Store(storeConfig)

    store.commit(`tokens/${TOKEN_FETCH_COLLECTION}`, tokenList)
    store.commit(`checkout/${CHECKOUT_STORE_SET_DATA}`, MERCHANT_STORE)
    store.commit(`checkout/${CHECKOUT_CHARGE_SET_DATA}`, CHARGE_DATA)
    store.commit(`checkout/${CHECKOUT_SET_DATA}`, CHECKOUT)
  })

  it('should be ready to accept payments', () => {
    expect(store.getters['checkout/isLoaded']).toBe(true)
  })

  it('should have a checkout', () => {
    expect(store.state.checkout).toBeTruthy()
  })

  it('checkout should have a token', () => {
    expect(store.state.checkout.checkout.invoice.token).toBe(TOKEN_URL)
  })

  it('should get token amount due', () => {
    expect(store.getters['tokens/tokensByUrl']).not.toBe(undefined)
  })
})
