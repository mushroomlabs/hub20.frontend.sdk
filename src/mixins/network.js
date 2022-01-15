import {mapGetters, mapState} from 'vuex'

export const BlockchainMixin = {
  props: {
    chain: {
      type: Object
    }
  },
  computed: {
    ...mapState('network', ['blockchains']),
    ...mapGetters('network', {
      getChainData: 'chainData',
      getChainState: 'chainState',
      getCurrentBlock: 'currentBlock'
    }),
    ...mapGetters('network', ['IsNodeSynced', 'IsNodeOnline']),
    chainId() {
      return this.chain.id
    },
    currentBlock() {
      return this.getCurrentBlock(this.chainId)
    },
    synced() {
      return this.IsNodeSynced(this.chainId)
    },
    online() {
      return this.IsNodeOnline(this.chainId)
    }
  }
}

export default BlockchainMixin
