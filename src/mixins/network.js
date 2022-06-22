import {mapGetters, mapState} from 'vuex'

export const PaymentNetworkMixin = {
  computed: {
    ...mapState('network', ['availableNetworks']),
  }
}

export const BlockchainMixin = {
  computed: {
    ...mapGetters('network', ['blockchains', 'chainsById', 'getChainState']),
    chainId() {
      return this.chain.chain_id
    },
    chainState() {
      return this.getChainState(this.chainId)
    },
    currentBlock() {
      return this.chainState && this.chainState.height
    },
    synced() {
      return this.chainState && this.chainState.synced
    },
    online() {
      return this.chainState && this.chainState.online
    }
  }
}

export default {BlockchainMixin, PaymentNetworkMixin}
