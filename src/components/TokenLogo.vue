<template>
  <img v-if="canDisplay && url" v-on:error="hide" class="token-logo" :src="url" :alt="altText" :title="altText" />
</template>

<script>
import TokenMixin from '../mixins/tokens'

export default {
  name: 'token-logo',
  mixins: [TokenMixin],
  props: {
    token: Object,
    defaultUrl: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      canDisplay: true
    }
  },
  computed: {
    url() {
      return this.getLogoUrl(this.token) || this.defaultUrl
    },
    altText() {
      return `${this.token.name} (${this.token.symbol})`
    }
  },
  methods: {
    hide() {
      this.canDisplay = false
    }
  }
}
</script>
