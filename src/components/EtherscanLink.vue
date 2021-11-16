<template>
  <a class="etherscan-link" :href="linkUrl" target="_blank">
    <slot>{{ resource }}</slot>
  </a>
</template>
<script>
export default {
  name: 'EtherscanLink',
  props: {
    address: {
      type: String,
      required: false,
    },
    transactionHash: {
      type: String,
      required: false,
    },
    token: {
      type: Object,
      required: false,
    },
    networkId: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    domain() {
      return {
        1: 'etherscan.io',
        3: 'ropsten.etherscan.io',
        4: 'rinkeby.etherscan.io',
        5: 'goerli.etherscan.io',
        42: 'kovan.etherscan.io',
      }[this.networkId]
    },
    linkUrl() {
      return `https://${this.domain}/${this.resourceType}/${this.resourceIdentifier}`
    },
    resourceType() {
      if (this.address) {
        return 'address'
      }

      if (this.transactionHash) {
        return 'tx'
      }

      if (this.token) {
        return 'token'
      }

      return null
    },
    resourceIdentifier() {
      if (this.address) {
        return this.address
      }

      if (this.transactionHash) {
        return this.transactionHash
      }

      if (this.token) {
        return this.token.address
      }

      return null
    },
    resource() {
      if (this.address) {
        return this.address
      }

      if (this.transactionHash) {
        return this.transactionHash
      }

      if (this.token) {
        return this.token.code
      }

      return null
    },
  },
}
</script>
