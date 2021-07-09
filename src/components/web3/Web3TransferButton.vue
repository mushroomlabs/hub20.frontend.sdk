<template>
  <div class="web3-transfer">
    <div class="amount-selector" v-if="!amount">
      <input
        v-model="transferAmount"
        type="number"
        placeholder="Select amount"
        :min="transferAmountMinimum"
        step="any"
      />
    </div>
    <button v-if="hasWeb3" :disabled="!transferAmount" @click="startTransfer()">
      <slot>Pay {{ token.code }} with wallet</slot>
    </button>
  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import {mapGetters, mapActions} from 'vuex'

export default {
  props: {
    token: {
      type: Object,
      required: true,
    },
    amount: {
      type: [Decimal, Object, Number],
      required: false,
    },
    recipientAddress: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      transferAmount: this.amount,
    }
  },
  computed: {
    ...mapGetters('web3', ['hasWeb3']),
    transferAmountMinimum() {
      return (10**(-1*this.token.decimals)).toFixed(this.token.decimals)
    },
  },
  methods: {
    ...mapActions('web3', ['makeTransfer', 'setAccount']),
    startTransfer() {
      return window.ethereum.request({method: 'eth_requestAccounts'})
        .then(accounts => this.setAccount(accounts.pop()))
        .then(() => this.makeTransfer({
          token: this.token,
          amount: Decimal(this.transferAmount),
          recipientAddress: this.recipientAddress,
        }))
    }
  }
}
</script>
