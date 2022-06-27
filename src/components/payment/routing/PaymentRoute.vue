<template>
<div class="payment-route" :class="{expired}">
  <div class="payment-route-details" :class="networkType">
    <dl class="payment-details-display" v-if="!showQrCode">
      <dt v-if="amount">Amount</dt>
      <dd v-if="amount">
        <ClipboardCopier :value="amount.toFixed()">
          {{ amount }} {{ token.symbol }}
        </ClipboardCopier>
      </dd>
      <dt>Address</dt>
      <dd>
        <ClipboardCopier :value="route.address">
          {{ route.address }}
        </ClipboardCopier>
      </dd>
      <dt v-if="!isBlockchainRoute">Payment Identifier</dt>
      <dd v-if="!isBlockchainRoute">
        <ClipboardCopier :value="route.identifier">
          {{ route.identifier }}
        </ClipboardCopier>
      </dd>
    </dl>

    <div class="qr-code-display" v-if="showQrCode">
      <span>Use QR Code</span>
      <QrCode :message="QrCodeMessage" />
    </div>

    <BlockchainPaymentRouteCountdown v-if="isBlockchainRoute" :route="route" />

    <button class="payment-route-display-toggle text" @click="toggleDisplay" v-if="showQrCode">
      Show Payment data as text
    </button>

    <button class="payment-route-display-toggle qrcode" @click="toggleDisplay" v-if="!showQrCode">
      Show QR code instead
    </button>

    <div v-if="hasWeb3 && token && isBlockchainRoute" class="web3-wallet-display">
      <span>Pay with Browser wallet</span>
      <Web3TransferButton
        :token="token"
        :amount="amount"
        :recipientAddress="route.address"
        />
    </div>

  </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
import Decimal from 'decimal.js-light'

import {PaymentNetworkMixin} from '../../../mixins/network'

import {toWei} from '../../../filters'
import QrCode from '../../QrCode'
import ClipboardCopier from '../../ClipboardCopier'
import Web3TransferButton from '../../web3/Web3TransferButton'

import BlockchainPaymentRouteCountdown from './BlockchainPaymentRouteCountdown'


export default {
  name: 'payment-route',
  mixins: [PaymentNetworkMixin],
  components: {
    ClipboardCopier,
    QrCode,
    BlockchainPaymentRouteCountdown,
    Web3TransferButton,
  },
  props: {
    route: {
      type: Object
    },
    token: {
      type: Object,
    },
    amount: {
      type: [Decimal, Object, Number],
      required: false
    },
  },
  watch: {
    expired(isExpired) {
      if (isExpired) {
        this.$emit('routeExpired', this.route)
      }
    }
  },
  data() {
    return {
      showQrCode: false
    }
  },
  computed: {
    ...mapGetters('web3', ['hasWeb3']),
    QrCodeMessage() {
      let text = `${this.networkType}:${this.route.address}`

      if (this.amount && this.token) {
        let weiAmount = toWei(this.amount, this.token)
        text.concat(`&value=${weiAmount}`)
      }
      return text
    },
    expired() {
      return this.route.is_expired
    },
    network() {
      return this.route && this.route.network && this.networksByUrl[this.route.network]
    },
    networkType() {
      return this.network && this.network.type
    },
    isBlockchainRoute() {
      return this.networkType === 'ethereum'
    },
    isRaidenRoute() {
      return this.networkType === 'raiden'
    }
  },
  methods: {
    toggleDisplay() {
      this.showQrCode = !this.showQrCode
    }
  },
  created() {

  }
}
</script>
