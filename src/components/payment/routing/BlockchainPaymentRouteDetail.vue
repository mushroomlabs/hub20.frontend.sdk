<template>
  <div class="payment-route-detail blockchain">
    <dl class="payment-details-display" v-if="!showQrCode">
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

    <div class="qr-code-display" v-if="showQrCode">
      <span>Use QR Code</span>
      <QrCode :message="QrCodeMessage" />
    </div>

    <BlockchainPaymentRouteCountdown :route="route"/>

    <button class="payment-route-display-toggle text" @click="toggleDisplay" v-if="showQrCode">
      Show Payment data as text
    </button>

    <button class="payment-route-display-toggle qrcode" @click="toggleDisplay" v-if="!showQrCode">
      Show QR code instead
    </button>

    <div v-if="hasWeb3" class="web3-wallet-display">
      <span>Pay with Browser wallet</span>
      <Web3TransferButton
        :token="token"
        :amount="amount"
        :recipientAddress="route.address"
        />
    </div>

  </div>
</template>

<script>
import Decimal from 'decimal.js-light'
import {mapGetters} from 'vuex'

import {toWei} from '../../../filters'
import QrCode from '../../QrCode'
import ClipboardCopier from '../../ClipboardCopier'
import Web3TransferButton from '../../web3/Web3TransferButton'

import BlockchainPaymentRouteCountdown from './BlockchainPaymentRouteCountdown'

export default {
  components: {
    ClipboardCopier,
    QrCode,
    BlockchainPaymentRouteCountdown,
    Web3TransferButton,
  },
  props: {
    route: Object,
    amount: {
      type: Decimal,
      required: false,
    },
    token: Object,
  },
  data() {
    return {
      showQrCode: false
    }
  },
  computed: {
    ...mapGetters('web3', ['hasWeb3']),
    QrCodeMessage() {
      let text = `ethereum:${this.route.address}`

      if (this.amount && this.token) {
        let weiAmount = toWei(this.amount, this.token)
        text.concat(`&value=${weiAmount}`)
      }
      return text
    }
  },
  methods: {
    toggleDisplay() {
      this.showQrCode = !this.showQrCode
    }
  }
}
</script>
