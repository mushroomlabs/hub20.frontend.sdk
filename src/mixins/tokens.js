import {mapActions, mapGetters, mapState} from 'vuex'

import {formattedAmount} from '../filters'

export const TOKEN_NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const TokenMixin = {
  computed: {
    ...mapState('network', ['blockchains']),
    ...mapState('tokens', ['tokens']),
    ...mapGetters('network', ['chainData', 'chainState']),
    ...mapGetters('tokens', ['tokenListsByUrl', 'tokensByUrl', 'nativeTokensByChain']),
    tokenOptions() {
      return Object.values(this.tokensByUrl).map(token => ({
        value: token.url,
        text: `${token.name} / ${token.symbol} / ${token.address}`,
      }))
    },
    tokenListOptions() {
      return Object.values(this.tokenListsByUrl).map(tokenList => ({
        value: tokenList.url,
        text: tokenList.name,
      }))
    },
  },
  filters: {formattedAmount},
  methods: {
    ...mapActions('tokens', ['fetchToken', 'fetchTokenLists']),
    getChainId(token) {
      return token && token.network_id
    },
    getChain(token) {
      return token && this.chainData(token.network_id)
    },
    getNativeToken(token) {
      return this.isTokenNative(token) ? token : this.nativeTokensByChain[this.getChainId(token)]
    },
    isTokenNative(token) {
      return token.address == TOKEN_NULL_ADDRESS
    }
  },
}

export default TokenMixin
