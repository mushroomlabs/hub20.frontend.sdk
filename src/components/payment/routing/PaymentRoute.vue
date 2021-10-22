<template>
<div class="payment-route" :class="{selected, expired}">
  <div class="payment-advice">
    <slot>
      <p>To complete payment, send {{ token.code }} as requested below:</p>
    </slot>
  </div>

  <div class="payment-route-details">
    <BlockchainPaymentRouteDetail v-if="isBlockchainRoute" :route="route" :amount="amount" :token="token"/>
    <RaidenPaymentRouteDetail v-if="isRaidenRoute" :route="route" :amount="amount" :token="token" />
  </div>

  <div v-if="hasWeb3 && isBlockchainRoute" class="web3-wallet-display">
    <span>Pay with Browser wallet</span>
    <Web3TransferButton
      :token="token"
      :amount="amount"
      :recipientAddress="route.address"
      />
  </div>

  <div class="qr-code-display">
    <span>Use QR Code</span>
    <QrCode :message="QrCodeMessage" />
  </div>

</div>
</template>

<script>
import Decimal from 'decimal.js-light'
import {mapGetters} from 'vuex'

import {toWei} from '../../../filters'
import QrCode from '../../QrCode'

import Web3TransferButton from '../../web3/Web3TransferButton'

import BlockchainPaymentRouteDetail from './BlockchainPaymentRouteDetail'
import RaidenPaymentRouteDetail from './RaidenPaymentRouteDetail'

export default {
  components: {
    BlockchainPaymentRouteDetail,
    RaidenPaymentRouteDetail,
    QrCode,
    Web3TransferButton,
  },
  props: {
    route: {
      type: Object
    },
    token: {
      type: Object,
      required: false
    },
    amount: {
      type: [Decimal, Object, Number],
      required: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    expired(isExpired) {
      if (isExpired) {
        this.$emit('routeExpired', this.route)
      }
    }
  },
  computed: {
    ...mapGetters('network', ['currentBlock']),
    ...mapGetters('web3', ['hasWeb3']),
    QrCodeMessage() {
      let protocol = {
        blockchain: 'ethereum',
        raiden: 'ethereum'
      }[this.route.type]

      let text = `${protocol}:${this.route.address}`

      if (this.amount && this.token) {
        let weiAmount = toWei(this.amount, this.token)
        text.concat(`&value=${weiAmount}`)
      }
      return text
    },
    expired() {
      if (this.isBlockchainRoute) {
        return this.currentBlock > this.route.expiration_block
      }
      return false
    },
    isBlockchainRoute() {
      return this.route.type == 'blockchain'
    },
    isRaidenRoute() {
      return this.route.type == 'raiden'
    }
  }
}
</script>
