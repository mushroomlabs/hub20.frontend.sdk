<template>
<ul class="incoming-payments">
  <li
    v-for="payment in payments"
    :class="{confirmed: payment.confirmed}"
    :key="payment.id"
    >
    <span class="amount-value">{{
      payment.amount | formattedAmount(payment.currency)
      }}</span>
    <EtherscanLink class="identifier" v-if="payment.transaction" :transactionHash="payment.transaction" :networkId="payment.currency.chain_id" />
    <span v-if="!payment.transaction" class="identifier" :title="payment.identifier">{{ payment.identifier }}</span>
  </li>
</ul>
</template>

<script>
import TokenMixin from '../../../mixins/tokens'
import EtherscanLink from '../../EtherscanLink'

export default {
  name: "incoming-payment-list",
  mixins: [TokenMixin],
  components: {
    EtherscanLink
  },
  props: {
    payments: {
      type: Array,
    },
  }
}
</script>
