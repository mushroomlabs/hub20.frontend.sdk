import {mapActions, mapGetters, mapState} from 'vuex'

import {formattedAmount} from '../filters'

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'

export const TokenMixin = {
  computed: {
    ...mapState('network', ['availableNetworks']),
    ...mapGetters('network', ['blockchains', 'getChainData', 'getChainState']),
    ...mapGetters('tokens', ['tokens', 'tokenListsByUrl', 'tokensByUrl', 'nativeTokensByChain', 'usableNetworksForToken']),
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
    ...mapActions('tokens', ['fetchTokens', 'fetchNativeToken', 'fetchToken', 'fetchTokenById', 'fetchTokenByUrl', 'fetchTokenLists', 'fetchTokenNetworks']),
    getChainId(token) {
      return token && token.chain_id
    },
    getChain(token) {
      return token && this.getChainData(token.chain_id)
    },
    getNativeToken(token) {
      const chain = this.getChain(token)
      return this.isTokenNative(token) ? token : chain && this.tokensByUrl[chain.token]
    },
    isTokenNative(token) {
      return !('address' in token)
    },
    getLogoUrl(token) {

      // The token lists provide lots of logo URLs that are actual IPFS addresses.
      // We can not render these on the browser, unless the user has an extension
      // installed and/or we install js-ipfs core library, which will add significant
      // size to the bundle. For now, we just detect ipfs links and render them as
      // "normal" https ipfs.io gateway


      const logoURI = token && token.logoURI

      if (!logoURI) {
        return
      }

      const parsedUrl = new URL(logoURI)
      if (parsedUrl.protocol === 'ipfs:') {
        let identifier = parsedUrl.pathname.replace('//', '')
        return `https://ipfs.io/ipfs/${identifier}`
      }

      return logoURI
    }
  },
}

export default TokenMixin
