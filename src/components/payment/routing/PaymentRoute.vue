<template>
<div class="payment-route" :class="{selected, expired}">
  <div class="payment-route-details">
    <BlockchainPaymentRouteDetail v-if="isBlockchainRoute" :route="route" :amount="amount" :token="token" :chain="chain" />
    <RaidenPaymentRouteDetail v-if="isRaidenRoute" :route="route" :amount="amount" :token="token" :chain="chain" />
  </div>
</div>
</template>

<script>
import Decimal from 'decimal.js-light'

import BlockchainMixin from '../../../mixins/network'

import BlockchainPaymentRouteDetail from './BlockchainPaymentRouteDetail'
import RaidenPaymentRouteDetail from './RaidenPaymentRouteDetail'


export default {
  name: 'payment-route',
  mixins: [BlockchainMixin],
  components: {
    BlockchainPaymentRouteDetail,
    RaidenPaymentRouteDetail,
  },
  props: {
    route: {
      type: Object
    },
    token: {
      type: Object,
      required: false
    },
    amount: {
      type: [Decimal, Object, Number],
      required: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    expired(isExpired) {
      if (isExpired) {
        this.$emit('routeExpired', this.route)
      }
    }
  },
  computed: {
    expired() {
      if (this.isBlockchainRoute) {
        return this.currentBlock > this.route.expiration_block
      }
      return false
    },
    isBlockchainRoute() {
      return this.route.type == 'blockchain'
    },
    isRaidenRoute() {
      return this.route.type == 'raiden'
    }
  }
}
</script>
