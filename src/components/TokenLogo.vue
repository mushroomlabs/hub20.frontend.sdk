<template>
  <img :src="url" :alt="token.name" />
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import TokenMixin from '../mixins/tokens'

export default {
  name: 'token-logo',
  mixins: [TokenMixin],
  props: {
    token: Object,
  },
  computed: {
    url() {
      return this.tokenLogoByAddress(this.token.address)
    },
    ...mapGetters('coingecko', ['tokenLogoByAddress']),
  },
  methods: {
    ...mapActions('coingecko', ['fetchTokenLogoUrl']),
  },
  mounted() {
    this.fetchTokenLogoUrl(this.token)
  },
}
</script>
