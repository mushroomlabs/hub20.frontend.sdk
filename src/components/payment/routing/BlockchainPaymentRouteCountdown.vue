<template>
  <div class="blockchain-route-countdown" :class="{synced, online, expired}">
    <BlockchainPaymentRouteCountdownCircle :route="route"/>
    <span class="status-message">
      {{ message }}
    </span>
  </div>
</template>

<script>
import {BlockchainMixin, PaymentNetworkMixin} from '../../../mixins/network'

import BlockchainPaymentRouteCountdownCircle from './BlockchainPaymentRouteCountdownCircle'

export default {
  name: 'blockchain-payment-route-countdown',
  mixins: [BlockchainMixin, PaymentNetworkMixin],
  components: {
    BlockchainPaymentRouteCountdownCircle,
  },
  props: {
    route: {
      type: Object,
    }
  },
  computed: {
    network() {
      return this.networksByUrl[this.route.network]
    },
    expired() {
      return this.currentBlock && this.currentBlock > this.route.expiration_block
    },
    blocksRemaining() {
      return this.currentBlock ? this.route.expiration_block - this.currentBlock : null
    },
    message() {
      if (this.expired) {
        return `This route has expired on block ${this.route.expiration_block}. DO NOT send any transfers`
      }

      if (!this.online) {
        return `Server lost connection with ${this.network.name}. Please wait until it is restored`
      }

      if (!this.synced) {
        return `Server is out of sync with ${this.network.name}. Payments might not be displayed here.`
      }

      return `Please complete your payment in the next ${this.blocksRemaining} blocks...`
    },
  },
}
</script>
