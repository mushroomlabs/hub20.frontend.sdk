import {mapActions, mapGetters, mapState} from 'vuex'

import {formattedAmount} from '../filters'

export const TOKEN_NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const TokenMixin = {
  computed: {
    ...mapState('network', ['blockchains']),
    ...mapState('tokens', ['tokens']),
    ...mapGetters('network', ['chainData', 'chainState']),
    ...mapGetters('tokens', ['tokensByUrl', 'nativeToken']),
    tokenOptions() {
      return Object.values(this.tokensByUrl).map(token => ({
        value: token.url,
        text: `${token.name} / ${token.symbol} / ${token.address}`,
      }))
    },
  },
  filters: {formattedAmount},
  methods: {
    ...mapActions('tokens', ['fetchToken']),
    getChainId(token) {
      return token && token.network_id
    },
    getChain(token) {
      return token && this.chainData(token.network_id)
    },
    isTokenNative(token) {
      return token.address == TOKEN_NULL_ADDRESS
    }
  },
}

export default TokenMixin
