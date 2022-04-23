<template>
  <div class="payment-request">
    <PaymentRoute
      v-for="route in openRoutes"
      :chain="chain"
      :route="route"
      :token="token"
      :amount="pendingAmountDue"
      :key="route.id"
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
    ...mapGetters('network', ['getChainData']),
    ...mapGetters('checkout', ['pendingAmountDue', 'paymentToken', 'openRoutes']),
    token() {
      return this.paymentToken
    },
    chain() {
      return this.getChainData(this.chainId)
    },
    chainId() {
      return this.getChainId(this.token)
    }
  },
  mounted() {

  },
}
</script>
