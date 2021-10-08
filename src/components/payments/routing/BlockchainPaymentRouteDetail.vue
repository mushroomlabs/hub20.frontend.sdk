<template>
  <div class="payment-route-detail blockchain">
    <PaymentRouteBlockchainTimer
      :created_on="route.start_block"
      :expires_on="route.expiration_block"
    />
    <dl>
      <dt v-if="amount">Amount</dt>
      <dd v-if="amount">
        <ClipboardCopier :value="amount.toFixed()">
          {{ amount }} {{ token.code }}
        </ClipboardCopier>
      </dd>
      <dt>Address</dt>
      <dd>
        <ClipboardCopier :value="route.address">
          {{ route.address }}
        </ClipboardCopier>
      </dd>
    </dl>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import PaymentRouteBlockchainTimer from './PaymentRouteBlockchainTimer'
import ClipboardCopier from '../../ClipboardCopier'

export default {
  components: {
    ClipboardCopier,
    PaymentRouteBlockchainTimer,
  },
  props: {
    route: Object,
    amount: {
      type: Decimal,
      required: false,
    },
    token: Object,
  },
}
</script>
