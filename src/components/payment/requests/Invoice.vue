<template>
  <div class="invoice">
  <span class="reference">{{ paymentRequest.reference }}</span>
  </div>
</template>

<script>
  import Decimal from 'decimal.js-light'

import TokenMixin from '../../../mixins/tokens'

export default {
  name: 'invoice',
  mixins: [TokenMixin],
  props: {
    paymentRequest: {
      type: Object,
    }
  },
  computed: {
    routes() {
      return this.paymentRequest.routes || []
    },
    openRoutes() {
      return this.routes.filter(route => route.is_open)
    },
    payments() {
      return this.paymentRequest.payments || []
    },
    confirmedPayments() {
      return this.payments.filter(payment => payment.confirmed)
    },
    token() {
      return this.tokensByUrl[this.paymentRequest.token]
    },
    totalAmountPaid() {
      return this.payments.reduce((acc, payment) => acc + payment.amount, 0)
    },
    totalAmountConfirmed() {
      return this.confirmedPayments.reduce((acc, payment) => acc + payment.amount, 0)
    },
    totalAmountDue() {
      if (!this.paymentRequest.amount) {
        return null
      }

      if (!this.token) {
        return null
      }

      return Decimal(this.paymentRequest.amount).toDecimalPlaces(this.token.decimals)
    },
    totalAmountUnpaid() {
      if (!this.totalAmountDue) return null

      const received = Decimal(this.totalAmountPaid)
      const dueAmount = this.totalAmountDue.minus(received)
      return dueAmount.gte(0) ? dueAmount : Decimal(0)
    },
    hasPartialPayment() {
      return this.totalAmountPaid > 0 && this.totalAmountPaid < this.paymentRequest.amount
    },
    isConfirmed() {
      return this.totalAmountConfirmed >= this.paymentRequest.checkoutAmount
    },
    isPaid() {
      if (!this.paymentRequest.amount) {
        return this.payments.length > 0
      }
      return this.totalAmountDue && this.totalAmountDue.lte(this.totalAmountPaid)
    },
  },
}
</script>
