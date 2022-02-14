import {mapActions, mapGetters, mapState} from 'vuex'

export const RaidenMixin = {
  props: {
    raiden: Object
  },
  computed: {
    ...mapState('raiden', ['raidenStatusData']),
    ...mapGetters('raiden', ['raidenNodesById', 'raidenNodesByUrl']),
    raidenStatus() {
      return this.raidenStatusData[this.raiden.url]
    },
    raidenOperationsCosts() {
      return this.raidenStatus && this.raidenStatus.cost_estimates
    }
  },
  methods: {
    ...mapActions('raiden', {fetchRaidenNode: 'fetchNode', fetchRaidenStatus: 'fetchStatus'})
  }
}

export default RaidenMixin
