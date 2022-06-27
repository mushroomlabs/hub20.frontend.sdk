import {mapGetters, mapState} from 'vuex'

export const PaymentNetworkMixin = {
  computed: {
    ...mapState('network', ['availableNetworks', 'networkMap']),
    ...mapGetters('network', ['networksByUrl', 'getNetworkState']),
    networkId() {
      return this.network && this.network.id
    },
    networkState() {
      return this.networkId && this.getNetworkState(this.networkId)
    },
    synced() {
      return this.networkState && this.networkState.synced
    },
    online() {
      return this.networkState && this.networkState.online
    }
  }
}

export const BlockchainMixin = {
  computed: {
    ...mapGetters('network', ['blockchains', 'chainsById', 'getChainState']),
    chainId() {
      return this.network.chain_id
    },
    chainState() {
      return this.getChainState(this.chainId)
    },
    currentBlock() {
      return this.chainState && this.chainState.height
    },
  }
}

export default {BlockchainMixin, PaymentNetworkMixin}
