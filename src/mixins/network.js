import {mapGetters, mapState} from 'vuex'

export const BlockchainMixin = {
  computed: {
    ...mapState('network', ['blockchains', 'chainStateMap']),
    ...mapGetters('network', ['chainsById', 'getChainState']),
    chainId() {
      return this.chain.id
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

export default BlockchainMixin
