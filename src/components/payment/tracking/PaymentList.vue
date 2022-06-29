<template>
<ul class="payments-received">
  <li
    v-for="payment in payments"
    :class="{confirmed: payment.confirmed}"
    :key="payment.id"
    >
    <details>
      <summary>
        <span class="amount-value">{{ payment.amount | formattedAmount(payment.currency)}}</span>
      </summary>
      <span class="payment-received">
        <span class="display-label">Received on: </span>
        <span class="display-value">{{ new Date(payment.created).toLocaleString() }}</span>
      </span>
      <span class="payment-identifier">
        <span class="display-label" :title="payment.identifier">Identifier: </span>
        <span class="display-value">{{ payment.identifier }}</span>
      </span>
    </details>
  </li>
</ul>
</template>

<script>
import TokenMixin from '../../../mixins/tokens'

export default {
  name: "payment-list",
  mixins: [TokenMixin],
  props: {
    payments: {
      type: Array,
    },
  }
}
</script>
