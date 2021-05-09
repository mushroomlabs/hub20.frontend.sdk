import {mapGetters} from 'vuex'

import {formattedAmount} from '../filters'

export const TokenMixin = {
  computed: {
    ...mapGetters('tokens', ['tokensByAddress', 'tokensByUrl']),
    tokenOptions() {
      return Object.values(this.tokensByUrl).map(token => ({
        value: token.url,
        text: token.code
      }))
    }
  },
  filters: {formattedAmount},
  methods: {
    getTokenByAddress(tokenAddress) {
      return this.tokensByAddress[tokenAddress]
    },
    getTokenByUrl(tokenUrl) {
      return this.tokensByUrl[tokenUrl]
    }
  }
}

export default TokenMixin
