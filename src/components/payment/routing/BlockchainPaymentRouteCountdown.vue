<template>
  <div class="blockchain-route-countdown" :class="{synced, online, expired}">
    <BlockchainPaymentRouteCountdownCircle :route="route" />
    <span class="status-message">
      {{ message }}
    </span>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import BlockchainPaymentRouteCountdownCircle from './BlockchainPaymentRouteCountdownCircle'

export default {
  name: 'blockchain-payment-route-countdown',
  components: {
    BlockchainPaymentRouteCountdownCircle,
  },
  props: {
    route: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters('network', {
      synced: 'ethereumSynced',
      online: 'ethereumOnline',
      currentBlock: 'currentBlock',
    }),
    expired() {
      return this.currentBlock > this.expires_on
    },
    blocksRemaining() {
      return this.currentBlock ? this.route.expiration_block - this.currentBlock : null
    },
    message() {
      if (this.expired) {
        return `This route has expired on block ${this.expires_on}. DO NOT send any transfers`
      }

      if (!this.online) {
        return `Server lost connection with ethereum network. Please wait until it is restored`
      }

      if (!this.synced) {
        return `Server is out of sync with ethererum network. Payments might not be displayed here.`
      }

      return `Please complete your payment in the next ${this.blocksRemaining} blocks...`
    },
  },
}
</script>
