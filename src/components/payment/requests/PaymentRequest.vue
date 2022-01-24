<template>
  <div class="payment-request">
    <div class="button-bar" v-if="hasMultipleRoutes">
      <button
        type="button"
        v-for="route in openRoutes"
        :value="route.type"
        :class="{
          active: !hasMultipleRoutes || route.type == (selectedRoute && selectedRoute.type),
        }"
        @click="selectRoute(route)"
        :key="route.type"
      >
        {{ routeDisplayName(route) }}
      </button>
    </div>

    <PaymentRoute
      v-for="route in openRoutes"
      :chain="chain"
      :route="route"
      :token="token"
      :amount="pendingAmountDue"
      :key="route.type"
      :selected="isSelectedRoute(route)"
    />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import TokenMixin from '../../../mixins/tokens'
import PaymentRoute from '../routing/PaymentRoute'

export default {
  name: 'payment-request',
  mixins: [TokenMixin],
  components: {
    PaymentRoute,
  },
  props: {
    paymentRequest: {
      type: Object,
    },
  },
  data() {
    return {
      selectedRoute: null,
    }
  },
  computed: {
    ...mapGetters('network', {getCurrentBlock: 'currentBlock'}),
    ...mapGetters('network', ['chainData']),
    ...mapGetters('checkout', ['pendingAmountDue']),
    hasMultipleRoutes() {
      return this.openRoutes.length > 1
    },
    token() {
      return this.tokensByUrl[this.paymentRequest.token]
    },
    chain() {
      return this.chainData(this.chainId)
    },
    chainId() {
      return this.getChainId(this.token)
    },
    openRoutes() {
      return this.paymentRequest
        ? this.paymentRequest.routes.filter(route => this.isOpenRoute(route))
        : []
    },
  },
  methods: {
    routeDisplayName(route) {
      return {
        blockchain: 'On-Chain',
        raiden: 'Raiden',
      }[route.type]
    },
    selectRoute(route) {
      this.selectedRoute = route
    },
    isSelectedRoute(route) {
      if (!this.selectedRoute) {
        return false
      }

      return route.type === this.selectedRoute.type
    },
    isOpenRoute(route) {
      if (route.type == 'blockchain') {
        return this.getCurrentBlock(this.chainId) <= route.expiration_block
      }
      return true
    },
  },
  mounted() {
    this.selectRoute(this.openRoutes.length >= 1 ? this.openRoutes[0] : null)
  },
}
</script>
