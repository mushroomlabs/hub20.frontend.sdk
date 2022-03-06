import {mapActions, mapGetters, mapState} from 'vuex'

export const RaidenMixin = {
  props: {
    raiden: Object,
  },
  computed: {
    ...mapState('raiden', ['raidenStatusData']),
    ...mapGetters('network', ['chainsByUrl']),
    ...mapGetters('raiden', ['raidenNodesById', 'raidenNodesByUrl']),
    ...mapGetters('tokens', ['tokensByUrl', 'nativeTokensByChain']),
    raidenStatus() {
      return this.raidenStatusData[this.raiden.url]
    },
    raidenOperationsCosts() {
      return this.raidenStatus && this.raidenStatus.cost_estimates
    },
    chain() {
      return this.chainsByUrl[this.raiden.chain]
    },
    chainName() {
      return this.chain && this.chain.name
    },
    openChannels() {
      return this.raiden.channels.filter(channel => channel.status == 'opened')
    },
    serviceTokenUrl() {
      return this.raiden.service_deposit_balance && this.raiden.service_deposit_balance.token
    },
    serviceToken() {
      return this.serviceTokenUrl && this.tokensByUrl[this.serviceTokenUrl]
    },
    nativeToken() {
      return (
        (this.chain && this.nativeTokensByChain[this.chain.id]) ||
        Promise.resolve(this.fetchNativeToken(this.chain.id))
      )
    },
  },
  methods: {
    ...mapActions('raiden', {fetchRaidenNode: 'fetchNode', fetchRaidenStatus: 'fetchStatus'}),
    ...mapActions('tokens', ['fetchTokenByUrl', 'fetchNativeToken']),
    getChannelToken(channel) {
      return this.tokensByUrl[channel.token]
    },
  },
  created() {
    if (!this.serviceToken) {
      this.fetchTokenByUrl(this.serviceTokenUrl)
    }

    this.raiden.channels.forEach(channel => this.fetchTokenByUrl(channel.token))
  },
}

export default RaidenMixin
