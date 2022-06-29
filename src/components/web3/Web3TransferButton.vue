<template>
  <div v-if="hasWeb3" class="web3-transfer">
    <div class="amount-selector" v-if="!amount">
      <span>Amount to deposit:</span>
      <input
        v-model="transferAmount"
        type="number"
        placeholder="Select amount"
        :min="transferAmountMinimum"
        step="any"
      />
    </div>
    <button @click="startTransfer()">
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
      const selectedAmount = this.transferAmount ? Decimal(this.transferAmount) : Decimal(0)
      return window.ethereum.request({method: 'eth_requestAccounts'})
        .then(accounts => this.setAccount(accounts.pop()))
        .then(() => this.makeTransfer({
          token: this.token,
          amount: selectedAmount,
          recipientAddress: this.recipientAddress,
        }))
      .catch((error) => console.error(error.message))
    }
  }
}
</script>
