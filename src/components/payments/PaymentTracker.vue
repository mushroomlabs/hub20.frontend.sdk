<template>
  <div class="payment-tracker">
    <div v-if="paymentRequest.amount" class="amount-total">
      <span>Requested Amount: </span>
      <span class="amount-value">
        {{ paymentRequest.amount | formattedAmount(token) }}
      </span>
    </div>

    <div v-if="paymentRequest.amount" class="amount-due">
      <span>Pending Amount: </span>
      <span class="amount-value">{{ pendingAmountDue | formattedAmount(token) }}</span>
    </div>

    <div class="payments">
      <h5 v-if="hasPayments">Received Payments</h5>
      <ul v-if="hasPayments">
        <li
          :class="{confirmed: payment.confirmed}"
          v-for="payment in payments"
          :key="payment.id"
        >
          <span class="amount-value">{{
            payment.amount | formattedAmount(payment.currency)
          }}</span>
          <span class="identifier" :title="payment.identifier">{{ payment.identifier }}</span>
        </li>
      </ul>
      <span v-if="!hasPayments">Received payments will be listed here...</span>
    </div>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import TokenMixin from '../../mixins/tokens'

export default {
  mixins: [TokenMixin],
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
    token() {
      return this.getTokenByUrl(this.paymentRequest.token)
    },
    payments() {
      return this.paymentRequest.payments
    },
    hasPayments() {
      return this.payments.length > 0
    },
  },
}
</script>
