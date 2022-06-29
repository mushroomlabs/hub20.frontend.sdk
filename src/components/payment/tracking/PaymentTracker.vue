<template>
  <div class="payment-tracker">
    <PaymentList :payments="paymentRequest.payments" />
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import TokenMixin from '../../../mixins/tokens'

import PaymentList from './PaymentList'

export default {
  mixins: [TokenMixin],
  components: {
    PaymentList,
  },
  props: {
    paymentRequest: {
      type: Object,
    },
    pendingAmountDue: {
      type: [Decimal, Object, Number],
      required: false,
    },
  },
  computed: {
    hasPendingAmount() {
      return Boolean(this.pendingAmountDue) && this.pendingAmountDue > 0;
    },
    token() {
      return this.tokensByUrl[this.paymentRequest.token]
    },
  },
}
</script>
